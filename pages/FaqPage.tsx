import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

const FaqPage: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "What is Fluid Chain?",
      answer: "Fluid Chain is a Layer-1 blockchain delivering 2M+ TPS with zero-downtime hosting, designed to bridge the gap between digital assets and everyday internet interactions through a non-custodial, multichain ecosystem."
    },
    {
      question: "How do I buy FLUID tokens?",
      answer: "You can purchase FLUID tokens during our Presale phase using the widget on our Home page. We accept ETH, BNB, and USDT. Simply connect your wallet and swap."
    },
    {
      question: "Is Fluid Wallet non-custodial?",
      answer: "Yes. Fluid Wallet is strictly non-custodial. You own your private keys and have full control over your funds. We cannot access or freeze your assets."
    },
    {
      question: "What is Parmaweb?",
      answer: "Parmaweb is our permanent web hosting protocol. By paying once in FLUID tokens, your content is stored eternally across our distributed node network, ensuring it remains censorship-resistant and always online."
    },
    {
      question: "When will the Mainnet launch?",
      answer: "The Official Mainnet launch is scheduled for 2025, following the conclusion of our Beta testing and Presale phases. Check our Roadmap for detailed timelines."
    }
  ];

  return (
    <div className="min-h-screen pt-28 pb-16">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center p-3 bg-blue-500/10 rounded-full mb-4 text-blue-500">
             <HelpCircle size={32} />
          </div>
          <h1 className="text-5xl font-extrabold text-white mb-4">Frequently Asked Questions</h1>
          <p className="text-slate-400 text-lg">
            Everything you need to know about Fluid.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden transition-all duration-300 hover:border-slate-700"
            >
              <button 
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-6 text-left"
              >
                <span className="text-lg font-bold text-white">{faq.question}</span>
                <ChevronDown 
                  size={20} 
                  className={`text-slate-400 transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`} 
                />
              </button>
              
              <div 
                className={`overflow-hidden transition-all duration-300 ${openIndex === index ? 'max-h-48' : 'max-h-0'}`}
              >
                <div className="p-6 pt-0 text-slate-400 leading-relaxed">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FaqPage;