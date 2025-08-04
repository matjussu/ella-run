/**
 * RapidAPI Service for AI Workout Planner
 * 
 * This service handles all interactions with the RapidAPI AI Workout Planner.
 * It generates personalized workout plans based on fixed parameters:
 * - Level: Beginner
 * - Goals: Running + Strength training
 * - Frequency: 3 sessions per week
 */

import axios from 'axios';
import { cacheWorkout, getCachedWorkout } from './workoutCacheService';

// API Configuration
const RAPIDAPI_CONFIG = {
  baseURL: `https://${process.env.REACT_APP_RAPIDAPI_HOST}`,
  headers: {
    'X-RapidAPI-Key': process.env.REACT_APP_RAPIDAPI_KEY,
    'X-RapidAPI-Host': process.env.REACT_APP_RAPIDAPI_HOST,
    'Content-Type': 'application/json'
  }
};

// Validate required environment variables
const validateEnvironmentVariables = () => {
  const requiredVars = ['REACT_APP_RAPIDAPI_KEY', 'REACT_APP_RAPIDAPI_HOST'];
  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }
};

// Create axios instance with configuration
const createApiClient = () => {
  validateEnvironmentVariables();
  return axios.create(RAPIDAPI_CONFIG);
};

/**
 * Generate a personalized workout plan using RapidAPI with Ella's specific parameters
 */
export const generateWorkoutPlan = async (userProfile = null) => {
  try {
    // First, try to get cached workout for this profile
    const cachedWorkout = await getCachedWorkout(userProfile);
    if (cachedWorkout) {
      console.log('⚡ Using cached workout for improved performance');
      return {
        success: true,
        data: cachedWorkout,
        source: 'cache',
        timestamp: new Date().toISOString()
      };
    }

    const apiClient = createApiClient();
    
    // Use user profile if provided, otherwise use Ella's default parameters
    const ellaDefaults = {
      name: 'Ella',
      weight: 63, // kg
      height: 170, // cm
      age: 25,
      fitnessLevel: 'beginner',
      goals: ['running', 'strength_training'],
      targetAreas: ['squats', 'abs', 'full_body'],
      sessionsPerWeek: 3,
      sessionDuration: 60
    };

    const profile = userProfile || ellaDefaults;
    
    // Calculate BMI for API
    const bmi = (profile.weight / Math.pow(profile.height / 100, 2)).toFixed(1);
    
    // Personalized workout parameters for RapidAPI
    const workoutParams = {
      user_profile: {
        weight: profile.weight,
        height: profile.height,
        age: profile.age,
        bmi: parseFloat(bmi),
        fitness_level: profile.fitnessLevel,
        name: profile.name
      },
      goals: Array.isArray(profile.goals) ? profile.goals : ['running', 'strength_training'],
      target_areas: Array.isArray(profile.targetAreas) ? profile.targetAreas : ['squats', 'abs', 'full_body'],
      frequency: profile.sessionsPerWeek || 3,
      duration: profile.sessionDuration || 60,
      equipment: ['bodyweight', 'dumbbells', 'resistance_bands'],
      preferences: {
        workout_type: 'mixed',
        focus_areas: ['cardio', 'strength', 'flexibility'],
        difficulty_progression: true,
        include_warm_up: true,
        include_cool_down: true
      },
      language: 'fr'
    };

    console.log('🔥 Generating personalized workout with RapidAPI for:', profile.name);
    console.log('📊 User Profile:', {
      weight: `${profile.weight}kg`,
      height: `${profile.height}cm`,
      bmi: bmi,
      level: profile.fitnessLevel
    });

    // Make real API request to generate workout plan
    const response = await apiClient.post('/generate-workout', workoutParams);
    
    if (!response.data) {
      throw new Error('No data received from workout API');
    }

    // Transform and validate the API response
    const transformedData = transformWorkoutData(response.data);
    validateWorkoutPlan(transformedData);

    console.log('✅ Successfully generated personalized workout from RapidAPI');
    
    // Cache the successful result for future use
    await cacheWorkout(transformedData, profile, 'rapidapi');
    
    return {
      success: true,
      data: transformedData,
      source: 'rapidapi',
      userProfile: profile,
      timestamp: new Date().toISOString()
    };

  } catch (error) {
    console.warn('⚠️ RapidAPI error, falling back to Ella\'s personalized service:', error.message);
    
    // Smart fallback system with detailed error handling
    let fallbackReason = 'unknown';
    
    if (error.response) {
      // API responded with error status
      const statusCode = error.response.status;
      const errorMessage = error.response.data?.message || error.response.statusText;
      
      switch (statusCode) {
        case 401:
          fallbackReason = 'invalid_api_key';
          console.warn('🔑 Invalid API key detected, using offline workout generation');
          break;
        case 403:
          fallbackReason = 'subscription_expired';
          console.warn('📵 API subscription issue, using cached workout templates');
          break;
        case 429:
          fallbackReason = 'rate_limit';
          console.warn('⏰ Rate limit exceeded, using intelligent fallback');
          break;
        case 500:
          fallbackReason = 'server_error';
          console.warn('🔧 Server temporarily unavailable, generating offline');
          break;
        default:
          fallbackReason = 'api_error';
          console.warn(`❌ API Error (${statusCode}): ${errorMessage}`);
      }
    } else if (error.request) {
      fallbackReason = 'network_error';
      console.warn('🌐 Network connectivity issue, using offline mode');
    } else if (error.message.includes('environment')) {
      fallbackReason = 'config_error';
      console.warn('⚙️ Configuration issue, using development mode');
    }

    // Fallback to Ella's personalized workout service
    try {
      console.log('🎯 Generating personalized workout using Ella\'s intelligent system...');
      const { generateEllaWorkout } = await import('./ellaWorkoutService');
      const fallbackResult = await generateEllaWorkout(userProfile);
      
      return {
        ...fallbackResult,
        source: 'ella_service',
        fallbackReason,
        note: 'Generated using personalized algorithm due to API unavailability'
      };
      
    } catch (fallbackError) {
      console.error('❌ Critical: Both RapidAPI and fallback failed:', fallbackError);
      
      // Final fallback to mock data with user awareness
      const mockResult = getMockWorkoutPlan();
      return {
        ...mockResult,
        source: 'mock_data',
        fallbackReason: 'both_services_failed',
        note: 'Using template workout. Please check your connection and try again later.'
      };
    }
  }
};

