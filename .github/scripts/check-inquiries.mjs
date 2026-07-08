import { google } from 'googleapis';
import { sendDiscord } from './discord.mjs';

function getOAuth2Client() {
  const client = new google.auth.OAuth2(
    process.env.GMAIL_CLIENT_ID,
    process.env.GMAIL_CLIENT_SECRET,
    'https://developers.google.com/oauthplayground'
  );
  client.setCredentials({ refresh_token: process.env.GMAIL_REFRESH_TOKEN });
  return client;
}

async function main() {
  console.log('Checking for client inquiry replies...');
  const auth = getOAuth2Client();
  const gmail = google.gmail({ version: 'v1', auth });
  const sheets = google.sheets({ version: 'v4', auth });
  const sheetId = process.env.SHEETS_ID;

  const inqData = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: 'Inquiries!A:E',
  });
  const rows = inqData.data.values || [];

  if (rows.length <= 1) {
    console.log('No inquiries found.');
    return;
  }

  let replyCount = 0;
  const updates = [];

  for (let i = 1; i < rows.length; i++) {
    const [timestamp, name, email, message, status] = rows[i];

    if (status === 'replied' || status === 'closed') continue;
    if (!email) continue;

    const query = `from:${email} in:inbox`;
    const res = await gmail.users.messages.list({
      userId: 'me',
      q: query,
      maxResults: 1,
    });

    if (res.data.messages && res.data.messages.length > 0) {
      const detail = await gmail.users.messages.get({
        userId: 'me',
        id: res.data.messages[0].id,
        format: 'metadata',
        metadataHeaders: ['From', 'Subject', 'Date'],
      });

      const headers = detail.data.payload.headers;
      const snippet = detail.data.snippet || '';
      const subject = headers.find(h => h.name === 'Subject')?.value || '';
      const date = headers.find(h => h.name === 'Date')?.value || '';

      updates.push([i + 1, 'replied', date, snippet, subject]);
      replyCount++;
      console.log(`  Reply from: ${email} — "${snippet?.substring(0, 60)}"`);
    }
  }

  for (const [rowNum, newStatus, replyDate, snippet, subject] of updates) {
    await sheets.spreadsheets.values.update({
      spreadsheetId: sheetId,
      range: `Inquiries!E${rowNum}`,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: [[newStatus]] },
    });
    await sheets.spreadsheets.values.update({
      spreadsheetId: sheetId,
      range: `Inquiries!F${rowNum}`,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: [[replyDate]] },
    });
    await sheets.spreadsheets.values.update({
      spreadsheetId: sheetId,
      range: `Inquiries!G${rowNum}`,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: [[snippet]] },
    });
  }

  console.log(`\n✅ Inquiry check complete. ${replyCount} new client replies.`);
  if (replyCount > 0) {
    await sendDiscord(
      `**💬 Client Reply!**\n` +
      `**${replyCount}** client(s) from your website inquiries have replied\n` +
      `Check the Inquiries sheet tab for details`
    );
  }
}

main().catch((e) => { console.error('FATAL:', e); process.exit(1); });
