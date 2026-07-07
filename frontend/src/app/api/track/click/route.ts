import { NextRequest, NextResponse } from 'next/server';
import { sheets, findRowByEmail, updateSheetRow } from '@/lib/google-auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const lead = req.nextUrl.searchParams.get('lead');
  const url =
    req.nextUrl.searchParams.get('url') ||
    process.env.DEMO_URL ||
    'https://wip-demo.vercel.app';

  try {
    if (lead) {
      const row = await findRowByEmail('Sent', lead);
      if (row >= 0) {
        const cur = await sheets.spreadsheets.values.get({
          spreadsheetId: process.env.SHEETS_ID,
          range: `Sent!A${row + 1}:Z${row + 1}`,
        });
        await updateSheetRow('Sent', row, [...(cur.data.values?.[0] ?? []), 'clicked']);
      }
    }
  } catch (e) {
    console.error('track/click error', e);
  }

  return NextResponse.redirect(url, {
    headers: { 'Access-Control-Allow-Origin': '*' },
  });
}
