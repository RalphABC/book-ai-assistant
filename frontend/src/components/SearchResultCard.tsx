'use client';

import { SearchResult } from '@/lib/types';
import { Copy, Check, BookOpen, FileText, ExternalLink, Highlighter } from 'lucide-react';
import { useState } from 'react';

interface SearchResultCardProps {
  result: SearchResult;
  query: string;
  index: number;
}

export default function SearchResultCard({ result, query, index }: SearchResultCardProps) {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Error al copiar:', err);
    }
  };

  // Extraer página del texto (si existe)
  const extractPageInfo = (text: string) => {
    const pageMatch = text.match(/--- Página (\d+) ---/);
    if (pageMatch) {
      return {
        page: parseInt(pageMatch[1]),
        textWithoutPage: text.replace(/--- Página \d+ ---/g, '').trim()
      };
    }
    return { page: null, textWithoutPage: text };
  };

  const { page, textWithoutPage } = extractPageInfo(result.text);

  // Resaltar términos de búsqueda en el texto
  const highlightQueryTerms = (text: string) => {
    if (!query) return text;
    
    const terms = query.toLowerCase().split(/\s+/).filter(term => term.length > 2);
    let highlighted = text;
    
    terms.forEach(term => {
      const regex = new RegExp(`(${term})`, 'gi');
      highlighted = highlighted.replace(regex, '<mark class="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">$1</mark>');
    });
    
    return highlighted;
  };

  const highlightedText = highlightQueryTerms(textWithoutPage);
  const wordCount = textWithoutPage.split(/\s+/).length;
  const shouldTruncate = wordCount > 100 && !expanded;
  const displayText = shouldTruncate 
    ? textWithoutPage.split(/\s+/).slice(0, 100).join(' ') + '...'
    : textWithoutPage;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300">
      {/* Header con información */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white font-bold">
                {index + 1}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Resultado #{result.rank}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <div className={`px-2 py-1 rounded-full text-xs font-bold ${
                    result.similarity_percent > 80 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : result.similarity_percent > 60
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                  }`}>
                    {result.similarity_percent}% relevante
                  </div>
                  
                  {page && (
                    <div className="flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs">
                      <BookOpen className="w-3 h-3" />
                      <span>Página {page}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => handleCopy(textWithoutPage)}
              className="p-2 rounded-lg bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600 transition-colors"
              title="Copiar texto"
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-600" />
              ) : (
                <Copy className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              )}
            </button>
            
            <button
              onClick={() => setExpanded(!expanded)}
              className="p-2 rounded-lg bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600 transition-colors"
              title={expanded ? "Mostrar menos" : "Expandir"}
            >
              <FileText className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Contenido del resultado */}
      <div className="p-5">
        {/* Texto del resultado */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-3">
            <Highlighter className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Contenido encontrado:
            </span>
          </div>
          
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <div 
              className="text-gray-700 dark:text-gray-300 leading-relaxed"
              dangerouslySetInnerHTML={{ 
                __html: highlightQueryTerms(displayText) 
              }}
            />
          </div>
          
          {shouldTruncate && (
            <button
              onClick={() => setExpanded(true)}
              className="mt-3 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium flex items-center gap-1"
            >
              Mostrar {wordCount - 100} palabras más
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          )}
        </div>
        
        {/* Metadatos */}
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <div className="flex flex-col">
              <span className="text-gray-500 dark:text-gray-400">Palabras</span>
              <span className="font-medium text-gray-900 dark:text-white">{wordCount}</span>
            </div>
            
            <div className="flex flex-col">
              <span className="text-gray-500 dark:text-gray-400">ID Chunk</span>
              <span className="font-medium text-gray-900 dark:text-white">{result.chunk_id}</span>
            </div>
            
            <div className="flex flex-col">
              <span className="text-gray-500 dark:text-gray-400">Similitud</span>
              <span className="font-medium text-gray-900 dark:text-white">{result.similarity.toFixed(3)}</span>
            </div>
            
            <div className="flex flex-col">
              <span className="text-gray-500 dark:text-gray-400">Calidad</span>
              <span className={`font-medium ${
                result.similarity_percent > 80 ? 'text-green-600' :
                result.similarity_percent > 60 ? 'text-yellow-600' :
                'text-blue-600'
              }`}>
                {result.similarity_percent > 80 ? 'Excelente' :
                 result.similarity_percent > 60 ? 'Buena' :
                 'Aceptable'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}