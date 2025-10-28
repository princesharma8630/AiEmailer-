
import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import { Signature } from '../../type/signature.type';

interface SignatureCardProps {
  signature: Signature;
  onEdit: (signature: Signature) => void;
  onDelete: (signature: Signature) => void;
}

export const SignatureCard: React.FC<SignatureCardProps> = ({
  signature,
  onEdit,
  onDelete
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-lg">
          ✍️
        </div>
        <div>
          <h4 className="font-semibold text-gray-900">{signature.name}</h4>
          <p className="text-sm text-gray-500">Created on {formatDate(signature.createdAt)}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onEdit(signature)}
          className="flex items-center gap-1 px-3 py-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition text-sm"
        >
          <Edit2 size={14} />
          Edit
        </button>
        <button
          onClick={() => onDelete(signature)}
          className="flex items-center gap-1 px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-lg transition text-sm"
        >
          <Trash2 size={14} />
          Delete
        </button>
      </div>
    </div>
  );
};

