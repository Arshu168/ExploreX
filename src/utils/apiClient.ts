const API_BASES = ['/api', 'http://localhost:8000/api'];

async function fetchFromBackend(endpoint: string, options?: RequestInit) {
  for (const base of API_BASES) {
    try {
      const url = `${base}${endpoint}`;
      const res = await fetch(url, options);
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // try next base URL
    }
  }
  return null;
}

export async function checkBackendHealth(): Promise<{ isOnline: boolean; isGeminiReal: boolean }> {
  const data = await fetchFromBackend('/health', { method: 'GET' });
  if (data && data.status === 'online') {
    return { isOnline: true, isGeminiReal: Boolean(data.geminiConnected) };
  }
  return { isOnline: false, isGeminiReal: false };
}

export async function sendAiChatRequest(message: string, destination?: string) {
  return await fetchFromBackend('/ai/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, destination: destination || '' })
  });
}

export async function generatePlacesFromBackend(destination: string) {
  return await fetchFromBackend('/places/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ destination })
  });
}

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

export async function queryRagVectorStore(query: string, topK: number = 3) {
  return await fetchFromBackend('/rag/query', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, top_k: topK })
  });
}

export async function indexDocumentInRag(id: string, title: string, content: string) {
  return await fetchFromBackend('/rag/index', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, title, content })
  });
}

export async function calculateBudgetFromBackend(destination: string, durationDays: number = 3, groupSize: number = 2) {
  return await fetchFromBackend('/budget/calculate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ destination, duration_days: durationDays, group_size: groupSize })
  });
}

