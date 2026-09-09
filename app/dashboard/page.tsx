'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Channel, getStreamKey, regenerateStreamKey, updateChannel, changePassword } from '@/lib/api';
import Navbar from '@/components/Navbar';
import {
  Copy, Check, RefreshCw, Eye, EyeOff, Radio,
  Settings, Key, Loader2, AlertCircle, ExternalLink,
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, token, loading } = useAuth();
  const router = useRouter();

  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [streamKey, setStreamKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [copied, setCopied] = useState(false);
  const [keyLoading, setKeyLoading] = useState(false);
  const [regenLoading, setRegenLoading] = useState(false);

  // Edit channel
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editLoading, setEditLoading] = useState(false);
  const [editMsg, setEditMsg] = useState('');

  // Change password
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [pwMsg, setPwMsg] = useState('');
  const [pwLoading, setPwLoading] = useState(false);

  const [error, setError] = useState('');

  useEffect(() => {
    if (!loading && !user) router.replace('/login');
    if (!loading && user?.role === 'SUPERADMIN') router.replace('/superadmin');
  }, [user, loading, router]);

  useEffect(() => {
    if (user?.channels?.length && !selectedChannel) {
      setSelectedChannel(user.channels[0] as Channel);
    }
  }, [user]);

  useEffect(() => {
    if (selectedChannel && token) {
      setStreamKey('');
      setShowKey(false);
      setEditName(selectedChannel.name);
      setEditDesc((selectedChannel as any).description || '');
    }
  }, [selectedChannel, token]);

  async function loadStreamKey() {
    if (!selectedChannel || !token) return;
    setKeyLoading(true);
    try {
      const key = await getStreamKey(token, selectedChannel.slug);
      setStreamKey(key);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setKeyLoading(false);
    }
  }

  async function handleRegenKey() {
    if (!selectedChannel || !token) return;
    if (!confirm('Regenerate stream key? OBS will need to be updated.')) return;
    setRegenLoading(true);
    try {
      const key = await regenerateStreamKey(token, selectedChannel.slug);
      setStreamKey(key);
      setShowKey(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setRegenLoading(false);
    }
  }

  async function handleCopy(text: string) {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleSaveChannel(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedChannel || !token) return;
    setEditLoading(true);
    setEditMsg('');
    try {
      await updateChannel(token, selectedChannel.slug, { name: editName, description: editDesc });
      setEditMsg('✓ Saved');
      setTimeout(() => setEditMsg(''), 3000);
    } catch (err: any) {
      setEditMsg('Error: ' + err.message);
    } finally {
      setEditLoading(false);
    }
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;
    setPwLoading(true);
    setPwMsg('');
    try {
      await changePassword(token, currentPw, newPw);
      setPwMsg('✓ Password changed');
      setCurrentPw('');
      setNewPw('');
      setTimeout(() => setPwMsg(''), 3000);
    } catch (err: any) {
      setPwMsg('Error: ' + err.message);
    } finally {
      setPwLoading(false);
    }
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
      </div>
    );
  }

  const channels = user.channels || [];

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-20 pb-16">
        <div className="py-8">
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-white/40 text-sm mt-1">Manage your channels and stream settings</p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </div>
        )}

        {channels.length === 0 ? (
          <div className="text-center py-20 text-white/30">
            <Radio className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p>No channels assigned to you yet.</p>
            <p className="text-sm mt-1">Ask your superadmin to create and assign a channel.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Channel selector */}
            {channels.length > 1 && (
              <div>
                <label className="block text-sm text-white/50 mb-2">Select Channel</label>
                <div className="flex gap-2 flex-wrap">
                  {channels.map((ch) => (
                    <button
                      key={ch.id}
                      onClick={() => setSelectedChannel(ch as Channel)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        selectedChannel?.id === ch.id
                          ? 'bg-brand-600 text-white'
                          : 'bg-white/5 text-white/50 hover:bg-white/10'
                      }`}
                    >
                      {ch.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {selectedChannel && (
              <>
                {/* Stream Status */}
                <div className="p-5 rounded-xl bg-[#111118] border border-white/5">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-semibold text-white flex items-center gap-2">
                      <Radio className="w-4 h-4 text-brand-400" />
                      {selectedChannel.name}
                    </h2>
                    <div className="flex items-center gap-2">
                      {(selectedChannel as any).isLive ? (
                        <span className="flex items-center gap-1.5 text-xs font-semibold text-live">
                          <span className="live-dot w-1.5 h-1.5 rounded-full bg-live inline-block" />
                          LIVE
                        </span>
                      ) : (
                        <span className="text-xs text-white/25">Offline</span>
                      )}
                      <Link
                        href={`/watch/${selectedChannel.slug}`}
                        target="_blank"
                        className="text-white/30 hover:text-white/60 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>

                  {/* OBS Info */}
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-white/40 mb-1">OBS Server URL</p>
                      <div className="flex items-center gap-2">
                        <code className="flex-1 text-xs bg-white/5 border border-white/10 rounded px-3 py-2 text-green-400 font-mono">
                          rtmp://live.swifftnet.site:1935/live
                        </code>
                        <button
                          onClick={() => handleCopy('rtmp://live.swifftnet.site:1935/live')}
                          className="p-2 rounded-lg hover:bg-white/5 text-white/40 hover:text-white/70 transition-colors"
                        >
                          {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-white/40 mb-1">Stream Key</p>
                      {streamKey ? (
                        <div className="flex items-center gap-2">
                          <code className="flex-1 text-xs bg-white/5 border border-white/10 rounded px-3 py-2 text-yellow-400 font-mono truncate">
                            {showKey ? streamKey : '••••••••••••••••••••••••••••••••'}
                          </code>
                          <button
                            onClick={() => setShowKey(!showKey)}
                            className="p-2 rounded-lg hover:bg-white/5 text-white/40 hover:text-white/70 transition-colors"
                          >
                            {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => handleCopy(streamKey)}
                            className="p-2 rounded-lg hover:bg-white/5 text-white/40 hover:text-white/70 transition-colors"
                          >
                            {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={loadStreamKey}
                          disabled={keyLoading}
                          className="flex items-center gap-2 text-sm text-brand-400 hover:text-brand-300 transition-colors"
                        >
                          {keyLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Key className="w-4 h-4" />
                          )}
                          Click to reveal stream key
                        </button>
                      )}
                    </div>

                    <div className="pt-1">
                      <button
                        onClick={handleRegenKey}
                        disabled={regenLoading}
                        className="flex items-center gap-2 text-xs text-white/30 hover:text-white/50 transition-colors"
                      >
                        {regenLoading ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <RefreshCw className="w-3 h-3" />
                        )}
                        Regenerate stream key
                      </button>
                    </div>
                  </div>
                </div>

                {/* Edit Channel */}
                <div className="p-5 rounded-xl bg-[#111118] border border-white/5">
                  <h2 className="font-semibold text-white flex items-center gap-2 mb-4">
                    <Settings className="w-4 h-4 text-brand-400" />
                    Channel Info
                  </h2>
                  <form onSubmit={handleSaveChannel} className="space-y-3">
                    <div>
                      <label className="block text-xs text-white/40 mb-1.5">Channel Name</label>
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-brand-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-white/40 mb-1.5">Description</label>
                      <textarea
                        value={editDesc}
                        onChange={(e) => setEditDesc(e.target.value)}
                        rows={2}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-brand-500 transition-colors resize-none"
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        type="submit"
                        disabled={editLoading}
                        className="bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                      >
                        {editLoading && <Loader2 className="w-3 h-3 animate-spin" />}
                        Save
                      </button>
                      {editMsg && (
                        <span className={`text-sm ${editMsg.startsWith('✓') ? 'text-green-400' : 'text-red-400'}`}>
                          {editMsg}
                        </span>
                      )}
                    </div>
                  </form>
                </div>
              </>
            )}

            {/* Change Password */}
            <div className="p-5 rounded-xl bg-[#111118] border border-white/5">
              <h2 className="font-semibold text-white flex items-center gap-2 mb-4">
                <Key className="w-4 h-4 text-brand-400" />
                Change Password
              </h2>
              <form onSubmit={handleChangePassword} className="space-y-3 max-w-sm">
                <div>
                  <label className="block text-xs text-white/40 mb-1.5">Current Password</label>
                  <input
                    type="password"
                    value={currentPw}
                    onChange={(e) => setCurrentPw(e.target.value)}
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-brand-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs text-white/40 mb-1.5">New Password</label>
                  <input
                    type="password"
                    value={newPw}
                    onChange={(e) => setNewPw(e.target.value)}
                    required
                    minLength={6}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-brand-500 transition-colors"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="submit"
                    disabled={pwLoading}
                    className="bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                  >
                    {pwLoading && <Loader2 className="w-3 h-3 animate-spin" />}
                    Update Password
                  </button>
                  {pwMsg && (
                    <span className={`text-sm ${pwMsg.startsWith('✓') ? 'text-green-400' : 'text-red-400'}`}>
                      {pwMsg}
                    </span>
                  )}
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
