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

  console.log("Toast rendering:", { show, message, type });

  if (!show) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 16px',
        borderRadius: '8px',
        backgroundColor: type === 'success' ? '#16a34a' : '#dc2626',
        color: '#ffffff',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        transition: 'all 0.3s ease-in-out',
      }}
      className="transition-all duration-300"
    >
      {type === 'success' ? <CheckCircle size={20} /> : <XCircle size={20} />}
      <span className="text-sm font-medium">{message}</span>
      <button onClick={onClose} style={{ marginLeft: '8px', cursor: 'pointer', background: 'none', border: 'none', color: 'inherit' }} className="hover:opacity-80 transition-opacity">
        <X size={16} />
      </button>
    </div>
  );
}