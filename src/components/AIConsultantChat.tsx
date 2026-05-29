import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, AlertCircle, MessageSquare, Compass, PhoneCall, Sparkles } from 'lucide-react';
import { Message } from '../types';

interface AIConsultantChatProps {
  onSuggestAction: (actionText: string) => void;
}

const QUICK_PROMPTS = [
  "Meu CNPJ está irregular, o que fazer?",
  "Como parcelar minhas DAS atrasadas?",
  "Fui multado pela DASN pendente?",
  "O que acontece se eu não pagar as guias?"
];

export default function AIConsultantChat({ onSuggestAction }: AIConsultantChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-msg',
      sender: 'assistant',
      text: 'Olá! Sou o Assistente Virtual do Marcello Montefusco Bernardo. Estou aqui para ajudar você a regularizar seu MEI, analisar CNPJ irregular, estimar parcelamentos de DAS em atraso ou tirar dúvidas fiscais. \n\nQual é a sua dúvida ou pendência fiscal hoje?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto scroll
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMsg: Message = {
      id: `msg-${Date.now()}-user`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages: [...messages, userMsg].map(m => ({
            sender: m.sender,
            text: m.text
          }))
        })
      });

      const data = await response.json();
      const assistantMsg: Message = {
        id: `msg-${Date.now()}-assistant`,
        sender: 'assistant',
        text: data.text,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      console.error(err);
      const errorMsg: Message = {
        id: `msg-${Date.now()}-err`,
        sender: 'assistant',
        text: 'Desculpe, meu sistema de IA teve uma oscilação de conexão. Mas você pode falar diretamente com o especialista Marcello Bernardo pelo WhatsApp no botão abaixo para receber ajuda humana em instantes!',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="ai-chat-container" className="flex flex-col h-[520px] bg-emerald-950/40 border border-emerald-500/20 rounded-2xl overflow-hidden backdrop-blur-md">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 bg-emerald-900/45 border-b border-emerald-500/10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300">
            <Bot className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <h4 id="chat-header-name" className="text-xs font-semibold text-stone-100 flex items-center gap-1.5">
              Marcello Bernardo: Assistente Virtual
              <span className="flex h-1.5 w-1.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
              </span>
            </h4>
            <p className="text-[10px] text-stone-400 leading-none">Consultoria Especializada MEI</p>
          </div>
        </div>
        <a
          id="chat-whatsapp-shortcut"
          href="https://wa.me/5511949862676?text=Olá Marcello, vim através do seu assistente de Inteligência Artificial e gostaria de analisar a situação do meu MEI!"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 rounded-lg text-xs font-semibold transition-colors"
        >
          <PhoneCall className="w-3.5 h-3.5" />
          Falar com Marcello
        </a>
      </div>

      {/* Message Feed */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-thin scrollbar-thumb-emerald-800/50 scrollbar-track-transparent">
        {messages.map((m) => (
          <div
            id={`chat-item-${m.id}`}
            key={m.id}
            className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in duration-200`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 leading-relaxed text-sm shadow-md font-sans ${
                m.sender === 'user'
                  ? 'bg-emerald-600 text-white rounded-tr-none'
                  : 'bg-emerald-900/70 border border-emerald-500/20 text-stone-200 rounded-tl-none whitespace-pre-wrap'
              }`}
            >
              {m.sender === 'assistant' && (
                <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-semibold uppercase tracking-wider mb-1">
                  <Sparkles className="w-3 h-3" />
                  Especialista Consultoria
                </div>
              )}
              {m.text}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start items-center gap-2">
            <div className="bg-emerald-900/70 border border-emerald-500/20 rounded-2xl rounded-tl-none px-4 py-3.5 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Suggested chips */}
      <div className="px-5 py-2 flex items-center gap-2 overflow-x-auto border-t border-emerald-500/5 bg-emerald-950/20 select-none">
        <Compass className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
        <div className="flex gap-1.5 py-1">
          {QUICK_PROMPTS.map((q, i) => (
            <button
              id={`quick-chip-${i}`}
              key={i}
              onClick={() => handleSendMessage(q)}
              className="px-2.5 py-1 text-[11px] whitespace-nowrap bg-emerald-900/30 hover:bg-emerald-900/65 border border-emerald-500/15 text-stone-300 rounded-full transition-colors cursor-pointer"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Input panel */}
      <form
        id="chat-send-form"
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage(input);
        }}
        className="p-4 bg-emerald-950/80 border-t border-emerald-500/10 flex gap-2"
      >
        <input
          id="chat-text-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Pergunte sobre multas, CNPJ suspenso, atrasados..."
          className="flex-1 bg-emerald-900/20 border border-emerald-500/35 rounded-xl px-4 py-2.5 text-sm md:text-xs text-stone-100 placeholder-emerald-700/80 focus:outline-none focus:border-emerald-400 transition-colors font-sans"
        />
        <button
          id="chat-submit-btn"
          type="submit"
          disabled={!input.trim() || isLoading}
          className="p-2.5 bg-emerald-500 disabled:bg-emerald-900/50 text-emerald-950 disabled:text-emerald-700 rounded-xl transition-all font-semibold active:scale-95 cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
