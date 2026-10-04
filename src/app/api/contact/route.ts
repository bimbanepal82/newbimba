import { INQUIRY_TYPES, LIMITS } from '@/lib/constants';
import { NextRequest, NextResponse } from 'next/server';
import nodemailer, { Transporter } from 'nodemailer';

export const runtime = 'nodejs';

interface ContactPayload {
  name: string;
  email: string;
  inquiryType: string;
  subject: string;
  message: string;
}

/* ----------------------------- CONFIG ----------------------------- */
// .env.local:
//   SMTP_EMAIL=you@gmail.com
//   SMTP_PASSWORD=your_gmail_app_password
//   OWNER_NAME=Your Name              <- replaces the hardcoded "John"
//   CONTACT_RECIPIENT=you@gmail.com   <- where contact messages are delivered (optional)
const OWNER_NAME = process.env.OWNER_NAME || 'BIMBA NEPAL';


/* ----------------------- TRANSPORTER (SINGLETON) ------------------ */
let transporter: Transporter | null = null;

function getTransporter(): Transporter {
  if (!transporter) {
    const user = process.env.SMTP_EMAIL;
    const pass = process.env.SMTP_PASSWORD;
    if (!user || !pass) throw new Error('Missing SMTP_EMAIL / SMTP_PASSWORD');

    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user, pass },
    });
  }
  return transporter;
}

/* ------------------------- RATE LIMITING -------------------------- */
const hits = new Map<string, number[]>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 5;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > MAX_REQUESTS;
}

/* ----------------------------- HELPERS ---------------------------- */
const isValidEmail = (email: string) =>
  email.length <= LIMITS.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const escapeHtml = (text: string) =>
  text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const normalizeMessage = (msg: string) =>
  escapeHtml(msg).replace(/\r?\n/g, '<br>');

// Strip CR/LF to prevent email header injection via subject/name
const singleLine = (text: string) => text.replace(/[\r\n]+/g, ' ').trim();

/* ------------------------- EMAIL TEMPLATES ------------------------- */
function contactTemplate(data: ContactPayload) {
  return `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <h2 style="color:#d5211b;border-bottom:2px solid #d5211b">
      New Contact Form Submission
    </h2>

    <p><strong>Name:</strong> ${escapeHtml(data.name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
    <p><strong>Inquiry type:</strong> ${escapeHtml(data.inquiryType)}</p>
    <p><strong>Subject:</strong> ${escapeHtml(data.subject)}</p>

    <div style="margin-top:20px;padding:16px;border-left:4px solid #d5211b">
      ${normalizeMessage(data.message)}
    </div>
  </div>`;
}

function autoReplyTemplate(data: ContactPayload) {
  return `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <h2 style="color:#d5211b">Thank you for reaching out!</h2>

    <p>Hi ${escapeHtml(data.name)},</p>

    <p>I've received your message and will respond within 24 hours.</p>

    <p><strong>Inquiry type:</strong> ${escapeHtml(data.inquiryType)}</p>
    <p><strong>Subject:</strong> ${escapeHtml(data.subject)}</p>

    <p>
      Best regards,<br/>
      <strong>${escapeHtml(OWNER_NAME)}</strong>
    </p>

    <small>This is an automated confirmation email.</small>
  </div>`;
}

/* ------------------------------ ROUTE ----------------------------- */
export async function POST(req: NextRequest) {
  try {
    /* ------------------ RATE LIMIT ------------------ */
    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown';
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    /* ------------------ PARSE BODY ------------------ */
    let body: Record<string, unknown>;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    if (typeof body.website === 'string' && body.website.trim() !== '') {
      return NextResponse.json({ message: 'Emails sent successfully' }, { status: 200 });
    }

    /* ------------------ VALIDATION ------------------ */
    const { name, email, subject, message } = body;

    if (
      typeof name !== 'string' ||
      typeof email !== 'string' ||
      typeof subject !== 'string' ||
      typeof message !== 'string' ||
      !name.trim() ||
      !email.trim() ||
      !subject.trim() ||
      !message.trim()
    ) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    const rawType =
      typeof body.inquiryType === 'string' && body.inquiryType.trim()
        ? body.inquiryType.trim()
        : 'General';

    if (!INQUIRY_TYPES.includes(rawType as any)) {
      return NextResponse.json(
        { error: 'Invalid inquiry type' },
        { status: 400 }
      );
    }

    const data: ContactPayload = {
      name: singleLine(name),
      email: singleLine(email),
      inquiryType: rawType,
      subject: singleLine(subject),
      message: message.trim(),
    };

    if (!isValidEmail(data.email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    if (
      data.name.length > LIMITS.name ||
      data.subject.length > LIMITS.subject ||
      data.message.length > LIMITS.message
    ) {
      return NextResponse.json(
        { error: 'One or more fields are too long' },
        { status: 400 }
      );
    }

    /* ------------------ MAIL OBJECTS ------------------ */
    const mailer = getTransporter();
    const gmailUser = process.env.SMTP_EMAIL as string;
    const recipient = process.env.CONTACT_RECIPIENT || gmailUser;

    const mailToYou = {
      from: `"Portfolio Contact" <${gmailUser}>`,
      to: recipient,
      replyTo: `"${data.name.replace(/"/g, '')}" <${data.email}>`,
      subject: `[${data.inquiryType}] ${data.subject}`,
      html: contactTemplate(data),
      text: `From: ${data.name} <${data.email}>\nInquiry type: ${data.inquiryType}\nSubject: ${data.subject}\n\n${data.message}`,
    };

    const autoReply = {
      from: `"${OWNER_NAME.replace(/"/g, '')}" <${gmailUser}>`,
      to: data.email,
      replyTo: recipient,
      subject: 'Thanks for reaching out',
      html: autoReplyTemplate(data),
    };

    /* ------------------ SEND ------------------ */
    const [toYou, toSender] = await Promise.allSettled([
      mailer.sendMail(mailToYou),
      mailer.sendMail(autoReply),
    ]);

    if (toYou.status === 'rejected') {
      console.error('Notification email failed:', toYou.reason);
      return NextResponse.json(
        { error: 'Failed to send message' },
        { status: 500 }
      );
    }

    if (toSender.status === 'rejected') {
      console.error('Auto-reply failed:', toSender.reason);
    }

    return NextResponse.json(
      { message: 'Emails sent successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Email error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}