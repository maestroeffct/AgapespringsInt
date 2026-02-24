export const API_BASE_URL = 'https://api.agapespringsint.com';

export async function apiGet<T>(endpoint: string): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${endpoint}`);

  if (!res.ok) {
    throw new Error('Network error');
  }

  return res.json();
}
