/**
 * User Profile Service
 * 
 * Manages user profiles, onboarding completion, and personalization data
 * Handles Firebase integration for profile storage and retrieval
 */

import { db } from '../config/firebase';
import { doc, setDoc, getDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';

// Default profile structure
const DEFAULT_PROFILE = {
  personalInfo: {
    name: 'Ella',
    age: 25,
    height: 170, // cm
    weight: 63, // kg
    bmi: 21.8
  },
  fitnessProfile: {
    level: 'débutante',
    goals: ['course_à_pied', 'renforcement_musculaire'],
    targetAreas: ['squats', 'abdos', 'corps_entier'],
    preferredWorkoutTypes: ['mixte', 'cardio', 'force']
  },
  schedule: {
    sessionsPerWeek: 3,
    sessionDuration: 60,
    preferredTimes: ['matin'],
    availableDays: ['lundi', 'mercredi', 'vendredi']
  },
  preferences: {
    language: 'fr',
    units: 'metric',
    notifications: true
  },
  onboardingCompleted: false,
  createdAt: new Date().toISOString(),
  lastUpdated: new Date().toISOString()
};

/**
 * Create a new user profile
 */
export const createUserProfile = async (profileData) => {
  try {
    // Use provided ID or generate unique profile ID
    const profileId = profileData.id || generateProfileId(profileData.personalInfo?.name || 'user');
    
    // Merge with default profile structure
    const completeProfile = {
      ...DEFAULT_PROFILE,
      ...profileData,
      id: profileId,
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString()
    };

    // Save to Firebase
    await setDoc(doc(db, 'userProfiles', profileId), completeProfile);

    console.log('✅ User profile created successfully:', profileId);
    
    return {
      success: true,
      profile: completeProfile,
      profileId
    };

  } catch (error) {
    console.error('❌ Error creating user profile:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Get user profile by ID
 */
export const getUserProfile = async (profileId) => {
  try {
    const docRef = doc(db, 'userProfiles', profileId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const profile = docSnap.data();
      console.log('✅ User profile retrieved:', profileId);
      return {
        success: true,
        profile
      };
    } else {
      console.log('📭 No profile found for ID:', profileId);
      return {
        success: false,
        error: 'Profile not found'
      };
    }

  } catch (error) {
    console.error('❌ Error retrieving user profile:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Get user profile by name (for Ella's default profile)
 */
export const getUserProfileByName = async (name = 'Ella') => {
  try {
    const profilesRef = collection(db, 'userProfiles');
    const q = query(profilesRef, where('personalInfo.name', '==', name));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      const profile = doc.data();
      console.log('✅ User profile found by name:', name);
      return {
        success: true,
        profile
      };
    } else {
      console.log('📭 No profile found for name:', name);
      // Return default Ella profile if not found
      return {
        success: true,
        profile: DEFAULT_PROFILE
      };
    }

  } catch (error) {
    console.error('❌ Error retrieving profile by name:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Update existing user profile
 */
export const updateUserProfile = async (profileId, updateData) => {
  try {
    const docRef = doc(db, 'userProfiles', profileId);
    
    // Add lastUpdated timestamp
    const updatedData = {
      ...updateData,
      lastUpdated: new Date().toISOString()
    };

    await updateDoc(docRef, updatedData);

    console.log('✅ User profile updated successfully:', profileId);
    
    return {
      success: true,
      updatedData
    };

  } catch (error) {
    console.error('❌ Error updating user profile:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Check if user has completed onboarding
 */
export const checkOnboardingStatus = async (profileId = null) => {
  try {
    let profile;
    
    if (profileId) {
      const result = await getUserProfile(profileId);
      profile = result.profile;
    } else {
      // Check for default Ella profile
      const result = await getUserProfileByName('Ella');
      profile = result.profile;
    }

    return {
      completed: profile?.onboardingCompleted || false,
      profile
    };

  } catch (error) {
    console.error('❌ Error checking onboarding status:', error);
    return {
      completed: false,
      profile: null
    };
  }
};

/**
 * Mark onboarding as completed
 */
export const completeOnboarding = async (profileId) => {
  try {
    const updateData = {
      onboardingCompleted: true,
      onboardingCompletedAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString()
    };

    const result = await updateUserProfile(profileId, updateData);
    
    if (result.success) {
      console.log('✅ Onboarding marked as completed for:', profileId);
    }
    
    return result;

  } catch (error) {
    console.error('❌ Error completing onboarding:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Get personalized recommendations based on profile
 */
export const getPersonalizedRecommendations = (profile) => {
  const recommendations = {
    workoutFrequency: 'optimal',
    healthInsights: [],
    motivationalMessages: [],
    nextSteps: []
  };

  if (!profile) return recommendations;

  const { personalInfo, fitnessProfile, schedule } = profile;

  // BMI-based recommendations
  if (personalInfo.bmi) {
    const bmi = personalInfo.bmi;
    if (bmi < 18.5) {
      recommendations.healthInsights.push({
        type: 'info',
        message: 'Concentre-toi sur le renforcement musculaire pour développer ta masse musculaire.'
      });
    } else if (bmi >= 18.5 && bmi < 25) {
      recommendations.healthInsights.push({
        type: 'success',
        message: 'Ton IMC est dans la fourchette idéale ! Continue sur cette lancée.'
      });
    } else if (bmi >= 25 && bmi < 30) {
      recommendations.healthInsights.push({
        type: 'warning',
        message: 'Combine cardio et renforcement pour optimiser ta composition corporelle.'
      });
    }
  }

  // Fitness level recommendations
  if (fitnessProfile.level === 'débutante') {
    recommendations.nextSteps.push(
      'Commence par 2-3 séances par semaine',
      'Focus sur la technique avant l\'intensité',
      'Écoute ton corps et repose-toi quand nécessaire'
    );
  } else if (fitnessProfile.level === 'intermédiaire') {
    recommendations.nextSteps.push(
      'Augmente progressivement l\'intensité',
      'Varie tes entraînements pour éviter la stagnation',
      'Considère l\'ajout de poids ou résistances'
    );
  }

  // Schedule-based recommendations
  if (schedule.sessionsPerWeek >= 4) {
    recommendations.workoutFrequency = 'high';
    recommendations.healthInsights.push({
      type: 'info',
      message: 'Excellent ! Assure-toi d\'inclure des jours de récupération.'
    });
  } else if (schedule.sessionsPerWeek >= 2) {
    recommendations.workoutFrequency = 'optimal';
  } else {
    recommendations.workoutFrequency = 'low';
    recommendations.nextSteps.push(
      'Essaie d\'ajouter une séance supplémentaire cette semaine'
    );
  }

  // Personalized motivational messages
  recommendations.motivationalMessages = [
    `${personalInfo.name}, tu es sur la bonne voie !`,
    'Chaque entraînement te rapproche de tes objectifs.',
    'Ta régularité est impressionnante !',
    'Continue de briller, tu es incroyable !'
  ];

  return recommendations;
};

/**
 * Calculate calories burned estimate based on profile
 */
export const calculateCaloriesBurned = (profile, activityType, durationMinutes) => {
  if (!profile?.personalInfo?.weight) return 0;

  const weight = profile.personalInfo.weight;
  const MET_VALUES = {
    'running': 8.0,
    'strength_training': 6.0,
    'cardio': 7.0,
    'yoga': 3.0,
    'walking': 3.5,
    'cycling': 8.0,
    'swimming': 8.0,
    'mixed': 6.5
  };

  const met = MET_VALUES[activityType] || 6.0;
  const caloriesPerMinute = (met * weight * 3.5) / 200;
  
  return Math.round(caloriesPerMinute * durationMinutes);
};

/**
 * Generate unique profile ID
 */
const generateProfileId = (name) => {
  const timestamp = Date.now();
  const nameSlug = name.toLowerCase().replace(/[^a-z0-9]/g, '');
  const random = Math.random().toString(36).substring(2, 6);
  return `${nameSlug}-${timestamp}-${random}`;
};

/**
 * Validate profile data
 */
export const validateProfileData = (profileData) => {
  const errors = {};
  let isValid = true;

  // Personal info validation
  if (!profileData.personalInfo?.name?.trim()) {
    errors.name = 'Name is required';
    isValid = false;
  }

  if (!profileData.personalInfo?.age || profileData.personalInfo.age < 16 || profileData.personalInfo.age > 100) {
    errors.age = 'Valid age required (16-100)';
    isValid = false;
  }

  if (!profileData.personalInfo?.height || profileData.personalInfo.height < 120 || profileData.personalInfo.height > 220) {
    errors.height = 'Valid height required (120-220 cm)';
    isValid = false;
  }

  if (!profileData.personalInfo?.weight || profileData.personalInfo.weight < 30 || profileData.personalInfo.weight > 200) {
    errors.weight = 'Valid weight required (30-200 kg)';
    isValid = false;
  }

  // Fitness profile validation
  if (!profileData.fitnessProfile?.level) {
    errors.level = 'Fitness level is required';
    isValid = false;
  }

  if (!profileData.fitnessProfile?.goals?.length) {
    errors.goals = 'At least one goal is required';
    isValid = false;
  }

  return { isValid, errors };
};

export default {
  createUserProfile,
  getUserProfile,
  getUserProfileByName,
  updateUserProfile,
  checkOnboardingStatus,
  completeOnboarding,
  getPersonalizedRecommendations,
  calculateCaloriesBurned,
  validateProfileData
};