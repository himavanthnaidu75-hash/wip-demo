import { NextRequest, NextResponse } from 'next/server';
import { appendToSheet, gmail } from '@/lib/google-auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { name, email, message } = await req.json();

    if (!email) {
      return NextResponse.json({ ok: false, error: 'email required' }, { status: 400 });
    }

    const now = new Date().toISOString();

    await appendToSheet('Inquiries', [now, name || '', email, message || '', 'new']);

    const subject = `New inquiry from ${name || email}`;
    const body = `Name: ${name || 'N/A'}\nEmail: ${email}\nMessage: ${message || 'N/A'}\nTime: ${now}`;

    const utf8Bytes = new TextEncoder().encode(
      `From: W.I.P Studio <w.i.poffic4l@gmail.com>\r\n` +
      `To: W.I.P Studio <w.i.poffic4l@gmail.com>\r\n` +
      `Subject: ${subject}\r\n` +
      `Content-Type: text/plain; charset=UTF-8\r\n\r\n` +
      `${body}`
    );

    const raw = btoa(String.fromCharCode(...utf8Bytes)).replace(/\+/g, '-').replace(/\//g, '_');

    await gmail.users.messages.send({
      userId: 'me',
      requestBody: { raw },
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('/api/contact error', e);
    return NextResponse.json({ ok: false, error: 'internal' }, { status: 500 });
  }
}
