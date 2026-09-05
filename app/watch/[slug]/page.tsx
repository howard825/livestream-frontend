'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getChannel, Channel } from '@/lib/api';
import Navbar from '@/components/Navbar';
import HLSPlayer from '@/components/HLSPlayer';
import Link from 'next/link';
import { Radio } from 'lucide-react';

const HLS_URL = process.env.NEXT_PUBLIC_HLS_URL || 'https://hls-stream.swifftnet.site';

export default function WatchPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [channel, setChannel] = useState<Channel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchChannelData = async () => {
    if (!slug) return;
    try {
      const data = await getChannel(slug);
      setChannel(data);
      setError(false);
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChannelData();
    const interval = setInterval(fetchChannelData, 5000);
    return () => clearInterval(interval);
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="max-w-6xl mx-auto px-4 pt-24 pb-16 text-center text-white/40">
          Loading stream...
        </main>
      </div>
    );
  }

  if (error || !channel) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="max-w-6xl mx-auto px-4 pt-24 pb-16 text-center">
          <Radio className="w-16 h-16 text-white/10 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">404</h1>
          <p className="text-white/40 mb-6">Channel or page not found.</p>
          <Link
            href="/"
            className="text-sm text-white/60 hover:text-white transition-colors"
          >
            ← Back to home
          </Link>
        </main>
      </div>
    );
  }

  // Ginawa nating src ang hls stream URL para tugma sa HLSPlayer
  const streamSrc = `${HLS_URL}/hls/${channel.slug}/index.m3u8`;

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 pt-20 pb-16">
        <div className="mb-6">
          {/* HLS Video Player */}
          <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black/40 border border-white/10 relative">
            <HLSPlayer src={streamSrc} isLive={channel.isLive} />
          </div>

          {/* Channel Info */}
          <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-white">{channel.name}</h1>
                {channel.isLive ? (
                  <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                    LIVE
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/5 text-white/40 border border-white/10">
                    OFFLINE
                  </span>
                )}
              </div>
              {channel.description && (
                <p className="text-white/60 mt-1 text-sm">{channel.description}</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}