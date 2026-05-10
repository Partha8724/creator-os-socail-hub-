/**
 * Smart Social Hub API Utility
 * Centralized sync logic for all server requests
 */

export async function smartSync<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `Smart Sync Interrupted: ${response.status}`);
  }

  return response.json();
}

export const api = {
  getHealth: () => smartSync<{ status: string }>('/api/health'),
  createSubscription: (tier: string) => smartSync<{ url: string }>('/api/create-subscription', {
    method: 'POST',
    body: JSON.stringify({ tier }),
  }),
};
