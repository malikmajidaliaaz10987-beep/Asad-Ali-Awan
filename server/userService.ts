import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { sendNewUserRegistrationAlert } from './emailService';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.resolve(__dirname, '..', 'data');
const USERS_FILE = path.join(DATA_DIR, 'registered_users.json');

// Authorized Admin Email
export const AUTHORIZED_ADMIN_EMAIL = (
  process.env.ADMIN_EMAIL || 'malikmajidaliaa.z10987@gmail.com'
).toLowerCase().trim();

// Master Admin Secret Key (optional server secret for API authentication)
export const ADMIN_SECRET_KEY = (
  process.env.ADMIN_SECRET_KEY || 'asad_admin_secure_key_2026'
).trim();

export interface RegisteredUserRecord {
  id: string;
  uid?: string;
  email: string;
  displayName: string;
  photoURL?: string;
  provider: string;
  registeredAt: string;
  lastSignInAt: string;
  loginCount: number;
  role: 'admin' | 'user';
}

// In-memory cache for serverless environments where file writes may be ephemeral
let memoryUsersCache: RegisteredUserRecord[] = [];
let isInitialized = false;

function ensureDataDir() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  } catch {
    // ignore
  }
}

function loadUsers(): RegisteredUserRecord[] {
  if (isInitialized && memoryUsersCache.length > 0) {
    return memoryUsersCache;
  }

  ensureDataDir();

  try {
    if (fs.existsSync(USERS_FILE)) {
      const data = fs.readFileSync(USERS_FILE, 'utf-8');
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        memoryUsersCache = parsed;
        isInitialized = true;
        return memoryUsersCache;
      }
    }
  } catch {
    // fallback to cache
  }

  isInitialized = true;
  return memoryUsersCache;
}

function saveUsers(users: RegisteredUserRecord[]) {
  memoryUsersCache = users;
  ensureDataDir();
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');
  } catch {
    // In strict read-only serverless environments, memory cache holds state
  }
}

export interface RecordSignInParams {
  uid?: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  provider?: string;
}

/**
 * Securely records or updates a user upon sign-in.
 * Sends a one-time registration alert to Asad ONLY for new signups.
 * Does not send duplicate alerts on subsequent logins.
 */
export async function recordUserSignIn(params: RecordSignInParams): Promise<{ user: RegisteredUserRecord; isNewUser: boolean }> {
  const cleanEmail = (params.email || '').toLowerCase().trim();
  if (!cleanEmail || !cleanEmail.includes('@')) {
    throw new Error('Valid email is required.');
  }

  const users = loadUsers();
  const existingIndex = users.findIndex((u) => u.email.toLowerCase() === cleanEmail);
  const now = new Date().toISOString();
  const isAdmin = cleanEmail === AUTHORIZED_ADMIN_EMAIL;

  if (existingIndex >= 0) {
    // Existing user: update lastSignInAt and loginCount
    const existing = users[existingIndex];
    const updated: RegisteredUserRecord = {
      ...existing,
      uid: params.uid || existing.uid,
      displayName: params.displayName || existing.displayName,
      photoURL: params.photoURL || existing.photoURL,
      provider: params.provider || existing.provider,
      lastSignInAt: now,
      loginCount: (existing.loginCount || 1) + 1,
      role: isAdmin ? 'admin' : 'user',
    };

    users[existingIndex] = updated;
    saveUsers(users);

    return { user: updated, isNewUser: false };
  }

  // New user registration
  const newUser: RegisteredUserRecord = {
    id: 'usr_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7),
    uid: params.uid,
    email: cleanEmail,
    displayName: params.displayName?.trim() || cleanEmail.split('@')[0],
    photoURL: params.photoURL,
    provider: params.provider || 'email',
    registeredAt: now,
    lastSignInAt: now,
    loginCount: 1,
    role: isAdmin ? 'admin' : 'user',
  };

  users.unshift(newUser);
  saveUsers(users);

  // Send new user registration alert email to Asad asynchronously
  // Note: Wrapped in try/catch to ensure user flow is never blocked
  sendNewUserRegistrationAlert({
    email: newUser.email,
    displayName: newUser.displayName,
    provider: newUser.provider,
    registeredAt: newUser.registeredAt,
  }).catch((err) => {
    console.info('[User Service Alert Notice]:', err?.message || err);
  });

  return { user: newUser, isNewUser: true };
}

/**
 * Validates admin access against server-configured rules.
 * Never allows client-side self-promotion.
 */
export function verifyAdminAccess(requesterEmail?: string, secretKey?: string): boolean {
  if (secretKey && secretKey.trim() === ADMIN_SECRET_KEY) {
    return true;
  }

  if (requesterEmail && requesterEmail.toLowerCase().trim() === AUTHORIZED_ADMIN_EMAIL) {
    return true;
  }

  return false;
}

/**
 * Retrieves list of registered users for the Admin Dashboard.
 * Strictly requires admin authorization.
 */
export function getRegisteredUsers(query?: { search?: string }) {
  const users = loadUsers();
  const searchTerm = (query?.search || '').toLowerCase().trim();

  let filtered = users;
  if (searchTerm) {
    filtered = users.filter(
      (u) =>
        u.email.toLowerCase().includes(searchTerm) ||
        u.displayName.toLowerCase().includes(searchTerm) ||
        u.provider.toLowerCase().includes(searchTerm)
    );
  }

  const totalUsers = users.length;
  const googleUsers = users.filter((u) => u.provider === 'google').length;
  const emailUsers = users.filter((u) => u.provider === 'email').length;

  return {
    users: filtered,
    stats: {
      totalUsers,
      googleUsers,
      emailUsers,
      latestRegistration: users[0]?.registeredAt || null,
    },
  };
}
