'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const [mode, setMode] = useState<'login' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const supabase = createClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) throw signInError;
      window.location.href = '/account';
    } catch (err: any) {
      if (err?.message?.includes('Invalid login credentials')) {
        setError('Incorrect email or password. Please try again.');
      } else if (err?.message?.includes('Email not confirmed')) {
        setError('Please verify your email address before signing in. Check your inbox.');
      } else {
        setError(err?.message || 'Sign in failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const supabase = createClient();
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?type=recovery`,
      });
      if (resetError) throw resetError;
      setSuccess('Password reset email sent. Please check your inbox.');
    } catch (err: any) {
      setError(err?.message || 'Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel — luxury imagery */}
      <div className="hidden lg:flex lg:w-[52%] relative overflow-hidden bg-[#211B18]">
        <AppImage
          src="/assets/images/IMG-20260320-WA0027-1776665051293.jpg"
          alt="DETARA luxury jewelry"
          fill
          className="object-cover opacity-60"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#211B18]/80 via-[#211B18]/40 to-transparent" />
        {/* Overlay content */}
        <div className="relative z-10 flex flex-col justify-between p-12 xl:p-16 w-full">
          <Link href="/homepage" aria-label="DETARA Home">
            <AppImage
              src="/assets/images/file_000000004f747208abb644f0cadec060-1773492339421.png"
              alt="DETARA"
              width={160}
              height={54}
              className="object-contain h-[42px] w-auto brightness-0 invert"
            />
          </Link>
          <div>
            <div className="w-8 h-[1px] bg-[#B9924A] mb-6" />
            <p className="font-serif text-3xl xl:text-4xl text-white font-light leading-snug mb-4">
              Crafted for those<br />who appreciate<br />the extraordinary.
            </p>
            <p className="text-sm text-white/50 font-light tracking-wide">
              Fine jewellery. Timeless design.
            </p>
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex flex-col min-h-screen bg-[#F3EEE5]">
        {/* Mobile logo */}
        <div className="lg:hidden flex items-center justify-between px-6 pt-8 pb-4">
          <Link href="/homepage">
            <AppImage
              src="/assets/images/file_000000004f747208abb644f0cadec060-1773492339421.png"
              alt="DETARA"
              width={130}
              height={44}
              className="object-contain h-[34px] w-auto"
              style={{ mixBlendMode: 'multiply' }}
            />
          </Link>
          <Link href="/homepage" className="label-caps text-muted hover:text-foreground transition-colors" style={{ fontSize: '9px' }}>
            ← Back
          </Link>
        </div>

        <div className="flex-1 flex items-center justify-center px-6 sm:px-10 py-12">
          <div className="w-full max-w-[400px]">

            {/* Header */}
            <div className="mb-10">
              <p className="label-caps text-accent mb-3 tracking-[0.4em]">
                {mode === 'login' ? 'Welcome Back' : 'Account Recovery'}
              </p>
              <h1 className="heading-serif text-[2rem] md:text-[2.4rem] text-foreground font-light leading-tight mb-4">
                {mode === 'login' ? 'Sign In' : 'Reset Password'}
              </h1>
              <div className="w-8 h-[1px] bg-accent opacity-60" />
            </div>

            {/* Error / Success */}
            {error && (
              <div className="mb-6 flex items-start gap-3 p-4 bg-red-50 border border-red-200">
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                </svg>
                <p className="text-sm text-red-700 font-light">{error}</p>
              </div>
            )}
            {success && (
              <div className="mb-6 flex items-start gap-3 p-4 bg-[#F0F7F0] border border-[#C3DFC3]">
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                </svg>
                <p className="text-sm text-green-700 font-light">{success}</p>
              </div>
            )}

            {mode === 'login' ? (
              <>
                <form className="space-y-5" onSubmit={handleEmailLogin}>
                  <div>
                    <label className="label-caps text-muted block mb-2" style={{ fontSize: '9px' }}>Email Address</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onBlur={() => setTouched(t => ({ ...t, email: true }))}
                      className={`w-full bg-transparent border px-4 py-3.5 text-sm font-light text-foreground placeholder:text-muted focus:outline-none transition-colors ${
                        touched.email && !email ? 'border-red-300 focus:border-red-400' : 'border-[rgba(28,25,23,0.12)] focus:border-foreground'
                      }`}
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label className="label-caps text-muted block mb-2" style={{ fontSize: '9px' }}>Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onBlur={() => setTouched(t => ({ ...t, password: true }))}
                        className={`w-full bg-transparent border px-4 py-3.5 pr-12 text-sm font-light text-foreground placeholder:text-muted focus:outline-none transition-colors ${
                          touched.password && !password ? 'border-red-300 focus:border-red-400' : 'border-[rgba(28,25,23,0.12)] focus:border-foreground'
                        }`}
                        placeholder="Your password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-foreground transition-colors"
                        tabIndex={-1}
                      >
                        {showPassword ? (
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
                            <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" strokeLinecap="round" strokeLinejoin="round" />
                            <line x1="1" y1="1" x2="23" y2="23" strokeLinecap="round" />
                          </svg>
                        ) : (
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" strokeLinecap="round" strokeLinejoin="round" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => { setMode('forgot'); setError(''); setSuccess(''); }}
                      className="label-caps text-muted hover:text-foreground transition-colors"
                      style={{ fontSize: '9px' }}
                    >
                      Forgot password?
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 px-6 bg-foreground text-[#FFFDF8] text-[11px] font-medium tracking-[0.25em] uppercase hover:bg-accent-dark transition-all duration-300 mt-2 disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Signing in...
                      </>
                    ) : 'Sign In'}
                  </button>
                </form>

                <div className="mt-8 pt-8 border-t border-[rgba(28,25,23,0.08)] text-center">
                  <p className="text-sm text-muted font-light">
                    New to DETARA?{' '}
                    <Link href="/register" className="text-foreground hover:text-accent transition-colors underline underline-offset-4">
                      Create an account
                    </Link>
                  </p>
                </div>
              </>
            ) : (
              <>
                <p className="text-sm text-muted font-light mb-8 leading-relaxed">
                  Enter your email address and we&apos;ll send you a secure link to reset your password.
                </p>
                <form className="space-y-5" onSubmit={handleForgotPassword}>
                  <div>
                    <label className="label-caps text-muted block mb-2" style={{ fontSize: '9px' }}>Email Address</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-transparent border border-[rgba(28,25,23,0.12)] px-4 py-3.5 text-sm font-light text-foreground placeholder:text-muted focus:outline-none focus:border-foreground transition-colors"
                      placeholder="your@email.com"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 px-6 bg-foreground text-[#FFFDF8] text-[11px] font-medium tracking-[0.25em] uppercase hover:bg-accent-dark transition-all duration-300 disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Sending...
                      </>
                    ) : 'Send Reset Link'}
                  </button>
                </form>
                <button
                  type="button"
                  onClick={() => { setMode('login'); setError(''); setSuccess(''); }}
                  className="w-full text-center text-sm text-muted font-light mt-6 hover:text-foreground transition-colors flex items-center justify-center gap-1"
                >
                  <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                    <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
                  </svg>
                  Back to Sign In
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
