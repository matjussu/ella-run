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

// API Configuration pour AI Workout Planner
const RAPIDAPI_CONFIG = {
  headers: {
    'X-RapidAPI-Key': process.env.REACT_APP_RAPIDAPI_KEY,
    'X-RapidAPI-Host': 'ai-workout-planner-exercise-fitness-nutrition-guide.p.rapidapi.com',
    'Content-Type': 'application/json'
  }
};

// URL des endpoints de l'API (basés sur la documentation trouvée)
const API_BASE_URL = 'https://ai-workout-planner-exercise-fitness-nutrition-guide.p.rapidapi.com/workoutplan';
const ENDPOINTS = {
  WORKOUT_PLANNER: '/generateWorkoutPlan', // Endpoint probable pour générer un plan
  AI_WORKOUT: '/ai-workout', // Endpoint alternatif
  BODY_PARTS: '/body-parts',
  EQUIPMENT: '/equipment'
};

// Validate required environment variables
const validateEnvironmentVariables = () => {
  const requiredVars = ['REACT_APP_RAPIDAPI_KEY'];
  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }
};

/**
 * Teste la connectivité avec l'API AI Workout Planner
 */
export const testApiConnection = async () => {
  try {
    validateEnvironmentVariables();
    
    console.log('🔍 Test de connectivité avec l\'API...');
    
    // Essayer d'abord l'endpoint racine pour voir si l'API répond
    const response = await axios.get(`${API_BASE_URL}/`, RAPIDAPI_CONFIG);
    
    console.log('✅ API accessible - Statut:', response.status);
    console.log('📋 Réponse:', response.data);
    
    return {
      success: true,
      data: response.data,
      status: response.status
    };
    
  } catch (error) {
    console.log('❌ Test de connectivité échoué:', error.response?.status, error.message);
    return {
      success: false,
      error: error.message,
      status: error.response?.status
    };
  }
};

/**
 * Génère un plan d'entraînement personnalisé en utilisant l'API AI Workout Planner de RapidAPI
 * Fonction modifiée pour essayer différents endpoints possibles
 */
export const generateWorkoutPlan = async () => {
  try {
    // Validation des variables d'environnement
    validateEnvironmentVariables();

    console.log('🔥 Appel à l\'API AI Workout Planner...');

    // D'abord, tester la connectivité de base
    const connectionTest = await testApiConnection();
    if (!connectionTest.success) {
      throw new Error(`API non accessible: ${connectionTest.error}`);
    }

    // Paramètres pour la requête GET (convertis en query parameters)
    const queryParams = {
      fitness_level: "beginner",
      goal: "running endurance,strength training",
      targetMuscles: "full body,squats,abs",
      sessionsPerWeek: 3,
      sessionDurationMinutes: 50,
      language: "fr"
    };

    console.log('📊 Paramètres de la requête:', queryParams);

    // Liste des endpoints à essayer (basés sur des APIs similaires)
    const endpointsToTry = [
      '/exercises', // Liste des exercices disponibles
      '/bodyparts', // Parties du corps
      '/equipment', // Équipements disponibles
      '/workout', // Plans d'entraînement
      '/generate', // Génération de plan
      '/plan', // Plan d'entraînement
      '/ai-workout-planner', // Nom complet de l'API
      '/workouts' // Version plurielle
    ];

    let lastError = null;
    let successfulEndpoint = null;

    // Essayer chaque endpoint
    for (const endpoint of endpointsToTry) {
      try {
        console.log(`🎯 Essai de l'endpoint: ${endpoint}`);
        
        const url = `${API_BASE_URL}${endpoint}`;
        const response = await axios.get(url, {
          ...RAPIDAPI_CONFIG,
          params: endpoint === '/exercises' || endpoint === '/bodyparts' || endpoint === '/equipment' 
            ? {} // Pas de paramètres pour les endpoints de liste
            : queryParams
        });

        console.log('✅ Réponse reçue de l\'API avec l\'endpoint:', endpoint);
        console.log('📋 Données reçues:', response.data);

        successfulEndpoint = endpoint;

        // Si on obtient des données d'exercices, on peut construire un plan basique
        if (endpoint === '/exercises' && Array.isArray(response.data)) {
          const customPlan = createWorkoutFromExercises(response.data);
          return {
            success: true,
            data: customPlan,
            source: 'exercises_endpoint'
          };
        }

        // Sinon, essayer de mapper la réponse
        const mappedData = mapApiResponseToAppStructure(response.data);
        return {
          success: true,
          data: mappedData,
          source: endpoint
        };

      } catch (endpointError) {
        console.log(`❌ Endpoint ${endpoint} failed:`, endpointError.response?.status || endpointError.message);
        lastError = endpointError;
        continue; // Essayer le prochain endpoint
      }
    }

    // Si tous les endpoints ont échoué, lever la dernière erreur
    throw lastError;

  } catch (error) {
    console.error('❌ Erreur lors de l\'appel API (tous endpoints):', error);
    
    let errorMessage = 'Échec de la génération du plan d\'entraînement depuis l\'API.';
    
    if (error.response) {
      errorMessage += ` Status: ${error.response.status}`;
      if (error.response.status === 404) {
        errorMessage += ' - Endpoints non trouvés.';
      } else if (error.response.status === 403) {
        errorMessage += ' - Accès interdit. Vérifiez votre clé API.';
      }
    } else if (error.request) {
      errorMessage += ' Problème de réseau.';
    }

    // Retourner une erreur avec suggestion de fallback
    return {
      success: false,
      error: errorMessage,
      suggestion: 'Utilisation du système de fallback (service Ella) recommandée.'
    };
  }
};

