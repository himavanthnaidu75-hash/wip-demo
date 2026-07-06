/**
 * Track Gmail Replies Script
 * Queries Gmail for replies to sent emails and updates Google Sheets.
 * Runs hourly via GitHub Actions.
 */

import { google } from 'googleapis';

// ── Auth ───────────────────────────────────────────────────

function getOAuth2Client() {
  const client = new google.auth.OAuth2(
    process.env.GMAIL_CLIENT_ID,
    process.env.GMAIL_CLIENT_SECRET,
    'https://developers.google.com/oauthplayground'
  );
  client.setCredentials({ refresh_token: process.env.GMAIL_REFRESH_TOKEN });
  return client;
}

// ── Main ───────────────────────────────────────────────────

async function main() {
  console.log('Checking for email replies...');
  const auth = getOAuth2Client();
  const gmail = google.gmail({ version: 'v1', auth });
  const sheets = google.sheets({ version: 'v4', auth });
  const sheetId = process.env.SHEETS_ID;

  // Get sent emails from the last 7 days
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const query = `in:inbox after:${sevenDaysAgo} -from:${process.env.GMAIL_USER}`;

  let pageToken;
  let replyCount = 0;

  do {
    const response = await gmail.users.messages.list({
      userId: 'me',
      q: query,
      maxResults: 100,
      pageToken,
    });

    const messages = response.data.messages || [];
    for (const msg of messages) {
      const detail = await gmail.users.messages.get({
        userId: 'me',
        id: msg.id,
        format: 'metadata',
        metadataHeaders: ['From', 'Subject', 'Date'],
      });

      const headers = detail.data.payload.headers;
      const from = headers.find((h) => h.name === 'From')?.value || '';
      const subject = headers.find((h) => h.name === 'Subject')?.value || '';
      const date = headers.find((h) => h.name === 'Date')?.value || '';
      const snippet = detail.data.snippet || '';

      // Extract email from "Name <email>" format
      const emailMatch = from.match(/<([^>]+)>/) || from.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
      const replyEmail = emailMatch ? emailMatch[1] || emailMatch[0] : '';

      if (!replyEmail) continue;

      // Check if this email was in our Sent tab
      const sentData = await sheets.spreadsheets.values.get({
        spreadsheetId: sheetId,
        range: 'Sent!A:E',
      });
      const sentRows = sentData.data.values || [];

      for (let i = 1; i < sentRows.length; i++) {
        if (sentRows[i][1] === replyEmail && sentRows[i][3] !== 'replied') {
          // Update Sent tab status
          await sheets.spreadsheets.values.update({
            spreadsheetId: sheetId,
            range: `Sent!D${i + 1}`,
            valueInputOption: 'USER_ENTERED',
            requestBody: { values: [['replied']] },
          });

          // Log to Replied tab
          await sheets.spreadsheets.values.append({
            spreadsheetId: sheetId,
            range: 'Replied!A:D',
            valueInputOption: 'USER_ENTERED',
            requestBody: {
              values: [[new Date().toISOString(), replyEmail, snippet, subject]],
            },
          });

          replyCount++;
          console.log(`  Reply from: ${replyEmail}`);
          break;
        }
      }
    }

    pageToken = response.data.nextPageToken;
  } while (pageToken);

  console.log(`\n✅ Reply check complete. ${replyCount} new replies tracked.`);
}

main().catch(console.error);
