import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import Loading from './Loading';

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

  return (
    <div className="max-w-3xl mx-auto p-6">
      <button
        onClick={() => navigate('/status')}
        className="mb-4 px-3 py-1 rounded bg-gray-300 hover:bg-gray-400"
      >
        ← Back
      </button>
      <h2 className="text-2xl font-semibold mb-6">Signature Status</h2>

      {loading && <Loading />}

      {!loading && signatureData && (
        <>
          <p><strong>Document ID:</strong> {signatureData.documentId}</p>
          <p><strong>Signature Request ID:</strong> {signatureData.id}</p>
          
          <p><strong>Reason:</strong> {signatureData.reason || 'N/A'}</p>
    
          <p><strong>Status:</strong> {signatureData.status}</p>
      

          <div>
            <strong>Signers:</strong>
            {signatureData.signers && signatureData.signers.length > 0 ? (
              <ul className="list-disc pl-6">
                {signatureData.signers.map((signer) => (
                  <li key={signer.id}>
                    Name: {signer.displayName},
                     Birth Year: {signer.birthYear},
                      Identifier: {signer.identifier},
                     Status: {signer.status}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No signers available.</p>
            )}
          </div>

          {downloadUrl && (
            <a
              href={downloadUrl}
              download={`signed-${documentId}.pdf`}
              className="inline-block mt-4 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md"
            >
              Download Signed PDF
            </a>
          )}
        </>
      )}

      {!loading && !signatureData && (
        <p className="text-gray-600">No signature data available.</p>
      )}
    </div>
  );
};

export default StatusInfo;
