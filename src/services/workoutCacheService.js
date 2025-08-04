/**
 * Workout Cache Service
 * 
 * Intelligent caching system for workout plans to improve performance
 * and provide offline functionality when RapidAPI is unavailable.
 */

import { db } from '../config/firebase';
import { collection, doc, setDoc, getDoc, getDocs, query, where, orderBy, limit, deleteDoc } from 'firebase/firestore';

// Cache configuration
const CACHE_CONFIG = {
  maxCacheAge: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
  maxCachedWorkouts: 50, // Maximum number of cached workouts
  compressionEnabled: true
};

/**
 * Generate cache key based on user profile
 */
const generateCacheKey = (userProfile) => {
  if (!userProfile) {
    return 'ella-default-workout';
  }
  
  const keyComponents = [
    userProfile.name || 'user',
    userProfile.weight || 63,
    userProfile.height || 170,
    userProfile.fitnessLevel || 'beginner',
    (userProfile.goals || []).sort().join('-'),
    (userProfile.targetAreas || []).sort().join('-'),
    userProfile.sessionsPerWeek || 3
  ];
  
  return keyComponents.join('-').toLowerCase().replace(/[^a-z0-9-]/g, '');
};

/**
 * Cache a workout plan to Firebase
 */
export const cacheWorkout = async (workoutPlan, userProfile, source = 'rapidapi') => {
  try {
    const cacheKey = generateCacheKey(userProfile);
    const cacheData = {
      cacheKey,
      workoutPlan,
      userProfile,
      source,
      cachedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + CACHE_CONFIG.maxCacheAge).toISOString(),
      accessCount: 1,
      lastAccessed: new Date().toISOString()
    };

    // Save to Firebase cache collection
    await setDoc(doc(db, 'workoutCache', cacheKey), cacheData);
    
    console.log('✅ Workout cached successfully:', cacheKey);
    
    // Clean up old cache entries
    await cleanupOldCache();
    
    return true;
    
  } catch (error) {
    console.error('❌ Error caching workout:', error);
    return false;
  }
};

/**
 * Retrieve cached workout plan
 */
export const getCachedWorkout = async (userProfile) => {
  try {
    const cacheKey = generateCacheKey(userProfile);
    const docRef = doc(db, 'workoutCache', cacheKey);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      console.log('📭 No cached workout found for:', cacheKey);
      return null;
    }
    
    const cacheData = docSnap.data();
    const now = new Date();
    const expiresAt = new Date(cacheData.expiresAt);
    
    // Check if cache is expired
    if (now > expiresAt) {
      console.log('⏰ Cached workout expired, removing:', cacheKey);
      await deleteCachedWorkout(cacheKey);
      return null;
    }
    
    // Update access statistics
    await updateCacheAccess(cacheKey, cacheData);
    
    console.log('🎯 Retrieved cached workout:', cacheKey);
    return {
      ...cacheData.workoutPlan,
      source: 'cache',
      cachedAt: cacheData.cachedAt,
      originalSource: cacheData.source
    };
    
  } catch (error) {
    console.error('❌ Error retrieving cached workout:', error);
    return null;
  }
};

/**
 * Update cache access statistics
 */
const updateCacheAccess = async (cacheKey, cacheData) => {
  try {
    const updatedData = {
      ...cacheData,
      accessCount: (cacheData.accessCount || 0) + 1,
      lastAccessed: new Date().toISOString()
    };
    
    await setDoc(doc(db, 'workoutCache', cacheKey), updatedData);
  } catch (error) {
    console.error('❌ Error updating cache access:', error);
  }
};

/**
 * Delete specific cached workout
 */
const deleteCachedWorkout = async (cacheKey) => {
  try {
    await deleteDoc(doc(db, 'workoutCache', cacheKey));
    console.log('🗑️ Deleted cached workout:', cacheKey);
  } catch (error) {
    console.error('❌ Error deleting cached workout:', error);
  }
};

/**
 * Clean up old cache entries
 */
