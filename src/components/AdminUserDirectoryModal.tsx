import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  RefreshCw,
  Download,
  Mail,
  Shield,
  Clock,
  LogIn,
  AlertCircle,
  X,
  ExternalLink,
  Lock,
  KeyRound,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface RegisteredUserItem {
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

interface AdminUserDirectoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminUserDirectoryModal: React.FC<AdminUserDirectoryModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { user, isAdmin, adminKey, setAdminKey } = useAuth();
  const [users, setUsers] = useState<RegisteredUserItem[]>([]);
  const [stats, setStats] = useState<{
    totalUsers: number;
    googleUsers: number;
    emailUsers: number;
    latestRegistration: string | null;
  }>({
    totalUsers: 0,
    googleUsers: 0,
    emailUsers: 0,
    latestRegistration: null,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [keyInput, setKeyInput] = useState('');
  const [keyError, setKeyError] = useState<string | null>(null);

  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (adminKey) {
        headers['x-admin-key'] = adminKey;
      }
      if (user?.email) {
        headers['x-admin-email'] = user.email;
      }

      const queryParams = new URLSearchParams();
      if (searchTerm) queryParams.set('search', searchTerm);
      if (adminKey) queryParams.set('secret', adminKey);
      if (user?.email) queryParams.set('email', user.email);

      const res = await fetch(`/api/admin/users?${queryParams.toString()}`, {
        headers,
      });

      if (!res.ok) {
        if (res.status === 403) {
          throw new Error('Access denied. Please authenticate as the site administrator (malikmajidaliaa.z10987@gmail.com) or enter the admin master key.');
        }
        throw new Error('Failed to retrieve registered users.');
      }

      const data = await res.json();
      setUsers(data.users || []);
      if (data.stats) {
        setStats(data.stats);
      }
    } catch (err: any) {
      setError(err?.message || 'Error fetching user directory.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && isAdmin) {
      fetchUsers();
    }
  }, [isOpen, isAdmin, searchTerm]);

  const handleUnlockWithKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyInput.trim()) {
      setKeyError('Please enter the Admin Master Key.');
      return;
    }
    setAdminKey(keyInput.trim());
    setKeyError(null);
  };

  const handleExportCSV = () => {
    if (users.length === 0) return;

    const headers = ['Email', 'Display Name', 'Provider', 'Role', 'Registered At', 'Last Sign-In At', 'Login Count'];
    const rows = users.map((u) => [
      `"${u.email}"`,
      `"${u.displayName || ''}"`,
      `"${u.provider}"`,
      `"${u.role}"`,
      `"${u.registeredAt}"`,
      `"${u.lastSignInAt}"`,
      u.loginCount || 1,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `asad_registered_users_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl my-8 bg-[#0D101A] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Top Header */}
        <div className="p-6 bg-gradient-to-r from-purple-950/40 via-slate-900 to-blue-950/30 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-tight">Admin User Directory</h2>
                <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-full bg-emerald-950 border border-emerald-700/60 text-emerald-300">
                  Secure Server-Enforced
                </span>
              </div>
              <p className="text-xs text-slate-400">
                View registered visitors, login counts, and contact accounts. Accessible only by Asad Ali Awan.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/80 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        {!isAdmin ? (
          /* Locked State for Non-Admin */
          <div className="p-8 sm:p-12 text-center max-w-md mx-auto space-y-6">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Lock className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h3 className="text-base font-bold text-white">Administrator Access Required</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                This dashboard is restricted to the site owner (<strong className="text-slate-200">malikmajidaliaa.z10987@gmail.com</strong>).
                Please sign in with your authorized admin account or enter the Admin Master Key.
              </p>
            </div>

            <form onSubmit={handleUnlockWithKey} className="space-y-3">
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="password"
                  value={keyInput}
                  onChange={(e) => setKeyInput(e.target.value)}
                  placeholder="Enter Admin Master Key"
                  className="w-full bg-slate-900/90 border border-slate-700 focus:border-purple-500 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none"
                />
              </div>
              {keyError && <p className="text-[11px] text-rose-400">{keyError}</p>}
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs shadow-md transition-all cursor-pointer"
              >
                Unlock Admin Dashboard
              </button>
            </form>
          </div>
        ) : (
          /* Authorized Dashboard Content */
          <div className="p-6 space-y-6 flex-1 overflow-y-auto">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-[#090C15] border border-slate-800">
                <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Total Registered</span>
                <span className="text-2xl font-extrabold text-white mt-1 block">{stats.totalUsers}</span>
              </div>
              <div className="p-4 rounded-xl bg-[#090C15] border border-slate-800">
                <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Google Accounts</span>
                <span className="text-2xl font-extrabold text-blue-400 mt-1 block">{stats.googleUsers}</span>
              </div>
              <div className="p-4 rounded-xl bg-[#090C15] border border-slate-800">
                <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Email Accounts</span>
                <span className="text-2xl font-extrabold text-purple-400 mt-1 block">{stats.emailUsers}</span>
              </div>
              <div className="p-4 rounded-xl bg-[#090C15] border border-slate-800">
                <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Latest Activity</span>
                <span className="text-xs font-semibold text-emerald-400 mt-2 block truncate">
                  {stats.latestRegistration
                    ? new Date(stats.latestRegistration).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
                    : 'None yet'}
                </span>
              </div>
            </div>

            {/* Actions Toolbar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by email, name, or provider..."
                  className="w-full bg-[#090C15] border border-slate-800 focus:border-purple-500/80 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={fetchUsers}
                  disabled={isLoading}
                  className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 text-xs flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                  <span>Refresh</span>
                </button>
                <button
                  onClick={handleExportCSV}
                  disabled={users.length === 0}
                  className="px-3.5 py-2 rounded-xl bg-purple-600/90 hover:bg-purple-600 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer disabled:opacity-50"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800/80 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Users Table */}
            <div className="rounded-xl border border-slate-800 bg-[#090C15] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#0f121d] border-b border-slate-800/80 text-slate-400 uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="py-3 px-4">User</th>
                      <th className="py-3 px-4">Provider</th>
                      <th className="py-3 px-4">Registered</th>
                      <th className="py-3 px-4">Last Active</th>
                      <th className="py-3 px-4 text-center">Logins</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    {users.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-slate-500">
                          {isLoading ? 'Loading registered visitors...' : 'No registered users found matching query.'}
                        </td>
                      </tr>
                    ) : (
                      users.map((u) => {
                        const isUserAdmin = u.role === 'admin' || u.email.toLowerCase() === 'malikmajidaliaa.z10987@gmail.com';
                        return (
                          <tr key={u.id} className="hover:bg-slate-900/50 transition-colors">
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-2.5">
                                <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-purple-600 to-blue-600 flex items-center justify-center text-[11px] font-bold text-white shrink-0">
                                  {(u.displayName || u.email || 'U')[0].toUpperCase()}
                                </div>
                                <div className="min-w-0">
                                  <div className="font-semibold text-white truncate flex items-center gap-1.5">
                                    <span>{u.displayName || 'Visitor'}</span>
                                    {isUserAdmin && (
                                      <span className="px-1.5 py-0.2 rounded bg-purple-950 border border-purple-700/70 text-[9px] text-purple-300">
                                        Admin
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-[11px] text-slate-400 truncate">{u.email}</div>
                                </div>
                              </div>
                            </td>
                            <td className="py-3.5 px-4">
                              <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium uppercase ${
                                u.provider === 'google'
                                  ? 'bg-blue-950/80 text-blue-300 border border-blue-800/60'
                                  : 'bg-slate-800 text-slate-300 border border-slate-700'
                              }`}>
                                {u.provider}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-slate-400">
                              {new Date(u.registeredAt).toLocaleDateString([], {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })}
                            </td>
                            <td className="py-3.5 px-4 text-slate-400">
                              {new Date(u.lastSignInAt).toLocaleTimeString([], {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </td>
                            <td className="py-3.5 px-4 text-center font-mono font-medium text-purple-300">
                              {u.loginCount || 1}
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <a
                                href={`mailto:${u.email}?subject=Hello%20from%20Asad%20Ali%20Awan`}
                                className="inline-flex items-center gap-1 text-[11px] text-purple-400 hover:text-purple-300 transition-colors"
                              >
                                <Mail className="w-3.5 h-3.5" />
                                <span>Email</span>
                              </a>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Security Notice */}
            <div className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-800 text-slate-400 text-[11px] flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Protected by Server RBAC. Passwords are never stored in plaintext. Duplicate email alerts are automatically prevented.</span>
              </span>
              <span className="text-slate-500 hidden sm:inline">Owner: malikmajidaliaa.z10987@gmail.com</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
