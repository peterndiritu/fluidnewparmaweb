
import React, { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import FluidWalletApp from './pages/SuperWallet';
import RoadmapPage from './pages/RoadmapPage';
import BlockchainPage from './pages/BlockchainPage';
import WhitepaperPage from './pages/WhitepaperPage';
import AdminDashboard from './pages/AdminDashboard';
import FaqPage from './pages/FaqPage';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const renderPage = () => {
    switch(currentPage) {
      case 'home': return <Home onNavigate={setCurrentPage} />;
      case 'blockchain': return <BlockchainPage />;
      case 'wallet': return <FluidWalletApp onNavigate={setCurrentPage} />;
      case 'roadmap': return <RoadmapPage />;
      case 'whitepaper': return <WhitepaperPage />;
      case 'admin': return <AdminDashboard />;
      case 'faq': return <FaqPage />;
      default: return <Home onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-indigo-500/30 transition-colors duration-300 relative">
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
