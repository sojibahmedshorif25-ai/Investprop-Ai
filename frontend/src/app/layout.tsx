import type { Metadata } from 'next';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { QueryProvider } from '@/components/QueryProvider';
import { ChatAssistant } from '@/components/ChatAssistant';
import './globals.css';

export const metadata: Metadata = {
  title: 'InvestProp AI - AI-Powered Property Investment Intelligence',
  description: 'Make data-driven property investment decisions with AI-powered market analysis, risk assessment, and personalized recommendations.',
  keywords: 'real estate, property investment, AI, market analysis, investment scoring',
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
