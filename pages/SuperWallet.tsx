
      {/* Intro Text & Desktop Toggle */}
      <div className="text-center mb-10 relative z-20">
        
        {/* FLUID DAPP Visual Box */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] h-[260px] border border-blue-400/20 rounded-lg flex items-end justify-end p-4 pointer-events-none -z-10">
           <span className="text-white/40 font-bold tracking-widest text-xs">FLUID DAPP</span>
        </div>

        <button 
          onClick={() => {
            setView('locked');
            setIsScanning(false);
          }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-bold uppercase tracking-wider mb-4 animate-fade-in-up hover:bg-purple-500/20 transition-colors cursor-pointer"
        >
          <Smartphone size={14} />
          Mobile Simulator
        </button>
        <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight animate-fade-in-up delay-100">
          Fluid Super Wallet
        </h1>
        <p className="text-slate-400 text-lg mb-8 max-w-xl mx-auto animate-fade-in-up delay-200">
          Experience the power of a non-custodial multi-chain wallet directly in your browser. Encrypted, secure, and intuitive.
        </p>
        <button 
          onClick={() => onNavigate('desktop')}
          className="inline-flex items-center gap-2 px-8 py-3 bg-white text-slate-900 font-bold rounded-full hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.3)] animate-fade-in-up delay-300 group"
        >
          <Monitor size={20} className="group-hover:text-purple-600 transition-colors" />
          Explore Desktop Version
        </button>
      </div>
