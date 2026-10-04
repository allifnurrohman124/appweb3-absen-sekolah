import React, { useState } from 'react';
import { Calendar, Clock, CheckCircle2, QrCode, FileText, Filter } from 'lucide-react';
import { StatusBadge } from '../../components/StatusBadge';
import { formatIndonesianDate, formatShortDate } from '../../utils/date';

export function StudentHistory({ student, attendance }) {
  const [selectedMonth, setSelectedMonth] = useState('2026-10'); // Default Oktober 2026

  // Rekaman presensi milik siswa yang sedang login
  const studentRecords = attendance.filter(a => a.nisn === student.nisn);

  // Filter berdasarkan bulan (YYYY-MM)
  const filteredRecords = studentRecords.filter(a => {
    if (!a.date) return false;
    return a.date.startsWith(selectedMonth);
  });

  // Urutkan dari tanggal terbaru
  const sortedRecords = [...filteredRecords].sort((a, b) => {
    return new Date(b.date) - new Date(a.date);
  });

  const totalHadir = filteredRecords.filter(r => r.status === 'hadir').length;
  const totalIzin = filteredRecords.filter(r => r.status === 'izin').length;
  const totalSakit = filteredRecords.filter(r => r.status === 'sakit').length;
  const totalAlpa = filteredRecords.filter(r => r.status === 'alpa').length;

  return (
    <div className="space-y-5 pb-20 md:pb-8 max-w-2xl mx-auto">
      
      {/* Header Riwayat */}
      <div className="bg-white p-5 rounded-xl border border-slate-200">
        <h1 className="text-xl font-bold tracking-tight text-slate-900">
          Riwayat Presensi Pribadi
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Catatan kehadiran bulanan untuk siswa {student.name} ({student.class})
        </p>

        {/* Filter Bulan */}
        <div className="mt-4 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-semibold text-slate-700">Pilih Periode:</span>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900 text-slate-800"
          >
            <option value="2026-10">Oktober 2026</option>
            <option value="2026-09">September 2026</option>
            <option value="2026-08">Agustus 2026</option>
            <option value="2026-07">Juli 2026</option>
          </select>
        </div>
      </div>

      {/* Ringkasan Angka Rekap Bulanan */}
      <div className="grid grid-cols-4 gap-2 text-center text-xs">
        <div className="p-3 bg-white border border-slate-200 rounded-lg">
          <span className="text-slate-500 block text-[11px]">Hadir</span>
          <span className="text-base font-bold text-emerald-700">{totalHadir}</span>
        </div>
        <div className="p-3 bg-white border border-slate-200 rounded-lg">
          <span className="text-slate-500 block text-[11px]">Izin</span>
          <span className="text-base font-bold text-amber-700">{totalIzin}</span>
        </div>
        <div className="p-3 bg-white border border-slate-200 rounded-lg">
          <span className="text-slate-500 block text-[11px]">Sakit</span>
          <span className="text-base font-bold text-sky-700">{totalSakit}</span>
        </div>
        <div className="p-3 bg-white border border-slate-200 rounded-lg">
          <span className="text-slate-500 block text-[11px]">Alpa</span>
          <span className="text-base font-bold text-rose-700">{totalAlpa}</span>
        </div>
      </div>

      {/* Daftar Kronologis Kehadiran */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
        <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-900">
            Daftar Presensi ({sortedRecords.length} hari)
          </span>
          <span className="text-[11px] text-slate-500 font-mono">
            {selectedMonth}
          </span>
        </div>

        {sortedRecords.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-xs">
            Belum ada catatan presensi pada bulan yang dipilih.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {sortedRecords.map((item) => (
              <div key={item.id} className="p-4 hover:bg-slate-50/70 transition-colors">
                <div className="flex items-start justify-between gap-3">
                  
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-900">
                        {formatIndonesianDate(item.date)}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-500">
                      <span className="flex items-center gap-1 font-mono">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {item.time && item.time !== '-' ? `${item.time} WIB` : 'Tidak ada jam'}
                      </span>
                      <span className="capitalize">
                        {item.method === 'barcode' ? 'Scan Barcode' : 'Pencatatan Manual'}
                      </span>
                    </div>

                    {item.notes && (
                      <p className="mt-1 text-xs text-slate-600 bg-slate-50 p-2 rounded border border-slate-100">
                        {item.notes}
                      </p>
                    )}
                  </div>

                  <StatusBadge status={item.status} className="shrink-0" />

                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
