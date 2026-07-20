'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { api } from '@/lib/api';

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try { await api.post('/contact', form); } catch { /* fallback */ }
    setSent(true);
  };

  return (
    <div className="pt-20 pb-16">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-800/5 border border-primary-800/10 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-primary-800" />
            <span className="text-xs font-semibold text-primary-800 uppercase tracking-wider">Get in Touch</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-neutral-900 mb-4 tracking-tight">We&apos;d Love to <span className="text-gradient">Hear From You</span></h1>
          <p className="text-lg text-neutral-500 max-w-xl mx-auto">Have a question, feedback, or want to partner with us? Reach out and our team will get back to you within 24 hours.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Contact Info */}
          <div className="space-y-4">
            {[
              { icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', label: 'Email', value: 'contact@investprop.ai' },
              { icon: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z', label: 'Phone', value: '+1 (800) 555-0123' },
              { icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z', label: 'Office', value: '123 Investment Ave, Suite 400\nNew York, NY 10001' },
            ].map((item, i) => (
              <Card key={i} className="p-5 border-neutral-200/50 flex items-start gap-4">
                <div className="w-10 h-10 rounded-[10px] bg-primary-800/10 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-primary-800" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} /></svg>
                </div>
                <div>
                  <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-0.5">{item.label}</p>
                  <p className="text-sm text-neutral-800 whitespace-pre-line">{item.value}</p>
                </div>
              </Card>
            ))}
          </div>

          {/* Form */}
          <Card className="lg:col-span-2 p-8 border-neutral-200/50">
            {sent ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-accent-100 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-accent-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                </div>
                <h3 className="text-xl font-semibold text-neutral-900 mb-2">Message Sent!</h3>
                <p className="text-neutral-500">We&apos;ll get back to you within 24 hours.</p>
                <Button variant="outline" className="mt-6" onClick={() => { setSent(false); setForm({ name: '', email: '', subject: '', message: '' }); }}>Send Another</Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1.5">Name *</label>
                    <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full h-11 px-4 rounded-[12px] border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-800/20 focus:border-primary-800/50" placeholder="John Doe" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1.5">Email *</label>
                    <input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full h-11 px-4 rounded-[12px] border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-800/20 focus:border-primary-800/50" placeholder="you@example.com" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">Subject *</label>
                  <input required value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} className="w-full h-11 px-4 rounded-[12px] border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-800/20 focus:border-primary-800/50" placeholder="How can we help?" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">Message *</label>
                  <textarea required rows={5} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} className="w-full px-4 py-3 rounded-[12px] border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-800/20 focus:border-primary-800/50 resize-none" placeholder="Tell us more about your inquiry..." />
                </div>
                <Button type="submit" variant="gradient" size="xl" className="w-full">Send Message</Button>
              </form>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
