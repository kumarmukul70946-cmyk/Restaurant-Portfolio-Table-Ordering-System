import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function Booking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [formData, setFormData] = useState({ userName: '', userPhone: '', date: '', time: '', tablesBooked: 1 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:5000/api/restaurants/${id}`)
      .then(res => res.json())
      .then(data => setRestaurant(data))
      .catch(err => console.error("Error", err));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const resp = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ restaurantId: id, ...formData })
      });
      const data = await resp.json();

      if (resp.ok) {
        // DEMO: Send message TO the customer's phone number (acting as the automated restaurant system)
        const customerPhone = formData.userPhone.replace('+', '').replace(/\s/g, ''); 
        
        const message = encodeURIComponent(
          `*Zaika Automated System* 🥂\n\nHello ${formData.userName}!\n\nThis is a confirmation that your reservation at *${restaurant.name}* is confirmed.\n\n📅 Date: ${formData.date}\n⏰ Time: ${formData.time}\n🪑 Tables: ${formData.tablesBooked}\n\n📍 Location: ${restaurant.city}\n\nPlease click the secure link below to complete your payment or reply to this chat if you have any questions!`
        );
        
        // Opens WhatsApp Web or App drafting a message to the CUSTOMER
        window.open(`https://wa.me/${customerPhone}?text=${message}`, "_blank");
        navigate("/");
      } else {
        alert("Error: " + data.error);
      }
    } catch {
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (!restaurant) return (
    <div className="min-h-screen bg-[#0a0a0c] flex justify-center items-center text-white">
      <div className="w-12 h-12 rounded-full border-t-2 border-r-2 border-indigo-500 animate-spin"></div>
    </div>
  );

  return (
    <div className="relative min-h-screen bg-[#0a0a0c] text-white overflow-hidden flex items-center justify-center p-6">
      
      {/* Absolute Blurred Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-30 blur-[4px]"
        style={{ backgroundImage: `url(${restaurant.image?.includes('unsplash.com') ? `${restaurant.image}?auto=format&fit=crop&w=1200&q=80` : (restaurant.image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80')})` }}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-[#0a0a0c]/80 to-transparent"></div>

      <div className="relative z-10 w-full max-w-5xl bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row shadow-[0_30px_60px_rgba(0,0,0,0.5)]">
        
        {/* Left Info Panel */}
        <div className="md:w-[45%] p-10 lg:p-14 flex flex-col justify-between bg-black/40 border-r border-white/5">
          <div>
            <button 
              onClick={() => navigate('/')}
              className="group flex items-center gap-2 text-neutral-400 hover:text-white transition-colors text-sm font-medium mb-12 uppercase tracking-wider"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Go Back
            </button>
            <h1 className="text-4xl lg:text-5xl font-black mb-4 tracking-tighter leading-tight bg-clip-text text-transparent bg-gradient-to-br from-white to-neutral-400">
              {restaurant.name}
            </h1>
            <p className="text-lg text-neutral-300 font-light leading-relaxed mb-6">
              {restaurant.description}
            </p>
            <div className="flex gap-4 items-center">
              <span className="px-4 py-2 bg-white/10 rounded-xl text-sm font-medium border border-white/5 text-purple-200">
                {restaurant.city}
              </span>
              <span className="px-4 py-2 bg-white/10 rounded-xl text-sm font-medium border border-white/5 text-fuchsia-200">
                {restaurant.cuisine}
              </span>
            </div>
          </div>
          
          <div className="mt-12 bg-white/5 border border-white/10 p-6 rounded-2xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-green-400 to-emerald-600 flex items-center justify-center text-xl shadow-lg shadow-green-500/20">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <div>
              <h4 className="font-bold text-white text-md">WhatsApp Booking</h4>
              <p className="text-neutral-400 text-xs">Secure payment directly via chat</p>
            </div>
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="md:w-[55%] p-10 lg:p-14">
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
            <div className="w-2 h-8 bg-fuchsia-500 rounded-full"></div>
            Reservation Details
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400 ml-1">Guest Name</label>
                <input required type="text" placeholder="John Doe" 
                  className="w-full bg-black/30 border border-white/10 px-5 py-4 rounded-2xl outline-none focus:border-fuchsia-500 focus:bg-white/5 transition-all w-full text-white placeholder-neutral-600 font-medium font-sans"
                  onChange={e => setFormData({ ...formData, userName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400 ml-1">WhatsApp No.</label>
                <input required type="tel" placeholder="+91 99999 99999" 
                  className="w-full bg-black/30 border border-white/10 px-5 py-4 rounded-2xl outline-none focus:border-fuchsia-500 focus:bg-white/5 transition-all w-full text-white placeholder-neutral-600 font-medium font-sans"
                  onChange={e => setFormData({ ...formData, userPhone: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400 ml-1">Date</label>
                <input required type="date"
                  className="w-full bg-black/30 border border-white/10 px-5 py-4 rounded-2xl outline-none focus:border-fuchsia-500 focus:bg-white/5 transition-all text-neutral-300 font-medium font-sans color-scheme-dark"
                  onChange={e => setFormData({ ...formData, date: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400 ml-1">Time</label>
                <input required type="time"
                  className="w-full bg-black/30 border border-white/10 px-5 py-4 rounded-2xl outline-none focus:border-fuchsia-500 focus:bg-white/5 transition-all text-neutral-300 font-medium font-sans color-scheme-dark"
                  onChange={e => setFormData({ ...formData, time: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400 ml-1">Table Count</label>
              <div className="flex bg-black/30 border border-white/10 p-2 rounded-2xl focus-within:border-fuchsia-500 transition-all">
                <div className="flex-1 flex items-center px-4 text-neutral-300 font-medium">
                  {restaurant.availableTables} Tables Available
                </div>
                <input required type="number" min="1" max={restaurant.availableTables} value={formData.tablesBooked}
                  className="w-24 bg-white/10 text-center py-3 rounded-xl outline-none text-white font-bold"
                  onChange={e => setFormData({ ...formData, tablesBooked: Number(e.target.value) })}
                />
              </div>
            </div>

            <button 
              disabled={loading} 
              className="group relative w-full mt-6 py-5 rounded-2xl font-bold text-lg overflow-hidden transition-all shadow-[0_0_40px_rgba(217,70,239,0.3)] hover:shadow-[0_0_60px_rgba(217,70,239,0.5)] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500 transition-transform duration-500 group-hover:scale-110"></div>
              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <span className="relative z-10 flex items-center justify-center gap-2 drop-shadow-md">
                {loading ? "Confirming..." : "Confirm & Pay via WhatsApp"}
                {!loading && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                )}
              </span>
            </button>
            <p className="text-center text-xs text-neutral-500 mt-4">
              Upon confirmation, you will be redirected to WhatsApp to complete your secure payment.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
