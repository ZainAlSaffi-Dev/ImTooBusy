import { useState, useEffect } from 'react';
import { CheckCircle, Calendar, AlertOctagon, X, ShieldAlert, Trash2, List, Link as LinkIcon, Copy } from 'lucide-react';
import { API_BASE_URL } from '../config';

const AdminDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [activeTab, setActiveTab] = useState('requests'); 
  
  // CANCELLATION STATE
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [cancelReason, setCancelReason] = useState("");
  const [blockSlot, setBlockSlot] = useState(false);

  // NEW: GENERATED LINK STATE
  const [generatedLink, setGeneratedLink] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState("");
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    // 1. Fetch immediately when the page loads
    fetchData();

    // 2. Set up a "Heartbeat" to fetch data every 5 seconds
    const interval = setInterval(() => {
        fetchData();
    }, 5000); // 5000ms = 5 seconds

    // 3. Cleanup: Stop the heartbeat if you leave the page (prevents memory leaks)
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    const resBookings = await fetch(`${API_BASE_URL}/api/admin/bookings`);
    const dataBookings = await resBookings.json();
    setBookings(dataBookings);

    const resBlocks = await fetch(`${API_BASE_URL}/api/admin/blocks`);
    const dataBlocks = await resBlocks.json();
    setBlocks(dataBlocks);
  };

  const updateStatus = async (id, status) => {
    await fetch(`${API_BASE_URL}/api/admin/bookings/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    fetchData(); 
  };

  const initiateCancel = (booking) => {
      setSelectedBooking(booking);
      setCancelReason("Unforeseen scheduling conflict");
      setBlockSlot(false);
      setCancelModalOpen(true);
  };

  const confirmCancel = async () => {
      if(!selectedBooking) return;
      await fetch(`${API_BASE_URL}/api/admin/cancel/${selectedBooking.id}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ reason: cancelReason, block_slot: blockSlot })
      });
      setCancelModalOpen(false);
      fetchData();
  };

  const deleteBlock = async (id) => {
      if(!confirm("Are you sure you want to unblock this time slot?")) return;
      await fetch(`${API_BASE_URL}/api/admin/blocks/${id}`, { method: 'DELETE' });
      fetchData();
  };

  // NEW: GENERATE FRIEND LINK
  const generateFriendLink = async () => {
      const res = await fetch(`${API_BASE_URL}/api/admin/generate-friend-link`, { method: 'POST' });
      const data = await res.json();
      setGeneratedLink({ link: data.link, expiresAt: data.expires_at });
      if (navigator?.clipboard) {
          navigator.clipboard.writeText(data.link);
          setCopySuccess(true);
          setTimeout(() => setCopySuccess(false), 1500);
      }
  };

  const copyFriendLink = async () => {
      if (!generatedLink?.link) return;
      if (navigator?.clipboard) {
          await navigator.clipboard.writeText(generatedLink.link);
          setCopySuccess(true);
          setTimeout(() => setCopySuccess(false), 1500);
      }
  };

  const formatTimeRemaining = (ms) => {
      if (ms <= 0) return "Expired";
      const totalSeconds = Math.floor(ms / 1000);
      const days = Math.floor(totalSeconds / 86400);
      const hours = Math.floor((totalSeconds % 86400) / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;
      if (days > 0) return `${days}d ${hours}h ${minutes}m`;
      if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;
      return `${minutes}m ${seconds}s`;
  };

  useEffect(() => {
      if (!generatedLink?.expiresAt) return;
      const updateTimer = () => {
          const diff = new Date(generatedLink.expiresAt) - new Date();
          setTimeRemaining(formatTimeRemaining(diff));
      };
      updateTimer();
      const interval = setInterval(updateTimer, 1000);
      return () => clearInterval(interval);
  }, [generatedLink]);

  return (
    <div className="min-h-screen bg-carbon-bg text-carbon-text p-8 font-sans relative">
      
      {/* HEADER WITH ACTIONS */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div className="flex items-center gap-4">
                <h1 className="text-3xl font-bold text-white">ADMIN CONSOLE</h1>
                <div className="flex items-center gap-2 px-2 py-1 bg-green-500/10 border border-green-500/20 rounded-full">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_#22c55e]"></div>
                    <span className="text-[10px] font-mono text-green-500 font-bold tracking-wider">LIVE</span>
                </div>
            </div>
          
          <button 
            onClick={generateFriendLink}
            className="flex items-center gap-2 bg-carbon-primary/10 border border-carbon-primary/50 text-carbon-primary px-4 py-2 rounded hover:bg-carbon-primary hover:text-black transition-all font-bold"
          >
            {copySuccess ? <CheckCircle size={18}/> : <LinkIcon size={18}/>}
            {copySuccess ? "Copied!" : "Generate Friend Link"}
          </button>
      </div>

      {generatedLink && (
        <div className="mt-4 p-4 rounded-lg border border-white/10 bg-white/5 flex flex-col gap-3">
            <div className="flex items-center gap-2 text-xs font-mono text-gray-400">
                <span className="w-2 h-2 rounded-full bg-carbon-primary"></span>
                Expires in {timeRemaining}
            </div>
            <div className="flex flex-col md:flex-row gap-2">
                <input 
                    value={generatedLink.link}
                    readOnly
                    className="flex-1 bg-black/40 border border-white/10 rounded px-3 py-2 text-sm font-mono text-gray-200"
                />
                <button 
                    onClick={copyFriendLink}
                    className="flex items-center justify-center gap-2 px-4 py-2 rounded border border-carbon-primary/40 text-carbon-primary hover:bg-carbon-primary hover:text-black transition-all text-sm font-bold"
                >
                    <Copy size={16} />
                    Copy
                </button>
            </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* LEFT PANEL: TABBED INTERFACE */}
        <div className="flex flex-col gap-4">
            {/* TAB SWITCHER */}
            <div className="flex gap-4 border-b border-white/10 pb-4">
                <button 
                    onClick={() => setActiveTab('requests')}
                    className={`flex items-center gap-2 pb-2 text-sm font-bold uppercase transition-all ${
                        activeTab === 'requests' ? 'text-carbon-primary border-b-2 border-carbon-primary' : 'text-gray-500 hover:text-white'
                    }`}
                >
                    <List size={18}/> Incoming Requests
                </button>
                <button 
                    onClick={() => setActiveTab('blocks')}
                    className={`flex items-center gap-2 pb-2 text-sm font-bold uppercase transition-all ${
                        activeTab === 'blocks' ? 'text-red-500 border-b-2 border-red-500' : 'text-gray-500 hover:text-white'
                    }`}
                >
                    <ShieldAlert size={18}/> Blocked Zones
                </button>
            </div>

            {/* TAB CONTENT: REQUESTS */}
            {activeTab === 'requests' && (
                <div className="space-y-3 animate-in fade-in slide-in-from-left-4">
                    {/* NEW: Filter for PENDING only */}
                    {bookings.filter(b => b.status === 'PENDING').length === 0 ? (
                        <div className="text-gray-500 text-center py-10 border border-white/5 rounded-lg bg-white/5">
                            All caught up! No pending requests.
                        </div>
                    ) : (
                        bookings.filter(b => b.status === 'PENDING').map((b) => (
                            <div key={b.id} className="bg-white/5 border border-white/10 p-5 rounded-lg flex flex-col gap-3">
                                {/* ... (The rest of your existing card code remains the same) ... */}
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                            {b.name} 
                                            {b.topic.includes('⚡') && (
                                                <span className="text-[10px] bg-yellow-500 text-black px-1.5 py-0.5 rounded font-black uppercase tracking-wider">
                                                    FRIEND
                                                </span>
                                            )}
                                        </h3>
                                        <p className="text-sm text-carbon-primary font-mono">{b.date} @ {b.time} ({b.duration}m)</p>
                                    </div>
                                    <span className="px-2 py-1 text-xs font-bold rounded uppercase bg-yellow-500/20 text-yellow-400">
                                        {b.status}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-300 italic">"{b.topic.replace('⚡ [FRIEND] ', '')}"</p>
                                
                                <div className="flex gap-2 pt-2 border-t border-white/5">
                                    <button onClick={() => updateStatus(b.id, 'ACCEPTED')} className="flex-1 py-2 bg-green-500/10 text-green-400 text-xs font-bold rounded hover:bg-green-500/20">ACCEPT</button>
                                    <button onClick={() => updateStatus(b.id, 'REJECTED')} className="flex-1 py-2 bg-red-500/10 text-red-400 text-xs font-bold rounded hover:bg-red-500/20">REJECT</button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* TAB CONTENT: BLOCKS */}
            {activeTab === 'blocks' && (
                <div className="space-y-3 animate-in fade-in slide-in-from-right-4">
                    {blocks.length === 0 ? <div className="text-gray-500 italic text-center py-10">No active blocks.</div> : blocks.map((block) => (
                        <div key={block.id} className="bg-red-500/5 border border-red-500/20 p-5 rounded-lg flex items-center justify-between group">
                            <div>
                                <div className="text-red-400 font-bold flex items-center gap-2"><ShieldAlert size={16}/> {block.date}</div>
                                <div className="text-white text-lg font-mono">{block.start_time} - {block.end_time}</div>
                                <div className="text-sm text-gray-500">Reason: {block.reason}</div>
                            </div>
                            <button onClick={() => deleteBlock(block.id)} className="p-3 bg-red-500/10 text-red-500 rounded hover:bg-red-500 hover:text-white transition-all"><Trash2 size={20} /></button>
                        </div>
                    ))}
                </div>
            )}
        </div>

        {/* RIGHT PANEL: SCHEDULE */}
        <div className="space-y-4">
             <h2 className="text-xl font-bold text-gray-400 flex items-center gap-2"><Calendar size={18}/> Upcoming Schedule</h2>
             <div className="bg-white/5 border border-white/10 rounded-lg p-6 min-h-[500px]">
                <div className="space-y-6">
                    {bookings.filter(b => b.status === 'ACCEPTED').length === 0 ? (
                        <div className="text-gray-500 text-center py-10">No upcoming meetings.</div>
                    ) : (
                        bookings.filter(b => b.status === 'ACCEPTED').map(b => (
                            <div key={b.id} className="flex gap-4 group">
                                <div className="flex flex-col items-center min-w-[60px]">
                                    <span className="text-sm font-bold text-gray-400">{b.date}</span>
                                    <div className="h-full w-px bg-white/10 my-2"></div>
                                </div>
                                <div className="pb-6 flex-1">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="text-xl text-white font-bold">{b.time}</div>
                                            <div className="text-carbon-primary">{b.name}</div>
                                            <div className="text-sm text-gray-500">{b.duration} mins • {b.email}</div>
                                        </div>
                                        <button onClick={() => initiateCancel(b)} className="opacity-0 group-hover:opacity-100 transition-opacity px-3 py-1 bg-red-500/10 text-red-500 border border-red-500/30 rounded text-xs font-bold hover:bg-red-500 hover:text-white">CANCEL</button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
             </div>
        </div>
      </div>

      {/* CANCELLATION MODAL */}
      {cancelModalOpen && selectedBooking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
              <div className="w-full max-w-md bg-[#0a0a0a] border border-red-500/30 rounded-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                  <div className="p-4 border-b border-red-500/20 bg-red-500/5 flex justify-between items-center">
                      <h3 className="text-lg font-bold text-red-500 flex items-center gap-2"><AlertOctagon size={20}/> Cancel Meeting</h3>
                      <button onClick={() => setCancelModalOpen(false)}><X className="text-gray-500 hover:text-white" /></button>
                  </div>
                  <div className="p-6 space-y-4">
                      <div><p className="text-white font-bold text-lg">{selectedBooking.name}</p><p className="text-gray-400 text-sm">{selectedBooking.date} @ {selectedBooking.time}</p></div>
                      <div className="space-y-1"><label className="text-xs font-bold text-gray-500 uppercase">Reason</label><input value={cancelReason} onChange={e => setCancelReason(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded p-2 text-white focus:border-red-500 outline-none"/></div>
                      <div className="bg-white/5 p-3 rounded border border-white/10"><label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={blockSlot} onChange={e => setBlockSlot(e.target.checked)} className="w-5 h-5 accent-red-500 rounded"/><div><div className="text-white font-bold text-sm">Keep Slot Blocked?</div></div></label></div>
                      <button onClick={confirmCancel} className="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded transition-colors">CONFIRM CANCELLATION</button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default AdminDashboard;