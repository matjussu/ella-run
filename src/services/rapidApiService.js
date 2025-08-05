/**
 * RapidAPI Service for AI Workout Planner - CORRECTED WITH POLLING
 *
 * Handles the asynchronous, two-step process of the API.
 * It initiates a request, then polls for the result until it's ready.
 */

import axios from 'axios';

// --- (Configuration et Fallback/Mock restent les mêmes) ---
const RAPIDAPI_CONFIG = {
  headers: {
    'X-RapidAPI-Key': process.env.REACT_APP_RAPIDAPI_KEY,
    'X-RapidAPI-Host': 'ai-workout-planner-exercise-fitness-nutrition-guide.p.rapidapi.com',
    'Content-Type': 'application/json'
  }
};
const API_BASE_URL = 'https://ai-workout-planner-exercise-fitness-nutrition-guide.p.rapidapi.com';

const validateEnvironmentVariables = () => {
  if (!process.env.REACT_APP_RAPIDAPI_KEY || process.env.REACT_APP_RAPIDAPI_KEY === 'your-rapidapi-key-here') {
    return false;
  }
  return true;
};

// Helper function to wait for a specific duration
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Generates a personalized workout plan using the asynchronous AI Workout Planner API.
 * @param {Object} profileData - User profile data (optional)
 */
export const generateWorkoutPlan = async (profileData = null) => {
  if (!validateEnvironmentVariables()) {
    console.warn('⚠️ RapidAPI key not configured, using fallback service.');
    return await getFallbackWorkout(profileData);
  }

  const requestBody = {
    goal: profileData?.goals?.[0] || "Perder peso",
    fitness_level: profileData?.level === 'débutante' ? 'Beginner' : profileData?.level || 'Beginner',
    preferences: profileData?.preferences || ["Cardio", "Entrenamiento con pesas"],
    health_conditions: ["Ninguna"],
    schedule: {
      days_per_week: profileData?.sessionsPerWeek || 3,
      session_duration: profileData?.sessionDuration || 45
    },
    plan_duration_weeks: 4,
    lang: "es"
  };

  try {
    console.log('🔥 Step 1: Initiating workout generation...');
    console.log('📊 Sending Request Body:', requestBody);

    // --- STEP 1: INITIAL REQUEST ---
    let response = await axios.post(
      `${API_BASE_URL}/generateWorkoutPlan`,
      requestBody,
      RAPIDAPI_CONFIG
    );

    console.log('✅ Initial API Response Received:', response.data);

    // --- STEP 2: POLLING FOR THE RESULT ---
    let attempts = 0;
    const maxAttempts = 5; // Try 5 times (e.g., 5 * 10 seconds = 50 seconds total wait time)
    const pollInterval = 10000; // Poll every 10 seconds

    while (response.data.status === 'pending' && attempts < maxAttempts) {
      attempts++;
      console.log(`... Status is 'pending'. Waiting ${pollInterval / 1000} seconds. Attempt ${attempts}/${maxAttempts}`);
      await delay(pollInterval);

      console.log(` polling... Re-sending request.`);
      response = await axios.post(
        `${API_BASE_URL}/generateWorkoutPlan`,
        requestBody,
        RAPIDAPI_CONFIG
      );
      console.log(`  Poll Response:`, response.data);
    }

    if (response.data.status === 'pending') {
      throw new Error("API took too long to generate the plan.");
    }

    if (!response.data.result) {
      throw new Error("API returned a successful status but no 'result' object.");
    }

    // --- STEP 3: MAP THE FINAL RESPONSE ---
    console.log('✅ Final Workout Plan Received:', response.data);
    const mappedData = mapApiResponseToAppStructure(response.data);
    
    return {
      success: true,
      data: mappedData,
    };

  } catch (error) {
    console.error('❌ API process error:', error);
    console.warn('⚠️ API process failed, using fallback service.');
    return await getFallbackWorkout(profileData);
  }
};


// --- La fonction mapApiResponseToAppStructure et les autres fonctions de fallback/mock restent les mêmes ---

const mapApiResponseToAppStructure = (apiResponse) => {
    //...(le code de mapping reste identique)
    const result = apiResponse.result;
    if (!result || !result.exercises) {
        console.error("Invalid API response structure", apiResponse);
        throw new Error("Invalid API response structure.");
    }
    console.log('🔄 Mapping API response...', result);
    const sessions = result.exercises.map((dayPlan, index) => {
        console.log(`🏋️ Mapping day ${index + 1}: ${dayPlan.day}`);
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
            type: "Mixed",
            description: `Entrenamiento para ${dayPlan.day}.`,
            warmup: [],
            mainWorkout: mainWorkout,
            cooldown: [],
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

const getFallbackWorkout = async (profileData) => {
    //...(le code de fallback reste identique)
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

export const getMockWorkoutPlan = () => {
    //...(le code du mock reste identique)
    return {
        success: true,
        data: {
            id: `workout-mock-${Date.now()}`,
            title: 'Plan de Respaldo (Mock)',
            description: 'Este es un plan de ejemplo cargado porque el servicio principal no está disponible.',
            level: 'Beginner',
            totalSessions: 1,
            sessions: [{
                id: 'session-mock-1',
                sessionNumber: 1,
                title: 'Entrenamiento de Ejemplo',
                type: 'mixed',
                mainWorkout: [
                    { id: 'ex-mock-1', name: 'Sentadillas (Squats)', sets: 3, reps: '12-15' },
                    { id: 'ex-mock-2', name: 'Flexiones (Push-ups)', sets: 3, reps: '8-12' },
                ]
            }]
        }
    };
};