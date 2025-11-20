export interface Asset {
  id: string;
  symbol: string;
  name: string;
  amount: number;
  price: number; // Current price in USD
  color: string;
}

export interface PortfolioStats {
  totalValue: number;
  topPerformer: string;
}

export enum AIAnalysisType {
  ROAST = 'ROAST',
  HYPE = 'HYPE',
  PREDICTION = 'PREDICTION'
}
