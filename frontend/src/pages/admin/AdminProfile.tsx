import { useState } from 'react';

const InfoIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const CameraIcon = () => (
  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

export default function AdminProfile() {
  const [email, setEmail] = useState('a.vance@fitzone.com');
  const [showTooltip, setShowTooltip] = useState(false);

  const handleImageUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      const file = target.files?.[0];
      if (file) {
        alert(`Selected file: ${file.name}`);
      }
    };
    input.click();
  };

  return (
    <div className="p-4 lg:p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Admin Profile</h2>

      <div className="border-t border-gray-200 pt-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6 max-w-2xl">
          {/* Card Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
            <div className="relative">
              <button
                className="text-gray-400 hover:text-gray-600"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
              >
                <InfoIcon />
              </button>
              {showTooltip && (
                <div className="absolute right-0 top-8 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
                  Profile information
                </div>
              )}
            </div>
          </div>

          {/* Profile Content */}
          <div className="flex flex-col sm:flex-row items-start gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face"
                  alt="Admin avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                onClick={handleImageUpload}
                className="absolute bottom-0 right-0 w-7 h-7 bg-gray-800 rounded-full flex items-center justify-center text-white hover:bg-gray-700"
              >
                <CameraIcon />
              </button>
            </div>

            {/* Email Field */}
            <div className="flex-1 w-full">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-100 mt-6 pt-4">
            {/* Additional content can be added here */}
          </div>
        </div>
      </div>
    </div>
  );
}