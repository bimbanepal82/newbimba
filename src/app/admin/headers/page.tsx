'use client';

import React, { useEffect, useState } from 'react';
import { SiteSettings } from '@/lib/data';
import { Save, Check, AlertCircle, Upload, Eye } from 'lucide-react';

export default function AdminHeadersPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [chipsInput, setChipsInput] = useState('');

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch('/api/admin/settings');
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to load settings');
        setSettings(data);
        if (data.focus?.chips) {
          setChipsInput(data.focus.chips.join(', '));
        }
      } catch (err) {
        console.error('Failed to load settings:', err);
        setMessage({ type: 'error', text: 'Failed to load settings' });
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    setSaving(true);
    setMessage(null);

    // parse chips
    const updatedSettings = {
      ...settings,
      focus: {
        ...settings.focus,
        chips: chipsInput.split(',').map((c) => c.trim()).filter(Boolean),
      },
    };

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedSettings),
      });

      if (!res.ok) {
        throw new Error('Save failed');
      }

      const result = await res.json();
      setSettings(result.settings);
      setMessage({ type: 'success', text: 'Headers and site settings updated successfully!' });
    } catch (err) {
      setMessage({ type: 'error', text: 'Error saving settings. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, targetField: 'logo' | 'heroMark') => {
    const file = e.target.files?.[0];
    if (!file || !settings) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'uploads');

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.url) {
        if (targetField === 'logo') {
          setSettings({
            ...settings,
            site: { ...settings.site, logo: data.url },
          });
        } else if (targetField === 'heroMark') {
          setSettings({
            ...settings,
            hero: { ...settings.hero, heroMark: data.url },
          });
        }
        setMessage({ type: 'success', text: `Uploaded and set ${targetField} successfully!` });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Image upload failed' });
    }
  };

  if (loading || !settings) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--admin-muted)' }}>
        Loading header &amp; site settings...
      </div>
    );
  }

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1.5rem',
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.8rem', margin: 0 }}>Headers &amp; Site Content</h1>
          <p style={{ color: 'var(--admin-muted)', margin: '0.2rem 0 0' }}>
            Modify homepage headers, hero section headline, CTA buttons, and brand images.
          </p>
        </div>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="btn btn-primary"
          style={{ gap: '0.5rem' }}
        >
          <Save size={16} />
          {saving ? 'Saving changes...' : 'Save All Changes'}
        </button>
      </div>

      {message && (
        <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-error'}`}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {message.type === 'success' ? <Check size={18} /> : <AlertCircle size={18} />}
            <span>{message.text}</span>
          </div>
        </div>
      )}

      {/* Live Hero Preview Box */}
      <div className="admin-card" style={{ background: '#fcfdfd', border: '2px dashed var(--admin-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--blue)' }}>
          <Eye size={18} />
          <h2 style={{ fontSize: '1.1rem', margin: 0 }}>Live Hero Header Preview</h2>
        </div>
        <div
          style={{
            background: 'linear-gradient(180deg, var(--green-tint), #fff)',
            padding: '2rem',
            borderRadius: '12px',
            border: '1px solid var(--line)',
          }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 0.6fr', gap: '2rem', alignItems: 'center' }}>
            <div>
              <p className="eyebrow">{settings.hero?.eyebrow || 'Eyebrow text'}</p>
              <h1 style={{ fontSize: '2rem', margin: '0.3rem 0 0.8rem' }}>{settings.hero?.title || 'Main Title'}</h1>
              <p className="lead" style={{ fontSize: '1.05rem', margin: '0 0 1.2rem' }}>
                {settings.hero?.lead || 'Hero description lead text'}
              </p>
              <div style={{ display: 'flex', gap: '0.8rem' }}>
                <span className="btn btn-primary btn-sm">{settings.hero?.primaryBtnText || 'Our work'}</span>
                <span className="btn btn-donate btn-sm">{settings.hero?.secondaryBtnText || 'Donate'}</span>
              </div>
            </div>
            {settings.hero?.heroMark && (
              <div style={{ textAlign: 'center' }}>
                <img
                  src={settings.hero.heroMark}
                  alt="Hero Mark"
                  style={{ maxHeight: '160px', margin: 'auto' }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <form onSubmit={handleSave}>
        {/* Section 1: Hero Section Details */}
        <div className="admin-card">
          <div className="admin-card-header">
            <div>
              <h2>Hero Section (Homepage Top Header)</h2>
              <p>Customize the primary headline, lead text, and action buttons</p>
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group full-width">
              <label className="form-label">
                Hero Eyebrow (Small Tagline Above Title)
              </label>
              <input
                type="text"
                className="form-input"
                value={settings.hero?.eyebrow || ''}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    hero: { ...settings.hero, eyebrow: e.target.value },
                  })
                }
                placeholder="e.g. Health • Longevity • Service"
              />
            </div>

            <div className="form-group full-width">
              <label className="form-label">
                Main Hero Title / Headline
              </label>
              <input
                type="text"
                className="form-input"
                value={settings.hero?.title || ''}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    hero: { ...settings.hero, title: e.target.value },
                  })
                }
                placeholder="e.g. Healing Community, Empowering Life"
              />
            </div>

            <div className="form-group full-width">
              <label className="form-label">
                Hero Lead Paragraph
              </label>
              <textarea
                className="form-textarea"
                rows={3}
                value={settings.hero?.lead || ''}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    hero: { ...settings.hero, lead: e.target.value },
                  })
                }
              />
            </div>

            <div className="form-group">
              <label className="form-label">Primary Button Text</label>
              <input
                type="text"
                className="form-input"
                value={settings.hero?.primaryBtnText || ''}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    hero: { ...settings.hero, primaryBtnText: e.target.value },
                  })
                }
              />
            </div>

            <div className="form-group">
              <label className="form-label">Primary Button Link</label>
              <input
                type="text"
                className="form-input"
                value={settings.hero?.primaryBtnLink || ''}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    hero: { ...settings.hero, primaryBtnLink: e.target.value },
                  })
                }
              />
            </div>

            <div className="form-group">
              <label className="form-label">Secondary Button Text</label>
              <input
                type="text"
                className="form-input"
                value={settings.hero?.secondaryBtnText || ''}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    hero: { ...settings.hero, secondaryBtnText: e.target.value },
                  })
                }
              />
            </div>

            <div className="form-group">
              <label className="form-label">Secondary Button Link</label>
              <input
                type="text"
                className="form-input"
                value={settings.hero?.secondaryBtnLink || ''}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    hero: { ...settings.hero, secondaryBtnLink: e.target.value },
                  })
                }
              />
            </div>

            <div className="form-group full-width">
              <label className="form-label">
                Hero Mark / Graphic Image URL
                <span className="hint">Path or upload new image below</span>
              </label>
              <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                <input
                  type="text"
                  className="form-input"
                  value={settings.hero?.heroMark || ''}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      hero: { ...settings.hero, heroMark: e.target.value },
                    })
                  }
                />
                <label className="btn btn-outline btn-sm" style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}>
                  <Upload size={14} /> Upload Graphic
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={(e) => handleFileUpload(e, 'heroMark')}
                  />
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Site Branding & Logo */}
        <div className="admin-card">
          <div className="admin-card-header">
            <div>
              <h2>Site Branding &amp; Header Logo</h2>
              <p>Organization name, navigation bar logo, and global metadata</p>
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Organization Name</label>
              <input
                type="text"
                className="form-input"
                value={settings.site?.name || ''}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    site: { ...settings.site, name: e.target.value },
                  })
                }
              />
            </div>

            <div className="form-group">
              <label className="form-label">Tagline</label>
              <input
                type="text"
                className="form-input"
                value={settings.site?.tagline || ''}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    site: { ...settings.site, tagline: e.target.value },
                  })
                }
              />
            </div>

            <div className="form-group full-width">
              <label className="form-label">
                Header Logo URL
                <span className="hint">Shown on all page headers</span>
              </label>
              <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                <input
                  type="text"
                  className="form-input"
                  value={settings.site?.logo || ''}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      site: { ...settings.site, logo: e.target.value },
                    })
                  }
                />
                <label className="btn btn-outline btn-sm" style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}>
                  <Upload size={14} /> Upload Logo
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={(e) => handleFileUpload(e, 'logo')}
                  />
                </label>
              </div>
              {settings.site?.logo && (
                <div style={{ marginTop: '0.8rem', padding: '0.6rem', background: '#F8FAFC', border: '1px solid var(--admin-border)', borderRadius: '6px', display: 'inline-block' }}>
                  <img src={settings.site.logo} alt="Header Logo Preview" style={{ height: '40px', width: 'auto' }} />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Section 3: Homepage Sections & Focus Chips */}
        <div className="admin-card">
          <div className="admin-card-header">
            <div>
              <h2>Homepage Focus Areas &amp; Vision</h2>
              <p>Pill chips, vision statements, and Dignified Ageing highlight</p>
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group full-width">
              <label className="form-label">
                Current Focus Areas (Pill Chips)
                <span className="hint">Separate items with commas</span>
              </label>
              <textarea
                className="form-textarea"
                rows={3}
                value={chipsInput}
                onChange={(e) => setChipsInput(e.target.value)}
                placeholder="Community health, Women's wellbeing, Healthy and dignified ageing..."
              />
            </div>

            <div className="form-group full-width">
              <label className="form-label">Vision Headline</label>
              <input
                type="text"
                className="form-input"
                value={settings.vision?.title || ''}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    vision: { ...settings.vision, title: e.target.value },
                  })
                }
              />
            </div>

            <div className="form-group full-width">
              <label className="form-label">Vision Description Paragraph 1</label>
              <textarea
                className="form-textarea"
                rows={2}
                value={settings.vision?.p1 || ''}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    vision: { ...settings.vision, p1: e.target.value },
                  })
                }
              />
            </div>

            <div className="form-group full-width">
              <label className="form-label">Dignified Ageing Section Title</label>
              <input
                type="text"
                className="form-input"
                value={settings.dignifiedAgeing?.title || ''}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    dignifiedAgeing: { ...settings.dignifiedAgeing, title: e.target.value },
                  })
                }
              />
            </div>
          </div>
        </div>

        {/* Section 4: Contact & Social Info */}
        <div className="admin-card">
          <div className="admin-card-header">
            <div>
              <h2>Contact &amp; Social Links</h2>
              <p>Official communication channels</p>
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Official Email</label>
              <input
                type="email"
                className="form-input"
                value={settings.contact?.email || ''}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    contact: { ...settings.contact, email: e.target.value },
                  })
                }
              />
            </div>

            <div className="form-group">
              <label className="form-label">Location</label>
              <input
                type="text"
                className="form-input"
                value={settings.contact?.location || ''}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    contact: { ...settings.contact, location: e.target.value },
                  })
                }
              />
            </div>

            <div className="form-group">
              <label className="form-label">Facebook Profile URL</label>
              <input
                type="url"
                className="form-input"
                value={settings.contact?.facebookUrl || ''}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    contact: { ...settings.contact, facebookUrl: e.target.value },
                  })
                }
              />
            </div>

            <div className="form-group">
              <label className="form-label">Instagram Profile URL</label>
              <input
                type="url"
                className="form-input"
                value={settings.contact?.instagramUrl || ''}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    contact: { ...settings.contact, instagramUrl: e.target.value },
                  })
                }
              />
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
          <button
            type="submit"
            disabled={saving}
            className="btn btn-primary"
            style={{ padding: '0.8rem 2rem', gap: '0.5rem' }}
          >
            <Save size={18} />
            {saving ? 'Saving...' : 'Save All Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}
