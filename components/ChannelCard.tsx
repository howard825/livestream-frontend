import Link from 'next/link';
import { Channel } from '@/lib/api';
import { Radio } from 'lucide-react';

export default function ChannelCard({ channel }: { channel: Channel }) {
  return (
    <Link href={`/watch/${channel.slug}`} className="group block">
      <div className="rounded-xl overflow-hidden border border-white/5 bg-[#111118] hover:border-brand-600/40 transition-all duration-200 hover:shadow-lg hover:shadow-brand-900/20">
        {/* Thumbnail / Preview */}
        <div className="relative aspect-video bg-[#0d0d14] flex items-center justify-center">
          {channel.isLive ? (
            <div className="absolute inset-0 bg-gradient-to-br from-brand-900/30 to-transparent" />
          ) : null}

          {/* Placeholder icon */}
          <Radio
            className={`w-12 h-12 transition-colors ${
              channel.isLive ? 'text-brand-500' : 'text-white/10'
            }`}
          />

          {/* Live badge */}
          {channel.isLive && (
            <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-live/90 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
              <span className="live-dot w-1.5 h-1.5 rounded-full bg-white inline-block" />
              LIVE
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-4">
          <h3 className="font-semibold text-white group-hover:text-brand-400 transition-colors line-clamp-1">
            {channel.name}
          </h3>
          {channel.description && (
            <p className="text-sm text-white/40 mt-1 line-clamp-2">{channel.description}</p>
          )}
          <p className="text-xs text-white/25 mt-2">
            {channel.isLive ? (
              <span className="text-brand-400">Streaming now</span>
            ) : (
              'Offline'
            )}
          </p>
        </div>
      </div>
    </Link>
  );
}
