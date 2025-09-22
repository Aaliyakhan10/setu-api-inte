import React from 'react'
import { useNavigate } from 'react-router-dom'

const Hero = () => {
  const navigate = useNavigate()
  return (
    <div className='flex flex-col gap-6 w-full h-[100vh] sm:w-[90%] md:w-[85%] lg:w-[85%] p-6 rounded shadow bg-white items-center mx-auto mt-10 text-center'>
      <h1 className='text-4xl font-bold mb-4 text-teal-800'>
        E-sign Your Documents with Aadhaar — Secure, Simple & Legally Valid
      </h1>
      <p className='text-lg text-gray-700 max-w-3xl'>
        Digitally sign your PDFs in minutes using your Aadhaar number and OTP — no printing, scanning, or hassle.
      </p>
      <p className='text-2xl text-teal-900 max-w-4xl mt-4'>
        With Setu’s Aadhaar eSign integration, signing documents online is seamless and trusted. Upload your PDF, authenticate with an OTP sent to your Aadhaar-linked mobile, and get your document legally signed — all in one secure flow.
      </p>
      <button
        onClick={() => navigate('sign-doc')}
        className='mt-8 px-8 py-3 bg-teal-600 hover:bg-teal-700 text-white text-lg font-medium rounded-xl shadow transition duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2'
        aria-label="Get Started - Upload PDF"
      >
        Get Started - Upload PDF
      </button>
    </div>
  )
}

export default Hero
