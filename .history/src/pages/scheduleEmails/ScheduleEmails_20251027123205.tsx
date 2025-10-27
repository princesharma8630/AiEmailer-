// pages/scheduleEmails/scheduleEmails.tsx

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AppDispatch, RootState } from '../../redux/store';
import {
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
} from '../../redux/slices/scheduleEmailSlice/scheduleEmailSlice';
import { bulkEmailService } from '../../services/bulkEmailServices';
import { scheduleEmailService } from '../../services/scheduleEmailServices';

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
        