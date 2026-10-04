import React from 'react';
import { 
  LayoutDashboard, 
  QrCode, 
  Users, 
  FileSpreadsheet, 
  LogOut, 
  UserCheck, 
  CreditCard, 
  History, 
  RotateCcw,
  Sparkles
} from 'lucide-react';

export function Navbar({ 
  currentUser, 
  activeTab, 
  setActiveTab, 
  onLogout, 
  onOpenScanner,
  onResetData,
  onSwitchUser
}) {
  const isAdmin = currentUser?.role === 'admin';

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          
          {/* Logo & School Badge */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded bg-slate-900 text-white flex items-center justify-center font-bold text-xs tracking-wider">
                PS
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold tracking-tight text-slate-900 leading-none">
                  Presensi
                </span>
                <span className="text-[10px] text-slate-500 font-medium leading-tight">
                  SMAN 1 Teladan
                </span>
              </div>
            </div>

            {/* Role Badge */}
            <span className={`hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border ${
              isAdmin 
                ? 'bg-slate-100 text-slate-800 border-slate-300' 
                : 'bg-blue-50 text-blue-800 border-blue-200'
            }`}>
              {isAdmin ? 'Admin Sekolah' : 'Murid'}
            </span>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {isAdmin ? (
              <>
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    activeTab === 'dashboard'
                      ? 'bg-slate-100 text-slate-900 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  Dashboard
                </button>

                <button
                  onClick={onOpenScanner}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-slate-900 rounded-md hover:bg-slate-800 transition-colors shadow-2xs"
                >
                  <QrCode className="w-3.5 h-3.5 text-emerald-400" />
                  Pindai Barcode
                </button>

                <button
                  onClick={() => setActiveTab('students')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    activeTab === 'students'
                      ? 'bg-slate-100 text-slate-900 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  Data Siswa
                </button>

                <button
                  onClick={() => setActiveTab('reports')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    activeTab === 'reports'
                      ? 'bg-slate-100 text-slate-900 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  Laporan
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    activeTab === 'dashboard'
                      ? 'bg-slate-100 text-slate-900 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  Kartu Digital
                </button>

                <button
                  onClick={() => setActiveTab('history')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    activeTab === 'history'
                      ? 'bg-slate-100 text-slate-900 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <History className="w-3.5 h-3.5" />
                  Riwayat Presensi
                </button>
              </>
            )}
          </nav>

          {/* Right Actions: User Profile, Switch Role & Logout */}
          <div className="flex items-center gap-2">
            
            {/* Quick Switch role for testing */}
            <button
              onClick={onSwitchUser}
              title="Ganti cepat role (Admin / Murid) untuk demo"
              className="hidden lg:inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded transition-colors"
            >
              <Sparkles className="w-3 h-3 text-amber-500" />
              Ganti Akun Demo
            </button>

            {/* User Pill */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-xs font-semibold">
                {currentUser?.avatar || (isAdmin ? 'AD' : 'MR')}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-semibold text-slate-900 leading-none truncate max-w-[120px]">
                  {currentUser?.name}
                </p>
                <p className="text-[10px] text-slate-500 leading-tight">
                  {isAdmin ? 'Admin / Guru' : currentUser?.class}
                </p>
              </div>
            </div>

            {/* Logout */}
            <button
              onClick={onLogout}
              title="Keluar"
              className="p-1.5 rounded-md text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Bottom Navigation Bar (Sticky Thumb Navigation) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-3 py-2 flex justify-around items-center no-print">
        {isAdmin ? (
          <>
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded text-[11px] ${
                activeTab === 'dashboard' ? 'text-slate-900 font-semibold' : 'text-slate-500'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Ringkasan</span>
            </button>

            <button
              onClick={onOpenScanner}
              className="flex flex-col items-center gap-1 py-1 px-3 rounded text-[11px] text-emerald-700 font-semibold"
            >
              <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-xs">
                <QrCode className="w-4 h-4 text-emerald-400" />
              </div>
              <span>Scan QR</span>
            </button>

            <button
              onClick={() => setActiveTab('students')}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded text-[11px] ${
                activeTab === 'students' ? 'text-slate-900 font-semibold' : 'text-slate-500'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Siswa</span>
            </button>

            <button
              onClick={() => setActiveTab('reports')}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded text-[11px] ${
                activeTab === 'reports' ? 'text-slate-900 font-semibold' : 'text-slate-500'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Laporan</span>
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex flex-col items-center gap-1 py-1 px-6 rounded text-[11px] ${
                activeTab === 'dashboard' ? 'text-slate-900 font-semibold' : 'text-slate-500'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <span>Kartu Digital</span>
            </button>

            <button
              onClick={() => setActiveTab('history')}
              className={`flex flex-col items-center gap-1 py-1 px-6 rounded text-[11px] ${
                activeTab === 'history' ? 'text-slate-900 font-semibold' : 'text-slate-500'
              }`}
            >
              <History className="w-4 h-4" />
              <span>Riwayat</span>
            </button>
          </>
        )}
      </div>
    </header>
  );
}
