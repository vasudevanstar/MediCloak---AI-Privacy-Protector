
import React from 'react';

const ContactPage: React.FC = () => {
    
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    alert("Thank you for your message! This is a demo form.");
  };

  return (
    <div className="bg-white py-12 sm:py-24 px-4 sm:px-6 lg:px-8">
      <div className="relative max-w-xl mx-auto">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">Contact Us</h2>
          <p className="mt-4 text-lg leading-6 text-gray-500">
            Have questions or feedback? We'd love to hear from you.
          </p>
        </div>
        <div className="mt-12">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8">
            <div className="sm:col-span-2">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full name
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="name"
                  id="name"
                  autoComplete="name"
                  required
                  className="py-3 px-4 block w-full shadow-sm focus:ring-teal-500 focus:border-teal-500 border-gray-300 rounded-md"
                />
              </div>
            </div>
            
            <div className="sm:col-span-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="py-3 px-4 block w-full shadow-sm focus:ring-teal-500 focus:border-teal-500 border-gray-300 rounded-md"
                />
              </div>
            </div>
            
            <div className="sm:col-span-2">
              <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                Message
              </label>
              <div className="mt-1">
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  required
                  className="py-3 px-4 block w-full shadow-sm focus:ring-teal-500 focus:border-teal-500 border border-gray-300 rounded-md"
                  defaultValue={''}
                />
              </div>
            </div>
            <div className="sm:col-span-2">
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
              >
                Let's talk
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
