import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import PublicTools from './components/PublicTools';
import InternalTools from './components/InternalTools';
import Footer from './components/Footer';
import Background from './components/Background';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import Datenschutz from './components/Datenschutz';
import Impressum from './components/Impressum';
import { auth } from './lib/auth';

function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Don't block the whole app on auth verification.
    // On mobile/slow networks the verify request can take a long time (or hang),
    // which previously caused a black screen with "Loading...".
    // We render immediately using the cached session, and verify in the background.
    setIsAdmin(!!auth.getUser());
    setLoading(false);

    const refresh = () => {
      auth.getSession().then(({ user }) => {
        setIsAdmin(!!user);
      });
    };

    refresh();

    const onAuthChanged = () => refresh();
    window.addEventListener('tonband-auth-changed', onAuthChanged);
    return () => window.removeEventListener('tonband-auth-changed', onAuthChanged);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-dark flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  const MainPage = () => {
    const navigate = useNavigate();
    
    return (
      <div className="relative min-h-screen bg-bg-dark text-white overflow-hidden flex flex-col">
        <Background />

        <main className="relative z-10 px-6 max-w-6xl mx-auto flex-1">
          <div className="absolute top-4 right-4 z-20">
            <button
              onClick={() => navigate('/admin')}
              className="px-6 py-2.5 bg-neutral-900/90 md:bg-white/5 md:backdrop-blur-sm border border-[#3BAAB8] rounded-xl 
                       text-white md:hover:shadow-[0_0_15px_rgba(59,170,184,0.2)] md:hover:border-[#3BAAB8]/80
                       transition-all duration-300 font-medium"
            >
              Login
            </button>
          </div>

          <Header />
          <PublicTools />
          <InternalTools />
        </main>
        
        <Footer />
      </div>
    );
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route
          path="/admin"
          element={
            isAdmin ? (
              <AdminDashboard />
            ) : (
              <AdminLogin />
            )
          }
        />
        <Route path="/datenschutz" element={<Datenschutz />} />
        <Route path="/impressum" element={<Impressum />} />
      </Routes>
    </Router>
  );
}

export default App;