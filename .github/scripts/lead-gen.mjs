/**
 * Lead Generation Script
 * Searches Google Places for restaurants, extracts emails, sends cold outreach.
 * Runs daily at 6:30 PM IST via GitHub Actions.
 */

import { google } from 'googleapis';


// ── Config ─────────────────────────────────────────────────

const CITIES = [
  'New York, NY', 'Los Angeles, CA', 'Chicago, IL',
  'Houston, TX', 'Phoenix, AZ', 'Philadelphia, PA',
  'San Antonio, TX', 'San Diego, CA', 'Dallas, TX', 'San Jose, CA',
];

const CUISINES = ['Italian', 'Japanese', 'Mexican', 'Indian', 'French'];

const MIN_REVIEWS = 100;
const MIN_RATING = 4.0;

// ── Auth Helpers ───────────────────────────────────────────

function getOAuth2Client() {
  const client = new google.auth.OAuth2(
    process.env.GMAIL_CLIENT_ID,
    process.env.GMAIL_CLIENT_SECRET,
    'https://developers.google.com/oauthplayground'
  );
  client.setCredentials({ refresh_token: process.env.GMAIL_REFRESH_TOKEN });
  return client;
}

function getSheetsClient(auth) {
  return google.sheets({ version: 'v4', auth });
}

function getGmailClient(auth) {
  return google.gmail({ version: 'v1', auth });
}

// ── Google Places Search ───────────────────────────────────

async function searchRestaurants(city, cuisine) {
  const url = new URL('https://places.googleapis.com/v1/places:searchText');
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': process.env.GOOGLE_MAPS_API_KEY,
      'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,places.rating,places.userRatingCount,places.websiteUri,places.nationalPhoneNumber,places.id',
    },
    body: JSON.stringify({
      textQuery: `${cuisine} restaurants in ${city}`,
      maxResultCount: 20,
    }),
  });

  if (!response.ok) {
    console.error(`Places API error for ${city} ${cuisine}:`, response.statusText);
    return [];
  }

  const data = await response.json();
  return (data.places || []).filter(
    (place) => place.userRatingCount >= MIN_REVIEWS && place.rating >= MIN_RATING
  );
}

// ── Email Extraction (website scraping) ────────────────────

async function extractEmailFromWebsite(websiteUrl) {
  if (!websiteUrl) return null;
  try {
    const response = await fetch(websiteUrl, {
      signal: AbortSignal.timeout(8000),
      headers: { 'User-Agent': 'Mozilla/5.0' },
    });
    const html = await response.text();
    // Simple email regex extraction
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    const matches = html.match(emailRegex);
    if (!matches) return null;

    // Filter out common non-contact emails
    const contactEmail = matches.find(
      (e) =>
        !e.includes('.png') &&
        !e.includes('.jpg') &&
        !e.includes('.gif') &&
        !e.includes('.svg') &&
        !e.includes('@example.com') &&
        !e.includes('noreply') &&
        !e.includes('no-reply')
    );
    return contactEmail || null;
  } catch {
    return null;
  }
}

// ── MX Record Verification ─────────────────────────────────

async function verifyMxRecord(email) {
  // Note: In GitHub Actions, we attempt a basic DNS check
  // using a public DNS-over-HTTPS API
  const domain = email.split('@')[1];
  try {
    const response = await fetch(
      `https://dns.google/resolve?name=${domain}&type=MX`,
      { signal: AbortSignal.timeout(5000) }
    );
    const data = await response.json();
    return Array.isArray(data.Answer) && data.Answer.length > 0;
  } catch {
    return false;
  }
}

// ── Google Sheets Logging ──────────────────────────────────

async function logToSheets(sheets, sheetId, range, values) {
  await sheets.spreadsheets.values.append({
    spreadsheetId: sheetId,
    range,
    valueInputOption: 'USER_ENTERED',
    requestBody: { values },
  });
}

// ── Email Sending ──────────────────────────────────────────

function createTrackingPixel(leadEmail) {
  const backendUrl = process.env.BACKEND_URL || 'https://wip-demo.vercel.app';
  return `<img src="${backendUrl}/api/track/open?lead=${encodeURIComponent(leadEmail)}" width="1" height="1" style="display:none" />`;
}

