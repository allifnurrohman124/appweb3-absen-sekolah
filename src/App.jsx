import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { ScannerModal } from './components/ScannerModal';
import { ManualAttendanceModal } from './components/ManualAttendanceModal';
import { LoginView } from './views/LoginView';
import { AdminDashboard } from './views/admin/AdminDashboard';
import { AdminStudents } from './views/admin/AdminStudents';
import { AdminReports } from './views/admin/AdminReports';
import { StudentDashboard } from './views/student/StudentDashboard';
import { StudentHistory } from './views/student/StudentHistory';
import { 
  loadUsers, 
  saveUsers, 
  loadAttendance, 
  saveAttendance, 
  loadCurrentUser, 
  saveCurrentUser,
  resetAllDataToDefault
} from './utils/storage';
import { INITIAL_SCHOOL_INFO, getTodayDateString } from './data/initialData';
import { RotateCcw, Check, Sparkles, X } from 'lucide-react';

export function App() {
  const [users, setUsers] = useState(() => loadUsers());
  const [attendance, setAttendance] = useState(() => loadAttendance());
  const [currentUser, setCurrentUser] = useState(() => loadCurrentUser());
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [showSwitchModal, setShowSwitchModal] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Modal Ubah Status Manual
  const [manualModal, setManualModal] = useState({
    isOpen: false,
    student: null,
    currentRecord: null,
  });

  // Tampilkan toast ringkas
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  const handleLogin = (user) => {
    setCurrentUser(user);
    saveCurrentUser(user);
    setActiveTab('dashboard');
    showToast(`Selamat datang, ${user.name}`);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    saveCurrentUser(null);
    setActiveTab('dashboard');
  };

  // Mencatat Presensi dari Scanner Barcode
  const handleRecordAttendance = (newRecord) => {
    const today = newRecord.date || getTodayDateString();
    
    setAttendance((prev) => {
      const existingIdx = prev.findIndex(
        (a) => a.nisn === newRecord.nisn && a.date === today
      );

      let updated;
      if (existingIdx >= 0) {
        // Update record yang ada
        updated = [...prev];
        updated[existingIdx] = {
          ...updated[existingIdx],
          ...newRecord,
        };
      } else {
        // Buat record baru
        const rec = {
          id: `att-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          ...newRecord,
        };
        updated = [rec, ...prev];
      }

      saveAttendance(updated);
      return updated;
    });

    const student = users.find((u) => u.nisn === newRecord.nisn);
    if (student) {
      showToast(`Presensi berhasil: ${student.name} (${newRecord.time} WIB)`);
    }
  };

  // Simpan Presensi Manual (Override)
  const handleSaveManual = (data) => {
    const today = getTodayDateString();

    setAttendance((prev) => {
      const existingIdx = prev.findIndex(
        (a) => a.nisn === data.nisn && a.date === today
      );

      let updated;
      if (existingIdx >= 0) {
        updated = [...prev];
        updated[existingIdx] = {
          ...updated[existingIdx],
          status: data.status,
          time: data.time,
          method: 'manual',
          notes: data.notes,
        };
      } else {
        const newRec = {
          id: `att-manual-${Date.now()}`,
          nisn: data.nisn,
          date: today,
          status: data.status,
          time: data.time,
          method: 'manual',
          notes: data.notes,
        };
        updated = [newRec, ...prev];
      }

      saveAttendance(updated);
      return updated;
    });

    showToast('Status kehadiran berhasil diperbarui');
  };

  // Tambah Siswa Baru
  const handleAddStudent = (newStudent) => {
    const updatedUsers = [...users, newStudent];
    setUsers(updatedUsers);
    saveUsers(updatedUsers);
    showToast(`Siswa ${newStudent.name} berhasil ditambahkan`);
  };

  // Reset Data Demo
  const handleResetData = () => {
    if (window.confirm('Kembalikan semua data ke pengaturan awal demo?')) {
      const { users: resetUsers, attendance: resetAtt } = resetAllDataToDefault();
      setUsers(resetUsers);
      setAttendance(resetAtt);
      showToast('Data demo berhasil diatur ulang ke kondisi awal');
    }
  };

  // Siswa list saja (role: student)
  const students = users.filter((u) => u.role === 'student');

  // Jika belum login, tampilkan LoginView satu pintu
  if (!currentUser) {
    return <LoginView users={users} onLoginSuccess={handleLogin} />;
  }

  const isAdmin = currentUser.role === 'admin';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-slate-200">
      
      {/* Toast Notifikasi Ringkas */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-slate-900 text-white text-xs px-4 py-2.5 rounded-lg shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-150">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navbar & Mobile Navigation */}
      <Navbar
        currentUser={currentUser}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
        onOpenScanner={() => setIsScannerOpen(true)}
        onResetData={handleResetData}
        onSwitchUser={() => setShowSwitchModal(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-5">
        {isAdmin ? (
          // ================= TAMPILAN ADMIN =================
          <>
            {activeTab === 'dashboard' && (
              <AdminDashboard
                students={students}
                attendance={attendance}
                onOpenScanner={() => setIsScannerOpen(true)}
                onNavigateToStudents={() => setActiveTab('students')}
                onNavigateToReports={() => setActiveTab('reports')}
                onEditAttendance={(student, record) => {
                  setManualModal({
                    isOpen: true,
                    student,
                    currentRecord: record,
                  });
                }}
              />
            )}

            {activeTab === 'students' && (
              <AdminStudents
                students={students}
                attendance={attendance}
                schoolInfo={INITIAL_SCHOOL_INFO}
                onAddStudent={handleAddStudent}
                onEditAttendance={(student, record) => {
                  setManualModal({
                    isOpen: true,
                    student,
                    currentRecord: record,
                  });
                }}
              />
            )}

            {activeTab === 'reports' && (
              <AdminReports
                students={students}
                attendance={attendance}
                schoolInfo={INITIAL_SCHOOL_INFO}
              />
            )}
          </>
        ) : (
          // ================= TAMPILAN MURID =================
          <>
            {activeTab === 'dashboard' && (
              <StudentDashboard
                student={currentUser}
                attendance={attendance}
                schoolInfo={INITIAL_SCHOOL_INFO}
                onNavigateToHistory={() => setActiveTab('history')}
              />
            )}

            {activeTab === 'history' && (
              <StudentHistory
                student={currentUser}
                attendance={attendance}
              />
            )}
          </>
        )}
      </main>

      {/* Footer Bersih & Opsi Reset Demo Data */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-4 px-4 sm:px-6 text-xs text-slate-500 no-print">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <div>
            <span className="font-semibold text-slate-800">Sistem Presensi Sekolah</span> • {INITIAL_SCHOOL_INFO.name} (T.A. {INITIAL_SCHOOL_INFO.academicYear})
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowSwitchModal(true)}
              className="text-slate-600 hover:text-slate-900 underline underline-offset-2"
            >
              Ganti Akun Demo
            </button>
            <span>•</span>
            <button
              onClick={handleResetData}
              className="inline-flex items-center gap-1 text-slate-500 hover:text-rose-600 transition-colors"
              title="Kembalikan data ke awal"
            >
              <RotateCcw className="w-3 h-3" />
              Reset Data Demo
            </button>
          </div>
        </div>
      </footer>

      {/* Modal Scanner Barcode */}
      <ScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        students={students}
        attendance={attendance}
        onRecordAttendance={handleRecordAttendance}
      />

      {/* Modal Ubah Status Manual */}
      <ManualAttendanceModal
        isOpen={manualModal.isOpen}
        onClose={() => setManualModal({ isOpen: false, student: null, currentRecord: null })}
        student={manualModal.student}
        currentRecord={manualModal.currentRecord}
        onSave={handleSaveManual}
      />

      {/* Modal Ganti Akun Cepat (Quick Switcher) */}
      {showSwitchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white border border-slate-200 rounded-xl max-w-sm w-full p-5 shadow-lg">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <h3 className="text-sm font-semibold text-slate-900">Pilih Akun Demo</h3>
              </div>
              <button
                onClick={() => setShowSwitchModal(false)}
                className="p-1 rounded text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-500 mb-3">
              Beralih peran secara instan untuk menguji fitur Admin atau Murid:
            </p>

            <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
              {users.map((u) => (
                <button
                  key={u.id}
                  onClick={() => {
                    handleLogin(u);
                    setShowSwitchModal(false);
                  }}
                  className={`w-full p-2.5 rounded-lg border text-left flex items-center justify-between transition-colors text-xs ${
                    currentUser?.id === u.id
                      ? 'bg-slate-900 text-white border-slate-900 font-medium'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div>
                    <div className="font-semibold">{u.name}</div>
                    <div className={`text-[11px] ${currentUser?.id === u.id ? 'text-slate-300' : 'text-slate-400'}`}>
                      {u.role === 'admin' ? 'Admin / Guru Piket' : `${u.class} • NISN: ${u.nisn}`}
                    </div>
                  </div>
                  {currentUser?.id === u.id && (
                    <Check className="w-4 h-4 text-emerald-400" />
                  )}
                </button>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setShowSwitchModal(false)}
                className="px-3 py-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded text-xs font-medium"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;
