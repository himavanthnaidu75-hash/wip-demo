import { NextRequest, NextResponse } from 'next/server';
import { sheets, findRowByEmail, updateSheetRow, appendToSheet } from '@/lib/google-auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const WINDOW_MS = 60_000;
const MAX_REQUESTS = 30;
const hits: number[] = [];

function rateLimited(): boolean {
  const now = Date.now();
  while (hits.length && now - hits[0] > WINDOW_MS) hits.shift();
  if (hits.length >= MAX_REQUESTS) return true;
  hits.push(now);
  return false;
}

export async function POST(req: NextRequest) {
  if (rateLimited()) {
    return NextResponse.json({ ok: false, error: 'rate limited' }, { status: 429 });
  }

  try {
    const body = await req.json();
    const message = body?.message;
    if (message) {
      const email = message.payload?.headers?.find(
        (h: { name: string; value: string }) => h.name === 'From'
      )?.value;
      if (email) {
        const row = await findRowByEmail('Sent', email);
        if (row >= 0) {
          const cur = await sheets.spreadsheets.values.get({
            spreadsheetId: process.env.SHEETS_ID,
            range: `Sent!A${row + 1}:Z${row + 1}`,
          });
          await updateSheetRow('Sent', row, [...(cur.data.values?.[0] ?? []), 'replied']);
          await appendToSheet('Replied', [new Date().toISOString(), email, message.snippet ?? '']);
        }
      }
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('webhook/gmail error', e);
    return NextResponse.json({ ok: false, error: 'internal' }, { status: 500 });
  }
}
