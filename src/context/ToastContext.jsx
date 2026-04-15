/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useCallback } from 'react';
import './Toast.css';
import { IconCheck, IconClose } from '../components/icons';

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <div className={`custom-toast custom-toast--${toast.type}`}>
          <div className="custom-toast__icon">
            {toast.type === 'success' ? <IconCheck size={20} color="#fff" /> : <IconClose size={20} color="#fff" />}
          </div>
          
          <p className="custom-toast__message">{toast.message}</p>
          
          <button 
            className="custom-toast__close" 
            onClick={() => setToast(null)}
            aria-label="Fechar notificação"
          >
            <IconClose size={16} color="#fff" />
          </button>
        </div>
      )}
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);