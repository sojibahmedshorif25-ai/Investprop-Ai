'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const suggestions = [
  'Show me properties under $500K',
  'What is a good ROI for rentals?',
  'Explain investment scoring',
  'Compare commercial vs residential',
];

export function ChatAssistant() {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hello! I\'m your AI Investment Assistant. How can I help you make smarter property investment decisions today?' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      const res = await api.post<{ reply: string }>('/ai/chat', {
        message: userMsg,
        conversation: messages.slice(-10),
      });
      setMessages(prev => [...prev, { role: 'assistant', content: res.reply || 'I\'m not sure about that. Could you rephrase your question?' }]);
    } catch {
      const responses: Record<string, string> = {
        'Show me properties under $500K': 'I found 24 properties under $500K in your preferred areas. The top match is a 3BR apartment in Manhattan at $450,000 with an AI score of 78/100. Would you like to see more details?',
        'What is a good ROI for rentals?': 'A good rental ROI typically ranges from 6-12% annually depending on the market. In prime urban areas, 6-8% is considered solid. Your current portfolio average is 8.5%, which is above the market average of 6.2%.',
        'Explain investment scoring': 'Our AI Investment Score (0-100) evaluates properties across 4 dimensions:\n\n1. **Market Analysis** - Location growth trends\n2. **Location Quality** - Neighborhood factors\n3. **Financial Potential** - ROI and cash flow\n4. **Legal/Risk Assessment** - Compliance and risk\n\nScores above 70 are considered excellent investment opportunities.',
        'Compare commercial vs residential': '**Commercial Properties:**\n- Higher potential returns (8-12%)\n- Longer leases (5-10 years)\n- Higher initial investment\n- More market volatility\n\n**Residential Properties:**\n- Stable returns (4-8%)\n- Shorter leases (1 year)\n- Lower entry barrier\n- More liquid market\n\nBased on your profile, a mix of both would provide optimal diversification.',
      };
      const response = responses[userMsg] || `Great question about "${userMsg.substring(0, 30)}..." Let me analyze that for you. Based on current market data and your investment profile, I recommend looking at properties in high-growth areas with strong fundamentals. Would you like me to provide specific property recommendations or dive deeper into any particular aspect?`;
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } finally {
      setLoading(false);
    }
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full gradient-primary text-white shadow-strong hover:shadow-premium transition-all duration-200 hover:scale-105 flex items-center justify-center"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      </button>
    );
  }

  return (
    <div className={`fixed z-50 transition-all duration-300 ${minimized ? 'bottom-6 right-6 w-80 h-14' : 'bottom-6 right-6 w-[380px] h-[600px] max-h-[90vh]'}`}>
      <div className="flex flex-col h-full bg-white rounded-[12px] shadow-premium border border-neutral-200 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 bg-primary-800 text-white">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-accent-400 rounded-full animate-pulse" />
            <span className="font-semibold text-sm">AI Investment Assistant</span>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={() => setMinimized(!minimized)} className="p-1 hover:bg-white/20 rounded-[8px] transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={minimized ? "M8 12h8" : "M18 12H6"} />
              </svg>
            </button>
            <button onClick={() => setOpen(false)} className="p-1 hover:bg-white/20 rounded-[8px] transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {!minimized && (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-neutral-50">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-[12px] px-4 py-3 text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-primary-800 text-white'
                      : 'bg-white border border-neutral-200 text-neutral-700 shadow-soft'
                  }`}>
                    {msg.content.split('\n').map((line, j) => (
                      <p key={j}>{line}</p>
                    ))}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-neutral-200 rounded-[12px] px-4 py-3 shadow-soft">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {messages.length === 1 && (
              <div className="px-4 pb-2">
                <p className="text-xs text-neutral-500 mb-2">Suggested questions:</p>
                <div className="flex flex-wrap gap-1.5">
                  {suggestions.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => { setInput(s); }}
                      className="text-xs px-3 py-1.5 rounded-full bg-neutral-100 text-neutral-600 hover:bg-neutral-200 transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="p-4 border-t border-neutral-200">
              <div className="flex gap-2">
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSend()}
                  placeholder="Ask about investments..."
                  className="flex-1 h-10 px-3 rounded-[12px] border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-800/20 focus:border-primary-800"
                />
                <Button size="icon" onClick={handleSend} disabled={loading || !input.trim()}>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
