import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Hero from './components/Hero';
import ExperienceFeed from './components/ExperienceFeed';
import BookingModal from './components/BookingModal';
import AdminDashboard from './components/AdminDashboard';
import AdminLogin from './components/AdminLogin';
import Projects from './components/Projects';
import About from './components/About';
import Contact from './components/Contact';
import FloatingBookButton from './components/FloatingBookButton';

// ── Footer (quiet end of page) ────────────────────────────────────────────
const Footer = () => (
  <footer className="border-t border-ink-300/60 mt-12">
    <div className="max-w-5xl mx-auto px-6 py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-sm">
      <p className="text-ink-600 font-mono text-xs tracking-wider">
        © {new Date().getFullYear()} ZAIN AL-SAFFI · BRISBANE, QLD
      </p>
      <p className="text-ink-600 font-mono text-xs tracking-wider">
        DESIGNED &amp; BUILT BY HAND · v3
      </p>
    </div>
  </footer>
);

// ── Main portfolio page ───────────────────────────────────────────────────
const PortfolioPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal  = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-ink-0 text-ink-900 relative">

      <main className="relative z-10">
        <section><Hero onOpenBooking={openModal} /></section>
        <section><About /></section>
        <section><ExperienceFeed /></section>
        <section><Projects /></section>
        <section><Contact onOpenBooking={openModal} /></section>
      </main>

      <Footer />

      <FloatingBookButton onClick={openModal} />

      <BookingModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
};

// ── App router ────────────────────────────────────────────────────────────
function App() {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() =>
    localStorage.getItem("carbon_admin_auth") === "true"
  );

  const handleLogin = (status) => {
    setIsAdminLoggedIn(status);
    if (status) localStorage.setItem("carbon_admin_auth", "true");
    else        localStorage.removeItem("carbon_admin_auth");
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<PortfolioPage />} />
        <Route
          path="/login"
          element={
            isAdminLoggedIn
              ? <Navigate to="/admin" replace />
              : <AdminLogin onLogin={() => handleLogin(true)} />
          }
        />
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
