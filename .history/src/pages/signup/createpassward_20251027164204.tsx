// src/pages/signup/createpassword.tsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, CheckCircle2, XCircle } from 'lucide-react';
import { createPassword, clearError, clearSuccess } from '../../redux/slices/authSlices/authslice';
import type { RootState, AppDispatch } from '../../redux/store';
import logo from '../../assets/images/logo.png';
import RouterConstant from '../../constants/routerConstant';

interface PasswordRequirement {
  label: string;
  test: (password: string) => boolean;
}

const CreatePasswordPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error, success, userEmail, otpVerified, passwordCreated } = useSelector(
    (state: RootState) => state.auth
  );

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [touched, setTouched] = useState({
    password: false,
    confirmPassword: false,
  });

  // Password requirements
  const passwordRequirements: PasswordRequirement[] = [
    { label: 'At least 8 characters', test: (p) => p.length >= 8 },
    { label: 'Contains uppercase letter', test: (p) => /[A-Z]/.test(p) },
    { label: 'Contains lowercase letter', test: (p) => /[a-z]/.test(p) },
    { label: 'Contains number', test: (p) => /\d/.test(p) },
    { label: 'Contains special character', test: (p) => /[!@#$%^&*(),.?":{}|<>]/.test(p) },
  ];

  // Clear errors on mount
  useEffect(() => {
    dispatch(clearError());
    dispatch(clearSuccess());
  }, [dispatch]);

  // Redirect to OTP if not verified
  useEffect(() => {
    if (!userEmail || !otpVerified) {
      console.log('⚠️ OTP not verified or no email, redirecting...');
      navigate(RouterConstant.Otp);
    }
  }, [userEmail, otpVerified, navigate]);

  // Navigate to login after password creation
  useEffect(() => {
    if (success && passwordCreated) {
      console.log('✅ Password created! Redirecting to login...');
      setTimeout(() => {
        navigate(RouterConstant.Login);
      }, 2000);
    }
  }, [success, passwordCreated, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setTouched({
      password: true,
      confirmPassword: true,
    });

    // Validation
    if (!password) {
      return;
    }

    if (password !== confirmPassword) {
      return;
    }

    // Check all password requirements
    const allRequirementsMet = passwordRequirements.every((req) => req.test(password));
    if (!allRequirementsMet) {
      return;
    }

    if (!userEmail) {
      console.error('❌ No email found');
      return;
    }

    console.log('📤 Creating password...');
    dispatch(createPassword({
      email: userEmail,
      password,
      confirm_password: confirmPassword,
    }));
  };

  const passwordsMatch = password === confirmPassword;
  const allRequirementsMet = passwordRequirements.every((req) => req.test(password));

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
              Create Password
            </h2>
            <p className="text-gray-600">
              Set a strong password for your account
            </p>
          </div>

          {/* Success Message */}
          {success && (
            <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg mb-4">
              Password created successfully! Redirecting to login...
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => setTouched({ ...touched, password: true })}
                  placeholder="Enter your password"
                  className="w-full h-12 px-4 pr-12 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Password Requirements */}
            {password && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">Password must contain:</p>
                {passwordRequirements.map((req, index) => {
                  const isValid = req.test(password);
                  return (
                    <div key={index} className="flex items-center gap-2">
                      {isValid ? (
                        <CheckCircle2 size={16} className="text-green-500" />
                      ) : (
                        <XCircle size={16} className="text-gray-300" />
                      )}
                      <span
                        className={`text-sm ${
                          isValid ? 'text-green-700' : 'text-gray-600'
                        }`}
                      >
                        {req.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Confirm Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onBlur={() => setTouched({ ...touched, confirmPassword: true })}
                  placeholder="Confirm your password"
                  className={`w-full h-12 px-4 pr-12 border rounded-lg focus:ring-2 outline-none transition-all ${
                    touched.confirmPassword && !passwordsMatch && confirmPassword
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
                      : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {touched.confirmPassword && !passwordsMatch && confirmPassword && (
                <p className="mt-2 text-sm text-red-600">Passwords do not match</p>
              )}
              {touched.confirmPassword && passwordsMatch && confirmPassword && (
                <p className="mt-2 text-sm text-green-600 flex items-center gap-1">
                  <CheckCircle2 size={16} />
                  Passwords match
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={
                !password ||
                !confirmPassword ||
                !passwordsMatch ||
                !allRequirementsMet ||
                loading
              }
              className="w-full h-12 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Password...' : 'Create Password'}
            </button>
          </form>

          {/* Back to OTP */}
          <div className="text-center mt-6">
            <button
              onClick={() => navigate(RouterConstant.Otp)}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              ← Back to OTP Verification
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePasswordPage;