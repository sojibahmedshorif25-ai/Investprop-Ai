import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const team = [
  { name: 'Sarah Chen', role: 'CEO & Co-Founder', bio: '15+ years in real estate tech. Former VP at PropTech.' },
  { name: 'Marcus Johnson', role: 'CTO & Co-Founder', bio: 'AI researcher, ex-Google, Stanford CS.' },
  { name: 'Elena Rodriguez', role: 'Head of AI', bio: 'PhD in Machine Learning, 50+ publications.' },
  { name: 'David Kim', role: 'Head of Product', bio: 'Built products used by 2M+ investors.' },
];

const milestones = [
  { year: '2022', title: 'Platform Launched', desc: 'Beta launched with 100 early-access users.' },
  { year: '2023', title: 'AI Engine v2', desc: 'Second-gen scoring model with 94% accuracy.' },
  { year: '2024', title: '10K Properties', desc: 'Analyzed over 10,000 properties across the US.' },
  { year: '2025', title: 'Enterprise', desc: 'Launched enterprise tier for institutional investors.' },
];

export default function AboutPage() {
  return (
    <div className="pt-20 pb-16">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-800/5 border border-primary-800/10 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-primary-800" />
            <span className="text-xs font-semibold text-primary-800 uppercase tracking-wider">About Us</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-neutral-900 mb-4 tracking-tight">Empowering Investors with <span className="text-gradient">AI Intelligence</span></h1>
          <p className="text-lg text-neutral-500 max-w-2xl mx-auto leading-relaxed">We combine cutting-edge artificial intelligence with deep real estate expertise to give every investor — from first-time buyers to institutional funds — the data they need to make confident decisions.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {[
            { value: '15K+', label: 'Properties Analyzed' },
            { value: '2.5K+', label: 'Active Investors' },
            { value: '99.9%', label: 'Platform Uptime' },
            { value: '4.8★', label: 'Average Rating' },
          ].map((s, i) => (
            <Card key={i} className="p-6 text-center border-neutral-200/50">
              <div className="text-3xl font-bold text-primary-800 mb-1">{s.value}</div>
              <div className="text-sm text-neutral-500">{s.label}</div>
            </Card>
          ))}
        </div>

        {/* Story */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-4">Our Story</h2>
            <div className="space-y-4 text-neutral-600 leading-relaxed">
              <p>Founded in 2022, InvestProp AI was born from a simple observation: real estate investors were making multi-million dollar decisions based on gut feeling and incomplete data.</p>
              <p>Our team of AI researchers, real estate analysts, and software engineers came together to build a platform that brings institutional-grade analytics to every investor.</p>
              <p>Today, we help thousands of investors analyze properties, assess risks, and discover opportunities they would have otherwise missed.</p>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-[4/3] rounded-[20px] gradient-card flex items-center justify-center">
              <div className="text-center p-8">
                <div className="w-16 h-16 rounded-[16px] bg-white/10 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" /></svg>
                </div>
                <p className="text-white/80 text-lg font-medium">&ldquo;Data beats opinions.&rdquo;</p>
                <p className="text-white/50 text-sm mt-2">— Our core belief</p>
              </div>
            </div>
          </div>
        </div>

        {/* Milestones */}
        <div className="mb-20">
          <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 text-center mb-10">Our Journey</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {milestones.map((m, i) => (
              <Card key={i} className="p-6 border-neutral-200/50 text-center">
                <div className="text-sm font-bold text-accent-600 mb-1">{m.year}</div>
                <h3 className="font-semibold text-neutral-900 mb-1">{m.title}</h3>
                <p className="text-sm text-neutral-500">{m.desc}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Team */}
        <div className="mb-20">
          <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 text-center mb-4">Leadership Team</h2>
          <p className="text-neutral-500 text-center mb-10 max-w-xl mx-auto">Meet the people building the future of property investment intelligence.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {team.map((t, i) => (
              <Card key={i} className="p-6 border-neutral-200/50 text-center group hover:border-neutral-200 transition-colors">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-800 to-primary-600 flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                  {t.name.split(' ').map(n => n[0]).join('')}
                </div>
                <h3 className="font-semibold text-neutral-900 mb-0.5">{t.name}</h3>
                <p className="text-xs text-accent-600 font-medium mb-2">{t.role}</p>
                <p className="text-sm text-neutral-500">{t.bio}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center py-16 px-8 rounded-[20px] gradient-card relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-1/2 left-1/3 w-96 h-96 bg-accent-400 rounded-full blur-[120px]" />
          </div>
          <div className="relative">
            <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">Ready to Invest Smarter?</h2>
            <p className="text-white/70 mb-6 max-w-lg mx-auto">Join thousands of investors already using AI-powered insights.</p>
            <Link href="/register"><Button variant="premium" size="xl" className="bg-white text-primary-800 hover:bg-white/90">Get Started Free</Button></Link>
          </div>
        </div>
      </div>
    </div>
  );
}
