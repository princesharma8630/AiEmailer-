import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, BarChart3, Calendar } from 'lucide-react';
import type { RootState, AppDispatch } from '../../redux/store';
import RouterConstant from '../../constants/routerConstant';
import logo from '../../assets/images/logo.png';
import { clearSuccess, clearError, loginUser } from '../../redux/slices/authSlices/authslice';
import ResetPasswordModal from './resetpassword/ResetModule';

interface LoginData {
    email: string;
    password: string;
}

interface LoginErrors {
    email: string;
    password: string;
}

interface TouchedFields {
    email: boolean;
    password: boolean;
}

const LoginPage: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { loading, error, success } = useSelector((state: RootState) => state.auth);

    const [loginData, setLoginData] = useState<LoginData>({
        email: '',
        password: '',
    });

    const [errors, setErrors] = useState<LoginErrors>({
        email: '',
        password: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showResetModal, setShowResetModal] = useState(false);

    const [touched, setTouched] = useState<TouchedFields>({
        email: false,
        password: false,
    });

    useEffect(() => {
        if (success) {
            dispatch(clearSuccess());
            setTimeout(() => {
                navigate(RouterConstant.Dashboard);
            }, 1000);
        }
    }, [success, navigate, dispatch]);

    // Clear error when component unmounts
    useEffect(() => {
        return () => {
            dispatch(clearError());
        };
    }, [dispatch]);

    const validateEmail = (email: string): string => {
        if (!email.trim()) {
            return 'Email is required';
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return 'Please enter a valid email address';
        }
        return '';
    };

    const validatePassword = (password: string): string => {
        if (!password) {
            return 'Password is required';
        }
        return '';
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setLoginData(prev => ({
            ...prev,
            [name]: value,
        }));

        if (touched[name as keyof TouchedFields]) {
            if (name === 'email') {
                setErrors(prev => ({
                    ...prev,
                    email: validateEmail(value),
                }));
            } else if (name === 'password') {
                setErrors(prev => ({
                    ...prev,
                    password: validatePassword(value),
                }));
            }
        }
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setTouched(prev => ({
            ...prev,
            [name]: true,
        }));

        if (name === 'email') {
            setErrors(prev => ({
                ...prev,
                email: validateEmail(value),
            }));
        } else if (name === 'password') {
            setErrors(prev => ({
                ...prev,
                password: validatePassword(value),
            }));
        }
    };

    const handleSubmit = () => {
        const emailError = validateEmail(loginData.email);
        const passwordError = validatePassword(loginData.password);

        const newErrors = {
            email: emailError,
            password: passwordError,
        };

        setErrors(newErrors);
        setTouched({
            email: true,
            password: true,
        });

        const hasErrors = Object.values(newErrors).some(error => error !== '');

        if (!hasErrors) {
            // ✅ DISPATCH LOGIN ACTION
            dispatch(loginUser(loginData));
        }
    };

    return (
        <div className="min-h-screen w-full bg-white overflow-x-hidden">
            <div className="container mx-auto px-4 ">
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

                    {/* Right Section - Login Card */}
                    <div className="w-full max-w-[500px] mx-auto lg:mx-0">
                        <div className="bg-gray-50 rounded-2xl p-6 lg:p-8 shadow-sm">
                            <div className="mb-6">
                                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">Hey, Welcome!</h1>
                                <p className="text-gray-600">
                                    Login to your account to continue
                                </p>
                            </div>

                            {/* Success Message */}
                            {success && (
                                <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg mb-4">
                                    Login successful! Redirecting...
                                </div>
                            )}

                            {/* Error Message */}
                            {error && (
                                <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg mb-4">
                                    {error}
                                </div>
                            )}

                            <div className="space-y-4">
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
                                            value={loginData.email}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            placeholder="Enter your email address"
                                            className={`w-full h-12 px-4 border rounded-md outline-none transition-all ${
                                                errors.email && touched.email
                                                    ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                                                    : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                                            }`}
                                        />
                                    </div>
                                    {errors.email && touched.email && (
                                        <p className="mt-1.5 text-sm text-red-600">{errors.email}</p>
                                    )}
                                </div>

                                {/* Password Field */}
                                <div>
                                    <div className="relative">
                                        <label 
                                            htmlFor="password"
                                            className="absolute -top-2.5 left-3 bg-gray-50 px-2 text-sm font-medium text-gray-700 z-10"
                                        >
                                            Password
                                        </label>
                                        <input
                                            id="password"
                                            type={showPassword ? 'text' : 'password'}
                                            name="password"
                                            value={loginData.password}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            placeholder="Enter password"
                                            className={`w-full h-12 px-4 pr-12 border rounded-md outline-none transition-all ${
                                                errors.password && touched.password
                                                    ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                                                    : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                                            }`}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                                        >
                                            {showPassword ? (
                                                <EyeOff className="w-5 h-5" />
                                            ) : (
                                                <Eye className="w-5 h-5" />
                                            )}
                                        </button>
                                    </div>
                                    {errors.password && touched.password && (
                                        <p className="mt-1.5 text-sm text-red-600">{errors.password}</p>
                                    )}
                                </div>

                                {/* Forgot Password */}
                                <div className="text-right">
                                    <button
                                        type="button"
                                        onClick={() => setShowResetModal(true)}
                                        className="text-blue-500 hover:underline text-sm font-medium bg-transparent border-none cursor-pointer"
                                    >
                                        Forgot Password?
                                    </button>
                                </div>

                                {/* Login Button */}
                                <div className="space-y-4 pt-2">
                                    <button
                                        onClick={handleSubmit}
                                        disabled={loading}
                                        className="w-full h-12 bg-blue-500 text-white rounded-md font-semibold hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                                    >
                                        {loading ? 'Logging in...' : 'Login'}
                                    </button>

                                    {/* Register Link */}
                                    <p className="text-center text-sm text-gray-900">
                                        Don't have an account?{' '}
                                        <a href="/signup" className="text-blue-500 hover:underline font-medium">
                                            Register
                                        </a>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <ResetPasswordModal 
                isOpen={showResetModal} 
                onClose={() => setShowResetModal(false)} 
            />
        </div>
    );
};

export default LoginPage;