import React from 'react'

const StatusInfo = ({signatureId}) => {
   const [requests, setRequests] = useState([]);
  const [statuses, setStatuses] = useState({});
  const [downloads, setDownloads] = useState({});
  const [loadingId, setLoadingId] = useState(null); // track loading per request
  const [error, setError] = useState('');

  const getCredentials = () => {
    return {
      xClientId: localStorage.getItem('clientId'),
      xClientSecret: localStorage.getItem('clientSecret'),
      xProductInstanceId: localStorage.getItem('productInstanceId')
    };
  };

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('signatureRequests')) || [];
    setRequests(stored);
  }, []);

  const checkStatus = async (signatureId, documentId) => {
    const { xClientId, xClientSecret, xProductInstanceId } = getCredentials();
    setError('');
    setLoadingId(signatureId);

    try {
      // Fetch status
      const res = await fetch(`https://dg-sandbox.setu.co/api/signature/${signatureId}`, {
        method: 'GET',
        headers: {
          'x-client-id': xClientId,
          'x-client-secret': xClientSecret,
          'x-product-instance-id': xProductInstanceId
        }
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || 'Failed to fetch status.');

      const status = data?.data?.status;
      setStatuses(prev => ({ ...prev, [signatureId]: status }));

      // If signed, fetch download link
      if (status === 'SIGNED') {
        const downloadRes = await fetch(`https://sandbox.api.setu.co/api/documents/${documentId}/download`, {
          method: 'GET',
          headers: {
            'x-client-id': xClientId,
            'x-client-secret': xClientSecret,
            'x-product-instance-id': xProductInstanceId
          }
        });

        if (!downloadRes.ok) throw new Error('Download failed.');

        const blob = await downloadRes.blob();
        const url = URL.createObjectURL(blob);

        setDownloads(prev => ({ ...prev, [documentId]: url }));
      }
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-6">Previous Signature Requests</h2>

      {error && <p className="mb-4 text-red-600 font-medium">{error}</p>}

      {requests.length === 0 ? (
        <p className="text-gray-600">No previous requests found.</p>
      ) : (
        requests.map(({ documentId, signatureId }, index) => (
          <div
            key={index}
            className="bg-white shadow-md rounded-lg border border-gray-200 p-6 mb-6"
          >
            <p className="mb-1">
              <span className="font-semibold">Document ID:</span> {documentId}
            </p>
            <p className="mb-4">
              <span className="font-semibold">Signature ID:</span> {signatureId}
            </p>

            <button
              onClick={() => checkStatus(signatureId, documentId)}
              disabled={loadingId === signatureId}
              className={`px-4 py-2 rounded-md font-medium transition-colors duration-200 ${
                loadingId === signatureId
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {loadingId === signatureId ? 'Checking...' : 'Check Status'}
            </button>

            {statuses[signatureId] && (
              <p className="mt-3 font-semibold">
                Status: <span className="text-indigo-600">{statuses[signatureId]}</span>
              </p>
            )}

            {downloads[documentId] && (
              <a
                href={downloads[documentId]}
                download={`signed-${documentId}.pdf`}
                className="inline-block mt-4 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors duration-200"
              >
                ⬇️ Download Signed PDF
              </a>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default StatusInfo