import { X, Calendar, Clock, ArrowRight, ArrowLeft, CheckCircle, Globe, AlertTriangle, RefreshCcw } from 'lucide-react';
import { useState, useEffect } from 'react';

const BookingModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  // STATE
  const [step, setStep] = useState(1);
  const [duration, setDuration] = useState(30);
  const [weekOffset, setWeekOffset] = useState(0); 
  const [availability, setAvailability] = useState({});
  const [loading, setLoading] = useState(false);
  
  // SELECTION STATE
  const [selectedSlotISO, setSelectedSlotISO] = useState(null); 
  const [displayDate, setDisplayDate] = useState(""); 
  const [displayTime, setDisplayTime] = useState(""); 
  
  // MODE
  const [customMode, setCustomMode] = useState(false);

  const [formData, setFormData] = useState({ name: '', email: '', topic: '' });

  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  // HELPER: Get dates for the currently viewed week
  const getWeekDates = (offset) => {
    const today = new Date();
    const start = new Date(today);
    start.setDate(today.getDate() + (offset * 7));
    
    const dates = [];
    for(let i=0; i<5; i++) { 
        const d = new Date(start);
        d.setDate(start.getDate() + i);
        // Only add Mon-Fri (1-5)
        const day = d.getDay();
        if (day !== 0 && day !== 6) {
             dates.push(d);
        }
    }
    return dates;
  };

  const currentWeekDates = getWeekDates(weekOffset);

  // HELPER: Format Month Title
  const getMonthTitle = () => {
      if (currentWeekDates.length === 0) return "";
      const first = currentWeekDates[0];
      const last = currentWeekDates[currentWeekDates.length - 1];
      
      const month1 = first.toLocaleDateString('default', { month: 'long' });
      const year1 = first.getFullYear();
      const month2 = last.toLocaleDateString('default', { month: 'long' });
      const year2 = last.getFullYear();

      if (month1 === month2) return `${month1} ${year1}`;
      return `${month1.substring(0,3)} - ${month2.substring(0,3)} ${year2}`;
  };

  // HELPER: Check if a date object is "Today"
  const isToday = (dateObj) => {
      const today = new Date();
      return dateObj.getDate() === today.getDate() &&
             dateObj.getMonth() === today.getMonth() &&
             dateObj.getFullYear() === today.getFullYear();
  };

  // FETCH AVAILABILITY
  useEffect(() => {
    if (step === 2) {
        const startStr = currentWeekDates[0].toISOString().split('T')[0];
        const endStr = currentWeekDates[currentWeekDates.length-1].toISOString().split('T')[0];
        const mode = customMode ? 'custom' : 'standard';
        
        setLoading(true);
        fetch(`http://127.0.0.1:8000/api/availability?start_date=${startStr}&end_date=${endStr}&duration=${duration}&mode=${mode}`)
            .then(res => res.json())
            .then(data => {
                setAvailability(data);
                setLoading(false);
            })
            .catch(err => setLoading(false));
    }
  }, [step, weekOffset, duration, customMode]);

  const enableCustomMode = () => {
      setCustomMode(true);
      setWeekOffset(1); 
  };

  const disableCustomMode = () => {
      setCustomMode(false);
      setWeekOffset(0); 
  };

  const handleSlotClick = (isoString) => {
      const dateObj = new Date(isoString);
      setSelectedSlotISO(isoString);
      setDisplayDate(dateObj.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' }));
      setDisplayTime(dateObj.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }));
      setStep(3);
  };

  const handleSubmit = async () => {
    try {
        const payload = {
            name: formData.name,
            email: formData.email,
            topic: formData.topic,
            slot_iso: selectedSlotISO, 
            duration: duration
        };

        const response = await fetch('http://127.0.0.1:8000/api/request-meeting', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            alert("Request Sent Successfully.");
            onClose();
            setStep(1);
        } else {
            alert("Error sending request.");
        }
    } catch (error) {
        alert("Server error.");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-5xl bg-carbon-panel border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* HEADER */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/5 shrink-0">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Calendar className="text-carbon-primary" size={20} />
            {customMode ? "CUSTOM REQUEST LINK" : "BOOKING LINK"}
          </h2>
          <button onClick={onClose}><X size={24} className="text-gray-500 hover:text-white"/></button>
        </div>

        {/* BODY */}
        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
          
          {/* STEP 1: DURATION */}
          {step === 1 && (
            <div className="flex flex-col items-center justify-center h-full space-y-8 py-10">
                <h3 className="text-2xl font-bold text-white">Select Session Duration</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-2xl">
                    {[15, 30, 60].map(mins => (
                        <button 
                            key={mins}
                            onClick={() => { setDuration(mins); setStep(2); }}
                            className="p-8 rounded-xl border border-white/10 bg-white/5 hover:bg-carbon-primary/10 hover:border-carbon-primary transition-all group text-center"
                        >
                            <Clock size={40} className="mx-auto mb-4 text-carbon-muted group-hover:text-carbon-primary"/>
                            <div className="text-2xl font-bold text-white mb-2">{mins} Mins</div>
                            <div className="text-sm text-gray-500">Video Call</div>
                        </button>
                    ))}
                </div>
            </div>
          )}

          {/* STEP 2: WEEK VIEW */}
          {step === 2 && (
             <div className="h-full flex flex-col">
                {/* Top Controls: Timezone & Navigation */}
                <div className="flex justify-between items-end mb-4">
                    <div>
                        <div className="flex items-center gap-2 text-xs text-gray-500 font-mono uppercase mb-1">
                            <Globe size={12} /> Times displayed in your local zone:
                        </div>
                        <div className="text-carbon-primary font-bold">{userTimezone}</div>
                    </div>
                    
                    <div className="flex gap-2">
                        <button onClick={() => setWeekOffset(weekOffset - 1)} className="p-2 hover:bg-white/10 rounded text-sm font-bold border border-white/10">← Prev</button>
                        <button onClick={() => setWeekOffset(weekOffset + 1)} className="p-2 hover:bg-white/10 rounded text-sm font-bold border border-white/10">Next →</button>
                    </div>
                </div>

                {/* MONTH TITLE */}
                <h3 className="text-2xl font-bold text-white text-center mb-6 tracking-wide">
                    {getMonthTitle()}
                </h3>

                {/* EXIT CUSTOM MODE BANNER */}
                {customMode && (
                    <div className="bg-yellow-500/10 border border-yellow-500/30 p-3 rounded mb-4 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                            <AlertTriangle className="text-yellow-500 shrink-0" size={20} />
                            <p className="text-sm text-yellow-200">
                                <strong>Custom Mode Active:</strong> Showing extended hours. Requires 7-day notice.
                            </p>
                        </div>
                        <button 
                            onClick={disableCustomMode}
                            className="text-xs font-bold text-yellow-500 underline decoration-2 underline-offset-4 hover:text-white flex items-center gap-1 uppercase tracking-wide"
                        >
                            <RefreshCcw size={12} /> Switch to Standard
                        </button>
                    </div>
                )}
                
                {loading ? (
                    <div className="flex-1 flex items-center justify-center text-carbon-primary animate-pulse">Checking Satellites...</div>
                ) : (
                    <div className="grid grid-cols-5 gap-4 flex-1 overflow-hidden min-h-[400px]">
                        {currentWeekDates.map(date => {
                            const dateStr = date.toISOString().split('T')[0];
                            const slots = availability[dateStr] || [];
                            const dayName = date.toLocaleDateString(undefined, { weekday: 'short' });
                            const dayNum = date.getDate();
                            const today = isToday(date);

                            return (
                                <div 
                                    key={dateStr} 
                                    // FIXED STYLE:
                                    // 1. All days get bg-black/40 (darker contrast)
                                    // 2. Today gets a purple tint (bg-carbon-primary/5) + Glowing Border
                                    className={`flex flex-col h-full rounded-lg border overflow-hidden relative transition-all ${
                                        today 
                                        ? 'border-carbon-primary bg-carbon-primary/5 shadow-[0_0_15px_rgba(168,85,247,0.15)] z-10' 
                                        : 'bg-black/40 border-white/5'
                                    }`}
                                >
                                    {/* Column Header */}
                                    <div className={`text-center p-3 border-b ${
                                        today ? 'bg-carbon-primary/10 border-carbon-primary/30' : 'bg-black/40 border-white/5'
                                    }`}>
                                        <div className={`text-xs uppercase font-bold mb-1 ${today ? 'text-carbon-primary' : 'text-gray-500'}`}>{dayName}</div>
                                        
                                        {/* GLOWING DAY NUMBER */}
                                        <div className={`text-3xl font-black ${
                                            today 
                                            ? 'text-carbon-primary drop-shadow-[0_0_10px_rgba(168,85,247,0.8)]' 
                                            : 'text-white'
                                        }`}>
                                            {dayNum}
                                        </div>
                                    </div>
                                    
                                    {/* Slots Grid */}
                                    <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-2">
                                        {slots.length === 0 ? (
                                            <div className="text-xs text-center text-gray-700 py-10">No Slots</div>
                                        ) : (
                                            slots.map(isoTime => {
                                                const localTime = new Date(isoTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
                                                return (
                                                    <button
                                                        key={isoTime}
                                                        onClick={() => handleSlotClick(isoTime)}
                                                        className={`w-full py-3 rounded border text-base font-medium transition-all ${
                                                            customMode 
                                                            ? 'border-yellow-500/30 text-yellow-500 hover:bg-yellow-500 hover:text-black' 
                                                            : 'border-carbon-primary/20 text-carbon-primary hover:bg-carbon-primary hover:text-black'
                                                        }`}
                                                    >
                                                        {localTime}
                                                    </button>
                                                )
                                            })
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Custom Request Toggle */}
                {!customMode && (
                    <div className="mt-6 pt-4 border-t border-white/10">
                        <button 
                            onClick={enableCustomMode}
                            className="w-full py-4 rounded-xl border border-carbon-primary/30 text-carbon-primary font-bold uppercase tracking-wider hover:bg-carbon-primary/10 hover:border-carbon-primary transition-all flex flex-col md:flex-row items-center justify-center gap-2 group"
                        >
                            <span>Can't find a time? Request Custom Slot</span>
                            <span className="text-xs font-normal normal-case text-gray-400 group-hover:text-carbon-primary/70 border border-gray-600 rounded px-2 py-0.5 ml-2">Requires 1 Week Notice</span>
                        </button>
                    </div>
                )}
             </div>
          )}

          {/* STEP 3: DETAILS FORM */}
          {step === 3 && (
            <div className="max-w-lg mx-auto py-4 space-y-6 animate-in fade-in slide-in-from-right-8">
                <div className={`p-4 border rounded-lg flex items-center gap-4 ${customMode ? 'bg-yellow-500/10 border-yellow-500/30' : 'bg-carbon-primary/10 border-carbon-primary/30'}`}>
                    <CheckCircle className={customMode ? "text-yellow-500" : "text-carbon-primary"} size={24} />
                    <div>
                        <div className="text-sm text-gray-400">Requesting:</div>
                        <div className="text-lg font-bold text-white">
                            {displayDate} @ {displayTime}
                        </div>
                        <div className="text-xs text-gray-500">Duration: {duration} Minutes</div>
                    </div>
                </div>

                <div className="space-y-4">
                    <InputField label="Full Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="John Doe" />
                    <InputField label="Email Address" type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="john@example.com" />
                    
                    <div className="space-y-1">
                        <label className="text-sm font-bold text-gray-400">Purpose of Meeting</label>
                        <textarea 
                            className="w-full bg-black/30 border border-white/10 rounded p-3 text-white focus:border-carbon-primary outline-none min-h-[100px]"
                            placeholder="What would you like to discuss?"
                            value={formData.topic}
                            onChange={e => setFormData({...formData, topic: e.target.value})}
                        />
                    </div>
                </div>

                <button 
                    onClick={handleSubmit}
                    className={`w-full py-4 text-black font-bold rounded-lg transition-all text-lg ${customMode ? 'bg-yellow-500 hover:shadow-[0_0_20px_rgba(234,179,8,0.4)]' : 'bg-carbon-primary hover:shadow-[0_0_20px_rgba(168,85,247,0.4)]'}`}
                >
                    Confirm Request
                </button>
            </div>
          )}

        </div>
        
        {/* FOOTER */}
        {step > 1 && (
            <div className="p-4 border-t border-white/10 bg-white/5">
                <button onClick={() => setStep(step - 1)} className="text-sm text-gray-400 hover:text-white flex items-center gap-1">
                    <ArrowLeft size={16} /> Back
                </button>
            </div>
        )}

      </div>
    </div>
  );
};

const InputField = ({ label, type="text", value, onChange, placeholder }) => (
    <div className="space-y-1">
        <label className="text-sm font-bold text-gray-400">{label}</label>
        <input 
            type={type} 
            value={value} 
            onChange={onChange}
            placeholder={placeholder}
            className="w-full bg-black/30 border border-white/10 rounded p-3 text-white focus:border-carbon-primary outline-none" 
        />
    </div>
);

export default BookingModal;