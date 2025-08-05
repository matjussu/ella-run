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

// URL de base de l'API
const API_BASE_URL = 'https://ai-workout-planner-exercise-fitness-nutrition-guide.p.rapidapi.com';

// Validate required environment variables
const validateEnvironmentVariables = () => {
  const requiredVars = ['REACT_APP_RAPIDAPI_KEY'];
  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }
};


/**
 * Génère un plan d'entraînement personnalisé en utilisant l'API AI Workout Planner de RapidAPI
 * Fonction basée sur la documentation officielle de l'API
 * @param {Object} profileData - Données du profil utilisateur (optionnel)
 */
export const generateWorkoutPlan = async (profileData = null) => {
  try {
    // Validation des variables d'environnement
    validateEnvironmentVariables();

    console.log('🔥 Appel à l\'API AI Workout Planner...');
    console.log('👤 Profile data provided:', profileData);
    
    // Test API availability first
    if (!process.env.REACT_APP_RAPIDAPI_KEY || process.env.REACT_APP_RAPIDAPI_KEY === 'your-rapidapi-key-here') {
      console.warn('⚠️ RapidAPI key not configured, using fallback service');
      return await getFallbackWorkout(profileData);
    }

    // Mapper les données du profil vers les paramètres de l'API
    const getGoalsFromProfile = (goals) => {
      const goalMapping = {
        'weight_loss': 'Lose weight',
        'muscle_gain': 'Build muscle', 
        'endurance': 'Build endurance',
        'strength': 'Build strength',
        'flexibility': 'Improve flexibility',
        'general_fitness': 'General fitness'
      };
      return goals?.map(g => goalMapping[g] || g).join(' and ') || "Build endurance and strength";
    };

    const getFitnessLevel = (level) => {
      const levelMapping = {
        'débutante': 'Beginner',
        'intermédiaire': 'Intermediate', 
        'avancée': 'Advanced'
      };
      return levelMapping[level] || 'Beginner';
    };

    const getEquipmentList = (equipment) => {
      const equipmentMapping = {
        'none': 'No equipment needed',
        'dumbbells': 'Dumbbells',
        'resistance_bands': 'Resistance bands',
        'kettlebells': 'Kettlebells',
        'barbell': 'Barbell',
        'pull_up_bar': 'Pull-up bar',
        'yoga_mat': 'Yoga mat',
        'bench': 'Bench',
        'cardio_machine': 'Cardio equipment'
      };
      return equipment?.map(eq => equipmentMapping[eq] || eq) || ['No equipment needed'];
    };

    const getWorkoutTypes = (preferences) => {
      const typeMapping = {
        'hiit': 'HIIT',
        'strength_training': 'Strength training',
        'cardio': 'Cardio',
        'yoga': 'Yoga',
        'pilates': 'Pilates',
        'bodyweight': 'Bodyweight exercises',
        'stretching': 'Stretching',
        'functional': 'Functional training',
        'dance': 'Dance fitness'
      };
      return preferences?.map(p => typeMapping[p] || p) || ['Running', 'Bodyweight exercises'];
    };

    // Corps de la requête selon la documentation officielle
    // Utilise les données du profil si disponibles, sinon des valeurs par défaut
    const requestBody = {
      goal: profileData ? getGoalsFromProfile(profileData.goals) : "Build endurance and strength",
      fitness_level: profileData ? getFitnessLevel(profileData.level) : "Beginner",
      preferences: profileData ? [...getWorkoutTypes(profileData.preferences), "Cardio"] : ["Running", "Bodyweight exercises", "Cardio"],
      health_conditions: ["None"],
      equipment_available: profileData ? getEquipmentList(profileData.equipment) : ["No equipment needed"],
      exercise_types: profileData ? getWorkoutTypes(profileData.preferences) : ["Running", "Bodyweight", "Calisthenics"],
      schedule: {
        days_per_week: profileData?.sessionsPerWeek || 3,
        session_duration: profileData?.sessionDuration || 45
      },
      plan_duration_weeks: 4,
      lang: "fr"
    };

    console.log('📊 Corps de la requête:', requestBody);

    // Appel POST à l'endpoint officiel
    const response = await axios.post(
      `${API_BASE_URL}/generateWorkoutPlan`,
      requestBody,
      RAPIDAPI_CONFIG
    );

    console.log('✅ Réponse reçue de l\'API:', response.data);

    // Mapper la réponse vers la structure de l'application
    const mappedData = mapApiResponseToAppStructure(response.data);
    
    return {
      success: true,
      data: mappedData,
      source: 'rapidapi_official_endpoint'
    };

  } catch (error) {
    console.error('❌ Erreur lors de l\'appel API:', error);
    
    let errorMessage = 'Échec de la génération du plan d\'entraînement depuis l\'API.';
    
    if (error.response) {
      errorMessage += ` Status: ${error.response.status}`;
      if (error.response.status === 404) {
        errorMessage += ' - Endpoint non trouvé.';
      } else if (error.response.status === 403) {
        errorMessage += ' - Accès interdit. Vérifiez votre clé API.';
      } else if (error.response.status === 401) {
        errorMessage += ' - Clé API invalide.';
      }
    } else if (error.request) {
      errorMessage += ' Problème de réseau.';
    } else {
      errorMessage += ` Erreur: ${error.message}`;
    }

    // Use fallback service on API failure
    console.warn('⚠️ API failed, using fallback service');
    return await getFallbackWorkout(profileData);
  }
};

/**
 * Fallback workout generator using Ella's personalized service
 * @param {Object} profileData - User profile data
 */
