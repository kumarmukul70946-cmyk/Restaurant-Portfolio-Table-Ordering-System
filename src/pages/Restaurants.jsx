import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Restaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [filterDiet, setFilterDiet] = useState('All'); 
  const [filterCuisine, setFilterCuisine] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortPrice, setSortPrice] = useState('Default'); 
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:5000/api/restaurants')
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.data)) {
          setRestaurants(data.data);
        } else if (Array.isArray(data)) {
          setRestaurants(data);
        } else {
          setRestaurants([]);
          setError("Invalid data format received");
        }
      })
      .catch(err => {
        console.error("Error fetching restaurants", err);
        setError("Failed to connect to server");
      });
  }, []);

  // Compute filtered and sorted restaurants
  let processedRestaurants = [...restaurants];
  
  if (filterDiet !== 'All') {
    processedRestaurants = processedRestaurants.filter(r => r.diet === filterDiet);
  }

  if (filterCuisine !== 'All') {
    processedRestaurants = processedRestaurants.filter(r => 
      (r.cuisineTags && r.cuisineTags.some(tag => tag.includes(filterCuisine))) || 
      (r.cuisine && r.cuisine.includes(filterCuisine))
    );
  }

  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    processedRestaurants = processedRestaurants.filter(r => 
      r.name.toLowerCase().includes(q) || 
      (r.cuisineTags && r.cuisineTags.some(tag => tag.toLowerCase().includes(q))) ||
      (r.description && r.description.toLowerCase().includes(q))
    );
  }

  if (sortPrice !== 'Default') {
    processedRestaurants.sort((a, b) => {
      const priceA = parseInt((a.priceForTwo || "₹2000").replace(/\D/g, '')) || 0;
      const priceB = parseInt((b.priceForTwo || "₹2000").replace(/\D/g, '')) || 0;
      return sortPrice === 'Low to High' ? priceA - priceB : priceB - priceA;
    });
  }

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-neutral-100 font-sans relative overflow-hidden">
      {/* Background glow effects - optimized for performance */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-fuchsia-600/10 rounded-full opacity-30 pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-purple-600/10 rounded-full opacity-30 pointer-events-none"></div>

      {/* Hero Section */}
      <div className="relative pt-32 pb-20 px-6 text-center z-10">
        <div className="inline-block py-1 px-3 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-6 text-sm font-medium text-purple-300">
          ✨ Premium Dining Experiences
        </div>
        <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter">
          Reserve Your Table at <br className="hidden md:block"/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 via-purple-400 to-indigo-400">
            iconic destinations.
          </span>
        </h1>
        <p className="text-neutral-400 max-w-2xl mx-auto text-lg md:text-xl font-light">
          Discover India's most luxurious restaurants, from seaside fine dining in Mumbai to authentic heritage spots in New Delhi.
        </p>
      </div>

      {/* Grid Section */}
      <div className="max-w-7xl mx-auto px-6 pb-32 relative z-10">
        
        {/* Search Bar */}
        <div className="relative mb-8 max-w-2xl mx-auto">
          <input 
            type="text" 
            placeholder="Search restaurants, cuisines, or locations..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 backdrop-blur-xl py-4 px-12 rounded-2xl outline-none focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500 transition-all text-lg"
          />
          <svg className="w-6 h-6 absolute left-4 top-4 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        
        {/* Filters and Sorting Controls */}
        <div className="flex flex-col lg:flex-row justify-between items-center bg-white/5 border border-white/10 backdrop-blur-md p-4 rounded-2xl mb-10 gap-6">
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-neutral-400 uppercase tracking-wider">Diet:</span>
              <div className="flex bg-black/40 p-1 rounded-xl">
                {['All', 'Veg', 'Non-Veg'].map(type => (
                  <button
                    key={type}
                    onClick={() => setFilterDiet(type)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filterDiet === type ? 'bg-fuchsia-500 text-white shadow-lg' : 'text-neutral-400 hover:text-white'}`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-neutral-400 uppercase tracking-wider">Cuisine:</span>
              <select 
                value={filterCuisine}
                onChange={(e) => setFilterCuisine(e.target.value)}
                className="bg-black/40 border border-white/10 text-white text-sm rounded-xl px-4 py-2.5 outline-none focus:border-fuchsia-500 transition-all cursor-pointer min-w-[140px]"
              >
                <option value="All">All Cuisines</option>
                <option value="Indian">Indian</option>
                <option value="North Indian">North Indian</option>
                <option value="South Indian">South Indian</option>
                <option value="Seafood">Seafood</option>
                <option value="Continental">Continental</option>
                <option value="Italian">Italian</option>
              </select>
            </div>
          </div>
          
          <div className="flex items-center gap-3 w-full lg:w-auto">
            <span className="text-sm font-semibold text-neutral-400 uppercase tracking-wider">Sort:</span>
            <select 
              value={sortPrice}
              onChange={(e) => setSortPrice(e.target.value)}
              className="bg-black/40 border border-white/10 text-white text-sm rounded-xl px-4 py-2.5 outline-none focus:border-fuchsia-500 transition-all cursor-pointer flex-1 lg:min-w-[160px]"
            >
              <option value="Default">Default</option>
              <option value="Low to High">Price: Low to High</option>
              <option value="High to Low">Price: High to Low</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {processedRestaurants.map((r) => (
            <div 
              key={r._id} 
              className="group relative bg-[#121215] border border-white/5 rounded-3xl overflow-hidden shadow-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(192,38,211,0.15)] hover:border-fuchsia-500/30 flex flex-col"
            >
              <div className="relative h-64 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] to-transparent z-10 opacity-80 group-hover:opacity-60 transition-opacity duration-500"></div>
                <img 
                  loading="lazy"
                  decoding="async"
                  src={(r.image?.url || r.image)?.includes('unsplash.com') ? `${r.image?.url || r.image}?auto=format&fit=crop&w=800&q=80` : ((r.image?.url || r.image) || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4")} 
                  alt={r.name} 
                  onError={(e) => { e.target.onerror = null; e.target.src = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80" }}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500 ease-out bg-neutral-900"
                  style={{ willChange: 'transform' }}
                />
                <div className="absolute top-4 left-4 z-20 flex gap-2">
                  <span className="bg-black/50 backdrop-blur-md border border-white/10 text-xs px-3 py-1.5 rounded-full font-medium tracking-wide">
                    {r.city || r.location?.split(',')[0] || 'City'}
                  </span>
                  {r.diet && r.diet !== 'Both' && (
                    <span className={`backdrop-blur-md border border-white/10 text-xs px-3 py-1.5 rounded-full font-bold tracking-wide ${r.diet === 'Veg' ? 'bg-emerald-500/80 text-white' : 'bg-rose-500/80 text-white'}`}>
                      {r.diet}
                    </span>
                  )}
                </div>
              </div>

              <div className="p-8 flex flex-col flex-1 transform -translate-y-6 relative z-20">
                <div className="bg-[#121216] border border-white/10 p-4 rounded-2xl shadow-xl flex justify-between items-center mb-6">
                  <div>
                    <p className="text-xs text-neutral-400 uppercase tracking-wider mb-1">Cuisine</p>
                    <p className="font-semibold text-fuchsia-300 text-sm truncate w-32">{r.cuisine || r.cuisineTags?.[0] || 'Various'}</p>
                  </div>
                  <div className="w-px h-8 bg-white/10"></div>
                  <div className="text-right">
                    <p className="text-xs text-neutral-400 uppercase tracking-wider mb-1">Cost for Two</p>
                    <p className="font-semibold text-white text-sm">{r.priceForTwo || '₹2000'}</p>
                  </div>
                </div>

                <h2 className="text-3xl font-bold mb-3 tracking-tight">{r.name}</h2>
                <p className="text-neutral-400 text-sm leading-relaxed mb-6 flex-1">
                  {r.description}
                </p>

                <div className="flex justify-between items-center mb-6 px-1">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                    <span className="text-sm font-medium text-neutral-300">
                      <span className="text-white">{r.availableTables}</span> tables left today
                    </span>
                  </div>
                </div>

                <button 
                  onClick={() => navigate(`/book/${r._id}`)}
                  className="relative w-full overflow-hidden rounded-xl p-[1px] group/btn"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-fuchsia-500 via-purple-500 to-indigo-500 rounded-xl opacity-70 group-hover/btn:opacity-100 transition-opacity duration-300"></span>
                  <div className="relative bg-[#0a0a0c] px-4 py-3.5 rounded-xl transition-all duration-300 group-hover/btn:bg-opacity-0">
                    <span className="relative z-10 font-semibold text-white group-hover/btn:text-white transition-colors flex items-center justify-center gap-2">
                      Make a Reservation
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transform group-hover/btn:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </span>
                  </div>
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {error && (
          <div className="flex flex-col items-center justify-center p-20 text-rose-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-xl font-medium">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-6 px-6 py-2 bg-white/10 hover:bg-white/20 rounded-full text-sm transition-all"
            >
              Try Again
            </button>
          </div>
        )}

        {!error && restaurants.length === 0 && (
          <div className="flex items-center justify-center p-20">
            <div className="w-8 h-8 rounded-full border-t-2 border-r-2 border-fuchsia-500 animate-spin"></div>
          </div>
        )}

        {!error && restaurants.length > 0 && processedRestaurants.length === 0 && (
          <div className="flex flex-col items-center justify-center p-20 text-neutral-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-xl font-medium">No restaurants found.</p>
            <p className="text-sm mt-2">Try changing your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
