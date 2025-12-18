import React from 'react';
import Tokenomics from '../components/Tokenomics';

const TokenPage: React.FC = () => {
  return (
    <div className="min-h-screen pt-28 pb-16">
       <div className="text-center mb-16 px-4">
         <span className="text-emerald-500 font-bold uppercase tracking-widest text-sm">Economy</span>
         <h1 className="text-5xl font-extrabold text-white mt-2 mb-4">Fluid Token</h1>
         <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            The fuel for the entire ecosystem. Governance, Staking, and Utility.
         </p>
      </div>
      <Tokenomics />
    </div>
  );
};

export default TokenPage;