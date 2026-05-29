/**
 * Types for Marcello's MEI Taxation Consulting App
 */

export interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: Date;
}

export interface MEIDiagnosis {
  cnpjState: 'regular' | 'irregular' | 'unregistered' | 'dont_know';
  hasOwedDAS: boolean;
  monthsOwedDAS: number;
  hasMissedDASN: boolean;
  lastDASNYear: string;
  annualBilling: number; // in R$
  legalIssues: {
    hasFine: boolean;
    hasExecution: boolean;
    hasSocialBenefitsRisks: boolean;
  };
  hasStateIncentives: boolean;
}

export interface CustomMedia {
  photoUrl: string | null;
  bannerUrl: string | null;
  useGraphicMode?: boolean;
}

export interface LeadData {
  name: string;
  phone: string;
  cnpj?: string;
  issueDescription: string;
}
