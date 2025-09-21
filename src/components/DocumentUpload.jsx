import axios from 'axios';
import React, { useState } from 'react';

function UploadSignStatus() {
  const [pdfFile, setPdfFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [documentId, setDocumentId] = useState('');
  const [signatureId, setSignatureId] = useState('');
  const [signatureUrl, setSignatureUrl] = useState('');

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
      xProductInstanceId: localStorage.getItem('productInstanceId'),
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

      const formData = new FormData();
      formData.append('document', pdfFile);
      formData.append('name', "sample.pdf");

      for (const pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      const uploadRes = await axios.post(
        '/api/documents',
        formData,
        {
          headers: {
            'x-client-id': xClientId,
            'x-client-secret': xClientSecret,
            'x-product-instance-id': xProductInstanceId,
          },
        }
      );

      const uploadData = uploadRes.data;
      if (!uploadRes.status || uploadRes.status >= 400) {
        throw new Error(uploadData?.message || 'Document upload failed.');
      }
      console.log('Upload Response:', uploadData);

      const docId = uploadData?.id;
      console.log('Uploaded Document ID:', docId);
      setDocumentId(docId);


     const signatureRes = await axios.post(
  '/api/signature',
  {
    documentId: docId,
    redirectUrl: 'https://yourapp.com/callback',
    signers: [
      {
        displayName: 'John Doe',
        birthYear: '1990',
        identifier: '9999999999',
        identifierType: 'PHONE_NUMBER',
        signature: {
          onPages: ['1'],
          position: 'bottom-left',
          height: 60,
          width: 180,
        },
      },
    ],
  },
  {
    headers: {
      'Content-Type': 'application/json',
      'x-client-id': xClientId,
      'x-client-secret': xClientSecret,
      'x-product-instance-id': xProductInstanceId,
    },
  }
);


      const signatureData = signatureRes.data;
      if (!signatureRes.status || signatureRes.status >= 400) {
        throw new Error(signatureData?.message || 'Signature request failed.');
      }

      setSignatureId(signatureData?.id);
      console.log('Signature Response:', signatureData);
      console.log('Signature ID:', signatureData?.id);
      console.log('Signature URL:', signatureData?.signers?.[0]?.url);
      setSignatureUrl(signatureData?.signers?.[0]?.url);
      saveRequestToHistory(docId, signatureData?.id);

    } catch (err) {
       if (err.response) {
   console.error('Backend error response:', err.response.data);
    // Try to print nested error message
    const backendError = err.response.data.error || err.response.data;
    const message = backendError.message || JSON.stringify(backendError) || err.message;
    setError(message);
  } else {
    setError(err.message || 'Something went wrong.');
  }
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

        {error && <p className="error">{error}</p>}
    </div>
  );
}

export default UploadSignStatus;
