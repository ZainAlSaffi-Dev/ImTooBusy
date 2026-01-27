import { useState } from 'react';
import { Lock } from 'lucide-react';
import { API_BASE_URL } from '../config';

const AdminLogin = ({ onLogin }) => {
    const [password, setPassword] = useState("");
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(false);

        try {
            // <--- UPDATED URL HERE
            const res = await fetch(`${API_BASE_URL}/api/admin/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password })
            });

            if (res.ok) {
                onLogin(true);
            } else {
                setError(true);
            }
        } catch (err) {
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white/5 border border-white/10 p-8 rounded-2xl backdrop-blur-sm">
                <div className="flex justify-center mb-6">
                    <div className="p-4 bg-carbon-primary/10 rounded-full">
                        <Lock className="text-carbon-primary" size={32} />
                    </div>
                </div>
                <h2 className="text-2xl font-bold text-white text-center mb-6">SYSTEM LOCKED</h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <input 
                            type="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter Access Code"
                            className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-carbon-primary outline-none text-center tracking-widest"
                            disabled={loading}
                        />
                    </div>
                    
                    {error && <div className="text-red-500 text-sm text-center font-bold">ACCESS DENIED</div>}
                    
                    <button 
                        disabled={loading}
                        className="w-full py-3 bg-carbon-primary text-black font-bold rounded-lg hover:bg-white transition-colors disabled:opacity-50"
                    >
                        {loading ? "AUTHENTICATING..." : "AUTHENTICATE"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;