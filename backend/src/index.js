require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const Stripe = require('stripe');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser');
const { Pool } = require('pg');
const { loadConfig, sendTemplate } = require('./sendpulse');

const app = express();
const PORT = process.env.PORT || 4010;

const DATABASE_URL = process.env.DATABASE_URL;
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const STRIPE_PUBLISHABLE_KEY = process.env.STRIPE_PUBLISHABLE_KEY;
const stripe = STRIPE_SECRET_KEY ? new Stripe(STRIPE_SECRET_KEY, { apiVersion: '2023-10-16' }) : null;

const pool = new Pool({ connectionString: DATABASE_URL });

app.use(cors({
  origin: [
    'https://openclawintelligence.com',
    'https://www.openclawintelligence.com',
    'http://localhost:4200',
    'http://localhost:5173'
  ],
  credentials: true
}));
app.use(express.json({ limit: '2mb' }));
app.use(morgan('dev'));
app.use(cookieParser());

app.get('/api/health', (req, res) => {
  res.json({ ok: true, service: 'openclaw-intelligence' });
});

function signToken(user) {
  return jwt.sign({ sub: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
}

function authRequired(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '') || req.cookies?.token;
  if (!token) return res.status(401).json({ ok: false, message: 'Unauthorized' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (err) {
    return res.status(401).json({ ok: false, message: 'Invalid token' });
  }
}


function adminRequired(req, res, next) {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ ok: false, message: 'Forbidden' });
  }
  next();
}

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ ok: false, message: 'Email and password required.' });
    const { rows } = await pool.query('SELECT * FROM users WHERE email = $1 LIMIT 1', [email.toLowerCase()]);
    const user = rows[0];
    if (!user) return res.status(401).json({ ok: false, message: 'Invalid credentials.' });
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ ok: false, message: 'Invalid credentials.' });
    const token = signToken(user);
    return res.json({ ok: true, token, user: { id: user.id, email: user.email, role: user.role, firstName: user.first_name, lastName: user.last_name, company: user.company } });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ ok: false, message: 'Server error.' });
  }
});

app.get('/api/auth/me', authRequired, async (req, res) => {
  const userId = req.user.sub;
  const { rows } = await pool.query('SELECT id,email,role,first_name,last_name,company,website,industry,company_size,phone FROM users WHERE id=$1', [userId]);
  if (!rows[0]) return res.status(404).json({ ok: false, message: 'User not found' });
  return res.json({ ok: true, user: rows[0] });
});

app.post('/api/auth/forgot', async (req, res) => {
  try {
    const { email } = req.body || {};
    if (!email) return res.status(400).json({ ok: false, message: 'Email required.' });
    const emailNorm = email.toLowerCase();
    const { rows } = await pool.query('SELECT id, email, first_name FROM users WHERE email=$1', [emailNorm]);
    const user = rows[0];
    // Always return ok to avoid enumeration
    if (user) {
      const code = String(Math.floor(100000 + Math.random() * 900000));
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
      await pool.query('INSERT INTO reset_tokens (email, code, expires_at) VALUES ($1,$2,$3)', [emailNorm, code, expiresAt]);

      const cfg = loadConfig();
      await sendTemplate({
        templateId: cfg.template_reset_code_id,
        toEmail: emailNorm,
        toName: user.first_name || '',
        fromEmail: cfg.from_email,
        fromName: 'OpenClaw Intelligence',
        variables: {
          email: emailNorm,
          reset_code: code,
          reset_url: 'https://openclawintelligence.com/login',
          privacy_url: 'https://openclawintelligence.com/privacy',
          terms_url: 'https://openclawintelligence.com/terms'
        }
      });
    }
    return res.json({ ok: true });
  } catch (err) {
    console.error('Forgot error:', err);
    return res.status(500).json({ ok: false, message: 'Server error.' });
  }
});

