import { getChannels } from '@/lib/api';
import ChannelCard from '@/components/ChannelCard';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { Radio } from 'lucide-react';

export const revalidate = 10; // Revalidate every 10 seconds

export default async function HomePage() {
  let channels = [];
  let error = '';

  try {
    channels = await getChannels();
  } catch (err) {
    error = 'Could not connect to the stream server. Make sure the local server is running.';
  }

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
            {error ? '' : `${channels.length} channel${channels.length !== 1 ? 's' : ''} · ${liveChannels.length} live`}
          </p>
        </div>

        {/* Error banner */}
        {error && (
          <div className="mb-8 p-4 rounded-xl border border-red-500/20 bg-red-500/5 text-red-400 text-sm">
            ⚠️ {error}
          </div>
        )}

        {/* Live channels */}
        {liveChannels.length > 0 && (
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
        {offlineChannels.length > 0 && (
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
        {channels.length === 0 && !error && (
          <div className="text-center py-24">
            <Radio className="w-14 h-14 text-white/10 mx-auto mb-4" />
            <h2 className="text-white/30 text-lg font-medium">No channels yet</h2>
            <p className="text-white/20 text-sm mt-2">
              A superadmin needs to create channels first.
            </p>
          </div>
        )}
      </main>

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
    </div>
  );
}
