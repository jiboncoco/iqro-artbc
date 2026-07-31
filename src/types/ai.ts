import { Verse } from './quran';

export interface AskAIRequest {
  prompt: string;
  match_count?: number;
}

export interface AskAIResponse {
  success: boolean;
  query: string;
  answer: string;
  referenced_verses: Verse[];
  execution_time_ms: number;
  error?: string;
}

export interface RecommendedPrompt {
  id: string;
  title: string;
  prompt: string;
  category: 'Ketenangan Hati' | 'Kehidupan & Bisnis' | 'Keluarga' | 'Sabar & Ujian';
}
