import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils/cn';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const Modal = ({ 
  isOpen, 
  onClose, 
  children, 
  title, 
  size = 'md',
  className = '',
  showCloseButton = true
}) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-[90vw]'
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0"
            onClick={handleBackdropClick}
          >
            {/* Backdrop */}
            <div className="fixed inset-0 bg-gray-900 bg-opacity-50 transition-opacity" />
            
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className={cn(
                "relative inline-block w-full text-left align-bottom bg-white rounded-lg shadow-xl transform transition-all sm:align-middle sm:w-full",
                sizeClasses[size],
                className
              )}
            >
              <div className="bg-white rounded-lg">
                {/* Header */}
                {(title || showCloseButton) && (
                  <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    {title && (
                      <h2 className="text-xl font-display font-bold text-gray-900">
                        {title}
                      </h2>
                    )}
                    {showCloseButton && (
                      <Button variant="ghost" onClick={onClose}>
                        <ApperIcon name="X" className="w-5 h-5" />
                      </Button>
                    )}
                  </div>
                )}
                
                {/* Content */}
                <div className={cn("p-6", title || showCloseButton ? "" : "pt-6")}>
                  {children}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Modal;