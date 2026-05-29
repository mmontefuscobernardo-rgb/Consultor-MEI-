import React, { useState, useEffect } from 'react';
import { Shield, Sparkles, AlertTriangle, BadgeHelp, HelpCircle, CheckCircle, Scale, DollarSign, Calculator, MessageSquare, Landmark, ChevronDown, Award } from 'lucide-react';
import InteractiveBanner from './components/InteractiveBanner';
import DiagnosticWizard from './components/DiagnosticWizard';
import DebtCalculator from './components/DebtCalculator';
import AIConsultantChat from './components/AIConsultantChat';
import MediaConfig from './components/MediaConfig';
import { CustomMedia } from './types';

export default function App() {
  // State for locally persistent media uploads (survives page refreshes!)
  const [customMedia, setCustomMedia] = useState<CustomMedia>({
    photoUrl: null,
    bannerUrl: null,
    useGraphicMode: false,
  });

  // Load custom media from localstorage on start
  useEffect(() => {
    try {
      const storedPhoto = localStorage.getItem('marcello_mei_custom_photo');
      const storedBanner = localStorage.getItem('marcello_mei_custom_banner');
      const storedMode = localStorage.getItem('marcello_mei_use_graphic_mode') === 'true';
      setCustomMedia({
        photoUrl: storedPhoto,
        bannerUrl: storedBanner,
        useGraphicMode: storedMode,
      });
    } catch (e) {
      console.error('Failed to read media from localStorage', e);
    }
  }, []);

  const handleUpdateMedia = (photo: string | null, banner: string | null, useGraphicMode?: boolean) => {
    setCustomMedia({ photoUrl: photo, bannerUrl: banner, useGraphicMode });
    try {
      if (photo) localStorage.setItem('marcello_mei_custom_photo', photo);
      else localStorage.removeItem('marcello_mei_custom_photo');

      if (banner) localStorage.setItem('marcello_mei_custom_banner', banner);
      else localStorage.removeItem('marcello_mei_custom_banner');

      localStorage.setItem('marcello_mei_use_graphic_mode', useGraphicMode ? 'true' : 'false');
    } catch (e) {
      console.error('Failed to write media to localStorage', e);
    }
  };

  // State to toggle active tool highlights
  const [highlightedTool, setHighlightedTool] = useState<string | null>(null);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setHighlightedTool(id);
      setTimeout(() => setHighlightedTool(null), 1500);
    }
  };

  // FAQ state toggle
  const [faqOpenIdx, setFaqOpenIdx] = useState<number | null>(0);

  const faqItems = [
    {
      q: "O que acontece se eu passar do faturamento de R$ 81.000,00?",
      a: "Se o faturamento ultrapassar o limite anual em até 20% (R$ 97.200,00), você deverá recolher um DAS complementar sobre o excedente e providenciar a migração para Microempresa (ME) em janeiro do ano seguinte. Se passar de 20%, o desenquadramento passa a ser retroativo a janeiro daquele exercício, incidindo impostos e juros muito elevados. O Marcello pode calcular essa transição com segurança jurídica."
    },
    {
      q: "Como funciona o parcelamento de DAS atrasados do MEI?",
      a: "As guias DAS acumuladas podem ser parceladas diretamente no portal do Simples Nacional em até 60 parcelas mensais, com valor mínimo de R$ 50,00 por parcela. No entanto, é necessário que as declarações anuais (DASN) de todos os anos respectivos já tenham sido enviadas para que o sistema e-CAC reconheça o montante da dívida ativa."
    },
    {
      q: "Posso perder meus benefícios do INSS se ficar com DAS atrasado?",
      a: "Sim. O MEI tem direito à aposentadoria por idade, auxílio-doença, pensão por morte e salário-maternidade. No entanto, esses direitos dependem de carência (número mínimo de meses pagos). Estar inadimplente com o DAS impede que estes meses contem para o INSS, de modo que em uma emergência de saúde ou gestação, você pode ter o benefício recusado."
    },
    {
      q: "Em quanto tempo meu CNPJ é reativado após a regularização?",
      a: "Ao transmitir as declarações anuais atrasadas (DASN) e realizar o pagamento à vista (ou a primeira parcela do acordo do parcelamento), a Receita Federal costuma atualizar a situação cadastral do CNPJ como 'REGULAR' em um período entre 3 a 5 dias úteis."
    }
  ];

  return (
    <div id="root-app-layout" className="min-h-screen bg-stone-950 text-stone-100 selection:bg-emerald-600 selection:text-white font-sans overflow-x-hidden">
      
      {/* Dynamic Header */}
      <header id="main-header" className="sticky top-0 z-40 bg-stone-950/80 backdrop-blur-md border-b border-emerald-500/10 py-4 px-6 md:px-12 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold">
            M
          </div>
          <div>
            <span id="logo-text" className="font-bold tracking-tight text-stone-100 text-sm md:text-base font-display">
              Marcello Bernardo
            </span>
            <p className="text-[9px] uppercase tracking-widest text-emerald-400 font-semibold leading-none">
              Soluções Tributárias MEI
            </p>
          </div>
        </div>

        {/* Quick Utilities Link Toolbar */}
        <nav id="top-navigation" className="hidden sm:flex items-center gap-5 text-xs text-stone-400">
          <button onClick={() => scrollToSection('diagnostic-hub')} className="hover:text-emerald-400 transition-colors cursor-pointer">Diagnóstico</button>
          <button onClick={() => scrollToSection('calculator-hub')} className="hover:text-emerald-400 transition-colors cursor-pointer">Calculadora</button>
          <button onClick={() => scrollToSection('chat-hub')} className="hover:text-emerald-400 transition-colors cursor-pointer">Consultor IA</button>
          <button onClick={() => scrollToSection('faq-hub')} className="hover:text-emerald-400 transition-colors cursor-pointer">Dúvidas Frequentes</button>
        </nav>

        <div>
          <a
            id="top-cta-whatsapp"
            href="https://wa.me/5511949862676?text=Olá Marcello, gostaria de realizar um levantamento fiscal das pendências do meu MEI."
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-emerald-900/40 hover:bg-emerald-900/80 text-emerald-300 font-semibold border border-emerald-500/20 hover:border-emerald-400 rounded-xl text-xs transition-all duration-300 shadow-md"
          >
            Fale Direto
          </a>
        </div>
      </header>

      {/* Main Container wrapping Content */}
      <main id="main-content-area" className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-12">
        
        {/* Banner Area (Recreated Graphic Design Hero) */}
        <section id="banner-hero" className="w-full">
          <InteractiveBanner
            customMedia={customMedia}
            onNavigateToTab={(sectionId) => scrollToSection(sectionId)}
          />
        </section>

        {/* Floating Quick Action Cards (Bento style grid intro) */}
        <section id="quick-action-intro" className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            id="action-card-diagnostico"
            onClick={() => scrollToSection('diagnostic-hub')}
            className="flex items-center gap-4 p-5 bg-gradient-to-br from-emerald-950/30 to-emerald-900/10 border border-emerald-500/10 hover:border-emerald-500/35 rounded-2xl text-left transition-all duration-300 shadow-md group cursor-pointer"
          >
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-stone-100">Simulador de Pendências</h4>
              <p className="text-[10px] text-stone-400 mt-1">Descubra multas e verifique a situação do seu CNPJ em 4 passos rápidos.</p>
            </div>
          </button>

          <button
            id="action-card-calculadora"
            onClick={() => scrollToSection('calculator-hub')}
            className="flex items-center gap-4 p-5 bg-gradient-to-br from-emerald-950/30 to-emerald-900/10 border border-emerald-500/10 hover:border-emerald-500/35 rounded-2xl text-left transition-all duration-300 shadow-md group cursor-pointer"
          >
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl group-hover:scale-105 transition-transform">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-stone-100">Calculadora Tributária</h4>
              <p className="text-[10px] text-stone-400 mt-1">Estime multas de DASN, juros do DAS acumulado e prejuízos no CPF.</p>
            </div>
          </button>

          <button
            id="action-card-inteligencia"
            onClick={() => scrollToSection('chat-hub')}
            className="flex items-center gap-4 p-5 bg-gradient-to-br from-emerald-950/30 to-emerald-900/10 border border-emerald-500/10 hover:border-emerald-500/35 rounded-2xl text-left transition-all duration-300 shadow-md group cursor-pointer"
          >
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl group-hover:scale-105 transition-transform">
              <MessageSquare className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-stone-100">Consultor por IA</h4>
              <p className="text-[10px] text-stone-400 mt-1">Converse com o robô especialista treinado com a assessoria do Marcello.</p>
            </div>
          </button>
        </section>

        {/* Diagnostic Wizard Core Section */}
        <section
          id="diagnostic-hub"
          className={`space-y-4 transition-all duration-300 ${highlightedTool === 'diagnostic-hub' ? 'ring-2 ring-emerald-400 ring-offset-4 ring-offset-stone-950 rounded-2xl p-1' : ''}`}
        >
          <div className="flex flex-col md:flex-row md:items-end md:justify-between px-2">
            <div>
              <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider font-sans">01. Auditoria Rápida</span>
              <h2 className="text-2xl font-bold font-display tracking-tight text-stone-100 mt-0.5">Diagnóstico MEI Exclusivo</h2>
            </div>
            <p className="text-xs text-stone-400 font-sans max-w-sm mt-1 md:mt-0 leading-relaxed text-left md:text-right">
              Saiba exatamente o que está impedindo você de ficar regularizado de forma totalmente interativa.
            </p>
          </div>
          <DiagnosticWizard onDiagnosticComplete={(txt) => console.log('D-Done', txt)} />
        </section>

        {/* Debt Calculator Section */}
        <section
          id="calculator-hub"
          className={`space-y-4 transition-all duration-300 ${highlightedTool === 'calculator-hub' ? 'ring-2 ring-emerald-400 ring-offset-4 ring-offset-stone-950 rounded-2xl p-1' : ''}`}
        >
          <div className="flex flex-col md:flex-row md:items-end md:justify-between px-2">
            <div>
              <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider font-sans">02. Cálculos e Valores</span>
              <h2 className="text-2xl font-bold font-display tracking-tight text-stone-100 mt-0.5">Calculadora de Custos & Multas</h2>
            </div>
            <p className="text-xs text-stone-400 font-sans max-w-sm mt-1 md:mt-0 leading-relaxed text-left md:text-right">
              Descubra os valores aproximados das guias DAS acumuladas em atrasos e faturas declaratórias antes de acertar com o fisco.
            </p>
          </div>
          <DebtCalculator />
        </section>

        {/* AI Clinic & FAQ (Split Bento grid segment) */}
        <section id="ai-and-faq-segment" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* AI Chat Left Column */}
          <div
            id="chat-hub"
            className={`lg:col-span-7 space-y-4 transition-all duration-300 ${highlightedTool === 'chat-hub' ? 'ring-2 ring-emerald-400 ring-offset-4 ring-offset-stone-950 rounded-2xl p-1' : ''}`}
          >
            <div className="px-2">
              <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider font-sans">03. Inteligência Artificial</span>
              <h2 className="text-2xl font-bold font-display tracking-tight text-stone-100 mt-0.5">Consultor Fiscal 24 Horas</h2>
              <p className="text-xs text-stone-400 mt-1 font-sans">
                Tire suas dúvidas técnicas sobre DASN, parcelamento, CNPJ suspenso ou multas imediatamente com o cérebro virtual do escritório.
              </p>
            </div>
            <AIConsultantChat onSuggestAction={(text) => console.log('Suggest', text)} />
          </div>

          {/* FAQ Accordion Right Column */}
          <div id="faq-hub" className="lg:col-span-5 space-y-4">
            <div className="px-2">
              <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider font-sans font-semibold">04. Informações de Lei</span>
              <h2 className="text-2xl font-bold font-display tracking-tight text-stone-100 mt-0.5">Dúvidas Resolvidas</h2>
              <p className="text-xs text-stone-400 mt-1 font-sans">
                Entenda o regimento oficial do Ministério da Fazenda e as obrigações reais do seu microempreendimento.
              </p>
            </div>

            <div className="bg-emerald-950/20 border border-emerald-500/10 rounded-2xl p-5 md:p-6 space-y-3.5 backdrop-blur-md">
              {faqItems.map((item, idx) => {
                const isOpen = faqOpenIdx === idx;
                return (
                  <div id={`faq-item-${idx}`} key={idx} className="border-b border-emerald-500/5 pb-3 last:border-0 last:pb-0 font-sans">
                    <button
                      id={`faq-toggle-${idx}`}
                      onClick={() => setFaqOpenIdx(isOpen ? null : idx)}
                      className="w-full flex justify-between items-center text-left py-2 hover:text-emerald-400 transition-colors cursor-pointer"
                    >
                      <span className="text-[12.5px] font-bold text-stone-200 pr-4 leading-tight">
                        {item.q}
                      </span>
                      <ChevronDown className={`w-4 h-4 text-emerald-400 flex-shrink-0 transition-transform duration-250 ${isOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isOpen && (
                      <div
                        id={`faq-ans-${idx}`}
                        className="text-xs text-stone-400 leading-relaxed mt-2 pl-1 animate-in slide-in-from-top-1 duration-150"
                      >
                        {item.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Credibility Seal Card */}
            <div id="credibility-seal" className="p-5 bg-gradient-to-r from-emerald-950/40 to-emerald-900/10 border border-emerald-500/15 rounded-2xl flex gap-4 items-center font-sans shadow-md">
              <div className="p-3 bg-emerald-500/15 text-emerald-400 rounded-xl">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-stone-100 flex items-center gap-1">
                  Seladores de Conformidade MEI
                  <Award className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400/20" />
                </h4>
                <p className="text-[10px] text-stone-400 mt-0.5 leading-normal">
                  Todas as guias, certidões e parcelamentos produzidos pela assessoria do especialista Marcello Bernardo seguem as rígidas normas e limites da Lei Complementar nº 123/2006.
                </p>
              </div>
            </div>

          </div>
        </section>

      </main>

      {/* Dynamic Customizable Local Media configuration selector */}
      <MediaConfig
        photoUrl={customMedia.photoUrl}
        bannerUrl={customMedia.bannerUrl}
        useGraphicMode={customMedia.useGraphicMode}
        onUpdateMedia={handleUpdateMedia}
      />

      {/* Professional Footer */}
      <footer id="main-footer" className="mt-20 border-t border-emerald-500/10 bg-stone-950/60 py-10 px-6 md:px-12 text-center text-xs text-stone-500 font-sans">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-left space-y-1 md:space-y-0.5">
            <span className="font-bold text-stone-400 text-sm font-display tracking-tight">Marcello Montefusco Bernardo</span>
            <p className="text-[10px] text-stone-500">Regularidade Fiscal & Planejamento Tributário MEI.</p>
          </div>
          
          <div className="flex gap-4 text-[10px] text-stone-500">
            <button onClick={() => scrollToSection('diagnostic-hub')} className="hover:text-stone-300">Simulador</button>
            <span>•</span>
            <button onClick={() => scrollToSection('calculator-hub')} className="hover:text-stone-300">Calculadora</button>
            <span>•</span>
            <button onClick={() => scrollToSection('chat-hub')} className="hover:text-stone-300">Chatbot IA</button>
          </div>

          <div>
            <span className="text-[10px]">
              Desenvolvido com excelência técnica • {new Date().getFullYear()}
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
