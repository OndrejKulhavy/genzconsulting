// app/api/legit-check/route.ts
import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { isValidEmail } from '@/lib/email';

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const { email } = body;

  if (!email || typeof email !== 'string') {
    return NextResponse.json({ error: 'Email is required.' }, { status: 400 });
  }

  if (!isValidEmail(email)) {
    return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (apiKey) {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: 'GenZ Consulting <noreply@genzconsulting.cz>',
      to: 'adam.dalecky@genzconsulting.cz',
      subject: `Nový lead: Legit Check — ${email}`,
      text: `Někdo stáhl Legit Check:\n\nE-mail: ${email}\nDatum: ${new Date().toISOString()}`,
    });
    if (error) console.error('[legit-check] Resend error:', error);
  } else {
    console.warn('[legit-check] RESEND_API_KEY not set — skipping email notification.');
  }

  return NextResponse.json({ downloadUrl: '/downloads/legit-check.pdf' });
}
