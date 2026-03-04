export interface ReviewData {
  text: string;
  date?: string;
}

export interface SentimentPoint {
  date: string;
  score: number; // -1 to 1
  label: string;
}

export interface WordFrequency {
  text: string;
  value: number;
  type: 'praise' | 'complaint';
}

export interface AnalysisResult {
  summary: string;
  actionableItems: string[];
  sentimentTrend: SentimentPoint[];
  wordCloud: WordFrequency[];
  metaReview: {
    promises: string[];
    deliveryGap: string;
    newsSources: { title: string; uri: string }[];
  };
}

export interface Message {
  role: 'user' | 'model';
  content: string;
}