/**
 * Mappe la réponse de l'API vers la structure de données de l'application
 * @param {Object} apiResponse - Réponse de l'API
 * @returns {Object} - Données mappées selon la structure de l'application
 */
const mapApiResponseToAppStructure = (apiResponse) => {
  // L'API peut retourner les données directement ou dans un objet "data"
  const data = apiResponse.data || apiResponse;
  
  return {
    id: generateWorkoutId(),
    title: data.plan_title || data.title || "Programme Débutant Course & Force",
    description: data.plan_description || data.description || "Un plan pour développer votre endurance et votre force.",
    totalSessions: data.weekly_sessions || data.totalSessions || data.sessions?.length || 3,
    level: capitalizeFirstLetter(data.difficulty || data.level) || "Beginner",
    estimatedDuration: data.sessionDurationMinutes || data.estimatedDuration || 50,
    sessions: (data.sessions || []).map(mapSession)
  };
};

/**
 * Mappe une session de l'API vers la structure de l'application
 * @param {Object} session - Session de l'API
 * @returns {Object} - Session mappée
 */
const mapSession = (session) => {
  return {
    id: `session_${session.day}`,
    sessionNumber: session.day,
    title: session.session_title || `Session ${session.day}`,
    type: capitalizeFirstLetter(session.session_focus) || "Mixed",
    warmup: session.warm_up ? session.warm_up.map((exercise, index) => mapExercise(exercise, index, 'warmup')) : [],
    mainWorkout: session.main_exercises ? session.main_exercises.map((exercise, index) => mapExercise(exercise, index, 'main')) : [],
    cooldown: session.cool_down ? session.cool_down.map((exercise, index) => mapExercise(exercise, index, 'cooldown')) : []
  };
};

/**
 * Mappe un exercice de l'API vers la structure de l'application
 * @param {Object} exercise - Exercice de l'API
 * @param {number} index - Index de l'exercice
 * @param {string} type - Type d'exercice (warmup, main, cooldown)
 * @returns {Object} - Exercice mappé
 */
const mapExercise = (exercise, index, type) => {
  const exerciseData = {
    id: `ex_${type}_${index + 1}`,
    name: exercise.exercise_name || `Exercice ${index + 1}`
  };

  // Gestion de la durée (conversion secondes vers minutes)
  if (exercise.duration_seconds) {
    exerciseData.duration = Math.round(exercise.duration_seconds / 60 * 10) / 10; // Arrondi à 1 décimale
  }

  // Gestion des sets et reps
  if (exercise.sets) {
    exerciseData.sets = exercise.sets;
  }
  if (exercise.reps) {
    exerciseData.reps = exercise.reps;
  }

  return exerciseData;
};

/**
 * Met en majuscule la première lettre d'une chaîne
 * @param {string} str - Chaîne à transformer
 * @returns {string} - Chaîne avec première lettre en majuscule
 */
const capitalizeFirstLetter = (str) => {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Génère un ID unique pour un plan d'entraînement
 */
const generateWorkoutId = () => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `workout-${timestamp}-${random}`;
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