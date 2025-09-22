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
    <div className=" mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-6">Previous Signature Requests</h2>
      <div className="grid gap-2 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4">

      {requests.length === 0 ? (
        <p className="text-gray-600">No previous requests found.</p>
      ) : (
        requests.map(({ documentId, signatureId,fileName ,displayName, signerStatus}) => (
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
            <p className="mb-4">
              <span className="font-semibold">File:</span> {fileName}
            </p>
              <p className="mb-4">
              <span className="font-semibold">Name:</span> {displayName}
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
    </div>
  );
};

export default StatusPage;
