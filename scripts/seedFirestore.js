/**
 * Seed Firestore with data from JSON files
 * 
 * Usage:
 *   1. Isi file .env dengan Firebase config
 *   2. Jalankan: node scripts/seedFirestore.js
 * 
 * Script ini bersifat idempotent — bisa dijalankan ulang tanpa duplikasi
 * karena menggunakan document ID dari field 'id' di setiap item.
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, collection, getDocs } from 'firebase/firestore';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env manually (no dotenv dependency needed)
function loadEnv() {
  try {
    const envPath = join(__dirname, '..', '.env');
    const envContent = readFileSync(envPath, 'utf-8');
    const vars = {};
    envContent.split('\n').forEach(line => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valueParts] = trimmed.split('=');
        vars[key.trim()] = valueParts.join('=').trim();
      }
    });
    return vars;
  } catch {
    return {};
  }
}

const env = loadEnv();

const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID
};

// Validate config
const missingKeys = Object.entries(firebaseConfig)
  .filter(([, v]) => !v)
  .map(([k]) => k);

if (missingKeys.length > 0) {
  console.error('❌ Firebase config belum lengkap. Isi file .env terlebih dahulu.');
  console.error('   Missing:', missingKeys.join(', '));
  console.error('\n   Copy .env.example ke .env dan isi dengan Firebase config Anda.');
  process.exit(1);
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Load JSON data
function loadJSON(filename) {
  const filePath = join(__dirname, '..', 'src', 'data', filename);
  const content = readFileSync(filePath, 'utf-8');
  return JSON.parse(content);
}

// Seed a collection
async function seedCollection(collectionName, data) {
  console.log(`\n📦 Seeding collection: ${collectionName} (${data.length} items)...`);
  
  let created = 0;
  let updated = 0;
  let errors = 0;

  for (const item of data) {
    try {
      const docId = item.id || item.slug || String(Date.now());
      const docRef = doc(db, collectionName, docId);
      
      await setDoc(docRef, {
        ...item,
        createdAt: item.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }, { merge: true });
      
      created++;
      process.stdout.write(`   ✅ ${item.nama || item.judul || docId}\n`);
    } catch (err) {
      errors++;
      console.error(`   ❌ Error seeding ${item.nama || item.judul || 'unknown'}:`, err.message);
    }
  }

  console.log(`   → ${created} items seeded, ${errors} errors`);
  return { created, errors };
}

// Main seed function
async function seed() {
  console.log('🌱 Memulai seeding Firestore...');
  console.log(`   Project: ${firebaseConfig.projectId}`);
  console.log('');

  const collections = [
    { name: 'budaya', file: 'budaya.json' },
    { name: 'kategori', file: 'kategori.json' },
    { name: 'berita', file: 'berita.json' },
    { name: 'events', file: 'events.json' },
    { name: 'kuliner', file: 'kuliner.json' },
    { name: 'kecamatan', file: 'kecamatan.json' },
  ];

  let totalCreated = 0;
  let totalErrors = 0;

  for (const col of collections) {
    try {
      const data = loadJSON(col.file);
      const result = await seedCollection(col.name, data);
      totalCreated += result.created;
      totalErrors += result.errors;
    } catch (err) {
      console.error(`❌ Error loading ${col.file}:`, err.message);
      totalErrors++;
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log(`🎉 Seeding selesai!`);
  console.log(`   Total: ${totalCreated} items berhasil, ${totalErrors} errors`);
  console.log('='.repeat(50));
  
  process.exit(0);
}

seed().catch(err => {
  console.error('❌ Fatal error:', err);
  process.exit(1);
});
