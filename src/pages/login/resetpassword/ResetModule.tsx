import React from "react";

interface ResetPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ResetPasswordModal: React.FC<ResetPasswordModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null; // Don't render if not open

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm"
        onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
      >
        <h2 className="text-lg font-semibold mb-4">Reset Password</h2>
        
        <input
          type="email"
          placeholder="Enter your email"
          className="w-full border rounded p-2 mb-4"
        />
        
        <button 
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          onClick={onClose}
        >
          Send Reset Link
        </button>

        <button 
          className="w-full text-gray-600 mt-2"
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ResetPasswordModal;
