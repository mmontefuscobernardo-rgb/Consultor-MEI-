import React, { useState } from 'react';
import { DollarSign, ShieldAlert, BadgeInfo, Scale, TrendingUp, Sparkles, HelpCircle } from 'lucide-react';

interface DebtCalculatorProps {
  monthsOwed: number;
  setMonthsOwed: (months: number) => void;
  missedYears: number;
  setMissedYears: (years: number) => void;
}

export default function DebtCalculator({
  monthsOwed,
  setMonthsOwed,
  missedYears,
  setMissedYears
}: DebtCalculatorProps) {

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
        {/* Controls Input */}
        <div id="calc-inputs" className="space-y-6">
          {/* Months Input */}
          <div className="space-y-3 font-sans">
            <div className="flex justify-between items-center">
              <span className="text-xs text-stone-300 font-medium">Boletos de DAS Atrasados (Meses):</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setMonthsOwed(Math.max(0, monthsOwed - 1))}
                  className="w-8 h-8 flex items-center justify-center bg-stone-800 hover:bg-stone-700 active:scale-95 text-emerald-400 font-bold rounded-lg border border-emerald-500/20 transition-all text-sm cursor-pointer select-none"
                >
                  -
                </button>
                <input
                  id="calc-months-input"
                  type="number"
                  min="0"
                  max="120"
                  value={monthsOwed}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    setMonthsOwed(isNaN(val) ? 0 : Math.max(0, val));
                  }}
                  className="w-16 h-8 bg-stone-900 border border-emerald-500/30 text-center text-xs font-bold text-emerald-400 rounded-lg outline-none focus:border-emerald-400"
                />
                <button
                  type="button"
                  onClick={() => setMonthsOwed(Math.min(120, monthsOwed + 1))}
                  className="w-8 h-8 flex items-center justify-center bg-stone-800 hover:bg-stone-700 active:scale-95 text-emerald-400 font-bold rounded-lg border border-emerald-500/20 transition-all text-sm cursor-pointer select-none"
                >
                  +
                </button>
              </div>
            </div>

            {/* Quick Presets for Months */}
            <div className="grid grid-cols-6 gap-1.5 pt-1">
              {[0, 3, 6, 12, 24, 36].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setMonthsOwed(num)}
                  className={`py-1.5 rounded-lg text-[9px] font-bold border transition-all cursor-pointer select-none ${
                    monthsOwed === num
                      ? 'bg-emerald-500 text-emerald-950 border-emerald-400 font-extrabold scale-105'
                      : 'bg-stone-900/80 text-stone-300 border-emerald-500/10 hover:border-emerald-500/30 hover:bg-stone-800'
                  }`}
                >
                  {num === 0 ? '0m' : `${num}m`}
                </button>
              ))}
            </div>
            
            <p className="text-[10px] text-stone-500 leading-normal">
              Ajuste nos botões acima, digite ou selecione um dos atalhos rápidos de meses.
            </p>
          </div>

          {/* DASN Input */}
          <div className="space-y-3 font-sans pt-4 border-t border-emerald-500/10">
            <div className="flex justify-between items-center">
              <span className="text-xs text-stone-300 font-medium font-sans">Declarações Anuais (DASN) Pendentes:</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setMissedYears(Math.max(0, missedYears - 1))}
                  className="w-8 h-8 flex items-center justify-center bg-stone-800 hover:bg-stone-700 active:scale-95 text-emerald-400 font-bold rounded-lg border border-emerald-500/20 transition-all text-sm cursor-pointer select-none"
                >
                  -
                </button>
                <input
                  id="calc-years-input"
                  type="number"
                  min="0"
                  max="10"
                  value={missedYears}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    setMissedYears(isNaN(val) ? 0 : Math.max(0, val));
                  }}
                  className="w-16 h-8 bg-stone-900 border border-emerald-500/30 text-center text-xs font-bold text-emerald-400 rounded-lg outline-none focus:border-emerald-400"
                />
                <button
                  type="button"
                  onClick={() => setMissedYears(Math.min(10, missedYears + 1))}
                  className="w-8 h-8 flex items-center justify-center bg-stone-800 hover:bg-stone-700 active:scale-95 text-emerald-400 font-bold rounded-lg border border-emerald-500/20 transition-all text-sm cursor-pointer select-none"
                >
                  +
                </button>
              </div>
            </div>

            {/* Quick Presets for Years */}
            <div className="grid grid-cols-6 gap-1.5 pt-1">
              {[0, 1, 2, 3, 4, 5].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setMissedYears(num)}
                  className={`py-1.5 rounded-lg text-[9px] font-bold border transition-all cursor-pointer select-none ${
                    missedYears === num
                      ? 'bg-emerald-500 text-emerald-950 border-emerald-400 font-extrabold scale-105'
                      : 'bg-stone-900/80 text-stone-300 border-emerald-500/10 hover:border-emerald-500/30 hover:bg-stone-800'
                  }`}
                >
                  {num === 0 ? '0 anos' : `${num} ${num === 1 ? 'ano' : 'anos'}`}
                </button>
              ))}
            </div>

            <p className="text-[10px] text-stone-500 leading-normal">
              Número de anos em falta sem declarar a DASN-SIMEI anual.
            </p>
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
