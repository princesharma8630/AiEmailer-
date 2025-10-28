import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Mail, BarChart3, Calendar, Eye, EyeOff } from 'lucide-react';
import { createPassword } from '../../redux/slices/authSlices/authslice';
import type { RootState, AppDispatch } from '../../redux/store';
import Logo from "../../assets/images/logo.png";
import RouterConstant from '../../constants/routerConstant';

const CreatePasswordPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error, passwordCreated } = useSelector((state: RootState) => state.auth);
  
  // Get email from localStorage
  const [email, setEmail] = useState<string>('');
  
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({
    password: '',
    confirmPassword: '',
    agreeToTerms: '',
  });
  const [touched, setTouched] = useState({
    password: false,
    confirmPassword: false,
  });

  useEffect(() => {
    // Get email from localStorage (should be stored after OTP verification)
    const storedEmail = localStorage.getItem('signup_email');
    if (!storedEmail) {
      console.error('❌ No email found. Redirecting to signup...');
      navigate(RouterConstant.SignUp);
      return;
    }
    setEmail(storedEmail);
  }, [navigate]);

  // Navigate to login page after successful password creation
  useEffect(() => {
    if (passwordCreated) {
      console.log('✅ Password created! Redirecting to login...');
      // Clear the signup email from localStorage
      localStorage.removeItem('signup_email');
      
      setTimeout(() => {
        navigate(RouterConstant.Login);
      }, 2000);
    }
  }, [passwordCreated, navigate]);

  const validatePassword = (password: any) => {
    if (!password) {
      return 'Password is required';
    }
    if (password.length < 8) {
      return 'Password must be at least 8 characters';
    }
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      return 'Password must contain uppercase, lowercase, and number';
    }
    return '';
  };

  const validateConfirmPassword = (confirmPassword: string, password: string) => {
    if (!confirmPassword) {
      return 'Please confirm your password';
    }
    if (confirmPassword !== password) {
      return 'Passwords do not match';
    }
    return '';
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;

    setFormData(prev => ({
      ...prev,
      [name]: fieldValue,
    }));

    if (name in touched && touched[name as keyof typeof touched]) {
      if (name === 'password') {
        setErrors(prev => ({
          ...prev,
          password: validatePassword(value),
          confirmPassword: formData.confirmPassword ? validateConfirmPassword(formData.confirmPassword, value) : '',
        }));
      } else if (name === 'confirmPassword') {
        setErrors(prev => ({
          ...prev,
          confirmPassword: validateConfirmPassword(value, formData.password),
        }));
      }
    }
  };

  const handleBlur = (e: any) => {
    const { name, value } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true,
    }));

    if (name === 'password') {
      setErrors(prev => ({
        ...prev,
        password: validatePassword(value),
      }));
    } else if (name === 'confirmPassword') {
      setErrors(prev => ({
        ...prev,
        confirmPassword: validateConfirmPassword(value, formData.password),
      }));
    }
  };

  const handleSubmit = () => {
    const passwordError = validatePassword(formData.password);
    const confirmPasswordError = validateConfirmPassword(formData.confirmPassword, formData.password);
    const termsError = !formData.agreeToTerms ? 'You must agree to the terms' : '';

    setErrors({
      password: passwordError,
      confirmPassword: confirmPasswordError,
      agreeToTerms: termsError,
    });

    setTouched({
      password: true,
      confirmPassword: true,
    });

    if (!passwordError && !confirmPasswordError && !termsError) {
      if (!email) {
        console.error('❌ No email found');
        return;
      }

      console.log('📤 Creating password for:', email);
      
      // Dispatch createPassword action
      dispatch(createPassword({
        email,
        password: formData.password,
        confirm_password: formData.confirmPassword,
      }));
    }
  };

  return (
    <div className="h-screen w-full bg-white overflow-hidden">
      <div className="flex flex-col lg:flex-row lg:items-start max-w-[1435px] mx-auto" style={{ paddingTop: '8px', paddingLeft: '88px', paddingRight: '88px' }}>
        {/* Left Section - Intro Content */}
        <div className="flex flex-col" style={{ width: '630px', height: '594.47px', gap: '42px' }}>
          {/* Logo and Brand */}
          <div className="w-full max-w-[280px]">
            <img src={Logo} className="w-full h-auto object-contain" alt="Logo" />
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
                <p className="text-gray-600 text-base">
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
                <p className="text-gray-600 text-base">
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
                <p className="text-gray-600 text-base">
                  View dashboards displaying open rates, clicks, and engagement trends.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Create Password Card */}
        <div className="bg-white shadow-lg rounded-2xl flex flex-col" style={{ width: '493px', height: '423px', marginLeft: '131px', marginTop: '75px', padding: '36px 22px', gap: '10px' }}>
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">
              Create Password
            </h2>
            <p className="text-gray-600 text-base">
              To complete your account setup, please create a unique password.
            </p>
          </div>

          {/* Success Message */}
          {passwordCreated && (
            <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
              Password created successfully! Redirecting to login...
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-4">
            {/* Password Field */}
            <div>
              <fieldset
                className={`w-full h-12 border rounded-sm px-4 pb-3 flex items-center focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 ${
                  errors.password && touched.password ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <legend className="px-1 text-sm font-medium text-gray-700">
                  Password
                </legend>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={loading}
                  className="flex-1 outline-none text-gray-900 bg-transparent disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="ml-2 text-gray-500 hover:text-gray-700 focus:outline-none"
                  disabled={loading}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </fieldset>
              {errors.password && touched.password && (
                <p className="mt-1.5 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <fieldset
                className={`w-full h-12 border rounded-sm px-4 pb-3 flex items-center focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 ${
                  errors.confirmPassword && touched.confirmPassword ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <legend className="px-1 text-sm font-medium text-gray-700">
                  Confirm Password
                </legend>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={loading}
                  className="flex-1 outline-none text-gray-900 bg-transparent disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="ml-2 text-gray-500 hover:text-gray-700 focus:outline-none"
                  disabled={loading}
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </fieldset>
              {errors.confirmPassword && touched.confirmPassword && (
                <p className="mt-1.5 text-sm text-red-600">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Terms Checkbox */}
            <div>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-[18px] h-[18px] mt-0.5 text-blue-500 border-gray-300 rounded focus:ring-blue-500 cursor-pointer disabled:opacity-50"
                />
                <span className="text-sm text-gray-600">
                  I agree to AiMailer's{' '}
                  <a href="#" className="text-blue-500 hover:underline font-medium">
                    Terms of usage
                  </a>{' '}
                  and{' '}
                  <a href="#" className="text-blue-500 hover:underline font-medium">
                    Privacy Policy
                  </a>
                  .
                </span>
              </label>
              {errors.agreeToTerms && (
                <p className="mt-1.5 text-sm text-red-600">{errors.agreeToTerms}</p>
              )}
            </div>

            {/* Create Account Button */}
            <button
              onClick={handleSubmit}
              disabled={loading || !email}
              className="w-full h-[52px] bg-blue-500 text-white rounded-sm font-semibold hover:bg-blue-600 transition-colors shadow-sm mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>

            {/* Help Link */}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Need Help?{' '}
                <a href="#" className="text-blue-500 hover:underline font-medium">
                  Email Us
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePasswordPage;