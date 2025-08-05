/**
 * RapidAPI Service for AI Workout Planner - CORRECTED
 *
 * Handles all interactions with the RapidAPI AI Workout Planner.
 * Correctly maps the API request and response according to official documentation.
 * Fetches data in Spanish as requested.
 */

import axios from 'axios';

// API Configuration for AI Workout Planner
const RAPIDAPI_CONFIG = {
  headers: {
    'X-RapidAPI-Key': process.env.REACT_APP_RAPIDAPI_KEY,
    'X-RapidAPI-Host': 'ai-workout-planner-exercise-fitness-nutrition-guide.p.rapidapi.com',
    'Content-Type': 'application/json'
  }
};

// Base URL for the API
const API_BASE_URL = 'https://ai-workout-planner-exercise-fitness-nutrition-guide.p.rapidapi.com';

// Validate required environment variables
const validateEnvironmentVariables = () => {
  if (!process.env.REACT_APP_RAPIDAPI_KEY || process.env.REACT_APP_RAPIDAPI_KEY === 'your-rapidapi-key-here') {
    return false;
  }
  return true;
};

/**
 * Generates a personalized workout plan using the AI Workout Planner API.
 * @param {Object} profileData - User profile data (optional)
 */
export const generateWorkoutPlan = async (profileData = null) => {
  try {
    if (!validateEnvironmentVariables()) {
      console.warn('⚠️ RapidAPI key not configured, using fallback service.');
      return await getFallbackWorkout(profileData);
    }
    
    console.log('🔥 Calling AI Workout Planner API...');
    console.log('👤 Profile data provided:', profileData);

    // --- CORRECTED REQUEST BODY ---
    // Maps profile data to the API's expected parameters
    const requestBody = {
      goal: profileData?.goals?.[0] || "Perder peso", // API expects a single string goal
      fitness_level: profileData?.level === 'débutante' ? 'Beginner' : profileData?.level || 'Beginner',
      preferences: profileData?.preferences || ["Cardio", "Entrenamiento con pesas"],
      health_conditions: ["Ninguna"],
      schedule: {
        days_per_week: profileData?.sessionsPerWeek || 3,
        session_duration: profileData?.sessionDuration || 45
      },
      plan_duration_weeks: 4,
      lang: "es" // Fetching in Spanish as requested
    };

    console.log('📊 Sending Request Body:', requestBody);

    const response = await axios.post(
      `${API_BASE_URL}/generateWorkoutPlan`,
      requestBody,
      RAPIDAPI_CONFIG
    );

    console.log('✅ API Response Received:', response.data);

    // Map the API response to the application's structure
    const mappedData = mapApiResponseToAppStructure(response.data);
    
    return {
      success: true,
      data: mappedData,
    };

  } catch (error) {
    console.error('❌ API call error:', error);
    
    let errorMessage = 'Failed to generate workout plan from the API.';
    if (error.response) {
      errorMessage += ` Status: ${error.response.status}. Check your API Key and parameters.`;
    } else if (error.request) {
      errorMessage += ' Network problem.';
    } else {
      errorMessage += ` Error: ${error.message}`;
    }
    console.warn(errorMessage);
    
    console.warn('⚠️ API failed, using fallback service');
    return await getFallbackWorkout(profileData);
  }
};

/**
 * Maps the API response to the application's data structure.
 * @param {Object} apiResponse - The response from the API.
 * @returns {Object} - Data mapped to the app's structure.
 */
const mapApiResponseToAppStructure = (apiResponse) => {
  const result = apiResponse.result;
  if (!result || !result.exercises) {
    console.error("Invalid API response structure", apiResponse);
    throw new Error("Invalid API response structure.");
  }

  console.log('🔄 Mapping API response...', result);

  // --- CORRECTED MAPPING LOGIC ---
  const sessions = result.exercises.map((dayPlan, index) => {
    console.log(`🏋️ Mapping day ${index + 1}: ${dayPlan.day}`);
    
    // Each day from the API becomes a session in our app
    const mainWorkout = dayPlan.exercises.map((apiExercise, exerciseIndex) => {
      console.log(`  🎯 Mapping individual exercise ${exerciseIndex}: ${apiExercise.name}`);
      return {
        id: `ex_${index}_${exerciseIndex}_${Date.now()}`,
        name: apiExercise.name,
        description: apiExercise.description || '',
        instructions: apiExercise.instructions || [`Realizar ${apiExercise.name}`],
        sets: apiExercise.sets,
        reps: apiExercise.repetitions,
        duration: apiExercise.duration,
        equipment: apiExercise.equipment,
      };
    });

    return {
      id: `session_${index + 1}`,
      sessionNumber: index + 1,
      title: `Session ${index + 1} - ${dayPlan.day}`,
      type: "Mixed", // The API doesn't provide a session type, so we use a default
      description: `Entrenamiento para ${dayPlan.day}.`,
      warmup: [], // The API does not provide a separate warmup
      mainWorkout: mainWorkout,
      cooldown: [], // The API does not provide a separate cooldown
    };
  });
  
  console.log('📋 Sessions mapped:', sessions);

  return {
    id: `workout-${Date.now()}`,
    title: result.seo_title || result.goal || "Plan de Entrenamiento Personalizado",
    description: result.seo_content || `Un plan de ${result.total_weeks} semanas para ${result.goal}.`,
    totalSessions: result.schedule?.days_per_week,
    level: result.fitness_level,
    estimatedDuration: result.schedule?.session_duration,
    sessions: sessions
  };
};

/**
 * Fallback to Ella's personalized service if RapidAPI fails.
 * @param {Object} profileData - User profile data.
 */
const getFallbackWorkout = async (profileData) => {
  try {
    const { generateEllaWorkout } = await import('./ellaWorkoutService');
    console.log('🎯 Using Ella\'s personalized workout service as fallback');
    const ellaResult = await generateEllaWorkout(profileData);
    if (ellaResult.success) {
      return {
        success: true,
        data: ellaResult.data,
        message: 'Entrenamiento generado por el servicio personalizado de Ella'
      };
    } else {
      return getMockWorkoutPlan();
    }
  } catch (error) {
    console.error('❌ Fallback service also failed:', error);
    return getMockWorkoutPlan();
  }
};

/**
 * Mock workout data for testing/development.
 */
export const getMockWorkoutPlan = () => {
  // Mock data can be kept as is for testing purposes
  return {
    success: true,
    data: {
      id: `workout-mock-${Date.now()}`,
      title: 'Plan de Respaldo (Mock)',
      description: 'Este es un plan de ejemplo cargado porque el servicio principal no está disponible.',
      level: 'Beginner',
      totalSessions: 1,
      sessions: [
        {
          id: 'session-mock-1',
          sessionNumber: 1,
          title: 'Entrenamiento de Ejemplo',
          type: 'mixed',
          mainWorkout: [
            { id: 'ex-mock-1', name: 'Sentadillas (Squats)', sets: 3, reps: '12-15' },
            { id: 'ex-mock-2', name: 'Flexiones (Push-ups)', sets: 3, reps: '8-12' },
          ]
        }
      ]
    }
  };
};