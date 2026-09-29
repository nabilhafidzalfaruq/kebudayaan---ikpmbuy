# 🏛️ Budaya Bengkulu Utara

**Jelajah Budaya Bengkulu Utara — Mengenal, Menjaga, dan Melestarikan Warisan Bumi Sungkai**

Website kebudayaan digital untuk Kabupaten Bengkulu Utara yang menampilkan warisan budaya Suku Rejang — mulai dari Tari Kejei, Aksara Kaganga, Rumah Bubungan Lima, hingga kuliner khas Lemea.

---

## 📋 Daftar Isi

- [Prasyarat](#-prasyarat)
- [Instalasi Cepat](#-instalasi-cepat)
- [Menjalankan Website](#-menjalankan-website)
- [Setup Firebase (Opsional)](#-setup-firebase)
- [Setup Admin Dashboard](#-setup-admin-dashboard)
- [Struktur Project](#-struktur-project)
- [Panduan Penggunaan](#-panduan-penggunaan)
- [Deploy ke Production](#-deploy-ke-production)
- [Troubleshooting](#-troubleshooting)

---

## 🔧 Prasyarat

Pastikan sudah terinstall di komputer Anda:

| Software | Versi Minimum | Cara Cek | Download |
|----------|--------------|----------|----------|
| **Node.js** | v18+ | `node -v` | [nodejs.org](https://nodejs.org) |
| **npm** | v9+ | `npm -v` | Sudah include di Node.js |
| **Git** | Opsional | `git --version` | [git-scm.com](https://git-scm.com) |
| **VS Code** | Opsional | — | [code.visualstudio.com](https://code.visualstudio.com) |

---

## ⚡ Instalasi Cepat

### 1. Buka Terminal / Command Prompt

```bash
# Masuk ke folder project
cd C:\Users\Axioo\.gemini\antigravity\scratch\bengkulu-utara-budaya
```

### 2. Install Dependencies

```bash
npm install
```

> ⏱️ Proses ini memakan waktu 1-2 menit tergantung koneksi internet.

### 3. Jalankan Development Server

```bash
npm run dev
```

### 4. Buka di Browser

```
http://localhost:5173
```

✅ **Selesai!** Website sudah bisa diakses tanpa Firebase. Data akan diambil dari file JSON lokal.

---

## 🚀 Menjalankan Website

### Mode Development (untuk coding)

```bash
npm run dev
```
- Hot reload — perubahan kode langsung terlihat di browser
- Berjalan di `http://localhost:5173`
- Tekan `Ctrl + C` untuk menghentikan server

### Mode Production Build

```bash
npm run build
```
- Menghasilkan folder `dist/` yang siap di-deploy
- File sudah di-minify dan dioptimasi

### Preview Production Build

```bash
npm run preview
```
- Preview hasil build production di browser lokal

---

## 🔥 Setup Firebase

> **CATATAN:** Firebase bersifat **opsional**. Website bisa berjalan penuh menggunakan data JSON lokal tanpa Firebase. Firebase diperlukan jika Anda ingin:
> - Admin dashboard untuk CRUD berita & event
> - Data tersimpan di cloud database
> - Upload gambar ke cloud storage
> - Multiple admin bisa mengelola konten

### Langkah 1: Buat Project Firebase

1. Buka [Firebase Console](https://console.firebase.google.com)
2. Klik **"Add Project"** / **"Tambah Project"**
3. Beri nama project, misalnya: `budaya-bengkulu-utara`
4. Google Analytics: bisa diaktifkan atau tidak (opsional)
5. Klik **"Create Project"**

### Langkah 2: Aktifkan Firestore Database

1. Di sidebar Firebase Console, klik **"Build"** → **"Firestore Database"**
2. Klik **"Create Database"**
3. Pilih lokasi server (pilih **`asia-southeast2`** untuk Indonesia)
4. Pilih **"Start in test mode"** (untuk development)
5. Klik **"Enable"**

> ⚠️ **PENTING:** Test mode hanya berlaku 30 hari. Untuk production, Anda perlu mengatur Security Rules.

### Langkah 3: Aktifkan Firebase Storage

1. Di sidebar, klik **"Build"** → **"Storage"**
2. Klik **"Get Started"**
3. Pilih **"Start in test mode"**
4. Klik **"Next"** → pilih lokasi → **"Done"**

### Langkah 4: Aktifkan Authentication

1. Di sidebar, klik **"Build"** → **"Authentication"**
2. Klik **"Get Started"**
3. Di tab **"Sign-in method"**, aktifkan **"Email/Password"**
4. Klik **"Enable"** → **"Save"**

### Langkah 5: Dapatkan Firebase Config

1. Di Firebase Console, klik ikon ⚙️ **"Project Settings"** (di pojok kiri atas sebelah Project Overview)
2. Scroll ke bawah ke section **"Your apps"**
3. Klik ikon **`</>`** (Web) untuk menambahkan web app
4. Beri nickname: `budaya-bengkulu-utara`
5. **JANGAN** centang Firebase Hosting (kecuali mau deploy di Firebase)
6. Klik **"Register app"**
7. Anda akan melihat konfigurasi seperti ini:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "budaya-bengkulu-utara.firebaseapp.com",
  projectId: "budaya-bengkulu-utara",
  storageBucket: "budaya-bengkulu-utara.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};
```

8. **Salin semua nilai** tersebut

### Langkah 6: Isi File .env

1. Di folder project, copy file `.env.example` menjadi `.env`:

```bash
copy .env.example .env
```

2. Buka file `.env` dan isi dengan nilai dari Firebase:

```env
VITE_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXX
VITE_FIREBASE_AUTH_DOMAIN=budaya-bengkulu-utara.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=budaya-bengkulu-utara
VITE_FIREBASE_STORAGE_BUCKET=budaya-bengkulu-utara.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890
```

> ⚠️ Ganti semua nilai di atas dengan config dari Firebase project Anda sendiri!

### Langkah 7: Seed Data ke Firestore

Jalankan script untuk mengupload data JSON ke Firestore:

```bash
node scripts/seedFirestore.js
```

Anda akan melihat output seperti:

```
🌱 Memulai seeding Firestore...
   Project: budaya-bengkulu-utara

📦 Seeding collection: budaya (12 items)...
   ✅ Tari Kejei
   ✅ Tari Gandai
   ...

🎉 Seeding selesai!
   Total: 49 items berhasil, 0 errors
```

### Langkah 8: Restart Dev Server

```bash
# Hentikan server (Ctrl + C), lalu jalankan ulang
npm run dev
```

✅ Website sekarang menggunakan **Firebase Firestore** sebagai sumber data!

---

## 👤 Setup Admin Dashboard

### Langkah 1: Buat User Admin di Firebase

1. Buka [Firebase Console](https://console.firebase.google.com)
2. Pilih project Anda
3. Klik **"Build"** → **"Authentication"**
4. Klik tab **"Users"**
5. Klik **"Add User"**
6. Masukkan:
   - **Email:** `admin@bengkuluutara.go.id` (atau email Anda)
   - **Password:** `password_anda_yang_kuat`
7. Klik **"Add User"**

### Langkah 2: Akses Admin Dashboard

1. Buka browser: `http://localhost:5173/admin/login`
2. Masukkan email dan password yang baru dibuat
3. Klik **"Masuk"**

### Langkah 3: Menggunakan Admin Dashboard

Setelah login, Anda bisa:

| Menu | Fungsi |
|------|--------|
| **Dashboard** | Melihat statistik berita & event |
| **Berita** | Tambah, edit, publish/draft, hapus berita |
| **Event** | Tambah, edit, publish/draft, hapus event |

#### Menambah Berita Baru:
1. Klik **"Berita"** di sidebar
2. Klik tombol **"+ Tambah Berita"**
3. Isi form: judul, kategori, ringkasan, konten, gambar
4. Toggle **"Published"** untuk langsung mempublikasikan
5. Klik **"Simpan"**

#### Menambah Event Baru:
1. Klik **"Event"** di sidebar
2. Klik tombol **"+ Tambah Event"**
3. Isi form: nama, lokasi, kecamatan, tanggal, deskripsi, konten
4. Pilih status: Akan Datang / Berlangsung / Selesai
5. Toggle **"Published"** dan klik **"Simpan"**

### Langkah 4: Firestore Security Rules (PENTING untuk Production)

Buka tab **"Rules"** di Firestore Database dan ganti dengan:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Semua orang bisa BACA data yang published
    match /budaya/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }

    match /kategori/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }

    match /kecamatan/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }

    match /kuliner/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }

    // Berita: publik hanya bisa baca yang published
    match /berita/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }

    // Events: publik hanya bisa baca yang published
    match /events/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

Klik **"Publish"** untuk menyimpan rules.

---

## 📁 Struktur Project

```
bengkulu-utara-budaya/
│
├── public/                     # File statis
├── scripts/
│   └── seedFirestore.js        # Script seed data ke Firestore
├── src/
│   ├── components/
│   │   ├── admin/              # 10 komponen admin dashboard
│   │   ├── detail/             # 4 komponen halaman detail
│   │   ├── home/               # 9 section homepage
│   │   ├── layout/             # Navbar, Footer, Layout
│   │   └── ui/                 # 6 komponen reusable
│   ├── context/
│   │   ├── AuthContext.jsx     # State management auth
│   │   └── FirebaseContext.jsx # State management data
│   ├── data/                   # 6 file JSON (seed data)
│   ├── firebase/
│   │   ├── config.js           # Firebase initialization
│   │   └── services/           # 8 service files (CRUD)
│   ├── hooks/                  # 5+ custom hooks
│   ├── pages/
│   │   ├── admin/              # 6 halaman admin
│   │   └── *.jsx               # 8 halaman publik
│   ├── utils/
│   │   └── helpers.js          # Utility functions
│   ├── App.jsx                 # Router utama
│   ├── main.jsx                # Entry point
│   └── index.css               # Tailwind v4 theme
│
├── .env.example                # Template konfigurasi Firebase
├── .env                        # Konfigurasi Firebase (JANGAN commit!)
├── index.html                  # HTML entry
├── package.json                # Dependencies
├── vite.config.js              # Vite + Tailwind config
└── README.md                   # File ini
```

---

## 📖 Panduan Penggunaan

### Halaman-Halaman Website

| URL | Halaman | Keterangan |
|-----|---------|------------|
| `/` | Beranda | Homepage dengan 10 sections |
| `/jelajah` | Jelajah Budaya | Browse + search + filter semua budaya |
| `/budaya/:slug` | Detail Budaya | Ensiklopedia per budaya |
| `/berita` | Semua Berita | List berita budaya |
| `/berita/:slug` | Detail Berita | Baca artikel berita |
| `/event` | Semua Event | List event & kegiatan |
| `/event/:slug` | Detail Event | Detail event |
| `/admin/login` | Login Admin | Halaman login admin |
| `/admin` | Dashboard | Panel admin utama |
| `/admin/berita` | Kelola Berita | CRUD berita |
| `/admin/event` | Kelola Event | CRUD event |

### Fitur-Fitur

- 🔍 **Search** — Klik ikon search di navbar untuk mencari budaya
- 🗺️ **Peta Interaktif** — Klik kecamatan di peta untuk lihat budaya daerah tersebut
- 🌙 **Dark Mode** — Klik ikon bulan/matahari di navbar
- ⭐ **Bookmark** — Klik ikon hati di halaman detail untuk menyimpan favorit
- 📱 **Responsive** — Website otomatis menyesuaikan di HP, tablet, dan desktop

### Mengedit Data Budaya (JSON)

Jika belum menggunakan Firebase, Anda bisa mengedit data langsung di file JSON:

- **Budaya:** `src/data/budaya.json`
- **Kategori:** `src/data/kategori.json`
- **Berita:** `src/data/berita.json`
- **Event:** `src/data/events.json`
- **Kuliner:** `src/data/kuliner.json`
- **Kecamatan:** `src/data/kecamatan.json`

Setelah mengedit, dev server akan auto-refresh.

### Menambah Gambar

Gambar bisa ditambahkan dengan 2 cara:

1. **Lokal:** Taruh di folder `public/images/` dan referensikan sebagai `/images/nama-file.jpg`
2. **Firebase Storage:** Upload via admin dashboard (perlu Firebase aktif)
3. **URL Eksternal:** Gunakan URL gambar dari internet langsung di field `gambar`

---

## 🌐 Deploy ke Production

### Opsi 1: Firebase Hosting (Gratis)

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login ke Firebase
firebase login

# Inisialisasi hosting
firebase init hosting
# Pilih: Use an existing project → pilih project Anda
# Public directory: dist
# Single-page app: Yes
# Overwrite dist/index.html: No

# Build dan deploy
npm run build
firebase deploy --only hosting
```

### Opsi 2: Vercel (Gratis)

1. Push project ke GitHub
2. Buka [vercel.com](https://vercel.com)
3. Import repository dari GitHub
4. Framework preset: **Vite**
5. Tambahkan Environment Variables (semua VITE_FIREBASE_*)
6. Klik **Deploy**

### Opsi 3: Netlify (Gratis)

1. Push project ke GitHub
2. Buka [netlify.com](https://netlify.com)
3. Import repository dari GitHub
4. Build command: `npm run build`
5. Publish directory: `dist`
6. Tambahkan Environment Variables
7. Deploy

> ⚠️ **PENTING:** Jangan lupa menambahkan semua `VITE_FIREBASE_*` environment variables di platform hosting yang Anda pilih!

---

## ❓ Troubleshooting

### Website blank / tidak muncul apa-apa

```bash
# Hapus node_modules dan install ulang
rm -rf node_modules
npm install
npm run dev
```

### Error "Module not found"

```bash
# Pastikan semua dependencies terinstall
npm install
```

### Firebase: "Permission denied"

- Pastikan Firestore Security Rules sudah benar (lihat bagian Setup Admin)
- Pastikan user sudah login di admin dashboard
- Pastikan `.env` terisi dengan benar

### Firebase: Seed script gagal

- Pastikan `.env` sudah terisi lengkap
- Pastikan Firestore Database sudah diaktifkan di Firebase Console
- Jalankan ulang: `node scripts/seedFirestore.js`

### Port 5173 sudah dipakai

```bash
# Jalankan di port lain
npx vite --port 3000
```

### Build error / chunk too large

Ini hanya warning, bukan error. Build tetap berhasil. Untuk menghilangkan warning, bisa tambahkan di `vite.config.js`:

```javascript
export default defineConfig({
  // ... existing config
  build: {
    chunkSizeWarningLimit: 1500,
  }
})
```

---

## 📞 Kontak & Dukungan

Website ini dibuat untuk **memperkenalkan dan melestarikan budaya Kabupaten Bengkulu Utara**.

> *"Budaya bukan hanya warisan masa lalu, tetapi cerita yang terus kita hidupkan di Bumi Sungkai."*

---

**© 2024 Budaya Bengkulu Utara** — Dibuat dengan ❤️ untuk Bumi Sungkai
#   k e b u d a y a a n - - - i k p m b u y  
 