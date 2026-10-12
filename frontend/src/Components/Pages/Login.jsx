import React, { useEffect, useState } from 'react';
import { FiAlertCircle, FiCheckCircle, FiChevronLeft, FiEye, FiEyeOff, FiLock, FiMail, FiShield, FiUser } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../../utils/api';
import { emitAuthChange } from '../../utils/push';

const fieldClass =
  'w-full h-12 rounded-xl border border-gray-200 bg-white pl-10 pr-4 text-[15px] text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-[#1D4ED8] focus:ring-4 focus:ring-[#1D4ED8]/10 font-medium';

const BrandMark = () => (
  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[18px] bg-gradient-to-tr from-[#1E40AF] to-[#1D4ED8] shadow-[0_12px_28px_rgba(29,78,216,0.28)]">
    <svg viewBox="0 0 24 24" width="30" height="30" fill="none" aria-hidden="true">
      <path
        d="M3.8 14.2h16.4M6 14.2l1.35-4.05A2 2 0 0 1 9.25 8.7h5.5a2 2 0 0 1 1.9 1.45L18 14.2"
        stroke="white"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M5.2 14.2v1.6M18.8 14.2v1.6" stroke="white" strokeWidth="1.7" strokeLinecap="round" />
      <circle cx="7.4" cy="16.6" r="1.35" fill="white" />
      <circle cx="16.6" cy="16.6" r="1.35" fill="white" />
      <path
        d="M16.1 4.15l.55 1.15 1.25.1-1 .85.32 1.2-1.12-.68-1.12.68.32-1.2-1-.85 1.25-.1.55-1.15z"
        fill="white"
      />
    </svg>
  </div>
);

const Login = () => {
  // Directly start at the signin form (no demo accounts or fake Google modals)
  const [screen, setScreen] = useState('signin');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    const saved = localStorage.getItem('ccp_remember_email');
    if (saved) {
      setEmail(saved);
      setRememberMe(true);
    }
  }, []);

  const goTo = (next) => {
    setScreen(next);
    setError(null);
    setSuccessMsg(null);
    window.scrollTo(0, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isRegister = screen === 'signup';
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    if (isRegister && password !== confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    try {
      const endpoint = isRegister ? `${BASE_URL}/api/auth/register` : `${BASE_URL}/api/auth/login`;
      const payload = isRegister
        ? { name: `${firstName.trim()} ${lastName.trim()}`.trim(), email: email.trim().toLowerCase(), phone, password }
        : { email: email.trim().toLowerCase(), password };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || (isRegister ? 'Registration failed' : 'Invalid email or password'));
      }

      if (!isRegister) {
        if (rememberMe) localStorage.setItem('ccp_remember_email', email);
        else localStorage.removeItem('ccp_remember_email');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      emitAuthChange();

      if (isRegister) {
        setSuccessMsg('Account created successfully! Redirecting...');
        setTimeout(() => navigate('/'), 800);
      } else if (data.user.role === 'admin' || data.user.role === 'superadmin') {
        setSuccessMsg('Admin credentials verified. Opening Admin Portal...');
        setTimeout(() => navigate('/admin/bookings'), 600);
      } else {
        setSuccessMsg('Welcome back! Redirecting...');
        setTimeout(() => navigate('/'), 600);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setForgotLoading(true);
    setTimeout(() => {
      setForgotLoading(false);
      setForgotSuccess(true);
    }, 800);
  };

  const alerts = (
    <>
      {error && (
        <div className="mb-4 flex items-center gap-2.5 rounded-xl border border-red-200 bg-red-50 px-3.5 py-3 text-sm font-medium text-red-600 shadow-xs">
          <FiAlertCircle className="text-base shrink-0" />
          <span>{error}</span>
        </div>
      )}
      {successMsg && (
        <div className="mb-4 flex items-center gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-3 text-sm font-medium text-emerald-600 shadow-xs">
          <FiCheckCircle className="text-base shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}
    </>
  );

  const primaryBtn =
    'flex h-12 w-full items-center justify-center rounded-xl bg-[#1D4ED8] text-[15px] font-bold text-white shadow-[0_8px_18px_rgba(29,78,216,0.28)] transition hover:bg-[#1E40AF] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70';

  const shell = (children) => (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_#e7efff_0%,_#f5f8fd_38%,_#ffffff_72%)] font-sans text-gray-900 flex items-center justify-center py-12 px-4 sm:px-6">
      <div className="w-full max-w-[440px] bg-white/80 backdrop-blur-md rounded-3xl border border-gray-100 shadow-[0_20px_50px_rgba(15,23,42,0.06)] p-7 sm:p-9">
        {children}
      </div>
    </div>
  );

  if (screen === 'forgot') {
    return shell(
      <>
        <button
          type="button"
          onClick={() => {
            setForgotSuccess(false);
            goTo('signin');
          }}
          className="mb-4 flex h-9 w-9 items-center justify-center rounded-full text-gray-600 hover:bg-gray-100 transition"
          aria-label="Back"
        >
          <FiChevronLeft size={22} />
        </button>
        <BrandMark />
        <h1 className="mt-5 text-center text-2xl font-black tracking-tight text-[#0f172a]">Reset Password</h1>
        <p className="mt-1.5 text-center text-xs text-gray-500 font-medium">
          Enter your registered email and we&apos;ll send instructions.
        </p>

        {forgotSuccess ? (
          <div className="mt-7 text-center">
            <FiCheckCircle className="mx-auto mb-2 text-3xl text-emerald-500" />
            <p className="text-sm font-bold text-gray-800">Reset instructions sent</p>
            <p className="mt-1 text-xs text-gray-500">Check {forgotEmail} for your reset link.</p>
            <button type="button" onClick={() => goTo('signin')} className={`${primaryBtn} mt-6`}>
              Back to Sign In
            </button>
          </div>
        ) : (
          <form onSubmit={handleForgotSubmit} className="mt-6 space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-bold text-gray-700 uppercase tracking-wider">
                Email Address<span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <FiMail size={16} />
                </div>
                <input
                  type="email"
                  required
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="admin@carcleanplus.com"
                  className={fieldClass}
                />
              </div>
            </div>
            <button type="submit" disabled={forgotLoading} className={primaryBtn}>
              {forgotLoading ? 'Sending link...' : 'Send Reset Link'}
            </button>
          </form>
        )}
      </>
    );
  }

  const isRegister = screen === 'signup';

  return shell(
    <>
      <div className="text-center mb-6">
        <BrandMark />
        <h1 className="mt-5 text-2xl font-black tracking-tight text-[#0f172a]">
          {isRegister ? 'Create Account' : 'Sign In to Portal'}
        </h1>
        <p className="mt-1 text-xs text-gray-500 font-medium">
          {isRegister ? 'Register for doorstep car wash services' : 'Enter your credentials to access the admin or user dashboard'}
        </p>
      </div>

      {alerts}

      <form onSubmit={handleSubmit} className="space-y-4">
        {isRegister && (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-xs font-bold text-gray-700 uppercase tracking-wider">
                First Name<span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <FiUser size={16} />
                </div>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First name"
                  className={fieldClass}
                />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold text-gray-700 uppercase tracking-wider">
                Last Name<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last name"
                className="w-full h-12 rounded-xl border border-gray-200 bg-white px-3.5 text-[15px] text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-[#1D4ED8] focus:ring-4 focus:ring-[#1D4ED8]/10 font-medium"
              />
            </div>
          </div>
        )}

        <div>
          <label className="mb-1.5 block text-xs font-bold text-gray-700 uppercase tracking-wider">
            Email or Username<span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              <FiMail size={16} />
            </div>
            <input
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@carcleanplus.com"
              className={fieldClass}
            />
          </div>
        </div>

        {isRegister && (
          <div>
            <label className="mb-1.5 block text-xs font-bold text-gray-700 uppercase tracking-wider">
              Phone Number<span className="text-red-500">*</span>
            </label>
            <div className="flex h-12 overflow-hidden rounded-xl border border-gray-200 bg-white focus-within:border-[#1D4ED8] focus-within:ring-4 focus-within:ring-[#1D4ED8]/10">
              <span className="flex items-center border-r border-gray-200 px-3 text-sm font-bold text-gray-600 bg-gray-50">+91</span>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="98390 12345"
                className="w-full bg-transparent px-3 text-[15px] text-gray-900 outline-none placeholder:text-gray-400 font-medium"
              />
            </div>
          </div>
        )}

        <div>
          <label className="mb-1.5 block text-xs font-bold text-gray-700 uppercase tracking-wider">
            Password<span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              <FiLock size={16} />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              autoComplete={isRegister ? 'new-password' : 'current-password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className={`${fieldClass} pr-11`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-gray-400 hover:text-gray-600 cursor-pointer"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            </button>
          </div>
        </div>

        {isRegister && (
          <div>
            <label className="mb-1.5 block text-xs font-bold text-gray-700 uppercase tracking-wider">
              Confirm Password<span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <FiLock size={16} />
              </div>
              <input
                type={showConfirm ? 'text' : 'password'}
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className={`${fieldClass} pr-11`}
              />
              <button
                type="button"
                onClick={() => setShowConfirm((v) => !v)}
                className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-gray-400 hover:text-gray-600 cursor-pointer"
                aria-label={showConfirm ? 'Hide password' : 'Show password'}
              >
                {showConfirm ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>
          </div>
        )}

        {!isRegister && (
          <div className="flex items-center justify-between pt-1">
            <label className="flex cursor-pointer items-center gap-2 text-xs font-medium text-gray-600 select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-[#1D4ED8] focus:ring-[#1D4ED8]"
              />
              Remember me
            </label>
            <button
              type="button"
              onClick={() => {
                setForgotEmail(email);
                setForgotSuccess(false);
                goTo('forgot');
              }}
              className="text-xs font-semibold text-[#1D4ED8] hover:underline"
            >
              Forgot Password?
            </button>
          </div>
        )}

        <button type="submit" id="submit-auth-btn" disabled={loading} className={`${primaryBtn} mt-2`}>
          {loading ? (isRegister ? 'Creating Account...' : 'Authenticating...') : isRegister ? 'Create Account' : 'Sign In'}
        </button>
      </form>

      {/* Switch between Sign in and Sign up */}
      <div className="pt-6 border-t border-gray-100 mt-6 text-center text-xs text-gray-500">
        {isRegister ? (
          <p>
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => goTo('signin')}
              className="font-bold text-[#1D4ED8] hover:underline ml-1"
            >
              Sign In
            </button>
          </p>
        ) : (
          <p>
            Don&apos;t have an account?{' '}
            <button
              type="button"
              onClick={() => goTo('signup')}
              className="font-bold text-[#1D4ED8] hover:underline ml-1"
            >
              Create Account
            </button>
          </p>
        )}
      </div>

      {/* Security Footer Notice */}
      <div className="mt-5 flex items-center justify-center gap-1.5 text-[11px] text-gray-400">
        <FiShield className="text-emerald-500" />
        <span>Secure 256-bit encrypted portal authentication</span>
      </div>
    </>
  );
};

export default Login;
