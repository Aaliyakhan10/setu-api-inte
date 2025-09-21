import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const StatusPage = () => {
  const [requests, setRequests] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('signatureRequests')) || [];
    setRequests(stored);
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-6">Previous Signature Requests</h2>

      {requests.length === 0 ? (
        <p className="text-gray-600">No previous requests found.</p>
      ) : (
        requests.map(({ documentId, signatureId }) => (
          <div
            key={signatureId}
            className="bg-white shadow-md rounded-lg border border-gray-200 p-6 mb-6"
          >
            <p className="mb-1">
              <span className="font-semibold">Document ID:</span> {documentId}
            </p>
            <p className="mb-4">
              <span className="font-semibold">Signature ID:</span> {signatureId}
            </p>

            <button
              onClick={() => navigate(`/status/${signatureId}/${documentId}`)}
              className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white"
            >
              Check Status & Download
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default StatusPage;