const getFallbackWorkout = async (profileData) => {
  try {
    // Import Ella service dynamically to avoid circular dependencies
    const { generateEllaWorkout } = await import('./ellaWorkoutService');
    
    console.log('🎯 Using Ella\'s personalized workout service as fallback');
    const ellaResult = await generateEllaWorkout(profileData);
    
    if (ellaResult.success) {
      return {
        success: true,
        data: ellaResult.data,
        source: 'ella_personalized_service',
        message: 'Entraînement généré par le service personnalisé d\'Ella'
      };
    } else {
      // Final fallback to mock data
      return getMockWorkoutPlan();
    }
  } catch (error) {
    console.error('❌ Fallback service also failed:', error);
    // Return mock data as final fallback
    return getMockWorkoutPlan();
  }
};

/**
 * Mappe la réponse de l'API vers la structure de données de l'application
 * @param {Object} apiResponse - Réponse de l'API
 * @returns {Object} - Données mappées selon la structure de l'application
 */
const mapApiResponseToAppStructure = (apiResponse) => {
  // Extraction des données selon la structure officielle de l'API
  const result = apiResponse.result || apiResponse;
  
  console.log('🔄 Mapping API response:', apiResponse);
  console.log('📊 Result extracted:', result);
  console.log('💪 Exercises found:', result.exercises);
  
  // Créer les sessions basées sur les exercices reçus
  const sessions = (result.exercises || []).map((exercise, index) => mapExerciseToSession(exercise, index + 1));
  
  console.log('📋 Sessions mapped:', sessions);
  
  return {
    id: generateWorkoutId(),
    title: result.seo_title || result.goal || "Programme d'entraînement personnalisé",
    description: result.seo_content || `Plan de ${result.total_weeks || 4} semaines pour ${result.goal || 'améliorer votre forme'}`,
    totalSessions: result.schedule?.days_per_week || 3,
    level: capitalizeFirstLetter(result.fitness_level) || "Beginner",
    estimatedDuration: result.schedule?.session_duration || 45,
    sessions: sessions
  };
};

/**
 * Mappe un exercice de l'API vers une session de l'application
 * @param {Object} exercise - Données d'un exercice
 * @param {number} sessionNumber - Numéro de la session
 * @returns {Object} - Session mappée
 */
const mapExerciseToSession = (exercise, sessionNumber) => {
  console.log(`🏋️ Mapping exercise ${sessionNumber}:`, exercise);
  
  return {
    id: `session_${sessionNumber}`,
    sessionNumber: sessionNumber,
    title: `Session ${sessionNumber} - ${exercise.name || 'Entraînement'}`,
    type: exercise.type || "Mixed",
    description: exercise.description || `Entraînement de la session ${sessionNumber}`,
    warmup: [], // L'API ne sépare pas warmup/main/cooldown
    mainWorkout: [mapApiExercise(exercise, 0)], // Chaque exercice devient un exercice principal
    cooldown: []
  };
};

/**
 * Mappe un exercice de l'API vers la structure de l'application
 * @param {Object} exercise - Exercice de l'API selon la structure officielle
 * @param {number} index - Index de l'exercice
 * @returns {Object} - Exercice mappé
 */
const mapApiExercise = (exercise, index) => {
  console.log(`🎯 Mapping individual exercise ${index}:`, exercise);
  
  const exerciseData = {
    id: `ex_api_${index + 1}_${Date.now()}`,
    name: exercise.name || exercise.exercise || `Exercice ${index + 1}`,
    description: exercise.description || exercise.instructions || '',
    type: exercise.type || exercise.category || 'Mixed'
  };

  // Mapping des champs selon la documentation
  if (exercise.duration) {
    // Conversion si la durée est au format "20 minutes"
    const durationMatch = exercise.duration.toString().match(/(\d+)/);
    exerciseData.duration = durationMatch ? parseInt(durationMatch[1]) : exercise.duration;
  }

  if (exercise.sets || exercise.set) {
    exerciseData.sets = exercise.sets || exercise.set;
  }

  if (exercise.repetitions || exercise.reps || exercise.rep) {
    const reps = exercise.repetitions || exercise.reps || exercise.rep;
    if (reps !== "N/A" && reps !== "null") {
      exerciseData.reps = reps;
    }
  }

  if (exercise.equipment && exercise.equipment !== "None") {
    exerciseData.equipment = exercise.equipment;
  }

  // Ajouter les instructions détaillées
  exerciseData.instructions = [];
  
  if (exercise.instructions) {
    if (typeof exercise.instructions === 'string') {
      exerciseData.instructions = exercise.instructions.split('.').filter(i => i.trim());
    } else if (Array.isArray(exercise.instructions)) {
      exerciseData.instructions = exercise.instructions;
    }
  }
  
  // Si pas d'instructions, en générer
  if (exerciseData.instructions.length === 0) {
    exerciseData.instructions.push(`Effectuez ${exerciseData.name}`);
    if (exerciseData.sets && exerciseData.reps) {
      exerciseData.instructions.push(`${exerciseData.sets} séries de ${exerciseData.reps} répétitions`);
    }
    if (exerciseData.duration) {
      exerciseData.instructions.push(`Durée : ${exerciseData.duration} minutes`);
    }
    if (exerciseData.equipment) {
      exerciseData.instructions.push(`Équipement : ${exerciseData.equipment}`);
    }
  }

  // Ajouter des conseils si disponibles
  if (exercise.tips || exercise.advice) {
    exerciseData.tips = typeof exercise.tips === 'string' ? [exercise.tips] : exercise.tips;
  }

  console.log(`✅ Exercise mapped:`, exerciseData);
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