// pages/scheduleEmails/scheduleEmails.tsx

import  { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { AppDispatch, RootState } from '../../redux/store';
import  {
  scheduleCampaign,
  fetchScheduledCampaigns,
  cancelScheduledCampaign,
  setScheduledDate,
  setScheduledTime,
  setTimezone,
  setCampaignSubject,
  setCampaignContent,
  setRecipients,
  setUploadedFile,
  setCSVValidation,
  clearError,
  clearSuccessMessage,
  clearUploadedFile,
} from '../../redux/slices/scheduleEmailSlice/';
import { bulkEmailService } from '../../services/bulkEmailService';
import { scheduleEmailService } from '../../services/scheduleEmail.types/index';

// Components
import CampaignTabs from '../../component/bulkEmail/CampaignTabs';
import FileUploadZone from '../../component/bulkEmail/FileUploadZone';
import UploadedFileCard from '../../component/bulkEmail/UploadedFileCard';
import EmailContentEditor from '../../component/bulkEmail/EmailContentEditor';
import RecipientPreview from '../../component/bulkEmail/RecipientPreview';
import DateTimePicker from '../../component/scheduleEmails/DateTimePicker';
import TimeZoneSelector from '../../component/scheduleEmails/TimeZoneSelector';
import ScheduledCampaignCard from '../../component/scheduleEmails/ScheduledCampaignCard';

// Icons
import { AlertCircle, CheckCircle, X, Calendar, RefreshCw } from 'lucide-react';

type Step = 'upload' | 'compose' | 'schedule';

export default function ScheduleEmails() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  // Redux state
  const {
    uploadedFile,
    csvValidation,
    recipients,
    campaignSubject,
    campaignContent,
    scheduledDate,
    scheduledTime,
    timezone,
    scheduledCampaigns,
    isValidatingCSV,
    isScheduling,
    isLoadingCampaigns,
    isCancelling,
    error,
    successMessage,
  } = useSelector((state: RootState) => state.scheduleEmail);

  // Local state
  const [currentStep, setCurrentStep] = useState<Step>('upload');
  const [showScheduledList, setShowScheduledList] = useState(false);

  // Load scheduled campaigns on mount
  useEffect(() => {
    dispatch(fetchScheduledCampaigns());
  }, [dispatch]);

  // Clear messages
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
    const validation = await bulkEmailService.parseCSVFile(file);
    
    dispatch(setUploadedFile({
      file,
      name: file.name,
      size: file.size,
      type: file.type,
    }));
    dispatch(setCSVValidation(validation));
    
    if (validation.isValid) {
      dispatch(setRecipients(validation.recipients));
    }
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
      setCurrentStep('schedule');
    }
  };

  // Handle previous step
  const handlePreviousStep = () => {
    if (currentStep === 'compose') {
      setCurrentStep('upload');
    } else if (currentStep === 'schedule') {
      setCurrentStep('compose');
    }
  };

  // Handle schedule campaign
  const handleScheduleCampaign = async () => {
    // Validation
    if (!scheduledDate || !scheduledTime) {
      alert('Please select date and time');
      return;
    }

    // Combine date and time
    const scheduledDateTime = `${scheduledDate}T${scheduledTime}`;
    
    // Validate schedule time
    const validation = scheduleEmailService.validateScheduleTime(scheduledDateTime);
    if (!validation.isValid) {
      alert(validation.error);
      return;
    }

    try {
      await dispatch(
        scheduleCampaign({
          name: `Scheduled Campaign - ${new Date().toLocaleDateString()}`,
          subject: campaignSubject,
          emailContent: campaignContent,
          recipients: recipients,
          scheduledAt: scheduledDateTime,
          timezone: timezone,
        })
      ).unwrap();

      // Refresh scheduled campaigns list
      dispatch(fetchScheduledCampaigns());

      // Reset form
      setTimeout(() => {
        setCurrentStep('upload');
        dispatch(clearUploadedFile());
      }, 2000);
    } catch (error) {
      console.error('Failed to schedule campaign:', error);
    }
  };

  // Handle cancel scheduled campaign
  const handleCancelCampaign = async (campaignId: string) => {
    if (window.confirm('Are you sure you want to cancel this scheduled campaign?')) {
      await dispatch(cancelScheduledCampaign(campaignId));
    }
  };

  // Handle refresh campaigns
  const handleRefreshCampaigns = () => {
    dispatch(fetchScheduledCampaigns());
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Schedule Email Campaign</h1>
          <p className="text-gray-600">
            Schedule emails to be sent at a specific date and time
          </p>
        </div>

        {/* Campaign Tabs */}
        <CampaignTabs />

        {/* Toggle View Button */}
        <div className="mb-6 flex justify-end">
          <button
            onClick={() => setShowScheduledList(!showScheduledList)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Calendar size={18} />
            {showScheduledList ? 'Create New Schedule' : 'View Scheduled Campaigns'}
          </button>
        </div>

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

        {/* Main Content */}
        {showScheduledList ? (
          // Scheduled Campaigns List
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                Scheduled Campaigns ({scheduledCampaigns.length})
              </h2>
              <button
                onClick={handleRefreshCampaigns}
                disabled={isLoadingCampaigns}
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
              >
                <RefreshCw size={16} className={isLoadingCampaigns ? 'animate-spin' : ''} />
                Refresh
              </button>
            </div>

            {isLoadingCampaigns ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                <p className="text-gray-600 mt-4">Loading campaigns...</p>
              </div>
            ) : scheduledCampaigns.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="mx-auto text-gray-400 mb-4" size={48} />
                <p className="text-gray-600 mb-2">No scheduled campaigns</p>
                <p className="text-sm text-gray-500">
                  Create your first scheduled campaign to get started
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {scheduledCampaigns.map((campaign) => (
                  <ScheduledCampaignCard
                    key={campaign.id}
                    campaign={campaign}
                    onCancel={handleCancelCampaign}
                    isCancelling={isCancelling}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          // Create New Schedule Form
          <>
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
                        : currentStep === 'schedule'
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
                      currentStep === 'schedule' ? 'bg-blue-500' : 'bg-gray-300'
                    }`}
                  ></div>
                </div>

                {/* Step 3 */}
                <div className="flex items-center flex-1">
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold ${
                      currentStep === 'schedule'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-300 text-gray-600'
                    }`}
                  >
                    3
                  </div>
                  <div className="ml-3">
                    <p
                      className={`text-sm font-medium ${
                        currentStep === 'schedule' ? 'text-blue-600' : 'text-gray-600'
                      }`}
                    >
                      Set Schedule
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Step Content */}
            <div className="space-y-6">
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
                            onDownloadSample={() => bulkEmailService.downloadSampleCSV()}
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
                      Continue to Schedule →
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Set Schedule */}
              {currentStep === 'schedule' && (
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h2 className="text-xl font-semibold text-gray-800 mb-6">
                    Step 3: Set Schedule
                  </h2>

                  <div className="space-y-6">
                    {/* Date & Time Picker */}
                    <DateTimePicker
                      date={scheduledDate}
                      time={scheduledTime}
                      onDateChange={(value) => dispatch(setScheduledDate(value))}
                      onTimeChange={(value) => dispatch(setScheduledTime(value))}
                    />

                    {/* Timezone Selector */}
                    <TimeZoneSelector
                      value={timezone}
                      onChange={(value) => dispatch(setTimezone(value))}
                    />

                    {/* Campaign Summary */}
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <h4 className="font-semibold text-gray-800 mb-3">Campaign Summary</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Subject:</span>
                          <span className="font-medium text-gray-800">{campaignSubject}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Recipients:</span>
                          <span className="font-medium text-gray-800">{recipients.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Scheduled for:</span>
                          <span className="font-medium text-gray-800">
                            {scheduledDate && scheduledTime
                              ? new Date(`${scheduledDate}T${scheduledTime}`).toLocaleString()
                              : 'Not set'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Timezone:</span>
                          <span className="font-medium text-gray-800">{timezone}</span>
                        </div>
                      </div>
                    </div>

                    {/* Warning */}
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex gap-3">
                        <AlertCircle className="text-yellow-600 flex-shrink-0" size={20} />
                        <div className="text-sm text-yellow-800">
                          <p className="font-medium mb-1">Important:</p>
                          <ul className="space-y-1 list-disc list-inside">
                            <li>Emails will be sent automatically at the scheduled time</li>
                            <li>You can cancel the schedule before it executes</li>
                            <li>All emails will include tracking for analytics</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4">
                      <button
                        onClick={handlePreviousStep}
                        disabled={isScheduling}
                        className="flex-1 px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                      >
                        ← Back to Compose
                      </button>
                      <button
                        onClick={handleScheduleCampaign}
                        disabled={isScheduling || !scheduledDate || !scheduledTime}
                        className="flex-1 px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {isScheduling ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            Scheduling...
                          </>
                        ) : (
                          <>
                            <Calendar size={20} />
                            Schedule Campaign
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}