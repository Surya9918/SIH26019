export const API_BASE_URL = import.meta.env.VITE_API_URL || (typeof window !== 'undefined' ? '/api' : 'http://127.0.0.1:8000/api');

function getAuthHeaders() {
  const token = localStorage.getItem('nlpg_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config = {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options.headers,
    },
  };

  let response: Response;
  try {
    response = await fetch(url, config);
  } catch (error: any) {
    throw new Error(`Network Error: ${error.message}`);
  }

  if (response.status === 401) {
    // Optionally trigger a logout event, but for now we throw so AuthContext or caller handles it
    localStorage.removeItem('nlpg_token');
    window.dispatchEvent(new Event('auth_unauthorized'));
  }

  if (!response.ok) {
    let errorMessage = `HTTP Error ${response.status}`;
    try {
      const errorData = await response.json();
      errorMessage = errorData.detail || errorData.message || errorMessage;
    } catch (e) {
      // Ignored
    }
    throw new ApiError(errorMessage, response.status);
  }

  // Handle empty responses
  if (response.status === 204) {
    return {} as T;
  }

  return response.json() as Promise<T>;
}
