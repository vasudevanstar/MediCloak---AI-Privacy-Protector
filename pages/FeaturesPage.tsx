import React from 'react';
import { DocumentSearchIcon, CpuChipIcon, ShieldExclamationIcon, LockClosedIcon } from '../components/icons/Icons';

const features = [
  {
    name: 'Advanced OCR Technology',
    description:
      'Utilizes Tesseract.js to accurately extract both printed and handwritten text from various document formats, including scanned PDFs and images.',
    icon: DocumentSearchIcon,
  },
  {
    name: 'AI-Powered PII Detection',
    description:
      "Powered by Google's Gemini model, our system goes beyond simple rules to understand context and accurately identify a wide range of sensitive data, ensuring clinical details are preserved.",
    icon: CpuChipIcon,
  },
  {
    name: 'Automated Redaction',
    description:
      'Seamlessly masks all detected sensitive information with "[REDACTED]", ensuring that crucial medical details remain untouched and legible for research or sharing.',
    icon: ShieldExclamationIcon,
  },
  {
    name: 'Client-Side Security',
    description:
      'All processing happens directly in your browser. Your files are never uploaded to a server, guaranteeing the highest level of privacy and security.',
    icon: LockClosedIcon,
  },
];

const FeaturesPage: React.FC = () => {
  return (
    <div className="py-12 bg-white sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-teal-600 font-semibold tracking-wide uppercase">Features</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            A better way to protect patient data
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            MediCloak is packed with powerful features designed to make medical data anonymization simple, secure, and effective.
          </p>
        </div>

        <div className="mt-10">
          <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
            {features.map((feature) => (
              <div key={feature.name} className="relative p-6 bg-gray-50 rounded-lg hover:shadow-md transition-shadow">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-teal-600 text-white">
                    <feature.icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">{feature.name}</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">{feature.description}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
};

export default FeaturesPage;