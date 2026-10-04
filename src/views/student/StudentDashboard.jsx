import React from 'react';
import { 
  CheckCircle2, 
  Clock, 
  Calendar, 
  Award, 
  ShieldCheck, 
  AlertCircle,
  QrCode,
  ArrowRight
} from 'lucide-react';
import { StudentIdCard } from '../../components/StudentIdCard';
import { StatusBadge } from '../../components/StatusBadge';
import { formatIndonesianDate, getTodayDateString } from '../../utils/date';

export function StudentDashboard({ 
  student, 
  attendance, 
  schoolInfo, 
  onNavigateToHistory 
}) {
  const todayStr = getTodayDateString();

  // Presensi hari ini siswa ini
  const todayRecord = attendance.find(
    a => a.nisn === student.nisn && a.date === todayStr
  );

  // Rekap presensi keseluruhan untuk siswa ini
  const studentRecords = attendance.filter(a => a.nisn === student.nisn);
  const totalHadir = studentRecords.filter(a => a.status === 'hadir').length;
  const totalIzin = studentRecords.filter(a => a.status === 'izin').length;
  const totalSakit = studentRecords.filter(a => a.status === 'sakit').length;
  const totalAlpa = studentRecords.filter(a => a.status === 'alpa').length;

  const totalHariSekolah = Math.max(studentRecords.length, 1);
  const percentage = Math.round((totalHadir / totalHariSekolah) * 100);

  return (
    <div className="space-y-6 pb-20 md:pb-8 max-w-2xl mx-auto">
      
      {/* Kartu Status Presensi Hari Ini */}
      <div className={`p-4 rounded-xl border transition-all ${
        todayRecord?.status === 'hadir'
          ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
          : todayRecord?.status === 'izin' || todayRecord?.status === 'sakit'
          ? 'bg-amber-50/70 border-amber-200 text-amber-900'
          : 'bg-white border-slate-200 text-slate-800'
      }`}>
        <div className="flex items-start gap-3">
          {todayRecord?.status === 'hadir' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          ) : todayRecord ? (
            <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
          )}

          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider opacity-75">
                Status Hari Ini ({formatIndonesianDate(todayStr)})
              </span>
              <StatusBadge status={todayRecord?.status || 'belum'} />
            </div>

            {todayRecord ? (
              <p className="text-sm font-semibold mt-1">
                Tercatat {todayRecord.status === 'hadir' ? 'Masuk' : todayRecord.status} pukul {todayRecord.time} WIB
                {todayRecord.notes ? ` (${todayRecord.notes})` : ''}
              </p>
            ) : (
              <div>
                <p className="text-sm font-semibold text-slate-900 mt-1">
                  Belum Melakukan Presensi
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Tunjukkan barcode/QR code pada Kartu Digital di bawah kepada petugas piket di gerbang.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Kartu Pelajar Digital Siswa */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 text-center">
        <div className="mb-4 text-left">
          <h2 className="text-sm font-semibold text-slate-900">
            Kartu Pelajar & Barcode Presensi
          </h2>
          <p className="text-xs text-slate-500">
            Gunakan kartu digital ini untuk pemindaian presensi harian
          </p>
        </div>

        <StudentIdCard
          student={student}
          schoolInfo={schoolInfo}
          todayStatus={todayRecord}
          showActions={true}
        />
      </div>

      {/* Ringkasan Kehadiran Periode Berjalan */}
      <div className="bg-white p-5 rounded-xl border border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              Rekap Kehadiran Bulan Ini
            </h3>
            <p className="text-xs text-slate-500">
              Tahun Ajaran {schoolInfo?.academicYear || '2026/2027'}
            </p>
          </div>
          <button
            onClick={onNavigateToHistory}
            className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-slate-900"
          >
            Lihat Detail
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-4 gap-2 text-center text-xs">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
            <span className="text-slate-500 block text-[11px]">Hadir</span>
            <span className="text-base font-bold text-emerald-700">{totalHadir}</span>
          </div>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
            <span className="text-slate-500 block text-[11px]">Izin</span>
            <span className="text-base font-bold text-amber-700">{totalIzin}</span>
          </div>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
            <span className="text-slate-500 block text-[11px]">Sakit</span>
            <span className="text-base font-bold text-sky-700">{totalSakit}</span>
          </div>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
            <span className="text-slate-500 block text-[11px]">Alpa</span>
            <span className="text-base font-bold text-rose-700">{totalAlpa}</span>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
          <span>Persentase Kehadiran:</span>
          <span className="font-semibold text-slate-900 font-mono">{percentage}%</span>
        </div>
      </div>

    </div>
  );
}
