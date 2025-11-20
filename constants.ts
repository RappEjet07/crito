import { Asset } from './types';

export const INITIAL_ASSETS: Asset[] = [
  { id: '1', symbol: 'BTC', name: 'Bitcoin', amount: 0.5, price: 64000, color: '#F7931A' },
  { id: '2', symbol: 'ETH', name: 'Ethereum', amount: 4.2, price: 3400, color: '#627EEA' },
  { id: '3', symbol: 'SOL', name: 'Solana', amount: 150, price: 145, color: '#14F195' },
  { id: '4', symbol: 'DOGE', name: 'Dogecoin', amount: 5000, price: 0.12, color: '#C2A633' },
];

export const GEMINI_MODEL_FLASH = 'gemini-2.5-flash';
export const GEMINI_MODEL_PRO = 'gemini-3-pro-preview';