const cleanupOldCache = async () => {
  try {
    const cacheCollection = collection(db, 'workoutCache');
    const oldCacheQuery = query(
      cacheCollection,
      where('expiresAt', '<', new Date().toISOString()),
      limit(10)
    );
    
    const querySnapshot = await getDocs(oldCacheQuery);
    const deletePromises = [];
    
    querySnapshot.forEach((doc) => {
      deletePromises.push(deleteDoc(doc.ref));
    });
    
    if (deletePromises.length > 0) {
      await Promise.all(deletePromises);
      console.log(`🧹 Cleaned up ${deletePromises.length} expired cache entries`);
    }
    
  } catch (error) {
    console.error('❌ Error during cache cleanup:', error);
  }
};

/**
 * Get cache statistics
 */
export const getCacheStats = async () => {
  try {
    const cacheCollection = collection(db, 'workoutCache');
    const allCacheQuery = query(cacheCollection, orderBy('lastAccessed', 'desc'));
    const querySnapshot = await getDocs(allCacheQuery);
    
    let totalCached = 0;
    let totalHits = 0;
    let validCache = 0;
    const now = new Date();
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      totalCached++;
      totalHits += data.accessCount || 0;
      
      if (new Date(data.expiresAt) > now) {
        validCache++;
      }
    });
    
    return {
      totalCached,
      validCache,
      expiredCache: totalCached - validCache,
      totalHits,
      averageHitsPerWorkout: totalCached > 0 ? (totalHits / totalCached).toFixed(2) : 0
    };
    
  } catch (error) {
    console.error('❌ Error getting cache stats:', error);
    return {
      totalCached: 0,
      validCache: 0,
      expiredCache: 0,
      totalHits: 0,
      averageHitsPerWorkout: 0
    };
  }
};

/**
 * Clear all cached workouts (admin function)
 */
export const clearAllCache = async () => {
  try {
    const cacheCollection = collection(db, 'workoutCache');
    const querySnapshot = await getDocs(cacheCollection);
    
    const deletePromises = [];
    querySnapshot.forEach((doc) => {
      deletePromises.push(deleteDoc(doc.ref));
    });
    
    await Promise.all(deletePromises);
    console.log(`🧹 Cleared all cache: ${deletePromises.length} entries removed`);
    
    return deletePromises.length;
    
  } catch (error) {
    console.error('❌ Error clearing cache:', error);
    return 0;
  }
};

/**
 * Intelligent cache warming - preload popular workout combinations
 */
export const warmCache = async () => {
  try {
    console.log('🔥 Starting intelligent cache warming...');
    
    // Popular workout profiles to pre-cache
    const popularProfiles = [
      {
        name: 'Ella',
        weight: 63,
        height: 170,
        fitnessLevel: 'beginner',
        goals: ['running', 'strength_training'],
        targetAreas: ['squats', 'abs', 'full_body'],
        sessionsPerWeek: 3
      },
      {
        name: 'Beginner',
        weight: 65,
        height: 165,
        fitnessLevel: 'beginner',
        goals: ['strength_training'],
        targetAreas: ['full_body'],
        sessionsPerWeek: 2
      },
      {
        name: 'Runner',
        weight: 60,
        height: 168,
        fitnessLevel: 'intermediate',
        goals: ['running', 'endurance'],
        targetAreas: ['cardio'],
        sessionsPerWeek: 4
      }
    ];
    
    let warmedCount = 0;
    
    for (const profile of popularProfiles) {
      const cacheKey = generateCacheKey(profile);
      const existing = await getCachedWorkout(profile);
      
      if (!existing) {
        // Generate and cache this profile
        const { generateWorkoutPlan } = await import('./rapidApiService');
        try {
          const workout = await generateWorkoutPlan(profile);
          if (workout.success) {
            await cacheWorkout(workout.data, profile, 'cache_warming');
            warmedCount++;
          }
        } catch (error) {
          console.warn('⚠️ Failed to warm cache for profile:', profile.name, error.message);
        }
      }
    }
    
    console.log(`🔥 Cache warming completed: ${warmedCount} new entries cached`);
    return warmedCount;
    
  } catch (error) {
    console.error('❌ Error during cache warming:', error);
    return 0;
  }
};

export default {
  cacheWorkout,
  getCachedWorkout,
  getCacheStats,
  clearAllCache,
  warmCache
};