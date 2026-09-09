'use client';

import { useEffect, useState } from 'react';
import { getChannels, Channel } from '@/lib/api';
import ChannelCard from '@/components/ChannelCard';
import Navbar from '@/components/Navbar';
import { Radio } from 'lucide-react';

export default function HomePage() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchChannels = async () => {
    try {
      const data = await getChannels();
      setChannels(data);
      setError('');
    } catch (err) {
      setError('Could not connect to the stream server. Make sure the local server is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChannels();
    // Mag-auto refresh bawat 10 segundo para ma-detect kung may nag-live
    const interval = setInterval(fetchChannels, 10000);
    return () => clearInterval(interval);
  }, []);

  const liveChannels = channels.filter((c) => c.isLive);
  const offlineChannels = channels.filter((c) => !c.isLive);

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-20 pb-16">
        {/* Hero */}
        <div className="py-10 sm:py-14">
          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Live Channels
          </h1>
          <p className="text-white/40 mt-2">
            {error || loading ? '' : `${channels.length} channel${channels.length !== 1 ? 's' : ''} · ${liveChannels.length} live`}
          </p>
        </div>

        {/* Error banner */}
        {error && (
          <div className="mb-8 p-4 rounded-xl border border-red-500/20 bg-red-500/5 text-red-400 text-sm">
            ⚠️ {error}
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div className="text-white/40 text-sm py-10">Loading channels...</div>
        )}

        {/* Live channels */}
        {!loading && liveChannels.length > 0 && (
          <section className="mb-10">
            <div className="flex items-center gap-2 mb-5">
              <span className="live-dot w-2 h-2 rounded-full bg-live inline-block" />
              <h2 className="text-sm font-semibold text-white/60 uppercase tracking-widest">
                Live Now
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {liveChannels.map((channel) => (
                <ChannelCard key={channel.id} channel={channel} />
              ))}
            </div>
          </section>
        )}

        {/* Offline channels */}
        {!loading && offlineChannels.length > 0 && (
          <section>
            {liveChannels.length > 0 && (
              <h2 className="text-sm font-semibold text-white/30 uppercase tracking-widest mb-5">
                Offline
              </h2>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {offlineChannels.map((channel) => (
                <ChannelCard key={channel.id} channel={channel} />
              ))}
            </div>
          </section>
        )}

        {/* Empty state */}
        {!loading && channels.length === 0 && !error && (
          <div className="text-center py-24">
            <Radio className="w-14 h-14 text-white/10 mx-auto mb-4" />
            <h2 className="text-white/30 text-lg font-medium">No channels yet</h2>
            <p className="text-white/20 text-sm mt-2">
              A superadmin needs to create channels first.
            </p>
          </div>
        )}

        {/* Footer */}
        <footer className="border-t border-white/5 py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/25">
            <span>© {new Date().getFullYear()} LiveStream Platform</span>
            <div className="flex items-center gap-5">
              <Link href="/privacy" className="hover:text-white/50 transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-white/50 transition-colors">Terms of Service</Link>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}