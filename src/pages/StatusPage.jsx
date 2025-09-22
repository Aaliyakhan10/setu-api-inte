import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const StatusPage = () => {
  const [requests, setRequests] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('signatureRequests')) || [];
    setRequests(stored.reverse());
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h2 className="text-3xl font-bold text-teal-700 mb-8">Your Signature Requests</h2>

      {requests.length === 0 ? (
        <p className="text-gray-600">No previous requests found.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {requests.map(({ documentId, signatureId, fileName, displayName, signerStatus, signatureUrl }) => (
            <div
              key={signatureId}
              className="bg-white rounded-lg border border-gray-200 shadow-md p-5 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-gray-500">Document ID</p>
                  <p className="font-medium text-gray-800 break-all">{documentId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Signature ID</p>
                  <p className="font-medium text-gray-800 break-all">{signatureId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">File</p>
                  <p className="font-medium text-gray-800">{fileName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Signer</p>
                  <p className="font-medium text-gray-800">{displayName}</p>
                </div>
                <div className="mt-2">
                  <span
                    className={`inline-block px-3 py-1 text-sm rounded-full font-semibold 
                    ${signerStatus === 'SIGNED'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {signerStatus==='SIGNED' ? 'Signed' : 'Pending'}
                  </span>
                </div>
              </div>

              <div className="mt-4 flex flex-col sm:flex-row sm:justify-between gap-2">
                {signerStatus !== 'SIGNED' && (
                  <button
                    onClick={() => {
                      if (signatureUrl) {
                        window.open(signatureUrl, '_blank', 'width=800,height=700');
                      }
                    }}
                    className="w-full sm:w-auto px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm rounded-lg font-medium transition"
                  >
                    Sign Document
                  </button>
                )}

                <button
                  onClick={() => navigate(`/status/${signatureId}/${documentId}`)}
                  className="w-full sm:w-auto px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm rounded-lg font-medium transition"
                >
                  Check Status & Download
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StatusPage;
