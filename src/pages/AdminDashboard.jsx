import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const [data, setData] = useState({ metrics: null, recentBookings: [] });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('http://localhost:5000/api/admin/dashboard', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(d => setData(d))
      .catch(err => console.error(err));
  }, []);

  if (!data.metrics) return (
    <div className="min-h-screen bg-[#0a0a0c] flex justify-center items-center">
      <div className="w-12 h-12 rounded-full border-t-2 border-r-2 border-fuchsia-500 animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white p-6 relative overflow-hidden font-sans">
      {/* Background glow effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-fuchsia-600/10 rounded-full pointer-events-none opacity-30"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full pointer-events-none opacity-30"></div>

      <div className="max-w-7xl mx-auto relative z-10 pt-10">
        <div className="flex justify-between items-end mb-12 border-b border-white/10 pb-6">
          <div>
            <button 
              onClick={() => navigate('/')}
              className="text-fuchsia-400 hover:text-fuchsia-300 transition-colors uppercase tracking-widest text-xs font-bold flex items-center gap-2 mb-6"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Site
            </button>
            <h1 className="text-4xl md:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-400 to-indigo-400">
              Admin Overview
            </h1>
            <p className="text-neutral-400 mt-2">Manage your premium restaurant bookings and capacities.</p>
          </div>
          <div className="hidden md:flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-xl">
            <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full shadow-[0_0_10px_#34d399] animate-pulse"></span>
            <span className="text-sm font-medium text-neutral-300">System Online</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Total Reservations', value: data.metrics.totalBookings, color: 'from-blue-500 to-indigo-500' },
            { label: 'Total Restaurants', value: data.metrics.totalRestaurants, color: 'from-fuchsia-500 to-pink-500' },
            { label: 'Total Tables', value: data.metrics.totalTables, color: 'from-amber-400 to-orange-500' },
            { label: 'Available Tables', value: data.metrics.availableTables, color: 'from-emerald-400 to-teal-500' }
          ].map((stat, i) => (
            <div key={i} className="relative group bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-3xl overflow-hidden hover:-translate-y-1 transition-all duration-300 shadow-xl">
              <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${stat.color} opacity-70 group-hover:opacity-100 transition-opacity`}></div>
              <p className="text-neutral-400 text-sm font-semibold uppercase tracking-wider mb-2">{stat.label}</p>
              <p className="text-5xl font-black text-white">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Add Restaurant Form */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <div className="w-1.5 h-6 bg-fuchsia-500 rounded-full"></div>
              Add New Restaurant
            </h2>
          </div>

          <form 
            onSubmit={async (e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              const payload = Object.fromEntries(formData.entries());
              
              try {
                const token = localStorage.getItem('token');
                const res = await fetch('http://localhost:5000/api/admin/restaurant', {
                  method: 'POST',
                  headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                  },
                  body: JSON.stringify(payload)
                });
                
                if (res.ok) {
                  alert('Restaurant Successfully Added!');
                  e.target.reset();
                  // Refresh metrics
                  fetch('http://localhost:5000/api/admin/dashboard', { headers: { 'Authorization': `Bearer ${token}` } })
                    .then(res => res.json())
                    .then(d => setData(d));
                } else {
                  const errNode = await res.json();
                  alert(`Failed: ${errNode.error}`);
                }
              } catch (err) {
                alert(`Error: ${err.message}`);
              }
            }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-neutral-400 uppercase tracking-wide">Restaurant Name</label>
              <input required name="name" type="text" placeholder="e.g., The Golden Spoon" className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-fuchsia-500" />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-neutral-400 uppercase tracking-wide">City</label>
              <input required name="city" type="text" placeholder="e.g., Mumbai" className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-fuchsia-500" />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-neutral-400 uppercase tracking-wide">Cuisine Type</label>
              <input required name="cuisine" type="text" placeholder="e.g., Italian Fine Dining" className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-fuchsia-500" />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-neutral-400 uppercase tracking-wide">Price for Two</label>
              <input required name="priceForTwo" type="text" placeholder="e.g., ₹2000" className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-fuchsia-500" />
            </div>

            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="text-sm font-medium text-neutral-400 uppercase tracking-wide">Image URL</label>
              <input required name="image" type="url" placeholder="https://images.unsplash.com/photo-..." className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-fuchsia-500" />
            </div>

            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="text-sm font-medium text-neutral-400 uppercase tracking-wide">Description</label>
              <textarea required name="description" rows="3" placeholder="Write a short appealing description..." className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-fuchsia-500 resize-none"></textarea>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-neutral-400 uppercase tracking-wide">Diet/Category</label>
              <select required name="diet" className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-fuchsia-500">
                <option value="Veg">Veg</option>
                <option value="Non-Veg">Non-Veg</option>
                <option value="Both">Both (Cafe / Mixup)</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-neutral-400 uppercase tracking-wide">WhatsApp Phone Number</label>
              <input required name="phoneNumber" type="text" placeholder="+919876543210" className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-fuchsia-500" />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-neutral-400 uppercase tracking-wide">Total Tables</label>
              <input required name="totalTables" type="number" defaultValue="20" min="1" className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-fuchsia-500" />
            </div>

            <div className="md:col-span-2 mt-4">
              <button type="submit" className="w-full bg-gradient-to-r from-fuchsia-600 to-indigo-600 hover:from-fuchsia-500 hover:to-indigo-500 transition-all shadow-lg rounded-xl px-6 py-4 font-bold text-white tracking-widest uppercase text-sm">
                Add Venue to Directory
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
