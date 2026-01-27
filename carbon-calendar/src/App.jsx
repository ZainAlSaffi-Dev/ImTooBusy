import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ExperienceFeed from './components/ExperienceFeed';
import BookingModal from './components/BookingModal';
import AdminDashboard from './components/AdminDashboard';
import AdminLogin from './components/AdminLogin'; // 1. Import the Login Component

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
  // 2. State to track if the Admin is authenticated
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  return (
    <Router>
      <div className="min-h-screen bg-carbon-bg text-carbon-text font-sans selection:bg-carbon-primary selection:text-black">
        <Routes>
          {/* Main Portfolio (Public) */}
          <Route path="/" element={<PortfolioPage />} />
          
          {/* Protected Admin Route */}
          {/* Logic: If LoggedIn is true -> Show Dashboard. Else -> Show Login Screen */}
          <Route 
            path="/admin" 
            element={
              isAdminLoggedIn 
                ? <AdminDashboard /> 
                : <AdminLogin onLogin={setIsAdminLoggedIn} />
            } 
          />
        </Routes>
      </div>
    </Router>
  )
}

export default App;