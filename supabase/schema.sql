-- ==============================================================================
-- BIMBA NEPAL — SUPABASE DATABASE SCHEMA & INITIAL DATA
-- ==============================================================================
-- Run this script in your Supabase SQL Editor (Dashboard -> SQL Editor -> New Query).
-- It will set up the tables, storage buckets, RLS policies, and seed initial data.

-- 1. Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- TABLE: admin_users (Stores admin credentials, username, hashed password)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    email TEXT,
    role TEXT DEFAULT 'admin',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Only service role / server can query or modify admin_users table
CREATE POLICY "Admin users restricted to service role"
    ON public.admin_users
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- Seed initial admin user:
-- Username: admin
-- Password: bimba@admin2026 (bcrypt hash: $2b$10$smS9H/xU9uCVyhc/G3.r0.AN3HWGXN24fSPWCyyvYmTUmQXF2wxAO)
INSERT INTO public.admin_users (username, password_hash, email, role)
VALUES (
    'admin',
    '$2b$10$smS9H/xU9uCVyhc/G3.r0.AN3HWGXN24fSPWCyyvYmTUmQXF2wxAO',
    'mail@bimba.org.np',
    'admin'
)
ON CONFLICT (username) DO NOTHING;


-- ==============================================================================
-- TABLE: blogs (Stores blog posts, news, and community health stories)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.blogs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    category TEXT DEFAULT 'Update',
    date TEXT,
    author TEXT DEFAULT 'BIMBA Nepal Team',
    summary TEXT,
    content TEXT NOT NULL,
    cover_image TEXT,
    published BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;

-- Allow public read access to published blogs
CREATE POLICY "Public read published blogs"
    ON public.blogs
    FOR SELECT
    TO anon, authenticated
    USING (published = true);

-- Allow service role full access
CREATE POLICY "Service role full access to blogs"
    ON public.blogs
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- Seed Initial Blogs
INSERT INTO public.blogs (slug, title, category, date, author, summary, content, cover_image, published)
VALUES
(
    'women-wellbeing-health-camp',
    'Community Health Camp on Women Wellbeing Concluded at Bhimdhunga',
    'Women''s Health',
    '2026-09-15',
    'BIMBA Nepal Team',
    'BIMBA Nepal organized a dedicated community health camp at Bhimdhunga Health Post focusing on maternal and geriatric health, ultrasound screening, and medical consultations.',
    'BIMBA Nepal, in active coordination with Nagarjun Municipality, successfully organized a comprehensive free health camp at Bhimdhunga Health Post, Nagarjun Municipality–8.

The program placed particular emphasis on women''s health while also providing vital diagnostic, medical, and screening services for community members. It brought together dedicated healthcare professionals, local volunteers, and municipal representatives.

Over 137 community members registered for consultations, and 115 individuals benefited from video X-ray and radiologist consultant services. The community feedback highlighted the critical importance of bringing preventive healthcare directly to the grassroots level.',
    '/assets/projects/placeholder.svg',
    true
),
(
    'health-longevity-initiative-mathatirtha',
    'Pilot Project on Health Longevity Service at Mathatirtha',
    'Dignified Ageing',
    '2026-09-20',
    'BIMBA Nepal Team',
    'Promoting healthy and dignified ageing through comprehensive geriatric health assessments, pulmonary function testing, and early screening at Mathatirtha.',
    'At Mathatirtha Health Post, Chandragiri Municipality–8, BIMBA Nepal initiated a specialized health program centered on the theme of ''स्वाभिमानी बुढ्यौली — Dignified Ageing''.

The initiative focused on community members aged 60 and above, alongside women and general residents. Services included geriatric assessments, physician consultations, pulmonary function tests supported by Cipla Nepal, and essential medicines distribution.

Early screening identified several critical conditions that enabled timely referrals to tertiary healthcare facilities, reiterating the value of community-based preventive action.',
    '/assets/projects/placeholder.svg',
    true
),
(
    'emergency-response-flood-affected-bidur',
    'Emergency Response and Psychosocial Relief in Bidur–Trishuli',
    'Emergency Relief',
    '2026-09-28',
    'BIMBA Nepal Team',
    'Rapid health response camp and trauma counselling organized for 200 flood-affected individuals in Nuwakot, restoring vital chronic medicines for older citizens.',
    'Following flash floods and debris flows in the Nuwakot and Trishuli regions, immediate humanitarian assistance was needed to support displaced families and older citizens whose continuous medications were lost in the disaster.

Partnering with the Geriatric Society of Nepal and Art of Living Nepal, BIMBA Nepal established an emergency medical and trauma relief center at Ranabhumaneshwar School in Sirkhali.

The camp treated 200 affected people, including 101 senior citizens, providing cardiac evaluation, orthopedic checkups, essential medicines, and trauma relief sessions.',
    '/assets/projects/emergency-response-bidur-trishuli/photo-1.svg',
    true
)
ON CONFLICT (slug) DO NOTHING;


