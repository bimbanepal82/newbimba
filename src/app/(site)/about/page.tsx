import React from 'react';
import Link from 'next/link';
import { getSettings } from '@/lib/data';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'BIMBA Nepal is a community-oriented organization working toward healthier communities and more empowered lives through health services, community engagement, partnership and responsive action.',
};

export default async function AboutPage() {
  const settings = await getSettings();

  return (
    <>
      <section className="page-head">
        <div className="container">
          <h1>About Us</h1>
          <p className="lead">
            BIMBA Nepal is a community-oriented organization working toward healthier communities and more empowered lives through health services, community engagement, partnership and responsive action.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="prose">
            <h2>About BIMBA Nepal</h2>
            <p>
              BIMBA Nepal is a community-focused organization working at the intersection of <strong>health, longevity and service</strong>. Our work is guided by a simple belief: access to health and care should not end with diagnosis or treatment alone. People need timely healthcare, continuity of care, dignity, understanding and support—especially women, older persons, vulnerable communities and people affected by emergencies.
            </p>
            <p>
              BIMBA Nepal works by identifying real needs within communities and connecting people with appropriate health services, specialists, medicines, health information and supportive care. Our approach is practical and community-based, bringing services closer to people and working together with local communities, health professionals, institutions and partners.
            </p>
            <p>
              Our initial programs have focused on three connected areas: <strong>women's wellbeing, healthy and dignified ageing, and emergency health response</strong>. Through these initiatives, BIMBA Nepal has worked to provide accessible consultations and screening, support early identification of health concerns, promote continuity of treatment, and respond to the wider physical and emotional needs of people during difficult circumstances.
            </p>
            <p>
              The idea of <strong><span lang="ne">स्वाभिमानी बुढ्यौली</span> - Dignified Ageing</strong> is an important part of our work. We believe ageing should be accompanied by health, dignity, independence, respect and the ability to live with confidence within one's community.
            </p>
            <p>
              BIMBA Nepal is developing its work through experience, partnerships and learning from the communities it serves. Each initiative helps us understand where support is needed, how services can be delivered more effectively, and how community-based health and service can contribute to healthier and more dignified lives.
            </p>

            <h2>Our Mission</h2>
            <p>
              <strong>To improve health, longevity and quality of life by bringing accessible, community-based healthcare and supportive services closer to people, with particular attention to women, older persons, vulnerable communities and people affected by emergencies.</strong>
            </p>
            <p>We work to:</p>
            <ul>
              <li>bring appropriate health services closer to communities;</li>
              <li>support prevention, screening and early identification of health concerns;</li>
              <li>promote women's health and wellbeing;</li>
              <li>support healthy and dignified ageing;</li>
              <li>help people maintain continuity of care and treatment;</li>
              <li>provide health and psychosocial support during emergencies;</li>
              <li>connect communities with health professionals, institutions and resources; and</li>
              <li>strengthen community-based approaches through partnership, service and learning.</li>
            </ul>

            <h2>Our Vision</h2>
            <p><strong>Healing Community and Empowering Life</strong></p>
            <p>
              BIMBA Nepal envisions communities where people have the opportunity to live healthier, longer and more fulfilling lives, with access to appropriate support, healthcare, knowledge and opportunities to participate actively in their communities.
            </p>
            <p>
              <strong>Healing Community</strong> means creating communities where physical, emotional and social well-being are recognized as interconnected, and where people can find care, support and connection when they need it.
            </p>
            <p>
              <strong>Empowering Life</strong> means helping people gain the knowledge, access, confidence and support necessary to make informed decisions about their health and well-being and to participate actively in their own lives and communities.
            </p>
            <p>
              Our vision is not limited to treating illness. It is about creating healthier communities where people can <strong>prevent, identify, respond to and recover from health challenges</strong> together.
            </p>

            <h2>Our Beginning</h2>
            <p>
              BIMBA Nepal's work has grown from a simple recognition: <strong>health needs are often closest to people, but appropriate services are not always equally accessible to them.</strong>
            </p>
            <p>
              Our initial work has therefore focused on taking healthcare and specialist services closer to communities and responding to needs identified at the local level.
            </p>
            <p>
              The journey began with the <strong>Pilot Project of Women Wellbeing at Bhimdhunga</strong>, where a community health camp placed particular attention on women and women's health while also providing broader health screening and consultation.
            </p>
            <p>
              This was followed by the <strong>Pilot Project of Health Longevity Service at Mathatirtha, Chandragiri</strong>, with particular attention to people over 60, women and the wider community. The program brought together general health consultation, geriatric care, gynecological consultation, diagnostic services, respiratory assessment and health support, with the aim of encouraging healthier and more dignified ageing.
            </p>
            <p>
              When communities were affected by the <strong>Bidur–Trishuli emergency</strong>, the nature of the need changed. People were not only facing the immediate consequences of disaster; many older persons had lost access to their regular medicines and ongoing treatment. BIMBA Nepal joined with partner organizations to provide medical consultation, specialist services, medicines, trauma support and psychosocial care.
            </p>
            <p>
              These experiences have shaped BIMBA Nepal's approach: <strong>listen to communities, identify needs, connect appropriate resources, serve with dignity, respond when circumstances change, and learn from every initiative.</strong>
            </p>

            <h2>Our Objectives</h2>
            <ol>
              <li><strong>Improve access to community-based healthcare.</strong> To help bring appropriate health consultations, screening, diagnostic support and health services closer to communities, particularly where access may be limited.</li>
              <li><strong>Promote women's health and wellbeing.</strong> To support women's health through accessible consultation, screening, awareness and referral, with particular attention to women's specific health needs.</li>
              <li><strong>Promote healthy and dignified ageing.</strong> To support older persons in maintaining health, independence, dignity and quality of life through preventive care, geriatric services, health awareness and continuity of treatment.</li>
              <li><strong>Encourage prevention and early identification.</strong> To promote regular health checks, screening and early identification of health concerns so that people can seek appropriate care in a timely manner.</li>
              <li><strong>Support continuity of care.</strong> To help people, particularly older persons and those living with chronic health conditions, maintain access to appropriate treatment, medicines, follow-up and health information.</li>
              <li><strong>Strengthen emergency health response.</strong> To respond to health needs arising during emergencies and disasters, including medical consultation, medicines, referral, trauma support and other essential health services.</li>
              <li><strong>Address psychosocial wellbeing.</strong> To recognize that health and emergencies affect both physical and emotional wellbeing and to support people through counselling, stress management, human connection and appropriate psychosocial care.</li>
              <li><strong>Build partnerships for service.</strong> To work with municipalities, health institutions, medical professionals, community organizations, volunteers, pharmaceutical and other supporting partners to strengthen the reach and effectiveness of community health initiatives.</li>
              <li><strong>Learn from community experience.</strong> To use the experience and lessons from each initiative to improve future programs and develop practical, sustainable approaches to community health and service.</li>
              <li><strong>Promote dignity in health and care.</strong> To encourage an approach to healthcare in which every person is treated with respect, compassion and dignity regardless of age, gender, circumstance or vulnerability.</li>
            </ol>

            <h2>Our Values</h2>
            <ul>
              <li><strong>Dignity.</strong> We believe every person deserves to be treated with respect, regardless of age, gender, health condition or circumstance.</li>
              <li><strong>Compassion.</strong> We respond to people not only with services, but with understanding, empathy and human connection.</li>
              <li><strong>Service.</strong> We believe meaningful service begins with identifying real needs and responding where support can make a practical difference.</li>
              <li><strong>Accessibility.</strong> We work to bring appropriate health services and information closer to communities and reduce barriers to care.</li>
              <li><strong>Prevention.</strong> We value early identification, health awareness and timely care as important parts of protecting long-term health.</li>
              <li><strong>Healthy Longevity.</strong> We believe a longer life should also be a healthier, more active and dignified life.</li>
              <li><strong>Respect for Older Persons.</strong> We recognize older people as individuals with dignity, experience and rights, and support their ability to live with independence and respect.</li>
              <li><strong>Responsibility.</strong> We aim to use resources responsibly, work transparently with partners and remain accountable to the communities we serve.</li>
              <li><strong>Partnership.</strong> We believe meaningful community service is strengthened when communities, health professionals, institutions, organizations and volunteers work together.</li>
              <li><strong>Learning.</strong> We learn from every program, community and experience so that future work can become more relevant, effective and responsive.</li>
            </ul>

            <h2>Our Approach</h2>
            <p>
              BIMBA Nepal believes that meaningful change begins with listening. Before designing a program, we need to understand what the community needs, who is being left behind, what barriers prevent people from accessing care, what can be done now, and what can be strengthened for the future.
            </p>
            <p>
              Our programs may take different forms, but the underlying approach remains: <strong>Listen → Identify → Connect → Serve → Respond → Learn</strong>
            </p>
          </div>
        </div>
      </section>

      {/* Support CTA */}
      <section className="section band-blue">
        <div className="container cta-row">
          <div>
            <h2>{settings.supportCta?.title || 'Support our work'}</h2>
            <p>{settings.supportCta?.lead || 'You can support BIMBA NEPAL by donating through the official bank QR code.'}</p>
          </div>
          <Link className="btn btn-donate" href={settings.supportCta?.btnLink || '/donate'}>
            {settings.supportCta?.btnText || 'Donate'}
          </Link>
        </div>
      </section>
    </>
  );
}
