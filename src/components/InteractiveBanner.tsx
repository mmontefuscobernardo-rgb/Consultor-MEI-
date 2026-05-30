import React from 'react';
import { Bot, PhoneCall, Heart, BadgeCheck, AlertCircle, HelpCircle, Star, Sparkles } from 'lucide-react';
import { CustomMedia } from '../types';

interface InteractiveBannerProps {
  customMedia: CustomMedia;
  onNavigateToTab: (tabId: string) => void;
}

export default function InteractiveBanner({ customMedia, onNavigateToTab }: InteractiveBannerProps) {
  const [photoError, setPhotoError] = React.useState(false);
  const [bannerError, setBannerError] = React.useState(false);

  // Reset errors if customMedia changes
  React.useEffect(() => {
    setPhotoError(false);
  }, [customMedia.photoUrl]);

  React.useEffect(() => {
    setBannerError(false);
  }, [customMedia.bannerUrl]);

  const hasBanner = !!customMedia.bannerUrl && !bannerError;
  const hasPhoto = !!customMedia.photoUrl && !photoError;
  const isGraphic = hasBanner && !!customMedia.useGraphicMode;

  return (
    <div
      id="hero-banner-area"
      className={`relative w-full rounded-3xl overflow-hidden border border-emerald-500/20 shadow-2xl transition-all duration-300 select-none flex items-center ${
        isGraphic ? 'aspect-[27/10] lg:aspect-auto lg:min-h-[500px]' : 'min-h-[500px]'
      }`}
      style={{
        background: hasBanner
          ? isGraphic
            ? `url(${customMedia.bannerUrl}) no-referrer center center / cover`
            : `linear-gradient(135deg, rgba(2, 26, 17, 0.95) 0%, rgba(2, 40, 24, 0.85) 100%), url(${customMedia.bannerUrl}) no-referrer center center / cover`
          : 'radial-gradient(circle at 80% 80%, #034f31 0%, #011c11 55%, #000c07 100%)',
      }}
    >
      {/* Recreated Dynamic Concentric Orbits (Slightly Pulsing & Rotating) */}
      {!hasBanner && !isGraphic && (
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
              {hasPhoto ? (
                <img
                  id="custom-marcello-avatar"
                  src={customMedia.photoUrl || ''}
                  alt="Marcello Montefusco Bernardo"
                  referrerPolicy="no-referrer"
                  onError={() => setPhotoError(true)}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
              ) : (
                /* Native Vector Profile Representation - Masterfully Stylized Bald Marcello in Signature Hand-on-Chin Pose */
                <svg
                  id="vector-marcello-avatar"
                  viewBox="0 0 200 200"
                  className="w-full h-full bg-gradient-to-tr from-[#315143] to-[#041a10]"
                >
                  <defs>
                    <linearGradient id="skinGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#efc19f" />
                      <stop offset="60%" stopColor="#d59a72" />
                      <stop offset="100%" stopColor="#b57248" />
                    </linearGradient>
                    <linearGradient id="shirtGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#1a202c" />
                      <stop offset="100%" stopColor="#0d1117" />
                    </linearGradient>
                  </defs>
                  
                  {/* Studio Gray/Green Backdrop Highlight */}
                  <circle cx="100" cy="100" r="95" fill="#1b2a22" opacity="0.4" />
                  <circle cx="100" cy="110" r="60" fill="#2d4a3c" opacity="0.2" />

                  {/* Shoulders / Shirt */}
                  <path d="M30,200 L170,200 C170,165 155,135 130,121 C118,125 106,127 100,127 C94,127 82,125 70,121 C45,135 30,165 30,200 Z" fill="url(#shirtGrad)" />
                  <path d="M72,122 C82,130 118,130 128,122" stroke="#2d3748" strokeWidth="2.5" fill="none" />
                  
                  {/* Neck */}
                  <path d="M84,111 L116,111 L113,132 L87,132 Z" fill="#9a5e37" />
                  <path d="M84,111 C90,122 110,122 116,111" stroke="#754320" strokeWidth="1.5" fill="none" opacity="0.3" />

                  {/* Ears */}
                  <circle cx="68" cy="91" r="9" fill="#c48a60" />
                  <circle cx="132" cy="91" r="9" fill="#c48a60" />

                  {/* Elegant Head Oval (Bald Marcello) */}
                  <path d="M68,89 C68,44 132,44 132,89 C132,121 68,121 68,89 Z" fill="url(#skinGrad)" />

                  {/* Goatee and Stubble (Goatee style matching real photo) */}
                  <path d="M71,94 C74,121 126,121 129,94 C123,124 77,124 71,94 Z" fill="#1f2937" opacity="0.65" />
                  
                  {/* Mustache block */}
                  <path d="M84,103 C93,99 107,99 116,103 C119,111 81,111 84,103 Z" fill="#111827" opacity="0.75" />

                  {/* Friendly closed mouth */}
                  <path d="M91,113 C95,116 105,116 109,113" stroke="#991b1b" strokeWidth="2" strokeLinecap="round" fill="none" />

                  {/* Mustache fine arch */}
                  <path d="M85,106 C92,102 108,102 115,106" stroke="#0f172a" strokeWidth="2.2" strokeLinecap="round" fill="none" />

                  {/* Expressive Eyebrows */}
                  <path d="M76,80 C81,77 87,77 91,80" stroke="#1f2937" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                  <path d="M109,80 C113,77 119,77 124,80" stroke="#1f2937" strokeWidth="2.5" strokeLinecap="round" fill="none" />

                  {/* Symmetrical Smiling Eyes */}
                  <path d="M77,87 C80,85 86,85 89,87" stroke="#0f172a" strokeWidth="2.2" strokeLinecap="round" fill="none" />
                  <circle cx="83.5" cy="90" r="2.8" fill="#111827" />
                  <circle cx="84.5" cy="89" r="0.8" fill="#ffffff" />

                  <path d="M111,87 C114,85 120,85 123,87" stroke="#0f172a" strokeWidth="2.2" strokeLinecap="round" fill="none" />
                  <circle cx="116.5" cy="90" r="2.8" fill="#111827" />
                  <circle cx="117.5" cy="89" r="0.8" fill="#ffffff" />

                  {/* Nose outline */}
                  <path d="M96,93 L100,101 L104,93" stroke="#8c4e2a" strokeWidth="2.2" strokeLinecap="round" fill="none" />

                  {/* Stylized Vector Hand on Chin (Thinking pose representing the uploaded portrait!) */}
                  <g id="vector-hand-pose" opacity="0.95">
                    {/* Shadow where hand touches neck */}
                    <path d="M85,138 C100,136 115,142 118,154 C100,162 82,154 85,138 Z" fill="#754320" opacity="0.4" />
                    {/* Hand base/palm resting at custom height */}
                    <path d="M86,139 C88,131 98,124 104,124 C108,124 118,127 121,136 C123,142 121,154 102,159 Z" fill="url(#skinGrad)" stroke="#754320" strokeWidth="1.2" />
                    {/* Index finger resting on side of chin */}
                    <path d="M96,128 C101,126 106,127 108,131 C109,133 108,136 104,136 L97,134" stroke="#754320" strokeWidth="1.8" strokeLinecap="round" fill="#d59a72" />
                    {/* Middle finger detail folded below index */}
                    <path d="M99,134 C103,132 107,133 108,137 C109,138 107,141 103,140" stroke="#754320" strokeWidth="1.8" strokeLinecap="round" fill="#d59a72" />
                    {/* Thumb wrapped around throat/lower jawline */}
                    <path d="M84,136 C82,141 87,145 92,143" stroke="#754320" strokeWidth="2" strokeLinecap="round" fill="#b57248" />
                  </g>
                </svg>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Copywriting, Badges, CTA */}
        <div id="hero-info-area" className={`lg:col-span-8 space-y-8 lg:space-y-6 text-center lg:text-left transition-all duration-300 w-full pt-4 lg:pt-0 ${isGraphic ? 'py-4 lg:py-0' : ''}`}>
          
          {isGraphic ? (
            /* Elegant credentials card shown next to photo to fill the empty space in graphic/banner mode */
            <div id="marcello-credentials-card" className="flex flex-col gap-4 text-left font-sans max-w-xl mx-auto lg:mx-0 bg-stone-950/85 border border-emerald-500/30 p-5 rounded-2xl shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="border-b border-emerald-500/25 pb-3">
                <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-950 border border-emerald-500/20 rounded-full text-[9px] text-emerald-400 font-extrabold tracking-wider uppercase mb-1.5">
                  <Sparkles className="w-2.5 h-2.5 fill-emerald-400 animate-pulse" />
                  Especialista de confiança
                </div>
                <h3 className="text-lg font-bold text-stone-100 flex items-center gap-1.5 mt-0.5">
                  Marcello Bernardo 
                  <BadgeCheck className="w-5 h-5 text-emerald-400 fill-emerald-950 flex-shrink-0" />
                </h3>
                <p className="text-xs text-stone-300 font-medium">Soluções Tributárias Inteligentes para Microempreendedores individuais</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs leading-normal">
                <div className="flex items-start gap-1.5 text-stone-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0 animate-pulse" />
                  <span><strong>Regularização Cadastral</strong>: Ative seu CNPJ Suspenso ou Inapto perante a Receita Federal.</span>
                </div>
                <div className="flex items-start gap-1.5 text-stone-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0 animate-pulse" />
                  <span><strong>Parcelamento Suave (60x)</strong>: Negociação de débitos acumulados com mensalidades acessíveis.</span>
                </div>
                <div className="flex items-start gap-1.5 text-stone-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0 animate-pulse" />
                  <span><strong>Declaração DASN Anual</strong>: Transmissão oficial de faturamento sem erros ou dores de cabeça.</span>
                </div>
                <div className="flex items-start gap-1.5 text-stone-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0 animate-pulse" />
                  <span><strong>Blindagem do seu CPF</strong>: Evite que dívidas de imposto paradas afetem o seu nome pessoal.</span>
                </div>
              </div>
              <div className="text-[10px] text-emerald-300/90 border-t border-emerald-500/10 pt-2 flex items-center gap-1 bg-emerald-950/20 px-2 py-1 rounded-lg">
                <span className="font-bold">✓ +1.200 MEIs Regularizados</span>
                <span className="text-stone-500">•</span>
                <span>Garantia de conformidade tributária e segurança contratual</span>
              </div>
            </div>
          ) : (
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
