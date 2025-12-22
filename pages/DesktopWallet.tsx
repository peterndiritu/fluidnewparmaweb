
            {/* --- SIMULATED DESKTOP HEADER --- */}
            <div className="h-10 bg-slate-900/50 border-b border-white/5 flex items-center justify-between px-4 select-none backdrop-blur-md">
                <div className="flex gap-2">
                    <div onClick={() => onNavigate('wallet')} className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50 hover:bg-red-500 transition-colors cursor-pointer" title="Close (Back to Mobile)"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-500/20 border border-amber-500/50 hover:bg-amber-500 transition-colors cursor-pointer" title="Minimize"></div>
                    <div className="w-3 h-3 rounded-full bg-emerald-500/20 border border-emerald-500/50 hover:bg-emerald-500 transition-colors cursor-pointer" title="Maximize"></div>
                </div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2 opacity-50">
                    <ShieldCheck size={12} /> Fluid Vault Secure Enclave
                </div>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => onNavigate('wallet')}
                        className="text-[10px] font-bold text-slate-500 hover:text-purple-400 flex items-center gap-1.5 transition-colors bg-slate-800/50 px-2 py-1 rounded-md"
                    >
                        <Smartphone size={12} /> Mobile View
                    </button>
                </div> 
            </div>
