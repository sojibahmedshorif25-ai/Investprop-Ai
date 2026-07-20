'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

function AnimatedCounter({ target, suffix = '', prefix = '', decimals = 0 }: { target: number; suffix?: string; prefix?: string; decimals?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          let start = 0;
          const duration = 2000;
          const step = Math.ceil(target / (duration / 16));
          const timer = setInterval(() => {
            start += step;
            if (start >= target) { setCount(target); clearInterval(timer); }
            else setCount(start);
          }, 16);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return <div ref={ref} className="text-4xl md:text-5xl font-bold tabular-nums">{prefix}{count.toLocaleString('en-US', { maximumFractionDigits: decimals })}{suffix}</div>;
}

function AnimatedSection({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setTimeout(() => setVisible(true), delay); observer.disconnect(); } },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div ref={ref} className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
      {children}
    </div>
  );
}

const features = [
  { icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6', title: 'AI Investment Scoring', desc: 'Deep neural analysis of market trends, location dynamics, and financial metrics gives each property a precise 0-100 score.', gradient: 'from-primary-800 to-primary-600' },
  { icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', title: 'Smart Recommendations', desc: 'Our AI learns your investment style and matches you with properties that fit your goals, budget, and risk tolerance.', gradient: 'from-accent-600 to-accent-700' },
  { icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z', title: 'Risk Analysis & Alerts', desc: 'Real-time risk monitoring across regulatory, market, and financial dimensions with instant alerts when thresholds are triggered.', gradient: 'from-primary-700 to-primary-900' },
  { icon: 'M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z', title: 'Market Trend Analysis', desc: 'Predictive analytics powered by 15+ data sources give you a clear picture of where markets are heading next quarter and beyond.', gradient: 'from-primary-600 to-primary-800' },
  { icon: 'M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4', title: 'Portfolio Management', desc: 'Unified dashboard with real-time valuations, income tracking, and AI-powered optimization suggestions for your entire portfolio.', gradient: 'from-accent-500 to-accent-700' },
  { icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', title: 'Document Intelligence', desc: 'Upload any real estate document — our AI extracts terms, flags risks, and generates a plain-English summary in seconds.', gradient: 'from-primary-800 to-accent-600' },
];

const steps = [
  { num: '01', title: 'Browse or Upload', desc: 'Search our database of 15,000+ properties or upload your own for instant AI analysis.', color: 'from-primary-800 to-primary-600' },
  { num: '02', title: 'AI Deep Analysis', desc: 'Our multi-model AI evaluates market conditions, legal documents, financial projections, and risk factors simultaneously.', color: 'from-primary-700 to-primary-900' },
  { num: '03', title: 'Investment Score', desc: 'Get a comprehensive 0-100 score with detailed breakdowns across 4 key dimensions of property value.', color: 'from-primary-800 to-accent-600' },
  { num: '04', title: 'Compare & Decide', desc: 'Side-by-side property comparisons with AI-recommended actions based on your unique investment profile.', color: 'from-accent-500 to-accent-700' },
  { num: '05', title: 'Invest with Confidence', desc: 'Make data-backed decisions with full transparency into every metric, projection, and risk factor.', color: 'from-primary-800 to-primary-600' },
];

const faqs = [
  { q: 'How does the AI scoring work?', a: 'Our AI analyzes 4 weighted factors: Market Analysis (30%), Location Quality (25%), Financial Potential (30%), and Legal/Risk Assessment (15%). Each factor is scored independently by specialized models, then combined into a final 0-100 score with full transparency into every component.' },
  { q: 'Is my data secure?', a: 'Enterprise-grade security with AES-256 encryption at rest, TLS 1.3 in transit, SOC 2 compliance framework, and JWT-based authentication with automatic token rotation. Your financial data never touches unencrypted storage.' },
  { q: 'What documents can I analyze?', a: 'We support PDF, DOCX, TXT, PNG, and JPG formats up to 10MB. Our OCR pipeline handles scanned documents, and the AI extracts: document type, key dates, parties, financial terms, legal flags, and actionable recommendations.' },
  { q: 'How accurate are the ROI projections?', a: 'Our models achieve 94% accuracy on 12-month projections by combining historical market data, comparable sales, rental yield analytics, and macroeconomic indicators. We show conservative, moderate, and optimistic scenarios so you understand the full range.' },
  { q: 'Can I export reports?', a: 'Yes — generate comprehensive PDF reports with AI analysis, market trends, 5-year ROI projections, risk assessment, and investment recommendations. Reports are designed for sharing with partners, lenders, and advisors.' },
  { q: 'How often is market data refreshed?', a: 'Market data streams in real-time from 15+ sources including MLS, public records, economic indicators, and rental market platforms. AI scores are recalculated daily or on-demand when property details change.' },
];

const stats = [
  { value: 15000, suffix: '+', label: 'Properties Analyzed' },
  { value: 2500, suffix: '+', label: 'Active Investors' },
  { value: 23, prefix: '+', suffix: '%', label: 'Average ROI Boost' },
  { value: 94, suffix: '%', label: 'Prediction Accuracy' },
];

export default function HomePage() {
  const [email, setEmail] = useState('');
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const [subscribed, setSubscribed] = useState(false);

  return (
    <div>
      {/* ═══════════════ HERO ═══════════════ */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 gradient-hero" />
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-accent-500/20 rounded-full blur-[150px] animate-pulse-soft" style={{ animationDuration: '4s' }} />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-primary-800/20 rounded-full blur-[120px] animate-pulse-soft" style={{ animationDuration: '5s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary-700/10 rounded-full blur-[200px]" />
        </div>
        <div className="absolute inset-0 bg-dot-grid" />
        <div className="absolute inset-0 bg-noise" />

        <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-32 md:py-40">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="max-w-2xl animate-fade-in-up">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/10 backdrop-blur-sm mb-6 hover:bg-white/15 transition-colors duration-300">
                <span className="w-2 h-2 rounded-full bg-accent-400 animate-pulse-soft" />
                <span className="text-xs font-medium text-white/80">AI-Powered Investment Intelligence</span>
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.05] tracking-tight mb-6 text-balance">
                Make Smarter<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-300 via-accent-400 to-accent-500">
                  Property Investments
                </span>
              </h1>
              <p className="text-lg md:text-xl text-white/70 leading-relaxed mb-8 max-w-xl">
                AI-powered market analysis, risk assessment, and personalized recommendations that help you identify the best opportunities with confidence.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 mb-12">
                <Link href="/explore"><Button variant="premium" size="xl" className="bg-white/90 text-primary-800 border-white/30 hover:bg-white hover:border-white/60 shadow-xl shadow-black/10 backdrop-blur-sm">
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                  Explore Properties
                </Button></Link>
                <Link href="/register"><Button variant="outline" size="xl" className="border-white/30 text-white hover:bg-white/10 hover:border-white/50 backdrop-blur-sm">
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                  Get Started Free
                </Button></Link>
              </div>
              <div className="flex items-center gap-8 md:gap-12">
                {stats.slice(0, 3).map((s, i) => (
                  <div key={i} className="group">
                    <div className="text-2xl md:text-3xl font-bold text-white tabular-nums group-hover:scale-105 transition-transform duration-300">{s.prefix}{s.value.toLocaleString()}{s.suffix}</div>
                    <div className="text-xs md:text-sm text-white/50 mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="hidden lg:flex justify-center animate-fade-in-up" style={{ animationDelay: '200ms' }}>
              <div className="relative w-[420px] h-[520px] group">
                <div className="absolute -inset-4 bg-gradient-to-r from-accent-500/10 to-primary-800/10 rounded-[32px] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="absolute inset-0 bg-white/5 rounded-[24px] backdrop-blur-md border border-white/10 shadow-2xl p-8 transition-all duration-500 group-hover:border-white/20 group-hover:shadow-premium">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="flex gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-accent-500/80" /><div className="w-2.5 h-2.5 rounded-full bg-accent-400/80" /><div className="w-2.5 h-2.5 rounded-full bg-accent-300/80" /></div>
                    <span className="text-xs text-white/40 font-medium">AI Investment Dashboard</span>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-[14px] hover:bg-white/10 transition-colors duration-300">
                      <div><div className="text-xs text-white/50">Property Score</div><div className="text-2xl font-bold text-white">78</div></div>
                      <div className="w-16 h-16 rounded-full border-4 border-accent-400/60 flex items-center justify-center text-white font-bold text-lg transition-all duration-300 group-hover:border-accent-400">A</div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {[{ label: 'Market', val: '82', color: 'text-accent-300' }, { label: 'Location', val: '76', color: 'text-accent-400' }, { label: 'Financial', val: '75', color: 'text-accent-400' }, { label: 'Risk', val: '77', color: 'text-accent-300' }].map((item, i) => (
                        <div key={i} className="p-3 bg-white/5 rounded-[12px] hover:bg-white/10 transition-colors duration-300"><div className="text-xs text-white/50">{item.label}</div><div className={`text-lg font-bold ${item.color}`}>{item.val}</div></div>
                      ))}
                    </div>
                    <div className="p-3 bg-white/5 rounded-[12px]">
                      <div className="text-xs text-white/50 mb-2">ROI Projection</div>
                      <div className="flex items-end gap-2 h-16">
                        {[40, 65, 90].map((h, i) => (
                          <div key={i} className="flex-1 bg-gradient-to-t from-accent-400/60 to-accent-400/20 rounded-t-[4px] transition-all duration-500 hover:opacity-80" style={{ height: `${h}%` }} />
                        ))}
                      </div>
                      <div className="flex justify-between text-xs text-white/40 mt-1"><span>Conservative</span><span>Moderate</span><span>Optimistic</span></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce-soft">
          <div className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-1.5 backdrop-blur-sm">
            <div className="w-1.5 h-3 rounded-full bg-white/40 animate-pulse-soft" />
          </div>
        </div>
      </section>

      {/* ═══════════════ FEATURES ═══════════════ */}
      <section className="section-padding relative">
        <div className="absolute inset-0 bg-gradient-mesh pointer-events-none" />
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <div className="section-label">
              <span className="section-dot" />
              <span className="section-tag">Powerful Features</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-neutral-900 mb-4 tracking-tight text-balance">Everything You Need to <span className="text-gradient">Invest Smart</span></h2>
            <p className="text-lg text-neutral-500 max-w-2xl mx-auto leading-relaxed text-pretty">From AI-powered analysis to portfolio management — we&apos;ve built the complete toolkit for modern property investors.</p>
          </AnimatedSection>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <AnimatedSection key={i} delay={i * 80} className="h-full">
                <Card glow className="group p-6 card-hover border-neutral-200/50 hover:border-neutral-200 h-full relative z-10">
                  <div className={`w-12 h-12 rounded-[14px] bg-gradient-to-br ${f.gradient} flex items-center justify-center mb-4 shadow-soft group-hover:shadow-glow group-hover:scale-110 transition-all duration-300`}>
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d={f.icon} /></svg>
                  </div>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-2 group-hover:text-primary-800 transition-colors">{f.title}</h3>
                  <p className="text-sm text-neutral-500 leading-relaxed">{f.desc}</p>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ HOW IT WORKS ═══════════════ */}
      <section className="section-padding bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary-800/[0.015] rounded-full blur-[150px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent-500/[0.015] rounded-full blur-[120px] translate-y-1/2 -translate-x-1/3 pointer-events-none" />
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative">
          <AnimatedSection className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-500/10 border border-accent-500/20 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-500" />
              <span className="text-xs font-semibold text-accent-600 uppercase tracking-wider">Simple Process</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-neutral-900 mb-4 tracking-tight text-balance">Five Steps to <span className="text-gradient-accent">Smarter Investing</span></h2>
            <p className="text-lg text-neutral-500 max-w-2xl mx-auto text-pretty">From discovery to decision — our AI guides you through every step of the investment journey.</p>
          </AnimatedSection>
          <div className="relative">
            <div className="hidden lg:block absolute left-[55px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary-800 via-accent-500 to-accent-400 opacity-20" />
            <div className="space-y-8 lg:space-y-0">
              {steps.map((step, i) => (
                <AnimatedSection key={i} delay={i * 100}>
                  <div className={`lg:flex items-center gap-8 ${i % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
                    <div className={`lg:w-1/2 ${i % 2 === 0 ? 'lg:text-right lg:pr-12' : 'lg:text-left lg:pl-12'} mb-4 lg:mb-0`}>
                      <div className={`inline-block lg:hidden w-12 h-12 rounded-[12px] bg-gradient-to-br ${step.color} flex items-center justify-center text-white font-bold text-sm mb-3 shadow-soft`}>{step.num}</div>
                      <h3 className="text-xl font-semibold text-neutral-900 mb-2">{step.title}</h3>
                      <p className="text-neutral-500 leading-relaxed">{step.desc}</p>
                    </div>
                    <div className="hidden lg:flex items-center justify-center w-14 h-14 rounded-[14px] bg-gradient-to-br shadow-medium shrink-0 relative z-10 transition-all duration-300 hover:scale-110 hover:shadow-glow" style={{ backgroundImage: `linear-gradient(135deg, ${step.color.replace('from-', '').replace('to-', '').replace('bg-', '')})` }}>
                      <span className="text-white font-bold text-sm">{step.num}</span>
                    </div>
                    <div className="lg:w-1/2" />
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ STATISTICS ═══════════════ */}
      <section className="section-padding gradient-card relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-accent-500 rounded-full blur-[180px] animate-pulse-soft" style={{ animationDuration: '6s' }} />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-primary-800/60 rounded-full blur-[150px] animate-pulse-soft" style={{ animationDuration: '8s' }} />
        </div>
        <div className="absolute inset-0 bg-grid-pattern" />
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {stats.map((s, i) => (
              <AnimatedSection key={i} delay={i * 100} className="text-center group">
                <div className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tabular-nums mb-2 group-hover:scale-110 transition-transform duration-300">
                  <AnimatedCounter target={s.value} prefix={s.prefix || ''} suffix={s.suffix || ''} />
                </div>
                <div className="text-sm md:text-base text-white/60 font-medium group-hover:text-white/80 transition-colors duration-300">{s.label}</div>
                <div className="w-12 h-0.5 bg-accent-500/50 mx-auto mt-3 group-hover:w-24 transition-all duration-500" />
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ TESTIMONIALS ═══════════════ */}
      <section className="section-padding bg-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-primary-800/[0.015] rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-accent-500/[0.015] rounded-full blur-[100px] translate-x-1/3 translate-y-1/3 pointer-events-none" />
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative">
          <AnimatedSection className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-500/10 border border-accent-500/20 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-500" />
              <span className="text-xs font-semibold text-accent-600 uppercase tracking-wider">Testimonials</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-neutral-900 mb-4 tracking-tight text-balance">Trusted by <span className="text-gradient-accent">Smart Investors</span></h2>
            <p className="text-lg text-neutral-500 max-w-2xl mx-auto text-pretty">See how our AI-powered insights are helping investors make better decisions every day.</p>
          </AnimatedSection>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: 'James Mitchell', role: 'Independent Investor', avatar: 'JM', quote: 'The AI investment scoring helped me identify a property with 45% ROI that I would have overlooked. It&apos;s like having a team of analysts in my pocket.', rating: 5 },
              { name: 'Priya Patel', role: 'Portfolio Manager', avatar: 'PP', quote: 'I manage 30+ properties and the portfolio dashboard alone saves me 10 hours a week. The risk alerts have prevented two bad deals so far.', rating: 5 },
              { name: 'Michael Torres', role: 'First-Time Buyer', avatar: 'MT', quote: 'As a new investor, I was overwhelmed. The AI recommendations and document analysis made my first purchase feel confident and well-researched.', rating: 5 },
            ].map((t, i) => (
              <AnimatedSection key={i} delay={i * 100} className="h-full">
                <Card glow className="p-6 border-neutral-200/50 group hover:border-neutral-200 transition-all duration-300 h-full relative z-10">
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: t.rating }).map((_, s) => (
                      <svg key={s} className="w-4 h-4 text-accent-500 fill-accent-500 transition-all duration-300 group-hover:scale-110 group-hover:text-accent-400" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                    ))}
                  </div>
                  <p className="text-sm text-neutral-600 leading-relaxed mb-6">&ldquo;{t.quote}&rdquo;</p>
                  <div className="flex items-center gap-3 mt-auto">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-800 to-primary-600 flex items-center justify-center text-white text-xs font-bold shadow-soft group-hover:shadow-medium transition-all duration-300">{t.avatar}</div>
                    <div>
                      <p className="text-sm font-semibold text-neutral-900 group-hover:text-primary-800 transition-colors">{t.name}</p>
                      <p className="text-xs text-neutral-500">{t.role}</p>
                    </div>
                  </div>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ FAQ ═══════════════ */}
      <section className="section-padding">
        <div className="max-w-[800px] mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-neutral-100 border border-neutral-200 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-500" />
              <span className="text-xs font-semibold text-neutral-600 uppercase tracking-wider">FAQ</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-neutral-900 mb-4 tracking-tight text-balance">Got Questions? <span className="text-gradient">We&apos;ve Got Answers</span></h2>
          </AnimatedSection>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <AnimatedSection key={i} delay={i * 50}>
                <div className="group">
                  <button
                    onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                    className={`w-full flex items-center justify-between px-6 py-5 rounded-[14px] text-left transition-all duration-200 border ${
                      faqOpen === i ? 'bg-primary-800/5 border-primary-800/20 shadow-soft' : 'bg-white border-neutral-200/60 hover:border-neutral-200 hover:shadow-soft'
                    }`}
                  >
                    <span className="font-medium text-neutral-900 pr-4">{faq.q}</span>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
                      faqOpen === i ? 'bg-primary-800 text-white rotate-45 shadow-soft' : 'bg-neutral-100 text-neutral-500 group-hover:bg-neutral-200'
                    }`}>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                  </button>
                  {faqOpen === i && (
                    <div className="px-6 pb-4 pt-3 text-sm text-neutral-600 leading-relaxed border-x border-b border-primary-800/10 bg-primary-800/[0.02] rounded-b-[14px] mx-[1px] animate-slide-up">
                      {faq.a}
                    </div>
                  )}
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ CTA / NEWSLETTER ═══════════════ */}
      <section className="section-padding gradient-card relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/2 left-1/3 w-[600px] h-[600px] bg-accent-400 rounded-full blur-[150px] animate-pulse-soft" style={{ animationDuration: '7s' }} />
          <div className="absolute bottom-0 right-1/3 w-[400px] h-[400px] bg-primary-800/60 rounded-full blur-[120px] animate-pulse-soft" style={{ animationDuration: '9s' }} />
        </div>
        <div className="absolute inset-0 bg-dot-grid" />
        <div className="max-w-[600px] mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <AnimatedSection>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/10 backdrop-blur-sm mb-6 hover:bg-white/15 transition-colors">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-400 animate-pulse-soft" />
              <span className="text-xs font-semibold text-white/80 uppercase tracking-wider">Stay Ahead</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight text-balance">Get Weekly Investment Intelligence</h2>
            <p className="text-white/70 mb-8 text-lg text-pretty">Market trends, property alerts, and AI insights delivered to your inbox every Monday.</p>
          </AnimatedSection>
          {subscribed ? (
            <AnimatedSection className="bg-white/10 backdrop-blur-md rounded-[16px] p-8 border border-white/10 hover:bg-white/15 transition-colors duration-300">
              <div className="w-14 h-14 rounded-full bg-accent-400/20 flex items-center justify-center mx-auto mb-3">
                <svg className="w-7 h-7 text-accent-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
              </div>
              <p className="text-white font-semibold text-lg">You&apos;re In!</p>
              <p className="text-white/60 text-sm mt-1">We&apos;ll send you the best investment opportunities every week.</p>
            </AnimatedSection>
          ) : (
            <form onSubmit={e => { e.preventDefault(); if (email) setSubscribed(true); }} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <div className="flex-1 relative">
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                <input
                  type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter your email" required
                  className="w-full h-12 pl-11 pr-4 rounded-[14px] bg-white/10 border border-white/20 text-white placeholder:text-white/40 text-sm focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 backdrop-blur-sm transition-all"
                />
              </div>
              <Button type="submit" variant="premium" size="lg" className="bg-white text-primary-800 hover:bg-white/90 border-0 shrink-0">Subscribe Free</Button>
            </form>
          )}
          <p className="text-white/40 text-xs mt-4">No spam. Unsubscribe anytime. We respect your inbox.</p>
        </div>
      </section>
    </div>
  );
}
