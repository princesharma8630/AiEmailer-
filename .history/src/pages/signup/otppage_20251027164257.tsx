// src/pages/signup/otppage.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { verifyOTP, clearError, clearSuccess, setUserEmail } from '../../redux/slices/authSlices/authslice';
import { requestOTPAPI } from '../../services/authServices';
import type { RootState, AppDispatch } from '../../redux/store';
import logo from '../../assets/images/logo.png';
import RouterConstant from '../../constants/routerConstant';

const OTPPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error, success, userEmail, otpVerified } = useSelector(
    (state: RootState) => state.auth
  );

  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [resendError, setResendError] = useState<string | null>(null);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Clear errors on mount
  useEffect(() => {
    dispatch(clearError());
    dispatch(clearSuccess());
  }, [dispatch]);

  // Redirect to signup if no email
  useEffect(() => {
    if (!userEmail) {
      console.log('⚠️ No email found, redirecting to signup...');
      navigate(RouterConstant.Signup);
    }
  }, [userEmail, navigate]);

  // Navigate to create password after OTP verification
  useEffect(() => {
    if (success && otpVerified) {
      console.log('✅ OTP verified! Redirecting to create password...');
      setTimeout(() => {
        navigate(RouterConstant.CreatePassword);
      }, 1500);
    }
  }, [success, otpVerified, navigate]);

  // Timer countdown
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  const handleChange = (index: number, value: string) => {
    // Only allow numbers
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = pastedData.split('').concat(Array(6 - pastedData.length).fill(''));
    setOtp(newOtp);

    // Focus last filled input
    const lastIndex = Math.min(pastedData.length, 5);
    inputRefs.current[lastIndex]?.focus();
  };

  const handleSubmit = () => {
    const otpCode = otp.join('');

    if (otpCode.length !== 6) {
      return;
    }

    if (!userEmail) {
      console.error('❌ No email found');
      return;
    }

    console.log('📤 Verifying OTP:', otpCode);
    dispatch(verifyOTP({
      email: userEmail,
      code: otpCode,
    }));
  };

  const handleResendOTP = async () => {
    if (!canResend || !userEmail) return;

    setResendLoading(true);
    setResendError(null);
    setResendSuccess(false);

    try {
      await requestOTPAPI(userEmail);
      setResendSuccess(true);
      setTimer(60);
      setCanResend(false);
      setOtp(['', '', '', '', '', '']);
      console.log('✅ OTP resent successfully');
    } catch (error: any) {
      setResendError(error.message || 'Failed to resend OTP');
      console.error('❌ Resend OTP failed:', error);
    } finally {
      setResendLoading(false);
    }
  };

  const isOtpComplete = otp.every((digit) => digit !== '');

  return (
    <div className="min-h-screen w-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img src={logo} className="h-16 object-contain" alt="Logo" />
        </div>

        {/* Card */}
        <div className="bg-gray-50 rounded-2xl p-8 shadow-sm">
          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Verify Your Email
            </h2>
            <p className="text-gray-600">
              We've sent a 6-digit code to
            </p>
            <p className="text-blue-500 font-medium mt-1">{userEmail}</p>
          </div>

          {/* Success Message */}
          {success && (
            <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg mb-4">
              OTP verified successfully! Redirecting...
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg mb-4">
              {error}
            </div>
          )}

          {/* Resend Success */}
          {resendSuccess && (
            <div className="p-4 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg mb-4">
              New OTP sent to your email
            </div>
          )}

          {/* Resend Error */}
          {resendError && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg mb-4">
              {resendError}
            </div>
          )}

          {/* OTP Input */}
          <div className="mb-6">
            <div className="flex justify-center gap-3">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  className="w-12 h-14 text-center text-2xl font-semibold border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                />
              ))}
            </div>
          </div>

          {/* Verify Button */}
          <button
            onClick={handleSubmit}
            disabled={!isOtpComplete || loading}
            className="w-full h-12 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-4"
          >
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>

          {/* Resend OTP */}
          <div className="text-center">
            {!canResend ? (
              <p className="text-sm text-gray-600">
                Resend code in{' '}
                <span className="font-semibold text-blue-500">{timer}s</span>
              </p>
            ) : (
              <button
                onClick={handleResendOTP}
                disabled={resendLoading}
                className="text-sm text-blue-500 hover:underline font-medium disabled:opacity-50"
              >
                {resendLoading ? 'Sending...' : 'Resend OTP'}
              </button>
            )}
          </div>

          {/* Back to Signup */}
          <div className="text-center mt-6">
            <button
              onClick={() => navigate(RouterConstant.Signup)}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              ← Back to Signup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPPage;