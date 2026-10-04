import React, { useState } from 'react';
import { Lock, User, ArrowRight, ShieldCheck, UserCheck, AlertCircle } from 'lucide-react';

export function LoginView({ users, onLoginSuccess }) {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const cleanId = identifier.trim();
    if (!cleanId) {
      setError('Masukkan ID atau NISN Anda.');
      return;
    }
    if (!password) {
      setError('Masukkan kata sandi.');
      return;
    }

    const matchedUser = users.find(u => 
      (u.id.toLowerCase() === cleanId.toLowerCase() || u.nisn === cleanId) &&
      u.password === password
    );

    if (matchedUser) {
      onLoginSuccess(matchedUser);
    } else {
      setError('ID / NISN atau kata sandi tidak cocok. Silakan coba kembali.');
    }
  };

  const handleQuickLogin = (user) => {
    setIdentifier(user.nisn || user.id);
    setPassword(user.password);
    onLoginSuccess(user);
  };

  const adminUser = users.find(u => u.role === 'admin');
  const studentUser1 = users.find(u => u.nisn === '0072819201');
  const studentUser2 = users.find(u => u.nisn === '0072819202');

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center px-4 py-8">
      
      {/* Brand & App Title */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-11 h-11 rounded-lg bg-slate-900 text-white font-bold text-lg mb-3 shadow-xs">
          PS
        </div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900">
          Sistem Presensi Sekolah
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          SMA Negeri 1 Teladan • Tahun Ajaran 2026/2027
        </p>
      </div>

      {/* Login Card (Clean, Minimalist, 1px Border, Subtle Shadow) */}
      <div className="w-full max-w-sm bg-white border border-slate-200 rounded-xl p-6 sm:p-7 shadow-xs">
        
        <div className="mb-5 pb-3 border-b border-slate-100">
          <h2 className="text-sm font-semibold text-slate-900">
            Masuk ke Akun
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Satu pintu akses untuk Admin Sekolah dan Murid
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              ID Petugas / NISN Siswa
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </span>
              <input
                type="text"
                autoComplete="username"
                placeholder="Contoh: admin atau 0072819201"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900 placeholder:text-slate-400"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Kata Sandi
              </label>
              <span className="text-[10px] text-slate-400 font-mono">
                (Demo: lihat tombol bawah)
              </span>
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900 placeholder:text-slate-400"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-md text-xs transition-colors flex items-center justify-center gap-1.5 shadow-2xs mt-2"
          >
            <span>Masuk Sekarang</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

        </form>

        {/* Akses Cepat Demo (Human-Crafted convenience) */}
        <div className="mt-6 pt-5 border-t border-slate-100">
          <p className="text-[11px] font-semibold text-slate-600 mb-2 uppercase tracking-wider text-center">
            Pilih Akun Demo (Klik untuk Masuk Langsung):
          </p>

          <div className="space-y-1.5">
            {adminUser && (
              <button
                type="button"
                onClick={() => handleQuickLogin(adminUser)}
                className="w-full p-2 text-left rounded border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors flex items-center justify-between group"
              >
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-slate-700 group-hover:text-slate-900" />
                  <div>
                    <p className="text-xs font-medium text-slate-900">Admin / Guru Piket</p>
                    <p className="text-[10px] text-slate-500">ID: admin • Sandi: admin</p>
                  </div>
                </div>
                <span className="text-[10px] text-slate-400 font-medium">Buka &rarr;</span>
              </button>
            )}

            {studentUser1 && (
              <button
                type="button"
                onClick={() => handleQuickLogin(studentUser1)}
                className="w-full p-2 text-left rounded border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors flex items-center justify-between group"
              >
                <div className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-blue-600 group-hover:text-blue-800" />
                  <div>
                    <p className="text-xs font-medium text-slate-900">Murid: {studentUser1.name}</p>
                    <p className="text-[10px] text-slate-500">NISN: {studentUser1.nisn} • {studentUser1.class}</p>
                  </div>
                </div>
                <span className="text-[10px] text-slate-400 font-medium">Buka &rarr;</span>
              </button>
            )}

            {studentUser2 && (
              <button
                type="button"
                onClick={() => handleQuickLogin(studentUser2)}
                className="w-full p-2 text-left rounded border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors flex items-center justify-between group"
              >
                <div className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-blue-600 group-hover:text-blue-800" />
                  <div>
                    <p className="text-xs font-medium text-slate-900">Murid: {studentUser2.name}</p>
                    <p className="text-[10px] text-slate-500">NISN: {studentUser2.nisn} • {studentUser2.class}</p>
                  </div>
                </div>
                <span className="text-[10px] text-slate-400 font-medium">Buka &rarr;</span>
              </button>
            )}
          </div>
        </div>

      </div>

      {/* Footer Info */}
      <div className="mt-8 text-center text-[11px] text-slate-400">
        Dirancang dengan pendekatan mobile-first, minimalis, dan fungsional.
      </div>

    </div>
  );
}
