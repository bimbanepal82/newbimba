# BIMBA Nepal — Official Website

**Health • Longevity • Service**

BIMBA Nepal is a community-focused organization working to improve health, longevity and quality of life through accessible, community-based healthcare and service.

This repository contains the source code and content for the **BIMBA Nepal official website**, built with **Next.js (App Router)** and featuring an **inbuilt CPanel Content Management System**.

## Quick Start (Next.js & CPanel)

### 1. Configure Supabase, Install & Run

Content is stored in Supabase. Configure `NEXT_PUBLIC_SUPABASE_URL`,
`NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` in `.env.local`,
then run `supabase/schema.sql` in the Supabase SQL Editor to create and seed the
required tables and initial site content. The service role key is server-only;
never expose it in client-side code.

```bash
# Start development server
npm run dev

# Or build and run production server
npm run build
npm run start
```
The website will be available at `http://localhost:3000`.

### 2. Access the Inbuilt CPanel
Open your browser to:
- **CPanel URL:** `http://localhost:3000/admin` (or `/cpanel`)
- **Default Username:** `admin`
- **Default Password:** `bimba@admin2026`

*(Credentials can be customized in `.env.local` via `ADMIN_USERNAME` and `ADMIN_PASSWORD`)*

### 3. What you can manage in CPanel:
- **Headers & Hero:** Change the main headline, tagline, eyebrow, lead text, primary/secondary CTA buttons, and header logo.
- **Blogs & News:** Create, edit, publish/draft, or delete blog articles and updates.
- **Projects:** Manage community health projects, location, status, impact stats counters, and detailed content.
- **Media & Images:** Upload images with 1-click, copy URLs to clipboard, or directly replace the Site Logo, Hero graphic, or Bank Donation QR code.
- **Real-time Persistence:** Blog posts, projects, and site settings are stored in Supabase. Uploaded files use Supabase Storage when configured.

## About BIMBA Nepal

### Vision

> **Healing Community and Empowering Life.**

### Mission

To improve health, longevity and quality of life by bringing accessible, community-based healthcare and supportive services closer to people, with particular attention to women, older persons, vulnerable communities and people affected by emergencies.

### Core Areas of Work

- Women's health and wellbeing
- Healthy and dignified ageing
- Community-based healthcare
- Preventive health and screening
- Health awareness
- Continuity of care
- Emergency health response
- Psychosocial wellbeing
- Community partnerships and service

## Current Initiatives

### 1. Women Wellbeing — Bhimdhunga

**Pilot Project of Women Wellbeing**

A community health initiative conducted at Bhimdhunga Health Post, Nagarjun Municipality–8, with particular attention to women's health while also providing broader community health services.

Services included:

- Video X-ray
- Physician consultation
- Geriatric consultation
- Gynecology consultation
- Non-communicable disease screening

### 2. Health Longevity Service — Mathatirtha

**Pilot Project of Health Longevity Service**

A community health initiative at Mathatirtha Health Post, Chandragiri Municipality–8, focusing particularly on older persons, women and the wider community.

Services included:

- General health examination
- Geriatric consultation
- Blood pressure and blood sugar testing
- Video X-ray
- Gynecology consultation
- Pulmonary Function Test
- Respiratory consultation
- Medicines and health materials

The initiative promotes **healthy and dignified ageing**, early identification of health concerns and continuity of care.

### 3. Emergency Response — Bidur–Trishuli

**Project under Emergency Response**

Following the disaster affecting communities in the Bidur–Trishuli area, BIMBA Nepal worked with partner organizations to provide health and psychosocial support to affected people.

Services included:

- Geriatric consultation
- Orthopedic consultation
- Cardiac testing
- Dental services
- Osteopathy
- Trauma support
- Stress management
- Psychosocial counselling
- Necessary medicines and health materials

The response reached **200 people**, including **101 older persons**, and provided stress-management and psychosocial support to **60 older persons and family members**.

## Dignified Ageing

### स्वाभिमानी बुढ्यौली — Dignified Ageing

Dignified Ageing is an important theme within BIMBA Nepal's work.

BIMBA Nepal believes that longer life should also be accompanied by:

- Health
- Dignity
- Independence
- Respect
- Continuity of care
- Social connection
- Access to appropriate support

The organization aims to contribute to communities where older people can continue to live healthy, respected and meaningful lives.

## Website Structure

The website includes:

- Home
- About BIMBA Nepal
- Mission & Vision
- Our Objectives
- Our Values
- Our Approach
- Projects
- Women Wellbeing
- Health Longevity Service
- Emergency Response
- Dignified Ageing
- Donate
- Contact
- Updates / Content Management

## Technology

The website is designed as a lightweight, responsive web application with a focus on:

- Fast loading
- Mobile responsiveness
- Accessibility
- Search-engine-friendly structure
- Simple content management
- Low-cost / free hosting compatibility
- Easy future maintenance

The project uses a build-based static website structure and can be deployed through GitHub Pages or another static hosting service.

## Content Management

Website content is organized separately from the application code where possible.

This allows authorized administrators to update:

- Project information
- Project statistics
- Images
- About-page content
- Contact information
- Donation information
- Social media links
- Website updates

The project includes a CMS configuration for GitHub-based content management.

## Donation

The website includes a dedicated donation section designed to provide:

- Donation information
- Suggested donation amounts
- Nepal-based bank information
- Bank QR code for donations
- Instructions for donors

Official bank and account information should only be added using verified information provided by BIMBA Nepal.

## Project Status

**Current stage:** Website development / content integration

The current version includes the core website structure and organizational content. Further work may include:

- Adding official photographs
- Completing contact information
- Adding verified bank/account details
- Completing CMS authentication
- Adding project galleries
- Adding future updates/news
- Final testing
- Production deployment

## Development

### Requirements

You will need:

- Node.js
- npm
- Git

### Install dependencies

```bash
npm install
```

### View available scripts

```bash
npm run
```

### Build the website

```bash
npm run build
```

The production output is generated according to the project's build configuration.

## Deployment

The website can be deployed using a free static hosting service such as **GitHub Pages**, provided the repository and build configuration are set up correctly.

Before production deployment, verify:

1. The production build completes successfully.
2. All internal links work.
3. Images load correctly.
4. Donation QR codes are correct.
5. Contact information is verified.
6. Mobile layouts work correctly.
7. The sitemap is accessible.
8. `robots.txt` is configured correctly.
9. GitHub Pages points to the correct build output.

## Repository Structure

A simplified project structure is:

```text
newbimba/
├── site/
│   └── content/
├── src/
├── scripts/
├── public/
├── build.js
├── package.json
├── README.md
├── sitemap.xml
└── robots.txt
```

The exact structure may change as development continues.

## Principles

The website should reflect BIMBA Nepal's approach:

**Listen → Identify → Connect → Serve → Respond → Learn**

The website should communicate BIMBA Nepal's work accurately and should avoid overstating the organization's size, history, impact or achievements.

All statistics, organizational information, partner names, donation information and program details should be based on verified BIMBA Nepal information.

## Credits

**BIMBA Nepal**

**Health • Longevity • Service**

> **Healing Community and Empowering Life.**

© BIMBA Nepal. All rights reserved.
