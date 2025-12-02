export interface SearchResult {
  chunk_id: number;
  text: string;
  similarity: number;
  rank: number;
}

export interface SearchResponse {
  query: string;
  results: SearchResult[];
  found_results: boolean;
}

export interface ChatMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  results?: SearchResult[];
}