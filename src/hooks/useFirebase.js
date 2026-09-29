import { useContext } from 'react';
import { FirebaseContext } from '../context/FirebaseContext';

/**
 * Custom hook to access culture, news, event, culinary, and district data
 * from FirebaseContext (with automatic fallback to local JSON)
 */
export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
};

export default useFirebase;
