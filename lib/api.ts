const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api-stream.swifftnet.site';

export interface Channel {
  id: number;
  name: string;
  slug: string;
  description?: string;
  isLive: boolean;
  createdAt: string;
  owner?: { username: string };
  streamKey?: string;
}

export interface User {
  id: number;
  username: string;
  role: 'SUPERADMIN' | 'ADMIN';
  createdAt: string;
  channels: Channel[];
}

export interface AuthResponse {
  token: string;
  user: User;
}

// ─── Auth ────────────────────────────────────────────────────────────────────

export async function login(username: string, password: string): Promise<AuthResponse> {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Login failed');
  return data;
}

export async function getMe(token: string): Promise<User> {
  const res = await fetch(`${API_URL}/api/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Auth failed');
  return data;
}

export async function changePassword(
  token: string,
  currentPassword: string,
  newPassword: string
): Promise<void> {
  const res = await fetch(`${API_URL}/api/auth/change-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ currentPassword, newPassword }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to change password');
}

// ─── Channels ────────────────────────────────────────────────────────────────

export async function getChannels(): Promise<Channel[]> {
  const res = await fetch(`${API_URL}/api/channels`, {
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'LiveStream-Frontend',
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to fetch channels');
  return data;
}

export async function getChannel(slug: string): Promise<Channel> {
  const res = await fetch(`${API_URL}/api/channels/${slug}`, {
    cache: 'no-store',
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Channel not found');
  return data;
}

export async function getStreamKey(token: string, slug: string): Promise<string> {
  const res = await fetch(`${API_URL}/api/channels/${slug}/key`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to fetch key');
  return data.streamKey;
}

export async function regenerateStreamKey(token: string, slug: string): Promise<string> {
  const res = await fetch(`${API_URL}/api/channels/${slug}/regenerate-key`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to regenerate key');
  return data.streamKey;
}

export async function updateChannel(
  token: string,
  slug: string,
  body: { name?: string; description?: string }
): Promise<Channel> {
  const res = await fetch(`${API_URL}/api/channels/${slug}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to update channel');
  return data;
}

// ─── Superadmin ──────────────────────────────────────────────────────────────

export async function createChannel(
  token: string,
  body: { name: string; slug: string; description?: string; ownerId: number }
): Promise<Channel> {
  const res = await fetch(`${API_URL}/api/channels`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to create channel');
  return data;
}

export async function deleteChannel(token: string, slug: string): Promise<void> {
  const res = await fetch(`${API_URL}/api/channels/${slug}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to delete channel');
}

export async function getUsers(token: string): Promise<User[]> {
  const res = await fetch(`${API_URL}/api/admin/users`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to fetch users');
  return data;
}

export async function createUser(
  token: string,
  body: { username: string; password: string; role?: string }
): Promise<User> {
  const res = await fetch(`${API_URL}/api/admin/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to create user');
  return data;
}

export async function deleteUser(token: string, id: number): Promise<void> {
  const res = await fetch(`${API_URL}/api/admin/users/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to delete user');
}

export async function resetUserPassword(
  token: string,
  id: number,
  password: string
): Promise<void> {
  const res = await fetch(`${API_URL}/api/admin/users/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to reset password');
}

export async function assignChannel(
  token: string,
  slug: string,
  ownerId: number
): Promise<Channel> {
  const res = await fetch(`${API_URL}/api/admin/channels/${slug}/assign`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ ownerId }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to assign channel');
  return data;
}
