'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function DonatePage() {
  const [selectedAmount, setSelectedAmount] = useState<number>(1000);

  const amounts = [500, 1000, 2500, 5000, 10000];

  return (
    <>
      <section className="page-head">
        <div className="container">
          <h1>Donate</h1>
          <p className="lead">Support BIMBA NEPAL’s work in health, longevity and service.</p>
        </div>
      </section>

      <section className="section">
        <div className="container donate-grid">
          <div>
            <div className="notice">
              <strong>How donating works:</strong> This website does not process online payments directly. You donate safely from your own banking or Fonepay app by scanning the official bank QR code.
            </div>

            <h2>1. Choose a suggested amount</h2>
            <div className="chip-group">
              {amounts.map((amt) => (
                <label key={amt} className="chip">
                  <input
                    type="radio"
                    name="amount"
                    value={amt}
                    checked={selectedAmount === amt}
                    onChange={() => setSelectedAmount(amt)}
                  />
                  <span>Rs. {amt.toLocaleString()}</span>
                </label>
              ))}
            </div>

            <h2 style={{ marginTop: '2.5rem' }}>2. Scan the official QR</h2>
            <div className="qr-panel">
              <h3>Kumari Bank — Samakhushi Branch</h3>
              <img
                className="qr-img"
                src="/assets/donation-qr.svg"
                alt="BIMBA NEPAL donation QR code for Kumari Bank"
                width={380}
                height={380}
              />
              <p>
                <strong>Bank:</strong> Kumari Bank<br />
                <strong>Account Number:</strong> 2420363121500001<br />
                <strong>Branch:</strong> Samakhushi<br />
                <strong>Account Name:</strong> BIMBA NEPAL
              </p>
              <p style={{ fontSize: '0.92rem', color: 'var(--muted)' }}>
                Open your banking or Fonepay app, scan the QR code above, verify the recipient name (BIMBA NEPAL), and enter your contribution amount (suggested: Rs. {selectedAmount.toLocaleString()}) before confirming.
              </p>
            </div>
          </div>

          <aside>
            <h2>Stay safe</h2>
            <p>
              Never share your banking password, PIN, OTP or card number with anyone. BIMBA NEPAL will never ask for them.
            </p>
            <div className="notice notice-soft">
              <strong>Donation support:</strong> Your contribution directly supports community health posts, women's wellbeing, healthy ageing initiatives, essential medicines, and emergency response in rural Nepal.
            </div>
            <div style={{ marginTop: '2rem' }}>
              <h3>Need assistance?</h3>
              <p>
                For official donation receipts, institutional grants, or inquiries, please contact:
              </p>
              <p>
                Email: <a href="mailto:mail@bimba.org.np">mail@bimba.org.np</a>
              </p>
              <Link href="/contact" className="more">
                View contact details
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
