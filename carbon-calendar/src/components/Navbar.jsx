import React from 'react';
import { Terminal, Calendar, User, Code } from 'lucide-react';

const Navbar = ({ onOpenBooking }) => {
    
    // Function to handle "Go Home"
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <nav className="fixed top-0 left-0 w-full z-50 border-b border-white/10 bg-carbon-bg/80 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

                {/* Logo Area - NOW CLICKABLE */}
                <button 
                    onClick={scrollToTop} 
                    className="flex items-center gap-2 group cursor-pointer focus:outline-none"
                >
                    <div className="p-1 rounded group-hover:bg-carbon-primary/10 transition-colors">
                        <Terminal className="text-carbon-primary w-6 h-6 group-hover:shadow-[0_0_15px_rgba(168,85,247,0.5)] transition-all" />
                    </div>
                    <span className="text-xl font-bold tracking-widest italic bg-clip-text text-transparent bg-gradient-to-r from-carbon-primary to-white group-hover:to-carbon-primary transition-all">
                        
                    </span>
                </button>

                {/* Navigation Links (The HUD Buttons) */}
                <div className="hidden md:flex items-center gap-8">
                    <NavLink icon={<Code size={18} />} text="PROJECTS" />
                    <NavLink icon={<User size={18} />} text="ABOUT" />
                    
                    {/* The "Book" Button */}
                    <button 
                        onClick={onOpenBooking}
                        className="flex items-center gap-2 bg-carbon-primary/10 border border-carbon-primary/50 px-4 py-2 rounded text-carbon-primary font-bold text-sm hover:bg-carbon-primary hover:text-black transition-all duration-300 hover:shadow-[0_0_20px_rgba(168,85,247,0.4)]">
                        <Calendar size={16} />
                        <span>INIT_MEETING</span>
                    </button>
                </div>

            </div>
        </nav>
    )
}

// Helper for simple links
const NavLink = ({ icon, text }) => (
    <a href="#" className="flex items-center gap-2 text-carbon-text/70 hover:text-carbon-primary transition-colors text-sm font-medium tracking-wide">
      {icon}
      <span>{text}</span>
    </a>
);
  
export default Navbar;