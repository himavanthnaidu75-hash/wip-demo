import { google } from 'googleapis';

const oauth2Client = new google.auth.OAuth2(
  process.env.GMAIL_CLIENT_ID,
  process.env.GMAIL_CLIENT_SECRET
);
oauth2Client.setCredentials({ refresh_token: process.env.GMAIL_REFRESH_TOKEN });

export const auth = oauth2Client;
export const sheets = google.sheets({ version: 'v4', auth: oauth2Client });
export const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

export async function appendToSheet(tab: string, values: unknown[]) {
  await sheets.spreadsheets.values.append({
    spreadsheetId: process.env.SHEETS_ID,
    range: `${tab}!A:Z`,
    valueInputOption: 'RAW',
    requestBody: { values: [values] },
  });
}

export async function findRowByEmail(tab: string, email: string): Promise<number> {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.SHEETS_ID,
    range: `${tab}!A:Z`,
  });
  const rows = res.data.values || [];
  return rows.findIndex((r) => r[1] === email);
}

export async function updateSheetRow(tab: string, rowIndex: number, values: unknown[]) {
  await sheets.spreadsheets.values.update({
    spreadsheetId: process.env.SHEETS_ID,
    range: `${tab}!A${rowIndex + 1}:Z${rowIndex + 1}`,
    valueInputOption: 'RAW',
    requestBody: { values: [values] },
  });
}
