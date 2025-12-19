import React from 'react';
import { Download, Mail, Facebook } from 'lucide-react';

const Footer: React.FC = () => {
  const logoPathData = `
    <path d="M45 22H80C83.3137 22 86 24.6863 86 28V32C86 35.3137 83.3137 38 80 38H40L45 22Z" fill="white" />
    <path d="M30 44H70C73.3137 44 76 46.6863 76 50V54C76 57.3137 73.3137 60 70 60H25L30 44Z" fill="white" />
    <path d="M15 66H60C63.3137 66 66 68.6863 66 72V76C66 79.3137 63.3137 82 60 82H10L15 66Z" fill="white" />
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
                <path d="M45 22H80C83.3137 22 86 24.6863 86 28V32C86 35.3137 83.3137 38 80 38H40L45 22Z" fill="currentColor" className="text-slate-900 dark:text-white" />
                <path d="M30 44H70C73.3137 44 76 46.6863 76 50V54C76 57.3137 73.3137 60 70 60H25L30 44Z" fill="currentColor" className="text-slate-900 dark:text-white" />
                <path d="M15 66H60C63.3137 66 66 68.6863 66 72V76C66 79.3137 63.3137 82 60 82H10L15 66Z" fill="currentColor" className="text-slate-900 dark:text-white" />
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