import { google } from 'googleapis';

const CITIES = [
  'New York, NY', 'Los Angeles, CA', 'Chicago, IL',
  'Houston, TX', 'Phoenix, AZ', 'Philadelphia, PA',
  'San Antonio, TX', 'San Diego, CA', 'Dallas, TX', 'San Jose, CA',
];

const INDUSTRIES = [
  { id: 'real_estate',  search: 'real estate agencies',   display: 'Real Estate' },
  { id: 'gyms',         search: 'gyms and fitness centers', display: 'Gym/Fitness' },
  { id: 'dental',       search: 'dental clinics',          display: 'Dental/Medical' },
  { id: 'hotels',       search: 'hotels',                  display: 'Hotel' },
  { id: 'auto_dealers', search: 'car dealerships',         display: 'Auto Dealer' },
  { id: 'salons',       search: 'hair salons and spas',    display: 'Salon/Spa' },
];

const MIN_REVIEWS = 50;
const MIN_RATING = 4.0;
const MAX_SENDS_PER_RUN = 20;

const INDUSTRY_EMAIL = {
  real_estate: {
    subject: (n) => `Modernize ${n || 'your real estate site'} with 3D virtual tours`,
    hook: (n) => `I came across ${n || 'your agency'} and noticed most real estate sites still rely on static photos. I build immersive 3D walkthroughs that let buyers explore properties from anywhere — and it doubles listing engagement.`,
  },
  gyms: {
    subject: (n) => `A 3D website that sells memberships for ${n || 'your gym'}`,
    hook: (n) => `I was checking out ${n || 'your fitness center'} — great spot. Most gym websites don't capture the energy of the space. I build interactive 3D virtual tours that show off your facility and convert visitors into members.`,
  },
  dental: {
    subject: (n) => `Give ${n || 'your practice'} a premium digital presence`,
    hook: (n) => `I saw ${n || 'your clinic'} online — having a modern website builds instant trust with new patients. I create 3D immersive sites with virtual consults, online booking, and that premium feel that sets you apart from competitors.`,
  },
  hotels: {
    subject: (n) => `Make ${n || 'your hotel'} unforgettable online`,
    hook: (n) => `I looked at ${n || 'your hotel'} — beautiful property. But photos alone don't capture the experience. I build 3D interactive tours that let guests explore rooms, amenities, and the vibe before they book.`,
  },
  auto_dealers: {
    subject: (n) => `Sell more cars with a 3D showroom for ${n || 'your dealership'}`,
    hook: (n) => `I was looking at ${n || 'your dealership'} — most car sites feel like a catalog. I build interactive 3D showrooms where customers can walk around every vehicle, explore features, and start the buying process without stepping foot on the lot.`,
  },
  salons: {
    subject: (n) => `A website as stunning as ${n || 'your salon'}`,
    hook: (n) => `I checked out ${n || 'your salon'} — your work speaks for itself. I create 3D immersive websites with online booking, service menus, and virtual tours that make potential clients book before they even walk in.`,
  },
};

const PRICING_LINE = `Pricing starts at $299 for a complete site — built in 2 days with 1 year of free updates.`;

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

async function searchPlaces(city, industry) {
  const url = new URL('https://places.googleapis.com/v1/places:searchText');
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': process.env.GOOGLE_MAPS_API_KEY,
      'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,places.rating,places.userRatingCount,places.websiteUri,places.nationalPhoneNumber,places.id',
    },
    body: JSON.stringify({
      textQuery: `${industry.search} in ${city}`,
      maxResultCount: 20,
    }),
  });

  if (!response.ok) {
    console.error(`Places API error for ${city} ${industry.display}:`, response.statusText);
    return [];
  }

  const data = await response.json();
  return (data.places || []).filter(
    (place) => (place.userRatingCount || 0) >= MIN_REVIEWS && (place.rating || 0) >= MIN_RATING
  );
}

async function extractEmailFromWebsite(websiteUrl) {
  if (!websiteUrl) return null;
  try {
    const response = await fetch(websiteUrl, {
      signal: AbortSignal.timeout(8000),
      headers: { 'User-Agent': 'Mozilla/5.0' },
    });
    const html = await response.text();
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    const matches = html.match(emailRegex);
    if (!matches) return null;

    return matches.find(
      (e) =>
        !e.includes('.png') &&
        !e.includes('.jpg') &&
        !e.includes('.gif') &&
        !e.includes('.svg') &&
        !e.includes('@example.com') &&
        !e.includes('noreply') &&
        !e.includes('no-reply')
    ) || null;
  } catch {
    return null;
  }
}

