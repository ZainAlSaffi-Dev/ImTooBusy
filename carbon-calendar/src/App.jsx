import { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ExperienceFeed from './components/ExperienceFeed'; // Import the new component
import BookingModal from './components/BookingModal';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-carbon-bg text-carbon-text font-sans selection:bg-carbon-primary selection:text-black">
      <Navbar onOpenBooking={() => setIsModalOpen(true)} />
      
      <main>
        <Hero />
        <ExperienceFeed />
      </main>
      
      <BookingModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  )
}

export default App;