import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Loading from './Loading';

function UploadSignStatus() {
  const navigate = useNavigate();
  const [pdfFile, setPdfFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [documentId, setDocumentId] = useState('');
  const [signatureId, setSignatureId] = useState('');

  const [signatureUrl, setSignatureUrl] = useState('');
  const [fileName, setFileName] = useState('');
const [isLoading, setIsLoading] = useState(false);

const REDIRECT_URL = import.meta.env.VITE_REDIRECT_URI || '';


  const saveRequestToHistory = (docId, sigId,fileName,signUrl,disName,signersStatus) => {
    const key = 'signatureRequests';
  
 
   
    const existing = JSON.parse(localStorage.getItem(key)) || [];
    const updated = [...existing, { documentId: docId, signatureId: sigId ,fileName:fileName ,signatureUrl:signUrl,displayName:disName ,signersStatus:signersStatus}];
    localStorage.setItem(key, JSON.stringify(updated));
  };

  const getCredentials = () => {
    return {
      xClientId: localStorage.getItem('clientId'),
      xClientSecret: localStorage.getItem('clientSecret'),
      xProductInstanceId: localStorage.getItem('productInstanceId'),
    };
  };
 

  const handleFileChange = async(e) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
      toast.success(`Selected file: ${file.name}`);
      const safeFilename ='uploaded.pdf';
       setFileName(safeFilename); 
      await handleUploadAndSign();
      
    } else {
      toast.error('Please select a valid PDF file.');
      return;
    }
  };

  const handleUploadAndSign = async () => {
    const { xClientId, xClientSecret, xProductInstanceId } = getCredentials();
    
    
    if (!xClientId || !xClientSecret || !xProductInstanceId) {
       toast.error('Missing credentials in localStorage.');
       return;
    }

    try {
      setUploading(true);
      setIsLoading(true);
      

      const formData = new FormData();
      formData.append('document', pdfFile);
    
      formData.append('name',"Document"); 

      for (const pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      const uploadRes = await axios.post(
        `${API_BASE_URL}/api/documents`,
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
        toast.error(uploadData?.message || 'Document upload failed.');
      }
      console.log('Upload Response:', uploadData);

      const docId = uploadData?.id;
      console.log('Uploaded Document ID:', docId);
      setDocumentId(docId);


     const signatureRes = await axios.post(
  `${API_BASE_URL}/api/signature`,
  {
    documentId: docId,
    redirectUrl: REDIRECT_URL,
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
        toast.error(signatureData?.message || 'Signature request failed.');
      }

      setSignatureId(signatureData?.id);
      console.log('Signature Response:', signatureData);
      console.log('Signature ID:', signatureData?.id);
      console.log('Signature URL:', signatureData?.signers?.[0]?.url);
      setSignatureUrl(signatureData?.signers?.[0]?.url);
      saveRequestToHistory(docId, signatureData?.id,fileName,signatureData?.signers?.[0]?.url,signatureData?.signers?.[0]?.displayName,signatureData.signers?.[0]?.status);
      toast.success('Document uploaded and signature initiated!');
      navigate(`/status/${signatureData?.id}/${docId}`);
       

    } catch (err) {
       if (err.response) {
   console.error('Backend error response:', err.response.data);

    const backendError = err.response.data.error || err.response.data;
    const message = backendError.message || JSON.stringify(backendError) || err.message;
    toast.error(`Error: ${message}`);
  } else {
  toast.error("Something went wrong. " + err.message);
  }
    } finally {
      setUploading(false);
      setIsLoading(false);
    }
  };



return (
  <div className="min-h-screen flex justify-center items-center bg-gray-50 px-4">
    {isLoading && <Loading />}
    
    <div className="flex flex-col gap-6 w-full sm:w-[80%] md:w-[60%] lg:w-[45%] p-8 border border-gray-200 rounded-3xl shadow-md bg-white items-center transition-all duration-300">
      <h2 className="text-2xl font-bold text-teal-700 text-center">
        Upload & Sign PDF
      </h2>

      <label
        htmlFor="pdf-upload"
        className="w-full text-center cursor-pointer px-6 py-3 text-white bg-teal-600 hover:bg-teal-700 text-lg font-semibold rounded-xl shadow transition duration-200"
      >
        📄 Upload & Start Signature
      </label>

      <input
        id="pdf-upload"
        type="file"
        accept="application/pdf"
        onChange={handleFileChange}
        className="hidden"
      />

      {fileName && (
        <div className="flex items-center gap-2 mt-2 text-sm text-gray-700 bg-gray-100 px-4 py-2 rounded-md w-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-teal-600"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M4 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V8l-4-4H4z" />
            <path d="M8 8h4v1H8V8zM8 10h4v1H8v-1zM8 12h2v1H8v-1z" />
          </svg>
          <span>Selected file: <strong>{fileName}</strong></span>
        </div>
      )}

      <ul className="text-sm text-gray-500 space-y-1 list-disc pl-6 w-full">
        <li>Only <code className="bg-gray-100 px-1 rounded">.pdf</code> files are allowed.</li>
        <li>Ensure credentials are stored in <code className="bg-gray-100 px-1 rounded">localStorage</code>:</li>
        <ul className="list-disc pl-6">
          <li><code>clientId</code></li>
          <li><code>clientSecret</code></li>
          <li><code>productInstanceId</code></li>
        </ul>
      </ul>
    </div>
  </div>
);

}

export default UploadSignStatus;
