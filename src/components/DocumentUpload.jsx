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
     
const safeFilename = pdfFile.name.replace(/[()]/g, '') || 'uploaded.pdf';
setFileName(safeFilename); 
formData.append('name', safeFilename); 

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
        toast.error(uploadData?.message || 'Document upload failed.');
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
    <div className="flex flex-col gap-4 w-full sm:w-[75%] md:w-[60%] lg:w-[50%] p-6 border rounded-3xl shadow bg-white items-center">
      <h2 className="text-2xl font-semibold text-gray-800">Upload & Sign PDF</h2>

      <label
        htmlFor="pdf-upload"
        className="cursor-pointer px-6 py-3 text-white bg-teal-600 hover:bg-teal-700 text-lg font-medium rounded-xl shadow transition duration-200"
      >
        Upload & Start Signature
      </label>
      <input
        id="pdf-upload"
        type="file"
        accept="application/pdf"
        onChange={handleFileChange}
        className="hidden"
      />

      {fileName && (
        <p className="text-sm text-gray-600">Selected file: {fileName}</p>
      )}

      <ul className="list-disc text-sm text-gray-500 pl-5">
        <li>Only PDF files are allowed.</li>
        <li>
          Ensure credentials (
          <code>clientId</code>, <code>clientSecret</code>,{' '}
          <code>productInstanceId</code>) are set in localStorage.
        </li>
      </ul>
    </div>
  </div>
);

}

export default UploadSignStatus;