app.post('/api/auth/reset', async (req, res) => {
  try {
    const { email, code, newPassword } = req.body || {};
    if (!email || !code || !newPassword) return res.status(400).json({ ok: false, message: 'Missing fields.' });
    const emailNorm = email.toLowerCase();
    const { rows } = await pool.query('SELECT * FROM reset_tokens WHERE email=$1 AND code=$2 AND used_at IS NULL AND expires_at > now() ORDER BY created_at DESC LIMIT 1', [emailNorm, code]);
    const token = rows[0];
    if (!token) return res.status(400).json({ ok: false, message: 'Invalid or expired code.' });

    const passwordHash = await bcrypt.hash(newPassword, 12);
    await pool.query('UPDATE users SET password_hash=$1 WHERE email=$2', [passwordHash, emailNorm]);
    await pool.query('UPDATE reset_tokens SET used_at=now() WHERE id=$1', [token.id]);

    const cfg = loadConfig();
    await sendTemplate({
      templateId: cfg.template_password_reset_id,
      toEmail: emailNorm,
      toName: '',
      fromEmail: cfg.from_email,
      fromName: 'OpenClaw Intelligence',
      variables: {
        email: emailNorm,
        privacy_url: 'https://openclawintelligence.com/privacy',
        terms_url: 'https://openclawintelligence.com/terms'
      }
    });

    return res.json({ ok: true });
  } catch (err) {
    console.error('Reset error:', err);
    return res.status(500).json({ ok: false, message: 'Server error.' });
  }
});

app.post('/api/signup', async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      phone,
      company,
      website,
      industry,
      companySize,
      automationGoal,
      toolsConnected,
      termsAccepted
    } = req.body || {};

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ ok: false, message: 'First name, last name, email, and password are required.' });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const emailNorm = email.toLowerCase();

    await pool.query(
      'INSERT INTO users (email,password_hash,first_name,last_name,company,website,industry,company_size,phone,role) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) ON CONFLICT (email) DO NOTHING',
      [emailNorm, passwordHash, firstName, lastName, company, website, industry, companySize, phone, 'user']
    );

    await pool.query(
      'INSERT INTO signups (first_name,last_name,email,company,website,industry,company_size,automation_goal,tools_connected,terms_accepted,created_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,now())',
      [firstName, lastName, emailNorm, company, website, industry, companySize, automationGoal, toolsConnected || [], !!termsAccepted]
    );

    const cfg = loadConfig();
    if (cfg.template_signup_id) {
      await sendTemplate({
        templateId: cfg.template_signup_id,
        toEmail: emailNorm,
        toName: firstName,
        fromEmail: cfg.from_email,
        fromName: 'OpenClaw Intelligence',
        variables: {
          first_name: firstName,
          privacy_url: 'https://openclawintelligence.com/privacy',
          terms_url: 'https://openclawintelligence.com/terms'
        }
      });
    }

    return res.json({ ok: true });
  } catch (err) {
    console.error('Signup error:', err);
    return res.status(500).json({ ok: false, message: 'Server error. Please try again.' });
  }
});

