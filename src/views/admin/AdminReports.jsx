import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  Download, 
  Printer, 
  Calendar, 
  Filter, 
  Search, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  FileText
} from 'lucide-react';
import { StatusBadge } from '../../components/StatusBadge';
import { exportAttendanceToCsv } from '../../utils/exportCsv';
import { formatIndonesianDate, getTodayDateString } from '../../utils/date';
import { AVAILABLE_CLASSES } from '../../data/initialData';

export function AdminReports({ students, attendance, schoolInfo }) {
  const [filterDate, setFilterDate] = useState(getTodayDateString());
  const [filterClass, setFilterClass] = useState('Semua Kelas');
  const [filterStatus, setFilterStatus] = useState('Semua');

  const studentsMap = students.reduce((acc, s) => {
    acc[s.nisn] = s;
    return acc;
  }, {});

  // Ambil semua rekaman pada tanggal terpilih
  const dateRecords = attendance.filter(a => a.date === filterDate);

  // Jika siswa belum absen di tanggal tersebut, kita bisa menampilkan daftar lengkap siswa atau hanya yang tercatat
  // Untuk laporan komprehensif: gabungkan semua siswa dengan status kehadiran mereka pada tanggal ini!
  const fullReport = students.map(student => {
    const existingRec = dateRecords.find(a => a.nisn === student.nisn);
    if (existingRec) {
      return {
        ...existingRec,
        studentName: student.name,
        studentClass: student.class,
        gender: student.gender
      };
    }
    return {
      id: `unmarked-${student.nisn}-${filterDate}`,
      nisn: student.nisn,
      date: filterDate,
      time: '-',
      status: 'alpa', // Belum tercatat / Tidak hadir dianggap Alpa
      method: 'sistem',
      notes: 'Belum presensi / Tanpa keterangan',
      studentName: student.name,
      studentClass: student.class,
      gender: student.gender
    };
  });

  // Terapkan filter kelas & status
  const filteredReport = fullReport.filter(item => {
    const matchesClass = filterClass === 'Semua Kelas' || item.studentClass === filterClass;
    const matchesStatus = filterStatus === 'Semua' || item.status === filterStatus.toLowerCase();
    return matchesClass && matchesStatus;
  });

  // Hitung ringkasan
  const summaryHadir = filteredReport.filter(r => r.status === 'hadir').length;
  const summaryIzin = filteredReport.filter(r => r.status === 'izin').length;
  const summarySakit = filteredReport.filter(r => r.status === 'sakit').length;
  const summaryAlpa = filteredReport.filter(r => r.status === 'alpa').length;

  const handleExportCsv = () => {
    const filename = `Laporan_Presensi_${filterClass.replace(/\s+/g, '_')}_${filterDate}.csv`;
    exportAttendanceToCsv(filteredReport, studentsMap, filename);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-5 pb-20 md:pb-8">
      
      {/* Header Laporan */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-5 rounded-xl border border-slate-200 no-print">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Laporan Rekap Presensi
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Filter kehadiran harian berdasarkan tanggal atau kelas, dan unduh berkas CSV.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Ekspor CSV</span>
          </button>
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 rounded-lg text-xs font-medium transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak</span>
          </button>
        </div>
      </div>

      {/* Filter Kontrol */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-3 no-print">
        
        {/* Pilih Tanggal */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            Tanggal Presensi
          </label>
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900 font-mono"
          />
        </div>

        {/* Pilih Kelas */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            Filter Kelas
          </label>
          <select
            value={filterClass}
            onChange={(e) => setFilterClass(e.target.value)}
            className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900 text-slate-700"
          >
            {AVAILABLE_CLASSES.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Filter Status */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" />
            Status Kehadiran
          </label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900 text-slate-700"
          >
            <option value="Semua">Semua Status</option>
            <option value="hadir">Hadir Saja</option>
            <option value="izin">Izin Saja</option>
            <option value="sakit">Sakit Saja</option>
            <option value="alpa">Alpa Saja</option>
          </select>
        </div>

      </div>

      {/* Ringkasan Angka Laporan */}
      <div className="grid grid-cols-4 gap-2 sm:gap-3 text-xs">
        <div className="p-3 bg-white border border-slate-200 rounded-lg">
          <span className="text-[11px] text-slate-500 block">Hadir</span>
          <span className="text-lg font-bold text-emerald-700">{summaryHadir}</span>
        </div>
        <div className="p-3 bg-white border border-slate-200 rounded-lg">
          <span className="text-[11px] text-slate-500 block">Izin</span>
          <span className="text-lg font-bold text-amber-700">{summaryIzin}</span>
        </div>
        <div className="p-3 bg-white border border-slate-200 rounded-lg">
          <span className="text-[11px] text-slate-500 block">Sakit</span>
          <span className="text-lg font-bold text-sky-700">{summarySakit}</span>
        </div>
        <div className="p-3 bg-white border border-slate-200 rounded-lg">
          <span className="text-[11px] text-slate-500 block">Alpa / Belum</span>
          <span className="text-lg font-bold text-rose-700">{summaryAlpa}</span>
        </div>
      </div>

      {/* Tabel Rekapitulasi */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
        
        {/* Print Header */}
        <div className="hidden print:block p-4 border-b border-slate-300 text-center">
          <h2 className="text-base font-bold uppercase">{schoolInfo?.name || "SMA NEGERI 1 TELADAN"}</h2>
          <p className="text-xs">LAPORAN PRESENSI HARIAN SISWA</p>
          <p className="text-xs font-mono mt-1">Tanggal: {formatIndonesianDate(filterDate)} | Kelas: {filterClass}</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-medium">
              <tr>
                <th className="py-2.5 px-4 font-semibold w-12 text-center">No</th>
                <th className="py-2.5 px-4 font-semibold">NISN</th>
                <th className="py-2.5 px-4 font-semibold">Nama Siswa</th>
                <th className="py-2.5 px-4 font-semibold">Kelas</th>
                <th className="py-2.5 px-4 font-semibold">Waktu Masuk</th>
                <th className="py-2.5 px-4 font-semibold">Status</th>
                <th className="py-2.5 px-4 font-semibold">Keterangan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredReport.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    Tidak ada catatan presensi pada filter ini.
                  </td>
                </tr>
              ) : (
                filteredReport.map((row, idx) => (
                  <tr key={row.nisn} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-2.5 px-4 text-center font-mono text-slate-400">
                      {idx + 1}
                    </td>
                    <td className="py-2.5 px-4 font-mono text-slate-700 whitespace-nowrap">
                      {row.nisn}
                    </td>
                    <td className="py-2.5 px-4 font-medium text-slate-900 whitespace-nowrap">
                      {row.studentName}
                    </td>
                    <td className="py-2.5 px-4 text-slate-600 whitespace-nowrap">
                      {row.studentClass}
                    </td>
                    <td className="py-2.5 px-4 font-mono text-slate-700 whitespace-nowrap">
                      {row.time !== '-' ? `${row.time} WIB` : '-'}
                    </td>
                    <td className="py-2.5 px-4 whitespace-nowrap">
                      <StatusBadge status={row.status} />
                    </td>
                    <td className="py-2.5 px-4 text-slate-500">
                      {row.notes || '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="px-5 py-3 border-t border-slate-200 bg-slate-50 text-xs text-slate-500 flex justify-between items-center no-print">
          <span>Menampilkan {filteredReport.length} entri data</span>
          <span className="font-mono text-[11px]">Tanggal: {formatIndonesianDate(filterDate)}</span>
        </div>
      </div>

    </div>
  );
}
