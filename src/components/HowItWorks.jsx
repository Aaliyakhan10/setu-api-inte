import React from 'react';
import { useNavigate } from 'react-router-dom';

const HowItWorks = () => {
  const navigate = useNavigate();
  return (
    <section className="max-w-4xl mx-auto px-6 py-12">
      <h2 className="text-3xl font-bold text-teal-600 mb-8 text-center">
        How It Works
      </h2>

      <div className="space-y-8">
        {/* Step 1 */}
        <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-shrink-0">
            <div className="h-10 w-10 flex items-center justify-center rounded-full bg-teal-600 text-white font-bold">
              1
            </div>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-teal-700 mb-1">Upload Your Document</h3>
            <p className="text-gray-700">
              Select the PDF you want to sign electronically. We accept PDFs to ensure compatibility and legal compliance.
            </p>
          </div>
        </div>

        {/* Step 2 */}
        <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-shrink-0">
            <div className="h-10 w-10 flex items-center justify-center rounded-full bg-teal-600 text-white font-bold">
              2
            </div>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-teal-700 mb-1">Enter Aadhaar Number</h3>
            <p className="text-gray-700">
              Provide your Aadhaar number or registered mobile number. This lets us send a One-Time Password (OTP) to verify your identity securely.
            </p>
          </div>
        </div>

        {/* Step 3 */}
        <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-shrink-0">
            <div className="h-10 w-10 flex items-center justify-center rounded-full bg-teal-600 text-white font-bold">
              3
            </div>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-teal-700 mb-1">Authenticate via OTP</h3>
            <p className="text-gray-700">
              Enter the OTP received on your Aadhaar-linked mobile phone to confirm your signature request.
            </p>
          </div>
        </div>

        {/* Step 4 */}
        <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-shrink-0">
            <div className="h-10 w-10 flex items-center justify-center rounded-full bg-teal-600 text-white font-bold">
              4
            </div>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-teal-700 mb-1">Sign the Document</h3>
            <p className="text-gray-700">
              Your signature is applied electronically and securely to your document.
            </p>
          </div>
        </div>

        {/* Step 5 */}
        <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-shrink-0">
            <div className="h-10 w-10 flex items-center justify-center rounded-full bg-teal-600 text-white font-bold">
              5
            </div>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-teal-700 mb-1">Track Signature Status</h3>
            <p className="text-gray-700">
              Check your signature request status in real-time. Know when your document is successfully signed.
            </p>
          </div>
        </div>

        {/* Step 6 */}
        <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-shrink-0">
            <div className="h-10 w-10 flex items-center justify-center rounded-full bg-teal-600 text-white font-bold">
              6
            </div>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-teal-700 mb-1">Download Signed PDF</h3>
            <p className="text-gray-700">
              Once signed, download your legally valid, digitally signed document instantly.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="mt-12 text-center">
        <h3 className="text-2xl font-semibold text-teal-700 mb-4">
          Ready to Digitally Sign Your Documents?
        </h3>
        <p className="text-gray-700 mb-6">
          Upload your PDF and sign with Aadhaar now!
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={() => navigate('sign-doc')}
            className="px-6 py-3 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition"
          >
            Upload Document
          </button>
          <button className="px-6 py-3 border border-teal-600 text-teal-600 rounded-md hover:bg-teal-100 transition">
            Learn More
          </button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
