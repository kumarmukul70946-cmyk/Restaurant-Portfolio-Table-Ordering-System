import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-[#0a0a0c] border-t border-white/10 pt-16 pb-8 relative z-10 w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-20">
        
        {/* Brand and Connect Info */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <img 
              src="/logo.png" 
              alt="Zaika" 
              className="h-10 w-auto object-contain rounded-full shadow-[0_0_15px_rgba(217,70,239,0.3)]" 
            />
            <h2 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-amber-300 via-yellow-500 to-fuchsia-500 tracking-widest">
              ZAIKA
            </h2>
          </div>
          <p className="text-neutral-400 text-sm leading-relaxed">
            Experience the ultimate luxury dining with Zaika. We bring the finest Indian and global cuisines right to your table, with seamless bookings and automated WhatsApp assistance.
          </p>
          <div className="flex gap-4">
            <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-neutral-400 hover:text-fuchsia-500 hover:border-fuchsia-500 hover:shadow-[0_0_15px_rgba(217,70,239,0.3)] transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16"><path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334q.002-.211-.006-.422A6.7 6.7 0 0 0 16 3.542a6.7 6.7 0 0 1-1.889.518 3.3 3.3 0 0 0 1.447-1.817 6.5 6.5 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.32 9.32 0 0 1-6.767-3.429 3.29 3.29 0 0 0 1.018 4.382A3.3 3.3 0 0 1 .64 6.575v.045a3.29 3.29 0 0 0 2.632 3.218 3.2 3.2 0 0 1-.865.115 3 3 0 0 1-.614-.057 3.28 3.28 0 0 0 3.067 2.277A6.6 6.6 0 0 1 .78 13.58a6 6 0 0 1-.78-.045A9.34 9.34 0 0 0 5.026 15"/></svg>
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-neutral-400 hover:text-fuchsia-500 hover:border-fuchsia-500 hover:shadow-[0_0_15px_rgba(217,70,239,0.3)] transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16"><path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.9 3.9 0 0 0-1.417.923A3.9 3.9 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.9 3.9 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.9 3.9 0 0 0-.923-1.417A3.9 3.9 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.036 1.204.166 1.486.275.373.145.64.319.92.599s.453.546.598.92c.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.5 2.5 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.5 2.5 0 0 1-.92-.598 2.5 2.5 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233s.008-2.388.046-3.231c.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92s.546-.453.92-.598c.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92m-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217m0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334"/></svg>
            </a>
          </div>
        </div>

        {/* Requirements & Contact */}
        <div className="space-y-6 md:pl-8">
          <h3 className="text-xl font-bold text-white tracking-wide relative inline-block">
            Connect With Us
            <div className="absolute -bottom-2 left-0 w-1/2 h-1 bg-fuchsia-500 rounded-full"></div>
          </h3>
          <ul className="text-neutral-400 space-y-4 text-sm">
            <li className="flex gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-fuchsia-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>15, Corporate Road, Alkapuri<br/>Vadodara, Gujarat 390007<br/>India</span>
            </li>
            <li className="flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-fuchsia-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span>+91 98765 43210</span>
            </li>
            <li className="flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-fuchsia-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>rs2114446@gmail.com</span>
            </li>
          </ul>
        </div>

        {/* Google Map of Vadodara */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-white tracking-wide relative inline-block">
            Our Location
            <div className="absolute -bottom-2 left-0 w-1/2 h-1 bg-fuchsia-500 rounded-full"></div>
          </h3>
          <div className="w-full h-48 rounded-2xl overflow-hidden border border-white/10 shadow-lg relative group">
            <div className="absolute inset-0 bg-fuchsia-500/10 pointer-events-none group-hover:bg-transparent transition-colors z-10"></div>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d118106.70010221669!2d73.17308625!3d22.3071588!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395fc8ab91a3ddab%3A0xac39d3bfe1473fb8!2sVadodara%2C%20Gujarat!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
              title="Zaika Vadodara Location"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="grayscale hover:grayscale-0 transition-all duration-500"
            ></iframe>
          </div>
        </div>

      </div>

      {/* Copyright Bar */}
      <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-white/10 text-center text-xs text-neutral-500 flex flex-col md:flex-row justify-between items-center">
        <p>&copy; {new Date().getFullYear()} Zaika Fine Dining. All rights reserved.</p>
        <div className="flex gap-4 mt-4 md:mt-0">
          <a href="#" className="hover:text-fuchsia-400 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-fuchsia-400 transition-colors">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}
