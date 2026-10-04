// Manajemen Penyimpanan Lokal (LocalStorage)

import { INITIAL_USERS, INITIAL_ATTENDANCE } from '../data/initialData';

const USERS_KEY = 'presensi_app_users_v1';
const ATTENDANCE_KEY = 'presensi_app_attendance_v1';
const CURRENT_USER_KEY = 'presensi_app_current_user_v1';

export function loadUsers() {
  try {
    const data = localStorage.getItem(USERS_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Gagal membaca users dari localStorage', e);
  }
  saveUsers(INITIAL_USERS);
  return INITIAL_USERS;
}

export function saveUsers(users) {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch (e) {
    console.error('Gagal menyimpan users ke localStorage', e);
  }
}

export function loadAttendance() {
  try {
    const data = localStorage.getItem(ATTENDANCE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Gagal membaca data presensi dari localStorage', e);
  }
  saveAttendance(INITIAL_ATTENDANCE);
  return INITIAL_ATTENDANCE;
}

export function saveAttendance(records) {
  try {
    localStorage.setItem(ATTENDANCE_KEY, JSON.stringify(records));
  } catch (e) {
    console.error('Gagal menyimpan presensi ke localStorage', e);
  }
}

export function loadCurrentUser() {
  try {
    const data = localStorage.getItem(CURRENT_USER_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch {
    // Default null
  }
  return null;
}

export function saveCurrentUser(user) {
  try {
    if (user) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(CURRENT_USER_KEY);
    }
  } catch (e) {
    console.error('Gagal menyimpan sesi login', e);
  }
}

export function resetAllDataToDefault() {
  localStorage.removeItem(USERS_KEY);
  localStorage.removeItem(ATTENDANCE_KEY);
  localStorage.removeItem(CURRENT_USER_KEY);
  saveUsers(INITIAL_USERS);
  saveAttendance(INITIAL_ATTENDANCE);
  return {
    users: INITIAL_USERS,
    attendance: INITIAL_ATTENDANCE
  };
}
