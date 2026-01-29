import { X, Calendar, Clock, ArrowRight, ArrowLeft, CheckCircle, Globe, AlertTriangle, RefreshCcw, Zap } from 'lucide-react';
import { useState, useEffect, useRef, useCallback } from 'react';
import { API_BASE_URL } from '../config'; 

const AUTO_REFRESH_INTERVAL = 30000; // 30 seconds

const BookingModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;
  
    // STATE
    const [step, setStep] = useState(1);
    const [duration, setDuration] = useState(30);
    const [weekOffset, setWeekOffset] = useState(0); 
    const [availability, setAvailability] = useState({});
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [friendToken, setFriendToken] = useState(null);
  
    // SELECTION STATE
    const [selectedSlotISO, setSelectedSlotISO] = useState(null); 
    const [displayDate, setDisplayDate] = useState(""); 
    const [displayTime, setDisplayTime] = useState(""); 
    
    // MODE
    const [customMode, setCustomMode] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', topic: '' });
    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    // AUTO-REFRESH STATE
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [lastRefresh, setLastRefresh] = useState(null);
    const refreshIntervalRef = useRef(null);
  
    useEffect(() => {
      const params = new URLSearchParams(window.location.search);
      const token = params.get("token");
      if (token) {
          setFriendToken(token);
          setCustomMode(true); 
          window.history.replaceState({}, document.title, "/"); 
      }
    }, []);

  const getWeekDates = (offset, includeWeekends = false) => {
    const dates = [];
    let currentDate = new Date();

    // VIP users page by 5 days so weekends appear while keeping 5 columns
    const pageSize = 5;
    const stepDays = includeWeekends ? pageSize : 7;
    currentDate.setDate(currentDate.getDate() + (offset * stepDays));

    while (dates.length < pageSize) {
        const day = currentDate.getDay();
        // Include all days for VIP, or only weekdays for regular users
        if (includeWeekends || (day !== 0 && day !== 6)) {
            dates.push(new Date(currentDate));
        }
        currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
  };

  // VIP users (with friendToken) can see weekends
  const currentWeekDates = getWeekDates(weekOffset, !!friendToken);

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

  const isToday = (dateObj) => {
      const today = new Date();
      return dateObj.getDate() === today.getDate() &&
             dateObj.getMonth() === today.getMonth() &&
             dateObj.getFullYear() === today.getFullYear();
  };

  // Fetch availability function (reusable for initial load and refresh)
  const fetchAvailability = useCallback(async (forceRefresh = false, silent = false) => {
    if (currentWeekDates.length === 0) return;
    
    const startStr = currentWeekDates[0].toISOString().split('T')[0];
    const endStr = currentWeekDates[currentWeekDates.length-1].toISOString().split('T')[0];
    const mode = customMode ? 'custom' : 'standard';
    
    if (!silent) setLoading(true);
    if (forceRefresh) setIsRefreshing(true);
    
    let url = `${API_BASE_URL}/api/availability?start_date=${startStr}&end_date=${endStr}&duration=${duration}&mode=${mode}`;
    if (friendToken) url += `&token=${friendToken}`;
    if (forceRefresh) url += `&force_refresh=true`;

    try {
        const res = await fetch(url);
        const data = await res.json();
        // Handle both old format (direct slots) and new format (with slots property)
        const slots = data.slots || data;
        setAvailability(slots);
        setLastRefresh(new Date());
    } catch (err) {
        console.error('Failed to fetch availability:', err);
    } finally {
        setLoading(false);
        setIsRefreshing(false);
    }
  }, [currentWeekDates, customMode, duration, friendToken]);

  // Initial fetch when entering step 2
  useEffect(() => {
    if (step === 2) {
        fetchAvailability(false, false);
    }
  }, [step, weekOffset, duration, customMode, friendToken]);

  // Auto-refresh polling when on step 2
  useEffect(() => {
    if (step === 2) {
        // Set up auto-refresh interval
        refreshIntervalRef.current = setInterval(() => {
            fetchAvailability(false, true); // Silent refresh
        }, AUTO_REFRESH_INTERVAL);
        
        return () => {
            if (refreshIntervalRef.current) {
                clearInterval(refreshIntervalRef.current);
            }
        };
    }
  }, [step, fetchAvailability]);

  // Manual refresh handler
  const handleManualRefresh = () => {
    fetchAvailability(true, false);
  };

  const enableCustomMode = () => { setCustomMode(true); setWeekOffset(1); };
  const disableCustomMode = () => { setCustomMode(false); setWeekOffset(0); };

  const handleSlotClick = (isoString) => {
      const dateObj = new Date(isoString);
      setSelectedSlotISO(isoString);
      setDisplayDate(dateObj.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' }));
      setDisplayTime(dateObj.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }));
      setStep(3);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
        const payload = {
            name: formData.name,
            email: formData.email,
            topic: formData.topic,
            slot_iso: selectedSlotISO, 
            duration: duration,
            token: friendToken || null,
            location_type: formData.locationType || 'ONLINE',
            location_details: formData.locationDetails || '' ,
            fax_number: formData.fax_number || ""
        };

        const response = await fetch(`${API_BASE_URL}/api/request-meeting`, {
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
    } finally {
        setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 md:p-0"> {/* Added padding for mobile */}
      <div className="relative w-full max-w-5xl bg-carbon-panel border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[90vh] md:max-h-[90vh]">
        
        {/* HEADER */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/5 shrink-0">
          <h2 className="text-lg md:text-xl font-bold text-white flex items-center gap-2">
            <Calendar className="text-carbon-primary" size={20} />
            {customMode ? "CUSTOM LINK" : "BOOKING"}
          </h2>
          <button onClick={onClose}><X size={24} className="text-gray-500 hover:text-white"/></button>
        </div>

        {/* BODY */}
        <div className="p-4 md:p-6 overflow-y-auto flex-1 custom-scrollbar">
          
          {/* STEP 1: DURATION */}
          {step === 1 && (
            <div className="flex flex-col items-center justify-center h-full space-y-8 py-10">
                <h3 className="text-xl md:text-2xl font-bold text-white text-center">Select Duration</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 w-full max-w-2xl">
                    {[15, 30, 60].map(mins => (
                        <button 
                            key={mins}
                            onClick={() => { setDuration(mins); setStep(2); }}
                            className="p-6 md:p-8 rounded-xl border border-white/10 bg-white/5 hover:bg-carbon-primary/10 hover:border-carbon-primary transition-all group text-center"
                        >
                            <Clock size={32} className="mx-auto mb-4 text-carbon-muted group-hover:text-carbon-primary"/>
                            <div className="text-2xl font-bold text-white mb-2">{mins}m</div>
                            <div className="text-sm text-gray-500">Video Call</div>
                        </button>
                    ))}
                </div>
            </div>
          )}

          {/* STEP 2: WEEK VIEW (RESPONSIVE) */}
          {step === 2 && (
             <div className="h-full flex flex-col">
                {/* Controls */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-4 gap-4 md:gap-0">
                    <div>
                        <div className="flex items-center gap-2 text-xs text-gray-500 font-mono uppercase mb-1">
                            <Globe size={12} /> Your Zone:
                        </div>
                        <div className="text-carbon-primary font-bold text-sm md:text-base">{userTimezone}</div>
                    </div>
                    
                    <div className="flex gap-2 w-full md:w-auto items-center">
                        {/* Refresh Button */}
                        <button 
                            onClick={handleManualRefresh}
                            disabled={isRefreshing}
                            className={`p-2 hover:bg-white/10 rounded border border-white/10 transition-all ${isRefreshing ? 'opacity-50' : ''}`}
                            title="Refresh availability"
                        >
                            <RefreshCcw size={16} className={`text-carbon-primary ${isRefreshing ? 'animate-spin' : ''}`} />
                        </button>
                        <button onClick={() => setWeekOffset(weekOffset - 1)} className="flex-1 md:flex-none p-2 hover:bg-white/10 rounded text-sm font-bold border border-white/10">← Prev</button>
                        <button onClick={() => setWeekOffset(weekOffset + 1)} className="flex-1 md:flex-none p-2 hover:bg-white/10 rounded text-sm font-bold border border-white/10">Next →</button>
                    </div>
                </div>

                {/* Auto-refresh indicator */}
                {lastRefresh && (
                    <div className="text-xs text-gray-600 font-mono mb-2 flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${isRefreshing ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`}></span>
                        {isRefreshing ? 'Refreshing...' : `Live • Auto-updates every 30s`}
                    </div>
                )}

                <h3 className="text-xl md:text-2xl font-bold text-white text-center mb-6 tracking-wide">
                    {getMonthTitle()}
                </h3>

                {/* ALERTS (Keeping existing alert logic) */}
                {customMode && (
                    friendToken ? (
                        <div className="bg-green-500/10 border border-green-500/30 p-3 rounded mb-4 flex items-center gap-3">
                            <Zap className="text-green-500 shrink-0 fill-green-500/20" size={20} />
                            <div className="flex-1">
                                <p className="text-sm text-green-200 font-bold">VIP ACCESS</p>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-yellow-500/10 border border-yellow-500/30 p-3 rounded mb-4 flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                                <AlertTriangle className="text-yellow-500 shrink-0" size={20} />
                                <p className="text-sm text-yellow-200"><strong>Custom Mode</strong></p>
                            </div>
                            <button onClick={disableCustomMode} className="text-xs font-bold text-yellow-500 underline">Standard</button>
                        </div>
                    )
                )}
                
                {loading ? (
                    <div className="flex-1 flex items-center justify-center text-carbon-primary animate-pulse min-h-[200px]">Searching...</div>
                ) : (
                    /* --- ⚡ RESPONSIVE GRID CHANGE ⚡ --- */
                    /* Mobile: grid-cols-1 (Vertical Stack). Desktop: grid-cols-5 (Horizontal) */
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 flex-1 overflow-x-auto md:overflow-x-visible">
                        {currentWeekDates.map(date => {
                            const dateStr = date.toISOString().split('T')[0];
                            const slots = availability[dateStr] || [];
                            const dayName = date.toLocaleDateString(undefined, { weekday: 'short' });
                            const dayNum = date.getDate();
                            const today = isToday(date);

                            return (
                                <div 
                                    key={dateStr} 
                                    /* Mobile: Fixed Height (h-80). Desktop: Fill Height (h-full) */
                                    className={`flex flex-col h-80 md:h-full rounded-lg border overflow-hidden relative transition-all ${
                                        today 
                                        ? 'border-carbon-primary bg-carbon-primary/5 shadow-[0_0_15px_rgba(168,85,247,0.15)] z-10' 
                                        : 'bg-black/40 border-white/5'
                                    }`}
                                >
                                    {/* Header */}
                                    <div className={`text-center p-3 border-b flex md:block items-center justify-between md:justify-center ${
                                        today ? 'bg-carbon-primary/10 border-carbon-primary/30' : 'bg-black/40 border-white/5'
                                    }`}>
                                        <div className={`text-xs uppercase font-bold md:mb-1 ${today ? 'text-carbon-primary' : 'text-gray-500'}`}>{dayName}</div>
                                        <div className={`text-xl md:text-3xl font-black ${today ? 'text-carbon-primary' : 'text-white'}`}>
                                            {dayNum}
                                        </div>
                                    </div>
                                    
                                    {/* Slots Container */}
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

                {/* Footer Toggle */}
                {!customMode && (
                    <div className="mt-6 pt-4 border-t border-white/10 pb-10 md:pb-0"> {/* Extra padding for mobile bottom */}
                        <button 
                            onClick={enableCustomMode}
                            className="w-full py-4 rounded-xl border border-carbon-primary/30 text-carbon-primary font-bold uppercase tracking-wider hover:bg-carbon-primary/10 hover:border-carbon-primary transition-all flex flex-col md:flex-row items-center justify-center gap-2"
                        >
                            <span>Request Custom Slot</span>
                        </button>
                    </div>
                )}
             </div>
          )}

          {/* STEP 3: FORM */}
          {step === 3 && (
            <div className="max-w-lg mx-auto py-4 space-y-6">
                <div className={`p-4 border rounded-lg flex items-center gap-4 ${customMode ? 'bg-yellow-500/10 border-yellow-500/30' : 'bg-carbon-primary/10 border-carbon-primary/30'}`}>
                    <CheckCircle className={customMode ? "text-yellow-500" : "text-carbon-primary"} size={24} />
                    <div>
                        <div className="text-sm text-gray-400">Requesting:</div>
                        <div className="text-lg font-bold text-white">
                            {displayDate} @ {displayTime}
                        </div>
                        <div className="text-xs text-gray-500">{duration} Minutes</div>
                    </div>
                </div>

                <div className="space-y-4">
                     {/* LOCATION TOGGLE */}
                     <div className="bg-black/30 p-1 rounded-lg flex mb-6 border border-white/10">
                        <button 
                            onClick={() => setFormData({...formData, locationType: 'ONLINE'})}
                            className={`flex-1 py-3 text-sm font-bold rounded transition-all ${!formData.locationType || formData.locationType === 'ONLINE' ? 'bg-carbon-primary text-black' : 'text-gray-400 hover:text-white'}`}
                        >
                            💻 Online
                        </button>
                        <button 
                            onClick={() => setFormData({...formData, locationType: 'IN_PERSON'})}
                            className={`flex-1 py-3 text-sm font-bold rounded transition-all ${formData.locationType === 'IN_PERSON' ? 'bg-carbon-primary text-black' : 'text-gray-400 hover:text-white'}`}
                        >
                            📍 In Person
                        </button>
                    </div>

                    {formData.locationType === 'IN_PERSON' && (
                        <div className="mb-6">
                            <InputField label="Meeting Location" value={formData.locationDetails || ''} onChange={e => setFormData({...formData, locationDetails: e.target.value})} placeholder="e.g. Coffee Shop, UQ Campus" />
                        </div>
                    )}

                    <InputField label="Full Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="John Doe" />
                    <InputField label="Email Address" type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="john@example.com" />
                    
                    <div className="space-y-1">
                        <label className="text-sm font-bold text-gray-400">Topic</label>
                        <textarea 
                            className="w-full bg-black/30 border border-white/10 rounded p-3 text-white focus:border-carbon-primary outline-none min-h-[100px]"
                            placeholder="What's this about?"
                            value={formData.topic}
                            onChange={e => setFormData({...formData, topic: e.target.value})}
                        />
                    </div>
                </div>

                <button 
                    onClick={handleSubmit}
                    disabled={submitting}
                    className={`w-full py-4 text-black font-bold rounded-lg transition-all text-lg flex items-center justify-center gap-2 ${
                        customMode ? 'bg-yellow-500' : 'bg-carbon-primary'
                    } ${submitting ? 'opacity-50' : ''}`}
                >
                    {submitting ? "Processing..." : "Confirm Request"}
                </button>
            </div>
          )}

        </div>
        
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