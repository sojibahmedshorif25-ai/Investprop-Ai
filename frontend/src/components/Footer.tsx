import Link from 'next/link';

const footerLinks = {
  company: { label: 'Company', links: [
    { href: '/', label: 'Home' },
    { href: '/explore', label: 'Explore' },
    { href: '/products', label: 'Products' },
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/items/add', label: 'List Property' },
    { href: '/contact', label: 'Contact Us' },
  ]},
  features: { label: 'Features', links: [
    { href: '/about', label: 'About Us' },
    { href: '/privacy', label: 'Privacy Policy' },
    { href: '/terms', label: 'Terms of Service' },
    { href: '/register', label: 'Get Started' },
    { href: '/login', label: 'Sign In' },
  ]},
  resources: { label: 'Resources', links: [
    { href: '/pricing', label: 'Pricing' },
    { href: '/blog', label: 'Blog' },
    { href: '/faq', label: 'FAQ' },
    { href: '/support', label: 'Support' },
    { href: '/api', label: 'API Documentation' },
  ]},
};

export function Footer() {
  return (
    <footer className="bg-neutral-950 text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-accent-500 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-primary-800 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-10 relative">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-5">
              <div className="w-9 h-9 rounded-[10px] bg-gradient-to-br from-primary-700 to-primary-500 flex items-center justify-center shadow-lg">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" /></svg>
              </div>
              <span className="font-bold text-lg tracking-tight">InvestProp</span>
              <span className="font-light text-lg text-accent-400"> AI</span>
            </Link>
            <p className="text-neutral-400 text-sm leading-relaxed max-w-sm mb-6">
              Empowering investors with AI-driven property insights and intelligent investment decisions since 2024.
            </p>
            <div className="flex gap-3">
              {[
                { label: 'LinkedIn', path: 'M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z' },
                { label: 'Twitter', path: 'M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z' },
                { label: 'Facebook', path: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' },
              ].map((s, i) => (
                <a key={i} href={`https://${s.label.toLowerCase()}.com`} target="_blank" rel="noopener noreferrer"
                  className="w-10 h-10 rounded-[10px] bg-neutral-800/80 flex items-center justify-center hover:bg-primary-800/80 transition-all duration-200 hover:scale-105 group"
                  title={s.label}>
                  <svg className="w-4 h-4 text-neutral-400 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24"><path d={s.path} /></svg>
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([key, section]) => (
            <div key={key}>
              <h4 className="font-semibold text-xs uppercase tracking-widest text-neutral-400 mb-5">{section.label}</h4>
              <ul className="space-y-3">
                {section.links.map((link, i) => (
                  <li key={i}>
                    <Link href={link.href} className="text-sm text-neutral-500 hover:text-white transition-colors duration-200">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact */}
        <div className="mt-12 pt-8 border-t border-neutral-800/60 grid md:grid-cols-3 gap-6">
          <div className="flex items-center gap-3 text-sm text-neutral-500">
            <div className="w-9 h-9 rounded-[10px] bg-neutral-800/80 flex items-center justify-center shrink-0">
              <svg className="w-4 h-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
            </div>
            <a href="mailto:contact@investprop.ai" className="hover:text-white transition-colors">contact@investprop.ai</a>
          </div>
          <div className="flex items-center gap-3 text-sm text-neutral-500">
            <div className="w-9 h-9 rounded-[10px] bg-neutral-800/80 flex items-center justify-center shrink-0">
              <svg className="w-4 h-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
            </div>
            <a href="tel:+1-800-555-0123" className="hover:text-white transition-colors">+1 (800) 555-0123</a>
          </div>
          <div className="flex items-center gap-3 text-sm text-neutral-500">
            <div className="w-9 h-9 rounded-[10px] bg-neutral-800/80 flex items-center justify-center shrink-0">
              <svg className="w-4 h-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            </div>
            <span>123 Investment Ave, Suite 400, New York, NY 10001</span>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 pt-6 border-t border-neutral-800/60 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-neutral-600">&copy; {new Date().getFullYear()} InvestProp AI. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-sm text-neutral-600 hover:text-neutral-400 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-sm text-neutral-600 hover:text-neutral-400 transition-colors">Terms of Service</Link>
            <Link href="/contact" className="text-sm text-neutral-600 hover:text-neutral-400 transition-colors">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
