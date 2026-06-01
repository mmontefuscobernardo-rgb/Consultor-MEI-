import React, { useState } from 'react';
import { TrendingUp, AlertTriangle, Landmark, Globe, MapPin, DollarSign, ArrowRight, ShieldCheck, FileWarning, Newspaper, Sparkles } from 'lucide-react';

export default function DebtReportSection() {
  const [activeTab, setActiveTab] = useState<'volume' | 'valor'>('volume');

  // Exact government statistics from PGFN report (May/2026)
  const totalMeis = 3.6; // milhões
  const totalDebt = 12.0; // bilhões

  const statesData = {
    volume: [
      { name: 'São Paulo (SP)', value: 1.0, label: '1,0 Milhão', percentage: 27.8, color: 'bg-rose-700' },
      { name: 'Minas Gerais (MG)', value: 0.3387, label: '338,7 Mil', percentage: 9.4, color: 'bg-rose-500' },
      { name: 'Demais Estados', value: 2.2613, label: '2,26 Milhões', percentage: 62.8, color: 'bg-stone-600' }
    ],
    valor: [
      { name: 'São Paulo (SP)', value: 3.4, label: 'R$ 3,4 Bilhões', percentage: 28.3, color: 'bg-rose-700' },
      { name: 'Minas Gerais (MG)', value: 1.1, label: 'R$ 1,1 Bilhão', percentage: 9.2, color: 'bg-rose-500' },
      { name: 'Demais Estados', value: 7.5, label: 'R$ 7,5 Bilhões', percentage: 62.5, color: 'bg-stone-600' }
    ]
  };

  return (
    <section 
      id="pgfn-report-segment" 
      className="space-y-6 bg-stone-900/60 p-6 md:p-8 rounded-3xl border border-rose-500/10 backdrop-blur-md animate-in fade-in duration-300"
    >
      {/* Editorial Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-stone-800 pb-5">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-rose-950/80 border border-rose-500/20 rounded-full text-[10px] uppercase font-bold text-rose-400 tracking-wider">
            <Newspaper className="w-3.5 h-3.5 fill-rose-950/20" />
            Notícias & Dossiê Tributário Oficial
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold font-display text-stone-100 tracking-tight">
            Mais de <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-amber-300">3,6 Milhões</span> de MEIs na Dívida Ativa
          </h2>
          <p className="text-xs text-stone-400 max-w-xl font-sans leading-relaxed">
            A Procuradoria-Geral da Fazenda Nacional (PGFN, Maio de 2026) emitiu um novo balanço de cobrança para microempresas que acumularam guias DAS não pagas. Os prejuízos fiscais agora migram diretamente para o CPF dos titulares.
          </p>
        </div>

        {/* Floating Author Quote Widget */}
        <div className="p-3 bg-stone-950/50 border border-stone-800 rounded-2xl max-w-xs text-xs font-sans">
          <p className="text-stone-300 italic">
            "A inscrição na Dívida Ativa aciona restrições severas no Cadastro do CPF pessoal, bloqueando operações bancárias básicas e aposentadorias do titular."
          </p>
          <div className="flex items-center gap-2 mt-2 pt-2 border-t border-stone-800/60">
            <div className="w-6 h-6 rounded-full bg-emerald-900 border border-emerald-500/20 text-[9px] flex items-center justify-center text-emerald-400 font-extrabold uppercase">
              MB
            </div>
            <div>
              <p className="text-[10px] font-bold text-stone-200">Marcello Bernardo</p>
              <p className="text-[9px] text-emerald-400">Consultor Especialista</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Infographic Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch pt-2">
        
        {/* Left Column (Landscape map metrics illustration & National totals) */}
        <div className="lg:col-span-5 flex flex-col justify-between bg-stone-950/30 border border-stone-800 rounded-2.5xl p-5 space-y-6">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-rose-400 font-sans">Panorama Geral</span>
            <h3 className="text-base font-bold text-stone-100">Balanço das MEIs Inscritas</h3>
            <p className="text-[11px] text-stone-400 leading-relaxed">
              O montante consolidado de débitos sob execução ativa em nível governamental indica insolvência cadastral em todo o país.
            </p>
          </div>

          {/* Glowing Map Metric Box directly reproducing the User design image */}
          <div className="relative overflow-hidden bg-gradient-to-br from-stone-900 to-stone-950/60 border border-stone-800 p-4 rounded-xl flex items-center gap-4">
            {/* Sutil gradient background representing general Brazil outline outline */}
            <div className="w-14 h-14 rounded-lg bg-amber-500/10 border border-amber-500/20 flex flex-col items-center justify-center text-center p-1.5 flex-shrink-0 relative overflow-hidden">
              <Globe className="w-6 h-6 text-amber-500 opacity-60 animate-spin-slow absolute -bottom-1 -right-1" />
              <div className="text-[9px] font-black text-amber-500 uppercase leading-none tracking-wider mb-0.5">Brasil</div>
              <span className="text-[16px] leading-none">🇧🇷</span>
            </div>

            <div className="space-y-1 leading-none">
              <div id="stat-meis" className="flex items-baseline gap-1 text-rose-400 font-black tracking-tight text-lg">
                <span>{totalMeis} Milhões</span>
                <span className="text-stone-400 text-[10px] font-medium font-sans">de empresas</span>
              </div>
              <div id="stat-debt" className="flex items-baseline gap-1 text-stone-100 font-extrabold tracking-tight text-md">
                <span className="text-amber-500">R$ {totalDebt} Bilhões</span>
                <span className="text-stone-400 text-[10px] font-medium font-sans">inscritos em dívida</span>
              </div>
            </div>
            
            {/* Visual background pattern */}
            <div className="absolute right-2 top-2">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-500/20 animate-pulse" />
            </div>
          </div>

          {/* Quick Warning Alert Badge */}
          <div className="flex gap-2.5 p-3.5 bg-rose-950/10 border border-rose-500/10 rounded-xl text-xs align-top">
            <FileWarning className="w-5 h-5 text-rose-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-bold text-rose-200">Enquadramento Coercitivo</p>
              <p className="text-stone-400 text-[10.5px] mt-0.5 leading-normal">
                Com o CNPJ inscrito na Dívida Ativa, o titular não pode prestar serviços públicos, perde o parcelamento simplificado da Receita e sofre penhora de patrimônio em juízo.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column (Visual Horizontal bars representation mirroring user report details) */}
        <div className="lg:col-span-7 flex flex-col justify-between bg-stone-950/30 border border-stone-800 rounded-2.5xl p-5 space-y-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-stone-800 pb-3">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-rose-400 font-sans">Estatísticas Estaduais</span>
              <h3 className="text-base font-bold text-stone-100">Visão Geral dos Concentrados</h3>
            </div>

            {/* Mode Switcher Tabs exactly mirroring user variables */}
            <div className="inline-flex p-1 bg-stone-900 border border-stone-800 rounded-xl w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setActiveTab('volume')}
                className={`flex-1 sm:flex-initial px-3 py-1.5 text-[11px] font-bold rounded-lg transition-all uppercase tracking-wider cursor-pointer ${
                  activeTab === 'volume' 
                    ? 'bg-rose-900/50 border border-rose-400/30 text-rose-300 font-extrabold' 
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                Inscritos (Qtd)
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('valor')}
                className={`flex-1 sm:flex-initial px-3 py-1.5 text-[11px] font-bold rounded-lg transition-all uppercase tracking-wider cursor-pointer ${
                  activeTab === 'valor' 
                    ? 'bg-rose-900/50 border border-rose-400/30 text-rose-300 font-extrabold' 
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                Valor Devido (R$)
              </button>
            </div>
          </div>

          {/* Interactive Responsive Charts Grid */}
          <div className="space-y-5">
            <h4 className="text-xs font-semibold text-stone-300 uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-rose-400" />
              {activeTab === 'volume' ? 'Distribuição de MEIs Inscritos em Dívida Ativa' : 'Valor Total Acumulado das Dívidas Estaduais'}
            </h4>

            <div className="space-y-4">
              {statesData[activeTab].map((state, i) => (
                <div key={i} className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-stone-200 flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${state.color.replace('bg-', 'bg-') || 'bg-stone-400'}`} />
                      {state.name}
                    </span>
                    <span className="font-mono font-bold text-rose-300">{state.label} <span className="text-[10px] text-stone-500">({state.percentage}%)</span></span>
                  </div>
                  
                  {/* Visual Bar mirroring color schema in user report */}
                  <div className="h-3 w-full bg-stone-900 rounded-lg overflow-hidden border border-stone-850 p-0.5 flex">
                    <div 
                      className={`h-full rounded-md ${state.color} animate-pulse shadow-inner transition-all duration-1000`} 
                      style={{ width: `${state.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Legend Details matching exactly the third image's representation */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-[10px] text-stone-400 leading-normal border-t border-stone-800/80 pt-3 bg-stone-950/20 px-3 py-2 rounded-xl">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-700 block flex-shrink-0" />
              <span><strong>São Paulo (SP)</strong> lidera isoladamente</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 block flex-shrink-0" />
              <span><strong>Minas Gerais (MG)</strong> ocupa o 2º lugar</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-stone-600 block flex-shrink-0" />
              <span>Outros Estados Brasileiros</span>
            </div>
          </div>

          {/* Graphic Footer (Original Metadata Source) */}
          <div className="flex items-center justify-between text-[9px] text-stone-500 font-mono">
            <span>Fonte de Amostra Estatística: PG-Fazenda Nacional</span>
            <span>Estudo: PGFN, Maio/2026</span>
          </div>
        </div>

      </div>

      {/* Interactive Bottom CTA Hook */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-rose-950/15 border border-rose-500/10 rounded-2xl">
        <div className="flex items-center gap-3 text-left">
          <div className="p-2.5 bg-rose-500/10 text-rose-400 rounded-xl flex-shrink-0">
            <Landmark className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h4 id="editorial-call-title" className="text-xs font-bold text-stone-100 font-sans leading-none">O seu CNPJ está envolvido nesse volume crítico?</h4>
            <p id="editorial-call-subtitle" className="text-[10px] text-stone-400 mt-1.5 leading-normal">Utilize nosso simulador interativo oficial para extrair o diagnóstico de dívida ativa em tempo real.</p>
          </div>
        </div>
        <button
          id="scroll-to-wizard-btn-report"
          type="button"
          onClick={() => {
            const el = document.getElementById('diagnostic-hub');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          className="w-full sm:w-auto px-5 py-2.5 bg-rose-500 hover:bg-rose-400 text-stone-950 font-extrabold text-xs rounded-xl uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
        >
          <span>Auditar meu CNPJ</span>
          <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
        </button>
      </div>

    </section>
  );
}
