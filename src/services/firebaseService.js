/**
 * Firebase Service Layer
 * 
 * This service provides abstracted methods for interacting with Firestore.
 * It handles all CRUD operations for exercises, workout sessions, and user progress.
 */

import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';

/**
 * Exercise Service - Manages exercise library
 */
export const exerciseService = {
  // Add a new exercise to the library
  async addExercise(exerciseData) {
    try {
      const exerciseRef = await addDoc(collection(db, 'exercises'), {
        ...exerciseData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return exerciseRef.id;
    } catch (error) {
      console.error('Error adding exercise:', error);
      throw new Error('Failed to add exercise to library');
    }
  },

  // Get all exercises from the library
  async getAllExercises() {
    try {
      const exercisesQuery = query(
        collection(db, 'exercises'),
        orderBy('name', 'asc')
      );
      const querySnapshot = await getDocs(exercisesQuery);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching exercises:', error);
      throw new Error('Failed to load exercise library');
    }
  },

  // Get exercise by ID
  async getExerciseById(exerciseId) {
    try {
      const exerciseRef = doc(db, 'exercises', exerciseId);
      const exerciseSnap = await getDoc(exerciseRef);
      
      if (exerciseSnap.exists()) {
        return { id: exerciseSnap.id, ...exerciseSnap.data() };
      } else {
        throw new Error('Exercise not found');
      }
    } catch (error) {
      // Only log if it's not a "not found" error (which is expected for RapidAPI exercises)
      if (error.message !== 'Exercise not found') {
        console.error('Error fetching exercise:', error);
      }
      throw error;
    }
  },

  // Update exercise information
  async updateExercise(exerciseId, updateData) {
    try {
      const exerciseRef = doc(db, 'exercises', exerciseId);
      await updateDoc(exerciseRef, {
        ...updateData,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating exercise:', error);
      throw new Error('Failed to update exercise');
    }
  }
};

/**
 * Workout Session Service - Manages generated workout plans
 */
export const workoutSessionService = {
  // Save a new workout session
  async saveWorkoutSession(sessionData) {
    try {
      const sessionRef = await addDoc(collection(db, 'workoutSessions'), {
        ...sessionData,
        createdAt: serverTimestamp(),
        isCompleted: false,
        completedExercises: []
      });
      return sessionRef.id;
    } catch (error) {
      console.error('Error saving workout session:', error);
      throw new Error('Failed to save workout session');
    }
  },

  // Get all workout sessions
  async getAllWorkoutSessions() {
    try {
      const sessionsQuery = query(
        collection(db, 'workoutSessions'),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(sessionsQuery);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching workout sessions:', error);
      throw new Error('Failed to load workout sessions');
    }
  },

  // Get workout session by ID
  async getWorkoutSessionById(sessionId) {
    try {
      const sessionRef = doc(db, 'workoutSessions', sessionId);
      const sessionSnap = await getDoc(sessionRef);
      
      if (sessionSnap.exists()) {
        return { id: sessionSnap.id, ...sessionSnap.data() };
      } else {
        throw new Error('Workout session not found');
      }
    } catch (error) {
      console.error('Error fetching workout session:', error);
      throw new Error('Failed to load workout session');
    }
  },

  // Mark workout session as completed
  async markSessionCompleted(sessionId) {
    try {
      const sessionRef = doc(db, 'workoutSessions', sessionId);
      await updateDoc(sessionRef, {
        isCompleted: true,
        completedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error marking session as completed:', error);
      throw new Error('Failed to update session status');
    }
  },

  // Update completed exercises in a session
  async updateCompletedExercises(sessionId, completedExercises) {
    try {
      const sessionRef = doc(db, 'workoutSessions', sessionId);
      await updateDoc(sessionRef, {
        completedExercises,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating completed exercises:', error);
      throw new Error('Failed to update exercise progress');
    }
  }
};

/**
 * User Progress Service - Manages user progress tracking
 */
export const userProgressService = {
  // Save user progress data
  async saveProgress(progressData) {
    try {
      const progressRef = await addDoc(collection(db, 'userProgress'), {
        ...progressData,
        timestamp: serverTimestamp()
      });
      return progressRef.id;
    } catch (error) {
      console.error('Error saving progress:', error);
      throw new Error('Failed to save progress data');
    }
  },

  // Get user progress history
  async getProgressHistory(limit = 30) {
    try {
      const progressQuery = query(
        collection(db, 'userProgress'),
        orderBy('timestamp', 'desc')
      );
      const querySnapshot = await getDocs(progressQuery);
      return querySnapshot.docs.slice(0, limit).map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching progress history:', error);
      throw new Error('Failed to load progress history');
    }
  },

  // Get progress statistics
  async getProgressStats() {
    try {
      const sessionsQuery = query(collection(db, 'workoutSessions'));
      const querySnapshot = await getDocs(sessionsQuery);
      
      const sessions = querySnapshot.docs.map(doc => doc.data());
      const totalSessions = sessions.length;
      const completedSessions = sessions.filter(session => session.isCompleted).length;
      const completionRate = totalSessions > 0 ? (completedSessions / totalSessions) * 100 : 0;

      return {
        totalSessions,
        completedSessions,
        completionRate: Math.round(completionRate),
        streak: this.calculateStreak(sessions)
      };
    } catch (error) {
      console.error('Error calculating progress stats:', error);
      throw new Error('Failed to calculate progress statistics');
    }
  },

  // Calculate current workout streak
  calculateStreak(sessions) {
    const completedSessions = sessions
      .filter(session => session.isCompleted && session.completedAt)
      .sort((a, b) => b.completedAt.seconds - a.completedAt.seconds);

    if (completedSessions.length === 0) return 0;

    let streak = 0;
    let currentDate = new Date();
    
    for (const session of completedSessions) {
      const sessionDate = new Date(session.completedAt.seconds * 1000);
      const daysDiff = Math.floor((currentDate - sessionDate) / (1000 * 60 * 60 * 24));
      
      if (daysDiff <= 1) {
        streak++;
        currentDate = sessionDate;
      } else {
        break;
      }
    }
    
    return streak;
  }
};