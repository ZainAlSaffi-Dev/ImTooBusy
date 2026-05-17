import { X, Calendar, Clock, ArrowLeft, CheckCircle, Globe, AlertTriangle, RefreshCcw, Zap } from 'lucide-react';
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
      sessionStorage.setItem("carbon_friend_token", token);
      setFriendToken(token);
      setCustomMode(true);
      window.history.replaceState({}, document.title, "/");
      return;
    }
    const storedToken = sessionStorage.getItem("carbon_friend_token");
    if (storedToken) {
      setFriendToken(storedToken);
      setCustomMode(true);
    }
  }, []);

  const getWeekDates = (offset, includeWeekends = false) => {
    const dates = [];
    let currentDate = new Date();
    const pageSize = 5;
    const stepDays = includeWeekends ? pageSize : 7;
    currentDate.setDate(currentDate.getDate() + (offset * stepDays));
    while (dates.length < pageSize) {
      const day = currentDate.getDay();
      if (includeWeekends || (day !== 0 && day !== 6)) {
        dates.push(new Date(currentDate));
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
  };

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
    return `${month1.substring(0, 3)} – ${month2.substring(0, 3)} ${year2}`;
  };

  const isToday = (dateObj) => {
    const today = new Date();
    return dateObj.getDate() === today.getDate() &&
           dateObj.getMonth() === today.getMonth() &&
           dateObj.getFullYear() === today.getFullYear();
  };

  // Fetch availability (reusable for initial load and refresh)
  const fetchAvailability = useCallback(async (forceRefresh = false, silent = false) => {
    if (currentWeekDates.length === 0) return;
    const startStr = currentWeekDates[0].toISOString().split('T')[0];
    const endStr = currentWeekDates[currentWeekDates.length - 1].toISOString().split('T')[0];
    const mode = customMode ? 'custom' : 'standard';

    if (!silent) setLoading(true);
    if (forceRefresh) setIsRefreshing(true);

    let url = `${API_BASE_URL}/api/availability?start_date=${startStr}&end_date=${endStr}&duration=${duration}&mode=${mode}`;
    if (friendToken) url += `&token=${friendToken}`;
    if (forceRefresh) url += `&force_refresh=true`;

    try {
      const res = await fetch(url);
      const data = await res.json();
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

  useEffect(() => {
    if (step === 2) {
      fetchAvailability(false, false);
    }
  }, [step, weekOffset, duration, customMode, friendToken]);

  useEffect(() => {
    if (step === 2) {
      refreshIntervalRef.current = setInterval(() => {
        fetchAvailability(false, true);
      }, AUTO_REFRESH_INTERVAL);
      return () => {
        if (refreshIntervalRef.current) clearInterval(refreshIntervalRef.current);
      };
    }
  }, [step, fetchAvailability]);

  const handleManualRefresh = () => fetchAvailability(true, false);

  const enableCustomMode  = () => { setCustomMode(true);  setWeekOffset(1); };
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
        location_type:   formData.locationType    || 'ONLINE',
        location_details: formData.locationDetails || '',
        fax_number:      formData.fax_number      || ""
      };

      const response = await fetch(`${API_BASE_URL}/api/request-meeting`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        alert("Request sent successfully.");
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md p-4 md:p-6">
      <div className="relative w-full max-w-5xl bg-ink-50 border border-ink-300/70 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[92vh] md:max-h-[88vh]">

        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-ink-300/60 bg-ink-100/60 shrink-0">
          <div className="flex items-center gap-3">
            <Calendar className="text-accent" size={18} />
            <h2 className="text-base md:text-lg text-ink-900">
              <span className="font-serif italic">{customMode ? 'Custom slot' : 'Book a chat'}</span>
              <span className="font-mono text-[11px] uppercase tracking-widest text-ink-600 ml-3">
                Step {step} / 3
              </span>
            </h2>
          </div>
          <button onClick={onClose} className="text-ink-600 hover:text-ink-900 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* BODY */}
        <div className="px-4 md:px-8 py-6 overflow-y-auto flex-1 custom-scrollbar">

          {/* STEP 1: DURATION */}
          {step === 1 && (
            <div className="flex flex-col items-center justify-center h-full space-y-8 py-6 md:py-10">
              <div className="text-center">
                <span className="eyebrow">Duration</span>
                <h3 className="mt-2 text-2xl md:text-3xl font-serif italic font-normal text-ink-900">
                  How long should we&nbsp;chat?
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-3xl">
                {[15, 30, 60].map(mins => (
                  <button
                    key={mins}
                    onClick={() => { setDuration(mins); setStep(2); }}
                    className="p-6 md:p-8 rounded-2xl border border-ink-300/70 bg-ink-100 hover:border-accent hover:bg-ink-200 transition-all group text-left"
                  >
                    <Clock size={22} className="mb-5 text-ink-600 group-hover:text-accent transition-colors" />
                    <div className="text-3xl md:text-4xl text-ink-900 font-serif italic mb-1">{mins}</div>
                    <div className="text-xs font-mono uppercase tracking-widest text-ink-600">minutes</div>
                    <div className="mt-3 text-sm text-ink-700">
                      {mins === 15 && 'Quick question'}
                      {mins === 30 && 'Standard chat'}
                      {mins === 60 && 'Deep dive'}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: WEEK VIEW */}
          {step === 2 && (
            <div className="h-full flex flex-col">
              {/* Controls row */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-4 gap-4">
                <div>
                  <div className="flex items-center gap-2 eyebrow">
                    <Globe size={11} /> Your zone
                  </div>
                  <div className="text-ink-900 text-sm md:text-base mt-1">{userTimezone}</div>
                </div>

                <div className="flex gap-2 w-full md:w-auto items-center">
                  <button
                    onClick={handleManualRefresh}
                    disabled={isRefreshing}
                    className={`p-2 hover:bg-ink-200 rounded-lg border border-ink-300/70 transition-all ${isRefreshing ? 'opacity-50' : ''}`}
                    title="Refresh availability"
                  >
                    <RefreshCcw size={14} className={`text-ink-700 ${isRefreshing ? 'animate-spin' : ''}`} />
                  </button>
                  <button
                    onClick={() => setWeekOffset(weekOffset - 1)}
                    className="flex-1 md:flex-none px-3 py-2 hover:bg-ink-200 rounded-lg text-sm border border-ink-300/70 text-ink-800"
                  >
                    ← Prev
                  </button>
                  <button
                    onClick={() => setWeekOffset(weekOffset + 1)}
                    className="flex-1 md:flex-none px-3 py-2 hover:bg-ink-200 rounded-lg text-sm border border-ink-300/70 text-ink-800"
                  >
                    Next →
                  </button>
                </div>
              </div>

              {lastRefresh && (
                <div className="text-xs font-mono text-ink-600 mb-3 flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 rounded-full ${isRefreshing ? 'bg-yellow-500 animate-pulse' : 'bg-emerald-500/80'}`} />
                  {isRefreshing ? 'Refreshing…' : 'Live · auto-updates every 30s'}
                </div>
              )}

              <h3 className="text-center text-lg md:text-xl text-ink-900 font-serif italic mb-5">
                {getMonthTitle()}
              </h3>

              {customMode && (
                friendToken ? (
                  <div className="bg-emerald-500/10 border border-emerald-500/30 px-4 py-3 rounded-lg mb-4 flex items-center gap-3">
                    <Zap className="text-emerald-400 shrink-0" size={16} />
                    <p className="text-sm text-emerald-200">VIP access · weekends visible</p>
                  </div>
                ) : (
                  <div className="bg-amber-500/10 border border-amber-500/30 px-4 py-3 rounded-lg mb-4 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="text-amber-400 shrink-0" size={16} />
                      <p className="text-sm text-amber-200">Custom mode</p>
                    </div>
                    <button onClick={disableCustomMode} className="text-xs text-amber-300 underline">
                      Back to standard
                    </button>
                  </div>
                )
              )}

              {loading ? (
                <div className="flex-1 flex items-center justify-center text-ink-600 min-h-[200px] font-mono text-sm tracking-wider">
                  Searching availability…
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-5 gap-3 flex-1 overflow-x-auto md:overflow-visible">
                  {currentWeekDates.map(date => {
                    const dateStr = date.toISOString().split('T')[0];
                    const slots = availability[dateStr] || [];
                    const dayName = date.toLocaleDateString(undefined, { weekday: 'short' });
                    const dayNum = date.getDate();
                    const today = isToday(date);

                    return (
                      <div
                        key={dateStr}
                        className={`flex flex-col h-80 md:h-full rounded-xl border overflow-hidden transition-all ${
                          today
                            ? 'border-accent/60 bg-accent/5'
                            : 'border-ink-300/60 bg-ink-100/40'
                        }`}
                      >
                        <div className={`text-center px-3 py-3 border-b flex md:block items-center justify-between md:justify-center ${
                          today ? 'bg-accent/10 border-accent/30' : 'bg-ink-200/40 border-ink-300/60'
                        }`}>
                          <div className={`font-mono text-[10px] uppercase tracking-widest md:mb-1 ${today ? 'text-accent' : 'text-ink-600'}`}>
                            {dayName}
                          </div>
                          <div className={`text-2xl md:text-3xl font-serif italic ${today ? 'text-accent' : 'text-ink-900'}`}>
                            {dayNum}
                          </div>
                        </div>

                        <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-2">
                          {slots.length === 0 ? (
                            <div className="text-xs text-center text-ink-600 py-10">No slots</div>
                          ) : (
                            slots.map(isoTime => {
                              const localTime = new Date(isoTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                              return (
                                <button
                                  key={isoTime}
                                  onClick={() => handleSlotClick(isoTime)}
                                  className={`w-full py-2.5 rounded-lg border text-sm font-medium transition-all ${
                                    customMode
                                      ? 'border-amber-500/30 text-amber-300 hover:bg-amber-500 hover:text-ink-0 hover:border-amber-500'
                                      : 'border-ink-300/70 text-ink-800 hover:bg-accent hover:text-ink-0 hover:border-accent'
                                  }`}
                                >
                                  {localTime}
                                </button>
                              );
                            })
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {!customMode && (
                <div className="mt-6 pt-4 border-t border-ink-300/60 pb-4 md:pb-0">
                  <button
                    onClick={enableCustomMode}
                    className="w-full py-3 rounded-full border border-ink-300/70 text-ink-700 hover:text-accent hover:border-accent transition-all text-sm"
                  >
                    Can't find a slot? Request a custom time →
                  </button>
                </div>
              )}
            </div>
          )}

          {/* STEP 3: FORM */}
          {step === 3 && (
            <div className="max-w-xl mx-auto py-4 space-y-6">
              <div className={`px-4 py-4 border rounded-xl flex items-center gap-4 ${
                customMode ? 'bg-amber-500/10 border-amber-500/30' : 'bg-accent/8 border-accent/30'
              }`}>
                <CheckCircle className={customMode ? "text-amber-400" : "text-accent"} size={20} />
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-widest text-ink-600">Requesting</div>
                  <div className="text-ink-900 text-base mt-0.5">
                    {displayDate} · {displayTime}
                  </div>
                  <div className="text-xs text-ink-600 mt-0.5">{duration} minutes</div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-ink-100 p-1 rounded-full flex border border-ink-300/70">
                  <button
                    onClick={() => setFormData({ ...formData, locationType: 'ONLINE' })}
                    className={`flex-1 py-2.5 text-sm rounded-full transition-all ${
                      !formData.locationType || formData.locationType === 'ONLINE'
                        ? 'bg-ink-900 text-ink-0'
                        : 'text-ink-700 hover:text-ink-900'
                    }`}
                  >
                    Online
                  </button>
                  <button
                    onClick={() => setFormData({ ...formData, locationType: 'IN_PERSON' })}
                    className={`flex-1 py-2.5 text-sm rounded-full transition-all ${
                      formData.locationType === 'IN_PERSON'
                        ? 'bg-ink-900 text-ink-0'
                        : 'text-ink-700 hover:text-ink-900'
                    }`}
                  >
                    In person
                  </button>
                </div>

                {formData.locationType === 'IN_PERSON' && (
                  <InputField
                    label="Meeting location"
                    value={formData.locationDetails || ''}
                    onChange={e => setFormData({ ...formData, locationDetails: e.target.value })}
                    placeholder="e.g. coffee shop, UQ St Lucia"
                  />
                )}

                <InputField
                  label="Full name"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Jane Doe"
                />
                <InputField
                  label="Email address"
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  placeholder="jane@example.com"
                />

                <div className="space-y-1.5">
                  <label className="font-mono text-[10px] uppercase tracking-widest text-ink-600">Topic</label>
                  <textarea
                    className="w-full bg-ink-100 border border-ink-300/70 rounded-lg p-3 text-ink-900 focus:border-accent outline-none min-h-[100px] placeholder:text-ink-600"
                    placeholder="What would you like to talk about?"
                    value={formData.topic}
                    onChange={e => setFormData({ ...formData, topic: e.target.value })}
                  />
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={submitting}
                className={`w-full py-3.5 rounded-full text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                  customMode
                    ? 'bg-amber-500 text-ink-0 hover:bg-amber-400'
                    : 'bg-ink-900 text-ink-0 hover:bg-accent'
                } ${submitting ? 'opacity-50' : ''}`}
              >
                {submitting ? 'Sending…' : 'Send request'}
              </button>
            </div>
          )}
        </div>

        {step > 1 && (
          <div className="px-6 py-3 border-t border-ink-300/60 bg-ink-100/60">
            <button
              onClick={() => setStep(step - 1)}
              className="text-sm text-ink-700 hover:text-ink-900 flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft size={14} /> Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const InputField = ({ label, type = "text", value, onChange, placeholder }) => (
  <div className="space-y-1.5">
    <label className="font-mono text-[10px] uppercase tracking-widest text-ink-600">{label}</label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full bg-ink-100 border border-ink-300/70 rounded-lg p-3 text-ink-900 focus:border-accent outline-none placeholder:text-ink-600"
    />
  </div>
);

export default BookingModal;
