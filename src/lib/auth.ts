const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  console.warn('VITE_API_URL is not set. Auth will not work.');
}

const TOKEN_KEY = 'tonband_auth_token';
const USER_KEY = 'tonband_auth_user';

interface AuthUser {
  email: string;
  role: string;
}

async function fetchApi(path: string, options: RequestInit = {}) {
  const url = `${API_URL}${path}`;
  const token = localStorage.getItem(TOKEN_KEY);

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

export const auth = {
  signIn: async (email: string, password: string): Promise<void> => {
    console.log('[AUTH] Sending login request...');
    const data = await fetchApi('/auth.php', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    console.log('[AUTH] Response:', data);

    if (!data.success || !data.token) {
      console.error('[AUTH] Login failed:', data.error || 'No token');
      throw new Error(data.error || 'Login failed');
    }

    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    console.log('[AUTH] Token saved, login successful');
  },

  signOut: (): void => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  getSession: async (): Promise<{ user: AuthUser | null }> => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      return { user: null };
    }

    try {
      const data = await fetchApi('/auth.php?action=verify');
      if (data.success && data.valid) {
        return { user: data.user };
      }
    } catch {
      // Token invalid or expired
    }

    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    return { user: null };
  },

  getToken: (): string | null => {
    return localStorage.getItem(TOKEN_KEY);
  },

  getUser: (): AuthUser | null => {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  onAuthStateChange: (_callback: (event: string, user: AuthUser | null) => void) => {
    // Simple polyfill - we don't have real-time auth state changes
    // but we provide an unsubscribe function for API compatibility
    return {
      subscription: {
        unsubscribe: () => { /* no-op */ },
      },
    };
  },
};
