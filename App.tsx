import React, { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import SuperWallet from './pages/SuperWallet';
import HostPage from './pages/Host';
import AboutPage from './pages/About';
import TokenPage from './pages/TokenPage';
import RoadmapPage from './pages/RoadmapPage';
import FaqPage from './pages/FaqPage';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';
import BlockchainPage from './pages/BlockchainPage';
import BuyPage from './pages/BuyPage';
import EconomicsPage from './pages/EconomicsPage';
import DocsPage from './pages/DocsPage';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const renderPage = () => {
    switch(currentPage) {
      case 'home': return <Home onNavigate={setCurrentPage} />;
      case 'buy': return <BuyPage />;
      case 'blockchain': return <BlockchainPage />;
      case 'wallet': 
      case 'dex': 
      case 'cards': 
        return <SuperWallet onNavigate={setCurrentPage} initialView={currentPage === 'dex' ? 'swap' : currentPage === 'cards' ? 'card' : 'assets'} />;
      case 'token': return <TokenPage />;
      case 'host': return <HostPage />;
      case 'about': return <AboutPage />;
      case 'roadmap': return <RoadmapPage />;
      case 'faq': return <FaqPage />;
      case 'terms': return <TermsPage />;
      case 'privacy': return <PrivacyPage />;
      case 'economics': return <EconomicsPage />;
      case 'docs': return <DocsPage />;
      default: return <Home onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 text-slate-900 dark:text-white selection:bg-emerald-500/30 transition-colors duration-300 relative">
      
      {/* Technological Hosting Grid Background */}
      <div className="fixed inset-0 bg-tech-grid pointer-events-none z-0 opacity-100"></div>
      
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header onNavigate={setCurrentPage} currentPage={currentPage} />

        <main className="flex-grow">
          {renderPage()}
        </main>

        <Footer />
      </div>
    </div>
  );
}

export default App;