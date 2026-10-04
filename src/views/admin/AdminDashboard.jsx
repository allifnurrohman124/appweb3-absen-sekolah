import React from 'react';
import { 
  Users, 
  UserCheck, 
  Clock, 
  AlertTriangle, 
  QrCode, 
  Calendar, 
  ArrowUpRight, 
  Sparkles,
  Edit2
} from 'lucide-react';
import { StatCard } from '../../components/StatCard';
import { StatusBadge } from '../../components/StatusBadge';
import { formatIndonesianDate, getTodayDateString } from '../../utils/date';

export function AdminDashboard({ 
  students, 
  attendance, 
  onOpenScanner, 
  onNavigateToStudents, 
  onNavigateToReports,
  onEditAttendance 
}) {
  const todayStr = getTodayDateString();
  const todayRecords = attendance.filter(a => a.date === todayStr);

  const totalStudents = students.length;
  const hadirCount = todayRecords.filter(a => a.status === 'hadir').length;
  const izinCount = todayRecords.filter(a => a.status === 'izin').length;
  const sakitCount = todayRecords.filter(a => a.status === 'sakit').length;
  const alpaCount = todayRecords.filter(a => a.status === 'alpa').length;
  const belumAbsenCount = Math.max(0, totalStudents - (hadirCount + izinCount + sakitCount + alpaCount));

  const attendanceRate = totalStudents > 0 
    ? Math.round((hadirCount / totalStudents) * 100) 
    : 0;

  // Recent attendance stream (urutkan dari yang paling baru)
  const recentRecords = [...todayRecords].reverse();

  const studentsMap = students.reduce((acc, s) => {
    acc[s.nisn] = s;
    return acc;
  }, {});

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      
      {/* Header Banner Ringkas */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>{formatIndonesianDate(todayStr)}</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Ringkasan Presensi Hari Ini
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Pantau dan rekap kehadiran siswa secara langsung dari pintu gerbang.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenScanner}
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            <QrCode className="w-4 h-4 text-emerald-400" />
            <span>Buka Scanner Kamera</span>
          </button>
        </div>
      </div>

      {/* Grid Statistik Ringkas */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <StatCard
          title="Total Siswa"
          value={totalStudents}
          badgeText="Siswa aktif"
          subtext="Seluruh kelas X - XII"
          icon={Users}
        />
        <StatCard
          title="Hadir"
          value={hadirCount}
          badgeText={`${attendanceRate}%`}
          subtext="Tercatat tepat waktu"
          icon={UserCheck}
        />
        <StatCard
          title="Izin"
          value={izinCount}
          badgeText="Siswa"
          subtext="Surat permohonan dinas/lomba"
          icon={Clock}
        />
        <StatCard
          title="Sakit"
          value={sakitCount}
          badgeText="Siswa"
          subtext="Surat dokter terlampir"
          icon={AlertTriangle}
        />
        <StatCard
          title="Alpa / Belum"
          value={alpaCount + belumAbsenCount}
          badgeText={`${belumAbsenCount} blm absen`}
          subtext={`${alpaCount} Alpa tanpa kabar`}
          icon={Users}
        />
      </div>

      {/* Log Presensi Terkini Hari Ini */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">
              Aktivitas Presensi Terkini
            </h2>
            <p className="text-xs text-slate-500">
              Riwayat siswa yang sudah tercatat masuk hari ini ({recentRecords.length} catatan)
            </p>
          </div>
          <button
            onClick={onNavigateToReports}
            className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-slate-900"
          >
            Lihat Rekap Lengkap
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {recentRecords.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-xs">
            Belum ada aktivitas presensi yang tercatat untuk hari ini.
            <div className="mt-3">
              <button
                onClick={onOpenScanner}
                className="px-3 py-1.5 bg-slate-900 text-white rounded text-xs font-medium"
              >
                Mulai Pemindaian Sekarang
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-medium">
                <tr>
                  <th className="py-2.5 px-4 font-semibold">Waktu</th>
                  <th className="py-2.5 px-4 font-semibold">Nama Siswa</th>
                  <th className="py-2.5 px-4 font-semibold">Kelas</th>
                  <th className="py-2.5 px-4 font-semibold">Status</th>
                  <th className="py-2.5 px-4 font-semibold hidden sm:table-cell">Metode</th>
                  <th className="py-2.5 px-4 font-semibold hidden md:table-cell">Keterangan</th>
                  <th className="py-2.5 px-4 font-semibold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentRecords.map((record) => {
                  const student = studentsMap[record.nisn];
                  return (
                    <tr key={record.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-2.5 px-4 font-mono font-medium text-slate-700 whitespace-nowrap">
                        {record.time || '-'} WIB
                      </td>
                      <td className="py-2.5 px-4 whitespace-nowrap">
                        <div className="font-semibold text-slate-900">
                          {student?.name || 'Siswa #' + record.nisn}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono sm:hidden">
                          {record.nisn}
                        </div>
                      </td>
                      <td className="py-2.5 px-4 text-slate-600 whitespace-nowrap">
                        {student?.class || '-'}
                      </td>
                      <td className="py-2.5 px-4 whitespace-nowrap">
                        <StatusBadge status={record.status} />
                      </td>
                      <td className="py-2.5 px-4 text-slate-500 capitalize hidden sm:table-cell whitespace-nowrap">
                        {record.method === 'barcode' ? (
                          <span className="inline-flex items-center gap-1 text-[11px] text-slate-600">
                            <QrCode className="w-3 h-3 text-slate-400" />
                            Barcode
                          </span>
                        ) : (
                          <span className="text-[11px] text-slate-500">Manual</span>
                        )}
                      </td>
                      <td className="py-2.5 px-4 text-slate-500 max-w-xs truncate hidden md:table-cell">
                        {record.notes || '-'}
                      </td>
                      <td className="py-2.5 px-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => onEditAttendance(student, record)}
                          className="inline-flex items-center gap-1 px-2 py-1 text-[11px] text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded border border-slate-200 transition-colors"
                        >
                          <Edit2 className="w-3 h-3" />
                          <span>Ubah</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
