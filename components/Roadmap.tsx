import React from 'react';

const roadmapData = [
  {
    phase: 1,
    quarter: "Q1 - 2024",
    title: "Initial Planning",
    items: [
      "Conduct market research to identify user needs and pain points.",
      "Define the app's core features including multichain support.",
      "Assemble skilled development team and finalize project scope.",
      "Create wireframes and initial design concepts.",
      "Establish partnerships with key partners and services."
    ]
  },
  {
    phase: 2,
    quarter: "Q2 - 2024",
    title: "Development Kickoff & Prototyping",
    items: [
      "Begin development of core architecture ensuring security.",
      "Integrate essential blockchain networks and APIs.",
      "Develop basic wallet functionalities (storage, transfers).",
      "Design and implement intuitive user interface.",
      "Launch internal prototype for feedback and refinement."
    ]
  },
  {
    phase: 3,
    quarter: "Q3 - 2024",
    title: "Advanced Features & Testing",
    items: [
      "Implement advanced features: staking, swapping, bridging.",
      "Develop and integrate AML safety check tools.",
      "Perform rigorous security audits and compliance checks.",
      "Expand network support and optimize performance.",
      "Begin closed beta testing with select user group."
    ]
  },
  {
    phase: 4,
    quarter: "Q4 - 2024",
    title: "Pre-Launch Preparation",
    items: [
      "Conduct extensive testing on all features.",
      "Finalize app development and polish UX.",
      "Prepare for mobile store submission (iOS & Play Store).",
      "Launch marketing campaigns and PR strategies.",
      "Begin onboarding early adopters."
    ]
  },
  {
    phase: 5,
    quarter: "2025",
    title: "Official Launch",
    items: [
      "Launch Fluid Wallet on App Store and Google Play.",
      "Provide robust post-launch user support.",
      "Monitor app performance and user feedback.",
      "Initiate Fluid Token presale.",
      "Introduce in-app off-ramp solutions."
    ]
  },
  {
    phase: 6,
    quarter: "Q1 - 2026",
    title: "Proprietary DEX & Cards",
    items: [
      "List Fluid Token on popular CEX/DEXs.",
      "Begin integrating proprietary DEX within wallet.",
      "Design and develop Fluid Crypto Cards.",
      "Add support for Lightning Network and Monero.",
      "Increase stakable assets availability."
    ]
  }
];

const Roadmap: React.FC = () => {
  return (
    <div className="relative max-w-4xl mx-auto px-4 py-12">
      <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-slate-200 dark:bg-slate-800 transform md:-translate-x-1/2"></div>
      
      {roadmapData.map((item, index) => (
        <div key={index} className={`relative flex flex-col md:flex-row gap-8 mb-16 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
          
          {/* Content */}
          <div className="flex-1 ml-16 md:ml-0">
            <div className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-lg relative ${index % 2 === 0 ? 'md:text-left' : 'md:text-right'}`}>
               <span className="text-cyan-500 font-bold text-xs tracking-widest uppercase mb-1 block">{item.quarter}</span>
               <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">{item.title}</h3>
               <ul className={`space-y-2 text-slate-600 dark:text-slate-400 text-sm list-disc inline-block ${index % 2 === 0 ? 'pl-4' : 'pr-4 md:pl-0 md:pr-4'} text-left`}>
                 {item.items.map((point, i) => (
                   <li key={i}>{point}</li>
                 ))}
               </ul>
            </div>
          </div>

          {/* Marker */}
          <div className="absolute left-8 md:left-1/2 transform -translate-x-1/2 flex items-center justify-center">
             <div className="w-16 h-16 rounded-full bg-slate-900 dark:bg-slate-950 border-4 border-slate-200 dark:border-slate-800 flex items-center justify-center z-10">
                <div className="w-12 h-12 rounded-full bg-cyan-500 flex items-center justify-center text-white font-bold text-xl shadow-[0_0_15px_rgba(6,182,212,0.5)]">
                  {item.phase}
                </div>
             </div>
          </div>

          {/* Empty space for balance */}
          <div className="flex-1 hidden md:block"></div>
        </div>
      ))}

      <div className="text-center mt-12">
         <div className="inline-block p-4 rounded-full bg-slate-900 dark:bg-slate-800 border border-slate-700">
            <span className="text-2xl">🚀</span>
         </div>
         <h3 className="text-xl font-bold text-white mt-4">The Sky is the Limit!</h3>
         <p className="text-slate-400">Fluid's development doesn't stop here.</p>
      </div>
    </div>
  );
};

export default Roadmap;