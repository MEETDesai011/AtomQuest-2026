import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { FormField } from '../components/ui/FormField';
import { Navigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { Atom, Sparkles, Target, TrendingUp, Shield, User, Users, Lock } from 'lucide-react';

export default function Login() {
  const { login, googleLogin, user } = useAuth();
  const { register, handleSubmit, formState: { errors, isSubmitting }, setValue } = useForm();

  if (user) {
    if (user.role === 'EMPLOYEE') return <Navigate to="/employee/dashboard" />;
    if (user.role === 'MANAGER')  return <Navigate to="/manager/dashboard" />;
    if (user.role === 'ADMIN')    return <Navigate to="/admin/dashboard" />;
  }

  const onSubmit = async (data) => {
    await login(data.email, data.password);
  };

  const setDemo = (email) => {
    setValue('email', email);
    setValue('password', 'password123');
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      await googleLogin(credentialResponse.credential);
    } catch (err) { /* handled in AuthContext */ }
  };

  const DEMO_ACCOUNTS = [
    { icon: User,   label: 'Employee', email: 'john.doe@atomquest.com',     color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20 hover:border-indigo-400/50' },
    { icon: Users,  label: 'Manager',  email: 'sarah.manager@atomquest.com', color: 'text-violet-400 bg-violet-500/10 border-violet-500/20 hover:border-violet-400/50' },
    { icon: Shield, label: 'Admin',    email: 'admin@atomquest.com',          color: 'text-rose-400   bg-rose-500/10   border-rose-500/20   hover:border-rose-400/50' },
  ];

  const FEATURE_PILLS = [
    { icon: Target,    label: 'Goal Tracking' },
    { icon: TrendingUp, label: 'Analytics' },
    { icon: Sparkles,  label: 'AI Copilot' },
  ];

  return (
    <div className="min-h-screen flex w-full overflow-hidden" style={{ background: '#080d1a' }}>
      {/* ── Left panel: Brand ── */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-center items-center p-16 overflow-hidden">
        {/* Background orbs */}
        <div className="absolute top-[-100px] left-[-100px] w-96 h-96 rounded-full bg-indigo-600/15 blur-3xl" />
        <div className="absolute bottom-[-80px] right-[-80px] w-80 h-80 rounded-full bg-violet-600/12 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-cyan-600/6 blur-3xl" />

        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(rgba(99,102,241,1) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,1) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />

        <div className="relative z-10 max-w-md text-center">
          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-12">
            <div className="w-12 h-12 rounded-2xl gradient-indigo-violet flex items-center justify-center shadow-[0_8px_32px_rgba(99,102,241,0.5)]">
              <Atom className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <div className="text-xl font-bold text-white tracking-tight">AtomQuest</div>
              <div className="text-[11px] text-slate-500 uppercase tracking-widest font-semibold">Goal Portal</div>
            </div>
          </div>

          {/* Headline */}
          <h1 className="heading-xl text-white mb-4 leading-tight">
            Enterprise goal setting
            <span className="block text-gradient-indigo mt-1">reimagined.</span>
          </h1>
          <p className="text-base text-slate-500 leading-relaxed mb-12">
            AI-powered productivity workspace for high-performance teams. Set, track, and achieve goals at scale.
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {FEATURE_PILLS.map(({ icon: Icon, label }) => (
              <span key={label} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/8 text-sm text-slate-400">
                <Icon className="w-4 h-4 text-indigo-400" />
                {label}
              </span>
            ))}
          </div>

          {/* Stat bar */}
          <div className="grid grid-cols-3 gap-4 text-center">
            {[
              { v: '10K+', l: 'Goals Tracked' },
              { v: '98%',  l: 'Completion Rate' },
              { v: '40+',  l: 'Departments' },
            ].map(({ v, l }) => (
              <div key={l} className="card px-4 py-3">
                <div className="text-xl font-bold text-gradient-indigo">{v}</div>
                <div className="text-xs text-slate-600 mt-1">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right panel: Form ── */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 relative">
        {/* Top mobile brand */}
        <div className="lg:hidden flex items-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-xl gradient-indigo-violet flex items-center justify-center">
            <Atom className="w-4 h-4 text-white" />
          </div>
          <span className="text-base font-bold text-white">AtomQuest</span>
        </div>

        <div className="w-full max-w-md animate-fade-up">
          {/* Card */}
          <div
            className="rounded-2xl p-8 overflow-hidden"
            style={{
              background: 'rgba(10,15,28,0.9)',
              border: '1px solid rgba(99,102,241,0.15)',
              backdropFilter: 'blur(40px)',
              boxShadow: '0 32px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05)',
            }}
          >
            {/* Top gradient line */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />

            <div className="mb-8">
              <h2 className="text-xl font-bold text-slate-100">Welcome back</h2>
              <p className="text-sm text-slate-500 mt-1">Sign in to your AtomQuest workspace</p>
            </div>

            {/* Google Sign-In */}
            <div className="mb-6">
              <div className="flex justify-center">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => console.error('Google Sign-In failed')}
                  theme="filled_black"
                  size="large"
                  width="360"
                  text="signin_with"
                  shape="pill"
                />
              </div>
            </div>

            {/* Divider */}
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/6" />
              </div>
              <div className="relative flex justify-center">
                <span className="px-4 text-xs text-slate-600 bg-[#0a0f1c]">or continue with email</span>
              </div>
            </div>

            {/* Email form */}
            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <FormField
                label="Email address"
                type="email"
                {...register('email', { required: 'Email is required' })}
                error={errors.email}
                placeholder="you@atomquest.com"
              />
              <FormField
                label="Password"
                type="password"
                {...register('password', { required: 'Password is required' })}
                error={errors.password}
                placeholder="Enter your password"
              />

              <button
                type="submit"
                disabled={isSubmitting}
                className="
                  w-full py-3 rounded-xl text-sm font-semibold text-white
                  gradient-indigo-violet
                  shadow-[0_4px_15px_rgba(99,102,241,0.4)]
                  hover:shadow-[0_6px_25px_rgba(99,102,241,0.5)]
                  hover:brightness-110
                  disabled:opacity-50 disabled:cursor-not-allowed
                  transition-all duration-200
                  flex items-center justify-center gap-2
                "
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    Sign in securely
                  </>
                )}
              </button>
            </form>

            {/* Demo accounts */}
            <div className="mt-8 pt-6 border-t border-white/6">
              <p className="label-xs text-slate-600 text-center mb-4">Quick Demo Access</p>
              <div className="grid grid-cols-3 gap-2">
                {DEMO_ACCOUNTS.map(({ icon: Icon, label, email, color }) => (
                  <button
                    key={label}
                    onClick={() => setDemo(email)}
                    className={`
                      flex flex-col items-center gap-2 py-3 px-2 rounded-xl
                      border transition-all duration-200 text-xs font-semibold
                      ${color}
                    `}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <p className="text-center text-xs text-slate-600 mt-6">
            Enterprise SaaS · SOC 2 Compliant · 256-bit Encryption
          </p>
        </div>
      </div>
    </div>
  );
}
