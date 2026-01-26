import { useState } from 'react'

function App() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-carbon-bg relative overflow-hidden">
      
      {/* Background Decorative Blob (The "Speed" Vibe) */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-carbon-primary/20 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2"></div>
      
      {/* The Glass Panel */}
      <div className="relative z-10 w-96 p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg shadow-2xl">
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-carbon-primary to-blue-500 mb-2 italic">
          CARBON
        </h1>
        <p className="text-carbon-muted mb-6">
          Calendar Management System v1.0
        </p>
        
        <button className="w-full py-3 px-6 rounded-lg bg-carbon-primary text-black font-bold uppercase tracking-wider hover:shadow-[0_0_20px_rgba(0,255,255,0.5)] transition-all duration-300">
          Initialize System
        </button>
      </div>

    </div>
  )
}

export default App