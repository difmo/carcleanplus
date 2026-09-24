import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BASE_URL } from '../../utils/api';
import { 
  FaEnvelope, FaLock, FaGoogle, FaCar, FaEye, FaEyeSlash, 
  FaUser, FaPhoneAlt, FaTimes, FaCheckCircle, FaExclamationCircle 
} from 'react-icons/fa';

const Login = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Google Sign-In States
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [googleEmailInput, setGoogleEmailInput] = useState('');
  const [googleNameInput, setGoogleNameInput] = useState('');
  const [googleLoading, setGoogleLoading] = useState(false);

  // Forgot Password States
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);

  const navigate = useNavigate();
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  useEffect(() => {
    window.scrollTo(0, 0);

    // Initialize Google Identity Services if client ID is configured
    if (googleClientId && !window.google) {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        if (window.google?.accounts?.id) {
          window.google.accounts.id.initialize({
            client_id: googleClientId,
            callback: handleGoogleCredentialResponse,
          });
        }
      };
      document.body.appendChild(script);
    }
  }, [googleClientId]);

  // Handle response from Google official OAuth popup/credential
  const handleGoogleCredentialResponse = async (response) => {
    if (!response?.credential) return;
    await executeGoogleLogin({ credential: response.credential });
  };

  // Perform backend Google login call
  const executeGoogleLogin = async (payload) => {
    setGoogleLoading(true);
    setError(null);
    try {
      const res = await fetch(`${BASE_URL}/api/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Google sign in failed');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      setShowGoogleModal(false);
      setSuccessMsg(`Welcome, ${data.user.name || 'User'}! Logged in successfully.`);

      setTimeout(() => {
        if (data.user.role === 'admin' || data.user.role === 'superadmin') {
          navigate('/admin/bookings');
        } else {
          navigate('/');
        }
      }, 1000);
    } catch (err) {
      setError(err.message);
    } finally {
      setGoogleLoading(false);
    }
  };

  // Trigger Google Login
  const handleGoogleBtnClick = () => {
    // If official Google Client ID is configured and loaded, try standard prompt
    if (googleClientId && window.google?.accounts?.id) {
      try {
        window.google.accounts.id.prompt((notification) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            setShowGoogleModal(true);
          }
        });
        return;
      } catch (err) {
        console.warn('Google prompt fallback:', err);
      }
    }
    // Open Google Login Dialog
    setShowGoogleModal(true);
  };

  // Standard Email / Password Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const endpoint = isRegister ? `${BASE_URL}/api/auth/register` : `${BASE_URL}/api/auth/login`;
      const payload = isRegister 
        ? { name, email, phone, password }
        : { email, password };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || (isRegister ? 'Registration failed' : 'Login failed'));
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      if (isRegister) {
        setSuccessMsg('Account created successfully! Redirecting...');
        setTimeout(() => {
          navigate('/');
        }, 1000);
      } else {
        if (data.user.role === 'admin' || data.user.role === 'superadmin') {
          navigate('/admin/bookings');
        } else {
          navigate('/');
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle Forgot Password Submit
  const handleForgotSubmit = (e) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setForgotLoading(true);
    setTimeout(() => {
      setForgotLoading(false);
      setForgotSuccess(true);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/40 via-white to-gray-50 flex flex-col justify-start md:justify-center items-center pt-32 sm:pt-36 pb-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="w-full max-w-[400px]">
        {/* Card */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-[0_8px_30px_rgba(0,82,204,0.07)] border border-gray-100 relative">
          
          {/* Top Brand Badge */}
          <div className="flex flex-col items-center text-center mb-3">
            <div className="w-9 h-9 bg-gradient-to-tr from-blue-50 to-blue-100 rounded-xl flex items-center justify-center mb-1.5 shadow-xs border border-blue-200/50">
              <FaCar className="text-lg text-[#0052cc]" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
              {isRegister ? 'Create an Account' : 'Welcome Back'}
            </h1>
            <p className="text-[11px] text-gray-500 font-medium mt-0.5">
              {isRegister 
                ? 'Sign up to manage your doorstep car wash bookings'
                : 'Sign in to access your bookings and account details'}
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex bg-gray-100/90 p-1 rounded-xl mb-3 text-xs font-bold">
            <button
              type="button"
              id="signin-tab-btn"
              onClick={() => { setIsRegister(false); setError(null); setSuccessMsg(null); }}
              className={`flex-1 py-1.5 rounded-lg transition-all ${
                !isRegister 
                  ? 'bg-white text-gray-900 shadow-xs' 
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              id="register-tab-btn"
              onClick={() => { setIsRegister(true); setError(null); setSuccessMsg(null); }}
              className={`flex-1 py-1.5 rounded-lg transition-all ${
                isRegister 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Register
            </button>
          </div>

          {/* Feedback alerts */}
          {error && (
            <div className="mb-3 p-2.5 bg-red-50 text-red-600 rounded-xl text-xs font-bold border border-red-100 animate-fade-in flex items-center gap-2">
              <FaExclamationCircle className="shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-3 p-2.5 bg-emerald-50 text-emerald-600 rounded-xl text-xs font-bold border border-emerald-100 animate-fade-in flex items-center gap-2">
              <FaCheckCircle className="shrink-0 text-emerald-500" />
              <span>{successMsg}</span>
            </div>
          )}

          <form className="space-y-2.5" onSubmit={handleSubmit}>
            {isRegister && (
              <div>
                <label className="block text-[11px] font-bold text-gray-700 mb-0.5">
                  Full Name
                </label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 text-xs">
                    <FaUser />
                  </div>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="block w-full pl-8 pr-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0052cc] focus:ring-2 focus:ring-[#0052cc]/10 text-xs text-gray-900 font-medium bg-gray-50/50 focus:bg-white transition-all"
                    placeholder="e.g. John Doe"
                  />
                </div>
              </div>
            )}

            {isRegister && (
              <div>
                <label className="block text-[11px] font-bold text-gray-700 mb-0.5">
                  Phone Number
                </label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 text-xs">
                    <FaPhoneAlt />
                  </div>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="block w-full pl-8 pr-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0052cc] focus:ring-2 focus:ring-[#0052cc]/10 text-xs text-gray-900 font-medium bg-gray-50/50 focus:bg-white transition-all"
                    placeholder="10-digit mobile number"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-bold text-gray-700 mb-0.5">
                Email Address
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 text-xs">
                  <FaEnvelope />
                </div>
                <input
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-8 pr-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0052cc] focus:ring-2 focus:ring-[#0052cc]/10 text-xs text-gray-900 font-medium bg-gray-50/50 focus:bg-white transition-all"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-700 mb-0.5">
                Password
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 text-xs">
                  <FaLock />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  autoComplete={isRegister ? 'new-password' : 'current-password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-8 pr-9 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0052cc] focus:ring-2 focus:ring-[#0052cc]/10 text-xs text-gray-900 font-medium bg-gray-50/50 focus:bg-white transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <FaEyeSlash className="text-xs" /> : <FaEye className="text-xs" />}
                </button>
              </div>
            </div>

            {!isRegister && (
              <div className="flex items-center justify-between pt-0.5">
                <label className="flex items-center text-[11px] text-gray-600 font-medium cursor-pointer select-none">
                  <input
                    type="checkbox"
                    className="h-3.5 w-3.5 text-[#0052cc] focus:ring-[#0052cc] border-gray-300 rounded cursor-pointer mr-1.5"
                  />
                  Remember me
                </label>

                <button
                  type="button"
                  onClick={() => { setShowForgotModal(true); setForgotSuccess(false); }}
                  className="text-[11px] font-bold text-[#0052cc] hover:text-blue-800 transition-colors cursor-pointer bg-transparent border-none p-0"
                >
                  Forgot password?
                </button>
              </div>
            )}

            <div className="pt-1.5">
              <button
                type="submit"
                id="submit-auth-btn"
                disabled={loading}
                className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm text-white bg-[#0052cc] hover:bg-[#003380] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0052cc] shadow-md hover:shadow-lg transition-all active:scale-[0.99] cursor-pointer ${
                  loading ? 'opacity-75 cursor-not-allowed' : ''
                }`}
              >
                {loading 
                  ? (isRegister ? 'Creating Account...' : 'Signing in...') 
                  : (isRegister ? 'Create Account' : 'Sign In')}
              </button>
            </div>
          </form>

          {/* Social login divider */}
          <div className="mt-3">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-100" />
              </div>
              <div className="relative flex justify-center text-[11px]">
                <span className="px-2 bg-white text-gray-400 font-medium">Or continue with</span>
              </div>
            </div>

            {/* Google Sign In Button */}
            <div className="mt-2.5">
              <button
                type="button"
                id="google-signin-btn"
                onClick={handleGoogleBtnClick}
                className="w-full inline-flex justify-center items-center py-2 px-4 border border-gray-200 rounded-xl shadow-sm bg-white text-xs font-bold text-gray-700 hover:bg-gray-50 hover:border-gray-300 focus:outline-none transition-all active:scale-[0.99] cursor-pointer"
              >
                <FaGoogle className="h-3.5 w-3.5 text-red-500 mr-2" />
                Sign in with Google
              </button>
            </div>

            {/* Toggle Between Sign In and Sign Up */}
            <div className="mt-3.5 text-center text-xs text-gray-600 font-medium">
              {isRegister ? (
                <span>
                  Already have an account?{' '}
                  <button
                    type="button"
                    id="switch-to-signin-btn"
                    onClick={(e) => { 
                      e.preventDefault(); 
                      setIsRegister(false); 
                      setError(null); 
                      setSuccessMsg(null); 
                    }}
                    className="font-bold text-[#0052cc] hover:text-[#003380] hover:underline cursor-pointer bg-transparent border-none p-0 inline-block"
                  >
                    Sign In
                  </button>
                </span>
              ) : (
                <span>
                  Don't have an account?{' '}
                  <button
                    type="button"
                    id="switch-to-signup-btn"
                    onClick={(e) => { 
                      e.preventDefault(); 
                      setIsRegister(true); 
                      setError(null); 
                      setSuccessMsg(null); 
                    }}
                    className="font-bold text-[#0052cc] hover:text-[#003380] hover:underline cursor-pointer bg-transparent border-none p-0 inline-block"
                  >
                    Sign Up
                  </button>
                </span>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Google Sign-In Modal / Account Selector */}
      {showGoogleModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-gray-100 relative">
            <button
              type="button"
              onClick={() => setShowGoogleModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 cursor-pointer p-1"
            >
              <FaTimes size={16} />
            </button>

            <div className="text-center mb-4">
              <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-2.5 shadow-sm">
                <FaGoogle size={24} />
              </div>
              <h3 className="text-base font-bold text-gray-900">Sign in with Google</h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Choose a Google account or enter your email to continue to Car Clean Plus.
              </p>
            </div>

            {/* Quick 1-Click Demo Accounts */}
            <div className="space-y-2 mb-4">
              <button
                type="button"
                disabled={googleLoading}
                onClick={() => executeGoogleLogin({ email: 'admin@carcleanplus.com', name: 'Super Admin' })}
                className="w-full flex items-center gap-3 p-2.5 rounded-xl border border-amber-200 bg-amber-50/40 hover:border-amber-400 hover:bg-amber-50 transition-all text-left cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-full bg-amber-600 text-white font-bold flex items-center justify-center text-xs">
                  A
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-bold text-gray-900 group-hover:text-amber-800 truncate">Super Admin</p>
                    <span className="bg-amber-200/80 text-amber-800 text-[9px] font-extrabold px-1.5 py-0.5 rounded-md">Admin</span>
                  </div>
                  <p className="text-[11px] text-gray-500 truncate">admin@carcleanplus.com</p>
                </div>
              </button>

              <button
                type="button"
                disabled={googleLoading}
                onClick={() => executeGoogleLogin({ email: 'vishal.yadav@gmail.com', name: 'Vishal Yadav' })}
                className="w-full flex items-center gap-3 p-2.5 rounded-xl border border-gray-200 hover:border-[#0052cc] hover:bg-blue-50/50 transition-all text-left cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
                  V
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-bold text-gray-900 group-hover:text-[#0052cc] truncate">Vishal Yadav</p>
                    <span className="bg-blue-100 text-[#0052cc] text-[9px] font-extrabold px-1.5 py-0.5 rounded-md">Admin</span>
                  </div>
                  <p className="text-[11px] text-gray-500 truncate">vishal.yadav@gmail.com</p>
                </div>
              </button>

              <button
                type="button"
                disabled={googleLoading}
                onClick={() => executeGoogleLogin({ email: 'customer.demo@gmail.com', name: 'Demo Customer' })}
                className="w-full flex items-center gap-3 p-2.5 rounded-xl border border-gray-200 hover:border-gray-400 hover:bg-gray-50 transition-all text-left cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-xs">
                  D
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-gray-900 truncate">Demo Customer</p>
                  <p className="text-[11px] text-gray-500 truncate">customer.demo@gmail.com</p>
                </div>
              </button>
            </div>

            {/* Or custom Google Email input */}
            <div className="relative my-3 text-center">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
              <span className="relative bg-white px-2 text-[10px] text-gray-400 font-bold uppercase">Or enter custom Gmail</span>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!googleEmailInput) return;
                executeGoogleLogin({
                  email: googleEmailInput,
                  name: googleNameInput || googleEmailInput.split('@')[0]
                });
              }}
              className="space-y-2.5"
            >
              <input
                type="text"
                placeholder="Your Name (optional)"
                value={googleNameInput}
                onChange={(e) => setGoogleNameInput(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#0052cc]"
              />
              <input
                type="email"
                required
                placeholder="e.g. name@gmail.com"
                value={googleEmailInput}
                onChange={(e) => setGoogleEmailInput(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#0052cc]"
              />
              <button
                type="submit"
                disabled={googleLoading}
                className="w-full py-2 px-4 rounded-xl bg-[#0052cc] hover:bg-[#003380] text-white text-xs font-bold transition-colors cursor-pointer shadow-sm disabled:opacity-50"
              >
                {googleLoading ? 'Signing in...' : 'Continue with Google Account'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-gray-100 relative">
            <button
              type="button"
              onClick={() => setShowForgotModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 cursor-pointer p-1"
            >
              <FaTimes size={16} />
            </button>

            <div className="text-center mb-4">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#0052cc] flex items-center justify-center mx-auto mb-2 shadow-sm">
                <FaLock size={18} />
              </div>
              <h3 className="text-base font-bold text-gray-900">Reset Password</h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Enter your registered email and we'll send you a password reset link.
              </p>
            </div>

            {forgotSuccess ? (
              <div className="text-center py-4">
                <FaCheckCircle className="text-emerald-500 text-3xl mx-auto mb-2" />
                <p className="text-xs font-bold text-gray-800">Reset Link Sent!</p>
                <p className="text-[11px] text-gray-500 mt-1">Check your email ({forgotEmail}) for instructions.</p>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="mt-4 px-4 py-1.5 bg-[#0052cc] text-white text-xs font-bold rounded-xl"
                >
                  Back to Sign In
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#0052cc]"
                  />
                </div>
                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="w-full py-2 px-4 rounded-xl bg-[#0052cc] hover:bg-[#003380] text-white text-xs font-bold transition-colors cursor-pointer shadow-sm disabled:opacity-50"
                >
                  {forgotLoading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default Login;
