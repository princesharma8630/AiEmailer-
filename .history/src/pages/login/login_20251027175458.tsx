import React, { useState} from 'react';
import { Eye, EyeOff, Mail, BarChart3, Calendar } from 'lucide-react';

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
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const [touched, setTouched] = useState<TouchedFields>({
        email: false,
        password: false,
    });

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
            setLoading(true);
            // Simulate login
            setTimeout(() => {
                setLoading(false);
                setSuccess(true);
                console.log('Login data:', loginData);
            }, 1500);
        }
    };

    return (
        <div className="min-h-screen w-full bg-white">
            {/* Desktop Layout - Absolute positioning */}
            <div className="hidden lg:block h-screen w-screen overflow-hidden relative">
                {/* Left Section - Intro Content */}
                <div className="absolute top-2.5 left-[88px] max-w-[630px] max-h-[594px] flex flex-col gap-[42px]">
                    {/* Logo and Brand */}
                    <div className="max-w-[280px] max-h-[84px] opacity-100 flex items-center gap-[8.44px]">
                        <div className="w-full h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-2xl">
                            AiMailer
                        </div>
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
                            <div className="w-14 h-14 bg-gradient-to-br from-yellow-100 to-yellow-50 rounded-xl flex items-center justify-center shrink-0">
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
                            <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl flex items-center justify-center shrink-0">
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
                            <div className="w-14 h-14 bg-gradient-to-br from-green-100 to-green-50 rounded-xl flex items-center justify-center shrink-0">
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

                {/* Right Section - Login Card */}
                <div className="absolute top-[90px] left-[800px] max-w-[493px] max-h-[520px] rounded-2xl pt-8 pr-[22px] pb-8 pl-[22px] flex flex-col gap-2.5 bg-white shadow-sm">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">Hey, Welcome!</h1>
                        <p className="text-gray-600 mb-8">
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

                    <div className="gap">
                        {/* Email Field */}
                        <div>
                            <fieldset
                                className={`w-full max-w-[449px] h-12 border rounded-sm px-4 pb-3 mt-1 mb-2 flex items-center focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 ${errors.email && touched.email ? 'border-red-500' : 'border-gray-300'
                                    }`}
                            >
                                <legend className="px-1 text-sm font-medium text-gray-700">
                                    Email Address
                                </legend>
                                <input
                                    type="email"
                                    name="email"
                                    value={loginData.email}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder="Enter your email address"
                                    className="w-full outline-none text-gray-900 bg-transparent"
                                />
                            </fieldset>
                            {errors.email && touched.email && (
                                <p className="mt-1.5 text-sm text-red-600">{errors.email}</p>
                            )}
                        </div>

                        {/* Password Field */}
                        <div>
                            <fieldset
                                className={`relative w-full max-w-[449px] h-12 border rounded-sm px-4 pb-3 mt-1 mb-2 flex items-center focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 ${errors.password && touched.password ? 'border-red-500' : 'border-gray-300'
                                    }`}
                            >
                                <legend className="px-1 text-sm font-medium text-gray-700">
                                    Password
                                </legend>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={loginData.password}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder="Enter password"
                                    className="w-full outline-none text-gray-900 bg-transparent pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 text-gray-500 hover:text-gray-700 focus:outline-none"
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-5 h-5" />
                                    ) : (
                                        <Eye className="w-5 h-5" />
                                    )}
                                </button>
                            </fieldset>
                            {errors.password && touched.password && (
                                <p className="mt-1.5 text-sm text-red-600">{errors.password}</p>
                            )}
                        </div>

                        <div className="text-right mb-6">
                            <button
                                type="button"
                                onClick={() => setShowResetModal(true)}
                                className="text-blue-500 hover:underline text-sm font-medium bg-transparent border-none cursor-pointer"
                            >
                                Forgot Password ?
                            </button>
                        </div>

                        {/* Login Button */}
                        <div className="flex flex-col items-center gap-[22px] opacity-100">
                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="w-full max-w-[449px] h-[52px] bg-blue-500 text-white rounded-sm font-semibold hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
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

            {/* Mobile/Tablet Layout - Stacked */}
            <div className="lg:hidden min-h-screen flex flex-col">
                {/* Left Section - Top */}
                <div className="w-full px-6 py-8 md:px-12 md:py-12">
                    {/* Logo and Brand */}
                    <div className="max-w-[280px] h-[84px] mb-8 flex items-center">
                        <div className="w-full h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-2xl">
                            AiMailer
                        </div>
                    </div>

                    {/* Heading */}
                    <div className="mb-8">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
                            <span className="text-blue-500">Track & Optimize</span>{' '}
                            <span className="text-gray-900">Your Email Campaigns</span>
                        </h2>

                        <p className="text-gray-600 text-base md:text-lg">
                            Take your outreach to the next level with AiMailer, the ultimate tool for sending bulk emails, scheduling campaigns, and tracking performance.
                        </p>
                    </div>

                    {/* Features */}
                    <div className="flex flex-col gap-6">
                        <div className="flex items-start gap-4">
                            <div className="w-14 h-14 bg-gradient-to-br from-yellow-100 to-yellow-50 rounded-xl flex items-center justify-center shrink-0">
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
                            <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl flex items-center justify-center shrink-0">
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
                            <div className="w-14 h-14 bg-gradient-to-br from-green-100 to-green-50 rounded-xl flex items-center justify-center shrink-0">
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

                {/* Login Card - Bottom */}
                <div className="w-full px-6 pb-8 md:px-12">
                    <div className="max-w-[493px] mx-auto rounded-2xl p-8 bg-white shadow-sm">
                        <div className="mb-6">
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Hey, Welcome!</h1>
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

                        {/* Email Field */}
                        <div className="mb-4">
                            <fieldset
                                className={`w-full h-12 border rounded-sm px-4 pb-3 flex items-center focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 ${errors.email && touched.email ? 'border-red-500' : 'border-gray-300'
                                    }`}
                            >
                                <legend className="px-1 text-sm font-medium text-gray-700">
                                    Email Address
                                </legend>
                                <input
                                    type="email"
                                    name="email"
                                    value={loginData.email}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder="Enter your email address"
                                    className="w-full outline-none text-gray-900 bg-transparent"
                                />
                            </fieldset>
                            {errors.email && touched.email && (
                                <p className="mt-1.5 text-sm text-red-600">{errors.email}</p>
                            )}
                        </div>

                        {/* Password Field */}
                        <div className="mb-4">
                            <fieldset
                                className={`relative w-full h-12 border rounded-sm px-4 pb-3 flex items-center focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 ${errors.password && touched.password ? 'border-red-500' : 'border-gray-300'
                                    }`}
                            >
                                <legend className="px-1 text-sm font-medium text-gray-700">
                                    Password
                                </legend>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={loginData.password}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder="Enter password"
                                    className="w-full outline-none text-gray-900 bg-transparent pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 text-gray-500 hover:text-gray-700 focus:outline-none"
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-5 h-5" />
                                    ) : (
                                        <Eye className="w-5 h-5" />
                                    )}
                                </button>
                            </fieldset>
                            {errors.password && touched.password && (
                                <p className="mt-1.5 text-sm text-red-600">{errors.password}</p>
                            )}
                        </div>

                        <div className="text-right mb-6">
                            <button
                                type="button"
                                onClick={() => setShowResetModal(true)}
                                className="text-blue-500 hover:underline text-sm font-medium bg-transparent border-none cursor-pointer"
                            >
                                Forgot Password ?
                            </button>
                        </div>

                        {/* Login Button */}
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="w-full h-[52px] bg-blue-500 text-white rounded-sm font-semibold hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm mb-6"
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
    );
};

export default LoginPage;