// Utilitas Ekspor Laporan Kehadiran ke CSV

export function exportAttendanceToCsv(records, studentsMap, filename = "laporan-kehadiran.csv") {
  if (!records || records.length === 0) {
    alert("Tidak ada data kehadiran untuk diekspor pada filter ini.");
    return;
  }

  const headers = [
    "No",
    "Tanggal",
    "NISN",
    "Nama Siswa",
    "Kelas",
    "Jenis Kelamin",
    "Waktu Masuk",
    "Status Kehadiran",
    "Metode Absensi",
    "Keterangan / Catatan"
  ];

  const statusLabel = {
    hadir: "Hadir",
    izin: "Izin",
    sakit: "Sakit",
    alpa: "Alpa"
  };

  const rows = records.map((rec, index) => {
    const student = studentsMap[rec.nisn] || {
      name: "Tidak Dikenal",
      class: "-",
      gender: "-"
    };

    return [
      index + 1,
      rec.date,
      `'${rec.nisn}`, // Tanda petik tunggal agar Excel tidak memotong 0 di depan NISN
      student.name,
      student.class,
      student.gender === 'L' ? 'Laki-laki' : student.gender === 'P' ? 'Perempuan' : '-',
      rec.time || '-',
      statusLabel[rec.status] || rec.status,
      rec.method === 'barcode' ? 'Scan Barcode' : 'Manual',
      rec.notes || '-'
    ];
  });

  const escapeCell = (val) => {
    const stringVal = String(val ?? "");
    if (stringVal.includes(",") || stringVal.includes('"') || stringVal.includes("\n")) {
      return `"${stringVal.replace(/"/g, '""')}"`;
    }
    return stringVal;
  };

  const csvContent = [
    headers.map(escapeCell).join(","),
    ...rows.map(row => row.map(escapeCell).join(","))
  ].join("\r\n");

  // UTF-8 BOM agar Excel menampilkan aksen dan teks dengan benar
  const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
