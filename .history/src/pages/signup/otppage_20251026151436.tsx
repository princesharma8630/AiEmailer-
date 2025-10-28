import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, BarChart3, Calendar } from 'lucide-react';
import logo from '../../assets/images/logo.png';

// You'll need to create these actions in your Redux slice
// import { verifyOTP, resendOTP } from '../../redux/slices/authSlices/authslice';
// import type { RootState, AppDispatch } from '../../redux/store';

const OTPPage = () => {
  // const dispatch = useDispatch();
  const navigate = useNavigate();
  // const { loading, error, email } = useSelector((state: RootState) => state.auth);
  
  // Mock data for demonstration - replace with actual Redux state
  const email = 'loremipsum@workmail.com';
  const loading = false;
  const error = null;

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpError, setOtpError] = useState('');
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Focus first input on mount
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    // Only allow numbers
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setOtpError('');

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

    const newOtp = [...otp];
    for (let i = 0; i < pastedData.length && i < 6; i++) {
      newOtp[i] = pastedData[i];
    }
    setOtp(newOtp);
    
    // Focus last filled input or next empty one
    const nextIndex = Math.min(pastedData.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleVerify = () => {
    const otpCode = otp.join('');
    
    if (otpCode.length !== 6) {
      setOtpError('Please enter all 6 digits');
      return;
    }

    // Dispatch verify OTP action
    // dispatch(verifyOTP({ email, otp: otpCode }));
    console.log('Verifying OTP:', otpCode);
    
    // Mock success - navigate to dashboard
    setTimeout(() => {
      navigate('/dashboard');
    }, 1000);
  };

  const handleResend = async () => {
    setResendLoading(true);
    setResendSuccess(false);
    
    // Dispatch resend OTP action
    // await dispatch(resendOTP({ email }));
    
    // Mock delay
    setTimeout(() => {
      setResendLoading(false);
      setResendSuccess(true);
      console.log('OTP resent to:', email);
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setResendSuccess(false);
      }, 3000);
    }, 1000);
  };

  return (
    <div className="h-screen w-screen overflow-hidden relative bg-white">
      {/* Left Section - Intro Content */}
      <div className="absolute top-1 left-[88px] w-[600px] h-[594px] flex flex-col gap-[42px]">
        {/* Logo and Brand */}
        <div className="w-[280px] h-[84px] opacity-100 flex items-center gap-[8.44px]">
          <img src={logo} className="w-full h-full object-contain" alt="Logo" />
        </div>

        {/* Heading */}
        <div>
          <h2 className="text-4xl font-bold mb-4 leading-tight">
            <span className="text-blue-500">Track & Optimize</span>{' '}
            <span className="text-gray-900">Your Email Campaigns</span>
          </h2>

          <p className="text-gray-600 text-lg">
            Take your outreach to the next level with AiMailer, the ultimate tool for sending bulk emails, scheduling campaigns, and tracking performance.
          </p>
        </div>

        {/* Features */}
        <div className="flex flex-col gap-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 bg-linear-to-br from-yellow-100 to-yellow-50 rounded-xl flex items-center justify-center shrink-0">
              <Mail className="w-7 h-7 text-yellow-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2 text-lg">Bulk Email Sending</h3>
              <p className="text-gray-600">
                Quickly send personalized emails to thousands with a few clicks.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-14 h-14 bg-linear-to-br from-blue-100 to-blue-50 rounded-xl flex items-center justify-center shrink-0">
              <Calendar className="w-7 h-7 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2 text-lg">Email Scheduling</h3>
              <p className="text-gray-600">
                Schedule your campaigns in advance for hassle-free delivery.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-14 h-14 bg-linear-to-br from-green-100 to-green-50 rounded-xl flex items-center justify-center shrink-0">
              <BarChart3 className="w-7 h-7 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2 text-lg">Detailed Analytics</h3>
              <p className="text-gray-600">
                View dashboards displaying open rates, clicks, and engagement trends.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section - OTP Verification Card */}
      <div className="absolute top-40 left-[830px] w-[493px] rounded-2xl pt-8 pr-[22px] pb-8 pl-[22px] flex flex-col gap-6 bg-white shadow-">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            We've emailed you a code
          </h2>
          <p className="text-gray-600">
            To complete your account setup, enter the code we've sent to{' '}
            <span className="font-medium text-gray-900">{email}</span>
          </p>
        </div>

        {/* Success Message */}
        {resendSuccess && (
          <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
            OTP resent successfully! Check your email.
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* OTP Input Fields */}
        <div className="flex flex-col gap-4">
          <div className="flex gap-3 justify-center">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => { inputRefs.current[index] = el }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={index === 0 ? handlePaste : undefined}
                className={`w-[60px] h-[60px] text-center text-2xl font-semibold border-2 rounded-lg outline-none transition-all ${
                  digit
                    ? 'border-blue-500 bg-blue-50'
                    : otpError
                    ? 'border-red-500'
                    : 'border-gray-300'
                } focus:border-blue-500 focus:ring-2 focus:ring-blue-200`}
              />
            ))}
          </div>

          {otpError && (
            <p className="text-sm text-red-600 text-center">{otpError}</p>
          )}
        </div>

        {/* Verify Button */}
        <button
          onClick={handleVerify}
          disabled={loading || otp.join('').length !== 6}
          className="w-full h-[52px] bg-blue-500 text-white rounded-sm font-semibold hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
        >
          {loading ? 'Verifying...' : 'Verify'}
        </button>

        {/* Resend Link */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Didn't receive an email?{' '}
            <button
              onClick={handleResend}
              disabled={resendLoading}
              className="text-blue-500 hover:underline font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {resendLoading ? 'Sending...' : 'Resend'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OTPPage;