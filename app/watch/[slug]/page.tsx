import { getChannel } from '@/lib/api';
import HLSPlayer from '@/components/HLSPlayer';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { ArrowLeft, Radio } from 'lucide-react';
import { notFound } from 'next/navigation';

export const revalidate = 5;

interface Props {
  params: { slug: string };
}

export default async function WatchPage({ params }: Props) {
  let channel;

  try {
    channel = await getChannel(params.slug);
  } catch {
    notFound();
  }

  const HLS_URL = process.env.NEXT_PUBLIC_HLS_URL || 'http://localhost:3002';
  const streamSrc = `${HLS_URL}/hls/${channel.slug}/index.m3u8`;

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-20 pb-16">
        {/* Back */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-white/40 hover:text-white/70 text-sm mt-6 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          All channels
        </Link>

        {/* Player */}
        <HLSPlayer src={streamSrc} isLive={channel.isLive} />

        {/* Channel info */}
        <div className="mt-5 pb-2 border-b border-white/5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                {channel.isLive && (
                  <span className="inline-flex items-center gap-1.5 bg-live/15 text-live text-xs font-semibold px-2.5 py-1 rounded-full border border-live/25">
                    <span className="live-dot w-1.5 h-1.5 rounded-full bg-live inline-block" />
                    LIVE
                  </span>
                )}
                <h1 className="text-xl sm:text-2xl font-bold text-white">{channel.name}</h1>
              </div>
              {channel.description && (
                <p className="text-white/40 mt-2 text-sm leading-relaxed max-w-2xl">
                  {channel.description}
                </p>
              )}
            </div>

            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-brand-900/40 border border-brand-700/30 flex items-center justify-center">
                <Radio className="w-5 h-5 text-brand-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Meta */}
        <div className="mt-4 flex items-center gap-4 text-xs text-white/25">
          {channel.owner && <span>by {channel.owner.username}</span>}
          <span>/{channel.slug}</span>
        </div>
      </main>
    </div>
  );
}
