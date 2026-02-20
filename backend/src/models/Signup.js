const mongoose = require('mongoose');

const SignupSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  company: { type: String },
  website: { type: String },
  industry: { type: String },
  companySize: { type: String },
  automationGoal: { type: String },
  toolsConnected: { type: [String], default: [] },
  termsAccepted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Signup', SignupSchema);
