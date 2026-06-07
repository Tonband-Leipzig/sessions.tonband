const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  console.warn('VITE_API_URL is not set. API calls will fail.');
}

async function fetchApi(path: string, options: RequestInit = {}) {
  const url = `${API_URL}${path}`;
  const token = localStorage.getItem('tonband_auth_token');

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || `HTTP ${response.status}`);
  }

  return data;
}

export interface Tool {
  id: string;
  title: string;
  description: string;
  link: string;
  icon: string;
  is_internal: boolean;
  display_order: number;
  created_at?: string;
  updated_at?: string;
}

export const api = {
  tools: {
    list: (): Promise<{ success: boolean; tools: Tool[] }> =>
      fetchApi('/tools.php'),

    get: (id: string): Promise<{ success: boolean; tool: Tool }> =>
      fetchApi(`/tools.php?id=${encodeURIComponent(id)}`),

    create: (tool: Omit<Tool, 'id' | 'display_order' | 'created_at' | 'updated_at'>):
      Promise<{ success: boolean; tool: Tool }> =>
      fetchApi('/tools.php', {
        method: 'POST',
        body: JSON.stringify(tool),
      }),

    update: (id: string, tool: Partial<Tool>): Promise<{ success: boolean; message: string }> =>
      fetchApi(`/tools.php?id=${encodeURIComponent(id)}`, {
        method: 'PUT',
        body: JSON.stringify(tool),
      }),

    delete: (id: string): Promise<{ success: boolean; message: string }> =>
      fetchApi(`/tools.php?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      }),
  },
};
