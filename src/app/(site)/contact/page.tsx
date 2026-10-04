'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { Mail, MapPin, Send, Check } from 'lucide-react';
import s from './contact.module.css';
import { INQUIRY_TYPES } from '@/lib/constants';

const MAX_MESSAGE = 3000;

type Fields = 'name' | 'email' | 'subject' | 'message';
type Status = 'idle' | 'sending' | 'success' | 'error';

const EMPTY = { name: '', email: '', inquiryType: 'General', subject: '', message: '' };

const EMAIL_RE = /^[^\s@.]+(\.[^\s@.]+)*@[^\s@.]+(\.[^\s@.]+)*\.[^\s@.]{2,}$/;
const NAME_RE = /^[\p{L}][\p{L}\s'.-]*$/u; // letters, spaces, ' . -

function validate(f: typeof EMPTY): Partial<Record<Fields, string>> {
  const e: Partial<Record<Fields, string>> = {};
  const name = f.name.trim();
  const email = f.email.trim();
  const subject = f.subject.trim();
  const message = f.message.trim();

  if (!name) e.name = 'Enter your name.';
  else if (name.length < 2) e.name = 'Name must be at least 2 characters.';
  else if (name.length > 100) e.name = 'Name must be 100 characters or fewer.';
  else if (!NAME_RE.test(name)) e.name = 'Use letters, spaces, hyphens or apostrophes only.';

  if (!email) e.email = 'Enter your email address.';
  else if (email.length > 254 || !EMAIL_RE.test(email)) e.email = 'Enter a valid email, like name@example.com.';

  if (!subject) e.subject = 'Enter a subject.';
  else if (subject.length < 3) e.subject = 'Subject must be at least 3 characters.';

  if (!message) e.message = 'Enter your message.';
  else if (message.length < 10) e.message = 'Message must be at least 10 characters.';

  return e;
}


export default function ContactPage() {
  const [status, setStatus] = useState<Status>('idle');
  const [errorText, setErrorText] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<Fields, string>>>({});
  const [form, setForm] = useState(EMPTY);
  const [website, setWebsite] = useState(''); 
  const openedAt = useRef(Date.now());

  const set =
    (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((f) => ({ ...f, [key]: e.target.value }));
      if (fieldErrors[key as Fields]) setFieldErrors((fe) => ({ ...fe, [key]: undefined }));
    };

  const blur = (key: Fields) => {
    const msg = validate(form)[key];
    setFieldErrors((fe) => ({ ...fe, [key]: msg }));
  };

  // Show the error as the placeholder when a field is empty (no layout shift).
  const ph = (key: Fields, normal: string) =>
    fieldErrors[key] && !form[key] ? (fieldErrors[key] as string) : normal;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === 'sending') return;

    const found = validate(form);
    if (Object.keys(found).length) {
      setFieldErrors(found);
      setErrorText('');
      setStatus('idle');
      const first = (['name', 'email', 'subject', 'message'] as Fields[]).find((k) => found[k]);
      if (first) document.getElementById(first)?.focus();
      return;
    }

    setStatus('sending');
    setErrorText('');
    setFieldErrors({});

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, website, elapsedMs: Date.now() - openedAt.current }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (data.fields) setFieldErrors(data.fields);
        setErrorText(data.error || 'Something went wrong. Please try again.');
        setStatus('error');
        return;
      }
      setStatus('success');
    } catch {
      setErrorText('Network error. Check your connection and try again.');
      setStatus('error');
    }
  };

  const reset = () => {
    setForm(EMPTY);
    setStatus('idle');
    openedAt.current = Date.now();
  };

  return (
    <>
      <section className="page-head">
        <div className="container">
          <h1>Contact</h1>
          <p className="lead">
            Connect with BIMBA NEPAL for program information, partnerships, volunteering or support.
          </p>
        </div>
      </section>

      <section className={s.wrap}>
        <div className="container">
          <div className={s.shell}>
            {/* Left: details */}
            <aside className={s.info}>
              <div>
                <h2>Talk to our team</h2>
                <p>
                  Write to us about a program, a partnership or how to volunteer. We read every message.
                </p>
              </div>

              <ul className={s.channels}>
                <li className={s.channel}>
                  <span className={s.icon}><Mail size={18} /></span>
                  <div>
                    <span className={s.channelLabel}>Email</span>
                    <a className={s.channelValue} href="mailto:mail@bimba.org.np">mail@bimba.org.np</a>
                  </div>
                </li>
                <li className={s.channel}>
                  <span className={s.icon}><MapPin size={18} /></span>
                  <div>
                    <span className={s.channelLabel}>Location</span>
                    <span className={s.channelValue}>Kathmandu, Nepal</span>
                  </div>
                </li>
                <li className={s.channel}>
                  <span className={s.icon}><img src="/assets/icons/facebook.svg" alt="" width={18} height={18} /></span>
                  <div>
                    <span className={s.channelLabel}>Facebook</span>
                    <a
                      className={s.channelValue}
                      href="https://www.facebook.com/profile.php?id=61590730554027"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      BIMBA NEPAL
                    </a>
                  </div>
                </li>
                <li className={s.channel}>
                  <span className={s.icon}><img src="/assets/icons/instagram.svg" alt="" width={18} height={18} /></span>
                  <div>
                    <span className={s.channelLabel}>Instagram</span>
                    <a
                      className={s.channelValue}
                      href="https://www.instagram.com/bimba_nepal_org/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      @bimba_nepal_org
                    </a>
                  </div>
                </li>
              </ul>

              <p className={s.partner}>
                <strong>Partnership and service:</strong> BIMBA Nepal's work is strengthened through collaboration with municipalities, health professionals, institutions, volunteers, pharmaceutical partners and community organizations.
              </p>
            </aside>

            {/* Right: form */}
            <div className={s.formPane}>
              {status === 'success' ? (
                <div className={s.success} aria-live="polite">
                  <span className={s.successIcon}><Check size={28} /></span>
                  <h3>Message sent</h3>
                  <p>
                    Thank you, {form.name.split(' ')[0]}. We will reply to {form.email}.
                  </p>
                  <button type="button" className="btn btn-outline" onClick={reset}>
                    Send another message
                  </button>
                </div>
              ) : (
                <>
                  <h3>Send us a message</h3>
                  <p className={s.formIntro}>All fields are required.</p>

                  <div aria-live="polite">
                    {status === 'error' && (
                      <div className={`${s.banner} ${s.bannerError}`} role="alert">{errorText}</div>
                    )}
                  </div>

                  <form className={s.form} onSubmit={handleSubmit} noValidate>
                    <div className={s.hp} aria-hidden="true">
                      <label htmlFor="website">Leave this field empty</label>
                      <input id="website" type="text" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
                    </div>

                    <div className={s.row}>
                      <div className={s.field}>
                        <label className={s.label} htmlFor="name">Your name</label>
                        <input id="name" className={s.input} type="text" placeholder={ph('name', 'Maya Sharma')} autoComplete="name"
                          required minLength={2} maxLength={100} value={form.name} onChange={set('name')} onBlur={() => blur('name')}
                          aria-invalid={!!fieldErrors.name} />
                        {fieldErrors.name && form.name && <span className={s.error}>{fieldErrors.name}</span>}
                      </div>
                      <div className={s.field}>
                        <label className={s.label} htmlFor="email">Your email</label>
                        <input id="email" className={s.input} type="email" placeholder={ph('email', 'maya@example.com')} autoComplete="email"
                          required maxLength={254} value={form.email} onChange={set('email')} onBlur={() => blur('email')}
                          aria-invalid={!!fieldErrors.email} />
                        {fieldErrors.email && form.email && <span className={s.error}>{fieldErrors.email}</span>}
                      </div>
                    </div>

                    <fieldset className={s.chips}>
                      <legend>What is this about?</legend>
                      {INQUIRY_TYPES.map((t) => (
                        <label key={t} className={s.chip}>
                          <input
                            type="radio"
                            name="inquiryType"
                            value={t}
                            checked={form.inquiryType === t}
                            onChange={() => setForm((f) => ({ ...f, inquiryType: t }))}
                          />
                          <span>{t}</span>
                        </label>
                      ))}
                    </fieldset>

                    <div className={s.field}>
                      <label className={s.label} htmlFor="subject">Subject</label>
                      <input id="subject" className={s.input} type="text" placeholder={ph('subject', 'A short summary')}
                        required minLength={3} maxLength={150} value={form.subject} onChange={set('subject')} onBlur={() => blur('subject')}
                        aria-invalid={!!fieldErrors.subject} />
                      {fieldErrors.subject && form.subject && <span className={s.error}>{fieldErrors.subject}</span>}
                    </div>

                    <div className={s.field}>
                      <label className={s.label} htmlFor="message">Message</label>
                      <textarea id="message" className={s.textarea} placeholder={ph('message', 'How can we collaborate?')}
                        required minLength={10} maxLength={MAX_MESSAGE} value={form.message} onChange={set('message')} onBlur={() => blur('message')}
                        aria-invalid={!!fieldErrors.message} />
                      <div className={s.meta}>
                        <span className={s.errorInline}>{form.message ? fieldErrors.message ?? '' : ''}</span>
                        <span>{form.message.length}/{MAX_MESSAGE}</span>
                      </div>
                    </div>

                    <div className={s.submitRow}>
                      <button type="submit" className="btn btn-primary" style={{ gap: '0.5rem' }} disabled={status === 'sending'}>
                        <Send size={16} />
                        {status === 'sending' ? 'Sending...' : 'Send message'}
                      </button>
                      <span className={s.note}>Or email us directly at <a href="mailto:mail@bimba.org.np">mail@bimba.org.np</a></span>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>

          {/* Quick links */}
          <div className={s.links}>
            <Link className={s.linkCard} href="/projects">
              <strong>Our work</strong>
              <span>Women's wellbeing, health longevity service and emergency response.</span>
            </Link>
            <Link className={s.linkCard} href="/donate">
              <strong>Donate</strong>
              <span>Support BIMBA NEPAL through the official donation QR.</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}