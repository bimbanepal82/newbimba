'use client';

import React, { useEffect, useRef, useState } from 'react';
import { BlogPost } from '@/lib/data';
import { PlusCircle, Edit3, Trash2, Check, AlertCircle, Save, X, Upload, ExternalLink, Link2 } from 'lucide-react';
import Link from 'next/link';

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);
  const [linkText, setLinkText] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchBlogs = async () => {
    try {
      const res = await fetch('/api/admin/blogs');
      const data = await res.json();
      setBlogs(data);
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to load blogs' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleCreateNew = () => {
    setEditingBlog({
      id: '',
      title: '',
      slug: '',
      category: "Women's Health",
      date: new Date().toISOString().split('T')[0],
      author: 'BIMBA Nepal Team',
      summary: '',
      content: '',
      coverImage: '/assets/projects/placeholder.svg',
      published: true,
    });
  };

  const handleEdit = (blog: BlogPost) => {
    setEditingBlog({ ...blog });
  };

  const handleInsertLink = () => {
    if (!editingBlog) return;

    const url = linkUrl.trim();
    const isSafeUrl =
      /^https?:\/\/\S+$/i.test(url) ||
      /^mailto:\S+@\S+\.\S+$/i.test(url) ||
      (/^\/(?!\/)/.test(url) && !/[<>\s]/.test(url));

    if (!isSafeUrl) {
      setMessage({ type: 'error', text: 'Enter a valid https://, http://, mailto:, or site-relative link.' });
      return;
    }

    const textarea = contentRef.current;
    const start = textarea?.selectionStart ?? editingBlog.content.length;
    const end = textarea?.selectionEnd ?? start;
    const selectedText = editingBlog.content.slice(start, end);
    const label = (linkText.trim() || selectedText || url).replace(/[\[\]]/g, '');
    const markdownLink = `[${label}](${url})`;
    const content = `${editingBlog.content.slice(0, start)}${markdownLink}${editingBlog.content.slice(end)}`;

    setEditingBlog({ ...editingBlog, content });
    setLinkText('');
    setLinkUrl('');
    requestAnimationFrame(() => {
      textarea?.focus();
      textarea?.setSelectionRange(start + markdownLink.length, start + markdownLink.length);
    });
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete the blog "${title}"?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/blogs?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setMessage({ type: 'success', text: `Blog "${title}" was deleted` });
        fetchBlogs();
      } else {
        throw new Error('Delete failed');
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to delete blog post' });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBlog) return;

    setSaving(true);
    setMessage(null);

    // Auto slug if empty
    const blogToSave = {
      ...editingBlog,
      slug:
        editingBlog.slug.trim() ||
        editingBlog.title
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-'),
    };

    try {
      const res = await fetch('/api/admin/blogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(blogToSave),
      });

      if (!res.ok) throw new Error('Failed to save');

      setMessage({ type: 'success', text: 'Blog post saved successfully!' });
      setEditingBlog(null);
      fetchBlogs();
    } catch (err) {
      setMessage({ type: 'error', text: 'Error saving blog post' });
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingBlog) return;

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
        setEditingBlog({ ...editingBlog, coverImage: data.url });
        setMessage({ type: 'success', text: 'Cover image uploaded and set!' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Image upload failed' });
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--admin-muted)' }}>
        Loading blogs...
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
          <h1 style={{ fontSize: '1.8rem', margin: 0 }}>Manage Blogs &amp; News</h1>
          <p style={{ color: 'var(--admin-muted)', margin: '0.2rem 0 0' }}>
            Publish updates, project stories, and community health announcements.
          </p>
        </div>
        {!editingBlog && (
          <button onClick={handleCreateNew} className="btn btn-primary" style={{ gap: '0.5rem' }}>
            <PlusCircle size={16} /> Create New Blog
          </button>
        )}
      </div>

      {message && (
        <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-error'}`}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {message.type === 'success' ? <Check size={18} /> : <AlertCircle size={18} />}
            <span>{message.text}</span>
          </div>
        </div>
      )}

      {/* Blog Editor Form */}
      {editingBlog ? (
        <div className="admin-card">
          <div className="admin-card-header">
            <div>
              <h2>{editingBlog.id ? 'Edit Blog Post' : 'Create New Blog Post'}</h2>
              <p>Fill out the details below. Content supports formatted markdown paragraphs and headings.</p>
            </div>
            <button
              onClick={() => setEditingBlog(null)}
              className="btn btn-outline btn-sm"
              title="Close editor"
            >
              <X size={16} /> Cancel
            </button>
          </div>

          <form onSubmit={handleSave}>
            <div className="form-grid">
              <div className="form-group full-width">
                <label className="form-label">Blog Title</label>
                <input
                  type="text"
                  className="form-input"
                  value={editingBlog.title}
                  onChange={(e) =>
                    setEditingBlog({
                      ...editingBlog,
                      title: e.target.value,
                      slug:
                        editingBlog.id
                          ? editingBlog.slug
                          : e.target.value
                              .toLowerCase()
                              .replace(/[^\w\s-]/g, '')
                              .replace(/\s+/g, '-'),
                    })
                  }
                  required
                  placeholder="e.g. Free Geriatric Health Camp in Mathatirtha"
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  URL Slug
                  <span className="hint">Used in /news/[slug] URL</span>
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={editingBlog.slug}
                  onChange={(e) => setEditingBlog({ ...editingBlog, slug: e.target.value })}
                  placeholder="e.g. free-geriatric-health-camp"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Category</label>
                <input
                  type="text"
                  className="form-input"
                  value={editingBlog.category}
                  onChange={(e) => setEditingBlog({ ...editingBlog, category: e.target.value })}
                  placeholder="e.g. Dignified Ageing, Women's Health, Emergency Relief"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Publication Date</label>
                <input
                  type="date"
                  className="form-input"
                  value={editingBlog.date}
                  onChange={(e) => setEditingBlog({ ...editingBlog, date: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Author Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={editingBlog.author}
                  onChange={(e) => setEditingBlog({ ...editingBlog, author: e.target.value })}
                />
              </div>

              <div className="form-group full-width">
                <label className="form-label">Cover Image URL</label>
                <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                  <input
                    type="text"
                    className="form-input"
                    value={editingBlog.coverImage || ''}
                    onChange={(e) => setEditingBlog({ ...editingBlog, coverImage: e.target.value })}
                    placeholder="/assets/projects/placeholder.svg or /uploads/..."
                  />
                  <label className="btn btn-outline btn-sm" style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}>
                    <Upload size={14} /> Upload Image
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={handleImageUpload}
                    />
                  </label>
                </div>
                {editingBlog.coverImage && (
                  <div style={{ marginTop: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                    <img
                      src={editingBlog.coverImage}
                      alt="Preview"
                      style={{ height: '60px', width: '90px', objectFit: 'cover', borderRadius: '6px', border: '1px solid var(--admin-border)' }}
                    />
                    <span style={{ fontSize: '0.8rem', color: 'var(--admin-muted)' }}>Cover image preview</span>
                  </div>
                )}
              </div>

              <div className="form-group full-width">
                <label className="form-label">Summary / Short Excerpt</label>
                <textarea
                  className="form-textarea"
                  rows={2}
                  value={editingBlog.summary}
                  onChange={(e) => setEditingBlog({ ...editingBlog, summary: e.target.value })}
                  placeholder="A brief overview shown in article cards and search results..."
                  required
                />
              </div>

              <div className="form-group full-width">
                <label className="form-label">
                  Full Article Content
                  <span className="hint">
                    Separate paragraphs with double newlines. Use ## for headings. Links use [link text](https://example.com).
                  </span>
                </label>
                <textarea
                  ref={contentRef}
                  className="form-textarea"
                  rows={10}
                  value={editingBlog.content}
                  onChange={(e) => setEditingBlog({ ...editingBlog, content: e.target.value })}
                  placeholder="Write the full post here..."
                  required
                />
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.6rem', marginTop: '0.6rem' }}>
                  <input
                    type="text"
                    className="form-input"
                    aria-label="Link text"
                    value={linkText}
                    onChange={(e) => setLinkText(e.target.value)}
                    placeholder="Link text (optional)"
                    style={{ flex: '1 1 12rem' }}
                  />
                  <input
                    type="text"
                    className="form-input"
                    aria-label="Link URL"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    placeholder="https://example.com"
                    style={{ flex: '2 1 16rem' }}
                  />
                  <button type="button" className="btn btn-outline btn-sm" onClick={handleInsertLink}>
                    <Link2 size={14} /> Insert Link
                  </button>
                </div>
              </div>

              <div className="form-group full-width" style={{ marginTop: '0.5rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', fontWeight: 600 }}>
                  <input
                    type="checkbox"
                    checked={editingBlog.published}
                    onChange={(e) => setEditingBlog({ ...editingBlog, published: e.target.checked })}
                    style={{ width: '18px', height: '18px' }}
                  />
                  <span>Publish this post (Visible to public visitors on /news)</span>
                </label>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.8rem', marginTop: '1.5rem', borderTop: '1px solid var(--admin-border)', paddingTop: '1.2rem' }}>
              <button
                type="button"
                onClick={() => setEditingBlog(null)}
                className="btn btn-outline"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="btn btn-primary"
                style={{ gap: '0.5rem' }}
              >
                <Save size={16} />
                {saving ? 'Saving...' : 'Save Blog Post'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* Blog Posts Table */
        <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Post Title</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {blogs.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: 'var(--admin-muted)' }}>
                      No blogs created yet. Click "Create New Blog" above to start!
                    </td>
                  </tr>
                ) : (
                  blogs.map((blog) => (
                    <tr key={blog.id}>
                      <td>
                        <div style={{ fontWeight: 600, color: 'var(--navy)' }}>{blog.title}</div>
                        <div style={{ fontSize: '0.82rem', color: 'var(--admin-muted)' }}>/news/{blog.slug}</div>
                      </td>
                      <td>
                        <span style={{ fontSize: '0.88rem', background: '#F1F5F9', padding: '0.2rem 0.6rem', borderRadius: '4px' }}>
                          {blog.category}
                        </span>
                      </td>
                      <td style={{ fontSize: '0.88rem', color: 'var(--admin-muted)' }}>{blog.date}</td>
                      <td>
                        <span className={`badge-status ${blog.published ? 'badge-published' : 'badge-draft'}`}>
                          {blog.published ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                          {blog.published && (
                            <Link
                              href={`/news/${blog.slug}`}
                              target="_blank"
                              className="btn btn-outline btn-sm"
                              title="View published article"
                            >
                              <ExternalLink size={14} />
                            </Link>
                          )}
                          <button
                            onClick={() => handleEdit(blog)}
                            className="btn btn-outline btn-sm"
                            title="Edit blog"
                          >
                            <Edit3 size={14} /> Edit
                          </button>
                          <button
                            onClick={() => handleDelete(blog.id, blog.title)}
                            className="btn btn-danger btn-sm"
                            title="Delete blog"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
