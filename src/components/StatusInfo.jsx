import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const StatusInfo = () => {
  const { signatureId, documentId } = useParams();
  const navigate = useNavigate();

  const [signatureStatus, setSignatureStatus] = useState('');
  const [downloadUrl, setDownloadUrl] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const getCredentials = () => ({
    xClientId: localStorage.getItem('clientId'),
    xClientSecret: localStorage.getItem('clientSecret'),
    xProductInstanceId: localStorage.getItem('productInstanceId'),
  });

  useEffect(() => {
    const checkStatusAndDownload = async () => {
      if (!signatureId || !documentId) {
        setError('Invalid signature or document ID.');
        return;
      }

      setLoading(true);
      setError('');
      setSignatureStatus('');
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
          throw new Error(statusRes.data?.message || 'Failed to fetch signature status.');
        }

        const status = statusRes.data?.status || '';
        setSignatureStatus(status);

        if (status === 'SIGNED') {
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
          setError('Document not signed yet.');
        }
      } catch (err) {
        setError(err.message || 'Something went wrong.');
      } finally {
        setLoading(false);
      }
    };

    checkStatusAndDownload();
  }, [signatureId, documentId]);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 px-3 py-1 rounded bg-gray-300 hover:bg-gray-400"
      >
        ← Back
      </button>
      <h2 className="text-2xl font-semibold mb-6">Signature Status</h2>

      {loading && <p>Loading...</p>}

      {error && <p className="mb-4 text-red-600 font-medium">{error}</p>}

      {!loading && !error && (
        <>
          <p className="mb-4">
            Status: <strong>{signatureStatus}</strong>
          </p>

          {downloadUrl && (
            <a
              href={downloadUrl}
              download={`signed-${documentId}.pdf`}
              className="inline-block mt-4 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md"
            >
              ⬇️ Download Signed PDF
            </a>
          )}
        </>
      )}
    </div>
  );
};

export default StatusInfo;
