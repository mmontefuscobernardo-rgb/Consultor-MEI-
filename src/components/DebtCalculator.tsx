import React, { useState } from 'react';
import { DollarSign, ShieldAlert, BadgeInfo, Scale, TrendingUp, Sparkles, HelpCircle } from 'lucide-react';

export default function DebtCalculator() {
  const [monthsOwed, setMonthsOwed] = useState(5);
  const [missedYears, setMissedYears] = useState(1);

  const getCalculation = () => {
    const dasCostPerMonth = 87.05; // standard updated for 2026
    const principalDas = monthsOwed * dasCostPerMonth;
    const penaltyAndInterest = principalDas * 0.20; // estimate roughly max delay penalties (20% + interest)
    const dasnPenalty = missedYears * 50.0; // standard R$ 50 fine for each missed annual declaration
    const totalDebt = principalDas + penaltyAndInterest + dasnPenalty;

    // Estimate loss if registered in cpf / credit check
    const creditScoreDamage = monthsOwed > 12 ? 'Severo' : monthsOwed > 3 ? 'Médio' : 'Baixo';
    const hasSocialRisk = monthsOwed > 0;

    return {
      principalDas,
      penaltyAndInterest,
      dasnPenalty,
      totalDebt,
      creditScoreDamage,
      hasSocialRisk,
    };
  };

  const results = getCalculation();

  return (
    <div id="calculator-section-card" className="bg-emerald-950/45 border border-emerald-500/20 rounded-2xl p-6 md:p-8 backdrop-blur-md">
      <div className="border-b border-emerald-500/10 pb-4 mb-6">
        <h3 id="calculator-title" className="text-xl font-bold text-stone-100 flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-emerald-400" />
          Calculadora de Multas & Regularização
        </h3>
        <p className="text-xs text-stone-400 mt-1">Simule o impacto financeiro das guias e declarações atrasadas no seu CPF.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Sliders Input */}
        <div id="calc-inputs" className="space-y-6">
          {/* Months Slider */}
          <div className="space-y-3 font-sans">
            <div className="flex justify-between text-xs text-stone-300">
              <span className="flex items-center gap-1">Boletos de DAS Atrasados:</span>
              <span className="font-bold text-emerald-400">{monthsOwed} {monthsOwed === 1 ? 'mês' : 'meses'}</span>
            </div>
            <input
              id="calc-months-slider"
              type="range"
              min="0"
              max="36"
              value={monthsOwed}
              onChange={(e) => setMonthsOwed(parseInt(e.target.value))}
              className="w-full accent-emerald-500"
            />
            <div className="flex justify-between text-[10px] text-stone-500">
              <span>Nenhum</span>
              <span>1 ano (12m)</span>
              <span>2 anos (24m)</span>
              <span>3 anos (36m)</span>
            </div>
          </div>

          {/* DASN Slider */}
          <div className="space-y-3 font-sans pt-2 border-t border-emerald-500/10">
            <div className="flex justify-between text-xs text-stone-300">
              <span className="flex items-center gap-1">Declarações Anuais (DASN) Pendentes:</span>
              <span className="font-bold text-emerald-400">{missedYears} {missedYears === 1 ? 'ano' : 'anos'}</span>
            </div>
            <input
              id="calc-years-slider"
              type="range"
              min="0"
              max="5"
              value={missedYears}
              onChange={(e) => setMissedYears(parseInt(e.target.value))}
              className="w-full accent-emerald-500"
            />
            <div className="flex justify-between text-[10px] text-stone-500">
              <span>Em dia</span>
              <span>3 anos pendentes</span>
              <span>5 anos pendentes</span>
            </div>
          </div>

          {/* Quick Legal context */}
          <div id="calc-legal-card" className="bg-emerald-900/15 border border-emerald-500/10 p-4 rounded-xl space-y-2 text-[11px] leading-relaxed text-stone-400 font-sans">
            <span className="font-semibold text-emerald-300 flex items-center gap-1">
              <Scale className="w-3.5 h-3.5" /> Dica de Prata do Marcello:
            </span>
            <p>
              Ao atrasar o Simples Nacional, os juros correm continuamente. Além disso, a Receita Federal inscreve as dívidas do CNPJ diretamente no seu **CPF pessoal**, tornando-o devedor à União. Isso impede financiamentos e congela contas!
            </p>
          </div>
        </div>

        {/* Dynamic Financial Results */}
        <div id="calc-results" className="bg-emerald-950/30 border border-emerald-500/10 rounded-xl p-5 md:p-6 space-y-6 font-sans">
          <div id="calc-total-box" className="text-center pb-5 border-b border-emerald-500/10">
            <p className="text-[10px] text-stone-400 uppercase tracking-widest font-semibold mb-1">Montante Estimado de Débitos</p>
            <h2 id="calc-total-value" className="text-3xl font-extrabold text-red-400">R$ {results.totalDebt.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h2>
            <p className="text-[10px] text-stone-400 mt-2">
              *Estimativa preliminar sujeita à apuração oficial da Receita Federal.
            </p>
          </div>

          <div id="calc-breakdown" className="space-y-3.5 text-xs text-stone-300">
            <div className="flex justify-between">
              <span>Valor Principal (Taxas):</span>
              <span className="text-stone-100 font-medium">R$ {results.principalDas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between">
              <span>Multa diária & Juros SELIC:</span>
              <span className="text-amber-400 font-medium">+ R$ {results.penaltyAndInterest.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between">
              <span>Multa Entrega DASN Pendente:</span>
              <span className="text-amber-400 font-medium">+ R$ {results.dasnPenalty.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between pt-3 border-t border-emerald-500/10">
              <span>Risco Previdenciário (INSS):</span>
              <span className={`font-bold ${results.hasSocialRisk ? 'text-red-400' : 'text-emerald-400'}`}>
                {results.hasSocialRisk ? 'ALTO (Perdendo Carência!)' : 'NENHUM (Regularizado)'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Risco de Execução Fiscal no CPF:</span>
              <span className={`font-bold ${monthsOwed > 12 ? 'text-red-400' : monthsOwed > 4 ? 'text-amber-400' : 'text-stone-400'}`}>
                {monthsOwed > 12 ? 'Imparável (Urgente!)' : monthsOwed > 4 ? 'Médio (Ação Recom.)' : 'Baixo'}
              </span>
            </div>
          </div>

          <div className="pt-2">
            <a
              id="calc-action-whatsapp"
              href={`https://wa.me/5511949862676?text=Olá Marcello! Simulei meu débito na calculadora do seu site. Meu saldo pendente estimado é de R$ ${results.totalDebt}. Gostaria de obter ajuda profissional para realizar o parcelamento correto e regularizar meu CNPJ!`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex justify-center items-center gap-2 py-3 bg-red-500 hover:bg-red-400 text-stone-100 font-bold rounded-xl text-xs uppercase tracking-wide transition duration-200"
            >
              <TrendingUp className="w-4 h-4" />
              Parcelar Minhas Dívidas MEI com Marcello
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