app.post('/api/contact', async (req, res) => {
  try {
    const { firstName, lastName, email, company, size, message } = req.body || {};
    if (!firstName || !lastName || !email || !message) {
      return res.status(400).json({ message: 'First name, last name, email, and message are required.' });
    }

    const ticketRes = await pool.query('SELECT MAX(ticket_id) AS max_id FROM contacts');
    const nextTicket = Math.max(1000, (ticketRes.rows?.[0]?.max_id || 999) + 1);

    await pool.query(
      'INSERT INTO contacts (ticket_id,first_name,last_name,email,company,size,message,created_at) VALUES ($1,$2,$3,$4,$5,$6,$7,now())',
      [nextTicket, firstName, lastName, email, company, size, message]
    );

    const cfg = loadConfig();
    const vars = {
      ticket_id: String(nextTicket).padStart(4, '0'),
      first_name: firstName,
      last_name: lastName,
      email,
      company: company || '—',
      size: size || '—',
      message,
      dashboard_url: 'https://openclawintelligence.com',
      privacy_url: 'https://openclawintelligence.com/privacy',
      terms_url: 'https://openclawintelligence.com/terms'
    };

    if (cfg.template_contact_received_id) {
      await sendTemplate({
        templateId: cfg.template_contact_received_id,
        toEmail: email,
        toName: firstName,
        fromEmail: cfg.from_email,
        fromName: 'OpenClaw Intelligence',
        variables: vars
      });
    }

    if (cfg.template_contact_internal_id) {
      await sendTemplate({
        templateId: cfg.template_contact_internal_id,
        toEmail: 'support@openclawintelligence.com',
        toName: 'Support',
        fromEmail: cfg.from_email,
        fromName: 'OpenClaw Intelligence',
        variables: vars
      });
    }

    return res.json({ ok: true, ticket_id: String(nextTicket).padStart(4, '0') });
  } catch (err) {
    console.error('Contact submission error:', err);
    return res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

async function generateOrderId(pool) {
  const year = new Date().getFullYear();
  const prefix = `OCI-${year}-`;
  const res = await pool.query(
    "SELECT MAX(CAST(SPLIT_PART(order_id, '-', 3) AS INT)) AS max_id FROM orders WHERE order_id LIKE $1",
    [`${prefix}%`]
  );
  const maxId = res.rows?.[0]?.max_id || 0;
  const nextId = Math.max(1000, maxId + 1);
  return `${prefix}${nextId}`;
}

function buildIcs({ title, description, startIso, endIso, location }) {
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//OpenClaw Intelligence//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:REQUEST',
    'BEGIN:VEVENT',
    `UID:${Date.now()}@openclawintelligence.com`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g,'').split('.')[0]}Z`,
    `DTSTART:${startIso}`,
    `DTEND:${endIso}`,
    `SUMMARY:${title}`,
    `DESCRIPTION:${description}`,
    `LOCATION:${location || 'Online'}`,
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');
}

app.post('/api/order', async (req, res) => {
  try {
    const {
      plan,
      billingCycle,
      agents,
      currency,
      subtotal,
      vat,
      total,
      paymentMethod,
      firstName,
      lastName,
      email,
      company,
      vatNumber,
      country,
      city,
      meetingDate,
      meetingTime
    } = req.body || {};

    if (!firstName || !lastName || !email || !plan) {
      return res.status(400).json({ ok: false, message: 'First name, last name, email, and plan are required.' });
    }

    const orderId = await generateOrderId(pool);
    await pool.query(
      'INSERT INTO orders (order_id,plan,billing_cycle,agents,currency,subtotal,vat,total,payment_method,first_name,last_name,email,company,vat_number,country,city,meeting_date,meeting_time,created_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,now())',
      [orderId, plan, billingCycle, Array.isArray(agents) ? agents : [], currency, subtotal, vat, total, paymentMethod, firstName, lastName, email, company, vatNumber, country, city, meetingDate || null, meetingTime || null]
    );

    const cfg = loadConfig();
    const vars = {
      first_name: firstName,
      plan_name: plan,
      order_id: orderId,
      privacy_url: 'https://openclawintelligence.com/privacy',
      terms_url: 'https://openclawintelligence.com/terms'
    };

    let attachments = [];
    if (meetingDate && meetingTime) {
      const start = new Date(`${meetingDate}T${meetingTime}:00Z`);
      const end = new Date(start.getTime() + 60 * 60 * 1000);
      const fmt = (d) => d.toISOString().replace(/[-:]/g,'').split('.')[0] + 'Z';
      const ics = buildIcs({
        title: `OpenClaw ${plan} Meeting`,
        description: `Your ${plan} meeting with OpenClaw Intelligence.`,
        startIso: fmt(start),
        endIso: fmt(end),
        location: 'Online'
      });
      attachments.push({
        filename: 'meeting.ics',
        content: Buffer.from(ics).toString('base64'),
        type: 'text/calendar'
      });
    }

    if (cfg.template_service_booked_id) {
      await sendTemplate({
        templateId: cfg.template_service_booked_id,
        toEmail: email,
        toName: firstName,
        fromEmail: cfg.from_email,
        fromName: 'OpenClaw Intelligence',
        variables: vars,
        attachments
      });
    }

    return res.json({ ok: true, orderId });
  } catch (err) {
    console.error('Order submission error:', err);
    return res.status(500).json({ ok: false, message: 'Server error. Please try again.' });
  }
});

app.get('/api/dashboard/summary', authRequired, async (req, res) => {
  try {
    const userId = req.user.sub;
    const { rows: userRows } = await pool.query('SELECT first_name,last_name,company,email FROM users WHERE id=$1', [userId]);
    const user = userRows[0] || {};

    const { rows: orders } = await pool.query('SELECT * FROM orders WHERE email=$1 ORDER BY created_at DESC', [req.user.email]);

    const activeServices = orders.filter(o => o.plan && o.plan.toLowerCase().includes('retainer') || o.plan && o.plan.toLowerCase().includes('monthly'));
    const totalSpend = orders.reduce((sum, o) => sum + Number(o.total || 0), 0);

    const meetings = orders
      .filter(o => o.meeting_date && o.meeting_time)
      .map(o => ({
        title: o.plan || 'Meeting',
        date: o.meeting_date,
        time: o.meeting_time,
        status: 'Upcoming'
      }));

    return res.json({
      ok: true,
      user,
      stats: {
        activeServices: activeServices.length,
        totalOrders: orders.length,
        totalSpend
      },
      orders,
      meetings
    });
  } catch (err) {
    console.error('dashboard summary error', err);
    return res.status(500).json({ ok: false });
  }
});

// Admin endpoints
app.get('/api/admin/users', authRequired, adminRequired, async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT u.id,u.first_name,u.last_name,u.email,u.company,u.industry,u.company_size,u.created_at,
              COALESCE(SUM(o.total),0) AS total_spent
       FROM users u
       LEFT JOIN orders o ON o.email = u.email
       GROUP BY u.id
       ORDER BY u.created_at DESC
       LIMIT 200`
    );
    return res.json({ ok: true, users: rows });
  } catch (err) {
    console.error('admin users error', err);
    return res.status(500).json({ ok: false });
  }
});

