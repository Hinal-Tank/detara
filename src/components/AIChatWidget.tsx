'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useChat } from '@/lib/hooks/useChat';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const SYSTEM_PROMPT = `You are a knowledgeable diamond jewelry advisor for DETARA, a European luxury diamond jewelry brand. 

You help customers with:
- Explaining the difference between natural and lab-grown diamonds
- Diamond quality (4Cs: Cut, Color, Clarity, Carat)
- Product recommendations based on budget and preferences
- Ring sizing and jewelry care
- Pricing guidance (natural diamonds cost more; lab-grown are ~30% less)
- Certification (IGI and GIA certified diamonds above 0.30ct)
- Custom jewelry inquiries
- Shipping and returns

DETARA sells: Engagement Rings, Diamond Studs, Tennis Bracelets, Diamond Bands, Pendants, and Custom Jewelry.
All diamonds are quality checked. Both natural and lab-grown diamonds are real — the difference lies in their origin.

Keep responses concise, warm, and professional. If asked about specific order status or complex issues, suggest contacting via WhatsApp at https://wa.me/442046148575.`;

const DETARA_WHATSAPP_URL = 'https://wa.me/442046148575';

const WHATSAPP_URL = DETARA_WHATSAPP_URL;

export default function AIChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [currentResponse, setCurrentResponse] = useState('');
  const [showWhatsAppFallback, setShowWhatsAppFallback] = useState(false);
  const [aiUnavailable, setAiUnavailable] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { response, isLoading, error, sendMessage } = useChat('OPEN_AI', 'gpt-4.1-mini', true);

  useEffect(() => {
    if (error) {
      setShowWhatsAppFallback(true);
      const is429 =
        error.message?.includes('429') ||
        error.message?.toLowerCase().includes('rate limit') ||
        error.message?.toLowerCase().includes('quota');

      if (is429) {
        setAiUnavailable(true);
      }

      const friendlyMsg = is429
        ? "Our AI advisor is temporarily unavailable due to high demand. Please reach out via WhatsApp for immediate assistance from our team."
        : "I'm having trouble connecting right now. Please try again or contact us via WhatsApp.";

      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === 'assistant') return prev;
        return [...prev, { role: 'assistant', content: friendlyMsg }];
      });
    }
  }, [error]);

  useEffect(() => {
    if (response) {
      setCurrentResponse(response);
    }
  }, [response]);

  useEffect(() => {
    if (!isLoading && currentResponse) {
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === 'assistant') {
          return [...prev.slice(0, -1), { role: 'assistant', content: currentResponse }];
        }
        return [...prev, { role: 'assistant', content: currentResponse }];
      });
      setCurrentResponse('');
    }
  }, [isLoading, currentResponse]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, currentResponse]);

  const handleSend = () => {
    if (!input.trim() || isLoading || aiUnavailable) return;

    const userMsg: Message = { role: 'user', content: input };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');

    const apiMessages = [
      { role: 'system' as const, content: SYSTEM_PROMPT },
      ...newMessages.map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content })),
    ];

    sendMessage(apiMessages, { max_completion_tokens: 400 });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleHumanHelp = () => {
    setShowWhatsAppFallback(true);
  };

  return (
    <>
      {/* Chat bubble button */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Open chat support"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-foreground text-[#FFFDF8] flex items-center justify-center shadow-lg hover:bg-accent transition-colors ai-chat-toggle"
        style={{ background: '#211B18', bottom: 'calc(env(safe-area-inset-bottom, 0px) + 76px)' }}
      >
        {open ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
            <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>

      {/* Chat panel */}
      {open && (
        <div
          className="fixed right-6 z-50 w-80 md:w-96 flex flex-col shadow-2xl border border-[rgba(28,25,23,0.12)] ai-chat-panel"
          style={{ background: '#FFFDF8', maxHeight: '520px', bottom: 'calc(env(safe-area-inset-bottom, 0px) + 148px)' }}
        >
          {/* Header */}
          <div className="px-5 py-4 border-b border-[rgba(28,25,23,0.08)]" style={{ background: '#211B18' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-light text-[#FFFDF8] tracking-wide">DETARA Support</p>
                <p className="text-[11px] text-[rgba(255,255,255,0.5)] font-light">
                  {aiUnavailable ? 'Connect via WhatsApp' : 'AI Diamond Advisor'}
                </p>
              </div>
              <span className={`w-2 h-2 rounded-full block ${aiUnavailable ? 'bg-yellow-400' : 'bg-green-400'}`} />
            </div>
          </div>

          {/* WhatsApp fallback banner */}
          {showWhatsAppFallback && (
            <div className="px-4 py-3 bg-[#25D366]/10 border-b border-[#25D366]/20 flex items-center justify-between gap-3">
              <p className="text-[11px] text-foreground font-light leading-relaxed">
                {aiUnavailable ? 'AI advisor unavailable. Chat with our team directly.' : 'Need human help? Chat with our team on WhatsApp.'}
              </p>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-[#25D366] text-white text-[10px] font-medium tracking-wide"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                WhatsApp
              </a>
            </div>
          )}

          {/* AI unavailable full-panel CTA */}
          {aiUnavailable && messages.length <= 1 && (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#25D366]/10 flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="#25D366">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </div>
              <div>
                <p className="text-sm font-light text-foreground mb-1">Our AI advisor is currently unavailable</p>
                <p className="text-[11px] text-muted font-light leading-relaxed">Our team is ready to help you on WhatsApp with any questions about diamonds, pricing, or custom jewelry.</p>
              </div>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 bg-[#25D366] text-white text-xs font-medium tracking-wide"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Chat on WhatsApp
              </a>
            </div>
          )}

          {/* Messages (shown when AI is available or after error with messages) */}
          {(!aiUnavailable || messages.length > 1) && (
            <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ minHeight: '240px', maxHeight: '280px' }}>
              {messages.length === 0 && (
                <div className="text-center py-6">
                  <p className="text-xs text-muted font-light leading-relaxed">
                    Ask me anything about diamonds, our collections, sizing, or pricing.
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2 justify-center">
                    {['Natural vs Lab diamonds?', 'Ring sizing help', 'Certification info'].map((q) => (
                      <button
                        key={q}
                        onClick={() => setInput(q)}
                        className="text-[10px] px-3 py-1.5 border border-[rgba(28,25,23,0.12)] text-muted hover:border-accent hover:text-foreground transition-colors"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[80%] px-3 py-2 text-xs font-light leading-relaxed ${
                      msg.role === 'user' ? 'bg-foreground text-[#FFFDF8]' : 'bg-[rgba(28,25,23,0.05)] text-foreground border border-[rgba(28,25,23,0.06)]'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {isLoading && currentResponse && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] px-3 py-2 text-xs font-light leading-relaxed bg-[rgba(28,25,23,0.05)] text-foreground border border-[rgba(28,25,23,0.06)]">
                    {currentResponse}
                    <span className="inline-block w-1 h-3 bg-accent ml-0.5 animate-pulse" />
                  </div>
                </div>
              )}
              {isLoading && !currentResponse && (
                <div className="flex justify-start">
                  <div className="px-3 py-2 bg-[rgba(28,25,23,0.05)] border border-[rgba(28,25,23,0.06)]">
                    <div className="flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <span key={i} className="w-1.5 h-1.5 rounded-full bg-muted animate-bounce" style={{ animationDelay: `${i * 150}ms` }} />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}

          {/* Input — hidden when AI is fully unavailable */}
          {!aiUnavailable && (
            <div className="p-3 border-t border-[rgba(28,25,23,0.08)]">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about diamonds..."
                  className="flex-1 bg-transparent border border-[rgba(28,25,23,0.12)] px-3 py-2 text-xs font-light text-foreground placeholder:text-muted focus:outline-none focus:border-accent transition-colors"
                  disabled={isLoading}
                />
                <button
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  className="px-3 py-2 bg-foreground text-[#FFFDF8] text-xs hover:bg-accent transition-colors disabled:opacity-40"
                >
                  →
                </button>
              </div>
              {!showWhatsAppFallback && messages.length > 0 && (
                <button
                  onClick={handleHumanHelp}
                  className="mt-2 w-full text-[10px] text-muted hover:text-foreground transition-colors text-center font-light"
                >
                  Need human help? →
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
}
