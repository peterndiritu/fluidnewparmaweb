import React from 'react';

const TermsPage: React.FC = () => {
  return (
    <div className="min-h-screen pt-28 pb-16">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-extrabold text-white mb-8">Terms of Service</h1>
        <div className="prose dark:prose-invert max-w-none text-slate-400">
          <p className="mb-4">Last updated: May 2024</p>
          <p className="mb-4">
            Welcome to Fluid. By accessing or using our website, wallet, or services, you agree to be bound by these Terms of Service.
          </p>
          <h3 className="text-xl font-bold text-white mt-8 mb-4">1. Acceptance of Terms</h3>
          <p className="mb-4">
            By accessing or using our Services, you agree that you have read, understood, and accept all of the terms and conditions contained in this Agreement.
          </p>
          <h3 className="text-xl font-bold text-white mt-8 mb-4">2. Eligibility</h3>
          <p className="mb-4">
            You must be at least 18 years old to use our Services. By using our Services, you represent and warrant that you meet this requirement.
          </p>
          <h3 className="text-xl font-bold text-white mt-8 mb-4">3. Risk Warning</h3>
          <p className="mb-4">
            Trading cryptocurrencies involves significant risk and can result in the loss of your capital. You should not invest more than you can afford to lose.
          </p>
          <p>
            (This is a placeholder page for demonstration purposes.)
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;