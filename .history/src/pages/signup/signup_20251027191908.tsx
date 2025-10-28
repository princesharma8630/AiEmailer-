import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Mail, BarChart3, Calendar } from 'lucide-react';
import { signupUser } from '../../redux/slices/authSlices/authslice';
import type { RootState, AppDispatch } from '../../redux/store';
import logo from '../../assets/images/logo.png';
import RouterConstant from '../../constants/routerConstant';

interface FormData {
  name: string;
  organizationName: string;
  email: string;
  agreeToTerms: boolean;
}

interface FieldErrors {
  name: string;
  organizationName: string;
  email: string;
  agreeToTerms: string;
}

interface TouchedFields {
  name: boolean;
  organizationName: boolean;
  email: boolean;
}

const SignupPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error, success } = useSelector((state: RootState) => state.auth);

  const [formData, setFormData] = useState<FormData>({
    name: '',
    organizationName: '',
    email: '',
    agreeToTerms: false,
  });

  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({
    name: '',
    organizationName: '',
    email: '',
    agreeToTerms: '',
  });

  const [touched, setTouched] = useState<TouchedFields>({
    name: false,
    organizationName: false,
    email: false,
  });

  // Navigate to OTP page after successful signup
  useEffect(() => {
    console.log('🔄 Auth State Changed:', { success, loading, error });
    
    if (success) {
      console.log('✅ Signup successful! Redirecting to OTP page...');
      setTimeout(() => {
        navigate(RouterConstant.Otp);
      }, 1500);
    }
  }, [success, loading, error, navigate]);

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
    console.log('📝 Form Data:', formData);

    const errors: FieldErrors = {
      name: validateField('name', formData.name),
      organizationName: validateField('organizationName', formData.organizationName),
      email: validateField('email', formData.email),
      agreeToTerms: !formData.agreeToTerms ? 'You must agree to the terms' : '',
    };

    console.log('❌ Validation Errors:', errors);

    setFieldErrors(errors);
    setTouched({
      name: true,
      organizationName: true,
      email: true,
    });

    const hasErrors = Object.values(errors).some(error => error !== '');

    if (!hasErrors) {
      console.log('✅ No errors, dispatching signup...');
      
      // 🔥 IMPORTANT: Store email in localStorage for OTP and password pages
      localStorage.setItem('signup_email', formData.email);
      console.log('💾 Email stored in localStorage:', formData.email);
      
      // Dispatch signup action
      dispatch(signupUser({
        name: formData.name,
        organizationName: formData.organizationName,
        email: formData.email,
      }));
    } else {
      console.log('⚠️ Form has errors, not submitting');
    }
  };

  return (
    <div className="min-h-screen w-full bg-white overflow-x-hidden">
      <div className="container mx-auto px-4 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start max-w-7xl mx-auto">
          
          {/* Left Section - Intro Content */}
          <div className="flex flex-col gap-8 lg:gap-10">
            {/* Logo and Brand */}
            <div className="w-[280px] max-w-full">
              <img src={logo} className="w-full h-auto object-contain" alt="AiMailer Logo" />
            </div>

            {/* Heading */}
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold mb-4 leading-tight">
                <span className="text-blue-500">Track & Optimize</span>{' '}
                <span className="text-gray-900">Your Email Campaigns</span>
              </h2>

              <p className="text-gray-600 text-base lg:text-lg">
                Take your outreach to the next level with AiMailer, the ultimate tool for sending bulk emails, scheduling campaigns, and tracking performance.
              </p>
            </div>

            {/* Features */}
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-yellow-100 to-yellow-50 rounded-xl flex items-center justify-center shrink-0">
                  <Mail className="w-6 h-6 lg:w-7 lg:h-7 text-yellow-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2 text-base lg:text-lg">Bulk Email Sending</h3>
                  <p className="text-gray-600 text-sm lg:text-base">
                    Quickly send personalized emails to thousands with a few clicks.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl flex items-center justify-center shrink-0">
                  <Calendar className="w-6 h-6 lg:w-7 lg:h-7 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2 text-base lg:text-lg">Email Scheduling</h3>
                  <p className="text-gray-600 text-sm lg:text-base">
                    Schedule your campaigns in advance for hassle-free delivery.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-green-100 to-green-50 rounded-xl flex items-center justify-center shrink-0">
                  <BarChart3 className="w-6 h-6 lg:w-7 lg:h-7 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2 text-base lg:text-lg">Detailed Analytics</h3>
                  <p className="text-gray-600 text-sm lg:text-base">
                    View dashboards displaying open rates, clicks, and engagement trends.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section - Sign-Up Card */}
          <div className="w-full max-w-[500px] mx-auto lg:mx-0">
            <div className="bg-gray-50 rounded-2xl p-6 lg:p-8 shadow-sm">
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Get started</h2>
                <p className="text-gray-600">
                  Create your account and start sending smarter emails
                </p>
              </div>

              {/* Success Message */}
              {success && (
                <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg mb-4">
                  Signup successful! Redirecting to OTP verification...
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg mb-4">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                {/* Name Field */}
                <div>
                  <div className="relative">
                    <label 
                      htmlFor="name"
                      className="absolute -top-2.5 left-3 bg-gray-50 px-2 text-sm font-medium text-gray-700 z-10"
                    >
                      Your Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Enter your name"
                      className={`w-full h-12 px-4 border rounded-md outline-none transition-all ${
                        fieldErrors.name && touched.name
                          ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                          : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                      }`}
                    />
                  </div>
                  {fieldErrors.name && touched.name && (
                    <p className="mt-1.5 text-sm text-red-600">{fieldErrors.name}</p>
                  )}
                </div>

                {/* Organization Name Field */}
                <div>
                  <div className="relative">
                    <label 
                      htmlFor="organizationName"
                      className="absolute -top-2.5 left-3 bg-gray-50 px-2 text-sm font-medium text-gray-700 z-10"
                    >
                      Organization Name
                    </label>
                    <input
                      id="organizationName"
                      type="text"
                      name="organizationName"
                      value={formData.organizationName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Enter your organization name"
                      className={`w-full h-12 px-4 border rounded-md outline-none transition-all ${
                        fieldErrors.organizationName && touched.organizationName
                          ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                          : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                      }`}
                    />
                  </div>
                  {fieldErrors.organizationName && touched.organizationName && (
                    <p className="mt-1.5 text-sm text-red-600">
                      {fieldErrors.organizationName}
                    </p>
                  )}
                </div>

                {/* Email Field */}
                <div>
                  <div className="relative">
                    <label 
                      htmlFor="email"
                      className="absolute -top-2.5 left-3 bg-gray-50 px-2 text-sm font-medium text-gray-700 z-10"
                    >
                      Email Address
                    </label>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Enter your email address"
                      className={`w-full h-12 px-4 border rounded-md outline-none transition-all ${
                        fieldErrors.email && touched.email
                          ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                          : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                      }`}
                    />
                  </div>
                  {fieldErrors.email && touched.email && (
                    <p className="mt-1.5 text-sm text-red-600">{fieldErrors.email}</p>
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
                      className="w-[18px] h-[18px] mt-0.5 text-blue-500 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
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
                <div className="space-y-4 pt-2">
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full h-12 bg-blue-500 text-white rounded-md font-semibold hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
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
        </div>
      </div>
    </div>
  );
};

export default SignupPage;