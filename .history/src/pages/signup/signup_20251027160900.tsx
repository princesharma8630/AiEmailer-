import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'; // Add this import
import { Mail, BarChart3, Calendar } from 'lucide-react';
import { signupUser } from '../../redux/slices/authSlices/authslice';
import type { RootState, AppDispatch } from '../../redux/store';
import logo from '../../assets/images/logo.png';
import RouterConstant from '../../constants/routerConstant';

interface FormData {
  name: string;
  organizationName: string;
  email: string;
  password: string;
  agreeToTerms: boolean;
}

interface FieldErrors {
  name: string;
  organizationName: string;
  email: string;
  password: string;
  agreeToTerms: string;
}

interface TouchedFields {
  name: boolean;
  organizationName: boolean;
  email: boolean;
  password: boolean;
}

const SignupPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate(); // Add this hook
  const { loading, error, success } = useSelector((state: RootState) => state.auth);

  const [formData, setFormData] = useState<FormData>({
    name: '',
    organizationName: '',
    email: '',
    password: '',
    agreeToTerms: false,
  });

  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({
    name: '',
    organizationName: '',
    email: '',
    password: '',
    agreeToTerms: '',
  });

  const [touched, setTouched] = useState<TouchedFields>({
    name: false,
    organizationName: false,
    email: false,
    password: false,
  });

  // Fixed useEffect with proper navigation and debug logs
  useEffect(() => {
    console.log('🔄 Auth State Changed:', { success, loading, error }); // Debug log
    
    if (success) {
      console.log('✅ Signup successful! Redirecting to OTP page...');
      setTimeout(() => {
        navigate(RouterConstant.Otp); // Use navigate function
      }, 1500);
    }
  }, [success, loading, error, navigate]); // Add all dependencies

  const validateField = (name: string, value: string | boolean): string => {
    let error = '';

    switch (name) {
      case 'name':
        if (typeof value === 'string') {
          if (!value.trim()) {
            error = 'Name is required';
          } else if (value.trim().length < 3) {
            error = 'Name must be at least 3 characters';
          }
        }
        break;

      case 'organizationName':
        if (typeof value === 'string') {
          if (!value.trim()) {
            error = 'Organization name is required';
          } else if (value.trim().length < 3) {
            error = 'Organization name must be at least 3 characters';
          }
        }
        break;

      case 'email':
        if (typeof value === 'string') {
          if (!value.trim()) {
            error = 'Email is required';
          } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            error = 'Please enter a valid email address';
          }
        }
        break;

      

      default:
        break;
    }

    return error;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;

    setFormData(prev => ({
      ...prev,
      [name]: fieldValue,
    }));

    if (touched[name as keyof TouchedFields]) {
      const error = validateField(name, fieldValue);
      setFieldErrors(prev => ({
        ...prev,
        [name]: error,
      }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true,
    }));

    const error = validateField(name, value);
    setFieldErrors(prev => ({
      ...prev,
      [name]: error,
    }));
  };

  const handleSubmit = () => {
    console.log('📝 Form Data:', formData); // Debug log

    const errors: FieldErrors = {
      name: validateField('name', formData.name),
      organizationName: validateField('organizationName', formData.organizationName),
      email: validateField('email', formData.email),
      password: validateField('password', formData.password),
      agreeToTerms: !formData.agreeToTerms ? 'You must agree to the terms' : '',
    };

    console.log('❌ Validation Errors:', errors); // Debug log

    setFieldErrors(errors);
    setTouched({
      name: true,
      organizationName: true,
      email: true,
      password: true,
    });

    const hasErrors = Object.values(errors).some(error => error !== '');

    if (!hasErrors) {
      console.log('✅ No errors, dispatching signup...'); // Debug log
      dispatch(signupUser({
        name: formData.name,
        organizationName: formData.organizationName,
        email: formData.email,
      
      }));
    } else {
      console.log('⚠️ Form has errors, not submitting'); // Debug log
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden relative bg-white">
      {/* Left Section - Intro Content */}
      <div className="absolute top-[50px] left-[88px] w-[630px] h-[594px] flex flex-col gap-[42px]">
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
        <div className="">
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

      {/* Right Section - Sign-Up Card */}
      <div className="justify-self-center absolute top-[50px] left-[800px] w-[493px] h-[509px] rounded-2xl pt-8 pr-[22px] pb-8 pl-[22px] flex flex-col gap-2.5 bg-gray-50 shadow-sm">
        <div>
          <h2 className="justify-self-center text-3xl font-bold text-gray-900 mb-2">Get started</h2>
          <p className="text-gray-600 mb-6 justify-self-center">
            Create your account and start sending smarter emails
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
            Signup successful! Redirecting to OTP verification...
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <div className="gap">
          {/* Name Field */}
          <div>
            <fieldset
              className={`w-[449px] h-12 border rounded-sm px-4 pb-3  mt-1 mb-2 flex items-center focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 ${fieldErrors.name && touched.name ? 'border-red-500' : 'border-gray-300'
                }`}
            >
              <legend className="px-1 text-sm font-medium text-gray-700">
                Your Name
              </legend>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter your name"
                className="w-full outline-none text-gray-900 bg-transparent"
              />
            </fieldset>
            {fieldErrors.name && touched.name && (
              <p className="mt-1.5 text-sm text-red-600">{fieldErrors.name}</p>
            )}
          </div>

          {/* Organization Name Field */}
          <div>
            <fieldset
              className={`w-[449px] h-12 border rounded-sm px-4 pb-3 mt-1 mb-2 flex items-center focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 ${fieldErrors.organizationName && touched.organizationName ? 'border-red-500' : 'border-gray-300'
                }`}
            >
              <legend className="px-1 text-sm font-medium text-gray-700">
                Organization Name
              </legend>
              <input
                type="text"
                name="organizationName"
                value={formData.organizationName}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter your organization name"
                className="w-full outline-none text-gray-900 bg-transparent"
              />
            </fieldset>

            {fieldErrors.organizationName && touched.organizationName && (
              <p className="mt-1.5 text-sm text-red-600">
                {fieldErrors.organizationName}
              </p>
            )}
          </div>

          {/* Email Field */}
          <div>
            <fieldset
              className={`w-[449px] h-12 border rounded-sm px-4 pb-3 mt-1 mb-2 flex items-center focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 ${fieldErrors.email && touched.email ? 'border-red-500' : 'border-gray-300'
                }`}
            >
              <legend className="px-1 text-sm font-medium text-gray-700">
                Email Address
              </legend>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter your email address"
                className="w-full outline-none text-gray-900 bg-transparent"
              />
            </fieldset>

            {fieldErrors.email && touched.email && (
              <p className="mt-1.5 text-sm text-red-600">{fieldErrors.email}</p>
            )}
          </div>

          

          {/* Terms Checkbox */}
          <div>
            <label className="flex items-start gap-3 mt-[14.5px] mb-[14.5px] cursor-pointer">
              <input
                type="checkbox"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleChange}
                className="w-[18px] h-[18px] p-[2.77px] text-blue-500 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
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
              </span>
            </label>
            {fieldErrors.agreeToTerms && (
              <p className="mt-1.5 text-sm text-red-600">{fieldErrors.agreeToTerms}</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex flex-col items-center gap-[22px] opacity-100">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-[449px] h-[52px] bg-blue-500 text-white rounded-sm font-semibold hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              {loading ? 'Signing Up...' : 'Sign Up'}
            </button>

            {/* Login Link */}
            <p className="text-center text-sm text-gray-600">
              Already have an account?{' '}
              <a href="/login" className="text-blue-500 hover:underline font-medium">
                Login
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;