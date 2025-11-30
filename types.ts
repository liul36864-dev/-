export enum Platform {
  Weibo = '微博',
  Douyin = '抖音',
  Kuaishou = '快手'
}

export interface TrendItem {
  id: string;
  rank: number;
  title: string;
  heat: number;
  label?: string; // e.g., "New", "Hot", "Explosive"
  platform: Platform;
}

export interface ChartDataPoint {
  time: string;
  weibo: number;
  douyin: number;
  kuaishou: number;
}

export interface AnalysisMetrics {
  peakValue: number;
  volatility: number; // 0-100 score
  sentimentScore: number; // -1 to 1
  totalMentions: number;
}

export interface WebSource {
  title: string;
  uri: string;
}

export interface AnalysisResult {
  summary: string;
  keySources: string[];
  intelligence: string;
  metrics: AnalysisMetrics;
  chartData: ChartDataPoint[];
  webSources?: WebSource[];
  imageUrl?: string; // Base64 image data or URL
  keywords?: string[]; // Related tags
  poem?: string; // New: AI generated poem
  historicalAnalogy?: string; // New: Comparison to historical events
}

export type ViewState = 'DASHBOARD' | 'ANALYSIS';