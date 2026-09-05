'use client';

import { useEffect, useRef, useState } from 'react';
import { AlertCircle, Loader2, WifiOff } from 'lucide-react';

interface HLSPlayerProps {
  src: string;
  isLive: boolean;
}

export default function HLSPlayer({ src, isLive }: HLSPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<any>(null);
  const [status, setStatus] = useState<'loading' | 'playing' | 'error' | 'offline'>('loading');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!videoRef.current) return;

    if (!isLive) {
      setStatus('offline');
      return;
    }

    setStatus('loading');

    const video = videoRef.current;

    async function initPlayer() {
      const Hls = (await import('hls.js')).default;

      if (Hls.isSupported()) {
        const hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 30,
          liveBackBufferLength: 30,
          liveSyncDurationCount: 2,
          liveMaxLatencyDurationCount: 5,
          manifestLoadingTimeOut: 10000,
          manifestLoadingMaxRetry: 3,
          manifestLoadingRetryDelay: 1000,
        });

        hlsRef.current = hls;
        hls.loadSource(src);
        hls.attachMedia(video);

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          video.play().catch(() => {});
          setStatus('playing');
        });

        hls.on(Hls.Events.ERROR, (event: any, data: any) => {
          if (data.fatal) {
            if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
              setStatus('error');
              setErrorMsg('Cannot reach stream. Make sure the server is running.');
              // Auto retry after 5s
              setTimeout(() => {
                hls.startLoad();
              }, 5000);
            } else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
              hls.recoverMediaError();
            } else {
              setStatus('error');
              setErrorMsg('Playback error. Stream may have ended.');
            }
          }
        });
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        // Safari native HLS
        video.src = src;
        video.addEventListener('loadedmetadata', () => {
          video.play().catch(() => {});
          setStatus('playing');
        });
        video.addEventListener('error', () => {
          setStatus('error');
          setErrorMsg('Playback error');
        });
      } else {
        setStatus('error');
        setErrorMsg('Your browser does not support HLS playback.');
      }
    }

    initPlayer();

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [src, isLive]);

  return (
    <div className="video-wrapper rounded-xl overflow-hidden bg-black">
      {/* Video element */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full"
        controls
        playsInline
        muted={false}
        style={{ display: status === 'playing' ? 'block' : 'none' }}
      />

      {/* Loading state */}
      {status === 'loading' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black">
          <Loader2 className="w-10 h-10 text-brand-500 animate-spin" />
          <p className="text-white/50 text-sm">Connecting to stream...</p>
        </div>
      )}

      {/* Offline state */}
      {status === 'offline' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#0a0a0f]">
          <WifiOff className="w-12 h-12 text-white/20" />
          <p className="text-white/40 font-medium">Channel is offline</p>
          <p className="text-white/25 text-sm">Check back when the stream is live</p>
        </div>
      )}

      {/* Error state */}
      {status === 'error' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#0a0a0f]">
          <AlertCircle className="w-12 h-12 text-red-400" />
          <p className="text-white/60 font-medium">Stream unavailable</p>
          <p className="text-white/30 text-sm text-center max-w-xs">{errorMsg}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 text-sm text-brand-400 hover:text-brand-300 transition-colors"
          >
            Retry
          </button>
        </div>
      )}
    </div>
  );
}
