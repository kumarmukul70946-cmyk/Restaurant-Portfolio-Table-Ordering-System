import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Users, 
  Phone, 
  User, 
  MapPin, 
  Utensils, 
  MessageSquare,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

export default function Booking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const [formData, setFormData] = useState({ 
    userName: user?.name || '', 
    userPhone: '', 
    userEmail: user?.email || '',
    date: '', 
    time: '', 
    tablesBooked: 1 
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetch(`http://localhost:5000/api/restaurants/${id}`)
      .then(res => res.json())
      .then(data => setRestaurant(data.data || data))
      .catch(err => console.error("Error", err));
  }, [id, user, navigate]);

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
        const customerPhone = formData.userPhone.replace('+', '').replace(/\s/g, ''); 
        
        // Updated with user's specific UPI details from the QR code
        const depositAmount = formData.tablesBooked * 500;
        const upiId = "7290074210@ybl"; 
        const merchantName = "Mukul Anand";
        const upiLink = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(merchantName)}&am=${depositAmount}&cu=INR&tn=Reservation%20Deposit%20for%20${restaurant.name}`;

        const message = encodeURIComponent(
          `*Zaika Automated System* 🥂\n\n` +
          `Hello ${formData.userName}!\n\n` +
          `This is a confirmation that your reservation at *${restaurant.name}* is confirmed.\n\n` +
          `📅 *Date:* ${formData.date}\n` +
          `⏰ *Time:* ${formData.time}\n` +
          `🪑 *Tables:* ${formData.tablesBooked}\n\n` +
          `📍 *Location:* ${restaurant.city || restaurant.location}\n\n` +
          `💳 *Payment:* Please complete your deposit of *₹${depositAmount}* via UPI below:\n` +
          `${upiLink}\n\n` +
          `Reply to this chat if you have any questions! See you soon!`
        );
        window.open(`https://wa.me/${customerPhone}?text=${message}`, "_blank");
        navigate("/usermenu");
      } else {
        alert("Error: " + data.message || data.error);
      }
    } catch {
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (!restaurant) return (
    <div className="min-h-screen bg-[#0a0a0c] flex justify-center items-center text-white">
      <div className="w-12 h-12 rounded-full border-t-2 border-r-2 border-fuchsia-500 animate-spin"></div>
    </div>
  );

  return (
    <div className="relative min-h-screen bg-[#0a0a0c] text-white overflow-hidden flex items-center justify-center p-4 md:p-10 font-sans">
      
      {/* Dynamic Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-20 blur-[10px] scale-110"
        style={{ backgroundImage: `url(${(restaurant.image?.url || restaurant.image)?.includes('unsplash.com') ? `${(restaurant.image?.url || restaurant.image)}?auto=format&fit=crop&w=1200&q=80` : ((restaurant.image?.url || restaurant.image) || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80')})` }}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-[#0a0a0c] via-[#0a0a0c]/90 to-transparent"></div>

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-6xl bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[2.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.7)] overflow-hidden flex flex-col lg:flex-row min-h-[700px]">
        
        {/* Left Info Panel */}
        <div className="lg:w-[42%] p-8 md:p-12 lg:p-16 flex flex-col justify-between bg-gradient-to-b from-black/60 to-transparent border-b lg:border-b-0 lg:border-r border-white/5 relative overflow-hidden">
          {/* Subtle glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-fuchsia-500/10 rounded-full blur-[80px] -mr-32 -mt-32"></div>
          
          <div className="relative z-10">
            <button 
              onClick={() => navigate('/')}
              className="group flex items-center gap-2 text-neutral-400 hover:text-white transition-all text-xs font-bold uppercase tracking-widest mb-12"
            >
              <ArrowLeft className="h-4 w-4 transform group-hover:-translate-x-1 transition-transform" />
              Go Back
            </button>

            <div className="mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-fuchsia-500/10 border border-fuchsia-500/20 text-fuchsia-400 text-[10px] font-black uppercase tracking-widest mb-4">
                <ShieldCheck className="w-3 h-3" /> Secure Reservation
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 tracking-tighter leading-none text-white">
                {restaurant.name}
              </h1>
              <p className="text-lg text-neutral-400 font-light leading-relaxed mb-8 max-w-md">
                {restaurant.tagline || restaurant.description?.substring(0, 100) + '...'}
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4 text-neutral-300">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-fuchsia-400">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider">Location</p>
                  <p className="font-medium">{restaurant.city || restaurant.location}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-neutral-300">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-indigo-400">
                  <Utensils className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider">Cuisine</p>
                  <p className="font-medium">{restaurant.cuisine || restaurant.cuisineTags?.[0]}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-12 lg:mt-0 relative z-10">
            <div className="group bg-gradient-to-br from-white/[0.05] to-transparent border border-white/10 p-6 rounded-[2rem] flex items-center gap-5 transition-all hover:border-green-500/30">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-green-500 to-emerald-700 flex items-center justify-center text-2xl shadow-[0_10px_20px_rgba(16,185,129,0.3)] group-hover:scale-105 transition-transform">
                <MessageSquare className="h-7 w-7 text-white fill-white/10" />
              </div>
              <div>
                <h4 className="font-black text-white text-lg tracking-tight">WhatsApp Booking</h4>
                <p className="text-neutral-400 text-xs font-medium">Instant confirmation & secure pay</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="lg:w-[58%] p-8 md:p-12 lg:p-16 flex flex-col justify-center">
          <div className="max-w-xl mx-auto w-full">
            <div className="mb-10">
              <h2 className="text-3xl font-black mb-2 tracking-tight">Complete Reservation</h2>
              <p className="text-neutral-500 text-sm">Please fill in your details to secure your table.</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 group">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500 ml-1 group-focus-within:text-fuchsia-500 transition-colors">Guest Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600 group-focus-within:text-fuchsia-500 transition-colors" />
                    <input required type="text" placeholder="Full Name" 
                      className="w-full bg-white/[0.03] border border-white/10 pl-12 pr-5 py-4 rounded-2xl outline-none focus:border-fuchsia-500/50 focus:bg-white/[0.07] transition-all text-white placeholder-neutral-700 font-medium"
                      onChange={e => setFormData({ ...formData, userName: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2 group">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500 ml-1 group-focus-within:text-indigo-500 transition-colors">WhatsApp No.</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600 group-focus-within:text-indigo-500 transition-colors" />
                    <input required type="tel" placeholder="+91 00000 00000" 
                      className="w-full bg-white/[0.03] border border-white/10 pl-12 pr-5 py-4 rounded-2xl outline-none focus:border-indigo-500/50 focus:bg-white/[0.07] transition-all text-white placeholder-neutral-700 font-medium"
                      onChange={e => setFormData({ ...formData, userPhone: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 group">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500 ml-1 group-focus-within:text-purple-500 transition-colors">Preferred Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600 group-focus-within:text-purple-500 transition-colors pointer-events-none" />
                    <input required type="date"
                      className="w-full bg-white/[0.03] border border-white/10 pl-12 pr-5 py-4 rounded-2xl outline-none focus:border-purple-500/50 focus:bg-white/[0.07] transition-all text-neutral-300 font-medium color-scheme-dark"
                      onChange={e => setFormData({ ...formData, date: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2 group">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500 ml-1 group-focus-within:text-amber-500 transition-colors">Dinner Time</label>
                  <div className="relative">
                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600 group-focus-within:text-amber-500 transition-colors pointer-events-none" />
                    <input required type="time"
                      className="w-full bg-white/[0.03] border border-white/10 pl-12 pr-5 py-4 rounded-2xl outline-none focus:border-amber-500/50 focus:bg-white/[0.07] transition-all text-neutral-300 font-medium color-scheme-dark"
                      onChange={e => setFormData({ ...formData, time: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2 group">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500 ml-1 group-focus-within:text-emerald-500 transition-colors">Table Selection</label>
                <div className="flex bg-white/[0.03] border border-white/10 p-2 rounded-[1.5rem] focus-within:border-emerald-500/50 transition-all items-center">
                  <div className="flex-1 flex items-center px-4 gap-3">
                    <Users className="w-5 h-5 text-neutral-600 group-focus-within:text-emerald-500" />
                    <span className="text-sm font-bold text-neutral-400 italic">
                      {restaurant.availableTables} Tables Available
                    </span>
                  </div>
                  <div className="flex items-center bg-white/10 rounded-2xl overflow-hidden p-1.5 border border-white/5 shadow-inner">
                    <button 
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, tablesBooked: Math.max(1, (prev.tablesBooked || 1) - 1) }))}
                      className="w-10 h-10 flex-shrink-0 flex items-center justify-center hover:bg-white/10 active:bg-white/20 transition-all text-white font-bold rounded-xl"
                    >
                      -
                    </button>
                    <input type="text" value={formData.tablesBooked || 1} readOnly
                      className="w-14 flex-shrink-0 bg-transparent text-center outline-none text-white font-black text-2xl"
                    />
                    <button 
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, tablesBooked: Math.min(restaurant.availableTables || 20, (prev.tablesBooked || 1) + 1) }))}
                      className="w-10 h-10 flex-shrink-0 flex items-center justify-center hover:bg-white/10 active:bg-white/20 transition-all text-white font-bold rounded-xl"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <button 
                disabled={loading} 
                className="group relative w-full mt-8 py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] overflow-hidden transition-all shadow-[0_20px_40px_rgba(192,38,211,0.2)] hover:shadow-[0_20px_60px_rgba(192,38,211,0.4)] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-600 via-purple-600 to-indigo-600 transition-all duration-500 group-hover:scale-110"></div>
                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                {/* Shimmer effect */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

                <span className="relative z-10 flex items-center justify-center gap-3">
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      Confirm & Pay via WhatsApp
                      <ChevronRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </span>
              </button>
              
              <div className="flex items-center justify-center gap-2 pt-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
                  Secure End-to-End Encrypted Checkout
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

