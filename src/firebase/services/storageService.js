import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from 'firebase/storage';
import { storage } from '../config';

/**
 * Upload an image to Firebase Storage and get its download URL
 * @param {File|Blob} file - The file to upload
 * @param {string} path - Storage directory or full file path
 * @returns {Promise<string>} Download URL of the uploaded image
 */
export const uploadImage = async (file, path = 'uploads') => {
  try {
    if (!storage) {
      throw new Error('Firebase Storage belum dikonfigurasi.');
    }
    // Determine target path; if path has no file extension, append unique filename
    const targetPath = (path && path.includes('.'))
      ? path
      : `${path ? path.replace(/\/$/, '') + '/' : ''}${Date.now()}_${file.name || 'image.jpg'}`;

    const storageRef = ref(storage, targetPath);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error('Error in uploadImage:', error);
    throw error;
  }
};

/**
 * Get download URL for an existing storage path or return URL directly
 * @param {string} path - Storage path or existing URL
 * @returns {Promise<string>} Download URL
 */
export const getImageUrl = async (path) => {
  try {
    if (!storage) {
      throw new Error('Firebase Storage belum dikonfigurasi.');
    }
    if (!path) return '';
    // If it's already a full HTTP/HTTPS URL, return it
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }
    const storageRef = ref(storage, path);
    return await getDownloadURL(storageRef);
  } catch (error) {
    console.error(`Error in getImageUrl (${path}):`, error);
    throw error;
  }
};

/**
 * Delete an image from Firebase Storage by path or URL
 * @param {string} path - Storage path or storage URL to delete
 * @returns {Promise<void>}
 */
export const deleteImage = async (path) => {
  try {
    if (!storage) {
      throw new Error('Firebase Storage belum dikonfigurasi.');
    }
    if (!path) return;
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
  } catch (error) {
    console.error(`Error in deleteImage (${path}):`, error);
    throw error;
  }
};
