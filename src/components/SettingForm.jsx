import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const SettingForm = () => {
  const [clientId, setClientId] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [productInstanceId, setProductInstanceId] = useState('');

  useEffect(() => {
    setClientId(localStorage.getItem('clientId') || '');
    setClientSecret(localStorage.getItem('clientSecret') || '');
    setProductInstanceId(localStorage.getItem('productInstanceId') || '');
  }, []);

  const handleSave = () => {
    localStorage.setItem('clientId', clientId);
    localStorage.setItem('clientSecret', clientSecret);
    localStorage.setItem('productInstanceId', productInstanceId);
    toast.success('Credentials saved to localStorage.');
  };

  const handleClear = () => {
    localStorage.removeItem('clientId');
    localStorage.removeItem('clientSecret');
    localStorage.removeItem('productInstanceId');
    setClientId('');
    setClientSecret('');
    setProductInstanceId('');
    toast.success('Credentials cleared.');
  };

  return (
    <div className="max-w-xl mx-auto mt-12 bg-white shadow-lg rounded-lg p-8">
      <h2 className="text-2xl font-bold text-teal-700 mb-6">🔧 API Credentials Settings</h2>

      <div className="space-y-4">
        <div>
          <label className="block font-medium text-gray-700 mb-1">x-client-id</label>
          <input
            type="text"
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            placeholder="Enter Client ID"
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700 mb-1">x-client-secret</label>
          <input
            type="password"
            value={clientSecret}
            onChange={(e) => setClientSecret(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            placeholder="Enter Client Secret"
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700 mb-1">x-product-instance-id</label>
          <input
            type="text"
            value={productInstanceId}
            onChange={(e) => setProductInstanceId(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            placeholder="Enter Product Instance ID"
          />
        </div>

        <div className="flex flex-wrap gap-4 mt-4">
          <button
            onClick={handleSave}
            className="bg-teal-600 text-white px-5 py-2 rounded-lg hover:bg-teal-700 transition"
          >
          Save Credentials
          </button>
          <button
            onClick={handleClear}
            className="bg-red-100 text-red-700 px-5 py-2 rounded-lg hover:bg-red-200 transition"
          >
           Clear Credentials
          </button>
        </div>

        <div className="mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-md text-sm text-yellow-800">
          <p className="font-semibold mb-1">Security Notice:</p>
          <ul className="list-disc ml-5 space-y-1">
            <li>Your Setu API credentials are stored in your browser's <code className="bg-gray-100 px-1 rounded">localStorage</code>.</li>
            <li><strong>Do not use this method in production.</strong></li>
            <li>This is for demo or educational purposes only — part of the <em>Setu API Integration Assignment</em>.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SettingForm;
