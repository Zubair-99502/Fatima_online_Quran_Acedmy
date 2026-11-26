'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, ArrowRight, BookOpen, Eye, EyeOff, LayoutDashboard,
  LockKeyhole, ShieldCheck, Users, GraduationCap, Inbox, Loader2,
} from 'lucide-react';

/** Dedicated Maxton-inspired login screen; authentication stays server-side. */
export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function submit(event) {
    event.preventDefault();
    if (loading) return;
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Could not sign in. Check your details.');
      }
      router.replace('/admin/dashboard');
      router.refresh();
    } catch (err) {
      setError(err.message || 'Could not sign in. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="maxton-login-shell">
      <aside className="maxton-login-aside" aria-label="Academy admin introduction">
        <Link className="maxton-login-brand" href="/" aria-label="Fatima Academy homepage">
          <span className="maxton-login-brandmark"><BookOpen size={25}/></span>
          <span className="maxton-login-brandtext"><strong>Fatima</strong><small>ONLINE QURAN ACADEMY</small></span>
        </Link>

        <div className="maxton-login-aside-center">
          <span className="maxton-login-eyebrow"><span className="maxton-login-eyebrow-dot"/> ACADEMY ADMIN WORKSPACE</span>
          <h1>Welcome back to <em>your workspace.</em></h1>
          <p>One place to manage learning, student records, teacher information and admission inquiries.</p>
          <div className="maxton-login-feature-list" aria-label="Admin workspace features">
            <span><LayoutDashboard size={18}/> Dashboard overview</span>
            <span><Users size={18}/> Teacher management</span>
            <span><GraduationCap size={18}/> Student records</span>
            <span><Inbox size={18}/> Admission inquiries</span>
          </div>
        </div>
        <div className="maxton-login-aside-bottom"><ShieldCheck size={17}/> Private access for academy administrators</div>
      </aside>

      <section className="maxton-login-content" aria-labelledby="admin-login-heading">
        <div className="maxton-login-topline">
          <span className="maxton-login-section-label"><span className="maxton-login-accent-line"/> ADMIN PORTAL</span>
          <Link href="/" className="maxton-login-back"><ArrowLeft size={16}/> Back to website</Link>
        </div>

        <div className="maxton-login-center">
          <div className="maxton-login-mobile-brand">
            <span className="maxton-login-brandmark"><BookOpen size={24}/></span>
            <span className="maxton-login-brandtext"><strong>Fatima</strong><small>ONLINE QURAN ACADEMY</small></span>
          </div>
          <form onSubmit={submit} className="maxton-login-card" aria-describedby="login-help">
            <div className="maxton-login-card-head">
              <div className="maxton-login-card-icon"><LockKeyhole size={24}/></div>
              <span className="maxton-login-eyebrow">WELCOME BACK</span>
              <h2 id="admin-login-heading">Admin sign in</h2>
              <p id="login-help">Sign in with your academy administrator account.</p>
            </div>

            <label htmlFor="admin-email" className="maxton-login-label">Email address</label>
            <input
              id="admin-email"
              name="email"
              className="maxton-login-input"
              type="email"
              autoComplete="username"
              inputMode="email"
              autoCapitalize="none"
              spellCheck={false}
              required
              value={email}
              onChange={event => setEmail(event.target.value)}
              placeholder="Enter admin email"
              disabled={loading}
            />

            <label htmlFor="admin-password" className="maxton-login-label">Password</label>
            <div className="maxton-login-password-wrap">
              <input
                id="admin-password"
                name="password"
                className="maxton-login-input"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                value={password}
                onChange={event => setPassword(event.target.value)}
                placeholder="Enter password"
                disabled={loading}
              />
              <button
                type="button"
                className="maxton-login-password-toggle"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                aria-pressed={showPassword}
                onClick={() => setShowPassword(s => !s)}
              >
                {showPassword ? <EyeOff size={19}/> : <Eye size={19}/>}
              </button>
            </div>

            {error && <div className="maxton-login-error" role="alert">{error}</div>}
            <button type="submit" className="maxton-login-submit" disabled={loading}>
              {loading ? <><Loader2 size={18} className="maxton-login-spinner"/> Signing in...</> : <>Sign in to dashboard <ArrowRight size={18}/></>}
            </button>
            <div className="maxton-login-security"><ShieldCheck size={17}/> Protected admin session using an HTTP-only cookie.</div>
          </form>
          <p className="maxton-login-under-card">Fatima Online Quran Academy · Secure administration</p>
        </div>
        <div className="maxton-login-footer">© {new Date().getFullYear()} Fatima Online Quran Academy</div>
      </section>
    </main>
  );
}
