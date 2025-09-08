import React from 'react';
import { UploadIcon, DocumentSearchIcon, CpuChipIcon, ShieldCheckIcon, ArrowRightIcon } from '../components/icons/Icons';

const steps = [
  {
    name: '1. Upload',
    description: 'Securely upload your medical documents in PDF, JPG, PNG, or TXT format.',
    icon: UploadIcon,
  },
  {
    name: '2. OCR',
    description: 'Our system uses Optical Character Recognition (OCR) to extract text from images and scanned PDFs.',
    icon: DocumentSearchIcon,
  },
  {
    name: '3. AI Detection',
    description: 'A powerful AI model analyzes the text to intelligently identify Personal Identifiable Information (PII) while distinguishing it from clinical data.',
    icon: CpuChipIcon,
  },
  {
    name: '4. Redaction',
    description: 'Sensitive information is automatically masked, creating a privacy-safe version of your document while preserving medical data.',
    icon: ShieldCheckIcon,
  },
];

const HowItWorksPage: React.FC = () => {
  return (
    <div className="bg-white py-12 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-base font-semibold text-teal-600">Our Process</p>
          <h1 className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
            How MediCloak Protects Your Data
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
            A simple, transparent, and powerful four-step process to ensure patient confidentiality.
          </p>
        </div>

        <div className="mt-16">
          <div className="flex flex-col md:flex-row items-center justify-center space-y-8 md:space-y-0 md:space-x-8">
            {steps.map((step, index) => (
              <React.Fragment key={step.name}>
                <div className="flex flex-col items-center text-center max-w-xs">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-16 w-16 rounded-full bg-teal-600 text-white">
                      <step.icon className="h-8 w-8" aria-hidden="true" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">{step.name}</h3>
                    <p className="mt-2 text-base text-gray-500">{step.description}</p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:block">
                     <ArrowRightIcon className="h-8 w-8 text-gray-300" />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorksPage;