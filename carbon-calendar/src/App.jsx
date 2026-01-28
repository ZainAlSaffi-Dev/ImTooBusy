import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react'; // <--- Added useEffect
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ExperienceFeed from './components/ExperienceFeed';
import BookingModal from './components/BookingModal';
import AdminDashboard from './components/AdminDashboard';
import AdminLogin from './components/AdminLogin'; 
import TerminalGate from './components/TerminalGate';
import Projects from './components/Projects'; 
import About from './components/About';      
import Contact from './components/Contact';

// Simple Footer Component
const Footer = () => (
  <footer className="py-8 border-t border-white/10 bg-black text-center text-gray-600 font-mono text-sm">
    <p>CARBON SYSTEM // ZAIN_AL_SAFFI © 2026</p>
    <p className="text-xs mt-2">Running on Railway // Built with React</p>
  </footer>
);

// --- THE MAIN PORTFOLIO PAGE ---
const PortfolioPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAboutUnlocked, setIsAboutUnlocked] = useState(false); 

  // --- NEW LOGIC: FORCE SCROLL TO TOP ON REFRESH ---
  useEffect(() => {
    // 1. Tell the browser NOT to restore the scroll position automatically
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    // 2. Force the window to the very top immediately
    window.scrollTo(0, 0);

    // Optional: Clean up by restoring default behavior when leaving (not strictly necessary for this app)
    return () => {
      if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'auto';
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-purple-500/30 selection:text-purple-200">
      
      <Navbar onOpenBooking={() => setIsModalOpen(true)} />
      
      <main className="relative">
        
        {/* 1. HERO */}
        <div id="home">
          <Hero />
        </div>

        {/* 2. THE TERMINAL GATE */}
        <div className="relative z-30 bg-black">
           <TerminalGate onUnlock={() => setIsAboutUnlocked(true)} />
        </div>

        {/* 3. ABOUT SECTION */}
        <div id="about" className="relative z-20 bg-[#050505]">
           <About isUnlocked={isAboutUnlocked} />
        </div>

        {/* 4. EXPERIENCE FEED */}
        <div id="experience" className="relative z-10 bg-black">
           <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent my-12" />
           <ExperienceFeed />
        </div>

        {/* 5. PROJECTS */}
        <div id="projects" className="relative z-10 bg-[#080808]">
            <div className="h-px w-full bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />
            <Projects />
        </div>

        {/* 6. CONTACT */}
        <div id="contact" className="relative z-10 bg-black">
            <div className="h-px w-full bg-gradient-to-r from-transparent via-[#0A66C2]/30 to-transparent" />
            <Contact />
        </div>

      </main>

      <Footer />

      <BookingModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
};

// --- MAIN APP ROUTER ---
function App() {
  // Initialize state from localStorage so you stay logged in on refresh
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
      return localStorage.getItem("carbon_admin_auth") === "true";
  });

  // Handler to set login state AND save it
  const handleLogin = (status) => {
      setIsAdminLoggedIn(status);
      if (status) {
          localStorage.setItem("carbon_admin_auth", "true");
      } else {
          localStorage.removeItem("carbon_admin_auth");
      }
  };

  return (
    <Router>
      <Routes>
        {/* Public Route: The Portfolio */}
        <Route path="/" element={<PortfolioPage />} />
        
        {/* Login Route: Redirect to /admin if already logged in */}
        <Route 
          path="/login" 
          element={
            isAdminLoggedIn 
              ? <Navigate to="/admin" replace /> 
              : <AdminLogin onLogin={() => handleLogin(true)} />
          } 
        />
        
        {/* Admin Route: Protected */}
        <Route 
          path="/admin" 
          element={
            isAdminLoggedIn 
              ? <AdminDashboard /> 
              : <Navigate to="/login" replace />
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;