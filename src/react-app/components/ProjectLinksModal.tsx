import { useState } from 'react';
import { X, Link, CheckCircle } from 'lucide-react';

interface ProjectLinksModalProps {
  taskTitle: string;
  onSave: (link1: string, link2?: string) => void;
  onClose: () => void;
}

export default function ProjectLinksModal({ taskTitle, onSave, onClose }: ProjectLinksModalProps) {
  const [link1, setLink1] = useState('');
  const [link2, setLink2] = useState('');
  const [error, setError] = useState('');

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!link1.trim()) {
      setError('First project link is required');
      return;
    }

    if (!isValidUrl(link1)) {
      setError('Please enter a valid URL for the first link');
      return;
    }

    if (link2.trim() && !isValidUrl(link2)) {
      setError('Please enter a valid URL for the second link');
      return;
    }

    onSave(link1.trim(), link2.trim() || undefined);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <form onSubmit={handleSubmit}>
          <div className="p-6 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <h2 className="text-xl font-semibold text-slate-800">Task Completed!</h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-4">
            <p className="text-slate-600">
              <span className="font-semibold text-slate-800">"{taskTitle}"</span> has been moved to Done. Please add the project link(s):
            </p>

            <div>
              <label htmlFor="link1" className="block text-sm font-medium text-slate-700 mb-2">
                Project Link 1 <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="url"
                  id="link1"
                  value={link1}
                  onChange={(e) => {
                    setLink1(e.target.value);
                    setError('');
                  }}
                  className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                  placeholder="https://project-link.com"
                  required
                  autoFocus
                />
              </div>
            </div>

            <div>
              <label htmlFor="link2" className="block text-sm font-medium text-slate-700 mb-2">
                Project Link 2 <span className="text-slate-400">(Optional)</span>
              </label>
              <div className="relative">
                <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="url"
                  id="link2"
                  value={link2}
                  onChange={(e) => setLink2(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                  placeholder="https://second-project-link.com"
                />
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}
          </div>

          <div className="p-6 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all font-medium"
            >
              Complete Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
