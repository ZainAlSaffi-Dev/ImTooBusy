import { X, Calendar, Clock, ArrowRight } from 'lucide-react';
import { useState } from 'react';

const BookingModal = ({ isOpen, onClose }) => {
  // If the modal is not "open", we render nothing (null)
  if (!isOpen) return null;

  // STATE: This is the component's "Memory"
  const [step, setStep] = useState(1); // 1=Date/Time, 2=Details
  const [selectedTime, setSelectedTime] = useState(null);

  // Fake data for now (We will fetch this from the backend later)
  const availableSlots = ["09:00 AM", "10:00 AM", "02:00 PM", "04:30 PM"];

  return (
    // 1. The Backdrop (Dark overlay that covers the whole screen)
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm">
      
      {/* 2. The Modal Card */}
      <div className="relative w-full max-w-lg bg-carbon-panel border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/5">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Calendar className="text-carbon-primary" size={20} />
            <span className="tracking-wide">REQUEST LINK</span>
          </h2>
          <button onClick={onClose} className="text-carbon-muted hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6">
          {step === 1 ? (
            // STEP 1: Time Selection
            <div className="space-y-4">
              <p className="text-sm text-carbon-muted uppercase tracking-wider font-bold">
                Select Available Protocol
              </p>
              
              <div className="grid grid-cols-2 gap-3">
                {availableSlots.map((time) => (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={`p-3 rounded border text-sm font-medium transition-all ${
                      selectedTime === time 
                        ? 'bg-carbon-primary text-black border-carbon-primary' 
                        : 'bg-transparent border-white/20 text-carbon-text hover:border-carbon-primary/50'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          ) : (
             // STEP 2: User Details (We will build this next)
             <div className="text-center py-10">
               <p>Details Form goes here...</p>
             </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-white/10 flex justify-end">
          <button 
            disabled={!selectedTime} // Cannot click if no time picked
            onClick={() => setStep(2)}
            className={`flex items-center gap-2 px-6 py-3 rounded font-bold uppercase tracking-wider transition-all ${
              selectedTime 
                ? 'bg-carbon-primary text-black hover:shadow-[0_0_20px_rgba(0,255,255,0.4)]' 
                : 'bg-gray-800 text-gray-500 cursor-not-allowed'
            }`}
          >
            <span>Next Step</span>
            <ArrowRight size={18} />
          </button>
        </div>

      </div>
    </div>
  );
};

export default BookingModal;