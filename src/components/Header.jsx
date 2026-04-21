import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  // Hide header on login page
  if (location.pathname === '/login') return null;

  return (
    <nav className="fixed top-0 inset-x-0 z-50 bg-black/40 backdrop-blur-2xl border-b border-white/10 p-4 transition-all">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div 
          onClick={() => navigate('/')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <img 
            src="/logo.png" 
            alt="Zaika" 
            className="h-10 w-auto object-contain rounded-full border border-fuchsia-500/30 shadow-[0_0_15px_rgba(217,70,239,0.3)] group-hover:shadow-[0_0_25px_rgba(217,70,239,0.6)] group-hover:scale-105 transition-all" 
          />
          <h2 className="text-2xl font-black tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-amber-300 via-yellow-500 to-fuchsia-500">
            ZAIKA
          </h2>
        </div>
        
        <div className="flex items-center gap-6">
          <button onClick={() => navigate('/')} className="text-sm font-semibold text-neutral-300 hover:text-white transition-colors">
            Home
          </button>
          
          {user ? (
            <>
              <button onClick={() => navigate('/usermenu')} className="text-sm font-semibold text-neutral-300 hover:text-white transition-colors">
                My Bookings
              </button>
              {user.role === 'admin' && (
                <button onClick={() => navigate('/admin')} className="text-sm font-semibold text-fuchsia-400 hover:text-white transition-colors border-l border-white/20 pl-6">
                  Admin Panel
                </button>
              )}
              <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-full cursor-pointer hover:bg-white/10 transition-colors ml-4" onClick={handleLogout}>
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-fuchsia-500 to-indigo-500 flex items-center justify-center text-[10px] text-white font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-semibold text-neutral-200">Log Out</span>
              </div>
            </>
          ) : (
            <button 
              onClick={() => navigate('/login')}
              className="ml-4 px-6 py-2 rounded-full font-bold text-sm bg-gradient-to-r from-fuchsia-600 to-indigo-600 text-white shadow-[0_0_15px_rgba(217,70,239,0.3)] hover:scale-105 active:scale-95 transition-all"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
