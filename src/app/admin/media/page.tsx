'use client';

import React, { useEffect, useState } from 'react';
import { MediaFile, SiteSettings } from '@/lib/data';
import { Upload, Copy, Check, Trash2, Image as ImageIcon, AlertCircle, RefreshCw } from 'lucide-react';

export default function AdminMediaPage() {
  const [mediaList, setMediaList] = useState<MediaFile[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const loadData = async () => {
    try {
      const [mediaRes, settingsRes] = await Promise.all([
        fetch('/api/admin/media'),
        fetch('/api/admin/settings'),
      ]);
      const [mediaData, settingsData] = await Promise.all([
        mediaRes.json(),
        settingsRes.json(),
      ]);
      setMediaList(mediaData);
      setSettings(settingsData);
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to load media items' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setMessage(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'uploads');

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');

      setMessage({ type: 'success', text: `Image "${data.fileName}" uploaded successfully!` });
      loadData();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Image upload failed' });
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const handleDelete = async (fileName: string) => {
    if (!confirm(`Are you sure you want to delete ${fileName}?`)) return;

    try {
      const res = await fetch(`/api/admin/media?name=${encodeURIComponent(fileName)}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Delete failed');

      setMessage({ type: 'success', text: 'Image deleted successfully' });
      loadData();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to delete' });
    }
  };

  // Direct Key Image Replacer
  const handleKeyImageReplace = async (
    e: React.ChangeEvent<HTMLInputElement>,
    key: 'logo' | 'heroMark' | 'qrImage' | 'ogImage'
  ) => {
    const file = e.target.files?.[0];
    if (!file || !settings) return;

    setUploading(true);
    setMessage(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'uploads');

    try {
      const uploadRes = await fetch('/api/admin/upload', { method: 'POST', body: formData });
      const uploadData = await uploadRes.json();
      if (!uploadRes.ok) throw new Error(uploadData.error || 'Upload failed');

      const newUrl = uploadData.url;
      let updatedSettings = { ...settings };

      if (key === 'logo') {
        updatedSettings.site = { ...updatedSettings.site, logo: newUrl };
      } else if (key === 'heroMark') {
        updatedSettings.hero = { ...updatedSettings.hero, heroMark: newUrl };
      } else if (key === 'qrImage') {
        updatedSettings.donation = { ...updatedSettings.donation, qrImage: newUrl };
      } else if (key === 'ogImage') {
        updatedSettings.site = { ...updatedSettings.site, ogImage: newUrl };
      }

      const saveRes = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedSettings),
      });

      if (!saveRes.ok) throw new Error('Settings save failed');

      setSettings(updatedSettings);
      setMessage({ type: 'success', text: `Updated ${key} image successfully!` });
      loadData();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to replace image' });
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  if (loading) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--admin-muted)' }}>
        Loading media library...
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
          <h1 style={{ fontSize: '1.8rem', margin: 0 }}>Image &amp; Media Manager</h1>
          <p style={{ color: 'var(--admin-muted)', margin: '0.2rem 0 0' }}>
            Upload, browse, and swap images used across headers, blogs, and donation QR codes.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
          <button onClick={loadData} className="btn btn-outline btn-sm" title="Refresh">
            <RefreshCw size={14} /> Refresh
          </button>
          <label className="btn btn-primary" style={{ cursor: 'pointer', gap: '0.5rem' }}>
            <Upload size={16} />
            {uploading ? 'Uploading...' : 'Upload New Image'}
            <input
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleUpload}
              disabled={uploading}
            />
          </label>
        </div>
      </div>

      {message && (
        <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-error'}`}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {message.type === 'success' ? <Check size={18} /> : <AlertCircle size={18} />}
            <span>{message.text}</span>
          </div>
        </div>
      )}

      {/* Key Site Images Quick-Swap Box */}
      <div className="admin-card">
        <div className="admin-card-header">
          <div>
            <h2>Key Brand &amp; Site Images</h2>
            <p>One-click direct image swap for header logo, donation QR code, and hero graphic</p>
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gap: '1.2rem',
            gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
          }}
        >
          {/* Site Logo */}
          <div style={{ border: '1px solid var(--admin-border)', borderRadius: '10px', padding: '1rem', background: '#F8FAFC' }}>
            <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.5rem', color: 'var(--navy)' }}>
              1. Header Logo
            </div>
            <div style={{ height: '90px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', borderRadius: '6px', padding: '0.5rem', border: '1px solid var(--line)' }}>
              <img src={settings?.site?.logo || '/assets/logo.svg'} alt="Header Logo" style={{ maxHeight: '60px', width: 'auto' }} />
            </div>
            <div style={{ marginTop: '0.8rem', display: 'flex', gap: '0.5rem' }}>
              <label className="btn btn-outline btn-sm" style={{ flex: 1, cursor: 'pointer' }}>
                <Upload size={12} /> Replace Logo
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={(e) => handleKeyImageReplace(e, 'logo')}
                />
              </label>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => handleCopy(settings?.site?.logo || '/assets/logo.svg')}
                title="Copy URL"
              >
                <Copy size={12} />
              </button>
            </div>
          </div>

          {/* Hero Graphic / Mark */}
          <div style={{ border: '1px solid var(--admin-border)', borderRadius: '10px', padding: '1rem', background: '#F8FAFC' }}>
            <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.5rem', color: 'var(--navy)' }}>
              2. Hero Graphic / Mark
            </div>
            <div style={{ height: '90px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', borderRadius: '6px', padding: '0.5rem', border: '1px solid var(--line)' }}>
              <img src={settings?.hero?.heroMark || '/assets/logo-mark.svg'} alt="Hero Mark" style={{ maxHeight: '75px', width: 'auto' }} />
            </div>
            <div style={{ marginTop: '0.8rem', display: 'flex', gap: '0.5rem' }}>
              <label className="btn btn-outline btn-sm" style={{ flex: 1, cursor: 'pointer' }}>
                <Upload size={12} /> Replace Hero Graphic
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={(e) => handleKeyImageReplace(e, 'heroMark')}
                />
              </label>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => handleCopy(settings?.hero?.heroMark || '/assets/logo-mark.svg')}
                title="Copy URL"
              >
                <Copy size={12} />
              </button>
            </div>
          </div>

          {/* Donation Bank QR Code */}
          <div style={{ border: '1px solid var(--admin-border)', borderRadius: '10px', padding: '1rem', background: '#F8FAFC' }}>
            <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.5rem', color: 'var(--navy)' }}>
              3. Donation Bank QR Code
            </div>
            <div style={{ height: '90px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', borderRadius: '6px', padding: '0.5rem', border: '1px solid var(--line)' }}>
              <img src={settings?.donation?.qrImage || '/assets/donation-qr.svg'} alt="Donation QR" style={{ maxHeight: '75px', width: 'auto' }} />
            </div>
            <div style={{ marginTop: '0.8rem', display: 'flex', gap: '0.5rem' }}>
              <label className="btn btn-outline btn-sm" style={{ flex: 1, cursor: 'pointer' }}>
                <Upload size={12} /> Replace Bank QR
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={(e) => handleKeyImageReplace(e, 'qrImage')}
                />
              </label>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => handleCopy(settings?.donation?.qrImage || '/assets/donation-qr.svg')}
                title="Copy URL"
              >
                <Copy size={12} />
              </button>
            </div>
          </div>

          {/* Social Share / OG Image */}
          <div style={{ border: '1px solid var(--admin-border)', borderRadius: '10px', padding: '1rem', background: '#F8FAFC' }}>
            <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.5rem', color: 'var(--navy)' }}>
              4. Social Share (OG) Image
            </div>
            <div style={{ height: '90px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', borderRadius: '6px', padding: '0.5rem', border: '1px solid var(--line)' }}>
              <img src={settings?.site?.ogImage || '/assets/og-default.svg'} alt="OG Image" style={{ maxHeight: '60px', width: 'auto' }} />
            </div>
            <div style={{ marginTop: '0.8rem', display: 'flex', gap: '0.5rem' }}>
              <label className="btn btn-outline btn-sm" style={{ flex: 1, cursor: 'pointer' }}>
                <Upload size={12} /> Replace OG Image
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={(e) => handleKeyImageReplace(e, 'ogImage')}
                />
              </label>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => handleCopy(settings?.site?.ogImage || '/assets/og-default.svg')}
                title="Copy URL"
              >
                <Copy size={12} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Media Gallery Grid */}
      <div className="admin-card">
        <div className="admin-card-header">
          <div>
            <h2>All Media Assets &amp; Uploaded Photos ({mediaList.length})</h2>
            <p>Click "Copy URL" on any image to paste into blog articles, projects, or headers</p>
          </div>
        </div>

        <div className="media-grid">
          {mediaList.map((item) => {
            const isUpload = item.url.startsWith('/uploads/');
            const isCopied = copiedUrl === item.url;

            return (
              <div key={item.url} className="media-card">
                <div className="media-preview">
                  <img src={item.url} alt={item.name} loading="lazy" />
                </div>
                <div className="media-info">
                  <div className="media-name" title={item.name}>
                    {item.name}
                  </div>
                  <div style={{ color: 'var(--admin-muted)', fontSize: '0.75rem' }}>
                    {formatSize(item.size)}
                  </div>
                </div>
                <div className="media-actions">
                  <button
                    type="button"
                    onClick={() => handleCopy(item.url)}
                    className="btn btn-outline btn-sm"
                    style={{ flex: 1, fontSize: '0.78rem', padding: '0.3rem 0.5rem' }}
                  >
                    {isCopied ? <Check size={12} color="#15803D" /> : <Copy size={12} />}
                    <span>{isCopied ? 'Copied!' : 'Copy URL'}</span>
                  </button>
                  {isUpload && (
                    <button
                      type="button"
                      onClick={() => handleDelete(item.name)}
                      className="btn btn-danger btn-sm"
                      style={{ padding: '0.3rem 0.5rem' }}
                      title="Delete upload"
                    >
                      <Trash2 size={12} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
