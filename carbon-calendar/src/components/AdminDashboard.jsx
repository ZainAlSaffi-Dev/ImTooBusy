import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, Calendar, AlertOctagon, X } from 'lucide-react';

const AdminDashboard = () => {
  const [bookings, setBookings] = useState([]);
  
  // CANCELLATION STATE
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [cancelReason, setCancelReason] = useState("");
  const [blockSlot, setBlockSlot] = useState(false); // Default: Release the slot

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    const res = await fetch('http://127.0.0.1:8000/api/admin/bookings');
    const data = await res.json();
    setBookings(data);
  };

  const updateStatus = async (id, status) => {
    await fetch(`http://127.0.0.1:8000/api/admin/bookings/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    fetchBookings(); 
  };

  const initiateCancel = (booking) => {
      setSelectedBooking(booking);
      setCancelReason("Unforeseen scheduling conflict");
      setBlockSlot(false); // Default to releasing the slot
      setCancelModalOpen(true);
  };

  const confirmCancel = async () => {
      if(!selectedBooking) return;
      
      await fetch(`http://127.0.0.1:8000/api/admin/cancel/${selectedBooking.id}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ reason: cancelReason, block_slot: blockSlot })
      });
      
      setCancelModalOpen(false);
      fetchBookings();
  };

  return (
    <div className="min-h-screen bg-carbon-bg text-carbon-text p-8 font-sans relative">
      <h1 className="text-3xl font-bold mb-8 text-white">ADMIN CONSOLE</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* LEFT: REQUESTS */}
        <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-400 flex items-center gap-2"><CheckCircle size={18}/> Incoming Requests</h2>
            <div className="space-y-3">
                {bookings.map((b) => (
                    <div key={b.id} className="bg-white/5 border border-white/10 p-5 rounded-lg flex flex-col gap-3">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-lg font-bold text-white">{b.name}</h3>
                                <p className="text-sm text-carbon-primary font-mono">{b.date} @ {b.time} ({b.duration}m)</p>
                            </div>
                            <span className={`px-2 py-1 text-xs font-bold rounded uppercase ${
                                b.status === 'ACCEPTED' ? 'bg-green-500/20 text-green-400' :
                                b.status === 'REJECTED' || b.status === 'CANCELLED' ? 'bg-red-500/20 text-red-400' :
                                'bg-yellow-500/20 text-yellow-400'
                            }`}>
                                {b.status}
                            </span>
                        </div>
                        <p className="text-sm text-gray-300 italic">"{b.topic}"</p>
                        {b.status === 'PENDING' && (
                            <div className="flex gap-2 pt-2 border-t border-white/5">
                                <button onClick={() => updateStatus(b.id, 'ACCEPTED')} className="flex-1 py-2 bg-green-500/10 text-green-400 text-xs font-bold rounded hover:bg-green-500/20">ACCEPT</button>
                                <button onClick={() => updateStatus(b.id, 'REJECTED')} className="flex-1 py-2 bg-red-500/10 text-red-400 text-xs font-bold rounded hover:bg-red-500/20">REJECT</button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>

        {/* RIGHT: SCHEDULE & CANCEL LOGIC */}
        <div className="space-y-4">
             <h2 className="text-xl font-bold text-gray-400 flex items-center gap-2"><Calendar size={18}/> Upcoming Schedule</h2>
             
             <div className="bg-white/5 border border-white/10 rounded-lg p-6 min-h-[500px]">
                <div className="space-y-6">
                    {bookings.filter(b => b.status === 'ACCEPTED').length === 0 ? (
                        <div className="text-gray-500 text-center py-10">No upcoming meetings.</div>
                    ) : (
                        bookings
                        .filter(b => b.status === 'ACCEPTED')
                        .map(b => (
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
                                        {/* CANCEL BUTTON (Visible on Hover) */}
                                        <button 
                                            onClick={() => initiateCancel(b)}
                                            className="opacity-0 group-hover:opacity-100 transition-opacity px-3 py-1 bg-red-500/10 text-red-500 border border-red-500/30 rounded text-xs font-bold hover:bg-red-500 hover:text-white"
                                        >
                                            CANCEL
                                        </button>
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
                      <h3 className="text-lg font-bold text-red-500 flex items-center gap-2">
                          <AlertOctagon size={20}/> Cancel Meeting
                      </h3>
                      <button onClick={() => setCancelModalOpen(false)}><X className="text-gray-500 hover:text-white" /></button>
                  </div>
                  
                  <div className="p-6 space-y-4">
                      <div>
                          <p className="text-white font-bold text-lg">{selectedBooking.name}</p>
                          <p className="text-gray-400 text-sm">{selectedBooking.date} @ {selectedBooking.time}</p>
                      </div>

                      <div className="space-y-1">
                          <label className="text-xs font-bold text-gray-500 uppercase">Reason for email</label>
                          <input 
                              value={cancelReason}
                              onChange={e => setCancelReason(e.target.value)}
                              className="w-full bg-black/50 border border-white/10 rounded p-2 text-white focus:border-red-500 outline-none"
                          />
                      </div>

                      <div className="bg-white/5 p-3 rounded border border-white/10">
                          <label className="flex items-center gap-3 cursor-pointer">
                              <input 
                                  type="checkbox" 
                                  checked={blockSlot}
                                  onChange={e => setBlockSlot(e.target.checked)}
                                  className="w-5 h-5 accent-red-500 rounded"
                              />
                              <div>
                                  <div className="text-white font-bold text-sm">Keep Slot Blocked?</div>
                                  <div className="text-xs text-gray-500">
                                      {blockSlot 
                                          ? "Time will remain unavailable to other clients." 
                                          : "Time will become available for booking again."}
                                  </div>
                              </div>
                          </label>
                      </div>

                      <button 
                          onClick={confirmCancel}
                          className="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded transition-colors"
                      >
                          CONFIRM CANCELLATION
                      </button>
                  </div>
              </div>
          </div>
      )}

    </div>
  );
};

export default AdminDashboard;