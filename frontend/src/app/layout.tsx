import type { Metadata } from 'next';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { QueryProvider } from '@/components/QueryProvider';
import { ChatAssistant } from '@/components/ChatAssistant';
import './globals.css';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://investprop-ai.vercel.app';

export const metadata: Metadata = {
  title: { default: 'InvestProp AI - AI-Powered Property Investment Intelligence', template: '%s | InvestProp AI' },
  description: 'Make data-driven property investment decisions with AI-powered market analysis, risk assessment, and personalized recommendations.',
  keywords: 'real estate, property investment, AI, market analysis, investment scoring',
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: 'InvestProp AI',
    description: 'AI-Powered Property Investment Intelligence Platform',
    url: siteUrl,
    siteName: 'InvestProp AI',
    locale: 'en_US',
    type: 'website',
  },
  twitter: { card: 'summary_large_image', title: 'InvestProp AI', description: 'AI-Powered Property Investment Intelligence' },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen flex flex-col" suppressHydrationWarning>
        <QueryProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <ChatAssistant />
        </QueryProvider>
      </body>
    </html>
  );
}
