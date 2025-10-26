// component/bulkEmail/UploadedFileCard.tsx

import { FileText, X, CheckCircle, AlertCircle } from 'lucide-react';
import { formatFileSize } from '../../Utils/formatters';
import { CSVValidationResult } from '../../types/bulkEmail.types';

interface UploadedFileCardProps {
  fileName: string;
  fileSize: number;
  validation?: CSVValidationResult;
  onRemove: () => void;
}

export default function UploadedFileCard({
  fileName,
  fileSize,
  validation,
  onRemove,
}: UploadedFileCardProps) {
  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-white">
      {/* File Info */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-green-100 p-3 rounded-lg">
            <FileText className="text-green-600" size={24} />
          </div>
          <div>
            <p className="font-semibold text-gray-800">{fileName}</p>
            <p className="text-sm text-gray-500">{formatFileSize(fileSize)}</p>
          </div>
        </div>
        <button
          onClick={onRemove}
          className="text-gray-400 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded"
          title="Remove file"
        >
          <X size={20} />
        </button>
      </div>

      {/* Validation Results */}
      {validation && (
        <div className="space-y-2">
          {/* Success Message */}
          {validation.isValid && (
            <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg">
              <CheckCircle size={20} />
              <span className="text-sm font-medium">
                {validation.totalValid} email {validation.totalValid === 1 ? 'entry' : 'entries'} found
              </span>
            </div>
          )}

          {/* Errors */}
          {validation.errors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex items-start gap-2 text-red-700">
                <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium text-sm mb-1">Errors:</p>
                  <ul className="text-sm space-y-1">
                    {validation.errors.map((error, index) => (
                      <li key={index}>• {error}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Warnings */}
          {validation.warnings.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <div className="flex items-start gap-2 text-yellow-700">
                <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium text-sm mb-1">
                    Warnings ({validation.warnings.length}):
                  </p>
                  <ul className="text-sm space-y-1 max-h-32 overflow-y-auto">
                    {validation.warnings.slice(0, 5).map((warning, index) => (
                      <li key={index}>• {warning}</li>
                    ))}
                    {validation.warnings.length > 5 && (
                      <li className="text-yellow-600 font-medium">
                        ... and {validation.warnings.length - 5} more
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            <div className="text-center p-2 bg-gray-50 rounded">
              <p className="text-2xl font-bold text-gray-800">{validation.totalValid}</p>
              <p className="text-xs text-gray-600">Valid</p>
            </div>
            <div className="text-center p-2 bg-gray-50 rounded">
              <p className="text-2xl font-bold text-gray-800">{validation.totalInvalid}</p>
              <p className="text-xs text-gray-600">Invalid</p>
            </div>
            <div className="text-center p-2 bg-gray-50 rounded">
              <p className="text-2xl font-bold text-gray-800">
                {validation.totalValid + validation.totalInvalid}
              </p>
              <p className="text-xs text-gray-600">Total</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}