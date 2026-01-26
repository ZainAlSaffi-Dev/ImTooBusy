import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, Calendar } from 'lucide-react';

const AdminDashboard = () => {
  const [bookings, setBookings] = useState([]);

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

  return (
    <div className="min-h-screen bg-carbon-bg text-carbon-text p-8 font-sans">
      <h1 className="text-3xl font-bold mb-8 text-white">ADMIN CONSOLE</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* LEFT: BOOKING REQUESTS LIST */}
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
                                b.status === 'REJECTED' ? 'bg-red-500/20 text-red-400' :
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

        {/* RIGHT: SIMPLE CALENDAR VIEW (Upcoming Accepted Meetings) */}
        <div className="space-y-4">
             <h2 className="text-xl font-bold text-gray-400 flex items-center gap-2"><Calendar size={18}/> Upcoming Schedule</h2>
             
             <div className="bg-white/5 border border-white/10 rounded-lg p-6 min-h-[500px]">
                {/* Simple Timeline View */}
                <div className="space-y-6">
                    {bookings.filter(b => b.status === 'ACCEPTED').length === 0 ? (
                        <div className="text-gray-500 text-center py-10">No upcoming meetings.</div>
                    ) : (
                        bookings
                        .filter(b => b.status === 'ACCEPTED')
                        .map(b => (
                            <div key={b.id} className="flex gap-4">
                                <div className="flex flex-col items-center min-w-[60px]">
                                    <span className="text-sm font-bold text-gray-400">{b.date}</span>
                                    <div className="h-full w-px bg-white/10 my-2"></div>
                                </div>
                                <div className="pb-6">
                                    <div className="text-xl text-white font-bold">{b.time}</div>
                                    <div className="text-carbon-primary">{b.name}</div>
                                    <div className="text-sm text-gray-500">{b.duration} mins • {b.email}</div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
             </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;