const mongoose = require('mongoose');
const { Client } = require('pg');

const mongoUri = 'mongodb://127.0.0.1:27017/openclaw_intelligence';
const pgConn = 'postgres://openclaw:iJkdDjn_R9WzzvoNQD3Mmrmv@127.0.0.1:5432/openclaw';

const ContactSchema = new mongoose.Schema({ firstName:String, lastName:String, email:String, company:String, size:String, message:String, createdAt:Date }, { collection: 'contacts' });
const SignupSchema = new mongoose.Schema({ firstName:String, lastName:String, email:String, company:String, website:String, industry:String, companySize:String, automationGoal:String, toolsConnected:[String], termsAccepted:Boolean, createdAt:Date }, { collection: 'signups' });
const OrderSchema = new mongoose.Schema({ orderId:String, plan:String, billingCycle:String, agents:[String], currency:String, subtotal:Number, vat:Number, total:Number, paymentMethod:String, firstName:String, lastName:String, email:String, company:String, vatNumber:String, country:String, city:String, createdAt:Date }, { collection: 'orders' });

const Contact = mongoose.model('Contact', ContactSchema);
const Signup = mongoose.model('Signup', SignupSchema);
const Order = mongoose.model('Order', OrderSchema);

(async () => {
  await mongoose.connect(mongoUri);
  const pg = new Client({ connectionString: pgConn });
  await pg.connect();

  const contacts = await Contact.find({}).lean();
  for (const c of contacts) {
    await pg.query(
      'INSERT INTO contacts (first_name,last_name,email,company,size,message,created_at) VALUES ($1,$2,$3,$4,$5,$6,$7) ON CONFLICT DO NOTHING',
      [c.firstName, c.lastName, c.email, c.company, c.size, c.message, c.createdAt || new Date()]
    );
  }

  const signups = await Signup.find({}).lean();
  for (const s of signups) {
    await pg.query(
      'INSERT INTO signups (first_name,last_name,email,company,website,industry,company_size,automation_goal,tools_connected,terms_accepted,created_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) ON CONFLICT DO NOTHING',
      [s.firstName, s.lastName, s.email, s.company, s.website, s.industry, s.companySize, s.automationGoal, s.toolsConnected || [], !!s.termsAccepted, s.createdAt || new Date()]
    );
  }

  const orders = await Order.find({}).lean();
  for (const o of orders) {
    await pg.query(
      'INSERT INTO orders (order_id,plan,billing_cycle,agents,currency,subtotal,vat,total,payment_method,first_name,last_name,email,company,vat_number,country,city,created_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17) ON CONFLICT (order_id) DO NOTHING',
      [o.orderId, o.plan, o.billingCycle, o.agents || [], o.currency, o.subtotal, o.vat, o.total, o.paymentMethod, o.firstName, o.lastName, o.email, o.company, o.vatNumber, o.country, o.city, o.createdAt || new Date()]
    );
  }

  await pg.end();
  await mongoose.disconnect();
  console.log('migrated', { contacts: contacts.length, signups: signups.length, orders: orders.length });
})();
