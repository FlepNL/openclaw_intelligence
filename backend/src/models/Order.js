const mongoose = require('mongoose');

const AgentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true }
}, { _id: false });

const OrderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  plan: { type: String, required: true },
  billingCycle: { type: String, enum: ['monthly', 'annual'], default: 'monthly' },
  agents: { type: [AgentSchema], default: [] },
  currency: { type: String, default: 'EUR' },
  subtotal: { type: Number, default: 0 },
  vat: { type: Number, default: 0 },
  total: { type: Number, default: 0 },
  paymentMethod: { type: String },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  company: { type: String },
  vatNumber: { type: String },
  country: { type: String },
  city: { type: String },
  status: { type: String, default: 'created' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', OrderSchema);
