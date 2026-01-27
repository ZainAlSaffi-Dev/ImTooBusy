import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';

const TerminalGate = ({ onUnlock }) => {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { amount: 0.5, once: true });
  const [status, setStatus] = useState('waiting'); // waiting -> locked -> typing -> success -> unlocked

  useEffect(() => {
    if (isInView && status === 'waiting') {
      // 1. Lock Scroll
      document.body.style.overflow = 'hidden';
      setStatus('locked');
      
      // 2. Start Typing after brief pause
      setTimeout(() => setStatus('typing'), 500);
    }
  }, [isInView, status]);

  const handleSequenceComplete = () => {
    setStatus('success');
    
    // 3. Unlock after "Access Granted" message
    setTimeout(() => {
      document.body.style.overflow = 'auto';
      setStatus('unlocked');
      onUnlock(); // <--- This triggers the About Section reveal
    }, 1500);
  };

  return (
    <section ref={containerRef} className="py-24 bg-black flex flex-col items-center justify-center relative z-20">
       
       <motion.div 
         initial={{ opacity: 0, scale: 0.9 }}
         animate={isInView ? { opacity: 1, scale: 1 } : {}}
         transition={{ duration: 0.5 }}
         className="w-full max-w-2xl px-6"
       >
          <div className="bg-[#0c0c0c] border border-white/10 rounded-lg overflow-hidden shadow-2xl font-mono text-sm relative">
             
             {/* Terminal Header */}
             <div className="bg-white/5 p-3 flex items-center gap-2 border-b border-white/5">
                <div className="flex gap-2">
                   <div className="w-3 h-3 rounded-full bg-red-500/50" />
                   <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                   <div className="w-3 h-3 rounded-full bg-green-500/50" />
                </div>
                <div className="ml-auto text-xs text-gray-500 opacity-50">zsh — admin@carbon</div>
             </div>

             {/* Terminal Body */}
             <div className="p-6 h-40 flex flex-col justify-center">
                <div className="flex flex-col gap-2">
                   
                   {/* Line 1: The Command */}
                   {(status === 'typing' || status === 'success' || status === 'unlocked') && (
                     <div className="flex items-center gap-3 text-gray-300">
                        <span className="text-green-400 font-bold">➜</span>
                        <span className="text-blue-400 font-bold">~</span>
                        <TypeAnimation
                           sequence={[
                              'whois zain_al_saffi',
                              800, 
                              () => handleSequenceComplete()
                           ]}
                           wrapper="span"
                           cursor={false}
                           speed={60}
                           className="text-white font-bold"
                        />
                     </div>
                   )}

                   {/* Line 2: The Success Message */}
                   {(status === 'success' || status === 'unlocked') && (
                     <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-green-500 mt-2 font-bold"
                     >
                        {'>'} IDENTITY VERIFIED. LOADING PROFILE...
                     </motion.div>
                   )}

                   {/* Blinking Cursor (When waiting) */}
                   {status === 'waiting' && (
                     <div className="flex items-center gap-3">
                        <span className="text-green-400 font-bold">➜</span>
                        <span className="text-blue-400 font-bold">~</span>
                        <span className="w-2 h-5 bg-white animate-pulse" />
                     </div>
                   )}
                </div>
             </div>
          </div>

          <p className="text-center text-gray-600 text-xs mt-6 tracking-widest uppercase animate-pulse">
             {status === 'unlocked' ? "Scroll Down" : "System Processing..."}
          </p>
       </motion.div>
    </section>
  );
};

export default TerminalGate;