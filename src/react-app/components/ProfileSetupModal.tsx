import { useState } from 'react';
import { CITIES, CreateUserProfile } from '@/shared/types';

interface ProfileSetupModalProps {
  onSave: (profile: CreateUserProfile) => void;
}

export default function ProfileSetupModal({ onSave }: ProfileSetupModalProps) {
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !city || !email.trim()) return;

    onSave({
      name: name.trim(),
      city,
      email: email.trim(),
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <form onSubmit={handleSubmit}>
          <div className="p-6 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-800">Update Your Profile</h2>
            </div>
            <p className="text-sm text-slate-600 mt-2">Update your profile information below</p>
          </div>

          <div className="p-6 space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                Your Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="Mohammed"
                required
                autoFocus
              />
            </div>

            <div>
              <label htmlFor="city" className="block text-sm font-medium text-slate-700 mb-2">
                Your City
              </label>
              <select
                id="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white"
                required
              >
                <option value="">Select a city</option>
                {CITIES.map((cityOption) => (
                  <option key={cityOption} value={cityOption}>
                    {cityOption}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                Working Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="mohammed.yousif@stirlingschools.co.uk"
                required
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-700">
                <span className="font-semibold">One-time setup:</span> This information will be saved and automatically filled in future task requests.
              </p>
            </div>
          </div>

          <div className="p-6 border-t border-slate-100">
            <button
              type="submit"
              disabled={!name.trim() || !city || !email.trim()}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
            >
              Update Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
