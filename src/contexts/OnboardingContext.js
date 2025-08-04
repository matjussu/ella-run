/**
 * Onboarding Context
 * 
 * Manages the complete onboarding flow state and user profile creation
 * Provides step navigation, data validation, and profile persistence
 */

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import userProfileService from '../services/userProfileService';

// Onboarding steps configuration
export const ONBOARDING_STEPS = {
  WELCOME: 'welcome',
  PERSONAL_INFO: 'personal_info',
  FITNESS_LEVEL: 'fitness_level',
  GOALS: 'goals',
  TARGET_AREAS: 'target_areas',
  SCHEDULE: 'schedule',
  COMPLETION: 'completion'
};

const STEP_ORDER = [
  ONBOARDING_STEPS.WELCOME,
  ONBOARDING_STEPS.PERSONAL_INFO,
  ONBOARDING_STEPS.FITNESS_LEVEL,
  ONBOARDING_STEPS.GOALS,
  ONBOARDING_STEPS.TARGET_AREAS,
  ONBOARDING_STEPS.SCHEDULE,
  ONBOARDING_STEPS.COMPLETION
];

// Initial onboarding state
const initialState = {
  currentStep: ONBOARDING_STEPS.WELCOME,
  currentStepIndex: 0,
  totalSteps: STEP_ORDER.length,
  isLoading: false,
  error: null,
  userData: {
    personalInfo: {
      name: 'Ella',
      age: null,
      height: null, // cm
      weight: null, // kg
      bmi: null
    },
    fitnessProfile: {
      level: null, // 'débutante', 'intermédiaire', 'avancée'
      goals: [],
      targetAreas: [],
      preferredWorkoutTypes: []
    },
    schedule: {
      sessionsPerWeek: 3,
      sessionDuration: 60,
      preferredTimes: [],
      availableDays: []
    },
    preferences: {
      language: 'fr',
      units: 'metric',
      notifications: true
    }
  },
  validation: {
    isValid: false,
    errors: {}
  },
  progress: 0
};

// Onboarding reducer
const onboardingReducer = (state, action) => {
  switch (action.type) {
    case 'SET_CURRENT_STEP':
      const stepIndex = STEP_ORDER.indexOf(action.payload);
      return {
        ...state,
        currentStep: action.payload,
        currentStepIndex: stepIndex,
        progress: ((stepIndex + 1) / state.totalSteps) * 100
      };

    case 'NEXT_STEP':
      const nextIndex = Math.min(state.currentStepIndex + 1, state.totalSteps - 1);
      return {
        ...state,
        currentStep: STEP_ORDER[nextIndex],
        currentStepIndex: nextIndex,
        progress: ((nextIndex + 1) / state.totalSteps) * 100
      };

    case 'PREVIOUS_STEP':
      const prevIndex = Math.max(state.currentStepIndex - 1, 0);
      return {
        ...state,
        currentStep: STEP_ORDER[prevIndex],
        currentStepIndex: prevIndex,
        progress: ((prevIndex + 1) / state.totalSteps) * 100
      };

    case 'UPDATE_USER_DATA':
      const updatedUserData = {
        ...state.userData,
        ...action.payload
      };
      
      // Calculate BMI if height and weight are available
      if (updatedUserData.personalInfo.height && updatedUserData.personalInfo.weight) {
        const heightInM = updatedUserData.personalInfo.height / 100;
        updatedUserData.personalInfo.bmi = parseFloat(
          (updatedUserData.personalInfo.weight / (heightInM * heightInM)).toFixed(1)
        );
      }

      return {
        ...state,
        userData: updatedUserData
      };

    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload
      };

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };

    case 'SET_VALIDATION':
      return {
        ...state,
        validation: action.payload
      };

    case 'RESET_ONBOARDING':
      return initialState;

    default:
      return state;
  }
};

// Create context
const OnboardingContext = createContext();

// Custom hook to use onboarding context
export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within OnboardingProvider');
  }
  return context;
};

