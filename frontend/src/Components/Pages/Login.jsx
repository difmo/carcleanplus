import React, { useEffect, useState } from 'react';
import { FiAlertCircle, FiCheckCircle, FiChevronLeft, FiEye, FiEyeOff, FiX } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../../utils/api';
import { emitAuthChange } from '../../utils/push';

const fieldClass =
  'w-full h-12 rounded-xl border border-gray-200 bg-white px-3.5 text-[15px] text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-[#1D4ED8] focus:ring-4 focus:ring-[#1D4ED8]/10';

const BrandMark = () => (
  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[18px] bg-[#1D4ED8] shadow-[0_12px_28px_rgba(29,78,216,0.28)]">
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

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
    <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62z" />
    <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.33A9 9 0 0 0 9 18z" />
    <path fill="#FBBC05" d="M3.97 10.72A5.41 5.41 0 0 1 3.68 9c0-.6.1-1.18.29-1.72V4.95H.96A9 9 0 0 0 0 9c0 1.45.35 2.82.96 4.05l3.01-2.33z" />
    <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .96 4.95l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58z" />
  </svg>
);

const AppleIcon = () => (
  <svg width="16" height="18" viewBox="0 0 16 18" aria-hidden="true">
    <path
      fill="#111827"
      d="M13.05 9.47c-.02-2.14 1.75-3.17 1.83-3.22-1-1.46-2.55-1.66-3.1-1.68-1.32-.13-2.58.78-3.25.78-.67 0-1.7-.76-2.8-.74-1.44.02-2.77.84-3.51 2.13-1.5 2.6-.38 6.45 1.08 8.55.71 1.03 1.56 2.18 2.67 2.14 1.07-.04 1.48-.69 2.77-.69 1.29 0 1.66.69 2.8.67 1.16-.02 1.89-1.05 2.6-2.08.82-1.2 1.16-2.36 1.18-2.42-.03-.01-2.25-.86-2.27-3.44zM10.95 3.3c.59-.72.99-1.71.88-2.7-.85.03-1.88.57-2.49 1.28-.55.63-1.03 1.64-.9 2.61.95.07 1.92-.48 2.51-1.19z"
    />
  </svg>
);

const OrDivider = () => (
  <div className="flex items-center gap-4 py-1">
    <div className="h-px flex-1 bg-gray-200" />
    <span className="text-sm text-gray-400">or</span>
    <div className="h-px flex-1 bg-gray-200" />
  </div>
);

const Login = () => {
  const [screen, setScreen] = useState('welcome');
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
  const [notice, setNotice] = useState(null);

  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [googleEmailInput, setGoogleEmailInput] = useState('');
  const [googleNameInput, setGoogleNameInput] = useState('');
  const [googleLoading, setGoogleLoading] = useState(false);

  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);

  const navigate = useNavigate();
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  useEffect(() => {
    window.scrollTo(0, 0);
    const saved = localStorage.getItem('ccp_remember_email');
    if (saved) {
      setEmail(saved);
      setRememberMe(true);
    }

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

  const goTo = (next) => {
    setScreen(next);
    setError(null);
    setSuccessMsg(null);
    setNotice(null);
    window.scrollTo(0, 0);
  };

  const handleGoogleCredentialResponse = async (response) => {
    if (!response?.credential) return;
    await executeGoogleLogin({ credential: response.credential });
  };

  const executeGoogleLogin = async (payload) => {
    setGoogleLoading(true);
    setError(null);
    try {
      const res = await fetch(`${BASE_URL}/api/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Google sign in failed');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      emitAuthChange();

      setShowGoogleModal(false);
      setSuccessMsg(`Welcome, ${data.user.name || 'User'}! Logged in successfully.`);

      setTimeout(() => {
        if (data.user.role === 'admin' || data.user.role === 'superadmin') {
          navigate('/admin/bookings');
        } else {
          navigate('/');
        }
      }, 800);
    } catch (err) {
      setError(err.message);
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleGoogleBtnClick = () => {
    setNotice(null);
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
    setShowGoogleModal(true);
  };

  const handleAppleClick = () => {
    setError(null);
    setNotice('Apple sign-in is not available yet. Continue with Google or email.');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isRegister = screen === 'signup';
    setLoading(true);
    setError(null);
    setSuccessMsg(null);
    setNotice(null);

    if (isRegister && password !== confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    try {
      const endpoint = isRegister ? `${BASE_URL}/api/auth/register` : `${BASE_URL}/api/auth/login`;
      const payload = isRegister
        ? { name: `${firstName.trim()} ${lastName.trim()}`.trim(), email, phone, password }
        : { email, password };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || (isRegister ? 'Registration failed' : 'Login failed'));
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
        navigate('/admin/bookings');
      } else {
        navigate('/');
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
        <div className="mb-3 flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-3 py-2.5 text-sm font-medium text-red-600">
          <FiAlertCircle className="shrink-0" />
          <span>{error}</span>
        </div>
      )}
      {successMsg && (
        <div className="mb-3 flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-2.5 text-sm font-medium text-emerald-600">
          <FiCheckCircle className="shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}
      {notice && (
        <div className="mb-3 rounded-xl border border-blue-100 bg-blue-50 px-3 py-2.5 text-sm font-medium text-[#1D4ED8]">
          {notice}
        </div>
      )}
    </>
  );

  const primaryBtn =
    'flex h-12 w-full items-center justify-center rounded-xl bg-[#1D4ED8] text-[15px] font-semibold text-white shadow-[0_8px_18px_rgba(29,78,216,0.28)] transition hover:bg-[#1E40AF] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70';

  const socialBtn =
    'flex h-12 w-full items-center justify-center gap-2.5 rounded-xl border border-gray-200 bg-white text-[15px] font-semibold text-gray-800 transition hover:bg-gray-50 active:scale-[0.99]';

  const switchLink = (prompt, label, target) => (
    <p className="pt-8 text-center text-sm text-gray-500">
      {prompt}{' '}
      <button
        type="button"
        onClick={() => goTo(target)}
        className="font-semibold text-[#1D4ED8] hover:text-[#1E40AF]"
      >
        {label}
      </button>
    </p>
  );

  const shell = (children) => (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_#e7efff_0%,_#f5f8fd_38%,_#ffffff_72%)] font-sans text-gray-900">
      <div className="mx-auto flex min-h-screen w-full max-w-[440px] flex-col px-6 pb-8 pt-5">
        {children}
      </div>
      {showGoogleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-sm rounded-3xl border border-gray-100 bg-white p-6 shadow-2xl">
            <button
              type="button"
              onClick={() => setShowGoogleModal(false)}
              className="absolute right-4 top-4 p-1 text-gray-400 hover:text-gray-600"
            >
              <FiX size={16} />
            </button>
            <div className="mb-4 text-center">
              <div className="mx-auto mb-2.5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E8F0FE] text-[#1D4ED8]">
                <GoogleIcon />
              </div>
              <h3 className="text-base font-bold text-gray-900">Continue with Google</h3>
              <p className="mt-0.5 text-xs text-gray-500">
                Choose an account or enter your email to continue to Car Clean Plus.
              </p>
            </div>
            <div className="mb-4 space-y-2">
              <button
                type="button"
                disabled={googleLoading}
                onClick={() => executeGoogleLogin({ email: 'admin@carcleanplus.com', name: 'Super Admin' })}
                className="group flex w-full items-center gap-3 rounded-xl border border-amber-200 bg-amber-50/40 p-2.5 text-left transition hover:border-amber-400 hover:bg-amber-50"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-600 text-xs font-bold text-white">A</div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-bold text-gray-900">Super Admin</p>
                  <p className="truncate text-[11px] text-gray-500">admin@carcleanplus.com</p>
                </div>
              </button>
              <button
                type="button"
                disabled={googleLoading}
                onClick={() => executeGoogleLogin({ email: 'customer.demo@gmail.com', name: 'Demo Customer' })}
                className="flex w-full items-center gap-3 rounded-xl border border-gray-200 p-2.5 text-left transition hover:border-[#1D4ED8] hover:bg-blue-50/50"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white">D</div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-bold text-gray-900">Demo Customer</p>
                  <p className="truncate text-[11px] text-gray-500">customer.demo@gmail.com</p>
                </div>
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!googleEmailInput) return;
                executeGoogleLogin({
                  email: googleEmailInput,
                  name: googleNameInput || googleEmailInput.split('@')[0],
                });
              }}
              className="space-y-2.5"
            >
              <input
                type="text"
                placeholder="Your name (optional)"
                value={googleNameInput}
                onChange={(e) => setGoogleNameInput(e.target.value)}
                className={fieldClass}
              />
              <input
                type="email"
                required
                placeholder="name@gmail.com"
                value={googleEmailInput}
                onChange={(e) => setGoogleEmailInput(e.target.value)}
                className={fieldClass}
              />
              <button type="submit" disabled={googleLoading} className={primaryBtn}>
                {googleLoading ? 'Signing in...' : 'Continue'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );

  if (screen === 'welcome') {
    return shell(
      <>
        <div className="flex flex-1 flex-col items-center justify-center pb-10">
          <BrandMark />
          <h1 className="mt-8 text-center text-[32px] font-bold leading-tight tracking-tight text-[#0f172a]">
            Welcome to
            <br />
            Car Clean Plus
          </h1>
          <p className="mt-2 text-center text-sm text-gray-500">A cleaner car, at your doorstep.</p>

          <div className="mt-10 w-full space-y-3">
            {alerts}
            <button type="button" id="continue-email-btn" onClick={() => goTo('signin')} className={primaryBtn}>
              Continue with Email
            </button>
            <OrDivider />
            <button type="button" id="google-signin-btn" onClick={handleGoogleBtnClick} className={socialBtn}>
              <GoogleIcon />
              Continue with Google
            </button>
            <button type="button" onClick={handleAppleClick} className={socialBtn}>
              <AppleIcon />
              Continue with Apple
            </button>
          </div>
        </div>
        <p className="pb-2 text-center text-sm text-gray-500">
          Have an account?{' '}
          <button type="button" onClick={() => goTo('signin')} className="font-semibold text-[#1D4ED8]">
            Sign in
          </button>
        </p>
      </>
    );
  }

  if (screen === 'forgot') {
    return shell(
      <>
        <button
          type="button"
          onClick={() => {
            setForgotSuccess(false);
            goTo('signin');
          }}
          className="mb-6 flex h-10 w-10 items-center justify-center rounded-full text-gray-700 hover:bg-white/70"
          aria-label="Back"
        >
          <FiChevronLeft size={22} />
        </button>
        <BrandMark />
        <h1 className="mt-6 text-center text-[28px] font-bold tracking-tight text-[#0f172a]">Reset password</h1>
        <p className="mt-1 text-center text-sm text-gray-500">
          Enter your registered email and we&apos;ll send a reset link.
        </p>
        {forgotSuccess ? (
          <div className="mt-8 text-center">
            <FiCheckCircle className="mx-auto mb-2 text-3xl text-emerald-500" />
            <p className="text-sm font-semibold text-gray-800">Reset link sent</p>
            <p className="mt-1 text-sm text-gray-500">Check {forgotEmail} for instructions.</p>
            <button type="button" onClick={() => goTo('signin')} className={`${primaryBtn} mt-6`}>
              Back to sign in
            </button>
          </div>
        ) : (
          <form onSubmit={handleForgotSubmit} className="mt-8 space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-gray-900">
                Email<span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                required
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                placeholder="Email"
                className={fieldClass}
              />
            </div>
            <button type="submit" disabled={forgotLoading} className={primaryBtn}>
              {forgotLoading ? 'Sending...' : 'Send reset link'}
            </button>
          </form>
        )}
      </>
    );
  }

  const isRegister = screen === 'signup';

  return shell(
    <>
      <button
        type="button"
        onClick={() => goTo('welcome')}
        className="mb-4 flex h-10 w-10 items-center justify-center rounded-full text-gray-700 hover:bg-white/70"
        aria-label="Back"
      >
        <FiChevronLeft size={22} />
      </button>
      <BrandMark />
      <h1 className="mt-5 text-center text-[28px] font-bold tracking-tight text-[#0f172a]">
        {isRegister ? 'Sign up' : 'Sign in'}
      </h1>
      <p className="mt-1 text-center text-sm leading-relaxed text-gray-500">
        {isRegister
          ? 'Create your Car Clean Plus account'
          : 'Sign in to book a cleaner car at your doorstep'}
      </p>

      <form className="mt-6" onSubmit={handleSubmit}>
        {alerts}

        {isRegister && (
          <div className="mb-4 grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-gray-900">
                First name<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First name"
                className={fieldClass}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-gray-900">
                Last name<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last name"
                className={fieldClass}
              />
            </div>
          </div>
        )}

        <div className="mb-4">
          <label className="mb-1.5 block text-sm font-semibold text-gray-900">
            Email<span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className={fieldClass}
          />
        </div>

        {isRegister && (
          <div className="mb-4">
            <label className="mb-1.5 block text-sm font-semibold text-gray-900">Phone number</label>
            <div className="flex h-12 overflow-hidden rounded-xl border border-gray-200 bg-white focus-within:border-[#1D4ED8] focus-within:ring-4 focus-within:ring-[#1D4ED8]/10">
              <span className="flex items-center border-r border-gray-200 px-3 text-sm font-semibold text-gray-700">+91</span>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone number"
                className="w-full bg-transparent px-3 text-[15px] text-gray-900 outline-none placeholder:text-gray-400"
              />
            </div>
          </div>
        )}

        <div className={isRegister ? 'grid grid-cols-2 gap-3' : ''}>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-gray-900">
              Password<span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                autoComplete={isRegister ? 'new-password' : 'current-password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className={`${fieldClass} pr-11`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>
          </div>

          {isRegister && (
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-gray-900">
                Confirm<span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm"
                  className={`${fieldClass} pr-11`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                  aria-label={showConfirm ? 'Hide password' : 'Show password'}
                >
                  {showConfirm ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
            </div>
          )}
        </div>

        {!isRegister && (
          <div className="mt-3 flex items-center justify-between">
            <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-600">
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
              className="text-sm text-gray-500 hover:text-gray-800"
            >
              Forgot Password?
            </button>
          </div>
        )}

        <button type="submit" id="submit-auth-btn" disabled={loading} className={`${primaryBtn} mt-5`}>
          {loading ? (isRegister ? 'Creating account...' : 'Signing in...') : isRegister ? 'Sign up' : 'Sign in'}
        </button>
      </form>

      {isRegister && (
        <div className="mt-4 space-y-3">
          <OrDivider />
          <div className="grid grid-cols-2 gap-3">
            <button type="button" onClick={handleGoogleBtnClick} className={socialBtn}>
              <GoogleIcon />
              Google
            </button>
            <button type="button" onClick={handleAppleClick} className={socialBtn}>
              <AppleIcon />
              Apple
            </button>
          </div>
        </div>
      )}

      {isRegister
        ? switchLink('Already have an account?', 'Sign in', 'signin')
        : switchLink("Don't have an account?", 'Sign up', 'signup')}
    </>
  );
};

export default Login;
