import React from 'react';

export function StatusBadge({ status, className = "" }) {
  const norm = (status || '').toLowerCase();

  if (norm === 'hadir') {
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200/80 ${className}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
        Hadir
      </span>
    );
  }

  if (norm === 'izin') {
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200/80 ${className}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
        Izin
      </span>
    );
  }

  if (norm === 'sakit') {
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-medium bg-sky-50 text-sky-800 border border-sky-200/80 ${className}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-sky-500"></span>
        Sakit
      </span>
    );
  }

  if (norm === 'alpa') {
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-medium bg-rose-50 text-rose-800 border border-rose-200/80 ${className}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
        Alpa
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200 ${className}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
      Belum Hadir
    </span>
  );
}
