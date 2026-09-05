'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { Radio, LogIn, LogOut, Settings, Shield } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#0a0a0f]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-white font-semibold tracking-tight hover:opacity-80 transition-opacity"
        >
          <Radio className="w-5 h-5 text-brand-500" />
          <span>LiveStream</span>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="text-sm text-white/50 hidden sm:block">
                {user.username}
                {user.role === 'SUPERADMIN' && (
                  <span className="ml-1.5 text-xs bg-brand-600/30 text-brand-400 px-1.5 py-0.5 rounded">
                    superadmin
                  </span>
                )}
              </span>

              {user.role === 'SUPERADMIN' ? (
                <Link
                  href="/superadmin"
                  className="flex items-center gap-1.5 text-sm text-white/70 hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5"
                >
                  <Shield className="w-4 h-4" />
                  <span className="hidden sm:block">Panel</span>
                </Link>
              ) : (
                <Link
                  href="/dashboard"
                  className="flex items-center gap-1.5 text-sm text-white/70 hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5"
                >
                  <Settings className="w-4 h-4" />
                  <span className="hidden sm:block">Dashboard</span>
                </Link>
              )}

              <button
                onClick={logout}
                className="flex items-center gap-1.5 text-sm text-white/50 hover:text-white/80 transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:block">Logout</span>
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-1.5 text-sm text-white/70 hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5"
            >
              <LogIn className="w-4 h-4" />
              <span>Admin Login</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
