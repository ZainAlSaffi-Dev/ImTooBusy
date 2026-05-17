import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ExperienceFeed from './components/ExperienceFeed';
import BookingModal from './components/BookingModal';
import AdminDashboard from './components/AdminDashboard';
import AdminLogin from './components/AdminLogin';
import Projects from './components/Projects';
import About from './components/About';
import Contact from './components/Contact';

// ── Footer ────────────────────────────────────────────────────────────────
const Footer = () => (
  <footer className="border-t border-ink-300/60 mt-24">
    <div className="max-w-5xl mx-auto px-6 py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-sm">
      <p className="text-ink-600 font-mono text-xs tracking-wider">
        © {new Date().getFullYear()} ZAIN AL-SAFFI · BRISBANE, QLD
      </p>
      <p className="text-ink-600 font-mono text-xs tracking-wider">
        DESIGNED &amp; BUILT BY HAND · v2
      </p>
    </div>
  </footer>
);

// ── Main portfolio page ───────────────────────────────────────────────────
const PortfolioPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-ink-0 text-ink-900 relative">
      <Navbar onOpenBooking={() => setIsModalOpen(true)} />

      <main className="relative z-10">
        <section id="home">
          <Hero onOpenBooking={() => setIsModalOpen(true)} />
        </section>

        <section id="work">
          <ExperienceFeed />
        </section>

        <section id="projects">
          <Projects />
        </section>

        <section id="about">
          <About />
        </section>

        <section id="contact">
          <Contact onOpenBooking={() => setIsModalOpen(true)} />
        </section>
      </main>

      <Footer />

      <BookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
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
