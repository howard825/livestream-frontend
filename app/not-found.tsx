import Link from 'next/link';
import { Radio } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <Radio className="w-14 h-14 text-white/10 mb-4" />
      <h1 className="text-4xl font-bold text-white mb-2">404</h1>
      <p className="text-white/40 mb-6">Channel or page not found.</p>
      <Link
        href="/"
        className="text-brand-400 hover:text-brand-300 transition-colors text-sm"
      >
        ← Back to home
      </Link>
    </div>
  );
}
