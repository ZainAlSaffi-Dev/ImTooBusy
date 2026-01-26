import React from 'react';
import { Terminal, Calendar, User, Code, Settings } from 'lucide-react';

const Navbar = ({ onOpenBooking }) => {
    return (
        <nav className="fixed top-0 left-0 w-full z-50 border-b border-white/10 bg-carbon-bg/80 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

                {/* Logo */}
                <div className="flex items-center gap-2">
                    <Terminal className="text-carbon-primary w-6 h-6" />
                    <span className="text-xl font-bold tracking-widest italic bg-clip-text text-transparent bg-gradient-to-r from-carbon-primary to-white">
                    ZAIN AL-SAFFI
                    </span>
                </div>

                {/* Navigation Links (The HUD Buttons) */}
                <div className="hidden md:flex items-center gap-8">
                <NavLink icon={<Code size={18} />} text="PROJECTS" />
                <NavLink icon={<User size={18} />} text="ABOUT" />
                
                {/* The "Book" Button - distinct style */}
                <button 
                    onClick={onOpenBooking}
                    className="flex items-center gap-2 bg-carbon-primary/10 border border-carbon-primary/50 px-4 py-2 rounded text-carbon-primary font-bold text-sm hover:bg-carbon-primary hover:text-black transition-all duration-300">
                    <Calendar size={16} />
                    <span>INIT_MEETING

                    </span>
                </button>
                </div>

            </div>
        </nav>


    )
}

// A helper sub-component for the simple links
const NavLink = ({ icon, text }) => (
    <a href="#" className="flex items-center gap-2 text-carbon-text/70 hover:text-carbon-primary transition-colors text-sm font-medium tracking-wide">
      {icon}
      <span>{text}</span>
    </a>
  );
  
export default Navbar;
