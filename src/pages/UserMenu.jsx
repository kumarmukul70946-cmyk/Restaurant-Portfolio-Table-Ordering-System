import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function UserMenu() {
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetch(`/api/bookings?email=${user.email}`)
      .then(res => res.json())
      .then(d => setBookings(Array.isArray(d) ? d : []))
      .catch(err => console.error(err));
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-neutral-200 relative overflow-hidden font-sans">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-fuchsia-600/5 rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 pt-32 pb-20 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 border-b border-white/10 pb-8 gap-6">
          <div>
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-fuchsia-500 flex items-center justify-center text-3xl mb-6 shadow-[0_0_30px_rgba(217,70,239,0.4)]">
              👤
            </div>
            <h1 className="text-4xl md:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-400 to-indigo-400">
              Welcome, {user.name}
            </h1>
            <p className="text-neutral-400 mt-2 text-lg">Here are your luxury dining reservations.</p>
          </div>
          
          <button 
            onClick={() => navigate('/')}
            className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors font-semibold text-sm flex items-center gap-2"
          >
            Explore Restaurants
          </button>
        </div>

        <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
          <div className="w-1.5 h-6 bg-indigo-500 rounded-full"></div>
          Your Bookings ({bookings.length})
        </h2>

        {bookings.length === 0 ? (
          <div className="bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 p-16 text-center">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
              🍽️
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No active bookings</h3>
            <p className="text-neutral-400 mb-6">Looks like you haven't reserved any tables yet.</p>
            <button 
              onClick={() => navigate('/')}
              className="px-8 py-3 rounded-full bg-gradient-to-r from-fuchsia-600 to-indigo-600 font-bold hover:scale-105 transition-transform"
            >
              Browse Destinations
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookings.map(b => (
              <div key={b._id} className="group bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden hover:shadow-[0_20px_40px_rgba(0,0,0,0.5)] transition-all hover:-translate-y-1">
                <div className="h-32 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#121216] to-transparent z-10"></div>
                  <img 
                    loading="lazy"
                    src={(b.restaurantId?.image?.url || b.restaurantId?.image)?.includes('unsplash.com') ? `${(b.restaurantId?.image?.url || b.restaurantId?.image)}?auto=format&fit=crop&w=400&q=80` : ((b.restaurantId?.image?.url || b.restaurantId?.image) || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4")} 
                    onError={(e) => { e.target.onerror = null; e.target.src = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=400&q=80" }}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    alt="restaurant" 
                    style={{ willChange: 'transform' }}
                  />
                  <div className="absolute top-4 right-4 z-20">
                    <span className="bg-emerald-500/90 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md">
                      {b.status}
                    </span>
                  </div>
                </div>
                <div className="p-6 relative z-20 bg-[#121216]">
                  <h3 className="text-2xl font-bold text-white mb-1">{b.restaurantId?.name || 'Restaurant'}</h3>
                  <p className="text-fuchsia-400 text-sm mb-4">📍 {b.restaurantId?.city || 'Unknown'}</p>
                  
                  <div className="space-y-3 bg-black/40 border border-white/5 rounded-2xl p-4">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-neutral-400">Date</span>
                      <span className="font-semibold text-white">{b.date}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-neutral-400">Time</span>
                      <span className="font-semibold text-white">{b.time}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-neutral-400">Tables</span>
                      <span className="font-bold text-fuchsia-400">{b.tablesBooked}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
