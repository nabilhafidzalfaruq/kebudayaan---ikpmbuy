/**
 * Local Data Storage Manager
 * Allows admin changes (Add, Edit, Delete) to persist in localStorage
 * when Firebase is in offline/local mode, overlaid on top of static JSON data.
 */

// Import static JSON seeds
import defaultBudaya from '../data/budaya.json';
import defaultKomoditas from '../data/komoditas.json';
import defaultKecamatan from '../data/kecamatan.json';
import defaultKuliner from '../data/kuliner.json';
import defaultBerita from '../data/berita.json';
import defaultEvents from '../data/events.json';

const SEEDS = {
  budaya: defaultBudaya,
  komoditas: defaultKomoditas,
  kecamatan: defaultKecamatan,
  kuliner: defaultKuliner,
  berita: defaultBerita,
  events: defaultEvents
};

const getKey = (entity) => `bu_data_${entity}`;

/**
 * Get items for an entity with local edits merged
 * @param {'budaya'|'komoditas'|'kecamatan'|'kuliner'|'berita'|'events'} entity 
 * @returns {Array<Object>}
 */
export const getLocalItems = (entity) => {
  try {
    const raw = localStorage.getItem(getKey(entity));
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn(`Error reading local data for ${entity}:`, err);
  }
  return SEEDS[entity] || [];
};

/**
 * Save items list for an entity
 * @param {string} entity 
 * @param {Array<Object>} items 
 */
export const saveLocalItems = (entity, items) => {
  try {
    localStorage.setItem(getKey(entity), JSON.stringify(items));
    window.dispatchEvent(new CustomEvent(`bu-data-${entity}-changed`, { detail: items }));
  } catch (err) {
    console.error(`Error saving local data for ${entity}:`, err);
  }
};

/**
 * Add or update single item locally
 * @param {string} entity 
 * @param {Object} item 
 * @param {string} [id] 
 */
export const upsertLocalItem = (entity, item, id) => {
  const current = [...getLocalItems(entity)];
  const targetId = id || item.id || `local_${Date.now()}`;
  const now = new Date().toISOString();

  const itemToSave = {
    ...item,
    id: targetId,
    updatedAt: now,
    createdAt: item.createdAt || now
  };

  const existingIdx = current.findIndex((i) => String(i.id) === String(targetId));
  if (existingIdx >= 0) {
    current[existingIdx] = { ...current[existingIdx], ...itemToSave };
  } else {
    current.unshift(itemToSave);
  }

  saveLocalItems(entity, current);
  return itemToSave;
};

/**
 * Remove an item locally
 * @param {string} entity 
 * @param {string} id 
 */
export const removeLocalItem = (entity, id) => {
  const current = getLocalItems(entity);
  const updated = current.filter((i) => String(i.id) !== String(id));
  saveLocalItems(entity, updated);
  return id;
};
