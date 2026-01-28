import React from 'react';
import { Terminal, Calendar, User, Code, Linkedin } from 'lucide-react';

const Navbar = ({ onOpenBooking }) => {
    
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <nav className="fixed top-0 left-0 w-full z-50 border-b border-white/10 bg-carbon-bg/80 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

                {/* Logo Area */}
                <button 
                    onClick={scrollToTop} 
                    className="flex items-center gap-2 group cursor-pointer focus:outline-none"
                >
                    <div className="p-1 rounded group-hover:bg-carbon-primary/10 transition-colors">
                        <Terminal className="text-carbon-primary w-6 h-6 group-hover:shadow-[0_0_15px_rgba(168,85,247,0.5)] transition-all" />
                    </div>
                </button>

                {/* --- DESKTOP MENU (Hidden on Mobile) --- */}
                <div className="hidden md:flex items-center gap-8">
                    <a href="#projects" className="flex items-center gap-2 text-carbon-text/70 hover:text-carbon-primary transition-colors text-sm font-medium tracking-wide">
                        <Code size={18} />
                        <span>PROJECTS</span>
                    </a>
                    <a href="#about" className="flex items-center gap-2 text-carbon-text/70 hover:text-carbon-primary transition-colors text-sm font-medium tracking-wide">
                        <User size={18} />
                        <span>ABOUT</span>
                    </a>
                    <a href="#contact" className="flex items-center gap-2 text-carbon-text/70 hover:text-[#0A66C2] transition-colors text-sm font-medium tracking-wide">
                        <Linkedin size={18} />
                        <span>CONTACT</span>
                    </a>
                    
                    <button 
                        onClick={onOpenBooking}
                        className="flex items-center gap-2 bg-carbon-primary/10 border border-carbon-primary/50 px-4 py-2 rounded text-carbon-primary font-bold text-sm hover:bg-carbon-primary hover:text-black transition-all duration-300 hover:shadow-[0_0_20px_rgba(168,85,247,0.4)]">
                        <Calendar size={16} />
                        <span>BOOK AN APPOINTMENT</span>
                    </button>
                </div>

                {/* --- MOBILE MENU BUTTON (Visible ONLY on Mobile) --- */}
                <div className="flex md:hidden items-center gap-2">
                    {/* Contact Link for Mobile */}
                    <a 
                        href="#contact"
                        className="p-2 rounded border border-[#0A66C2]/30 text-[#0A66C2] hover:bg-[#0A66C2]/20 transition-all"
                    >
                        <Linkedin size={18} />
                    </a>
                    {/* Compact Booking Button for Mobile */}
                    <button 
                        onClick={onOpenBooking}
                        className="flex items-center gap-2 bg-carbon-primary/20 border border-carbon-primary/50 px-3 py-2 rounded text-carbon-primary text-xs font-bold hover:bg-carbon-primary hover:text-black transition-all">
                        <Calendar size={16} />
                        <span>BOOK</span>
                    </button>
                </div>

            </div>
        </nav>
    )
}
  
export default Navbar;