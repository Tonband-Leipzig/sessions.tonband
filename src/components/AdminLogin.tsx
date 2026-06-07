import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../lib/auth';
import Background from './Background';
import { ArrowLeft } from 'lucide-react';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      console.log('[LOGIN] Attempting login with:', email);
      await auth.signIn(email, password);
      console.log('[LOGIN] Success, navigating to /admin');
      navigate('/admin');
    } catch (err) {
      console.error('[LOGIN] Error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-dark">
      <Background />
      <div className="w-full max-w-md p-8 relative">
        <button
          onClick={() => navigate('/')}
          className="absolute top-0 left-0 p-4 text-white/60 hover:text-white transition-colors flex items-center gap-2
                   hover:text-[#3BAAB8]"
        >
          <ArrowLeft size={20} />
          <span>Back</span>
        </button>

        <div className="mb-8 text-center">
          <img 
            src="https://i.imgur.com/mg9OqWm.png" 
            alt="ton.band Logo" 
            className="w-32 mx-auto mb-6 drop-shadow-[0_0_15px_rgba(59,170,184,0.4)]"
          />
          <h2 className="text-3xl font-black text-white tracking-tight drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]">
            Admin Login
          </h2>
        </div>
        
        <div className="bg-white/5 backdrop-blur-xl p-8 rounded-2xl border border-[#3BAAB8] shadow-[0_8px_32px_rgba(0,0,0,0.2)] 
                      hover:shadow-[0_0_20px_rgba(59,170,184,0.2)] transition-all duration-300">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-300 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40
                         focus:outline-none focus:ring-2 focus:ring-[#3BAAB8] focus:border-transparent
                         hover:border-white/20 transition-all duration-300"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-neutral-300 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40
                         focus:outline-none focus:ring-2 focus:ring-[#3BAAB8] focus:border-transparent
                         hover:border-white/20 transition-all duration-300"
                placeholder="Enter your password"
                required
              />
            </div>

            {error && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white/5 backdrop-blur-sm border border-[#3BAAB8] text-white py-3 px-4 rounded-xl
                     font-medium hover:shadow-[0_0_15px_rgba(59,170,184,0.2)] disabled:opacity-50
                     transition-all duration-300"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                  Logging in...
                </span>
              ) : (
                'Login'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;