function createClickLink(leadEmail, targetUrl) {
  const backendUrl = process.env.BACKEND_URL || 'https://wip-demo.vercel.app';
  return `${backendUrl}/api/track/click?lead=${encodeURIComponent(leadEmail)}&url=${encodeURIComponent(targetUrl)}`;
}

function buildEmailHtml(leadEmail, businessName) {
  const trackingPixel = createTrackingPixel(leadEmail);
  const portfolioLink = createClickLink(leadEmail, 'https://wip-demo.vercel.app');

  return `
<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
  <div style="max-width: 600px; margin: 0 auto; padding: 24px;">
    <p>Hi ${businessName || 'there'},</p>

    <p>I came across your restaurant and was impressed by the quality of your offerings. I specialize in building modern, cinematic websites for restaurants — think immersive 3D dining experiences, seamless reservation systems, and stunning visual storytelling.</p>

    <p>Would you be open to a quick chat about how we could help elevate your online presence?</p>

    <p style="margin: 32px 0;">
      <a href="${portfolioLink}" style="background: #d4a574; color: #0a0a0a; text-decoration: none; padding: 12px 28px; border-radius: 8px; font-weight: 600; display: inline-block;">
        View Our Work
      </a>
    </p>

    <p>Best regards,<br/>W.I.P Studios</p>

    <p style="font-size: 11px; color: #999; margin-top: 40px;">
      If you'd rather not receive future emails, reply with "unsubscribe" and I'll remove you immediately.
    </p>
  </div>
  ${trackingPixel}
</body>
</html>`;
}

async function sendEmail(gmail, to, businessName) {
  const subject = `Elevate ${businessName || 'your restaurant'}'s online presence`;
  const htmlBody = buildEmailHtml(to, businessName);
  const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString('base64')}?=`;

  const message = [
    `From: ${process.env.GMAIL_USER}`,
    `To: ${to}`,
    `Subject: ${utf8Subject}`,
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset=utf-8',
    '',
    htmlBody,
  ].join('\n');

  const encodedMessage = Buffer.from(message)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  try {
    await gmail.users.messages.send({
      userId: 'me',
      requestBody: { raw: encodedMessage },
    });
    return true;
  } catch (err) {
    console.error(`Failed to send email to ${to}:`, err.message);
    return false;
  }
}

// ── Main ───────────────────────────────────────────────────

async function main() {
  console.log('Starting lead generation...');
  const auth = getOAuth2Client();
  const sheets = getSheetsClient(auth);
  const gmail = getGmailClient(auth);
  const sheetId = process.env.SHEETS_ID;

  let totalLeads = 0;
  let totalSent = 0;

  for (const city of CITIES) {
    for (const cuisine of CUISINES) {
      console.log(`Searching ${cuisine} restaurants in ${city}...`);

      const places = await searchRestaurants(city, cuisine);
      console.log(`  Found ${places.length} matching places`);

      for (const place of places) {
        const email = await extractEmailFromWebsite(place.websiteUri);
        if (!email) continue;

        const mxValid = await verifyMxRecord(email);
        if (!mxValid) continue;

        // Log to Leads tab
        await logToSheets(sheets, sheetId, 'Leads!A:G', [[
          new Date().toISOString(),
          email,
          place.displayName?.text || 'Unknown',
          city,
          cuisine,
          place.websiteUri || '',
          place.nationalPhoneNumber || '',
        ]]);
        totalLeads++;

        // Send cold email
        const sent = await sendEmail(gmail, email, place.displayName?.text || '');
        if (sent) {
          await logToSheets(sheets, sheetId, 'Sent!A:E', [[
            new Date().toISOString(),
            email,
            place.displayName?.text || 'Unknown',
            'sent',
            city,
          ]]);
          totalSent++;
        }

        // Small delay to avoid rate limits
        await new Promise((r) => setTimeout(r, 1000));
      }
    }
  }

  console.log(`\n✅ Lead gen complete. ${totalLeads} leads found, ${totalSent} emails sent.`);
}

main().catch(console.error);
