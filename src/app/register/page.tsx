'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import { createClient } from '@/lib/supabase/client';

export default function RegisterPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const passwordStrength = password.length === 0 ? 0 : password.length < 8 ? 1 : password.length < 12 ? 2 : 3;
  const strengthLabel = ['', 'Weak', 'Good', 'Strong'];
  const strengthColor = ['', 'bg-red-400', 'bg-yellow-400', 'bg-green-500'];

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const supabase = createClient();
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: `${firstName} ${lastName}`.trim() },
          emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
        },
      });
      if (signUpError) throw signUpError;
      if (data.user && !data.session) {
        // Send welcome email (non-blocking)
        fetch('/api/email/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'welcome',
            data: { to: email, customerName: `${firstName} ${lastName}`.trim() || firstName },
          }),
        }).catch(() => {});
        setSuccess('Account created! Please check your email to verify your account.');
      } else if (data.session) {
        // Send welcome email (non-blocking)
        fetch('/api/email/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'welcome',
            data: { to: email, customerName: `${firstName} ${lastName}`.trim() || firstName },
          }),
        }).catch(() => {});
        window.location.href = '/account';
      }
    } catch (err: any) {
      if (err?.message?.includes('already registered')) {
        setError('An account with this email already exists. Please sign in.');
      } else {
        setError(err?.message || 'Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel — luxury imagery */}
      <div className="hidden lg:flex lg:w-[52%] relative overflow-hidden bg-[#211B18]">
        <AppImage
          src="/assets/images/1000018091-1776115875572.jpg"
          alt="DETARA luxury jewelry craftsmanship"
          fill
          className="object-cover opacity-55"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#211B18]/80 via-[#211B18]/40 to-transparent" />
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
            <p className="font-serif text-3xl xl:text-4xl text-foreground font-light leading-snug mb-4">
              Begin your journey<br />into the world of<br />fine jewellery.
            </p>
            <p className="text-sm text-white/50 font-light tracking-wide">
              Exclusive access. Personalised service.
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
          <div className="w-full max-w-[420px]">

            {/* Header */}
            <div className="mb-10">
              <p className="label-caps text-accent mb-3 tracking-[0.4em]">Join DETARA</p>
              <h1 className="heading-serif text-[2rem] md:text-[2.4rem] text-foreground font-light leading-tight mb-4">
                Create Account
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

            {success ? (
              <div className="text-center py-8">
                <div className="w-14 h-14 rounded-full bg-[#F0F7F0] border border-[#C3DFC3] flex items-center justify-center mx-auto mb-5">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6 text-green-600">
                    <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h2 className="font-serif text-xl font-light text-foreground mb-2">Check your inbox</h2>
                <p className="text-sm text-muted font-light mb-6 leading-relaxed">{success}</p>
                <Link href="/login" className="label-caps text-foreground hover:text-accent transition-colors underline underline-offset-4" style={{ fontSize: '10px' }}>
                  Return to Sign In
                </Link>
              </div>
            ) : (
              <>
                <form className="space-y-5" onSubmit={handleRegister}>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="label-caps text-muted block mb-2" style={{ fontSize: '9px' }}>First Name</label>
                      <input
                        type="text"
                        required
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        onBlur={() => setTouched(t => ({ ...t, firstName: true }))}
                        className={`w-full bg-transparent border px-4 py-3.5 text-sm font-light text-foreground placeholder:text-muted focus:outline-none transition-colors ${
                          touched.firstName && !firstName ? 'border-red-300' : 'border-[rgba(28,25,23,0.12)] focus:border-foreground'
                        }`}
                        placeholder="First name"
                      />
                    </div>
                    <div>
                      <label className="label-caps text-muted block mb-2" style={{ fontSize: '9px' }}>Last Name</label>
                      <input
                        type="text"
                        required
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        onBlur={() => setTouched(t => ({ ...t, lastName: true }))}
                        className={`w-full bg-transparent border px-4 py-3.5 text-sm font-light text-foreground placeholder:text-muted focus:outline-none transition-colors ${
                          touched.lastName && !lastName ? 'border-red-300' : 'border-[rgba(28,25,23,0.12)] focus:border-foreground'
                        }`}
                        placeholder="Last name"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="label-caps text-muted block mb-2" style={{ fontSize: '9px' }}>Email Address</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onBlur={() => setTouched(t => ({ ...t, email: true }))}
                      className={`w-full bg-transparent border px-4 py-3.5 text-sm font-light text-foreground placeholder:text-muted focus:outline-none transition-colors ${
                        touched.email && !email ? 'border-red-300' : 'border-[rgba(28,25,23,0.12)] focus:border-foreground'
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
                        minLength={8}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onBlur={() => setTouched(t => ({ ...t, password: true }))}
                        className={`w-full bg-transparent border px-4 py-3.5 pr-12 text-sm font-light text-foreground placeholder:text-muted focus:outline-none transition-colors ${
                          touched.password && password.length < 8 && password.length > 0 ? 'border-red-300' : 'border-[rgba(28,25,23,0.12)] focus:border-foreground'
                        }`}
                        placeholder="Minimum 8 characters"
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
                    {/* Password strength */}
                    {password.length > 0 && (
                      <div className="mt-2 flex items-center gap-2">
                        <div className="flex gap-1 flex-1">
                          {[1, 2, 3].map((level) => (
                            <div
                              key={level}
                              className={`h-[2px] flex-1 transition-all duration-300 ${
                                passwordStrength >= level ? strengthColor[passwordStrength] : 'bg-[rgba(28,25,23,0.1)]'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="label-caps text-muted" style={{ fontSize: '8px' }}>{strengthLabel[passwordStrength]}</span>
                      </div>
                    )}
                  </div>

                  <p className="text-xs text-muted font-light leading-relaxed">
                    By creating an account you agree to our{' '}
                    <Link href="/privacy" className="text-foreground underline underline-offset-4">Privacy Policy</Link>{' '}
                    and{' '}
                    <Link href="/terms" className="text-foreground underline underline-offset-4">Terms of Service</Link>.
                  </p>

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
                        Creating Account...
                      </>
                    ) : 'Create Account'}
                  </button>
                </form>

                <div className="mt-8 pt-8 border-t border-[rgba(28,25,23,0.08)] text-center">
                  <p className="text-sm text-muted font-light">
                    Already have an account?{' '}
                    <Link href="/login" className="text-foreground hover:text-accent transition-colors underline underline-offset-4">
                      Sign in
                    </Link>
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
