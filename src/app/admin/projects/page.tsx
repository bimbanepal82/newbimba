'use client';

import React, { useEffect, useState } from 'react';
import { ProjectItem, ProjectStat, ProjectPhoto } from '@/lib/data';
import { PlusCircle, Edit3, Trash2, Check, AlertCircle, Save, X, Upload, ExternalLink, Plus } from 'lucide-react';
import Link from 'next/link';

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/admin/projects');
      const data = await res.json();
      setProjects(data);
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to load projects' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreateNew = () => {
    setEditingProject({
      id: '',
      title: '',
      slug: '',
      eyebrow: '',
      location: '',
      location_short: '',
      date_text: '',
      status: 'Completed',
      sort_order: projects.length + 1,
      short_description: '',
      featured_image: '/assets/projects/placeholder.svg',
      stats_title: 'Program Highlights',
      stats: [
        { value: '100+', label: 'People served' }
      ],
      content: '',
      photos: [],
      published: true,
    });
  };

  const handleEdit = (project: ProjectItem) => {
    setEditingProject({
      ...project,
      stats: project.stats || [],
      photos: project.photos || [],
    });
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      const res = await fetch(`/api/admin/projects?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setMessage({ type: 'success', text: `Project "${title}" deleted successfully` });
        fetchProjects();
      } else {
        throw new Error('Delete failed');
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to delete project' });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;

    setSaving(true);
    setMessage(null);

    const projectToSave = {
      ...editingProject,
      slug:
        editingProject.slug.trim() ||
        editingProject.title
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-'),
    };

    try {
      const res = await fetch('/api/admin/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectToSave),
      });

      if (!res.ok) throw new Error('Save failed');

      setMessage({ type: 'success', text: 'Project saved successfully!' });
      setEditingProject(null);
      fetchProjects();
    } catch (err) {
      setMessage({ type: 'error', text: 'Error saving project' });
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingProject) return;

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
        setEditingProject({ ...editingProject, featured_image: data.url });
        setMessage({ type: 'success', text: 'Featured image uploaded!' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Image upload failed' });
    }
  };

  // Stats Helpers
  const addStat = () => {
    if (!editingProject) return;
    setEditingProject({
      ...editingProject,
      stats: [...editingProject.stats, { value: '', label: '' }],
    });
  };

  const updateStat = (index: number, field: keyof ProjectStat, val: string) => {
    if (!editingProject) return;
    const newStats = [...editingProject.stats];
    newStats[index][field] = val;
    setEditingProject({ ...editingProject, stats: newStats });
  };

  const removeStat = (index: number) => {
    if (!editingProject) return;
    const newStats = editingProject.stats.filter((_, i) => i !== index);
    setEditingProject({ ...editingProject, stats: newStats });
  };

  if (loading) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--admin-muted)' }}>
        Loading projects...
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
          <h1 style={{ fontSize: '1.8rem', margin: 0 }}>Manage Projects</h1>
          <p style={{ color: 'var(--admin-muted)', margin: '0.2rem 0 0' }}>
            Create and edit community health initiatives, camps, and emergency response programs.
          </p>
        </div>
        {!editingProject && (
          <button onClick={handleCreateNew} className="btn btn-primary" style={{ gap: '0.5rem' }}>
            <PlusCircle size={16} /> Add New Project
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

      {editingProject ? (
        <div className="admin-card">
          <div className="admin-card-header">
            <div>
              <h2>{editingProject.id ? 'Edit Project' : 'Create New Project'}</h2>
              <p>Configure project information, location, reach statistics, and photos.</p>
            </div>
            <button
              onClick={() => setEditingProject(null)}
              className="btn btn-outline btn-sm"
            >
              <X size={16} /> Cancel
            </button>
          </div>

          <form onSubmit={handleSave}>
            <div className="form-grid">
              <div className="form-group full-width">
                <label className="form-label">Project Title</label>
                <input
                  type="text"
                  className="form-input"
                  value={editingProject.title}
                  onChange={(e) =>
                    setEditingProject({
                      ...editingProject,
                      title: e.target.value,
                      slug: editingProject.id
                        ? editingProject.slug
                        : e.target.value
                            .toLowerCase()
                            .replace(/[^\w\s-]/g, '')
                            .replace(/\s+/g, '-'),
                    })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">URL Slug</label>
                <input
                  type="text"
                  className="form-input"
                  value={editingProject.slug}
                  onChange={(e) => setEditingProject({ ...editingProject, slug: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Eyebrow / Tag</label>
                <input
                  type="text"
                  className="form-input"
                  value={editingProject.eyebrow}
                  onChange={(e) => setEditingProject({ ...editingProject, eyebrow: e.target.value })}
                  placeholder="e.g. Bhimdhunga, Nuwakot"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Full Location</label>
                <input
                  type="text"
                  className="form-input"
                  value={editingProject.location}
                  onChange={(e) => setEditingProject({ ...editingProject, location: e.target.value })}
                  placeholder="e.g. Bhimdhunga Health Post, Nagarjun Municipality–8"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Status</label>
                <select
                  className="form-select"
                  value={editingProject.status}
                  onChange={(e) => setEditingProject({ ...editingProject, status: e.target.value })}
                >
                  <option value="Completed">Completed</option>
                  <option value="Ongoing">Ongoing</option>
                  <option value="Planned">Planned</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Sort Order</label>
                <input
                  type="number"
                  className="form-input"
                  value={editingProject.sort_order}
                  onChange={(e) =>
                    setEditingProject({
                      ...editingProject,
                      sort_order: parseInt(e.target.value, 10) || 1,
                    })
                  }
                />
              </div>

              <div className="form-group">
                <label className="form-label">Date Text</label>
                <input
                  type="text"
                  className="form-input"
                  value={editingProject.date_text}
                  onChange={(e) => setEditingProject({ ...editingProject, date_text: e.target.value })}
                  placeholder="e.g. Bhadra 20, 2083"
                />
              </div>

              <div className="form-group full-width">
                <label className="form-label">Featured Image URL</label>
                <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                  <input
                    type="text"
                    className="form-input"
                    value={editingProject.featured_image || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, featured_image: e.target.value })}
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
              </div>

              <div className="form-group full-width">
                <label className="form-label">Short Description</label>
                <textarea
                  className="form-textarea"
                  rows={2}
                  value={editingProject.short_description}
                  onChange={(e) => setEditingProject({ ...editingProject, short_description: e.target.value })}
                  required
                />
              </div>

              {/* Stats Counters */}
              <div className="form-group full-width" style={{ background: '#F8FAFC', padding: '1.2rem', borderRadius: '8px', border: '1px solid var(--admin-border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
                  <div>
                    <strong style={{ fontSize: '0.95rem' }}>Program Reach / Stats Counters</strong>
                    <div style={{ fontSize: '0.82rem', color: 'var(--admin-muted)' }}>Numbers and labels shown on the project page</div>
                  </div>
                  <button type="button" onClick={addStat} className="btn btn-outline btn-sm">
                    <Plus size={14} /> Add Stat
                  </button>
                </div>

                <div className="form-group">
                  <label className="form-label">Stats Section Title</label>
                  <input
                    type="text"
                    className="form-input"
                    value={editingProject.stats_title}
                    onChange={(e) => setEditingProject({ ...editingProject, stats_title: e.target.value })}
                    placeholder="e.g. Program reach, Key Highlights"
                  />
                </div>

                {editingProject.stats.map((stat, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '0.8rem', alignItems: 'center', marginTop: '0.6rem' }}>
                    <input
                      type="text"
                      className="form-input"
                      style={{ width: '130px' }}
                      placeholder="e.g. 137"
                      value={stat.value}
                      onChange={(e) => updateStat(idx, 'value', e.target.value)}
                    />
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Total registrations"
                      value={stat.label}
                      onChange={(e) => updateStat(idx, 'label', e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => removeStat(idx)}
                      className="btn btn-danger btn-sm"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="form-group full-width">
                <label className="form-label">
                  Detailed Content
                  <span className="hint">Supports Markdown (## for sections, - for lists, **bold**)</span>
                </label>
                <textarea
                  className="form-textarea"
                  rows={10}
                  value={editingProject.content}
                  onChange={(e) => setEditingProject({ ...editingProject, content: e.target.value })}
                  required
                />
              </div>

              <div className="form-group full-width">
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', fontWeight: 600 }}>
                  <input
                    type="checkbox"
                    checked={editingProject.published}
                    onChange={(e) => setEditingProject({ ...editingProject, published: e.target.checked })}
                    style={{ width: '18px', height: '18px' }}
                  />
                  <span>Publish this project (Visible to public visitors on /projects)</span>
                </label>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.8rem', marginTop: '1.5rem', borderTop: '1px solid var(--admin-border)', paddingTop: '1.2rem' }}>
              <button
                type="button"
                onClick={() => setEditingProject(null)}
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
                {saving ? 'Saving...' : 'Save Project'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Project Title</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th>Published</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((proj) => (
                  <tr key={proj.id}>
                    <td style={{ fontWeight: 700, color: 'var(--admin-muted)', width: '60px' }}>
                      #{proj.sort_order}
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--navy)' }}>{proj.title}</div>
                      <div style={{ fontSize: '0.82rem', color: 'var(--admin-muted)' }}>/projects/{proj.slug}</div>
                    </td>
                    <td style={{ fontSize: '0.88rem' }}>{proj.location_short || proj.location}</td>
                    <td>
                      <span style={{ fontSize: '0.85rem', background: '#F1F5F9', padding: '0.2rem 0.6rem', borderRadius: '4px' }}>
                        {proj.status}
                      </span>
                    </td>
                    <td>
                      <span className={`badge-status ${proj.published ? 'badge-published' : 'badge-draft'}`}>
                        {proj.published ? 'Active' : 'Hidden'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                        {proj.published && (
                          <Link
                            href={`/projects/${proj.slug}`}
                            target="_blank"
                            className="btn btn-outline btn-sm"
                            title="View project on live site"
                          >
                            <ExternalLink size={14} />
                          </Link>
                        )}
                        <button
                          onClick={() => handleEdit(proj)}
                          className="btn btn-outline btn-sm"
                        >
                          <Edit3 size={14} /> Edit
                        </button>
                        <button
                          onClick={() => handleDelete(proj.id, proj.title)}
                          className="btn btn-danger btn-sm"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