-- ==============================================================================
-- TABLE: projects (Stores community initiatives, camps, and programs)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    eyebrow TEXT,
    location TEXT,
    location_short TEXT,
    date_text TEXT,
    status TEXT DEFAULT 'Completed',
    sort_order INTEGER DEFAULT 1,
    short_description TEXT,
    featured_image TEXT,
    stats_title TEXT,
    stats JSONB DEFAULT '[]'::jsonb,
    content TEXT NOT NULL,
    photos JSONB DEFAULT '[]'::jsonb,
    published BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read published projects"
    ON public.projects
    FOR SELECT
    TO anon, authenticated
    USING (published = true);

CREATE POLICY "Service role full access to projects"
    ON public.projects
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- Seed Initial Projects
INSERT INTO public.projects (slug, title, eyebrow, location, location_short, date_text, status, sort_order, short_description, featured_image, stats_title, stats, content, photos, published)
VALUES
(
    'women-wellbeing-bhimdhunga',
    'Pilot Project on Women Wellbeing',
    'Bhimdhunga',
    'Bhimdhunga Health Post, Nagarjun Municipality–8',
    'Bhimdhunga',
    '2083',
    'Completed',
    1,
    'A community health initiative focused on women''s health and well-being, while providing broader screening and medical services.',
    '/assets/projects/placeholder.svg',
    'Program reach',
    '[
      {"value": "137", "label": "Total registrations"},
      {"value": "115", "label": "Video X-ray / Radiologist Consultant services"},
      {"value": "91", "label": "Physician & Geriatric consultation"},
      {"value": "64", "label": "Gynecology consultation"}
    ]'::jsonb,
    'The first program was developed as a **Pilot Project on Women Wellbeing**, with the objective of bringing relevant healthcare and screening services closer to women and the wider community.

BIMBA Nepal, in coordination with **Nagarjun Municipality**, organized a free health camp at **Bhimdhunga Health Post, Nagarjun Municipality–8**.

The program placed particular emphasis on women''s health while also providing diagnostic, medical and screening services for community members. It brought together health professionals, volunteers, local representatives and community members.

## Services included

- Women''s health and gynecology consultation
- Gynecology specialist services
- Video X-ray
- Radiologist consultation
- Physician consultation
- Geriatric health consultation
- Non-communicable disease (NCD) screening

## Why Women Wellbeing?

Women''s health is inseparable from the health of families and communities.
Yet access to appropriate healthcare can be affected by distance, awareness, cost, time and other social and practical barriers.',
    '[{"url": "/assets/projects/placeholder.svg", "caption": "Health camp registration and patient consultation"}]'::jsonb,
    true
),
(
    'health-longevity-service-mathatirtha',
    'Pilot Project on Health Longevity Service',
    'Mathatirtha, Chandragiri',
    'Mathatirtha Health Post, Chandragiri Municipality–8',
    'Mathatirtha, Chandragiri',
    '2083',
    'Completed',
    2,
    'A community health initiative focused particularly on older people, healthy ageing, geriatric services and early identification of health concerns.',
    '/assets/projects/placeholder.svg',
    'Program reach & focus',
    '[
      {"value": "60+", "label": "Target age group focused on healthy & dignified ageing"},
      {"value": "1", "label": "Acute condition identified & hospital transfer coordinated"},
      {"value": "5+", "label": "Specialized health services & medicine support"}
    ]'::jsonb,
    'The second initiative developed from BIMBA Nepal''s interest in **health, longevity and dignified ageing**.

