'use client';
import { useEffect } from 'react';

const INTERVAL = 24 * 60 * 60 * 1000; 
const CHECK_EVERY = 10 * 60 * 1000;

function ping() {
  try {
    const last = Number(localStorage.getItem('ping_supabase_at') || 0);
    if (Date.now() - last < INTERVAL) return;
    localStorage.setItem('ping_supabase_at', String(Date.now()));
  } catch {
    /* Just ping */
  }
  fetch('/api/pingSupabase', { cache: 'no-store' }).catch(() => {});
}

export default function PingSupabase() {
  useEffect(() => {
    ping();
    const id = setInterval(ping, CHECK_EVERY);
    return () => clearInterval(id);
  }, []);

  return null;
}