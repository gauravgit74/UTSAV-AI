import React, { useState } from 'react';
import { ArrowRight, Sun, Moon, UserCheck, Info } from 'lucide-react';
import { UserProfile } from '../types/utsav';
import { GENERATED_IMAGES } from '../data/mockUtsavData';

interface LoginScreenProps {
  onLoginSuccess: (profile: UserProfile) => void;
  isDark: boolean;
  onToggleTheme: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onLoginSuccess,
  isDark,
  onToggleTheme,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [googleNotice, setGoogleNotice] = useState(false);

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName && !trimmedEmail) {
      setError('Please enter your name or email address to continue.');
      return;
    }

    if (trimmedEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setError('Please enter a valid email address.');
      return;
    }

    const derivedName =
      trimmedName ||
      trimmedEmail
        .split('@')[0]
        .replace(/[._-]+/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase());

    const profile: UserProfile = {
      id: `user-${Date.now()}`,
      name: derivedName,
      email: trimmedEmail || 'planner@utsav.ai',
      authMode: 'email',
      createdAt: new Date().toISOString(),
    };

    setError(null);
    onLoginSuccess(profile);
  };

  const handleGuestLogin = () => {
    const guestProfile: UserProfile = {
      id: 'guest-host',
      name: 'Guest Host',
      email: 'guest@utsav.ai',
      authMode: 'guest',
      createdAt: new Date().toISOString(),
    };
    onLoginSuccess(guestProfile);
  };

  const handleGooglePlaceholder = () => {
    setGoogleNotice(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFBF5] text-[#24161A] dark:bg-[#140F11] dark:text-[#F9F2EC] transition-colors duration-200">
      {/* Top Bar */}
      <header className="flex items-center justify-between px-6 py-5 sm:px-10">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#7A1F3D] to-[#561329] text-[#FFFBF5] shadow-sm">
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M12 3c2.2 3.2 2.2 6.8 0 10-2.2-3.2-2.2-6.8 0-10Z" />
              <path d="M12 13c3.5-2.6 6.8-2.2 8.5.4-2.8 1.9-6.2 1.8-8.5-.4Z" />
              <path d="M12 13c-3.5-2.6-6.8-2.2-8.5.4 2.8 1.9 6.2 1.8 8.5-.4Z" />
              <path
                d="M7 18.5c3.2 1.4 6.8 1.4 10 0"
                className="text-[#E8A317]"
                stroke="currentColor"
              />
            </svg>
          </div>
          <span className="font-serif text-xl font-semibold tracking-tight whitespace-nowrap">
            Utsav <span className="text-[#7A1F3D] dark:text-[#E8A317]">AI</span>
          </span>
        </div>

        <button
          type="button"
          onClick={onToggleTheme}
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#E8DCD0] dark:border-[#35282B] bg-white dark:bg-[#1E1719] text-[#533F45] dark:text-[#E8A317] hover:border-[#E8A317] transition-colors"
        >
          {isDark ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
        </button>
      </header>

      {/* Main Centered Split Card */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 sm:px-8">
        <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 overflow-hidden rounded-3xl border border-[#EAE0D5] dark:border-[#322528] bg-white dark:bg-[#1B1416] shadow-[0_20px_50px_rgba(36,22,26,0.08)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.45)]">
          {/* Left Visual Editorial Column */}
          <div className="relative hidden lg:flex lg:col-span-5 flex-col justify-between p-8 bg-[#2A131B] text-[#FFFBF5] overflow-hidden">
            <img
              src={GENERATED_IMAGES.venueUdaipur}
              alt="Heritage courtyard celebration lit with marigold garlands"
              referrerPolicy="no-referrer"
              className="absolute inset-0 h-full w-full object-cover opacity-55"
            />
            <div
              className="absolute inset-0 bg-gradient-to-t from-[#1F0C13] via-[#2A131B]/65 to-[#2A131B]/40"
              aria-hidden="true"
            />

            <div className="relative z-10">
              <p className="text-xs font-medium tracking-wide text-[#F4C45D]">
                ✦ Shubh AI Event Suite
              </p>
              <h1 className="mt-3 font-serif text-3xl font-semibold leading-snug text-balance">
                Every celebration begins with an idea.
              </h1>
            </div>

            <div className="relative z-10 space-y-3">
              <p className="text-sm text-[#F5E6EA] leading-relaxed">
                Unify venues, manpower, vendors, invitations, budgets, timelines, and memories in one serene workspace.
              </p>
              <p className="text-xs text-[#E3C9D1]">
                Curated for weddings, milestones &amp; unforgettable gatherings.
              </p>
            </div>
          </div>

          {/* Right Sign-In Column */}
          <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center">
            <div className="mb-6">
              <p className="lg:hidden text-xs font-medium text-[#7A1F3D] dark:text-[#E8A317] mb-1.5">
                ✦ Event &amp; Wedding Workspace
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl font-semibold tracking-tight text-[#24161A] dark:text-[#F9F2EC]">
                Welcome to Utsav AI
              </h2>
              <p className="mt-1.5 text-sm text-[#6B545A] dark:text-[#B4A2A7]">
                Sign in to set up your celebration workspace and save your planning progress.
              </p>
            </div>

            {/* Google Sign-In Placeholder */}
            <button
              type="button"
              onClick={handleGooglePlaceholder}
              className="w-full flex items-center justify-center gap-3 rounded-xl border border-[#E5D8CB] dark:border-[#382B2E] bg-[#FFFDF9] dark:bg-[#221A1D] px-4 py-3 text-sm font-medium text-[#24161A] dark:text-[#F9F2EC] hover:border-[#E8A317] hover:bg-[#FFF8EE] dark:hover:bg-[#2A2023] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8A317]"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" aria-hidden="true">
                <path
                  fill="#EA4335"
                  d="M12 10.2v3.9h5.4c-.2 1.3-1.5 3.9-5.4 3.9-3.3 0-6-2.7-6-6s2.7-6 6-6c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.7 3.4 14.6 2.5 12 2.5 6.8 2.5 2.5 6.8 2.5 12s4.3 9.5 9.5 9.5c5.5 0 9.1-3.9 9.1-9.3 0-.6-.1-1.1-.2-1.6H12Z"
                />
                <path
                  fill="#34A853"
                  d="M3.6 7.3l3.2 2.3C7.7 7.4 9.7 6 12 6c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.7 3.4 14.6 2.5 12 2.5 8.3 2.5 5.1 4.5 3.6 7.3Z"
                />
                <path
                  fill="#FBBC05"
                  d="M12 21.5c2.6 0 4.8-.9 6.4-2.4l-3-2.5c-.8.6-1.9 1-3.4 1-2.6 0-4.8-1.7-5.6-4.1l-3.2 2.5C4.8 19.2 8.1 21.5 12 21.5Z"
                />
                <path
                  fill="#4285F4"
                  d="M21.1 12.2c0-.6-.1-1.1-.2-1.6H12v3.9h5.4c-.3 1.2-1 2.2-2 2.9l3 2.5c1.8-1.6 2.7-4 2.7-7.7Z"
                />
              </svg>
              <span>Continue with Google</span>
              <span className="text-[11px] text-[#8A7278] dark:text-[#9D8A8F]">
                (Coming soon)
              </span>
            </button>

            {googleNotice && (
              <div
                role="status"
                className="mt-3 flex items-start gap-2.5 rounded-xl border border-[#E8A317]/40 bg-[#FFF8E8] dark:bg-[#2B2214] px-3.5 py-2.5 text-xs text-[#6B4A0A] dark:text-[#F4C86A]"
              >
                <Info className="h-4 w-4 shrink-0 mt-0.5" />
                <span>
                  Google OAuth is not connected yet. Please enter your details below or select <strong>Continue as Guest</strong> to start planning.
                </span>
              </div>
            )}

            <div className="my-5 flex items-center gap-3">
              <div className="h-px flex-1 bg-[#EFE4D8] dark:bg-[#2E2225]" />
              <span className="text-xs text-[#8A7278] dark:text-[#9D8A8F]">
                or continue with details
              </span>
              <div className="h-px flex-1 bg-[#EFE4D8] dark:bg-[#2E2225]" />
            </div>

            <form onSubmit={handleContinue} className="space-y-4">
              <div>
                <label
                  htmlFor="login-name"
                  className="block text-xs font-medium text-[#5A474C] dark:text-[#D5C6CA] mb-1.5"
                >
                  Your name
                </label>
                <input
                  id="login-name"
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="e.g. Gaurav Potdar"
                  className="w-full h-11 rounded-xl border border-[#E5D8CB] dark:border-[#382B2E] bg-[#FFFDF9] dark:bg-[#221A1D] px-3.5 text-sm text-[#24161A] dark:text-[#F9F2EC] placeholder:text-[#A38E93] dark:placeholder:text-[#7E6D72] focus:border-[#E8A317] focus:outline-none focus:ring-3 focus:ring-[#E8A317]/15"
                />
              </div>

              <div>
                <label
                  htmlFor="login-email"
                  className="block text-xs font-medium text-[#5A474C] dark:text-[#D5C6CA] mb-1.5"
                >
                  Email address
                </label>
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="you@example.com"
                  className="w-full h-11 rounded-xl border border-[#E5D8CB] dark:border-[#382B2E] bg-[#FFFDF9] dark:bg-[#221A1D] px-3.5 text-sm text-[#24161A] dark:text-[#F9F2EC] placeholder:text-[#A38E93] dark:placeholder:text-[#7E6D72] focus:border-[#E8A317] focus:outline-none focus:ring-3 focus:ring-[#E8A317]/15"
                />
              </div>

              {error && (
                <p
                  role="alert"
                  className="text-xs font-medium text-[#B3261E] dark:text-[#F28B82]"
                >
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="w-full h-11 inline-flex items-center justify-center gap-2 rounded-xl bg-[#7A1F3D] dark:bg-[#E8A317] px-5 text-sm font-medium text-[#FFFBF5] dark:text-[#1D1316] hover:bg-[#641730] dark:hover:bg-[#D49212] transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8A317]"
              >
                <span>Continue</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>

            <div className="mt-4">
              <button
                type="button"
                onClick={handleGuestLogin}
                className="w-full h-11 inline-flex items-center justify-center gap-2 rounded-xl border border-[#EAE0D5] dark:border-[#34272A] bg-[#FAF4EC] dark:bg-[#241B1E] px-4 text-sm font-medium text-[#4E3B40] dark:text-[#DFD2D6] hover:border-[#E8A317] hover:bg-[#FFF6E5] dark:hover:bg-[#2C2125] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8A317]"
              >
                <UserCheck className="h-4 w-4 text-[#7A1F3D] dark:text-[#E8A317]" />
                <span>Continue as Guest</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
