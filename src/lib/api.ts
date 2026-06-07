const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  console.warn('VITE_API_URL is not set. API calls will fail.');
}

async function fetchApi(path: string, options: RequestInit = {}) {
  const url = `${API_URL}${path}`;
  const token = localStorage.getItem('tonband_auth_token');

  const controller = new AbortController();
  const timeoutMs = 15000;
  const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs);

  const isFormDataBody = typeof FormData !== 'undefined' && options.body instanceof FormData;

  const headers: Record<string, string> = {
    ...((options.headers as Record<string, string>) || {}),
  };

  if (!isFormDataBody && !headers['Content-Type'] && !headers['content-type']) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  let response: Response;
  try {
    response = await fetch(url, {
      ...options,
      headers,
      signal: controller.signal,
    });
  } finally {
    window.clearTimeout(timeoutId);
  }

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
  thumbnail_url?: string | null;
  thumbnail_preview_url?: string | null;
  thumbnail_full_url?: string | null;
  is_internal: boolean;
  display_order: number;
  created_at?: string;
  updated_at?: string;
}

export const api = {
  tools: {
    list: (() => {
      let cache: { at: number; value: { success: boolean; tools: Tool[] } } | null = null;
      let inflight: Promise<{ success: boolean; tools: Tool[] }> | null = null;

      return (): Promise<{ success: boolean; tools: Tool[] }> => {
        const now = Date.now();
        if (cache && now - cache.at < 15000) {
          return Promise.resolve(cache.value);
        }

        if (inflight) return inflight;

        inflight = fetchApi('/tools.php').then((res) => {
          cache = { at: Date.now(), value: res };
          inflight = null;
          return res;
        }).catch((err) => {
          inflight = null;
          throw err;
        });

        return inflight;
      };
    })(),

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
  uploads: {
    thumbnail: (file: File): Promise<{ success: boolean; url: string; preview_url?: string; full_url?: string }> => {
      const body = new FormData();
      body.append('file', file);
      return fetchApi('/uploads.php?action=thumbnail', {
        method: 'POST',
        body,
      });
    },
  },
};
