import React from 'react';
import { Bot, PhoneCall, Heart, BadgeCheck, AlertCircle, HelpCircle, Star, Sparkles } from 'lucide-react';
import { CustomMedia } from '../types';

interface InteractiveBannerProps {
  customMedia: CustomMedia;
  onNavigateToTab: (tabId: string) => void;
}

export default function InteractiveBanner({ customMedia, onNavigateToTab }: InteractiveBannerProps) {
  const isGraphic = !!customMedia.bannerUrl && !!customMedia.useGraphicMode;

  return (
    <div
      id="hero-banner-area"
      className={`relative w-full rounded-3xl overflow-hidden border border-emerald-500/20 shadow-2xl transition-all duration-300 select-none flex items-center ${
        isGraphic ? 'aspect-[27/10] lg:aspect-auto lg:min-h-[500px]' : 'min-h-[500px]'
      }`}
      style={{
        background: customMedia.bannerUrl
          ? isGraphic
            ? `url(${customMedia.bannerUrl}) no-referrer center center / cover`
            : `linear-gradient(135deg, rgba(2, 26, 17, 0.95) 0%, rgba(2, 40, 24, 0.85) 100%), url(${customMedia.bannerUrl}) no-referrer center center / cover`
          : 'radial-gradient(circle at 80% 80%, #034f31 0%, #011c11 55%, #000c07 100%)',
      }}
    >
      {/* Recreated Dynamic Concentric Orbits (Slightly Pulsing & Rotating) */}
      {!customMedia.bannerUrl && !isGraphic && (
        <div id="concentric-orbits-background" className="absolute left-0 top-0 bottom-0 right-0 w-full h-full pointer-events-none overflow-hidden">
          <div className="absolute left-[-150px] top-[calc(50%-250px)] w-[500px] h-[500px] rounded-full border border-emerald-500/10 animated-glow-circle" />
          <div className="absolute left-[-100px] top-[calc(50%-200px)] w-[400px] h-[400px] rounded-full border border-emerald-500/20 animated-glow-circle" style={{ animationDelay: '1s' }} />
          <div className="absolute left-[-50px] top-[calc(50%-150px)] w-[300px] h-[300px] rounded-full border-2 border-emerald-400/20 animated-glow-circle" style={{ animationDelay: '2s' }} />
          
          {/* Faint ambient details */}
          <div className="absolute right-[10%] top-[10%] w-2 h-2 rounded-full bg-emerald-400 opacity-20" />
          <div className="absolute right-[20%] bottom-[15%] w-3 h-3 rounded-full bg-emerald-400 opacity-10 animate-pulse" />
          <div className="absolute left-[30%] top-[40%] w-1.5 h-1.5 rounded-full bg-emerald-400 opacity-20" />
        </div>
      )}

      {/* Grid Layout conforming to User Banner Blueprint */}
      <div 
        id="hero-banner-grid" 
        className={`relative z-10 w-full px-6 py-12 md:py-14 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center ${
          isGraphic ? 'h-full flex flex-col justify-end lg:grid' : ''
        }`}
      >
        
        {/* Left Column: Concentric Circle Glowing Profile Photo Container */}
        <div 
          id="hero-avatar-area" 
          className={`lg:col-span-4 flex justify-center lg:justify-start w-full transition-all duration-300 ${
            isGraphic 
              ? 'scale-50 sm:scale-75 md:scale-90 lg:scale-100 origin-center lg:-translate-x-2' 
              : ''
          }`}
        >
          <div className="relative flex items-center justify-center w-[230px] h-[230px] sm:w-[240px] sm:h-[240px]">
            {/* Ambient Circular Frame Overlay representing the banner design */}
            <div className={`absolute w-[250px] h-[250px] rounded-full border border-emerald-400/15 ${isGraphic ? 'opacity-30' : ''}`} />
            <div className={`absolute w-[230px] h-[230px] rounded-full border border-emerald-400/25 animate-pulse ${isGraphic ? 'opacity-40' : ''}`} />
            <div className={`absolute w-[210px] h-[210px] rounded-full border-2 border-emerald-400/40 ${isGraphic ? 'border-emerald-400/60' : ''}`} />

            {/* Profile Avatar Canvas */}
            <div className="w-[190px] h-[190px] rounded-full overflow-hidden border-2 border-emerald-400 shadow-xl bg-emerald-990 flex items-center justify-center z-10 relative">
              {customMedia.photoUrl ? (
                <img
                  id="custom-marcello-avatar"
                  src={customMedia.photoUrl}
                  alt="Marcello Montefusco Bernardo"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
              ) : (
                /* Native Vector Profile Representation - Matches Bald Marcello with Grey gradient */
                <svg
                  id="vector-marcello-avatar"
                  viewBox="0 0 200 200"
                  className="w-full h-full bg-gradient-to-tr from-stone-800 to-stone-600"
                >
                  <defs>
                    <linearGradient id="skinGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#dcb392" />
                      <stop offset="100%" stopColor="#9a6e4d" />
                    </linearGradient>
                    <linearGradient id="shirtGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#1e293b" />
                      <stop offset="100%" stopColor="#0f172a" />
                    </linearGradient>
                  </defs>
                  {/* Shoulders / Shirt */}
                  <path d="M40,200 L160,200 C160,165 150,135 125,120 C115,125 105,126 100,126 C95,126 85,125 75,120 C50,135 40,165 40,200 Z" fill="url(#shirtGrad)" />
                  {/* Neck */}
                  <path d="M85,115 L115,115 L112,135 L88,135 Z" fill="#9a6e4d" />
                  {/* Bald Head / Ears */}
                  <circle cx="80" cy="95" r="10" fill="#9a6e4d" />
                  <circle cx="120" cy="95" r="10" fill="#9a6e4d" />
                  <path d="M70,95 C70,55 130,55 130,95 C130,125 70,125 70,95 Z" fill="url(#skinGrad)" />
                  {/* Symmetrical beard detail / chin shadow */}
                  <path d="M72,95 C75,115 125,115 128,95 C120,122 80,122 72,95 Z" fill="#5c3f2b" opacity="0.4" />
                  {/* Closed mouth */}
                  <path d="M92,112 L108,112" stroke="#5c3f2b" strokeWidth="2" strokeLinecap="round" />
                  {/* Subtle eyes and eyebrows */}
                  <path d="M80,84 C85,82 90,83 93,85" stroke="#3b2314" strokeWidth="2" strokeLinecap="round" fill="none" />
                  <path d="M120,84 C115,82 110,83 107,85" stroke="#3b2314" strokeWidth="2" strokeLinecap="round" fill="none" />
                  <circle cx="86" cy="90" r="3" fill="#2d170b" />
                  <circle cx="114" cy="90" r="3" fill="#2d170b" />
                  <circle cx="87.5" cy="88.5" r="1" fill="#ffffff" />
                  <circle cx="115.5" cy="88.5" r="1" fill="#ffffff" />
                  {/* Subtle nose */}
                  <path d="M97,93 L100,101 L103,93" stroke="#8d5f3f" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                </svg>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Copywriting, Badges, CTA */}
        <div id="hero-info-area" className={`lg:col-span-8 space-y-8 lg:space-y-6 text-center lg:text-left transition-all duration-300 w-full pt-4 lg:pt-0 ${isGraphic ? 'py-4 lg:py-0' : ''}`}>
          
          {!isGraphic ? (
            <>
              <div className="flex justify-center lg:justify-start">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-900/50 border border-emerald-400/30 rounded-full text-[10px] md:text-xs text-emerald-300 font-semibold tracking-wider font-sans uppercase">
                  <Star className="w-3 h-3 fill-emerald-300" />
                  Consultoria Especializada MEI
                </div>
              </div>

              <div className="space-y-4 md:space-y-3">
                <h1 id="hero-main-title" className="text-3.5xl md:text-4.5xl font-extrabold font-display leading-[1.15] text-stone-100 tracking-tight">
                  Resolva os <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300 font-extrabold block md:inline italic">Problemas Fiscais</span> do seu MEI
                </h1>
                <p id="hero-subtitle" className="text-sm md:text-base text-stone-300 leading-relaxed font-sans max-w-xl mx-auto lg:mx-0">
                  Regularize sua empresa rápida e juridicamente, evite multas de atraso e mantenha sua situação fiscal em dia com os órgãos da Receita Federal.
                </p>
              </div>

              {/* Dynamic Badges from the uploaded banner layout */}
              <div id="hero-badges" className="flex flex-wrap justify-center lg:justify-start gap-2 pt-2 lg:pt-1 font-sans">
                {[
                  { label: 'CNPJ irregular', type: 'error' },
                  { label: 'Débitos em aberto', type: 'warning' },
                  { label: 'DAS atrasado', type: 'warning' },
                  { label: 'DASN pendente', type: 'error' },
                ].map((badge, i) => (
                  <span
                    id={`banner-badge-${i}`}
                    key={i}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-950/80 border border-emerald-500/20 text-stone-200 text-[11px] font-semibold rounded-full hover:border-emerald-400/40 transition-colors"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    {badge.label}
                  </span>
                ))}
              </div>

              {/* Marcello Credit Card Segment mimicking the original graphic banner */}
              <div id="author-card" className="flex items-center gap-3.5 p-4 bg-emerald-950/70 border border-emerald-500/10 rounded-2xl max-w-md mx-auto lg:mx-0 font-sans shadow-md backdrop-blur-sm">
                <div className="w-2.5 h-full bg-emerald-400 rounded-lg py-5 self-stretch" />
                <div className="text-left">
                  <h4 id="marcello-name" className="text-sm font-bold text-stone-100 leading-tight">Marcello Montefusco Bernardo</h4>
                  <p id="marcello-title" className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider mt-0.5">Especialista em MEI & Tributação</p>
                </div>
              </div>
            </>
          ) : (
            /* Spacer to align photo on graphic mode background properly */
            <div className="hidden lg:block h-[120px]" />
          )}

          {/* Core Call-to-action */}
          <div 
            id="hero-actions" 
            className={`flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-5 pt-3 lg:pt-2 font-sans ${
              isGraphic ? 'lg:-translate-y-2' : ''
            }`}
          >
            {/* Primary Action Button */}
            <a
              id="fale-conosco-banner-btn"
              href="https://wa.me/5511949862676?text=Olá Marcello! Vi o seu site e gostaria de obter suporte profissional para regularizar as certidões e débitos do meu MEI."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-emerald-450 hover:bg-emerald-350 text-emerald-950 font-extrabold rounded-xl text-xs uppercase tracking-wider transition-all duration-300 shadow-lg active:scale-95"
            >
              <PhoneCall className="w-4 h-4" />
              FALE CONOSCO
            </a>

            {/* Sub-info elements */}
            <div className={`flex flex-col text-left font-sans text-xs ${isGraphic ? 'bg-stone-950/90 border border-emerald-500/20 p-2.5 px-4 rounded-xl shadow-xl backdrop-blur-md' : ''}`}>
              <span id="banner-phone-number" className="font-extrabold text-emerald-300 text-sm md:text-base flex items-center gap-1 leading-none">
                (11) 94986-2676
              </span>
              <span id="banner-instagram" className="text-stone-400 text-[10px] mt-1.5 tracking-wide leading-none">
                @marcellombernardo
              </span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
