import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import Loading from './Loading';
import StatusTimeline from './StatusTimeline';

const StatusInfo = () => {
  const { signatureId, documentId } = useParams();

  const [signatureData, setSignatureData] = useState(null);
  const [signatureStatus, setSignatureStatus] = useState('');
  const [downloadUrl, setDownloadUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const getCredentials = () => ({
    xClientId: localStorage.getItem('clientId'),
    xClientSecret: localStorage.getItem('clientSecret'),
    xProductInstanceId: localStorage.getItem('productInstanceId'),
  });

  useEffect(() => {
    const checkStatusAndDownload = async () => {
      if (!signatureId || !documentId) {
        toast.error('Invalid signature or document ID.');
        return;
      }

      setLoading(true);
      setSignatureStatus('');
      setSignatureData(null);
      setDownloadUrl('');

      const { xClientId, xClientSecret, xProductInstanceId } = getCredentials();

      try {
        const statusRes = await axios.get(`/api/signature/${signatureId}`, {
          headers: {
            'x-client-id': xClientId,
            'x-client-secret': xClientSecret,
            'x-product-instance-id': xProductInstanceId,
          },
        });

        if (!statusRes.status || statusRes.status >= 400) {
          toast.error(statusRes.data?.message || 'Failed to fetch signature status.');
          setLoading(false);
          return;
        }

        setSignatureData(statusRes.data);
        setSignatureStatus(statusRes.data?.status || '');

        if (statusRes.data?.status === 'SIGNED') {
          const downloadRes = await axios.get(`/api/documents/${documentId}/download`, {
            headers: {
              'x-client-id': xClientId,
              'x-client-secret': xClientSecret,
              'x-product-instance-id': xProductInstanceId,
            },
            responseType: 'blob',
          });

          const url = window.URL.createObjectURL(new Blob([downloadRes.data]));
          setDownloadUrl(url);
        } else {
          toast.info('Document not signed yet.');
        }
      } catch (err) {
        toast.error(err.message || 'Something went wrong.');
      } finally {
        setLoading(false);
      }
    };

    checkStatusAndDownload();
  }, [signatureId, documentId]);

  const handleSignClick = () => {
    const url = signatureData.signers?.[0]?.url;
    if (url) {
      window.open(url, '_blank', 'width=800,height=700');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="bg-white shadow-md rounded-lg p-6 sm:p-8">
        <button
          onClick={() => navigate('/status')}
          className="mb-6 text-sm px-4 py-2 rounded bg-gray-100 hover:bg-gray-200 text-gray-700"
        >
          ← Back to Status Page
        </button>

        <h2 className="text-3xl font-bold text-teal-700 mb-6">Signature Status</h2>

        {loading && <Loading />}

        {!loading && signatureData && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Document ID</p>
                <p className="font-medium text-gray-800">{signatureData.documentId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Signature Request ID</p>
                <p className="font-medium text-gray-800">{signatureData.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Reason</p>
                <p className="font-medium text-gray-800">{signatureData.reason || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p className="font-semibold text-teal-700">{signatureData.status}</p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Signer Info</h3>
              {signatureData.signers?.length > 0 ? (
                <ul className="space-y-2">
                  {signatureData.signers.map((signer) => (
                    <li key={signer.id} className="text-sm text-gray-700 bg-gray-50 p-3 rounded border">
                      <span className="block"><strong>Name:</strong> {signer.displayName}</span>
                      <span className="block"><strong>Birth Year:</strong> {signer.birthYear}</span>
                      <span className="block"><strong>Identifier:</strong> {signer.identifier}</span>
                      <span className="block"><strong>Status:</strong> {signer.status}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No signer data available.</p>
              )}
            </div>

            {/* Timeline Component */}
            <StatusTimeline
              status={signatureData.status}
              signerStatus={signatureData.signers?.[0]?.status}
            />

            {/* Sign Button */}
            {signatureData.status !== 'SIGNED' &&
              signatureData.signers?.[0].status !== 'SIGNED' &&
              !downloadUrl && (
                <button
                  onClick={handleSignClick}
                  className="w-full sm:w-auto px-6 py-3 mt-4 text-white bg-teal-600 hover:bg-teal-700 text-lg font-medium rounded-xl shadow transition duration-200"
                >
                  Sign Document
                </button>
              )}

            {/* Download Button */}
            {downloadUrl && (
              <a
                href={downloadUrl}
                download={`signed-${documentId}.pdf`}
                className="inline-block w-full sm:w-auto text-center mt-4 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white text-lg font-medium rounded-xl shadow transition duration-200"
              >
                Download Signed PDF
              </a>
            )}
          </div>
        )}

        {!loading && !signatureData && (
          <p className="text-gray-500">No signature data found for this request.</p>
        )}
      </div>
    </div>
  );
};

export default StatusInfo;
