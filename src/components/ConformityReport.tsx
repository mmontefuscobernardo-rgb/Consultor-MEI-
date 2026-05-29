import React, { useState } from 'react';
import { 
  FileText, 
  Printer, 
  Copy, 
  Check, 
  AlertOctagon, 
  ShieldCheck, 
  Calendar, 
  User, 
  Phone, 
  CreditCard, 
  DollarSign, 
  HelpCircle,
  Clock,
  ArrowRight
} from 'lucide-react';
import { MEIDiagnosis, LeadData } from '../types';

interface ConformityReportProps {
  diagnosis: MEIDiagnosis;
  lead: LeadData;
  onUpdateLead: (l: LeadData) => void;
  aiReport: string;
  calculatorData: {
    monthsOwed: number;
    missedYears: number;
  };
}

export default function ConformityReport({
  diagnosis,
  lead,
  onUpdateLead,
  aiReport,
  calculatorData,
}: ConformityReportProps) {
  const [copied, setCopied] = useState(false);
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [tempLead, setTempLead] = useState<LeadData>({ ...lead });

  // Calculate values dynamically
  const dasCostPerMonth = 87.05;
  const principalDas = calculatorData.monthsOwed * dasCostPerMonth;
  const penaltyAndInterest = principalDas * 0.20; // 20% estimated penalties + interest
  const dasnPenalty = calculatorData.missedYears * 50.0;
  const totalDebt = principalDas + penaltyAndInterest + dasnPenalty;

  // Evaluate risk level
  let riskLevel: 'SECURE' | 'MODERATE' | 'CRITICAL' = 'SECURE';
  let riskColor = 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5';
  let riskLabel = 'Risco Baixo (Situação Estável)';

  if (calculatorData.monthsOwed > 12 || diagnosis.cnpjState === 'irregular' || diagnosis.annualBilling > 81000) {
    riskLevel = 'CRITICAL';
    riskColor = 'text-red-400 border-red-500/20 bg-red-500/5';
    riskLabel = 'Risco Crítico (Ação Corretiva Urgente)';
  } else if (calculatorData.monthsOwed > 0 || calculatorData.missedYears > 0 || diagnosis.cnpjState === 'dont_know') {
    riskLevel = 'MODERATE';
    riskColor = 'text-amber-400 border-amber-500/20 bg-amber-500/5';
    riskLabel = 'Risco Moderado (Regularização Recomendada)';
  }

  // Handle saving temp info on the report
  const handleSaveInfo = () => {
    onUpdateLead(tempLead);
    setIsEditingInfo(false);
  };

  // Sync temp lead if external lead updates
  React.useEffect(() => {
    setTempLead({ ...lead });
  }, [lead]);

  // Copy full plain text summary
  const handleCopyText = () => {
    const stateLabels: Record<string, string> = {
      regular: 'Regularizado (CNPJ Ativo & Sem Problemas)',
      irregular: 'Irregular / Suspenso / Cancelado',
      dont_know: 'Não sei / Deseja Auditoria',
      unregistered: 'Ainda sem registro (Pretende abrir)'
    };

    const textSummary = `=================================================
RELATÓRIO DE CONFORMIDADE FISCAL MEI - AUDITORIA EXPRESS
Especialista Responsável: Marcello Bernardo - Soluções Tributárias
=================================================

DADOS DO MICROEMPREENDEDOR:
- Nome: ${lead.name || 'Não Informado'}
- WhatsApp: ${lead.phone || 'Não Informado'}
- CNPJ: ${lead.cnpj || 'Não Informado'}

DIAGNÓSTICO DA SITUAÇÃO CADASTRAL:
- Estado do CNPJ: ${stateLabels[diagnosis.cnpjState] || 'Não identificado'}
- Faturamento Anual: R$ ${(diagnosis.annualBilling || 0).toLocaleString('pt-BR')}
- Enquadramento MEI: ${diagnosis.annualBilling > 81000 ? 'EXCEDIDO DO LIMITE (Ação Corretiva Urgente)' : 'Dentro dos limites legais'}

DEMONSTRATIVO DE DÉBITOS ACUMULADOS:
- Boletos DAS Atrasados: ${calculatorData.monthsOwed} parcela(s)
- Declarações DASN Pendentes: ${calculatorData.missedYears} ano(s)
-------------------------------------------------
RESUMO FINANCEIRO ESTIMADO:
1. Valor Principal DAS atrasados: R$ ${principalDas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
2. Multas/Juros de Atraso e-CAC: R$ ${penaltyAndInterest.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
3. Punibilidade Omissão de DASN: R$ ${dasnPenalty.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
TOTAL DE DÉBITOS À RECEITA FEDERAL: R$ ${totalDebt.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}

RISCO DE CARÊNCIA PREVIDENCIÁRIA (INSS):
- Status: ${calculatorData.monthsOwed > 0 ? 'RISCO ALTO (Meses em aberto não contam para INSS e podem acarretar em perda da cobertura previdenciária)' : 'Situação Previdenciária Estável'}

PARECER DE INTELIGÊNCIA ARTIFICIAL:
${aiReport || 'Relatório de IA preliminar gerado com base nas respostas acima.'}

-------------------------------------------------
CRONOGRAMA DE AÇÕES DIRECIONADAS DE MARCELLO BERNARDO:
1. IMEDIATO (Dia 1 a 3): Regularização e transmissão das DASN em atraso para liberação do parcelamento.
2. CURTO PRAZO (Dia 3 a 5): Consolidação de débito no portal de-CAC e adesão à primeira guia do acordo de parcelamento ativo.
3. CONSOLIDAÇÃO: Emissão de Certidão Conjunta Negativa (CND) de Débito e recuperação da carência INSS.

Fale com o Marcello no WhatsApp (11) 94986-2676 para realizar a defesa e os trâmites legais do seu microempreendimento.
=================================================`;

    navigator.clipboard.writeText(textSummary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const triggerPrint = () => {
    window.print();
  };

  return (
    <div 
      id="conformity-report-card" 
      className="bg-stone-900/60 border border-emerald-500/15 rounded-2xl p-6 md:p-8 backdrop-blur-md relative overflow-hidden font-sans space-y-6"
    >
      {/* Background Decorative Graphic Layout */}
      <div className="absolute right-[-100px] top-[-100px] w-80 h-80 bg-emerald-500/5 rounded-full pointer-events-none blur-3xl" />
      
      {/* Report Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-emerald-500/10 pb-5">
        <div className="flex items-start gap-3">
          <div className="p-3 bg-emerald-400/10 text-emerald-400 rounded-xl">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h3 id="report-main-heading" className="text-xl font-bold text-stone-100 flex items-center gap-2">
              Relatório Consolidado de Regularidade MEI
              <span className="text-[10px] bg-emerald-500/15 text-emerald-300 font-mono font-medium px-2 py-0.5 rounded-full uppercase border border-emerald-500/20">
                Express AUDIT
              </span>
            </h3>
            <p className="text-xs text-stone-400 mt-1 leading-normal">
              Análise integrativa gerada a partir dos simuladores em {new Date().toLocaleDateString('pt-BR')}.
            </p>
          </div>
        </div>

        {/* Action Controls for Printing & Copying */}
        <div className="flex flex-wrap gap-2 print:hidden">
          <button
            id="print-report-btn"
            onClick={triggerPrint}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold rounded-xl text-xs transition duration-200 cursor-pointer shadow-md"
          >
            <Printer className="w-3.5 h-3.5" />
            Imprimir ou Salvar PDF
          </button>
          <button
            id="copy-report-text-btn"
            onClick={handleCopyText}
            className="flex items-center gap-1.5 px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 font-semibold border border-stone-700 rounded-xl text-xs transition duration-200 cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                Copiado!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                Copiar Texto Relatório
              </>
            )}
          </button>
        </div>
      </div>

      {/* Corporate Metadata Summary Box (Name, CNPJ, WhatsApp) */}
      <div id="report-customer-data-block" className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-emerald-950/20 border border-emerald-500/10 rounded-xl p-4 md:p-5 relative">
        <div className="space-y-4 font-sans">
          <div className="flex items-center gap-2 text-stone-300 text-xs text-stone-400 font-medium">
            <User className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[11px] font-bold uppercase tracking-wider">Titular</span>
          </div>
          {isEditingInfo ? (
            <input
              id="report-edit-name"
              type="text"
              value={tempLead.name}
              onChange={(e) => setTempLead({ ...tempLead, name: e.target.value })}
              className="bg-stone-900 border border-emerald-500/30 h-8 px-2 rounded text-xs text-white outline-none w-full"
              placeholder="Digite seu nome"
            />
          ) : (
            <div className="text-sm font-bold text-stone-100 truncate">{lead.name || 'Não preenchido'}</div>
          )}
        </div>

        <div className="space-y-4 font-sans border-t md:border-t-0 md:border-l border-emerald-500/10 pt-3 md:pt-0 md:pl-5">
          <div className="flex items-center gap-2 text-stone-300 text-xs text-stone-400 font-medium">
            <Phone className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[11px] font-bold uppercase tracking-wider">WhatsApp</span>
          </div>
          {isEditingInfo ? (
            <input
              id="report-edit-phone"
              type="text"
              value={tempLead.phone}
              onChange={(e) => setTempLead({ ...tempLead, phone: e.target.value })}
              className="bg-stone-900 border border-emerald-500/30 h-8 px-2 rounded text-xs text-white outline-none w-full"
              placeholder="Digite seu celular"
            />
          ) : (
            <div className="text-sm font-semibold text-stone-100 truncate">{lead.phone || 'Não preenchido'}</div>
          )}
        </div>

        <div className="space-y-4 font-sans border-t md:border-t-0 md:border-l border-emerald-500/10 pt-3 md:pt-0 md:pl-5">
          <div className="flex items-center gap-2 text-stone-300 text-xs text-stone-400 font-medium">
            <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[11px] font-bold uppercase tracking-wider">CNPJ MEI</span>
          </div>
          {isEditingInfo ? (
            <input
              id="report-edit-cnpj"
              type="text"
              value={tempLead.cnpj || ''}
              onChange={(e) => setTempLead({ ...tempLead, cnpj: e.target.value })}
              className="bg-stone-900 border border-emerald-500/30 h-8 px-2 rounded text-xs text-white outline-none w-full"
              placeholder="00.000.000/0001-00"
            />
          ) : (
            <div className="text-sm font-mono font-semibold text-stone-200">
              {lead.cnpj || 'Não preenchido (Sem CNPJ no cadastro)'}
            </div>
          )}
        </div>

        {/* Small Edit Button */}
        <div className="absolute right-3 bottom-3 print:hidden">
          {isEditingInfo ? (
            <button
              id="report-save-info"
              onClick={handleSaveInfo}
              className="text-[10px] text-emerald-300 hover:text-emerald-400 underline font-semibold cursor-pointer"
            >
              Salvar Dados
            </button>
          ) : (
            <button
              id="report-toggle-edit"
              onClick={() => setIsEditingInfo(true)}
              className="text-[10px] text-stone-400 hover:text-emerald-400 underline font-medium cursor-pointer"
            >
              Preencher / Corrigir
            </button>
          )}
        </div>
      </div>

      {/* Main Status & Risk Score Visual Flag */}
      <div className={`p-4 border rounded-xl flex items-start gap-3 ${riskColor}`}>
        <AlertOctagon className="w-5 h-5 flex-shrink-0 mt-0.5" />
        <div>
          <span className="text-xs font-bold uppercase tracking-wider block">Grau de Conformidade Tributária do MEI</span>
          <p className="text-sm font-extrabold mt-1">{riskLabel}</p>
          <p className="text-[11px] leading-normal mt-1 opacity-80 max-w-2xl font-sans">
            Com base em faturamento bruto anual de <span className="font-bold underline">R$ {diagnosis.annualBilling.toLocaleString('pt-BR')}</span> e {calculatorData.monthsOwed} guias de contribuição atrasadas, a insolvência fiscal pode restringir certidões negativas de débito do CPF e suspender a emissão de notas fiscais pelo sistema federal.
          </p>
        </div>
      </div>

      {/* In-Depth Breakdown Structure (Dívidas, INSS & Plano IA) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Financial Balance Summary Card */}
        <div id="financial-report-breakdown" className="bg-emerald-950/15 border border-emerald-500/10 rounded-xl p-5 space-y-4 font-sans">
          <h4 className="text-[11px] uppercase font-bold text-stone-300 tracking-wider flex items-center gap-1.5 pb-2 border-b border-emerald-500/10">
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
            Demonstrativo Financeiro do Passivo Fiscal
          </h4>
          
          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between text-stone-300">
              <span>Valor Principal DAS ({calculatorData.monthsOwed} meses):</span>
              <span className="font-semibold text-stone-100">R$ {principalDas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            </div>
            
            <div className="flex justify-between text-stone-300">
              <span>Encargos Estimados (Multas e SELIC):</span>
              <span className="font-semibold text-stone-100">R$ {penaltyAndInterest.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            </div>

            <div className="flex justify-between text-stone-300">
              <span>Multas por Omissão DASN ({calculatorData.missedYears} anos):</span>
              <span className="font-semibold text-stone-100">R$ {dasnPenalty.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            </div>

            <div className="border-t border-emerald-500/10 my-1 pt-2.5 flex justify-between text-sm font-bold text-red-400">
              <span>Total Passivo à Receita Federal:</span>
              <span>R$ {totalDebt.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            </div>
          </div>
          
          <p className="text-[9.5px] text-stone-500 italic leading-relaxed">
            *Obs: Os valores acumulados de multa e juros de mora aplicados pelo Simples Nacional são flutuantes sob a taxa de juros SELIC e podem variar na data da auditoria oficial.
          </p>
        </div>

        {/* Previdential INSS Risk Hazard List */}
        <div id="previdential-report-breakdown" className="bg-emerald-950/15 border border-emerald-500/10 rounded-xl p-5 space-y-4 font-sans">
          <h4 className="text-[11px] uppercase font-bold text-stone-300 tracking-wider flex items-center gap-1.5 pb-2 border-b border-emerald-500/10">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Segurança Social & INSS Previdenciário
          </h4>

          <div className="space-y-3">
            {[
              { 
                title: 'Aposentadoria por Idade', 
                effect: calculatorData.monthsOwed > 0 ? "Prejudicado" : "Regular",
                statusClass: calculatorData.monthsOwed > 0 ? "text-amber-400 font-bold bg-amber-400/5" : "text-emerald-400 font-bold bg-emerald-400/5",
                desc: 'O tempo inadimplente não soma tempo de carência para obter a sua previdência ou idade.'
              },
              { 
                title: 'Auxílio-Doença / Acidente', 
                effect: calculatorData.monthsOwed > 12 ? "Suspenso" : calculatorData.monthsOwed > 0 ? "Risco de Recusa" : "Ativo",
                statusClass: calculatorData.monthsOwed > 12 ? "text-red-400 font-bold bg-red-400/5" : calculatorData.monthsOwed > 0 ? "text-amber-400 font-bold bg-amber-400/5" : "text-emerald-400 font-bold bg-emerald-400/5",
                desc: 'Estou inadimplente por mais de 12 meses interrompe inteiramente a qualidade de segurado.'
              },
              { 
                title: 'Salário-Maternidade e Pensão por Morte', 
                effect: calculatorData.monthsOwed > 0 ? "Parcial em Risco" : "Ativo",
                statusClass: calculatorData.monthsOwed > 0 ? "text-amber-400 font-bold bg-amber-400/5" : "text-emerald-400 font-bold bg-emerald-400/5",
                desc: 'Direito do titular e dos dependentes sujeito às carências mínimas cumpridas do recolhimento fiscal.'
              }
            ].map((rule, idx) => (
              <div key={idx} className="flex gap-2.5 items-start">
                <div className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded border border-emerald-500/10 ${rule.statusClass} flex-shrink-0`}>
                  {rule.effect}
                </div>
                <div>
                  <h5 className="text-[11.5px] font-bold text-stone-200 leading-none mb-1">{rule.title}</h5>
                  <p className="text-[10px] text-stone-400 leading-normal">{rule.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* AI Consulting Opinion / Parecer do Sistema */}
      {aiReport && (
        <div id="report-ai-opinion-card" className="bg-emerald-900/10 border border-emerald-500/15 rounded-xl p-5 space-y-3 font-sans">
          <h4 className="text-[11px] uppercase font-bold text-emerald-300 tracking-wider flex items-center gap-1.5 pb-2 border-b border-emerald-500/10">
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
            Opinião Técnica do Consultor Especializado
          </h4>
          <p className="text-xs text-stone-300 leading-relaxed whitespace-pre-wrap select-text">
            {aiReport}
          </p>
        </div>
      )}

      {/* Recommended Intervention Agenda Roadmap */}
      <div id="report-roadmap-section" className="space-y-4">
        <h4 className="text-[11px] uppercase font-bold text-stone-300 tracking-wider flex items-center gap-1.5 pb-1 font-sans">
          <Calendar className="w-3.5 h-3.5 text-emerald-400" />
          Calendário Sugerido de Resolução Cadastral
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            {
              day: 'Passo 01',
              title: 'Declaração e-CAC',
              desc: 'Transmitir todas as declarações DASN atrasadas para apuração legal do saldo devedor.',
              action: 'Fazer com Marcello'
            },
            {
              day: 'Passo 02',
              title: 'Plano de Adesão',
              desc: 'Consolidar parcelas no sistema para fechar o acordo de pagamento estendido.',
              action: 'Gerar Guia Inicial'
            },
            {
              day: 'Passo 03',
              title: 'Conformidade CND',
              desc: 'Baixa de impedimentos e recuperação total da qualidade de cobertura previdenciária.',
              action: 'Emitir Certidão'
            }
          ].map((agenda, idx) => (
            <div key={idx} className="bg-emerald-950/20 border border-emerald-500/5 p-4 rounded-xl font-sans space-y-2">
              <span className="text-[9px] uppercase font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/20 px-2.5 py-0.5 rounded-full inline-block">
                {agenda.day}
              </span>
              <h5 className="text-[12.5px] font-bold text-stone-200">{agenda.title}</h5>
              <p className="text-[11px] text-stone-400 leading-normal">{agenda.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Support Information / Signatures */}
      <div id="report-support-signature-footer" className="pt-6 border-t border-emerald-500/10 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-center md:text-left space-y-0.5 font-sans">
          <span className="text-xs font-bold text-stone-300">Auditoria Fiscal e Tributária MEI</span>
          <p className="text-[10px] text-stone-500">
            Marcello M. Bernardo • Registro Consultoria Simplificada • (11) 94986-2676.
          </p>
        </div>

        <div>
          <a
            id="report-final-cta-whatsapp"
            href={`https://wa.me/5511949862676?text=Olá Marcello! Acabei de gerar meu Relatório de Auditoria Fiscal no seu site para o cliente ${lead.name || 'Empreendedor'}. O total de passivo estimado deu R$ ${totalDebt.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}. Gostaria que você fizesse a regularização do meu CNPJ com segurança.`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 bg-red-500 hover:bg-red-400 text-stone-100 font-bold px-5 py-2.5 rounded-xl text-xs uppercase tracking-wide transition duration-200 shadow-md"
          >
            Falar com Marcello no WhatsApp
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Styled Printable Template Section (Only visible when browser printing) */}
      <div className="hidden print:block fixed inset-0 bg-white text-black p-10 z-[9999] overflow-y-auto font-sans">
        <style>
          {`
            @media print {
              body * {
                visibility: hidden;
              }
              #conformity-report-card, #conformity-report-card * {
                visibility: visible;
              }
              #conformity-report-card {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                background: white !important;
                color: black !important;
                border: none !important;
                padding: 0 !important;
                margin: 0 !important;
                box-shadow: none !important;
              }
              .print\\:hidden {
                display: none !important;
              }
              /* Colors adjustments for contrast print rules */
              h3, h4, h5, .text-stone-100, .text-stone-200, .text-stone-300 {
                color: #000000 !important;
              }
              .text-stone-400, .text-stone-500, .text-stone-600 {
                color: #4b5563 !important;
              }
              .bg-emerald-950\\/20, .bg-emerald-950\\/15, .bg-emerald-900\\/10 {
                background: #f3f4f6 !important;
                border: 1px solid #d1d5db !important;
              }
              .border, .border-b, .border-t {
                border-color: #9ca3af !important;
              }
              .text-red-400 {
                color: #b91c1c !important;
                font-weight: bold !important;
              }
              .text-emerald-400, .text-emerald-300 {
                color: #047857 !important;
                font-weight: bold !important;
              }
              .text-amber-400 {
                color: #d97706 !important;
                font-weight: bold !important;
              }
            }
          `}
        </style>
        
        {/* Printable Paper Layout Heading */}
        <div className="text-center space-y-1 pb-6 border-b-2 border-black">
          <h1 className="text-2xl font-extrabold tracking-tight">RELATÓRIO OFICIAL DE AUDITORIA FISCAL MEI</h1>
          <p className="text-xs uppercase tracking-widest font-bold text-gray-600">Marcello Montefusco Bernardo • Regularidade Simplificada Simples Nacional</p>
          <p className="text-[10px] text-gray-500">Gerado eletronicamente em {new Date().toLocaleDateString('pt-BR')} às {new Date().toLocaleTimeString('pt-BR')}</p>
        </div>

        {/* Paper Metadata Table */}
        <div className="grid grid-cols-2 gap-4 my-6 text-xs">
          <div className="p-3 bg-gray-100 border border-gray-300 rounded space-y-1">
            <strong>DADOS DO CONTRIBUINTE:</strong>
            <div><span className="text-gray-600">Nome do Titular:</span> {lead.name || '___________________________'}</div>
            <div><span className="text-gray-600">CNPJ Cadastrado:</span> <span className="font-mono">{lead.cnpj || '____.____.____/0001-__'}</span></div>
            <div><span className="text-gray-600">WhatsApp de Contato:</span> {lead.phone || '___________________________'}</div>
          </div>
          <div className="p-3 bg-gray-100 border border-gray-300 rounded space-y-1">
            <strong>PARÂMETROS DE AUDITORIA:</strong>
            <div><span className="text-gray-600">Status Cadastral:</span> {diagnosis.cnpjState.toUpperCase()}</div>
            <div><span className="text-gray-600">Faturamento Declarado:</span> R$ {diagnosis.annualBilling.toLocaleString('pt-BR')}</div>
            <div><span className="text-gray-600">Riscos e Infrações:</span> {riskLabel}</div>
          </div>
        </div>

        {/* Financial Stat table */}
        <div className="my-6 space-y-2">
          <h2 className="text-sm font-bold border-b border-gray-400 pb-1">1. DEMONSTRATIVO DAS EXIGÊNCIAS TRIBUTÁRIAS:</h2>
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-gray-300">
                <th className="py-2">Item Geral de Multa / Exigibilidade</th>
                <th className="py-2 text-right">Referência Temporal</th>
                <th className="py-2 text-right">Valor apurado (R$)</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-200">
                <td className="py-2">Preço de Contribuição Principal (Inadimplência DAS)</td>
                <td className="py-2 text-right">{calculatorData.monthsOwed} meses</td>
                <td className="py-2 text-right">R$ {principalDas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-2">Acréscimos Legais (Multas de mora, juros SELIC e-CAC)</td>
                <td className="py-2 text-right">Incidência flutuante</td>
                <td className="py-2 text-right">R$ {penaltyAndInterest.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-2">Punibilidade Sonegação/Atraso Declaração Anual (DASN)</td>
                <td className="py-2 text-right">{calculatorData.missedYears} exercicio(s)</td>
                <td className="py-2 text-right">R$ {dasnPenalty.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
              </tr>
              <tr className="font-bold border-t-2 border-black">
                <td className="py-2 text-sm text-red-700">Saldo Exigido à União (Passivo e-CAC):</td>
                <td className="py-2 text-right"></td>
                <td className="py-2 text-right text-sm text-red-700">R$ {totalDebt.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* INSS & legal status */}
        <div className="my-6 space-y-2 text-xs">
          <h2 className="text-sm font-bold border-b border-gray-400 pb-1">2. ANÁLISE DE IMPACTO FISCAL E PREVIDENCIÁRIO:</h2>
          <p>
            O contribuinte está com <strong>{calculatorData.monthsOwed} parcelas de DAS cumulativas em atraso</strong>. 
            Isso compromete diretamente o período de carência previdenciária exigido pelo INSS (Lei nº 8.213/91). 
            Seu tempo de trabalho atual pode não ser computado para aposentadoria ou pensão, havendo risco imediato de perda da qualidade de segurado para auxílio-doença.
          </p>
          {diagnosis.annualBilling > 81000 && (
            <div className="p-3 bg-red-50 border border-red-300 text-red-800 rounded font-semibold mt-2">
              ALERTA: Faturamento declarado excede o teto MEI de R$ 81.000,00. É legalmente obrigatório prosseguir com o desenquadramento do CNPJ e migração de regime.
            </div>
          )}
        </div>

        {/* AI report printed */}
        {aiReport && (
          <div className="my-6 space-y-2 text-xs">
            <h2 className="text-sm font-bold border-b border-gray-400 pb-1">3. EXAME DE AUDITORIA CONDUZIDO:</h2>
            <p className="whitespace-pre-wrap italic bg-gray-50 p-4 border border-gray-200 text-gray-700 rounded select-text">
              {aiReport}
            </p>
          </div>
        )}

        {/* Support instructions */}
        <div className="my-6 text-xs space-y-1">
          <h2 className="text-sm font-bold border-b border-gray-400 pb-1">4. PARECER DIRECIONADO PARA DEFESA:</h2>
          <p>Para prosseguir com o parcelamento oficial e suspender as multas da União, entre em contato técnico com o consultor:</p>
          <div className="bg-gray-100 p-4 border border-gray-300 rounded text-center">
            <strong>Marcello Montefusco Bernardo - Soluções Tributárias MEI</strong><br />
            Whatsapp: <strong>(11) 94986-2676</strong> • Email: <span className="font-semibold text-gray-700">mmontefuscobernardo@gmail.com</span>
          </div>
        </div>

        {/* Signature and date */}
        <div className="mt-16 flex justify-between gap-12 text-xs text-center">
          <div className="w-1/2">
            <div className="border-b border-gray-400 pb-1 mb-1"></div>
            <strong>{lead.name || 'Assinatura do Microempreendedor'}</strong>
            <p className="text-gray-500">Documento de ciência de passivo fiscal</p>
          </div>
          <div className="w-1/2">
            <div className="border-b border-gray-400 pb-1 mb-1"></div>
            <strong>Marcello Montefusco Bernardo</strong>
            <p className="text-gray-500">Consultoria de Regularização MEI</p>
          </div>
        </div>

      </div>
    </div>
  );
}
