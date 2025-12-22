import React from 'react';

const PrivacyPage: React.FC = () => {
  return (
    <div className="min-h-screen pt-28 pb-16">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-extrabold text-white mb-8">Privacy Policy</h1>
        <div className="prose dark:prose-invert max-w-none text-slate-400">
          <p className="mb-4">Last updated: May 2024</p>
          <p className="mb-4">
            At Fluid, we take your privacy seriously. This Privacy Policy explains how we collect, use, and protect your personal information.
          </p>
          <h3 className="text-xl font-bold text-white mt-8 mb-4">1. Data Collection</h3>
          <p className="mb-4">
            As a non-custodial wallet provider, we do not collect or store your private keys, seed phrases, or password. We may collect anonymous usage data to improve our services.
          </p>
          <h3 className="text-xl font-bold text-white mt-8 mb-4">2. Third-Party Services</h3>
          <p className="mb-4">
            Our app may contain links to third-party websites or services (e.g., DEXs, On-ramps) that are not owned or controlled by Fluid. We are not responsible for the privacy practices of these third parties.
          </p>
          <h3 className="text-xl font-bold text-white mt-8 mb-4">3. Security</h3>
          <p className="mb-4">
            We implement industry-standard security measures to protect your data. However, no method of transmission over the Internet is 100% secure.
          </p>
          <p>
            (This is a placeholder page for demonstration purposes.)
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;