import React, { useState, useEffect } from 'react';
import { X, Check, Clock, FileText, UserCheck } from 'lucide-react';
import { getCurrentTimeString } from '../utils/date';

export function ManualAttendanceModal({ isOpen, onClose, student, currentRecord, onSave }) {
  const [status, setStatus] = useState('hadir');
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (currentRecord) {
      setStatus(currentRecord.status || 'hadir');
      setTime(currentRecord.time !== '-' ? currentRecord.time : getCurrentTimeString());
      setNotes(currentRecord.notes || '');
    } else {
      setStatus('hadir');
      setTime(getCurrentTimeString());
      setNotes('');
    }
  }, [currentRecord, isOpen]);

  if (!isOpen || !student) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      nisn: student.nisn,
      status,
      time: status === 'hadir' ? (time || getCurrentTimeString()) : (status === 'alpa' ? '-' : (time || getCurrentTimeString())),
      method: 'manual',
      notes: notes.trim()
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white border border-slate-200 rounded-xl max-w-md w-full overflow-hidden shadow-lg">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-slate-900 text-white flex items-center justify-center">
              <UserCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Ubah Status Kehadiran</h3>
              <p className="text-xs text-slate-500">Penyesuaian presensi manual</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          
          {/* Info Siswa */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
            <div>
              <p className="font-semibold text-sm text-slate-900">{student.name}</p>
              <p className="text-slate-500">{student.class} • NISN: {student.nisn}</p>
            </div>
            <span className="font-mono text-[10px] text-slate-400 uppercase tracking-wider bg-white px-2 py-0.5 rounded border border-slate-200">
              Manual Override
            </span>
          </div>

          {/* Pemilihan Status */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">
              Status Kehadiran
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'hadir', label: 'Hadir', activeClass: 'border-emerald-500 bg-emerald-50 text-emerald-800' },
                { id: 'izin', label: 'Izin', activeClass: 'border-amber-500 bg-amber-50 text-amber-800' },
                { id: 'sakit', label: 'Sakit', activeClass: 'border-sky-500 bg-sky-50 text-sky-800' },
                { id: 'alpa', label: 'Alpa', activeClass: 'border-rose-500 bg-rose-50 text-rose-800' }
              ].map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setStatus(opt.id)}
                  className={`py-2 px-1 text-center font-medium rounded-md border transition-all text-xs ${
                    status === opt.id
                      ? `${opt.activeClass} font-semibold ring-1 ring-offset-1 ring-slate-900/10`
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Jam Catat */}
          {status !== 'alpa' && (
            <div>
              <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" /> Waktu Masuk / Lapor
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900 text-xs font-mono"
              />
            </div>
          )}

          {/* Keterangan */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-slate-400" /> Keterangan / Catatan
            </label>
            <textarea
              rows={3}
              placeholder="Contoh: Izin surat dokter terlampir, ada lomba, dsb."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900 text-xs"
            ></textarea>
          </div>

          {/* Action Footer */}
          <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 text-slate-600 hover:bg-slate-100 rounded-md font-medium text-xs transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-md font-medium text-xs transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              <Check className="w-3.5 h-3.5" />
              Simpan Perubahan
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
