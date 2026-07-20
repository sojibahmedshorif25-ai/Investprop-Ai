'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); setSent(true); }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 pt-24">
      <div className="w-full max-w-[400px]">
        <Card className="p-8">
          {sent ? (
            <div className="text-center">
              <div className="w-14 h-14 rounded-full bg-accent-100 flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-accent-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </div>
              <h2 className="text-xl font-bold text-primary-800 mb-2">Check Your Email</h2>
              <p className="text-sm text-neutral-500 mb-6">We&apos;ve sent a password reset link to <strong className="text-neutral-700">{email}</strong></p>
              <Link href="/login"><Button variant="outline" className="w-full">Back to Sign In</Button></Link>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-bold text-primary-800 mb-2">Reset Your Password</h2>
              <p className="text-sm text-neutral-500 mb-6">Enter your email address and we&apos;ll send you a reset link.</p>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="text-sm font-medium text-neutral-700 mb-1.5 block">Email Address</label>
                  <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com"
                    className="flex h-10 w-full rounded-[12px] border border-neutral-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-800" />
                </div>
                <Button type="submit" className="w-full" loading={loading}>Send Reset Link</Button>
              </form>
              <p className="text-center mt-6 text-sm text-neutral-500">
                Remember your password?{' '}
                <Link href="/login" className="text-primary-800 font-medium hover:underline">Sign in</Link>
              </p>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
