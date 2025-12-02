import axios from 'axios';
import { SearchResponse } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export async function sendMessage(query: string): Promise<SearchResponse> {
  const response = await api.post<SearchResponse>('/api/v1/search', {
    query,
    top_k: 3,
  });
  return response.data;
}

export async function processPDF(): Promise<{ message: string; chunks_created: number }> {
  const response = await api.post('/api/v1/process-pdf');
  return response.data;
}

export async function checkHealth(): Promise<{ status: string; service_loaded: boolean }> {
  const response = await api.get('/api/v1/health');
  return response.data;
}

export default api;