The **Pilot Project on Health Longevity Service** was conducted at **Mathatirtha Health Post, Chandragiri Municipality–8**.

The program particularly focused on people aged 60 and above while also extending relevant services to women and other members of the surrounding community.

## Services included

- Geriatric health assessment
- Geriatric consultation
- Physician consultation
- Blood pressure testing
- Blood sugar testing
- Video X-ray
- Gynecology consultation
- Women''s health services
- Pulmonary Function Test
- Respiratory assessment
- Specialist consultation
- Medicines and health materials',
    '[{"url": "/assets/projects/placeholder.svg", "caption": "Senior citizen geriatric consultation and health checkup"}]'::jsonb,
    true
),
(
    'emergency-response-bidur-trishuli',
    'Emergency Response Project',
    'Bidur–Trishuli',
    'Ranabhumaneshwar School (holding center), Sirkhali, Bidur Municipality–3, Nuwakot',
    'Bidur–Trishuli',
    'Bhadra 20, 2083',
    'Completed',
    3,
    'A response to the health needs of communities affected by the flash flood/debris flood, with particular attention to older people, continuity of medicines and psychosocial well-being.',
    '/assets/projects/placeholder.svg',
    '200 people served',
    '[
      {"value": "200", "label": "people received health examination and medical consultation"},
      {"value": "101", "label": "were older persons (48 women, 53 men)"},
      {"value": "60", "label": "older persons and family members received stress-management and psychosocial counselling"}
    ]'::jsonb,
    'When communities in the Rasuwa and Trishuli/Bhotekoshi area were affected by a flash flood/debris flood following the fall of glacier/ice mass in the high Himalayan region around Rasuwa, immediate humanitarian and health needs arose.

Among those affected were older people who had lost medicines that they regularly depended upon.

BIMBA Nepal, Geriatric Society of Nepal and Art of Living Nepal jointly organized a free health camp on Bhadra 20, 2083, at the holding center of Ranabhumaneshwar School, Sirkhali, Bidur Municipality–3, Nuwakot.

## A health response during crisis

### Services included

- Geriatric consultation
- General medical examination
- Orthopedic services
- Cardiac assessment
- Dental services
- Osteopathy services
- Trauma relief
- Stress management
- Psychosocial counselling
- Medicines and health materials',
    '[
      {"url": "/assets/projects/emergency-response-bidur-trishuli/photo-1.svg", "caption": "Emergency camp registration and medical triage"},
      {"url": "/assets/projects/emergency-response-bidur-trishuli/photo-2.svg", "caption": "Doctor consultation and medication distribution"},
      {"url": "/assets/projects/emergency-response-bidur-trishuli/photo-3.svg", "caption": "Psychosocial counselling and trauma support session"}
    ]'::jsonb,
    true
)
ON CONFLICT (slug) DO NOTHING;


-- ==============================================================================
-- TABLE: media (Stores records of uploaded photos, documents, and assets)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    url TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_type TEXT,
    size INTEGER,
    bucket TEXT DEFAULT 'media',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read media records"
    ON public.media
    FOR SELECT
    TO anon, authenticated
    USING (true);

CREATE POLICY "Service role full access to media"
    ON public.media
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);


