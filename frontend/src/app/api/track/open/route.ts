import { NextRequest } from 'next/server';
import { sheets, findRowByEmail, updateSheetRow } from '@/lib/google-auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const PIXEL = Buffer.from(
  'R0lGODlhAQABAPAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==',
  'base64'
);

export async function GET(req: NextRequest) {
  const lead = req.nextUrl.searchParams.get('lead');
  try {
    if (lead) {
      const row = await findRowByEmail('Sent', lead);
      if (row >= 0) {
        const cur = await sheets.spreadsheets.values.get({
          spreadsheetId: process.env.SHEETS_ID,
          range: `Sent!A${row + 1}:Z${row + 1}`,
        });
        await updateSheetRow('Sent', row, [...(cur.data.values?.[0] ?? []), 'opened']);
      }
    }
  } catch (e) {
    console.error('track/open error', e);
  }
  return new Response(PIXEL, {
    headers: {
      'Content-Type': 'image/gif',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-store',
    },
  });
}
