import express from 'express';
import cors from 'cors';
import { createTransport } from 'nodemailer';
import { google } from 'googleapis';
import dns from 'dns/promises';
import axios from 'axios';

const app = express();
app.use(cors());
app.use(express.json());

const GMAIL_USER = process.env.GMAIL_USER;
const GMAIL_CLIENT_ID = process.env.GMAIL_CLIENT_ID;
const GMAIL_CLIENT_SECRET = process.env.GMAIL_CLIENT_SECRET;
const GMAIL_REFRESH_TOKEN = process.env.GMAIL_REFRESH_TOKEN;
const SHEETS_ID = process.env.SHEETS_ID;
const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

const oauth2Client = new google.auth.OAuth2(
  GMAIL_CLIENT_ID,
  GMAIL_CLIENT_SECRET
);
oauth2Client.setCredentials({ refresh_token: GMAIL_REFRESH_TOKEN });

async function getGmailTransporter() {
  const { token } = await oauth2Client.getAccessToken();
  return createTransport({
    service: 'gmail',
    auth: { type: 'OAuth2', user: GMAIL_USER, accessToken: token }
  });
}

const sheets = google.sheets({ version: 'v4', auth: oauth2Client });

async function appendToSheet(tab, values) {
  await sheets.spreadsheets.values.append({
    spreadsheetId: SHEETS_ID,
    range: `${tab}!A:Z`,
    valueInputOption: 'RAW',
    requestBody: { values: [values] }
  });
}

async function findRowByEmail(tab, email) {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEETS_ID,
    range: `${tab}!A:Z`
  });
  const rows = res.data.values || [];
  return rows.findIndex(r => r[1] === email);
}

async function updateSheetRow(tab, rowIndex, values) {
  await sheets.spreadsheets.values.update({
    spreadsheetId: SHEETS_ID,
    range: `${tab}!A${rowIndex + 1}:Z${rowIndex + 1}`,
    valueInputOption: 'RAW',
    requestBody: { values: [values] }
  });
}

async function verifyMX(email) {
  try {
    const domain = email.split('@')[1];
    const records = await dns.resolveMx(domain);
    return records.length > 0;
  } catch { return false; }
}

async function searchRestaurants(city, cuisine) {
  const query = `${cuisine} restaurant ${city} USA`;
  const { data } = await axios.get('https://maps.googleapis.com/maps/api/place/textsearch/json', {
    params: { query, key: GOOGLE_MAPS_API_KEY }
  });
  return data.results?.slice(0, 10).map(r => ({
    name: r.name,
    address: r.formatted_address,
    place_id: r.place_id,
    rating: r.rating,
    reviews: r.user_ratings_total
  })) || [];
}

async function getPlaceDetails(placeId) {
  const { data } = await axios.get('https://maps.googleapis.com/maps/api/place/details/json', {
    params: {
      place_id: placeId,
      fields: 'website,formatted_phone_number',
      key: GOOGLE_MAPS_API_KEY
    }
  });
  return data.result;
}

async function extractEmailFromWebsite(url) {
  try {
    const { data: html } = await axios.get(url, { timeout: 8000 });
    const match = html.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}/i);
    return match ? match[0] : null;
  } catch { return null; }
}

async function sendColdEmail(lead, template) {
  const transporter = await getGmailTransporter();
  const trackingPixel = `${process.env.BACKEND_URL}/api/track/open?lead=${encodeURIComponent(lead.email)}`;
  const trackingLink = `${process.env.BACKEND_URL}/api/track/click?lead=${encodeURIComponent(lead.email)}&url=${encodeURIComponent(process.env.DEMO_URL)}`;

  const html = template
    .replace('{{name}}', lead.name)
    .replace('{{business}}', lead.business)
    .replace('{{city}}', lead.city)
    .replace('{{tracking_pixel}}', `<img src="${trackingPixel}" width="1" height="1" />`)
    .replace('{{demo_link}}', `<a href="${trackingLink}">${process.env.DEMO_URL}</a>`);

  await transporter.sendMail({
    from: `WIP Websites <${GMAIL_USER}>`,
    to: lead.email,
    subject: `Cinematic website for ${lead.business} in ${lead.city} — $299`,
    html
  });
}

