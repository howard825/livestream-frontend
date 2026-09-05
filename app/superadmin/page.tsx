'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import {
  Channel, User,
  getChannels, getUsers, createChannel, deleteChannel,
  createUser, deleteUser, resetUserPassword, assignChannel,
} from '@/lib/api';
import Navbar from '@/components/Navbar';
import {
  Plus, Trash2, Radio, Users, Shield, Loader2,
  AlertCircle, RefreshCw, Check, X,
} from 'lucide-react';

type Tab = 'channels' | 'users';

function Modal({
  title, onClose, children,
}: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md bg-[#13131c] rounded-2xl border border-white/10 shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b border-white/5">
          <h3 className="font-semibold text-white">{title}</h3>
          <button onClick={onClose} className="text-white/40 hover:text-white/70 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

export default function SuperadminPage() {
  const { user, token, loading } = useAuth();
  const router = useRouter();

  const [tab, setTab] = useState<Tab>('channels');
  const [channels, setChannels] = useState<Channel[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Create channel modal
  const [showCreateChannel, setShowCreateChannel] = useState(false);
  const [newChName, setNewChName] = useState('');
  const [newChSlug, setNewChSlug] = useState('');
  const [newChDesc, setNewChDesc] = useState('');
  const [newChOwner, setNewChOwner] = useState('');
  const [createChLoading, setCreateChLoading] = useState(false);

  // Create user modal
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [createUserLoading, setCreateUserLoading] = useState(false);

  // Reset password modal
  const [resetUserId, setResetUserId] = useState<number | null>(null);
  const [resetPw, setResetPw] = useState('');
  const [resetPwLoading, setResetPwLoading] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.replace('/login');
    if (!loading && user?.role !== 'SUPERADMIN') router.replace('/dashboard');
  }, [user, loading, router]);

  useEffect(() => {
    if (token) loadData();
  }, [token]);

  async function loadData() {
    if (!token) return;
    setDataLoading(true);
    setError('');
    try {
      const [ch, us] = await Promise.all([getChannels(), getUsers(token)]);
      setChannels(ch);
      setUsers(us);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setDataLoading(false);
    }
  }

  function showSuccess(msg: string) {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3000);
  }

  // Auto-slug from name
  function handleNameChange(name: string) {
    setNewChName(name);
    setNewChSlug(name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''));
  }

  async function handleCreateChannel(e: React.FormEvent) {
    e.preventDefault();
    if (!token || !newChOwner) return;
    setCreateChLoading(true);
    try {
      await createChannel(token, {
        name: newChName,
        slug: newChSlug,
        description: newChDesc || undefined,
        ownerId: parseInt(newChOwner),
      });
      setShowCreateChannel(false);
      setNewChName(''); setNewChSlug(''); setNewChDesc(''); setNewChOwner('');
      showSuccess('Channel created!');
      await loadData();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setCreateChLoading(false);
    }
  }

  async function handleDeleteChannel(slug: string) {
    if (!token || !confirm(`Delete channel "${slug}"? This cannot be undone.`)) return;
    try {
      await deleteChannel(token, slug);
      showSuccess('Channel deleted');
      await loadData();
    } catch (err: any) {
      setError(err.message);
    }
  }

  async function handleCreateUser(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;
    setCreateUserLoading(true);
    try {
      await createUser(token, { username: newUsername, password: newPassword });
      setShowCreateUser(false);
      setNewUsername(''); setNewPassword('');
      showSuccess('Admin created!');
      await loadData();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setCreateUserLoading(false);
    }
  }

  async function handleDeleteUser(id: number, username: string) {
    if (!token || !confirm(`Delete user "${username}"?`)) return;
    try {
      await deleteUser(token, id);
      showSuccess('User deleted');
      await loadData();
    } catch (err: any) {
      setError(err.message);
    }
  }

  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault();
    if (!token || !resetUserId) return;
    setResetPwLoading(true);
    try {
      await resetUserPassword(token, resetUserId, resetPw);
      setResetUserId(null);
      setResetPw('');
      showSuccess('Password reset!');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setResetPwLoading(false);
    }
  }

  async function handleAssignChannel(slug: string, ownerId: number) {
    if (!token) return;
    try {
      await assignChannel(token, slug, ownerId);
      showSuccess('Channel reassigned!');
      await loadData();
    } catch (err: any) {
      setError(err.message);
    }
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
      </div>
    );
  }

  const adminUsers = users.filter((u) => u.role === 'ADMIN');

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-20 pb-16">
        <div className="py-8 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Shield className="w-6 h-6 text-brand-400" />
              Superadmin Panel
            </h1>
            <p className="text-white/40 text-sm mt-1">Manage channels and admin users</p>
          </div>
          <button
            onClick={loadData}
            className="p-2 rounded-lg text-white/30 hover:text-white/60 hover:bg-white/5 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${dataLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
            <button onClick={() => setError('')} className="ml-auto"><X className="w-4 h-4" /></button>
          </div>
        )}
        {successMsg && (
          <div className="mb-4 p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm flex items-center gap-2">
            <Check className="w-4 h-4" />
            {successMsg}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-white/5 p-1 rounded-lg w-fit">
          {([['channels', 'Channels', Radio], ['users', 'Admins', Users]] as const).map(([id, label, Icon]) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                tab === id ? 'bg-brand-600 text-white' : 'text-white/50 hover:text-white/80'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {/* ── CHANNELS TAB ─────────────────────────────────── */}
        {tab === 'channels' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-white/40">{channels.length} channel(s)</p>
              <button
                onClick={() => setShowCreateChannel(true)}
                className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Channel
              </button>
            </div>

            {dataLoading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="w-6 h-6 text-brand-500 animate-spin" />
              </div>
            ) : channels.length === 0 ? (
              <div className="text-center py-16 text-white/30">
                <Radio className="w-10 h-10 mx-auto mb-3 opacity-20" />
                <p>No channels yet. Create one to get started.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {channels.map((ch) => (
                  <div
                    key={ch.id}
                    className="flex items-center gap-4 p-4 rounded-xl bg-[#111118] border border-white/5"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-white truncate">{ch.name}</span>
                        {ch.isLive && (
                          <span className="flex-shrink-0 flex items-center gap-1 text-xs font-semibold text-live">
                            <span className="live-dot w-1.5 h-1.5 rounded-full bg-live inline-block" />
                            LIVE
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-white/30 mt-0.5">
                        /{ch.slug} · owner: {ch.owner?.username || '—'}
                      </p>
                    </div>

                    {/* Reassign owner */}
                    <select
                      value={ch.owner?.username ? users.find(u => u.username === ch.owner?.username)?.id ?? '' : ''}
                      onChange={(e) => handleAssignChannel(ch.slug, parseInt(e.target.value))}
                      className="text-xs bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-white/60 focus:outline-none focus:border-brand-500 transition-colors"
                    >
                      <option value="" disabled>Assign to...</option>
                      {adminUsers.map((u) => (
                        <option key={u.id} value={u.id}>{u.username}</option>
                      ))}
                    </select>

                    <button
                      onClick={() => handleDeleteChannel(ch.slug)}
                      className="p-2 text-white/25 hover:text-red-400 transition-colors rounded-lg hover:bg-red-500/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── USERS TAB ────────────────────────────────────── */}
        {tab === 'users' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-white/40">{adminUsers.length} admin(s)</p>
              <button
                onClick={() => setShowCreateUser(true)}
                className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Admin
              </button>
            </div>

            {dataLoading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="w-6 h-6 text-brand-500 animate-spin" />
              </div>
            ) : adminUsers.length === 0 ? (
              <div className="text-center py-16 text-white/30">
                <Users className="w-10 h-10 mx-auto mb-3 opacity-20" />
                <p>No admin users yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {adminUsers.map((u) => (
                  <div
                    key={u.id}
                    className="flex items-center gap-4 p-4 rounded-xl bg-[#111118] border border-white/5"
                  >
                    <div className="flex-1 min-w-0">
                      <span className="font-medium text-white">{u.username}</span>
                      <p className="text-xs text-white/30 mt-0.5">
                        {u.channels?.length
                          ? u.channels.map((c) => c.name).join(', ')
                          : 'No channels assigned'}
                      </p>
                    </div>

                    <button
                      onClick={() => { setResetUserId(u.id); setResetPw(''); }}
                      className="text-xs text-white/40 hover:text-brand-400 transition-colors px-3 py-1.5 rounded-lg hover:bg-brand-500/10"
                    >
                      Reset PW
                    </button>

                    <button
                      onClick={() => handleDeleteUser(u.id, u.username)}
                      className="p-2 text-white/25 hover:text-red-400 transition-colors rounded-lg hover:bg-red-500/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* ── CREATE CHANNEL MODAL ──────────────────────────── */}
      {showCreateChannel && (
        <Modal title="Create Channel" onClose={() => setShowCreateChannel(false)}>
          <form onSubmit={handleCreateChannel} className="space-y-4">
            <div>
              <label className="block text-xs text-white/40 mb-1.5">Channel Name</label>
              <input
                type="text"
                value={newChName}
                onChange={(e) => handleNameChange(e.target.value)}
                required
                placeholder="e.g. Channel 1"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-brand-500 transition-colors placeholder:text-white/20"
              />
            </div>
            <div>
              <label className="block text-xs text-white/40 mb-1.5">
                URL Slug <span className="text-white/25">(auto-filled)</span>
              </label>
              <input
                type="text"
                value={newChSlug}
                onChange={(e) => setNewChSlug(e.target.value)}
                required
                placeholder="channel-1"
                pattern="[a-z0-9-]+"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-brand-500 transition-colors placeholder:text-white/20 font-mono"
              />
              <p className="text-xs text-white/25 mt-1">Lowercase, numbers, hyphens only</p>
            </div>
            <div>
              <label className="block text-xs text-white/40 mb-1.5">Description (optional)</label>
              <textarea
                value={newChDesc}
                onChange={(e) => setNewChDesc(e.target.value)}
                rows={2}
                placeholder="Short description..."
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-brand-500 transition-colors resize-none placeholder:text-white/20"
              />
            </div>
            <div>
              <label className="block text-xs text-white/40 mb-1.5">Assign to Admin</label>
              <select
                value={newChOwner}
                onChange={(e) => setNewChOwner(e.target.value)}
                required
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-brand-500 transition-colors"
              >
                <option value="" disabled>Select admin...</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>{u.username} ({u.role})</option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              disabled={createChLoading}
              className="w-full bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
            >
              {createChLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              Create Channel
            </button>
          </form>
        </Modal>
      )}

      {/* ── CREATE USER MODAL ─────────────────────────────── */}
      {showCreateUser && (
        <Modal title="Add Admin User" onClose={() => setShowCreateUser(false)}>
          <form onSubmit={handleCreateUser} className="space-y-4">
            <div>
              <label className="block text-xs text-white/40 mb-1.5">Username</label>
              <input
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                required
                placeholder="admin_name"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-brand-500 transition-colors placeholder:text-white/20"
              />
            </div>
            <div>
              <label className="block text-xs text-white/40 mb-1.5">Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={6}
                placeholder="Min. 6 characters"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-brand-500 transition-colors placeholder:text-white/20"
              />
            </div>
            <button
              type="submit"
              disabled={createUserLoading}
              className="w-full bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
            >
              {createUserLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              Create Admin
            </button>
          </form>
        </Modal>
      )}

      {/* ── RESET PASSWORD MODAL ──────────────────────────── */}
      {resetUserId && (
        <Modal title="Reset Password" onClose={() => setResetUserId(null)}>
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className="block text-xs text-white/40 mb-1.5">New Password</label>
              <input
                type="password"
                value={resetPw}
                onChange={(e) => setResetPw(e.target.value)}
                required
                minLength={6}
                placeholder="Min. 6 characters"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-brand-500 transition-colors placeholder:text-white/20"
              />
            </div>
            <button
              type="submit"
              disabled={resetPwLoading}
              className="w-full bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
            >
              {resetPwLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              Reset Password
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
}
