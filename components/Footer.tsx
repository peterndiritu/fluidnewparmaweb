import React from 'react';
import { Download, Mail, Facebook } from 'lucide-react';

const Footer: React.FC = () => {
  const logoPathData = `
    <path d="M48 20 H78 C83.5 20 88 24.5 88 30 C88 35.5 83.5 40 78 40 H38 L48 20 Z" fill="white" />
    <path d="M35 45 H65 C70.5 45 75 49.5 75 55 C75 60.5 70.5 65 65 65 H25 L35 45 Z" fill="white" />
    <path d="M22 70 H52 C57.5 70 62 74.5 62 80 C62 85.5 57.5 90 52 90 H12 L22 70 Z" fill="white" />
  `;

  const handleDownloadLogo = () => {
    const svgContent = `
      <svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 100 100">
        <rect width="100" height="100" fill="#020617" />
        ${logoPathData}
      </svg>
    `;
    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'fluid-logo-white.svg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const socialLinks = [
    { name: 'X', url: 'https://twitter.com/fluid' },
    { name: 'Facebook', url: 'https://facebook.com/fluid' },
    { name: 'Telegram', url: 'https://t.me/fluid' },
    { name: 'Discord', url: 'https://discord.gg/fluid' },
  ];

  return (
    <footer className="py-16 relative z-10 border-t border-slate-200 dark:border-slate-800 mt-24">
      <div className="max-w-7xl mx-auto px-4 text-center">
          
          <button 
            onClick={handleDownloadLogo}
            className="group relative flex flex-col items-center justify-center mb-10 mx-auto"
          >
              <svg width="64" height="64" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-2 transition-transform group-hover:scale-110">
                <path d="M48 20 H78 C83.5 20 88 24.5 88 30 C88 35.5 83.5 40 78 40 H38 L48 20 Z" fill="white" />
                <path d="M35 45 H65 C70.5 45 75 49.5 75 55 C75 60.5 70.5 65 65 65 H25 L35 45 Z" fill="white" />
                <path d="M22 70 H52 C57.5 70 62 74.5 62 80 C62 85.5 57.5 90 52 90 H12 L22 70 Z" fill="white" />
              </svg>
              <span className="font-black text-3xl tracking-tighter text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors">FLUID</span>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-2 flex items-center gap-1">
                <Download size={10} /> Download Asset (White)
              </p>
          </button>

          <div className="flex justify-center gap-8 mb-10">
            {socialLinks.map((link) => (
              <a 
                key={link.name}
                href={link.url}
                target="_blank" 
                rel="noreferrer"
                className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-cyan-400 font-bold transition-all"
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="flex flex-wrap justify-center gap-6 mb-8 text-sm text-slate-500 font-medium">
            <a href="#" className="hover:text-blue-600 transition-colors">Privacy</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Terms</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Cookies</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Sitemap</a>
          </div>

          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">© 2024 Fluid Blockchain Protocol</p>
      </div>
    </footer>
  );
};

export default Footer;