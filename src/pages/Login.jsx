import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    let endpoint = '';
    if (isAdmin) {
      endpoint = '/api/users/admin/login';
    } else {
      endpoint = isRegister ? '/api/users/register' : '/api/users/login';
    }
    
    try {
      const resp = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await resp.json();
      
      if (resp.ok) {
        localStorage.setItem('user', JSON.stringify(data.admin || data.user));
        localStorage.setItem('token', data.token);
        navigate(isAdmin ? '/admin' : '/user/menu');
      } else {
        alert(data.message || data.error || 'Login failed');
      }
    } catch (err) {
      alert("Error occurred. Is backend running?");
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] flex items-center justify-center relative overflow-hidden text-neutral-200">
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-fuchsia-600/5 rounded-full pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-indigo-600/5 rounded-full pointer-events-none"></div>

      <div className="w-full max-w-md bg-white/5 backdrop-blur-2xl p-10 rounded-3xl border border-white/10 shadow-2xl relative z-10">
        <div className="flex mb-6 bg-black/40 p-1 rounded-xl">
          <button
            type="button"
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${!isAdmin ? 'bg-fuchsia-600/20 text-fuchsia-400' : 'text-neutral-400 hover:text-white'}`}
            onClick={() => { setIsAdmin(false); setIsRegister(false); }}
          >
            User
          </button>
          <button
            type="button"
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${isAdmin ? 'bg-indigo-600/20 text-indigo-400' : 'text-neutral-400 hover:text-white'}`}
            onClick={() => { setIsAdmin(true); setIsRegister(false); }}
          >
            Admin
          </button>
        </div>

        <h2 className="text-3xl font-black mb-2 text-white">
          {isAdmin ? "Admin Login" : (isRegister ? "Create Account" : "Welcome Back")}
        </h2>
        <p className="text-neutral-400 text-sm mb-8">
          {isAdmin 
            ? "Log in to access the admin dashboard." 
            : (isRegister ? "Sign up to start booking premium tables." : "Log in to view your bookings or manage settings.")}
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {isRegister && (
            <div className="relative">
              <input required type="text" placeholder="Full Name" 
                className="w-full bg-black/40 border border-white/10 p-4 pl-12 rounded-2xl outline-none focus:border-fuchsia-500 focus:bg-white/5 transition-all text-white placeholder-neutral-500"
                onChange={e => setFormData({ ...formData, name: e.target.value })}
              />
              <svg className="w-5 h-5 absolute left-4 top-4 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          )}

          <div className="relative">
            <input required type="email" placeholder="Email Address" 
              className="w-full bg-black/40 border border-white/10 p-4 pl-12 rounded-2xl outline-none focus:border-fuchsia-500 focus:bg-white/5 transition-all text-white placeholder-neutral-500"
              onChange={e => setFormData({ ...formData, email: e.target.value })}
            />
            <svg className="w-5 h-5 absolute left-4 top-4 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>

          <div className="relative">
            <input required type="password" placeholder="Password" 
              className="w-full bg-black/40 border border-white/10 p-4 pl-12 rounded-2xl outline-none focus:border-fuchsia-500 focus:bg-white/5 transition-all text-white placeholder-neutral-500"
              onChange={e => setFormData({ ...formData, password: e.target.value })}
            />
            <svg className="w-5 h-5 absolute left-4 top-4 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>

          <button className="w-full mt-6 py-4 rounded-2xl font-bold bg-gradient-to-r from-fuchsia-600 to-indigo-600 text-white shadow-[0_0_20px_rgba(217,70,239,0.3)] hover:shadow-[0_0_30px_rgba(217,70,239,0.5)] transition-all">
            {isRegister ? "Sign Up" : "Sign In"}
          </button>
        </form>

        {!isAdmin && (
          <p className="text-center text-sm text-neutral-400 mt-6">
            {isRegister ? "Already have an account?" : "Don't have an account?"}{' '}
            <button 
              type="button" 
              onClick={() => setIsRegister(!isRegister)} 
              className="text-fuchsia-400 hover:text-white transition-colors font-medium border-b border-transparent hover:border-white"
            >
              {isRegister ? "Log In" : "Register"}
            </button>
          </p>
        )}
      </div>
    </div>
  );
}
