import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ExperienceFeed from './components/ExperienceFeed';
import BookingModal from './components/BookingModal';
import AdminDashboard from './components/AdminDashboard'; // Import New Page

// Create a component for the Main Page content to keep App clean
const PortfolioPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <>
      <Navbar onOpenBooking={() => setIsModalOpen(true)} />
      <main>
        <Hero />
        <ExperienceFeed />
      </main>
      <BookingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-carbon-bg text-carbon-text font-sans selection:bg-carbon-primary selection:text-black">
        <Routes>
          {/* Main Portfolio (Your existing site) */}
          <Route path="/" element={<PortfolioPage />} />
          
          {/* New Secret Admin Panel */}
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App;