const fs = require('fs');
const path = require('path');
const fetch = (...args) => import('node-fetch').then(({default: f}) => f(...args));

let tokenCache = { token: null, exp: 0 };

function loadConfig() {
  const cfgPath = process.env.SENDPULSE_OCI_CONFIG || path.join(__dirname, '..', 'sendpulse_oci.config.json');
  const raw = fs.readFileSync(cfgPath, 'utf8');
  return JSON.parse(raw);
}

async function getToken() {
  const now = Date.now();
  if (tokenCache.token && tokenCache.exp > now + 60000) return tokenCache.token;
  const cfg = loadConfig();
  const resp = await fetch('https://api.sendpulse.com/oauth/access_token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ grant_type: 'client_credentials', client_id: cfg.api_id, client_secret: cfg.api_secret })
  });
  const data = await resp.json();
  tokenCache.token = data.access_token;
  tokenCache.exp = now + (data.expires_in || 3600) * 1000;
  return tokenCache.token;
}

async function sendTemplate({ templateId, toEmail, toName, fromEmail, fromName, variables, attachments }) {
  const token = await getToken();
  const payload = {
    email: {
      from: { email: fromEmail, name: fromName || 'OpenClaw Intelligence' },
      to: [{ email: toEmail, name: toName || '' }],
      template: { id: Number(templateId), variables: variables || {} },
    }
  };
  if (attachments && attachments.length) {
    payload.email.attachments = attachments; // [{filename, content, type}]
  }
  const resp = await fetch('https://api.sendpulse.com/smtp/emails', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify(payload)
  });
  const data = await resp.json();
  return data;
}

module.exports = { loadConfig, sendTemplate };
