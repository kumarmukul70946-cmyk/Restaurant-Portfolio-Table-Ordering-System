import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { MessageCircle, X } from 'lucide-react';

const socket = io('http://localhost:5000'); 

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [lang, setLang] = useState('en'); // 'en' or 'hi'
  const messagesEndRef = useRef(null);

  useEffect(() => {
    socket.on('receive_message', (data) => {
      setMessages((prev) => [...prev, data]);
    });
    return () => socket.off('receive_message'); 
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (e, customText = null) => {
    if (e) e.preventDefault();
    const textToSend = customText || message;
    
    if (textToSend.trim()) {
      const msgData = {
        sender: 'You',
        text: textToSend,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        lang: lang
      };
      socket.emit('send_message', msgData); 
      setMessages((prev) => [...prev, msgData]);
      if (!customText) setMessage(''); 
    }
  };

  const quickOptionsEn = [
    "How does the booking process work?",
    "Do you offer purely vegetarian restaurants?",
    "What is the payment method?",
    "What if I need to cancel my reservation?",
    "Is there a specific dress code?",
    "Contact emergency support"
  ];

  const quickOptionsHi = [
    "टेबल बुक करने की प्रक्रिया क्या है?",
    "क्या आपके पास शुद्ध शाकाहारी रेस्टोरेंट हैं?",
    "भुगतान की विधि क्या है?",
    "बुकिंग कैसे कैंसिल करें?",
    "क्या कोई खास ड्रेस कोड है?",
    "सपोर्ट से संपर्क करें"
  ];

  const currentOptions = lang === 'en' ? quickOptionsEn : quickOptionsHi;

  return (
    <>
      <button 
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 p-4 rounded-full bg-black/40 backdrop-blur-xl border border-white/20 text-white shadow-[0_0_30px_rgba(217,70,239,0.5)] hover:shadow-[0_0_50px_rgba(217,70,239,0.8)] hover:scale-110 active:scale-95 transition-all z-50 flex items-center justify-center overflow-hidden group"
      >
        <div className="absolute inset-0 rounded-full animate-pulse border-2 border-fuchsia-500/50"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500 via-fuchsia-600 to-indigo-600 opacity-80 group-hover:opacity-100 transition-opacity"></div>
        <div className="relative z-10">
          {open ? <X size={26} strokeWidth={2.5}/> : <MessageCircle size={28} strokeWidth={2.5}/>}
        </div>
      </button>

      <div className={`fixed bottom-28 right-6 w-[340px] md:w-[380px] bg-[#0a0a0c]/80 backdrop-blur-3xl rounded-[2rem] shadow-[0_20px_60px_rgba(0,0,0,0.8)] border border-white/10 overflow-hidden z-40 flex flex-col h-[550px] transition-all duration-500 ease-out transform origin-bottom-right ${open ? 'scale-100 opacity-100 translate-y-0' : 'scale-50 opacity-0 pointer-events-none translate-y-10'}`}>
        
        {/* Header */}
        <div className="relative p-5 shadow-md flex items-center justify-between overflow-hidden border-b border-white/5 bg-black/40 backdrop-blur-md">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 via-fuchsia-600/20 to-indigo-600/20"></div>
          <div className="relative z-10 flex flex-1 items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-12 h-12 rounded-full border border-fuchsia-500/30 flex items-center justify-center shadow-inner overflow-hidden bg-black/60">
                  <img src="/logo.png" alt="Zaika" className="w-8 h-8 object-contain drop-shadow-md" />
                </div>
                <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-[#121216] animate-pulse"></div>
              </div>
              <div>
                <h3 className="font-black text-lg shadow-none outline-none tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-amber-300 via-yellow-500 to-fuchsia-400">
                  Zaika Concierge
                </h3>
                <p className="text-amber-200/80 text-[10px] md:text-xs font-medium uppercase tracking-wider">
                  {lang === 'en' ? 'Online Support' : 'ऑनलाइन सहायता'}
                </p>
              </div>
            </div>
            {/* Language Toggle */}
            <div className="flex bg-black/50 border border-white/10 rounded-full p-1 shadow-inner">
              <button 
                onClick={() => setLang('en')} 
                className={`text-[10px] font-bold px-2 py-1 rounded-full transition-colors ${lang === 'en' ? 'bg-fuchsia-500 text-white shadow-md' : 'text-neutral-500 hover:text-neutral-300'}`}
              >
                EN
              </button>
              <button 
                onClick={() => setLang('hi')} 
                className={`text-[10px] font-bold px-2 py-1 rounded-full transition-colors ${lang === 'hi' ? 'bg-fuchsia-500 text-white shadow-md' : 'text-neutral-500 hover:text-neutral-300'}`}
              >
                HI
              </button>
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          <div className="self-start text-sm w-full">
            <div className="bg-white/10 backdrop-blur-md border border-white/5 p-3.5 rounded-2xl rounded-tl-sm max-w-[90%] text-neutral-200 leading-relaxed shadow-lg">
              {lang === 'en' 
                ? "Welcome to Zaika! 🥂 I am your virtual assistant. You can ask me anything or choose from the options below:"
                : "ज़ायका में आपका स्वागत है! 🥂 मैं आपका वर्चुअल असिस्टेंट हूँ। आप मुझसे कुछ भी पूछ सकते हैं या नीचे दिए गए विकल्पों में से चुन सकते हैं:"}
            </div>
            
            {/* Quick Actions */}
            {messages.length === 0 && (
              <div className="mt-3 flex flex-wrap gap-2 animate-in slide-in-from-left-2 duration-500">
                {currentOptions.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => sendMessage(null, opt)}
                    className="bg-white/5 hover:bg-white/10 border border-white/10 text-amber-200/90 text-[11px] px-3 py-1.5 rounded-full transition-colors font-medium tracking-wide text-left"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
            
            <span className="text-[10px] text-neutral-500 mt-1.5 px-2 block">12:00 PM</span>
          </div>
          
          {messages.map((msg, i) => (
            <div key={i} className={`flex flex-col ${msg.sender === 'You' ? 'items-end' : 'items-start'} animate-in zoom-in-95 duration-200`}>
              <div className={`p-3.5 rounded-2xl max-w-[85%] text-sm shadow-lg leading-relaxed ${
                msg.sender === 'You' 
                ? 'bg-gradient-to-br from-amber-500 via-fuchsia-600 to-indigo-600 text-white rounded-br-sm border border-fuchsia-400/30' 
                : 'bg-white/10 backdrop-blur-md border border-white/5 text-neutral-200 rounded-tl-sm'
              }`}>
                {msg.text}
              </div>
              <span className="text-[10px] text-neutral-500 mt-1.5 px-2 font-medium">{msg.time}</span>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <form onSubmit={sendMessage} className="p-4 bg-black/40 border-t border-white/10 backdrop-blur-xl flex items-center gap-3">
          <input 
            type="text" 
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={lang === 'en' ? "Type your request..." : "अपना संदेश लिखें..."}
            className="flex-1 bg-white/5 px-4 py-3.5 rounded-2xl outline-none text-white text-sm focus:bg-white/10 transition-colors border border-white/10 placeholder-neutral-500"
          />
          <button 
            type="submit" 
            className={`p-3.5 rounded-2xl transition-all flex items-center justify-center ${message.trim() ? 'bg-gradient-to-r from-fuchsia-500 to-indigo-500 text-white shadow-[0_0_20px_rgba(217,70,239,0.4)] hover:scale-105 active:scale-95 cursor-pointer' : 'bg-white/5 text-neutral-600 cursor-not-allowed border border-white/5'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 ml-1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
            </svg>
          </button>
        </form>
      </div>
    </>
  );
}
