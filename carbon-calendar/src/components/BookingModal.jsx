import { X, Calendar, Clock, ArrowRight } from 'lucide-react';
import { useState } from 'react';

const BookingModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  // 1. ADDED: Form Data State
  const [step, setStep] = useState(1);
  const [selectedTime, setSelectedTime] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    topic: ''
  });

  const availableSlots = ["09:00 AM", "10:00 AM", "02:00 PM", "04:30 PM"];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm">
      
      <div className="relative w-full max-w-lg bg-carbon-panel border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/5">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Calendar className="text-carbon-primary" size={20} />
            <span className="tracking-wide text-white">REQUEST LINK</span>
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
                AVAILABLE TIMES
              </p>
              
              <div className="grid grid-cols-2 gap-3">
                {availableSlots.map((time) => (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={`p-3 rounded border text-sm font-medium transition-all ${
                      selectedTime === time 
                        ? 'bg-carbon-primary text-black border-carbon-primary' 
                        : 'bg-transparent border-white/20 text-carbon-text hover:border-carbon-primary/50 hover:bg-white/5'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            // 2. ADDED: Step 2 Form UI
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="p-3 rounded bg-carbon-primary/10 border border-carbon-primary/20 flex items-center gap-3">
                <div className="p-2 rounded-full bg-carbon-primary/20 text-carbon-primary">
                    <Calendar size={16} />
                </div>
                <div>
                    <p className="text-xs text-carbon-primary uppercase font-bold">Selected Slot</p>
                    <p className="text-sm font-medium text-white">{selectedTime} - Tomorrow</p>
                </div>
                </div>

                <InputField 
                label="Full Name" 
                type="text" 
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                />

                <InputField 
                label="Email" 
                type="email" 
                placeholder="name@example.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                />

                <div className="space-y-1">
                <label className="text-xs font-bold text-carbon-muted uppercase tracking-wider ml-1">
                    PURPOSE OF MEETING
                </label>
                <textarea
                    rows="3"
                    placeholder="Briefly describe the reason for this meeting request..."
                    value={formData.topic}
                    onChange={(e) => setFormData({...formData, topic: e.target.value})}
                    className="w-full bg-black/40 border border-white/10 rounded p-3 text-carbon-text placeholder:text-gray-700 focus:outline-none focus:border-carbon-primary/50 focus:ring-1 focus:ring-carbon-primary/50 transition-all resize-none"
                />
                </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-white/10 flex justify-between items-center">
            
            {/* 3. ADDED: Back Button */}
            {step === 2 && (
                <button 
                    onClick={() => setStep(1)}
                    className="text-carbon-muted hover:text-white text-sm font-medium transition-colors"
                >
                    ← Back
                </button>
            )}

            {/* Main Action Button */}
            <button 
                disabled={!selectedTime}
                onClick={async () => {
                    if (step === 1) {
                        setStep(2);
                    } 
                    else {
                        try {
                            const payload = {
                                name: formData.name,
                                email: formData.email,
                                topic: formData.topic,
                                time: selectedTime
                            };

                            const response = await fetch('http://127.0.0.1:8000/api/request-meeting', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(payload)
                            });

                            const data = await response.json();

                            if (response.ok) {
                                alert(`SUCCESS: ${data.message}`);
                                onClose(); 
                                setStep(1);
                                setFormData({ name: '', email: '', topic: '' });
                                setSelectedTime(null);
                            } else {
                                alert("ERROR: Transmission rejected by server.");
                            }
                        } catch (error) {
                            console.error("Connection Failed:", error);
                            alert("CRITICAL ERROR: Backend system offline.");
                        }
                    }
                }}
                className={`ml-auto flex items-center gap-2 px-6 py-3 rounded font-bold uppercase tracking-wider transition-all ${
                selectedTime 
                    ? 'bg-carbon-primary text-black hover:shadow-[0_0_20px_rgba(168,85,247,0.4)]' 
                    : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                }`}
            >
                <span>{step === 1 ? "Next Step" : "Book"}</span>
                {step === 1 ? <ArrowRight size={18} /> : <Calendar size={18} />}
            </button>
        </div>

      </div>
    </div>
  );
};

// 4. ADDED: Helper Component for Inputs
const InputField = ({ label, type, value, onChange, placeholder }) => (
    <div className="space-y-1">
      <label className="text-xs font-bold text-carbon-muted uppercase tracking-wider ml-1">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-black/40 border border-white/10 rounded p-3 text-carbon-text placeholder:text-gray-700 focus:outline-none focus:border-carbon-primary/50 focus:ring-1 focus:ring-carbon-primary/50 transition-all"
      />
    </div>
);

export default BookingModal;