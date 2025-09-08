
import React from 'react';



const teamMembers = [
  {
    name: 'NIRANJANA SRI S',
    role: 'Lead Developer & AI Architect',
    imageUrl: 'https://as1.ftcdn.net/v2/jpg/12/21/29/56/1000_F_1221295629_MaAFQFErOPetrasNBIkWYDEJ8Kumz3rH.jpg',
  },
  {
    name: 'SHARANYA S R',
    role: 'UI/UX Designer',
    imageUrl: 'https://as1.ftcdn.net/v2/jpg/12/21/25/32/1000_F_1221253218_LU3uUfYROKmnEVDScShOgxX3mHbwNKF1.jpg',
  },
  {
    name: 'NITHYA MEENAKSHI S',
    role: 'Healthcare Data Consultant',
    imageUrl: 'https://as1.ftcdn.net/v2/jpg/12/21/25/32/1000_F_1221253205_WxBlQ1yScI7bYK3rIY0RtZKi1IlLM6c8.jpg',
  },
   {
    name: 'SUJATHA S',
    role: 'Project Manager',
    imageUrl: 'https://as1.ftcdn.net/v2/jpg/12/21/29/56/1000_F_1221295624_4QWeqULE50h4fZEw1qeUPEglxwW6C6i8.jpg',
  },
];

const AboutPage: React.FC = () => {
  return (
    <div className="bg-white">
      <div className="mx-auto py-12 px-4 max-w-7xl sm:px-6 lg:px-8 lg:py-24">
        <div className="space-y-12 lg:grid lg:grid-cols-3 lg:gap-8 lg:space-y-0">
          <div className="space-y-5 sm:space-y-4">
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-gray-900">About Team ECHO</h2>
            <p className="text-xl text-gray-500">
              We are "Team ECHO" – Engineers & Coders for Healthcare Operations. We believe in the power of technology to solve critical challenges in the medical field.
            </p>
          </div>
          <div className="lg:col-span-2">
             <div className="space-y-5 sm:space-y-4">
               
                <h3 className="text-2xl font-bold tracking-tight sm:text-3xl text-gray-900">Our Mission</h3>
                <p className="text-lg text-gray-500">
                    Our mission is to build innovative, secure, and user-friendly tools that empower healthcare professionals and researchers. We aim to bridge the gap between advanced technology and practical medical needs, ensuring that data privacy and utility can coexist harmoniously. MediCloak is our first step towards a future where medical data can be used for good, without compromising individual privacy.
                </p>
            </div>
          </div>
        </div>

        <div className="mt-16">
            <div className="text-center mb-12">
                <h3 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Meet the Team</h3>
            </div>
            <ul
                role="list"
                className="space-y-12 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:gap-y-12 sm:space-y-0 lg:grid-cols-4 lg:gap-x-8"
            >
                {teamMembers.map((person) => (
                <li key={person.name}>
                    <div className="space-y-4">
                    <div className="aspect-w-3 aspect-h-3">
                        <img className="object-cover shadow-lg rounded-lg" src={person.imageUrl} alt="" />
                    </div>

                    <div className="space-y-2">
                        <div className="text-lg leading-6 font-medium space-y-1">
                        <h3 className="text-gray-900">{person.name}</h3>
                        <p className="text-teal-600">{person.role}</p>
                        </div>
                    </div>
                    </div>
                </li>
                ))}
            </ul>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;