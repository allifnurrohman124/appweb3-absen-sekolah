import React, { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Download, Printer, User, Sparkles, CheckCircle2 } from 'lucide-react';
import { StatusBadge } from './StatusBadge';

export function StudentIdCard({ student, schoolInfo, todayStatus, showActions = true }) {
  const cardRef = useRef(null);

  if (!student) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadQr = () => {
    const svg = document.getElementById(`qr-code-${student.nisn}`);
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width + 40;
      canvas.height = img.height + 40;
      if (ctx) {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 20, 20);
        const pngFile = canvas.toDataURL("image/png");
        const downloadLink = document.createElement("a");
        downloadLink.download = `QR-${student.nisn}-${student.name.replace(/\s+/g, '_')}.png`;
        downloadLink.href = pngFile;
        downloadLink.click();
      }
    };
    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  return (
    <div className="flex flex-col items-center">
      {/* Kartu Fisik Digital */}
      <div 
        ref={cardRef} 
        className="w-full max-w-sm bg-white border border-slate-300 rounded-xl overflow-hidden shadow-xs print-card text-left transition-all"
      >
        {/* Header Kartu */}
        <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-slate-200">
              SM
            </div>
            <div>
              <p className="text-[10px] tracking-widest text-slate-400 font-semibold uppercase">
                KARTU TANDA SISWA
              </p>
              <h4 className="text-xs font-semibold text-white tracking-tight">
                {schoolInfo?.name || "SMA Negeri 1 Teladan"}
              </h4>
            </div>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">
            {schoolInfo?.academicYear || "2026/2027"}
          </span>
        </div>

        {/* Badan Kartu */}
        <div className="p-5">
          <div className="flex items-start gap-4">
            {/* Foto Profil / Inisial */}
            <div className="w-16 h-20 bg-slate-100 border border-slate-200 rounded flex flex-col items-center justify-center text-slate-600 shrink-0 font-medium">
              <span className="text-xl font-bold tracking-tight text-slate-800">
                {student.avatar || student.name.substring(0, 2).toUpperCase()}
              </span>
              <span className="text-[9px] uppercase tracking-wider text-slate-500 mt-1">
                {student.gender === 'L' ? 'Laki-laki' : 'Perempuan'}
              </span>
            </div>

            {/* Informasi Siswa */}
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-semibold text-slate-900 leading-snug truncate">
                {student.name}
              </h3>
              
              <div className="mt-2 space-y-1 text-xs">
                <div className="flex justify-between items-center text-slate-600">
                  <span className="text-slate-500">NISN</span>
                  <span className="font-mono font-medium text-slate-900">{student.nisn}</span>
                </div>
                <div className="flex justify-between items-center text-slate-600">
                  <span className="text-slate-500">Kelas</span>
                  <span className="font-medium text-slate-900">{student.class}</span>
                </div>
                <div className="flex justify-between items-center text-slate-600">
                  <span className="text-slate-500">TTL</span>
                  <span className="text-slate-800 truncate text-[11px] max-w-[130px]">{student.birthPlaceDate || '-'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Area Barcode / QR Code */}
          <div className="mt-4 pt-4 border-t border-dashed border-slate-200 flex flex-col items-center justify-center text-center">
            <div className="p-2.5 bg-white border border-slate-200 rounded-md">
              <QRCodeSVG
                id={`qr-code-${student.nisn}`}
                value={student.nisn}
                size={140}
                level="M"
                includeMargin={false}
              />
            </div>
            <p className="mt-2 font-mono text-[11px] tracking-widest text-slate-600 font-semibold">
              * {student.nisn} *
            </p>
            <p className="text-[10px] text-slate-500 mt-0.5">
              Pindai kode ini saat memasuki gerbang sekolah
            </p>
          </div>
        </div>

        {/* Footer Kartu */}
        <div className="bg-slate-50 px-5 py-2.5 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-600">
          <span>Status Hari Ini:</span>
          <StatusBadge status={todayStatus?.status || "belum"} />
        </div>
      </div>

      {/* Aksi Unduh / Cetak */}
      {showActions && (
        <div className="flex items-center gap-2 mt-4 no-print">
          <button
            onClick={handleDownloadQr}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <Download className="w-3.5 h-3.5" />
            Unduh QR Code
          </button>
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <Printer className="w-3.5 h-3.5" />
            Cetak Kartu
          </button>
        </div>
      )}
    </div>
  );
}
