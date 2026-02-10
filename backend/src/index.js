require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const morgan = require('morgan');

const Contact = require('./models/Contact');

const app = express();
const PORT = process.env.PORT || 4010;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/openclaw_intelligence';

app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));

app.get('/api/health', (req, res) => {
  res.json({ ok: true, service: 'openclaw-intelligence' });
});

app.post('/api/contact', async (req, res) => {
  try {
    const { firstName, lastName, email, company, size, message } = req.body || {};
    if (!firstName || !lastName || !email || !message) {
      return res.status(400).json({ message: 'First name, last name, email, and message are required.' });
    }

    const contact = await Contact.create({
      firstName,
      lastName,
      email,
      company,
      size,
      message,
      createdAt: new Date()
    });

    return res.json({ ok: true, id: contact._id });
  } catch (err) {
    console.error('Contact submission error:', err);
    return res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

mongoose
  .connect(MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`OpenClaw Intelligence API running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Mongo connection error', err);
    process.exit(1);
  });