// Onboarding Provider Component
export const OnboardingProvider = ({ children }) => {
  const [state, dispatch] = useReducer(onboardingReducer, initialState);

  // Validate current step when data changes
  useEffect(() => {
    const validateStep = () => {
      const { currentStep, userData } = state;
      let isValid = true;
      const errors = {};

      switch (currentStep) {
        case ONBOARDING_STEPS.PERSONAL_INFO:
          if (!userData.personalInfo.name?.trim()) {
            errors.name = 'Le nom est requis';
            isValid = false;
          }
          if (!userData.personalInfo.age || userData.personalInfo.age < 16 || userData.personalInfo.age > 100) {
            errors.age = 'Âge invalide (16-100 ans)';
            isValid = false;
          }
          if (!userData.personalInfo.height || userData.personalInfo.height < 120 || userData.personalInfo.height > 250) {
            errors.height = 'Taille invalide (120-250 cm)';
            isValid = false;
          }
          if (!userData.personalInfo.weight || userData.personalInfo.weight < 30 || userData.personalInfo.weight > 300) {
            errors.weight = 'Poids invalide (30-300 kg)';
            isValid = false;
          }
          break;

        case ONBOARDING_STEPS.FITNESS_LEVEL:
          if (!userData.fitnessProfile.level) {
            errors.level = 'Niveau de fitness requis';
            isValid = false;
          }
          break;

        case ONBOARDING_STEPS.GOALS:
          if (!userData.fitnessProfile.goals || userData.fitnessProfile.goals.length === 0) {
            errors.goals = 'Au moins un objectif requis';
            isValid = false;
          }
          break;

        case ONBOARDING_STEPS.TARGET_AREAS:
          if (!userData.fitnessProfile.targetAreas || userData.fitnessProfile.targetAreas.length === 0) {
            errors.targetAreas = 'Au moins une zone cible requise';
            isValid = false;
          }
          break;

        case ONBOARDING_STEPS.SCHEDULE:
          if (!userData.schedule.sessionsPerWeek || userData.schedule.sessionsPerWeek < 1) {
            errors.sessionsPerWeek = 'Nombre de séances requis';
            isValid = false;
          }
          if (!userData.schedule.sessionDuration || userData.schedule.sessionDuration < 15) {
            errors.sessionDuration = 'Durée de séance requise';
            isValid = false;
          }
          break;

        default:
          isValid = true;
      }

      dispatch({ type: 'SET_VALIDATION', payload: { isValid, errors } });
    };

    validateStep();
  }, [state.currentStep, state.userData]);

  // Navigation functions
  const goToStep = (step) => {
    dispatch({ type: 'SET_CURRENT_STEP', payload: step });
  };

  const nextStep = () => {
    if (validateCurrentStep()) {
      dispatch({ type: 'NEXT_STEP' });
    }
  };

  const previousStep = () => {
    dispatch({ type: 'PREVIOUS_STEP' });
  };

  // Data management functions
  const updateUserData = (data) => {
    dispatch({ type: 'UPDATE_USER_DATA', payload: data });
  };

  const updatePersonalInfo = (personalInfo) => {
    updateUserData({ personalInfo: { ...state.userData.personalInfo, ...personalInfo } });
  };

  const updateFitnessProfile = (fitnessProfile) => {
    updateUserData({ fitnessProfile: { ...state.userData.fitnessProfile, ...fitnessProfile } });
  };

  const updateSchedule = (schedule) => {
    updateUserData({ schedule: { ...state.userData.schedule, ...schedule } });
  };

  const updatePreferences = (preferences) => {
    updateUserData({ preferences: { ...state.userData.preferences, ...preferences } });
  };

  // Manual validation function (for explicit validation calls)
  const validateCurrentStep = () => {
    return state.validation.isValid;
  };

  // Complete onboarding and save profile
  const completeOnboarding = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });

      // Final validation
      if (!validateCurrentStep()) {
        throw new Error('Données incomplètes');
      }

      // Prepare final profile data
      const profileData = {
        ...state.userData,
        onboardingCompleted: true,
        createdAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString()
      };

      // Save to Firebase
      const result = await userProfileService.createUserProfile(profileData);
      
      if (result.success) {
        console.log('✅ Onboarding completed successfully');
        return {
          success: true,
          profile: result.profile
        };
      } else {
        throw new Error(result.error || 'Erreur lors de la sauvegarde');
      }

    } catch (error) {
      console.error('❌ Error completing onboarding:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message });
      return {
        success: false,
        error: error.message
      };
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Reset onboarding
  const resetOnboarding = () => {
    dispatch({ type: 'RESET_ONBOARDING' });
  };

  // Calculate completion percentage
  const getCompletionPercentage = () => {
    return Math.round(state.progress);
  };

  // Get step information
  const getStepInfo = (step) => {
    const stepIndex = STEP_ORDER.indexOf(step);
    return {
      index: stepIndex,
      isCompleted: stepIndex < state.currentStepIndex,
      isCurrent: step === state.currentStep,
      isUpcoming: stepIndex > state.currentStepIndex
    };
  };

  // Check if can go to next step (without triggering validation)
  const canGoNext = () => {
    return state.currentStepIndex < state.totalSteps - 1 && state.validation.isValid;
  };

  // Check if can go to previous step
  const canGoPrevious = () => {
    return state.currentStepIndex > 0;
  };

  // Context value
  const contextValue = {
    // State
    ...state,
    
    // Navigation
    goToStep,
    nextStep,
    previousStep,
    canGoNext,
    canGoPrevious,
    
    // Data management
    updateUserData,
    updatePersonalInfo,
    updateFitnessProfile,
    updateSchedule,
    updatePreferences,
    
    // Validation
    validateCurrentStep,
    
    // Completion
    completeOnboarding,
    resetOnboarding,
    
    // Utilities
    getCompletionPercentage,
    getStepInfo
  };

  return (
    <OnboardingContext.Provider value={contextValue}>
      {children}
    </OnboardingContext.Provider>
  );
};

export default OnboardingContext;