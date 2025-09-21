import React, { useEffect, useState } from 'react'

const SettingForm = () => {
    const [clientId, setClientId] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [productInstanceId, setProductInstanceId] = useState('');
     
     const handleSave = () => {
    localStorage.setItem('clientId', clientId);
    localStorage.setItem('clientSecret', clientSecret);
    localStorage.setItem('productInstanceId', productInstanceId);
    alert('Credentials saved to localStorage.');
  };
     useEffect(() => {
    setClientId(localStorage.getItem('clientId') || '');
    setClientSecret(localStorage.getItem('clientSecret') || '');
    setProductInstanceId(localStorage.getItem('productInstanceId') || '');
  }, []);
 const handleClear = () => {
    localStorage.removeItem('clientId');
    localStorage.removeItem('clientSecret');
    localStorage.removeItem('productInstanceId');
    setClientId('');
    setClientSecret('');
    setProductInstanceId('');
    alert('Credentials cleared.');
  };
  return (
    <>
    <div className='max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md'>
      <h2>API Credentials Settings</h2>
     <div className='flex flex-col'>

      <label>
        x-client-id:
        <input
          type="text"
          value={clientId}
          onChange={(e) => setClientId(e.target.value)}
         className='mb-4 border-2 border-gray-300 rounded-md p-2'
        />
      </label>

      <label>
        x-client-secret:
        <input
          type="password"
          value={clientSecret}
          onChange={(e) => setClientSecret(e.target.value)}
    
           className='mb-4 border-2 border-gray-300 rounded-md p-2'
        />
      </label>

      <label>
        x-product-instance-id:
        <input
          type="text"
          value={productInstanceId}
          onChange={(e) => setProductInstanceId(e.target.value)}

          className='mb-4 border-2 border-gray-300 rounded-md p-2'
        />
      </label>

      <div className='flex gap-4 mb-4'>
        <button onClick={handleSave}  className='border-2 p-2 rounded-3xl'>Save Credentials</button>
        <button onClick={handleClear} className='border-2 p-2 rounded-3xl'>Clear Credentials</button>
      </div>

      <div
        style={{
          backgroundColor: '#fff3cd',
          border: '1px solid #ffeeba',
          padding: '1rem',
          borderRadius: '4px'
        }}
      >
  
        <strong>🔐 Security Notice:</strong>
        <p>
          Your Setu API credentials are stored in your browser's <code>localStorage</code> for this demo.
        </p>
        <p>
          ⚠️ This is <strong>not secure</strong> and should <strong>never</strong> be used in production environments.
        </p>
        <p>
          This is only for educational and demonstration purposes as part of the <em>Setu API Integration Assignment</em>.
        </p>
      </div>
    </div>
       </div>
    </>
  )
}

export default SettingForm