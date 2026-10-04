// Data Awal Sistem Absensi Sekolah
// Tahun Ajaran 2026/2027

export const INITIAL_SCHOOL_INFO = {
  name: "Smk Guna Cipta",
  address: "Jl. Parakan muncang KM-01",
  academicYear: "2026/2027",
  semester: "Ganjil",
};

export const INITIAL_USERS = [
  {
    id: "admin",
    nisn: "adminsmkgunacipta",
    name: "smkgunacipta.",
    role: "admin",
    password: "admin",
    title: "Guru Piket / Operator",
    email: "smk@smkgunacipta.sch.id"
  }
];

// Helper untuk format tanggal YYYY-MM-DD
export function getTodayDateString() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getDateOffset(daysOffset = 0) {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}


export const AVAILABLE_CLASSES = [
  "Semua Kelas",
  "X-PPLG",
  "X-TKJ",
  "X-TKR",
  "XI-PPLG",
  "XI-TKJ",
  "XI-TKR",
  "XII-PPLG",
  "XII-TKJ",
  "XII-TKR", 
];
