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