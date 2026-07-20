'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/cn';
import { Button } from '@/components/ui/button';

const navItems = [
  { href: '/', label: 'Home', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { href: '/explore', label: 'Explore', icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' },
  { href: '/products', label: 'Products', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
];

const protectedNavItems = [
  { href: '/dashboard', label: 'Dashboard', icon: 'M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm0 8a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zm12 0a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z' },
  { href: '/explore', label: 'Explore', icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' },
  { href: '/products', label: 'Products', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
  { href: '/items/manage', label: 'Portfolio', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
  { href: '/items/add', label: 'Add Property', icon: 'M12 4v16m8-8H4' },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      setLoggedIn(true);
      const stored = localStorage.getItem('user');
      if (stored) try { setUser(JSON.parse(stored)); } catch { /* */ }
    }
    const handler = () => setScrolled(window.scrollY > 15);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const items = loggedIn ? protectedNavItems : navItems;

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
        scrolled
          ? 'bg-white/80 backdrop-blur-2xl border-b border-white/30 shadow-soft'
          : 'bg-transparent'
      )}
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative w-9 h-9 rounded-[10px] gradient-primary flex items-center justify-center shadow-soft transition-all duration-300 group-hover:scale-110 group-hover:shadow-glow">
              <svg className="w-5 h-5 text-white relative z-10" fill="currentColor" viewBox="0 0 24 24">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
              </svg>
              <div className="absolute inset-0 rounded-[10px] bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="hidden sm:block">
              <span className="font-bold text-lg text-primary-800 tracking-tight">InvestProp</span>
              <span className="font-light text-lg text-accent-600"> AI</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {items.map((item) => {
              const active = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'group relative flex items-center gap-2 px-4 py-2 rounded-[10px] text-sm font-medium transition-all duration-200',
                    active
                      ? 'text-primary-800 bg-primary-800/8'
                      : 'text-neutral-600 hover:text-primary-700 hover:bg-neutral-100/80'
                  )}
                >
                  <svg className={cn('w-4 h-4 transition-colors', active ? 'text-primary-800' : 'text-neutral-400 group-hover:text-primary-500')} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 2.5 : 2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                  </svg>
                  {item.label}
                  {active && (
                    <span className="absolute inset-0 rounded-[10px] border border-primary-800/15" />
                  )}
                </Link>
              );
            })}

            {loggedIn ? (
              <div className="relative ml-3">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2.5 p-1.5 pr-3 rounded-[10px] hover:bg-neutral-100/80 transition-all duration-200 border border-transparent hover:border-neutral-200/50"
                >
                  <div className="w-8 h-8 rounded-[8px] gradient-primary flex items-center justify-center text-white text-sm font-semibold shadow-soft">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <span className="text-sm font-medium text-neutral-700 hidden lg:block max-w-[100px] truncate">
                    {user?.name || 'User'}
                  </span>
                  <svg className={cn('w-3.5 h-3.5 text-neutral-400 transition-transform duration-200', dropdownOpen && 'rotate-180')} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {dropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-[14px] shadow-strong border border-neutral-200/80 py-2 z-50 animate-fade-in">
                      <div className="px-4 py-3 border-b border-neutral-100">
                        <p className="text-sm font-medium text-neutral-900">{user?.name || 'User'}</p>
                        <p className="text-xs text-neutral-500">{user?.email || ''}</p>
                      </div>
                      <div className="py-1">
                        <Link href="/dashboard" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors">
                          <svg className="w-4 h-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm0 8a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zm12 0a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" /></svg>
                          Dashboard
                        </Link>
                        <Link href="/items/manage" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors">
                          <svg className="w-4 h-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                          My Portfolio
                        </Link>
                        <Link href="/items/add" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors">
                          <svg className="w-4 h-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                          Add Property
                        </Link>
                      </div>
                      <div className="border-t border-neutral-100 pt-1">
                        <button
                          onClick={() => { localStorage.clear(); window.location.href = '/'; }}
                          className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2 ml-4 pl-4 border-l border-neutral-200/60">
                <Link href="/login"><Button variant="ghost" size="sm" className="font-medium">Sign In</Button></Link>
                <Link href="/register"><Button variant="gradient" size="sm">Get Started Free</Button></Link>
              </div>
            )}
          </nav>

          {/* Mobile Toggle */}
          <button
            className="md:hidden relative w-10 h-10 rounded-[10px] flex items-center justify-center hover:bg-neutral-100/80 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <div className="w-5 h-4 relative flex flex-col justify-between">
              <span className={cn('block h-0.5 w-full bg-neutral-600 rounded-full transition-all duration-300 origin-center', mobileOpen && 'rotate-45 translate-y-[7px]')} />
              <span className={cn('block h-0.5 w-full bg-neutral-600 rounded-full transition-all duration-300', mobileOpen && 'opacity-0 scale-x-0')} />
              <span className={cn('block h-0.5 w-full bg-neutral-600 rounded-full transition-all duration-300 origin-center', mobileOpen && '-rotate-45 -translate-y-[7px]')} />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={cn(
        'md:hidden fixed inset-x-0 top-16 bg-white/90 backdrop-blur-2xl border-b border-white/30 shadow-strong transition-all duration-400 overflow-hidden',
        mobileOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
      )}>
        <div className="px-4 py-4 space-y-1">
          {items.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-[10px] text-sm font-medium transition-all duration-200',
                  active ? 'bg-primary-800/10 text-primary-800' : 'text-neutral-600 hover:bg-neutral-100'
                )}
              >
                <svg className={cn('w-4 h-4', active ? 'text-primary-800' : 'text-neutral-400')} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                </svg>
                {item.label}
              </Link>
            );
          })}
          <hr className="my-3 border-neutral-200/60" />
          {loggedIn ? (
            <button
              onClick={() => { localStorage.clear(); window.location.href = '/'; }}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-[10px] text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
              Sign Out
            </button>
          ) : (
            <div className="flex flex-col gap-2 pt-2">
              <Link href="/login" onClick={() => setMobileOpen(false)}><Button variant="outline" className="w-full justify-center">Sign In</Button></Link>
              <Link href="/register" onClick={() => setMobileOpen(false)}><Button variant="gradient" className="w-full justify-center">Get Started Free</Button></Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
