// Data Awal Sistem Absensi Sekolah
// Tahun Ajaran 2026/2027

export const INITIAL_SCHOOL_INFO = {
  name: "SMA Negeri 1 Teladan",
  address: "Jl. Pendidikan No. 45, Jakarta",
  academicYear: "2026/2027",
  semester: "Ganjil",
};

export const INITIAL_USERS = [
  {
    id: "admin",
    nisn: "admin",
    name: "Hendra Wijaya, S.Pd.",
    role: "admin",
    password: "admin",
    title: "Guru Piket / Operator",
    email: "hendra@sman1teladan.sch.id"
  },
  {
    id: "0072819201",
    nisn: "0072819201",
    name: "Ahmad Fauzi",
    role: "student",
    password: "123",
    gender: "L",
    class: "X-MIPA 1",
    birthPlaceDate: "Jakarta, 12 Maret 2010",
    phone: "0812-3456-7890",
    avatar: "AF"
  },
  {
    id: "0072819202",
    nisn: "0072819202",
    name: "Siti Nurhaliza",
    role: "student",
    password: "123",
    gender: "P",
    class: "X-MIPA 1",
    birthPlaceDate: "Bandung, 20 Juli 2010",
    phone: "0813-9876-5432",
    avatar: "SN"
  },
  {
    id: "0072819203",
    nisn: "0072819203",
    name: "Budi Santoso",
    role: "student",
    password: "123",
    gender: "L",
    class: "X-MIPA 2",
    birthPlaceDate: "Surabaya, 5 Mei 2010",
    phone: "0815-1122-3344",
    avatar: "BS"
  },
  {
    id: "0072819204",
    nisn: "0072819204",
    name: "Dewi Lestari",
    role: "student",
    password: "123",
    gender: "P",
    class: "XI-MIPA 1",
    birthPlaceDate: "Yogyakarta, 18 September 2009",
    phone: "0821-4455-6677",
    avatar: "DL"
  },
  {
    id: "0072819205",
    nisn: "0072819205",
    name: "Rizky Ramadhan",
    role: "student",
    password: "123",
    gender: "L",
    class: "XI-IPS 1",
    birthPlaceDate: "Semarang, 24 Oktober 2009",
    phone: "0857-7788-9900",
    avatar: "RR"
  },
  {
    id: "0072819206",
    nisn: "0072819206",
    name: "Putri Aulia",
    role: "student",
    password: "123",
    gender: "P",
    class: "XI-IPS 2",
    birthPlaceDate: "Malang, 3 Februari 2009",
    phone: "0878-1234-5678",
    avatar: "PA"
  },
  {
    id: "0072819207",
    nisn: "0072819207",
    name: "Muhammad Fajar",
    role: "student",
    password: "123",
    gender: "L",
    class: "XII-MIPA 1",
    birthPlaceDate: "Medan, 11 Januari 2008",
    phone: "0896-9988-7766",
    avatar: "MF"
  },
  {
    id: "0072819208",
    nisn: "0072819208",
    name: "Anisa Rahma",
    role: "student",
    password: "123",
    gender: "P",
    class: "XII-MIPA 2",
    birthPlaceDate: "Solo, 14 Agustus 2008",
    phone: "0812-8877-6655",
    avatar: "AR"
  },
  {
    id: "0072819209",
    nisn: "0072819209",
    name: "Kevin Pratama",
    role: "student",
    password: "123",
    gender: "L",
    class: "XII-IPS 1",
    birthPlaceDate: "Palembang, 29 November 2008",
    phone: "0813-2233-4455",
    avatar: "KP"
  },
  {
    id: "0072819210",
    nisn: "0072819210",
    name: "Nadia Safitri",
    role: "student",
    password: "123",
    gender: "P",
    class: "XII-IPS 2",
    birthPlaceDate: "Padang, 8 Juni 2008",
    phone: "0852-6677-8899",
    avatar: "NS"
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

// Data Awal Presensi (Hari ini dan beberapa hari sebelumnya)
export const INITIAL_ATTENDANCE = [
  // Hari ini
  {
    id: "att-today-1",
    nisn: "0072819201",
    date: getTodayDateString(),
    time: "06:48",
    status: "hadir",
    method: "barcode",
    notes: "Tepat waktu"
  },
  {
    id: "att-today-2",
    nisn: "0072819202",
    date: getTodayDateString(),
    time: "06:55",
    status: "hadir",
    method: "barcode",
    notes: "Tepat waktu"
  },
  {
    id: "att-today-4",
    nisn: "0072819204",
    date: getTodayDateString(),
    time: "07:05",
    status: "hadir",
    method: "barcode",
    notes: "Tepat waktu"
  },
  {
    id: "att-today-5",
    nisn: "0072819205",
    date: getTodayDateString(),
    time: "07:30",
    status: "izin",
    method: "manual",
    notes: "Izin menghadiri olimpiade matematika kabupaten"
  },
  {
    id: "att-today-6",
    nisn: "0072819206",
    date: getTodayDateString(),
    time: "07:15",
    status: "sakit",
    method: "manual",
    notes: "Demam, surat dokter terlampir"
  },

  // Kemarin (H-1)
  {
    id: "att-yest-1",
    nisn: "0072819201",
    date: getDateOffset(-1),
    time: "06:45",
    status: "hadir",
    method: "barcode",
    notes: ""
  },
  {
    id: "att-yest-2",
    nisn: "0072819202",
    date: getDateOffset(-1),
    time: "06:50",
    status: "hadir",
    method: "barcode",
    notes: ""
  },
  {
    id: "att-yest-3",
    nisn: "0072819203",
    date: getDateOffset(-1),
    time: "06:58",
    status: "hadir",
    method: "barcode",
    notes: ""
  },
  {
    id: "att-yest-4",
    nisn: "0072819204",
    date: getDateOffset(-1),
    time: "06:52",
    status: "hadir",
    method: "barcode",
    notes: ""
  },
  {
    id: "att-yest-5",
    nisn: "0072819205",
    date: getDateOffset(-1),
    time: "07:02",
    status: "hadir",
    method: "barcode",
    notes: ""
  },
  {
    id: "att-yest-6",
    nisn: "0072819206",
    date: getDateOffset(-1),
    time: "06:40",
    status: "hadir",
    method: "barcode",
    notes: ""
  },
  {
    id: "att-yest-7",
    nisn: "0072819207",
    date: getDateOffset(-1),
    time: "-",
    status: "alpa",
    method: "manual",
    notes: "Tanpa keterangan"
  },
  {
    id: "att-yest-8",
    nisn: "0072819208",
    date: getDateOffset(-1),
    time: "06:51",
    status: "hadir",
    method: "barcode",
    notes: ""
  },

  // H-2
  {
    id: "att-prev2-1",
    nisn: "0072819201",
    date: getDateOffset(-2),
    time: "06:42",
    status: "hadir",
    method: "barcode",
    notes: ""
  },
  {
    id: "att-prev2-2",
    nisn: "0072819202",
    date: getDateOffset(-2),
    time: "06:49",
    status: "hadir",
    method: "barcode",
    notes: ""
  },
  {
    id: "att-prev2-3",
    nisn: "0072819203",
    date: getDateOffset(-2),
    time: "06:55",
    status: "hadir",
    method: "barcode",
    notes: ""
  },
  {
    id: "att-prev2-4",
    nisn: "0072819204",
    date: getDateOffset(-2),
    time: "06:59",
    status: "hadir",
    method: "barcode",
    notes: ""
  },
  {
    id: "att-prev2-5",
    nisn: "0072819205",
    date: getDateOffset(-2),
    time: "07:10",
    status: "hadir",
    method: "barcode",
    notes: ""
  },

  // H-3
  {
    id: "att-prev3-1",
    nisn: "0072819201",
    date: getDateOffset(-3),
    time: "06:46",
    status: "hadir",
    method: "barcode",
    notes: ""
  },
  {
    id: "att-prev3-2",
    nisn: "0072819202",
    date: getDateOffset(-3),
    time: "-",
    status: "izin",
    method: "manual",
    notes: "Keperluan keluarga"
  },
  {
    id: "att-prev3-3",
    nisn: "0072819203",
    date: getDateOffset(-3),
    time: "07:01",
    status: "hadir",
    method: "barcode",
    notes: ""
  }
];

export const AVAILABLE_CLASSES = [
  "Semua Kelas",
  "X-MIPA 1",
  "X-MIPA 2",
  "XI-MIPA 1",
  "XI-IPS 1",
  "XI-IPS 2",
  "XII-MIPA 1",
  "XII-MIPA 2",
  "XII-IPS 1",
  "XII-IPS 2"
];