app.get('/api/admin/contacts', authRequired, adminRequired, async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT ticket_id,first_name,last_name,email,company,size,message,created_at
       FROM contacts
       ORDER BY created_at DESC
       LIMIT 200`
    );
    return res.json({ ok: true, contacts: rows });
  } catch (err) {
    console.error('admin contacts error', err);
    return res.status(500).json({ ok: false });
  }
});

app.get('/api/stripe/config', (req, res) => {
  if (!STRIPE_PUBLISHABLE_KEY) {
    return res.status(503).json({ ok: false, message: 'Stripe not configured.' });
  }
  return res.json({ ok: true, publishableKey: STRIPE_PUBLISHABLE_KEY });
});

app.post('/api/stripe/payment-intent', async (req, res) => {
  if (!stripe) return res.status(503).json({ ok: false, message: 'Stripe not configured.' });
  try {
    const { amount, currency = 'eur', receipt_email, metadata } = req.body || {};
    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({ ok: false, message: 'Invalid amount.' });
    }

    const intent = await stripe.paymentIntents.create({
      amount: Number(amount),
      currency,
      receipt_email,
      automatic_payment_methods: { enabled: true },
      metadata: metadata || {}
    });

    return res.json({ ok: true, clientSecret: intent.client_secret });
  } catch (err) {
    console.error('Stripe payment intent error:', err);
    return res.status(500).json({ ok: false, message: 'Stripe error.' });
  }
});

app.listen(PORT, () => {
  console.log(`OpenClaw Intelligence API listening on ${PORT}`);
});
