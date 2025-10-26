// pages/bulkEmail/bulkEmail.tsx

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AppDispatch, RootState } from '../../redux/store';
import {
  validateCSVFile,
  setCampaignSubject,
  setCampaignContent,
  createCampaign,
  startCampaign,
  clearUploadedFile,
  clearError,
  clearSuccessMessage,
} from '../../redux/slices/bulkEmailSlice/bulkEmailSlice';
import { ROUTES } from '../../constants/routerConstant';
import { bulkEmailService } from '../../services/bulkEmailServices';

// Components
import CampaignTabs from '../../component/bulkEmail/CampaignTabs';
import FileUploadZone from '../../component/bulkEmail/FileUploadZone';
import UploadedFileCard from '../../component/bulkEmail/UploadedFileCard';
import EmailContentEditor from '../../component/bulkEmail/EmailContentEditor';
import RecipientPreview from '../../component/bulkEmail/RecipientPreview';
import CampaignSummary from '../../component/bulkEmail/CampaignSummary';

// Icons
import { AlertCircle, CheckCircle, X } from 'lucide-react';

type Step = 'upload' | 'compose' | 'review';

export default function BulkEmail() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  // Redux state
  const {
    uploadedFile,
    csvValidation,
    isValidatingCSV,
    campaignSubject,
    campaignContent,
    recipients,
    isCreating,
    isStarting,
    error,
    successMessage,
    activeCampaignId,
  } = useSelector((state: RootState) => state.bulkEmail);

  // Local state
  const [currentStep, setCurrentStep] = useState<Step>('upload');
  const [showSummary, setShowSummary] = useState(false);

  // Clear messages on mount
  useEffect(() => {
    dispatch(clearError());
    dispatch(clearSuccessMessage());
  }, [dispatch]);

  // Auto-dismiss success messages
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        dispatch(clearSuccessMessage());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, dispatch]);

  // Handle file upload
  const handleFileSelect = async (file: File) => {
    await dispatch(validateCSVFile(file));
  };

  // Handle remove file
  const handleRemoveFile = () => {
    dispatch(clearUploadedFile());
    setCurrentStep('upload');
  };

  // Handle next step
  const handleNextStep = () => {
    if (currentStep === 'upload' && csvValidation?.isValid) {
      setCurrentStep('compose');
    } else if (currentStep === 'compose') {
      if (!campaignSubject.trim()) {
        alert('Please enter an email subject');
        return;
      }
      if (!campaignContent.trim()) {
        alert('Please enter email content');
        return;
      }
      setShowSummary(true);
    }
  };

  // Handle previous step
  const handlePreviousStep = () => {
    if (currentStep === 'compose') {
      setCurrentStep('upload');
    }
  };

  // Handle campaign confirmation
  const handleConfirmCampaign = async () => {
    try {
      // Create campaign
      const result = await dispatch(
        createCampaign({
          name: `Campaign - ${new Date().toLocaleDateString()}`,
          subject: campaignSubject,
          emailContent: campaignContent,
          recipients: recipients,
        })
      ).unwrap();

      // Start sending
      await dispatch(startCampaign(result.campaignId)).unwrap();

      // Redirect to tracking page
      setTimeout(() => {
        navigate(`${ROUTES.CAMPAIGN_TRACKING.replace(':campaignId', result.campaignId)}`);
      }, 2000);
    } catch (error) {
      console.error('Failed to start campaign:', error);
    }
  };

  // Handle download sample CSV
  const handleDownloadSample = () => {
    bulkEmailService.downloadSampleCSV();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Bulk Email Campaign</h1>
          <p className="text-gray-600">
            Send personalized emails to multiple recipients with tracking
          </p>
        </div>

        {/* Campaign Tabs */}
        <CampaignTabs />

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="text-red-500 flex-shrink-0" size={20} />
            <div className="flex-1">
              <p className="text-red-800 font-medium">Error</p>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
            <button
              onClick={() => dispatch(clearError())}
              className="text-red-400 hover:text-red-600"
            >
              <X size={20} />
            </button>
          </div>
        )}

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
            <CheckCircle className="text-green-500 flex-shrink-0" size={20} />
            <div className="flex-1">
              <p className="text-green-800 font-medium">Success</p>
              <p className="text-green-700 text-sm">{successMessage}</p>
            </div>
            <button
              onClick={() => dispatch(clearSuccessMessage())}
              className="text-green-400 hover:text-green-600"
            >
              <X size={20} />
            </button>
          </div>
        )}

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {/* Step 1 */}
            <div className="flex items-center flex-1">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold ${
                  currentStep === 'upload'
                    ? 'bg-blue-500 text-white'
                    : csvValidation?.isValid
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-300 text-gray-600'
                }`}
              >
                1
              </div>
              <div className="ml-3">
                <p
                  className={`text-sm font-medium ${
                    currentStep === 'upload' ? 'text-blue-600' : 'text-gray-600'
                  }`}
                >
                  Upload CSV
                </p>
              </div>
            </div>

            {/* Connector */}
            <div className="flex-1 h-1 bg-gray-300 mx-4">
              <div
                className={`h-full transition-all ${
                  currentStep !== 'upload' ? 'bg-blue-500' : 'bg-gray-300'
                }`}
              ></div>
            </div>

            {/* Step 2 */}
            <div className="flex items-center flex-1">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold ${
                  currentStep === 'compose'
                    ? 'bg-blue-500 text-white'
                    : currentStep === 'review'
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-300 text-gray-600'
                }`}
              >
                2
              </div>
              <div className="ml-3">
                <p
                  className={`text-sm font-medium ${
                    currentStep === 'compose' ? 'text-blue-600' : 'text-gray-600'
                  }`}
                >
                  Compose Email
                </p>
              </div>
            </div>

            {/* Connector */}
            <div className="flex-1 h-1 bg-gray-300 mx-4">
              <div
                className={`h-full transition-all ${
                  currentStep === 'review' ? 'bg-blue-500' : 'bg-gray-300'
                }`}
              ></div>
            </div>

            {/* Step 3 */}
            <div className="flex items-center flex-1">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold ${
                  showSummary
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-300 text-gray-600'
                }`}
              >
                3
              </div>
              <div className="ml-3">
                <p
                  className={`text-sm font-medium ${
                    showSummary ? 'text-blue-600' : 'text-gray-600'
                  }`}
                >
                  Review & Send
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Show Summary Modal */}
          {showSummary && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                <CampaignSummary
                  subject={campaignSubject}
                  content={campaignContent}
                  recipients={recipients}
                  onConfirm={handleConfirmCampaign}
                  onCancel={() => setShowSummary(false)}
                  isLoading={isCreating || isStarting}
                />
              </div>
            </div>
          )}

          {/* Step 1: Upload CSV */}
          {currentStep === 'upload' && (
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Step 1: Upload Recipient List
              </h2>

              {!uploadedFile ? (
                <FileUploadZone
                  onFileSelect={handleFileSelect}
                  isLoading={isValidatingCSV}
                />
              ) : (
                <div className="space-y-4">
                  <UploadedFileCard
                    fileName={uploadedFile.name}
                    fileSize={uploadedFile.size}
                    validation={csvValidation || undefined}
                    onRemove={handleRemoveFile}
                  />

                  {csvValidation?.isValid && recipients.length > 0 && (
                    <>
                      <RecipientPreview
                        recipients={recipients}
                        onDownloadSample={handleDownloadSample}
                      />

                      <div className="flex justify-end">
                        <button
                          onClick={handleNextStep}
                          className="px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
                        >
                          Continue to Compose Email →
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Info Box */}
              <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800 font-medium mb-2">
                  CSV Format Requirements:
                </p>
                <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
                  <li>Required column: <code className="bg-blue-100 px-1 rounded">email</code></li>
                  <li>Optional columns: <code className="bg-blue-100 px-1 rounded">name</code>, <code className="bg-blue-100 px-1 rounded">company</code></li>
                  <li>Maximum file size: 10MB</li>
                  <li>Maximum recipients: 10,000</li>
                </ul>
                <button
                  onClick={handleDownloadSample}
                  className="mt-3 text-sm text-blue-600 hover:text-blue-700 font-medium underline"
                >
                  Download Sample CSV Template
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Compose Email */}
          {currentStep === 'compose' && (
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Step 2: Compose Your Email
              </h2>

              <EmailContentEditor
                subject={campaignSubject}
                content={campaignContent}
                onSubjectChange={(value) => dispatch(setCampaignSubject(value))}
                onContentChange={(value) => dispatch(setCampaignContent(value))}
              />

              {/* Action Buttons */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={handlePreviousStep}
                  className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  ← Back to Upload
                </button>
                <button
                  onClick={handleNextStep}
                  disabled={!campaignSubject.trim() || !campaignContent.trim()}
                  className="px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Review Campaign →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}