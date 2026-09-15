export type ThemeMode = 'dark' | 'light';

export interface UserProfile {
  displayName: string;
  email: string;
  photoURL?: string;
  theme: ThemeMode;
  tier?: string;
  bio?: string;
  watchlist?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export type TradeDirection = 'LONG' | 'SHORT';
export type TradeOutcome = 'WIN' | 'LOSS' | 'BREAKEVEN';
export type EmotionalState = 'Disciplined' | 'Confident' | 'FOMO' | 'Anxious' | 'Revenge' | 'Hesitant';
export type TradeSession = 'London Open' | 'New York AM' | 'New York PM' | 'Asia Session' | 'All Day';
export type TradeSetup = 
  | 'Liquidity Sweep' 
  | 'Fair Value Gap' 
  | 'Breakout & Retest' 
  | 'Order Block' 
  | 'Mean Reversion' 
  | 'Range Deviation'
  | 'Trend Pullback';

export type MistakeTag = 
  | 'None' 
  | 'Moved Stop Too Early' 
  | 'Chased Entry' 
  | 'Oversized Position' 
  | 'Failed Plan Exit' 
  | 'FOMO Entry'
  | 'Revenge Trading';

export interface TradeAttachment {
  id: string;
  name: string;
  type: 'image' | 'video' | 'link';
  url: string; // Data URL or external link
  size?: string;
}

export interface TradeEntry {
  id: string;
  userId: string;
  date: string;
  symbol: string;
  direction: TradeDirection;
  timeframe: string;
  session: TradeSession;
  setup: TradeSetup;
  entryPrice: number;
  exitPrice: number;
  stopLoss: number;
  takeProfit?: number;
  positionSize: number;
  pnl: number;
  rMultiple: number;
  outcome: TradeOutcome;
  emotionalState: EmotionalState;
  executionGrade: 'A+' | 'A' | 'B' | 'C' | 'F';
  mistakeTag: MistakeTag;
  notes: string;
  lessons?: string;
  attachments?: TradeAttachment[];
  createdAt: string;
}

export interface TradingQuote {
  id: string;
  quote: string;
  author: string;
  bookOrRole: string;
  category: 'Discipline' | 'Risk Management' | 'Market Psychology' | 'Execution' | 'Patience';
}

export interface FreeBook {
  id: string;
  title: string;
  subtitle: string;
  author: string;
  pages: number;
  releaseDate: string;
  badge: string;
  description: string;
  gradient: string;
  chapters: string[];
  readersCount: string;
}

export interface FreeCourse {
  id: string;
  title: string;
  subtitle: string;
  instructor: string;
  duration: string;
  modulesCount: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Mastery';
  badge: string;
  description: string;
  gradient: string;
  topics: string[];
  enrolledCount: string;
}

export interface UserInsight {
  id: string;
  userId: string;
  symbol: string;
  title: string;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  notes: string;
  createdAt: string;
}

export interface MarketAsset {
  symbol: string;
  name: string;
  category: 'crypto' | 'equity' | 'commodity' | 'forex';
  price: number;
  change24h: number;
  high24h: number;
  low24h: number;
  volume24h: string;
  marketCap: string;
  institutionalFlow: 'Strong Inflow' | 'Mild Inflow' | 'Neutral' | 'Outflow';
  sparkline: number[];
}

export interface NewsArticle {
  id: string;
  headline: string;
  summary: string;
  source: string;
  timestamp: string;
  category: 'Macro' | 'Crypto' | 'Equities' | 'Whale Watch' | 'Central Banks';
  sentiment: 'Bullish' | 'Bearish' | 'Neutral';
  impact: 'High' | 'Medium' | 'Critical';
  url?: string;
}

export interface WhaleTransaction {
  id: string;
  txHash: string;
  entity: string;
  entityType: 'Sovereign Fund' | 'Tier-1 Market Maker' | 'Institutional Custody' | 'Macro Hedge Fund';
  asset: string;
  amountUsd: number;
  amountToken: string;
  type: 'Accumulation' | 'Distribution' | 'OTC Swap' | 'Staking Deposit';
  timestamp: string;
  network: string;
}
