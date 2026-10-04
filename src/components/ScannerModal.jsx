import React, { useEffect, useState, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Camera, X, CheckCircle2, AlertCircle, RefreshCw, Zap, Volume2, Search, ArrowRight } from 'lucide-react';
import { sound } from '../utils/sound';
import { getCurrentTimeString } from '../utils/date';

export function ScannerModal({ isOpen, onClose, students, attendance, onRecordAttendance }) {
  const [cameraError, setCameraError] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [lastScannedResult, setLastScannedResult] = useState(null);
  const [manualNisn, setManualNisn] = useState('');
  const [facingMode, setFacingMode] = useState('environment'); // 'environment' (belakang) atau 'user' (depan)

  const html5QrCodeRef = useRef(null);
  const scannerContainerId = "html5-qr-reader-container";
  const isProcessingRef = useRef(false);

  // Mulai atau Berhenti Kamera
  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      setLastScannedResult(null);
      setCameraError(null);
      return;
    }

    let isMounted = true;

    const startCamera = async () => {
      try {
        setCameraError(null);
        setIsScanning(false);

        // Hentikan scanner lama jika ada
        if (html5QrCodeRef.current) {
          try {
            await html5QrCodeRef.current.stop();
          } catch {
            // Abaikan jika belum jalan
          }
        }

        const qrScanner = new Html5Qrcode(scannerContainerId);
        html5QrCodeRef.current = qrScanner;

        const config = {
          fps: 10,
          qrbox: { width: 220, height: 220 },
          aspectRatio: 1.0,
        };

        await qrScanner.start(
          { facingMode: facingMode },
          config,
          (decodedText) => {
            if (isMounted) {
              handleCodeScanned(decodedText);
            }
          },
          (errorMessage) => {
            // Frame tidak terdeteksi QR, abaikan
          }
        );

        if (isMounted) {
          setIsScanning(true);
        }
      } catch (err) {
        console.warn("Kamera gagal diakses:", err);
        if (isMounted) {
          setCameraError(
            err?.message || "Tidak dapat mengakses kamera. Pastikan izin kamera aktif atau gunakan simulasi scanner di bawah."
          );
          setIsScanning(false);
        }
      }
    };

    const timer = setTimeout(() => {
      startCamera();
    }, 250);

    return () => {
      isMounted = false;
      clearTimeout(timer);
      stopCamera();
    };
  }, [isOpen, facingMode]);

  const stopCamera = async () => {
    if (html5QrCodeRef.current) {
      try {
        if (html5QrCodeRef.current.isScanning) {
          await html5QrCodeRef.current.stop();
        }
        await html5QrCodeRef.current.clear();
      } catch (err) {
        console.warn("Error stopping scanner", err);
      }
      html5QrCodeRef.current = null;
    }
    setIsScanning(false);
  };

  const handleCodeScanned = (code) => {
    if (isProcessingRef.current) return;
    isProcessingRef.current = true;

    // Bersihkan format (hanya digit atau string bersih)
    const cleanNisn = code.trim();
    const student = students.find(s => s.nisn === cleanNisn || s.id === cleanNisn);

    if (!student) {
      sound.playWarning();
      setLastScannedResult({
        type: 'error',
        message: `Barcode / NISN "${cleanNisn}" tidak terdaftar di sistem.`,
        time: getCurrentTimeString()
      });
      setTimeout(() => {
        isProcessingRef.current = false;
      }, 1500);
      return;
    }

    // Cek apakah sudah absen hari ini
    const today = new Date().toISOString().split('T')[0];
    const existing = attendance.find(a => a.nisn === student.nisn && a.date === today);

    if (existing && existing.status === 'hadir') {
      sound.playWarning();
      setLastScannedResult({
        type: 'warning',
        student: student,
        message: `Sudah tercatat Hadir hari ini pukul ${existing.time} WIB`,
        time: existing.time
      });
      setTimeout(() => {
        isProcessingRef.current = false;
      }, 2000);
      return;
    }

    // Catat Hadir
    const nowTime = getCurrentTimeString();
    onRecordAttendance({
      nisn: student.nisn,
      date: today,
      time: nowTime,
      status: 'hadir',
      method: 'barcode',
      notes: 'Presensi via Scan Barcode Kamera'
    });

    sound.playSuccess();
    setLastScannedResult({
      type: 'success',
      student: student,
      message: 'Presensi berhasil dicatat!',
      time: nowTime
    });

    // Pause sebentar sebelum menerima scan berikutnya agar user melihat feedback
    setTimeout(() => {
      isProcessingRef.current = false;
    }, 2000);
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!manualNisn.trim()) return;
    handleCodeScanned(manualNisn.trim());
    setManualNisn('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white border border-slate-200 rounded-xl max-w-lg w-full overflow-hidden shadow-lg flex flex-col max-h-[92vh]">
        
        {/* Header Modal */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-slate-900 text-white flex items-center justify-center">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Pemindai Barcode Presensi</h3>
              <p className="text-xs text-slate-500">Arahkan kamera ke QR/Barcode Kartu Pelajar</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Isi Modal */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
          
          {/* Feedback Visual Scan Terakhir */}
          {lastScannedResult && (
            <div 
              className={`p-3.5 rounded-lg border text-xs transition-all ${
                lastScannedResult.type === 'success'
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                  : lastScannedResult.type === 'warning'
                  ? 'bg-amber-50 border-amber-300 text-amber-900'
                  : 'bg-rose-50 border-rose-300 text-rose-900'
              }`}
            >
              <div className="flex items-start gap-2.5">
                {lastScannedResult.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  {lastScannedResult.student ? (
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-sm">
                          {lastScannedResult.student.name}
                        </span>
                        <span className="font-mono text-[11px] opacity-80">
                          {lastScannedResult.time} WIB
                        </span>
                      </div>
                      <p className="text-[11px] opacity-90 mt-0.5">
                        {lastScannedResult.student.class} • NISN: {lastScannedResult.student.nisn}
                      </p>
                      <p className="mt-1 font-medium">
                        {lastScannedResult.message}
                      </p>
                    </div>
                  ) : (
                    <p className="font-medium">{lastScannedResult.message}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Viewfinder Kamera */}
          <div className="relative bg-slate-900 rounded-lg overflow-hidden min-h-[260px] flex items-center justify-center">
            <div id={scannerContainerId} className="w-full h-full"></div>

            {/* Jika ada error kamera */}
            {cameraError && (
              <div className="absolute inset-0 bg-slate-900/90 text-white p-6 flex flex-col items-center justify-center text-center">
                <Camera className="w-8 h-8 text-slate-400 mb-2" />
                <p className="text-xs text-slate-300 max-w-xs mb-3 font-normal">
                  {cameraError}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setFacingMode(prev => prev === 'environment' ? 'user' : 'environment')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 border border-slate-700 rounded text-xs text-slate-200 hover:bg-slate-700"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Ganti Kamera
                  </button>
                </div>
              </div>
            )}

            {/* Overly frame bidik */}
            {isScanning && !cameraError && (
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="w-48 h-48 border-2 border-dashed border-emerald-400/80 rounded-lg relative flex items-center justify-center">
                  <span className="text-[10px] text-emerald-300 font-mono tracking-wider bg-slate-900/80 px-2 py-0.5 rounded">
                    BIDIK QR / BARCODE
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Kontrol Kamera */}
          <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
            <span className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${isScanning ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'}`}></span>
              {isScanning ? 'Kamera Aktif' : 'Menyiapkan Kamera...'}
            </span>
            <button
              onClick={() => setFacingMode(prev => prev === 'environment' ? 'user' : 'environment')}
              className="inline-flex items-center gap-1 text-slate-600 hover:text-slate-900 font-medium"
            >
              <RefreshCw className="w-3 h-3" />
              Ganti Kamera ({facingMode === 'environment' ? 'Belakang' : 'Depan'})
            </button>
          </div>

          {/* Alternatif: Input Manual & Pengujian Cepat */}
          <div className="pt-3 border-t border-slate-200 space-y-3">
            <div>
              <p className="text-xs font-semibold text-slate-800 mb-1.5 flex items-center gap-1.5">
                <Search className="w-3.5 h-3.5 text-slate-400" />
                Input Manual NISN (Alternatif Barcode)
              </p>
              <form onSubmit={handleManualSubmit} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ketik 10 digit NISN..."
                  value={manualNisn}
                  onChange={(e) => setManualNisn(e.target.value)}
                  className="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
                <button
                  type="submit"
                  disabled={!manualNisn.trim()}
                  className="px-3 py-1.5 bg-slate-900 text-white rounded-md text-xs font-medium hover:bg-slate-800 disabled:opacity-50 transition-colors"
                >
                  Absen
                </button>
              </form>
            </div>

            {/* Simulasi Cepat Uji Coba */}
            <div>
              <p className="text-[11px] font-medium text-slate-500 mb-1.5 flex items-center gap-1">
                <Zap className="w-3 h-3 text-amber-500" />
                Uji Coba Cepat (Klik salah satu siswa untuk simulasi scan):
              </p>
              <div className="flex flex-wrap gap-1.5">
                {students.slice(0, 5).map(s => (
                  <button
                    key={s.nisn}
                    type="button"
                    onClick={() => handleCodeScanned(s.nisn)}
                    className="px-2 py-1 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded text-[11px] text-slate-700 transition-colors"
                  >
                    {s.name.split(' ')[0]} ({s.class})
                  </button>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <Volume2 className="w-3.5 h-3.5 text-slate-400" />
            Nada bip otomatis berbunyi saat berhasil
          </span>
          <button
            onClick={onClose}
            className="px-3 py-1 text-slate-700 bg-white border border-slate-300 rounded font-medium hover:bg-slate-50"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
}
