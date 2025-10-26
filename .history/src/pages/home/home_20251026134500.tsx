import { useState, useEffect } from 'react';
import { Zap, Mail, BarChart3, Clock, Target, Shield, ArrowRight, Sparkles, TrendingUp, Users, CheckCircle } from 'lucide-react';

export default function HomePage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [activeFeature, setActiveFeature] = useState(0);
  const navigate = useNa

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: Zap,
      title: 'Bulk Email Campaigns',
      description: 'Send thousands of personalized emails in minutes with AI-powered automation',
      color: 'from-blue-500 to-cyan-500',
      stats: '10K+ emails/day'
    },
    {
      icon: BarChart3,
      title: 'Real-Time Analytics',
      description: 'Track opens, clicks, and engagement with advanced analytics dashboard',
      color: 'from-purple-500 to-pink-500',
      stats: '98% tracking accuracy'
    },
    {
      icon: Clock,
      title: 'Smart Scheduling',
      description: 'AI-optimized send times for maximum engagement and conversion rates',
      color: 'from-orange-500 to-red-500',
      stats: '3x better results'
    }
  ];

  const benefits = [
    'AI-Powered Email Personalization',
    'Advanced Open & Click Tracking',
    'Automated Campaign Management',
    'Real-Time Performance Insights',
    'CSV Bulk Upload Support',
    'Responsive Email Templates'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden relative">
      {/* Animated Background Gradient */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(139, 92, 246, 0.3), transparent 50%)`
        }}
      />

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header className="relative z-10 container mx-auto px-6 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-xl">
              <Sparkles className="w-8 h-8" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              AiMailer
            </span>
          </div>

          <div className="flex gap-4">
            <button className="px-6 py-2.5 rounded-lg font-medium text-white hover:bg-white/10 transition-all duration-300 border border-white/20">
              Login
            </button>
            <button onClick={()=>} className="px-6 py-2.5 rounded-lg font-medium bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg shadow-purple-500/50 hover:shadow-purple-500/70 hover:scale-105">
              Sign Up Free
            </button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 container mx-auto px-6 py-20 text-center">
        <div className="inline-block mb-6 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
          <span className="text-sm font-medium flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-yellow-400" />
            AI-Powered Email Marketing Platform
          </span>
        </div>

        <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
          <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Transform Your
          </span>
          <br />
          <span className="text-white">Email Campaigns</span>
        </h1>

        <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
          Send personalized bulk emails with AI-driven insights. Track every open, click, and conversion in real-time.
        </p>

        <button className="group px-8 py-4 rounded-xl font-semibold bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-2xl shadow-purple-500/50 hover:shadow-purple-500/70 hover:scale-105 flex items-center gap-3 mx-auto text-lg">
          Get Started Now
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 mt-20 max-w-3xl mx-auto">
          {[
            { label: 'Emails Sent', value: '10M+', icon: Mail },
            { label: 'Active Users', value: '50K+', icon: Users },
            { label: 'Success Rate', value: '98%', icon: TrendingUp }
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <stat.icon className="w-8 h-8 mx-auto mb-3 text-purple-400" />
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-1">
                {stat.value}
              </div>
              <div className="text-gray-400 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Powerful Features for{' '}
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Modern Marketers
            </span>
          </h2>
          <p className="text-gray-400 text-lg">Everything you need to run successful email campaigns</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`group relative p-8 rounded-2xl backdrop-blur-sm border border-white/10 transition-all duration-500 hover:scale-105 cursor-pointer ${
                activeFeature === index ? 'bg-white/10 border-white/30' : 'bg-white/5'
              }`}
              onMouseEnter={() => setActiveFeature(index)}
            >
              <div className={`inline-block p-4 rounded-xl bg-gradient-to-br ${feature.color} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-8 h-8 text-white" />
              </div>

              <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
              <p className="text-gray-400 mb-4 leading-relaxed">{feature.description}</p>
              
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
                <Target className="w-4 h-4 text-green-400" />
                <span className="text-sm font-medium">{feature.stats}</span>
              </div>

              {/* Hover Effect */}
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
            </div>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="relative z-10 container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-12">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">
                Why Choose{' '}
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  AiMailer?
                </span>
              </h2>
              <p className="text-gray-400">Built for scale, designed for success</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {benefits.map((benefit, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 group cursor-pointer"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-gray-200 font-medium">{benefit}</span>
                </div>
              ))}
            </div>

            <div className="mt-12 p-8 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/20">
              <div className="flex items-center gap-4 mb-4">
                <Shield className="w-8 h-8 text-blue-400" />
                <h3 className="text-2xl font-bold">Enterprise-Grade Security</h3>
              </div>
              <p className="text-gray-300 leading-relaxed">
                Your data is protected with bank-level encryption, GDPR compliance, and 99.9% uptime guarantee. 
                Focus on growing your business while we handle the infrastructure.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl p-12 shadow-2xl relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-pulse" />
            </div>

            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Ready to Supercharge Your Emails?
              </h2>
              <p className="text-xl text-blue-100 mb-8">
                Join thousands of marketers who trust AiMailer for their campaigns
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button className="px-8 py-4 rounded-xl font-semibold bg-white text-purple-600 hover:bg-gray-100 transition-all duration-300 shadow-xl hover:scale-105 flex items-center gap-2">
                  Start Free Trial
                  <Sparkles className="w-5 h-5" />
                </button>
                <button className="px-8 py-4 rounded-xl font-semibold border-2 border-white text-white hover:bg-white/10 transition-all duration-300">
                  View Pricing
                </button>
              </div>

              <p className="text-sm text-blue-100 mt-6">
                No credit card required • 14-day free trial • Cancel anytime
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 container mx-auto px-6 py-12 border-t border-white/10">
        <div className="text-center text-gray-400">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-lg">
              <Sparkles className="w-6 h-6" />
            </div>
            <span className="text-xl font-bold text-white">AiMailer</span>
          </div>
          <p className="text-sm">
            © 2025 AiMailer. Transform your email marketing with AI.
          </p>
        </div>
      </footer>
    </div>
  );
}