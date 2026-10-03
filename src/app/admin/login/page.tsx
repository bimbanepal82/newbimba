'use client';

import { AlertCircle, ArrowLeft, Lock, ShieldCheck, User } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('bimba@admin2026');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }

      router.push('/admin');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        background: 'linear-gradient(135deg, #07529A 0%, #0B2E52 100%)',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          background: '#fff',
          borderRadius: '16px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
          padding: '2.5rem',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'var(--blue-tint)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem',
            }}
          >
            <ShieldCheck size={32} color='#07529A' />
          </div>
          <h1
            style={{
              fontSize: '1.75rem',
              marginBottom: '0.4rem',
              color: 'var(--navy)',
            }}
          >
            BIMBA CPanel
          </h1>
          <p
            style={{
              color: 'var(--admin-muted)',
              fontSize: '0.92rem',
              margin: 0,
            }}
          >
            Inbuilt Admin Content Management Panel
          </p>
        </div>

        {error && (
          <div className='alert alert-error'>
            <div
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          </div>
        )}

        <form
          onSubmit={handleLogin}
          style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}
        >
          <div className='form-group' style={{ margin: 0 }}>
            <label className='form-label' htmlFor='username'>
              Username
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id='username'
                type='text'
                className='form-input'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                style={{ paddingLeft: '2.4rem' }}
              />
              <User
                size={16}
                color='#64748b'
                style={{
                  position: 'absolute',
                  left: '0.8rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                }}
              />
            </div>
          </div>

          <div className='form-group' style={{ margin: 0 }}>
            <label className='form-label' htmlFor='password'>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id='password'
                type='password'
                className='form-input'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ paddingLeft: '2.4rem' }}
              />
              <Lock
                size={16}
                color='#64748b'
                style={{
                  position: 'absolute',
                  left: '0.8rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                }}
              />
            </div>
          </div>

          {/* <div
            style={{
              background: '#f8fafc',
              border: '1px dashed #cbd5e1',
              borderRadius: '8px',
              padding: '0.75rem',
              fontSize: '0.82rem',
              color: '#475569',
            }}
          >
            <strong>Default Static Credentials:</strong>
            <br />
            User: <code>admin</code> | Pass: <code>bimba@admin2026</code>
          </div> */}

          <button
            type='submit'
            className='btn btn-primary'
            disabled={loading}
            style={{
              width: '100%',
              padding: '0.8rem',
              borderRadius: '8px',
              marginTop: '0.5rem',
            }}
          >
            {loading ? 'Signing in...' : 'Sign In to Admin Panel'}
          </button>
        </form>

        <div style={{ marginTop: '1.8rem', textAlign: 'center' }}>
          <Link
            href='/'
            style={{
              color: 'var(--muted)',
              fontSize: '0.88rem',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            <ArrowLeft size={14} /> Back to public website
          </Link>
        </div>
      </div>
    </div>
  );
}