-- ==============================================================================
-- TABLE: site_settings (Stores headers, hero, navigation, and contact)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.site_settings (
    id TEXT PRIMARY KEY DEFAULT 'global',
    data JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read site settings"
    ON public.site_settings
    FOR SELECT
    TO anon, authenticated
    USING (true);

CREATE POLICY "Service role full access to site settings"
    ON public.site_settings
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- Seed site settings
INSERT INTO public.site_settings (id, data)
VALUES (
    'global',
    '{
      "site": {
        "name": "BIMBA NEPAL",
        "tagline": "Health • Longevity • Service",
        "description": "BIMBA Nepal is a community-oriented organization working toward healthier communities and more empowered lives through health services, community engagement, partnership and responsive action.",
        "logo": "/assets/logo.svg",
        "logoMark": "/assets/logo-mark.svg",
        "favicon": "/favicon.svg",
        "ogImage": "/assets/og-default.svg"
      },
      "nav": {
        "links": [
          { "label": "Home", "href": "/" },
          { "label": "About", "href": "/about" },
          { "label": "Projects", "href": "/projects" },
          { "label": "News", "href": "/news" },
          { "label": "Contact", "href": "/contact" }
        ],
        "donateButtonText": "Donate",
        "donateButtonHref": "/donate"
      },
      "hero": {
        "eyebrow": "Health • Longevity • Service",
        "title": "Healing Community, Empowering Life",
        "lead": "BIMBA Nepal is a community-oriented organization working toward healthier communities and more empowered lives through health services, community engagement, partnership and responsive action.",
        "primaryBtnText": "Our work",
        "primaryBtnLink": "/projects",
        "secondaryBtnText": "Donate",
        "secondaryBtnLink": "/donate",
        "heroMark": "/assets/logo-mark.svg"
      },
      "aboutTeaser": {
        "title": "About BIMBA NEPAL",
        "p1": "Our current work focuses on Health, Longevity and Service, with particular attention to women''s well-being, healthy and dignified ageing, community health and emergency response.",
        "p2": "We believe that a healthy community is built not only by responding to illness, but by understanding people''s needs, identifying health concerns early, creating access to appropriate services and standing with people when circumstances become difficult.",
        "linkText": "More about us",
        "linkHref": "/about"
      },
      "vision": {
        "eyebrow": "Our Vision",
        "title": "Healing Community and Empowering Life",
        "p1": "BIMBA Nepal envisions communities where people have the opportunity to live healthier, longer and more fulfilling lives, with access to appropriate support, healthcare, knowledge and opportunities to participate actively in their communities.",
        "p2": "Our vision is not limited to treating illness. It is about creating healthier communities where people can prevent, identify, respond to and recover from health challenges together."
      },
      "focus": {
        "title": "Our Current Focus",
        "lead": "BIMBA Nepal is currently focused on developing work around",
        "chips": [
          "Community health",
          "Women''s wellbeing",
          "Healthy and dignified ageing",
          "Geriatric health",
          "Preventive healthcare",
          "Health screening and early identification",
          "Access to specialist health services",
          "Health awareness",
          "Emergency health response",
          "Psychosocial well-being",
          "Community-based support",
          "Collaboration and partnership"
        ]
      },
      "dignifiedAgeing": {
        "eyebrow": "Dignified Ageing",
        "title": "स्वाभिमानी बुढ्यौली — Dignified Ageing",
        "p1": "We believe that longevity should not simply mean adding years to life. It should mean adding health, independence, dignity, purpose and quality to those years.",
        "p2": "Ageing is a natural part of life. Older people should be able to remain respected, connected and supported within their families and communities."
      },
      "supportCta": {
        "title": "Support our work",
        "lead": "You can support BIMBA NEPAL by donating through the official bank QR code.",
        "btnText": "Donate",
        "btnLink": "/donate"
      },
      "donation": {
        "qrImage": "/assets/donation-qr.svg",
        "bankName": "Kumari Bank",
        "branchName": "Samakhushi Branch",
        "accountNumber": "2420363121500001",
        "amounts": [500, 1000, 2500, 5000, 10000]
      },
      "contact": {
        "email": "mail@bimba.org.np",
        "location": "Kathmandu, Nepal",
        "facebookUrl": "https://www.facebook.com/profile.php?id=61590730554027",
        "facebookLabel": "BIMBA NEPAL on Facebook",
        "instagramUrl": "https://www.instagram.com/bimba_nepal_org/",
        "instagramLabel": "@bimba_nepal_org"
      }
    }'::jsonb
)
ON CONFLICT (id) DO NOTHING;


-- ==============================================================================
-- 5. SUPABASE STORAGE: "media" bucket for photos and documents
-- ==============================================================================
-- Create the public bucket "media" in Supabase Storage if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage Policies:
-- Allow anyone to view/read media files (photos and documents)
CREATE POLICY "Public Access for Media Bucket"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'media');

-- Allow service role or authenticated admins to insert media files
CREATE POLICY "Service Role Insert Media"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'media');

-- Allow service role to update media files
CREATE POLICY "Service Role Update Media"
    ON storage.objects FOR UPDATE
    USING (bucket_id = 'media');

-- Allow service role to delete media files
CREATE POLICY "Service Role Delete Media"
    ON storage.objects FOR DELETE
    USING (bucket_id = 'media');
