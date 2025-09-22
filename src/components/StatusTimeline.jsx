import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { ClockIcon } from '@heroicons/react/24/outline';
import React from 'react';

const StatusTimeline = ({ status, signerStatus }) => {
  const steps = [
    { title: 'Document Uploaded', done: true },
    { title: 'Signature Requested', done: true },
    {
      title: 'Signing In Progress',
      done: ['sign_in_progress', 'in_progress'].includes((signerStatus || status)?.toLowerCase())
    },
    {
      title: 'Document Signed',
      done: (signerStatus?.toLowerCase() === 'signed') || (status?.toLowerCase() === 'signed')
    }
  ];

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold text-teal-800 mb-4">Signature Progress</h3>
      <ol className="relative border-l border-teal-500">
        {steps.map((step, index) => (
          <li key={index} className="mb-10 ml-6">
            <span className="absolute -left-3 flex items-center justify-center w-6 h-6 bg-white rounded-full ring-2 ring-teal-500">
              {step.done ? (
                <CheckCircleIcon className="h-6 w-6 text-teal-600" />
              ) : (
                <ClockIcon className="h-6 w-6 text-gray-400" />
              )}
            </span>
            <p className={`text-lg font-medium ${step.done ? 'text-teal-800' : 'text-gray-600'}`}>
              {step.title}
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default StatusTimeline;
