import React, { useState } from 'react';
import { ShieldCheck, Receipt, FileSignature, Wallet, ArrowRight, ArrowLeft, RefreshCw, Send, CheckCircle2, AlertTriangle, HelpCircle } from 'lucide-react';
import { MEIDiagnosis, LeadData } from '../types';

interface DiagnosticWizardProps {
  onDiagnosticComplete: (summaryText: string) => void;
}

const INITIAL_DIAGNOSIS: MEIDiagnosis = {
  cnpjState: 'dont_know',
  hasOwedDAS: false,
  monthsOwedDAS: 0,
  hasMissedDASN: false,
  lastDASNYear: '',
  annualBilling: 0,
  legalIssues: {
    hasFine: false,
    hasExecution: false,
    hasSocialBenefitsRisks: false,
  },
  hasStateIncentives: false,
};

export default function DiagnosticWizard({ onDiagnosticComplete }: DiagnosticWizardProps) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<MEIDiagnosis>(INITIAL_DIAGNOSIS);
  const [lead, setLead] = useState<LeadData>({ name: '', phone: '', cnpj: '', issueDescription: '' });
  const [aiReport, setAiReport] = useState<string>('');
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Custom step actions
  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const startOver = () => {
    setData(INITIAL_DIAGNOSIS);
    setLead({ name: '', phone: '', cnpj: '', issueDescription: '' });
    setAiReport('');
    setIsSubmitted(false);
    setStep(1);
  };

  // Generate localized results immediately in the client side for speed
  const calculateAnalysis = () => {
    let risks = [];
    let actions = [];
    let priority: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';
    let estimateCost = 0;

    if (data.cnpjState === 'irregular') {
      risks.push('Seu CNPJ está suspenso ou com risco iminente de baixa de ofício.');
      actions.push('É necessário realizar a auditoria das DASNs omissas e do parcelamento especial.');
      priority = 'HIGH';
    }

    if (data.hasOwedDAS && data.monthsOwedDAS > 0) {
      const approxDebt = data.monthsOwedDAS * 87.05; // approx DAS in 2026
      estimateCost += approxDebt;
      risks.push(`Existência de ${data.monthsOwedDAS} guia(s) DAS pendente(s), com incidência de multa diária (0,33%/dia) e Juros SELIC.`);
      actions.push('Consolidar débitos do Simples Nacional no portal e-CAC para avaliação de parcelas.');
      if (data.monthsOwedDAS > 6) priority = 'HIGH';
      else if (priority !== 'HIGH') priority = 'MEDIUM';
    }

    if (data.hasMissedDASN) {
      estimateCost += 50.0; // minimum fine for late declaration
      risks.push('Multa automática mínima de R$ 50,00 por declaração anual em atraso.');
      actions.push('Transmitir com urgência a DASN-SIMEI retroativa pendente.');
      priority = 'HIGH';
    }

    if (data.annualBilling > 81000) {
      risks.push('Estouro do teto atual do faturamento MEI (R$ 81.000,00 por ano).');
      actions.push('Realizar desenquadramento legal imediato para Microempresa (ME) para evitar cobrança multa tributária retroativa.');
      priority = 'HIGH';
    }

    return { risks, actions, priority, estimateCost };
  };

  const { risks, actions, priority, estimateCost } = calculateAnalysis();

  const handleGenerateAIReport = async () => {
    setIsGeneratingReport(true);
    try {
      const response = await fetch('/api/diagnose', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ diagnosisData: data }),
      });
      const resData = await response.json();
      setAiReport(resData.result);
      onDiagnosticComplete(resData.result);
    } catch (err) {
      console.error(err);
      setAiReport('Ocorreu um erro ao gerar o plano de inteligência artificial, mas fique tranquilo(a)! Seus dados mostram que seu CNPJ precisa de atenção imediata. Você pode falar direto com o Marcelo no WhatsApp.');
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const handleWhatsAppRedirect = () => {
    const stateStr = data.cnpjState === 'irregular' ? 'irregular' : data.cnpjState === 'regular' ? 'regular' : 'desconhecida';
    const owedStr = data.hasOwedDAS ? `tenho ${data.monthsOwedDAS} parcelas de DAS atrasadas` : 'não tenho DAS atrasadas';
    const declarationStr = data.hasMissedDASN ? 'deixei de enviar a declaração anual DASN' : 'estou em dia com as declarações';
    const faturamentoStr = data.annualBilling > 0 ? `com faturamento de R$ ${data.annualBilling}` : '';

    const customMessage = `Olá Marcello! Realizei o diagnóstico express no seu simulador. Sou o(a) ${lead.name || 'Microempreendedor'}. Meu CNPJ está com situação ${stateStr}, ${owedStr}, e ${declarationStr} ${faturamentoStr}. Gostaria de obter seu atendimento profissional para regularizar minhas pendências fiscais MEI com segurança!`;

    const encodedMsg = encodeURIComponent(customMessage);
    const whatsappUrl = `https://wa.me/5511949862676?text=${encodedMsg}`;
    window.open(whatsappUrl, '_blank');
    setIsSubmitted(true);
  };

  return (
    <div id="diagnostic-card" className="bg-emerald-950/45 border border-emerald-500/20 rounded-2xl p-6 md:p-8 backdrop-blur-md">
      {/* ProgressBar */}
      {step <= 4 && (
        <div className="w-full bg-emerald-950/50 rounded-full h-1 mb-8" id="diagnostic-progress-bg">
          <div
            className="bg-emerald-400 h-1 rounded-full transition-all duration-300"
            style={{ width: `${(step / 4) * 100}%` }}
            id="diagnostic-progress-bar"
          />
        </div>
      )}

      {/* STEP 1: CNPJ State */}
      {step === 1 && (
        <div id="step-1" className="space-y-6">
          <div className="flex gap-3 items-start">
            <div className="p-3 bg-emerald-500/15 text-emerald-300 rounded-xl inline-flex">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] uppercase text-emerald-400 font-semibold tracking-wider font-sans leading-none mb-1">Passo 1 de 4</p>
              <h3 id="step-1-title" className="text-xl font-bold text-stone-100 font-sans tracking-tight">Qual a Situação do seu CNPJ MEI hoje?</h3>
              <p className="text-xs text-stone-400 font-sans mt-1">Isso ajuda a entender a urgência legal diante da Receita Federal.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            {[
              { id: 'regular', label: 'Regularizado (CNPJ Ativo & Sem Problemas)', desc: 'Gostaria apenas de manter sob controle.' },
              { id: 'irregular', label: 'Irregular / Suspenso / Cancelado', desc: 'Não consigo faturar, emitir notas ou tenho dívidas.' },
              { id: 'dont_know', label: 'Não sei se tenho Pendências', desc: 'Gostaria de fazer uma auditoria completa.' },
              { id: 'unregistered', label: 'Ainda Não Tenho (Pretendo abrir)', desc: 'Desejo auxilio para criar meu MEI corretamente.' },
            ].map((opt) => (
              <button
                id={`cnpj-state-btn-${opt.id}`}
                key={opt.id}
                onClick={() => {
                  setData({ ...data, cnpjState: opt.id as any });
                  nextStep();
                }}
                className={`p-4 rounded-xl border text-left font-sans transition-all duration-200 cursor-pointer ${
                  data.cnpjState === opt.id
                    ? 'bg-emerald-900/50 border-emerald-400 text-white shadow-md'
                    : 'bg-emerald-950/20 border-emerald-900/50 text-stone-300 hover:border-emerald-700/50 hover:bg-emerald-900/10'
                }`}
              >
                <div className="font-semibold text-sm">{opt.label}</div>
                <div className="text-[11px] text-stone-400 mt-0.5">{opt.desc}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* STEP 2: Owed DAS */}
      {step === 2 && (
        <div id="step-2" className="space-y-6">
          <div className="flex gap-3 items-start">
            <div className="p-3 bg-emerald-500/15 text-emerald-300 rounded-xl inline-flex">
              <Receipt className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] uppercase text-emerald-400 font-semibold tracking-wider font-sans leading-none mb-1">Passo 2 de 4</p>
              <h3 id="step-2-title" className="text-xl font-bold text-stone-100 font-sans tracking-tight">Você possui Boletos Mensais (DAS) em atraso?</h3>
              <p className="text-xs text-stone-400 font-sans mt-1">O imposto de DAS é obrigatório mesmo que você não esteja emitindo nota fiscal.</p>
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <div className="flex bg-emerald-950/30 p-4 border border-emerald-900/50 rounded-xl items-center justify-between">
              <span className="text-sm text-stone-300 font-medium">Tem guias de DAS atrasadas?</span>
              <div className="flex gap-2">
                <button
                  id="das-owed-yes"
                  onClick={() => setData({ ...data, hasOwedDAS: true })}
                  className={`px-4 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                    data.hasOwedDAS ? 'bg-emerald-500 text-emerald-950' : 'bg-emerald-900/20 text-stone-300'
                  }`}
                >
                  Sim, tenho
                </button>
                <button
                  id="das-owed-no"
                  onClick={() => setData({ ...data, hasOwedDAS: false, monthsOwedDAS: 0 })}
                  className={`px-4 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                    !data.hasOwedDAS ? 'bg-emerald-500 text-emerald-950' : 'bg-emerald-900/20 text-stone-300'
                  }`}
                >
                  Não
                </button>
              </div>
            </div>

            {data.hasOwedDAS && (
              <div id="das-slider-container" className="space-y-3 p-4 bg-emerald-900/10 border border-emerald-800/10 rounded-xl animate-in slide-in-from-top-2 duration-150">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-stone-300">Quantidade acumulada de guias em atraso:</span>
                  <span className="text-sm font-bold text-emerald-400">{data.monthsOwedDAS} {data.monthsOwedDAS === 1 ? 'mês' : 'meses'}</span>
                </div>
                <input
                  id="das-owed-slider"
                  type="range"
                  min="1"
                  max="36"
                  value={data.monthsOwedDAS}
                  onChange={(e) => setData({ ...data, monthsOwedDAS: parseInt(e.target.value) })}
                  className="w-full accent-emerald-500"
                />
                <p className="text-[10px] text-stone-400 leading-normal">
                  *Multa diária máxima de 20% + juros proporcionais corrigidos sob a taxa SELIC do CPF do titular.
                </p>
              </div>
            )}
          </div>

          <div className="flex justify-between pt-4">
            <button
              id="back-step-2"
              onClick={prevStep}
              className="flex items-center gap-2 px-4 py-2 text-stone-400 hover:text-stone-200 text-xs font-semibold transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </button>
            <button
              id="next-step-2"
              onClick={nextStep}
              className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer"
            >
              Avançar
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Missed DASN */}
      {step === 3 && (
        <div id="step-3" className="space-y-6">
          <div className="flex gap-3 items-start">
            <div className="p-3 bg-emerald-500/15 text-emerald-300 rounded-xl inline-flex">
              <FileSignature className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] uppercase text-emerald-400 font-semibold tracking-wider font-sans leading-none mb-1">Passo 3 de 4</p>
              <h3 id="step-3-title" className="text-xl font-bold text-stone-100 font-sans tracking-tight">E quanto à Declaração Anual de Faturamento (DASN)?</h3>
              <p className="text-xs text-stone-400 font-sans mt-1">DASN-SIMEI deve ser entregue anualmente para evitar multas de encargo fiscal.</p>
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <div className="flex bg-emerald-950/30 p-4 border border-emerald-900/50 rounded-xl items-center justify-between">
              <span className="text-sm text-stone-300 font-medium">Deixou de enviar alguma DASN anual?</span>
              <div className="flex gap-2">
                <button
                  id="dasn-missed-yes"
                  onClick={() => setData({ ...data, hasMissedDASN: true })}
                  className={`px-4 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                    data.hasMissedDASN ? 'bg-emerald-500 text-emerald-950' : 'bg-emerald-900/20 text-stone-300'
                  }`}
                >
                  Sim
                </button>
                <button
                  id="dasn-missed-no"
                  onClick={() => setData({ ...data, hasMissedDASN: false, lastDASNYear: '' })}
                  className={`px-4 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                    !data.hasMissedDASN ? 'bg-emerald-500 text-emerald-950' : 'bg-emerald-900/20 text-stone-300'
                  }`}
                >
                  Não (Estou em dia)
                </button>
              </div>
            </div>

            {data.hasMissedDASN && (
              <div id="dasn-select-container" className="space-y-3 p-4 bg-emerald-900/10 border border-emerald-800/10 rounded-xl animate-in slide-in-from-top-2 duration-150 font-sans">
                <label className="text-xs text-stone-300 block">Qual foi o último ano que declarou corretamente?</label>
                <select
                  id="dasn-last-year"
                  value={data.lastDASNYear}
                  onChange={(e) => setData({ ...data, lastDASNYear: e.target.value })}
                  className="w-full bg-emerald-950 border border-emerald-500/30 h-10 px-3 rounded-lg text-sm text-stone-200 outline-none focus:border-emerald-400"
                >
                  <option value="">Não sei / Nunca declarei</option>
                  <option value="2024">2024</option>
                  <option value="2023">2023</option>
                  <option value="2022">2022</option>
                  <option value="2021">Ou anterior</option>
                </select>
                <span className="text-[10px] text-stone-400 block mt-1 leading-normal">
                  *A multa pela não entrega da DASN-SIMEI varia a partir de R$ 50,00 por exercício sonegado.
                </span>
              </div>
            )}
          </div>

          <div className="flex justify-between pt-4">
            <button
              id="back-step-3"
              onClick={prevStep}
              className="flex items-center gap-2 px-4 py-2 text-stone-400 hover:text-stone-200 text-xs font-semibold transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </button>
            <button
              id="next-step-3"
              onClick={nextStep}
              className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer"
            >
              Avançar
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: Estimate Billing */}
      {step === 4 && (
        <div id="step-4" className="space-y-6">
          <div className="flex gap-3 items-start">
            <div className="p-3 bg-emerald-500/15 text-emerald-300 rounded-xl inline-flex">
              <Wallet className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] uppercase text-emerald-400 font-semibold tracking-wider font-sans leading-none mb-1">Passo 4 de 4</p>
              <h3 id="step-4-title" className="text-xl font-bold text-stone-100 font-sans tracking-tight">Qual o seu Faturamento Bruto Anual estimado?</h3>
              <p className="text-xs text-stone-400 font-sans mt-1">Isso verifica se você não estourou o limite legal para desenquadrar do SIMEI.</p>
            </div>
          </div>

          <div className="space-y-5 pt-2">
            <div className="flex justify-between text-xs text-stone-300">
              <span>Faturamento estimado em R$:</span>
              <span className="font-bold text-emerald-400">R$ {data.annualBilling.toLocaleString('pt-BR')}</span>
            </div>
            <input
              id="annual-billing-slider"
              type="range"
              min="0"
              max="120000"
              step="5000"
              value={data.annualBilling}
              onChange={(e) => setData({ ...data, annualBilling: parseInt(e.target.value) })}
              className="w-full accent-emerald-500"
            />
            <div className="flex justify-between text-[10px] text-stone-400 font-medium">
              <span>Até R$ 50 mil</span>
              <span>Teto MEI R$ 81 mil</span>
              <span className="text-red-400 font-bold">Estouro (+ R$ 81 mil)</span>
            </div>

            {data.annualBilling > 81000 && (
              <div id="billing-warning" className="flex items-start gap-2.5 p-4 bg-red-950/30 border border-red-500/30 rounded-xl text-red-300 text-xs leading-normal font-sans animate-in zoom-in-95 duration-200">
                <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">Atenção Extrema: Limite Excedido!</span>
                  Seu faturamento excede o limite legal de R$ 81.000,00 por ano. Você deve realizar o desenquadramento do SIMEI e migrar para ME (Microempresa) para evitar pesadas multas retroativas.
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-between pt-4">
            <button
              id="back-step-4"
              onClick={prevStep}
              className="flex items-center gap-2 px-4 py-2 text-stone-400 hover:text-stone-200 text-xs font-semibold transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </button>
            <button
              id="finish-step-4"
              onClick={() => {
                nextStep();
                handleGenerateAIReport();
              }}
              className="flex items-center gap-2 px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 text-xs font-bold rounded-xl transition-all shadow-lg cursor-pointer"
            >
              Ver Resultado do Diagnóstico
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: Results & CTA */}
      {step === 5 && (
        <div id="diagnostic-results" className="space-y-6">
          <div className="border-b border-emerald-500/10 pb-4">
            <h3 id="result-title" className="text-xl font-bold text-stone-100 flex items-center gap-2">
              <CheckCircle2 className="w-6 h-6 text-emerald-400" />
              Resultado Preliminar do seu MEI
            </h3>
            <p className="text-xs text-stone-400 mt-1">Este diagnóstico rápido foi consolidado e está pronto.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Direct Risks */}
            <div id="risks-block" className="space-y-3 bg-emerald-950/30 border border-emerald-500/10 rounded-xl p-4 font-sans">
              <h4 className="text-xs font-bold text-red-400 uppercase tracking-wider flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" /> Riscos e Multas Potenciais
              </h4>
              {risks.length > 0 ? (
                <ul className="space-y-2 list-disc pl-4 text-xs text-stone-300 leading-relaxed">
                  {risks.map((risk, idx) => (
                    <li key={idx}>{risk}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-stone-400">Seu MEI apresenta uma situação legal preliminarmente segura. Parabéns!</p>
              )}
              {estimateCost > 0 && (
                <div className="mt-4 pt-3 border-t border-emerald-500/10 text-xs text-stone-400">
                  Multas Estimadas: <span className="font-bold text-red-400 text-sm">~ R$ {estimateCost.toFixed(2)}</span>
                </div>
              )}
            </div>

            {/* Direct Recommendations */}
            <div id="recs-block" className="space-y-3 bg-emerald-950/30 border border-emerald-500/10 rounded-xl p-4 font-sans">
              <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 font-bold" /> Ações de Regularização Recomendadas
              </h4>
              {actions.length > 0 ? (
                <ul className="space-y-2 list-none text-xs text-stone-300 leading-relaxed">
                  {actions.map((act, idx) => (
                    <li key={idx} className="flex gap-1.5 items-start">
                      <span className="text-emerald-400 font-bold">✓</span> {act}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-stone-400">Nenhum plano emergencial de dívidas necessário. Ideal realizar uma revisão anual de segurança.</p>
              )}
            </div>
          </div>

          {/* AI generated audit */}
          <div id="ai-auditor-section" className="bg-emerald-900/10 border border-emerald-500/15 rounded-xl p-4 font-sans space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-emerald-400/20 text-emerald-300 flex items-center justify-center text-[10px] font-bold">IA</div>
              <span className="text-xs font-bold text-emerald-300 uppercase tracking-wide">Plano de Inteligência Artificial do Especialista</span>
            </div>
            {isGeneratingReport ? (
              <div className="flex items-center gap-2 text-xs text-stone-400 py-3">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                Estruturando sua auditoria personalizada do Simples Nacional...
              </div>
            ) : (
              <div className="text-xs text-stone-300 leading-relaxed whitespace-pre-wrap select-text selection:bg-emerald-800/60 pb-1">
                {aiReport}
              </div>
            )}
          </div>

          {/* Lead submission form & CTA */}
          <div id="lead-submission-form" className="bg-emerald-900/40 border border-emerald-500/30 rounded-xl p-5 space-y-4">
            <h4 className="text-xs font-bold text-stone-200 uppercase tracking-wide font-sans">Receba Suporte do Especialista Marcello Bernardo</h4>
            <p className="text-xs text-stone-400 font-sans leading-relaxed">
              Preencha o formulário abaixo para enviar o relatório diretamente para o WhatsApp do Marcello. Ele revisará os detalhes gratuitamente.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                id="lead-name"
                placeholder="Seu Nome completo *"
                value={lead.name}
                onChange={(e) => setLead({ ...lead, name: e.target.value })}
                className="bg-emerald-950/40 border border-emerald-500/25 rounded-lg h-10 px-3 text-xs text-stone-200 outline-none focus:border-emerald-400"
              />
              <input
                id="lead-phone"
                placeholder="WhatsApp (ex: 11 94986-2676) *"
                value={lead.phone}
                onChange={(e) => setLead({ ...lead, phone: e.target.value })}
                className="bg-emerald-950/40 border border-emerald-500/25 rounded-lg h-10 px-3 text-xs text-stone-200 outline-none focus:border-emerald-400"
              />
            </div>

            <button
              id="cta-send-whatsapp"
              onClick={handleWhatsAppRedirect}
              disabled={!lead.name || !lead.phone}
              className="w-full flex justify-center items-center gap-2 py-3 bg-emerald-500 disabled:bg-emerald-900 hover:bg-emerald-400 text-emerald-950 disabled:text-emerald-700 font-bold rounded-xl text-xs transition duration-200 uppercase tracking-wide cursor-pointer"
            >
              <Send className="w-4 h-4" />
              Enviar Relatório e Falar no WhatsApp com o Marcello
            </button>
            {isSubmitted && (
              <div className="text-[10px] text-emerald-400 font-semibold text-center font-sans tracking-wide">
                ✓ Seus dados de simulação foram pré-formatados! Fale no App do WhatsApp agora.
              </div>
            )}
          </div>

          <div className="flex justify-start">
            <button
              id="restart-wizard"
              onClick={startOver}
              className="flex items-center gap-1.5 text-stone-400 hover:text-emerald-400 text-xs font-semibold transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Fazer outra simulação
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