/**
 * Transform API response data to our application format
 */
const transformWorkoutData = (apiResponse) => {
  const { workout_plan, metadata } = apiResponse;
  
  return {
    id: generateWorkoutId(),
    title: workout_plan.title || 'Custom Workout Plan',
    description: workout_plan.description || 'Personalized beginner workout combining running and strength training',
    level: 'Beginner',
    frequency: '3 sessions per week',
    goals: ['Running', 'Strength Training'],
    estimatedDuration: workout_plan.estimated_duration || 60,
    totalSessions: workout_plan.sessions?.length || 3,
    sessions: transformSessions(workout_plan.sessions || []),
    tips: workout_plan.tips || [],
    warnings: workout_plan.warnings || [],
    metadata: {
      generatedAt: new Date().toISOString(),
      apiVersion: metadata?.version || '1.0',
      difficulty: metadata?.difficulty || 'beginner'
    }
  };
};

/**
 * Transform workout sessions from API format
 */
const transformSessions = (sessions) => {
  return sessions.map((session, index) => ({
    id: `session-${index + 1}`,
    sessionNumber: index + 1,
    title: session.title || `Workout Session ${index + 1}`,
    type: session.type || 'mixed',
    duration: session.duration || 60,
    description: session.description || '',
    warmup: transformExerciseList(session.warmup || []),
    mainWorkout: transformExerciseList(session.main_workout || []),
    cooldown: transformExerciseList(session.cooldown || []),
    restPeriods: session.rest_periods || { between_exercises: 30, between_sets: 60 },
    difficulty: session.difficulty || 'beginner',
    equipmentNeeded: session.equipment || ['bodyweight'],
    targetMuscles: session.target_muscles || [],
    calories: session.estimated_calories || 250
  }));
};

/**
 * Transform exercise lists from API format
 */
const transformExerciseList = (exercises) => {
  return exercises.map((exercise, index) => ({
    id: generateExerciseId(exercise.name, index),
    name: exercise.name,
    description: exercise.description || '',
    instructions: exercise.instructions || [],
    duration: exercise.duration || null,
    sets: exercise.sets || null,
    reps: exercise.reps || null,
    weight: exercise.weight || null,
    restTime: exercise.rest_time || 30,
    difficulty: exercise.difficulty || 'beginner',
    targetMuscles: exercise.target_muscles || [],
    equipment: exercise.equipment || ['bodyweight'],
    category: exercise.category || 'general',
    imageUrl: exercise.image_url || null,
    videoUrl: exercise.video_url || null,
    tips: exercise.tips || [],
    modifications: exercise.modifications || []
  }));
};

/**
 * Generate unique workout ID
 */
const generateWorkoutId = () => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `workout-${timestamp}-${random}`;
};

/**
 * Generate unique exercise ID
 */
const generateExerciseId = (exerciseName, index) => {
  const nameSlug = exerciseName.toLowerCase().replace(/[^a-z0-9]/g, '-');
  return `${nameSlug}-${index}`;
};

/**
 * Get exercise details by name (fallback for missing data)
 */
export const getExerciseDetails = async (exerciseName) => {
  try {
    const apiClient = createApiClient();
    
    const response = await apiClient.get(`/exercise-details`, {
      params: { name: exerciseName }
    });
    
    return {
      success: true,
      data: response.data
    };
    
  } catch (error) {
    console.error('Error fetching exercise details:', error);
    
    // Return fallback data if API fails
    return {
      success: false,
      data: {
        name: exerciseName,
        description: 'Exercise details not available',
        instructions: ['Perform as directed by your fitness instructor'],
        tips: ['Focus on proper form', 'Start with lighter weights/easier variations']
      }
    };
  }
};