async function runLeadGen() {
  const cities = ['Austin', 'Denver', 'Nashville', 'Portland', 'San Diego', 'Miami', 'Charlotte', 'Tampa', 'Phoenix', 'Dallas'];
  const cuisines = ['italian', 'mexican', 'japanese', 'farm-to-table', 'craft-cocktail'];

  const template = `
    <p>Hi {{name}},</p>
    <p>Saw {{business}} in {{city}} — great reviews, solid vibe.</p>
    <p>We build cinematic restaurant websites that actually convert: $299 (Starter), $499 (Growth), $999 (Premium).</p>
    <p>See our demo: {{demo_link}} {{tracking_pixel}}</p>
    <p>Best,<br>WIP Team</p>
  `;

  for (const city of cities) {
    for (const cuisine of cuisines) {
      const places = await searchRestaurants(city, cuisine);
      for (const place of places) {
        if ((place.reviews || 0) < 100 || (place.rating || 0) < 4.0) continue;

        const details = await getPlaceDetails(place.place_id);
        const website = details?.website;
        if (!website) continue;

        const email = await extractEmailFromWebsite(website);
        if (!email || !await verifyMX(email)) continue;

        const lead = {
          name: place.name.split(' ')[0],
          business: place.name,
          city,
          email,
          website,
          phone: details?.formatted_phone_number || '',
          cuisine,
          pricing_tier: 'starter'
        };

        await appendToSheet('Leads', [
          new Date().toISOString(),
          lead.email,
          lead.business,
          lead.city,
          lead.cuisine,
          lead.website,
          lead.phone,
          'pending'
        ]);

        try {
          await sendColdEmail(lead, template);
          await appendToSheet('Sent', [
            new Date().toISOString(),
            lead.email,
            lead.business,
            lead.city,
            'sent'
          ]);
        } catch (err) {
          console.error('Send failed:', err.message);
        }

        await new Promise(r => setTimeout(r, 2000));
      }
    }
  }
}

app.get('/api/health', (req, res) => res.json({ ok: true }));

app.get('/api/track/open', async (req, res) => {
  const { lead } = req.query;
  const row = await findRowByEmail('Sent', lead);
  if (row >= 0) {
    const current = await sheets.spreadsheets.values.get({ spreadsheetId: SHEETS_ID, range: `Sent!A${row+1}:Z${row+1}` });
    await updateSheetRow('Sent', row, [...current.data.values[0], 'opened']);
  }
  res.set('Content-Type', 'image/gif').send(Buffer.from('R0lGODlhAQABAPAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==', 'base64'));
});

app.get('/api/track/click', async (req, res) => {
  const { lead, url } = req.query;
  const row = await findRowByEmail('Sent', lead);
  if (row >= 0) {
    const current = await sheets.spreadsheets.values.get({ spreadsheetId: SHEETS_ID, range: `Sent!A${row+1}:Z${row+1}` });
    await updateSheetRow('Sent', row, [...current.data.values[0], 'clicked']);
  }
  res.redirect(url || process.env.DEMO_URL);
});

app.post('/api/webhook/gmail', async (req, res) => {
  const { message } = req.body;
  if (message) {
    const email = message.payload.headers.find(h => h.name === 'From')?.value;
    const row = await findRowByEmail('Sent', email);
    if (row >= 0) {
      const current = await sheets.spreadsheets.values.get({ spreadsheetId: SHEETS_ID, range: `Sent!A${row+1}:Z${row+1}` });
      await updateSheetRow('Sent', row, [...current.data.values[0], 'replied']);
      await appendToSheet('Replied', [new Date().toISOString(), email, message.snippet]);
    }
  }
  res.json({ ok: true });
});

export default app;
