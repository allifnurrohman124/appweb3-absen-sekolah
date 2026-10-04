import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  QrCode, 
  Edit3, 
  Download, 
  Printer, 
  X, 
  Check, 
  UserCheck, 
  Eye
} from 'lucide-react';
import { StatusBadge } from '../../components/StatusBadge';
import { StudentIdCard } from '../../components/StudentIdCard';
import { AVAILABLE_CLASSES, getTodayDateString } from '../../data/initialData';

export function AdminStudents({ 
  students, 
  attendance, 
  schoolInfo, 
  onAddStudent, 
  onEditAttendance 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('Semua Kelas');
  const [previewCardStudent, setPreviewCardStudent] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State Tambah Siswa
  const [newNisn, setNewNisn] = useState('');
  const [newName, setNewName] = useState('');
  const [newClass, setNewClass] = useState('X-MIPA 1');
  const [newGender, setNewGender] = useState('L');
  const [newTtl, setNewTtl] = useState('');
  const [formError, setFormError] = useState('');

  const todayStr = getTodayDateString();

  // Status presensi hari ini per siswa
  const todayAttendanceMap = attendance
    .filter(a => a.date === todayStr)
    .reduce((acc, curr) => {
      acc[curr.nisn] = curr;
      return acc;
    }, {});

  // Filter siswa
  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.nisn.includes(searchTerm);
    const matchesClass = selectedClass === 'Semua Kelas' || student.class === selectedClass;
    return matchesSearch && matchesClass;
  });

  const handleCreateStudent = (e) => {
    e.preventDefault();
    setFormError('');

    if (!newNisn.trim() || newNisn.length < 5) {
      setFormError('NISN harus diisi minimal 5 karakter angka.');
      return;
    }
    if (students.some(s => s.nisn === newNisn.trim())) {
      setFormError('NISN ini sudah terdaftar untuk siswa lain.');
      return;
    }
    if (!newName.trim()) {
      setFormError('Nama lengkap siswa wajib diisi.');
      return;
    }

    const newStudentObj = {
      id: newNisn.trim(),
      nisn: newNisn.trim(),
      name: newName.trim(),
      role: 'student',
      password: '123',
      gender: newGender,
      class: newClass,
      birthPlaceDate: newTtl.trim() || 'Jakarta, 1 Januari 2010',
      avatar: newName.trim().substring(0, 2).toUpperCase()
    };

    onAddStudent(newStudentObj);
    setIsAddModalOpen(false);
    setNewNisn('');
    setNewName('');
    setNewTtl('');
  };

  return (
    <div className="space-y-5 pb-20 md:pb-8">
      
      {/* Header & Aksi */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-5 rounded-xl border border-slate-200">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Manajemen Data Siswa
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Daftar lengkap siswa, cetak kartu digital & barcode, serta pembaruan status presensi.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Siswa Baru</span>
        </button>
      </div>

      {/* Filter & Pencarian */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row gap-3 items-center justify-between">
        
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder="Cari berdasarkan nama atau NISN..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900"
          />
        </div>

        {/* Filter Kelas */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="w-full sm:w-auto px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900 text-slate-700"
          >
            {AVAILABLE_CLASSES.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

      </div>

      {/* Tabel Data Siswa */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-medium">
              <tr>
                <th className="py-2.5 px-4 font-semibold">NISN</th>
                <th className="py-2.5 px-4 font-semibold">Nama Siswa</th>
                <th className="py-2.5 px-4 font-semibold">Kelas</th>
                <th className="py-2.5 px-4 font-semibold">L/P</th>
                <th className="py-2.5 px-4 font-semibold">Presensi Hari Ini</th>
                <th className="py-2.5 px-4 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    Tidak ditemukan siswa yang cocok dengan kata kunci pencarian.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => {
                  const todayRec = todayAttendanceMap[student.nisn];
                  return (
                    <tr key={student.nisn} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-mono font-medium text-slate-700 whitespace-nowrap">
                        {student.nisn}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="font-semibold text-slate-900">{student.name}</div>
                        <div className="text-[11px] text-slate-400">{student.birthPlaceDate || '-'}</div>
                      </td>
                      <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                        <span className="px-2 py-0.5 bg-slate-100 border border-slate-200 rounded text-[11px] font-medium text-slate-700">
                          {student.class}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                        {student.gender === 'L' ? 'L' : 'P'}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <StatusBadge status={todayRec?.status || 'belum'} />
                          {todayRec?.time && todayRec.time !== '-' && (
                            <span className="text-[11px] font-mono text-slate-500">
                              {todayRec.time}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap space-x-1.5">
                        {/* Tombol Preview Kartu & QR */}
                        <button
                          onClick={() => setPreviewCardStudent(student)}
                          title="Lihat / Cetak Kartu Digital & Barcode"
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded transition-colors"
                        >
                          <QrCode className="w-3.5 h-3.5 text-slate-500" />
                          <span>Kartu QR</span>
                        </button>

                        {/* Tombol Ubah Status Manual */}
                        <button
                          onClick={() => onEditAttendance(student, todayRec)}
                          title="Ubah Status Kehadiran Hari Ini"
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded transition-colors"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-slate-500" />
                          <span>Status</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="px-5 py-3 border-t border-slate-200 bg-slate-50 text-xs text-slate-500 flex justify-between items-center">
          <span>Menampilkan {filteredStudents.length} dari {students.length} siswa</span>
          <span className="font-mono text-[11px]">T.A. 2026/2027</span>
        </div>
      </div>

      {/* Modal Preview Kartu Pelajar & Cetak Barcode */}
      {previewCardStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white border border-slate-200 rounded-xl max-w-md w-full overflow-hidden shadow-lg p-5">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200 no-print">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  Kartu Siswa & Barcode Unik
                </h3>
                <p className="text-xs text-slate-500">
                  Digunakan untuk presensi masuk sekolah
                </p>
              </div>
              <button
                onClick={() => setPreviewCardStudent(null)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <StudentIdCard
              student={previewCardStudent}
              schoolInfo={schoolInfo}
              todayStatus={todayAttendanceMap[previewCardStudent.nisn]}
              showActions={true}
            />
          </div>
        </div>
      )}

      {/* Modal Tambah Siswa Baru */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white border border-slate-200 rounded-xl max-w-md w-full overflow-hidden shadow-lg">
            
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 bg-slate-50">
              <h3 className="text-sm font-semibold text-slate-900">Tambah Siswa Baru</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateStudent} className="p-5 space-y-3.5 text-xs">
              {formError && (
                <div className="p-2.5 rounded bg-rose-50 border border-rose-200 text-rose-800 text-xs">
                  {formError}
                </div>
              )}

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  NISN (10 Digit Angka)
                </label>
                <input
                  type="text"
                  placeholder="Contoh: 0072819211"
                  value={newNisn}
                  onChange={(e) => setNewNisn(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900 font-mono"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nama Lengkap Siswa
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Dimas Aditya Pratama"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Kelas
                  </label>
                  <select
                    value={newClass}
                    onChange={(e) => setNewClass(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900"
                  >
                    {AVAILABLE_CLASSES.filter(c => c !== 'Semua Kelas').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Jenis Kelamin
                  </label>
                  <select
                    value={newGender}
                    onChange={(e) => setNewGender(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900"
                  >
                    <option value="L">Laki-laki (L)</option>
                    <option value="P">Perempuan (P)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Tempat, Tanggal Lahir (Opsional)
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Jakarta, 14 Mei 2010"
                  value={newTtl}
                  onChange={(e) => setNewTtl(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3.5 py-1.5 text-slate-600 hover:bg-slate-100 rounded-md font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-slate-900 text-white rounded-md font-medium hover:bg-slate-800 flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  Simpan Siswa
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
