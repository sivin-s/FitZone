import { useEffect } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';

interface ToastProps {
  show: boolean;
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

export default function Toast({ show, message, type, onClose }: ToastProps) {
  // Auto-close after 4 seconds
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onClose, 4000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className={`fixed top-5 right-5 z-[100] flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg text-white transition-all duration-300 ${
      type === 'success' ? 'bg-green-600' : 'bg-red-600'
    }`}>
      {type === 'success' ? <CheckCircle size={20} /> : <XCircle size={20} />}
      <span className="text-sm font-medium">{message}</span>
      <button onClick={onClose} className="ml-2 hover:opacity-80 transition-opacity">
        <X size={16} />
      </button>
    </div>
  );
}