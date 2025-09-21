import React, { useState } from 'react';

function UploadSignStatus() {
  const [pdfFile, setPdfFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [documentId, setDocumentId] = useState('');
  const [signatureId, setSignatureId] = useState('');
  const [signatureUrl, setSignatureUrl] = useState('');
  const [signatureStatus, setSignatureStatus] = useState('');
  const [downloadUrl, setDownloadUrl] = useState('');
  const [error, setError] = useState('');



  const saveRequestToHistory = (docId, sigId) => {
  const key = 'signatureRequests';
  const existing = JSON.parse(localStorage.getItem(key)) || [];
  const updated = [...existing, { documentId: docId, signatureId: sigId }];
  localStorage.setItem(key, JSON.stringify(updated));
};


  const getCredentials = () => {
    return {
      xClientId: localStorage.getItem('clientId'),
      xClientSecret: localStorage.getItem('clientSecret'),
      xProductInstanceId: localStorage.getItem('productInstanceId')
    };
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
      setError('');
    } else {
      setError('Please select a valid PDF file.');
    }
  };

  const handleUploadAndSign = async () => {
    const { xClientId, xClientSecret, xProductInstanceId } = getCredentials();

    if (!pdfFile) return setError('Select a PDF file.');
    if (!xClientId || !xClientSecret || !xProductInstanceId) {
      return setError('Missing credentials in localStorage.');
    }

    try {
      setUploading(true);
      setError('');

      // 📤 Upload document
      const formData = new FormData();
      formData.append('name', pdfFile.name);
      formData.append('document', pdfFile);

      const uploadRes = await fetch('https://dg-sandbox.setu.co/api/documents', {
        method: 'POST',
        headers: {
          'x-client-id': xClientId,
          'x-client-secret': xClientSecret,
          'x-product-instance-id': xProductInstanceId
        },
        body: formData
      });

      const uploadData = await uploadRes.json();
      if (!uploadRes.ok) throw new Error(uploadData?.message || 'Document upload failed.');

      const docId = uploadData?.data?.id;
      setDocumentId(docId);
      const signatureRes = await fetch('https://dg-sandbox.setu.co/api/signature', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-client-id': xClientId,
          'x-client-secret': xClientSecret,
          'x-product-instance-id': xProductInstanceId
        },
        body: JSON.stringify({
          documentId: docId,
          redirectUrl: 'https://example.com/callback',
          signers: [
            { 
               displayName: "John Doe",
              birthYear: '1990',
              identifier: '9999999999',
              identifierType: 'PHONE_NUMBER'
            }
          ]
        })
      });

      const signatureData = await signatureRes.json();
      if (!signatureRes.ok) throw new Error(signatureData?.message || 'Signature request failed.');

      setSignatureId(signatureData?.data?.id);
      setSignatureUrl(signatureData?.data?.url);
    saveRequestToHistory(docId, signatureId);

    } catch (err) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setUploading(false);
    }
  };

 
  return (
    <div>
      <h2>Upload & Sign PDF</h2>

      <input type="file" accept="application/pdf" onChange={handleFileChange} />
      <button onClick={handleUploadAndSign} disabled={uploading}>
        {uploading ? 'Uploading...' : 'Upload & Start Signature'}
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {signatureUrl && (
        <div>
          <h3>Signature In Progress</h3>
          <iframe
            src={signatureUrl}
            width="100%"
            height="600"
            title="Signature Flow"
            style={{ border: '1px solid #ccc' }}
          />
          <p><strong>Document ID:</strong> {documentId}</p>
          <p><strong>Signature ID:</strong> {signatureId}</p>
          <button onClick={checkStatusAndDownload}>Check Status & Download</button>
        </div>
      )}

    </div>
  );
}

export default UploadSignStatus;
