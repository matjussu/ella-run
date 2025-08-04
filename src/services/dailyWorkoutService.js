/**
 * Daily Workout Service
 * 
 * Manages daily workout validation, tracking, and progress recording.
 * Integrates with Firebase for persistent storage.
 */

import {
  collection,
  doc,
  addDoc,
  updateDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';

/**
 * Daily Workout Progress Service
 */
export const dailyWorkoutService = {
  /**
   * Save a completed daily workout
   * @param {Object} workoutData - Workout completion data
   * @returns {Promise<string>} Document ID
   */
  async saveDailyWorkout(workoutData) {
    try {
      const dailyWorkoutRef = await addDoc(collection(db, 'dailyWorkouts'), {
        ...workoutData,
        completedAt: serverTimestamp(),
        date: this.getTodayDateString(),
        isValidated: true
      });
      
      console.log('✅ Daily workout saved:', dailyWorkoutRef.id);
      return dailyWorkoutRef.id;
    } catch (error) {
      console.error('Error saving daily workout:', error);
      throw new Error('Failed to save daily workout');
    }
  },

  /**
   * Get today's workout status
   * @returns {Promise<Object|null>} Today's workout or null if not completed
   */
  async getTodaysWorkout() {
    try {
      const today = this.getTodayDateString();
      const workoutsQuery = query(
        collection(db, 'dailyWorkouts'),
        where('date', '==', today),
        orderBy('completedAt', 'desc')
      );
      
      const querySnapshot = await getDocs(workoutsQuery);
      
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        return { id: doc.id, ...doc.data() };
      }
      
      return null;
    } catch (error) {
      console.error('Error getting today\'s workout:', error);
      throw new Error('Failed to load today\'s workout');
    }
  },

  /**
   * Check if user has completed workout today
   * @returns {Promise<boolean>} True if workout completed today
   */
  async hasCompletedWorkoutToday() {
    try {
      const todaysWorkout = await this.getTodaysWorkout();
      return todaysWorkout !== null && todaysWorkout.isValidated;
    } catch (error) {
      console.error('Error checking today\'s workout status:', error);
      return false;
    }
  },

  /**
   * Get workout streak (consecutive days)
   * @returns {Promise<number>} Current workout streak
   */
  async getWorkoutStreak() {
    try {
      const workoutsQuery = query(
        collection(db, 'dailyWorkouts'),
        where('isValidated', '==', true),
        orderBy('date', 'desc')
      );
      
      const querySnapshot = await getDocs(workoutsQuery);
      const workouts = querySnapshot.docs.map(doc => doc.data());
      
      if (workouts.length === 0) return 0;
      
      let streak = 0;
      let currentDate = new Date();
      
      for (const workout of workouts) {
        const workoutDate = workout.date;
        const expectedDate = this.getDateString(currentDate);
        
        if (workoutDate === expectedDate) {
          streak++;
          currentDate.setDate(currentDate.getDate() - 1);
        } else if (workoutDate === this.getDateString(new Date(currentDate.getTime() - 24 * 60 * 60 * 1000))) {
          // Allow for yesterday if today not done yet
          streak++;
          currentDate.setDate(currentDate.getDate() - 2);
        } else {
          break;
        }
      }
      
      return streak;
    } catch (error) {
      console.error('Error calculating workout streak:', error);
      return 0;
    }
  },

  /**
   * Get weekly workout summary
   * @returns {Promise<Object>} Weekly stats
   */
  async getWeeklyStats() {
    try {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      
      const workoutsQuery = query(
        collection(db, 'dailyWorkouts'),
        where('isValidated', '==', true),
        where('date', '>=', this.getDateString(oneWeekAgo)),
        orderBy('date', 'desc')
      );
      
      const querySnapshot = await getDocs(workoutsQuery);
      const workouts = querySnapshot.docs.map(doc => doc.data());
      
      const totalWorkouts = workouts.length;
      const totalDuration = workouts.reduce((sum, workout) => sum + (workout.duration || 0), 0);
      const averageDuration = totalWorkouts > 0 ? Math.round(totalDuration / totalWorkouts) : 0;
      
      // Calculate completion rate (out of 7 days)
      const completionRate = Math.round((totalWorkouts / 7) * 100);
      
      return {
        totalWorkouts,
        totalDuration,
        averageDuration,
        completionRate,
        streak: await this.getWorkoutStreak()
      };
    } catch (error) {
      console.error('Error getting weekly stats:', error);
      return {
        totalWorkouts: 0,
        totalDuration: 0,
        averageDuration: 0,
        completionRate: 0,
        streak: 0
      };
    }
  },

  /**
   * Validate and record a workout session
   * @param {Object} workoutSessionData - Complete workout session data
   * @returns {Promise<string>} Document ID
   */
  async validateWorkoutSession(workoutSessionData) {
    try {
      const validationData = {
        workoutId: workoutSessionData.id,
        workoutTitle: workoutSessionData.title,
        workoutType: workoutSessionData.type || 'Mixed',
        duration: workoutSessionData.estimatedDuration || 45,
        exercises: workoutSessionData.sessions?.flatMap(session => 
          [...(session.warmup || []), ...(session.mainWorkout || []), ...(session.cooldown || [])]
        ) || [],
        totalExercises: workoutSessionData.sessions?.reduce((total, session) => 
          total + (session.warmup?.length || 0) + (session.mainWorkout?.length || 0) + (session.cooldown?.length || 0), 0
        ) || 0,
        completionNotes: `Entraînement ${workoutSessionData.title} validé avec succès`,
        userId: 'ella', // For now, hardcoded user
        source: 'rapidapi'
      };
      
      return await this.saveDailyWorkout(validationData);
    } catch (error) {
      console.error('Error validating workout session:', error);
      throw new Error('Failed to validate workout session');
    }
  },

  /**
   * Get formatted today's date string (YYYY-MM-DD)
   * @returns {string} Today's date
   */
  getTodayDateString() {
    return this.getDateString(new Date());
  },

  /**
   * Format date as YYYY-MM-DD string
   * @param {Date} date - Date to format
   * @returns {string} Formatted date string
   */
  getDateString(date) {
    return date.toISOString().split('T')[0];
  },

  /**
   * Get workout history for the last N days
   * @param {number} days - Number of days to look back
   * @returns {Promise<Array>} Array of workout records
   */
  async getWorkoutHistory(days = 30) {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      
      const workoutsQuery = query(
        collection(db, 'dailyWorkouts'),
        where('date', '>=', this.getDateString(startDate)),
        orderBy('date', 'desc')
      );
      
      const querySnapshot = await getDocs(workoutsQuery);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting workout history:', error);
      return [];
    }
  }
};

export default dailyWorkoutService;