async function verifyMxRecord(email) {
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

async function logToSheets(sheets, sheetId, range, values) {
  await sheets.spreadsheets.values.append({
    spreadsheetId: sheetId,
    range,
    valueInputOption: 'USER_ENTERED',
    requestBody: { values },
  });
}

function createTrackingPixel(leadEmail) {
  const backendUrl = process.env.BACKEND_URL || 'https://wip-demo-backend.onrender.com';
  return `<img src="${backendUrl}/api/track/open?lead=${encodeURIComponent(leadEmail)}" width="1" height="1" style="display:none" />`;
}

function createClickLink(leadEmail, targetUrl) {
  const backendUrl = process.env.BACKEND_URL || 'https://wip-demo-backend.onrender.com';
  return `${backendUrl}/api/track/click?lead=${encodeURIComponent(leadEmail)}&url=${encodeURIComponent(targetUrl)}`;
}

function buildEmailHtml(leadEmail, businessName, industryId) {
  const trackingPixel = createTrackingPixel(leadEmail);
  const portfolioLink = createClickLink(leadEmail, 'https://wip-demo.vercel.app');
  const emailData = INDUSTRY_EMAIL[industryId] || INDUSTRY_EMAIL.real_estate;

  return `
<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
  <div style="max-width: 600px; margin: 0 auto; padding: 24px;">
    <p>Hi there,</p>

    <p>${emailData.hook(businessName)}</p>

    <p>${PRICING_LINE}</p>

    <p style="margin: 32px 0;">
      <a href="${portfolioLink}" style="background: #d4a574; color: #0a0a0a; text-decoration: none; padding: 12px 28px; border-radius: 8px; font-weight: 600; display: inline-block;">
        See What I Build
      </a>
    </p>

    <p>Open to a quick 15-minute chat this week?</p>

    <p>Best regards,<br/>W.I.P Studios</p>

    <p style="font-size: 11px; color: #999; margin-top: 40px;">
      If you'd rather not receive future emails, reply with "unsubscribe" and I'll remove you immediately.
    </p>
  </div>
  ${trackingPixel}
</body>
</html>`;
}

async function sendEmail(gmail, to, businessName, industryId) {
  const emailData = INDUSTRY_EMAIL[industryId] || INDUSTRY_EMAIL.real_estate;
  const subject = emailData.subject(businessName);
  const htmlBody = buildEmailHtml(to, businessName, industryId);
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

async function getAlreadyContacted(sheets, sheetId) {
  try {
    const sentData = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: 'Sent!B:B',
    });
    const leadsData = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: 'Leads!B:B',
    });
    const sent = (sentData.data.values || []).map(r => r[0]).filter(Boolean);
    const leads = (leadsData.data.values || []).map(r => r[0]).filter(Boolean);
    return new Set([...sent, ...leads]);
  } catch {
    return new Set();
  }
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

async function main() {
  console.log('Starting lead generation...');
  const auth = getOAuth2Client();
  const sheets = getSheetsClient(auth);
  const gmail = getGmailClient(auth);
  const sheetId = process.env.SHEETS_ID;

  const alreadyContacted = await getAlreadyContacted(sheets, sheetId);
  console.log(`Already contacted: ${alreadyContacted.size} emails`);

  let totalLeads = 0;
  let totalSent = 0;

  const combinations = shuffle(
    CITIES.flatMap(city => INDUSTRIES.map(ind => ({ city, ind })))
  );

  for (const { city, ind } of combinations) {
    if (totalSent >= MAX_SENDS_PER_RUN) {
      console.log(`Reached max ${MAX_SENDS_PER_RUN} sends for this run. Stopping.`);
      break;
    }

    console.log(`Searching ${ind.display} in ${city}...`);
    const places = await searchPlaces(city, ind);
    console.log(`  Found ${places.length} matching places`);

    for (const place of places) {
      if (totalSent >= MAX_SENDS_PER_RUN) break;

      const email = await extractEmailFromWebsite(place.websiteUri);
      if (!email) continue;
      if (alreadyContacted.has(email)) continue;

      const mxValid = await verifyMxRecord(email);
      if (!mxValid) continue;

      alreadyContacted.add(email);

      await logToSheets(sheets, sheetId, 'Leads!A:H', [[
        new Date().toISOString(),
        email,
        place.displayName?.text || 'Unknown',
        ind.display,
        city,
        place.websiteUri || '',
        place.nationalPhoneNumber || '',
        place.rating || '',
      ]]);
      totalLeads++;

      const sent = await sendEmail(gmail, email, place.displayName?.text || '', ind.id);
      if (sent) {
        await logToSheets(sheets, sheetId, 'Sent!A:F', [[
          new Date().toISOString(),
          email,
          place.displayName?.text || 'Unknown',
          'sent',
          city,
          ind.display,
        ]]);
        totalSent++;
        console.log(`  ✓ Sent to ${email} (${ind.display})`);
      }

      await new Promise((r) => setTimeout(r, 1500));
    }
  }

  console.log(`\n✅ Lead gen complete. ${totalLeads} leads found, ${totalSent} emails sent.`);
}

main().catch((e) => { console.error('FATAL:', e); process.exit(1); });
