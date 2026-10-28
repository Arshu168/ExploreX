/**
 * @file apiClient.ts
 * @description Centralized HTTP Client for ExploreX Frontend.
 * 
 * Architecture & Resilience Features:
 * - Multi-Base Failover: Automatically queries configured backend URLs in priority order:
 *     1. Custom environment URL (`VITE_BACKEND_URL` / `VITE_API_URL`)
 *     2. Same-origin Express server (`/api`)
 *     3. Local Python/FastAPI fallback (`http://localhost:8000/api`)
 * - Header Injection: Dynamically attaches user-provided Gemini API keys (`x-gemini-api-key`)
 *   for client-directed AI quotas.
 * - Content-Type Protection: Validates responses are actual JSON before parsing, preventing
 *   SPA router rewrites (e.g. index.html 200 responses) from crashing data states.
 * - Graceful Fallbacks: Returns null on network failures to allow client-side simulation fallbacks.
 */

// Determine base API endpoints
const envBackendUrl = ((import.meta as any).env?.VITE_BACKEND_URL || (import.meta as any).env?.VITE_API_URL || '').replace(/\/$/, '');
const API_BASES = [
  ...(envBackendUrl ? [`${envBackendUrl}/api`] : []),
  '/api',
  'http://localhost:8000/api'
];

/**
 * Retrieves the user's custom Gemini API key from local storage.
 * @returns {string} The stored Gemini API key or empty string.
 */
export function getStoredGeminiKey(): string {
  if (typeof localStorage !== 'undefined') {
    return localStorage.getItem('explorex_gemini_api_key') || '';
  }
  return '';
}

/**
 * Persists or clears the user's custom Gemini API key in local storage.
 * @param {string} key - The Gemini API key to save, or empty string to delete.
 */
export function setStoredGeminiKey(key: string): void {
  if (typeof localStorage !== 'undefined') {
    if (key && key.trim()) {
      localStorage.setItem('explorex_gemini_api_key', key.trim());
    } else {
      localStorage.removeItem('explorex_gemini_api_key');
    }
  }
}

/**
 * Core resilient HTTP request runner with multi-base failover and JSON verification.
 * 
 * @param {string} endpoint - API route path (e.g. '/health', '/ai/chat')
 * @param {RequestInit} [options] - Standard Fetch API request options
 * @returns {Promise<any | null>} Parsed JSON response payload, or null if all bases fail
 */
async function fetchFromBackend(endpoint: string, options?: RequestInit): Promise<any | null> {
  const userKey = getStoredGeminiKey();
  const headers: Record<string, string> = {
    ...(options?.headers as Record<string, string> || {})
  };
  if (userKey) {
    headers['x-gemini-api-key'] = userKey;
  }
  const mergedOptions: RequestInit = {
    ...options,
    headers
  };

  for (const base of API_BASES) {
    try {
      const url = `${base}${endpoint}`;
      const res = await fetch(url, mergedOptions);
      const contentType = res.headers.get('content-type') || '';
      
      // Verify response is JSON (guards against static hosts rewriting unknown routes to index.html)
      if (res.ok && contentType.includes('application/json')) {
        return await res.json();
      }
    } catch {
      // Base unreachable, fall through and try next base URL
    }
  }
  return null;
}

/**
 * Health check probe to determine server connectivity and Gemini AI availability.
 * @returns {Promise<{ isOnline: boolean; isGeminiReal: boolean }>} Server health status
 */
export async function checkBackendHealth(): Promise<{ isOnline: boolean; isGeminiReal: boolean }> {
  const data = await fetchFromBackend('/health', { method: 'GET' });
  if (data && data.status === 'online') {
    return { isOnline: true, isGeminiReal: Boolean(data.geminiConnected) };
  }
  return { isOnline: false, isGeminiReal: false };
}

/**
 * Sends a natural language chat query to the ExploreX AI assistant backend.
 * 
 * @param {string} message - User's question or travel prompt
 * @param {string} [destination] - Optional context destination
 * @returns {Promise<{ reply: string; retrieved_context?: any[] } | null>} AI response object
 */
export async function sendAiChatRequest(message: string, destination?: string) {
  return await fetchFromBackend('/ai/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, destination: destination || '' })
  });
}

/**
 * Generates offbeat, realistic places and hidden gems for a given destination.
 * 
 * @param {string} destination - City, region, or country to explore
 * @returns {Promise<any[] | null>} Array of generated place objects
 */
export async function generatePlacesFromBackend(destination: string) {
  return await fetchFromBackend('/places/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ destination })
  });
}

/**
 * Generates an end-to-end multi-day itinerary with flight and hotel details.
 * 
 * @param {string} destination - Trip target destination
 * @param {number} durationDays - Total itinerary days (1 to 10)
 * @param {number} budget - Total budget cap in INR
 * @param {string} [travelStyle='Balanced'] - Style (e.g. 'Backpacker', 'Comfort', 'Photography Focus')
 * @param {string} [startDate] - YYYY-MM-DD starting date
 * @param {string} [origin='India'] - Departure location
 * @returns {Promise<any | null>} Complete Trip itinerary object
 */
export async function generateTripFromBackend(
  destination: string, 
  durationDays: number, 
  budget: number, 
  travelStyle?: string,
  startDate?: string,
  origin?: string
) {
  return await fetchFromBackend('/ai/generate-trip', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      destination,
      duration_days: durationDays,
      budget,
      travel_style: travelStyle || 'Balanced',
      interests: ['Sightseeing', 'Hidden Gems', 'Local Food'],
      start_date: startDate || new Date().toISOString().split('T')[0],
      origin: origin || 'India'
    })
  });
}

/**
 * Executes semantic document search across the ExploreX RAG vector database.
 * 
 * @param {string} query - Search query or destination keyword
 * @param {number} [topK=3] - Number of top relevant documents to retrieve
 * @returns {Promise<{ query: string; results: any[]; retrieved_documents: string[] } | null>}
 */
export async function queryRagVectorStore(query: string, topK: number = 3) {
  return await fetchFromBackend('/rag/query', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, top_k: topK })
  });
}

/**
 * Indexes a new document or travel log into the RAG knowledge store.
 * 
 * @param {string} id - Unique document identifier
 * @param {string} title - Human-readable document title
 * @param {string} content - Markdown or raw text content of the document
 * @returns {Promise<{ success: boolean; document: any } | null>}
 */
export async function indexDocumentInRag(id: string, title: string, content: string) {
  return await fetchFromBackend('/rag/index', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, title, content })
  });
}

/**
 * Calculates a detailed, realistic travel budget breakdown and practical savings tips.
 * 
 * @param {string} destination - Trip location
 * @param {number} [durationDays=3] - Duration of stay
 * @param {number} [groupSize=2] - Number of travelers
 * @returns {Promise<any | null>} Budget breakdown across stay, transport, food, and activities
 */
export async function calculateBudgetFromBackend(destination: string, durationDays: number = 3, groupSize: number = 2) {
  return await fetchFromBackend('/budget/calculate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ destination, duration_days: durationDays, group_size: groupSize })
  });
}