/**
 * Validate workout plan structure
 */
export const validateWorkoutPlan = (workoutPlan) => {
  const requiredFields = ['id', 'title', 'sessions'];
  const missingFields = requiredFields.filter(field => !workoutPlan[field]);
  
  if (missingFields.length > 0) {
    throw new Error(`Invalid workout plan: missing ${missingFields.join(', ')}`);
  }
  
  if (!Array.isArray(workoutPlan.sessions) || workoutPlan.sessions.length === 0) {
    throw new Error('Workout plan must contain at least one session');
  }
  
  return true;
};

/**
 * Mock workout data for testing/development when API is not available
 */
export const getMockWorkoutPlan = () => {
  return {
    success: true,
    data: {
      id: generateWorkoutId(),
      title: 'Beginner Running & Strength Plan',
      description: 'A 3-session weekly workout combining cardio and strength training for beginners',
      level: 'Beginner',
      frequency: '3 sessions per week',
      goals: ['Running', 'Strength Training'],
      estimatedDuration: 60,
      totalSessions: 3,
      sessions: [
        {
          id: 'session-1',
          sessionNumber: 1,
          title: 'Cardio Focus Day',
          type: 'cardio',
          duration: 45,
          description: 'Running-focused session with bodyweight exercises',
          warmup: [
            {
              id: 'warmup-1',
              name: 'Light Jogging',
              duration: 5,
              description: 'Easy-paced jogging to warm up',
              instructions: ['Start slowly', 'Gradually increase pace', 'Focus on breathing']
            }
          ],
          mainWorkout: [
            {
              id: 'main-1',
              name: 'Interval Running',
              duration: 20,
              description: '1 minute fast, 2 minutes recovery',
              instructions: ['Run 1 minute at challenging pace', 'Walk/jog 2 minutes recovery', 'Repeat 6-7 times']
            },
            {
              id: 'main-2',
              name: 'Push-ups',
              sets: 3,
              reps: '8-12',
              description: 'Standard push-ups or knee push-ups',
              instructions: ['Keep body straight', 'Lower chest to ground', 'Push back up smoothly']
            }
          ],
          cooldown: [
            {
              id: 'cooldown-1',
              name: 'Walking',
              duration: 5,
              description: 'Slow walk to cool down',
              instructions: ['Walk at comfortable pace', 'Focus on deep breathing']
            }
          ]
        },
        {
          id: 'session-2',
          sessionNumber: 2,
          title: 'Strength Focus Day',
          type: 'strength',
          duration: 60,
          description: 'Full-body strength training session',
          warmup: [
            {
              id: 'warmup-2',
              name: 'Dynamic Stretching',
              duration: 10,
              description: 'Full-body dynamic warm-up',
              instructions: ['Arm circles', 'Leg swings', 'Torso twists']
            }
          ],
          mainWorkout: [
            {
              id: 'main-3',
              name: 'Squats',
              sets: 3,
              reps: '12-15',
              description: 'Bodyweight squats',
              instructions: ['Feet shoulder-width apart', 'Lower until thighs parallel to ground', 'Stand back up']
            },
            {
              id: 'main-4',
              name: 'Lunges',
              sets: 3,
              reps: '10 each leg',
              description: 'Alternating forward lunges',
              instructions: ['Step forward', 'Lower back knee toward ground', 'Return to standing']
            }
          ],
          cooldown: [
            {
              id: 'cooldown-2',
              name: 'Static Stretching',
              duration: 10,
              description: 'Full-body stretching routine',
              instructions: ['Hold each stretch 30 seconds', 'Focus on worked muscles']
            }
          ]
        },
        {
          id: 'session-3',
          sessionNumber: 3,
          title: 'Mixed Training Day',
          type: 'mixed',
          duration: 55,
          description: 'Combination of cardio and strength exercises',
          warmup: [
            {
              id: 'warmup-3',
              name: 'Light Movement',
              duration: 8,
              description: 'Gentle movement to prepare body',
              instructions: ['Marching in place', 'Arm swings', 'Gentle stretches']
            }
          ],
          mainWorkout: [
            {
              id: 'main-5',
              name: 'Circuit Training',
              duration: 30,
              description: '5 exercises, 45 seconds each, 15 seconds rest',
              instructions: ['Jumping jacks', 'Push-ups', 'Squats', 'Mountain climbers', 'Plank hold']
            }
          ],
          cooldown: [
            {
              id: 'cooldown-3',
              name: 'Cool Down Walk',
              duration: 7,
              description: 'Slow walking and breathing exercises',
              instructions: ['Walk slowly', 'Deep breathing', 'Gentle stretches']
            }
          ]
        }
      ],
      tips: [
        'Stay hydrated throughout your workout',
        'Listen to your body and rest when needed',
        'Focus on proper form over speed or weight',
        'Progress gradually as you build strength and endurance'
      ],
      warnings: [
        'Consult a doctor before starting any new exercise program',
        'Stop immediately if you feel pain or dizziness',
        'Warm up properly before each session'
      ]
    },
    timestamp: new Date().toISOString()
  };
};