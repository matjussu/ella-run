/**
 * Enhanced Exercise Visuals Service
 * 
 * Provides visual guides with real images and videos for exercises.
 * Includes fallback placeholder system and improved matching.
 */

// Enhanced exercise visual database with real images and videos
const ENHANCED_EXERCISE_VISUALS = {
  // Running exercises
  "course": {
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop&q=80",
    video: "https://www.youtube.com/embed/wRkeBVMQSgg",
    description: "Course en extérieur avec technique naturelle",
    instructions: [
      "Maintenir une posture droite",
      "Atterrissage sur l'avant-pied", 
      "Cadence d'environ 180 pas/minute",
      "Respiration rythmée"
    ]
  },
  "course à pied": {
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop&q=80",
    video: "https://www.youtube.com/embed/wRkeBVMQSgg",
    description: "Course en extérieur avec technique naturelle"
  },
  "jogging": {
    image: "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=600&h=400&fit=crop&q=80",
    description: "Jogging à allure modérée",
    instructions: [
      "Allure confortable et conversationnelle",
      "Foulée naturelle", 
      "Bras détendus le long du corps"
    ]
  },
  "running": {
    image: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5e?w=600&h=400&fit=crop&q=80",
    video: "https://www.youtube.com/embed/brFHyOtTwH4",
    description: "Course à allure soutenue"
  },
  "sprint": {
    image: "https://images.unsplash.com/photo-1594736797933-d0dfaa4b7ef2?w=600&h=400&fit=crop&q=80",
    video: "https://www.youtube.com/embed/tkG5HVhbIWA",
    description: "Sprint avec technique de pointe"
  },
  "marche rapide": {
    image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&h=400&fit=crop&q=80",
    description: "Marche rapide avec mouvement actif des bras"
  },
  
  // Bodyweight exercises - Upper body
  "pompes": {
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop&q=80",
    video: "https://www.youtube.com/embed/IODxDxX7oi4",
    description: "Pompes classiques avec forme parfaite",
    instructions: [
      "Position planche, mains à largeur d'épaules",
      "Corps aligné de la tête aux pieds",
      "Descendre en contrôlant jusqu'à effleurer le sol", 
      "Remonter en poussant fermement"
    ]
  },
  "push ups": {
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop&q=80",
    video: "https://www.youtube.com/embed/IODxDxX7oi4",
    description: "Push-ups classiques"
  },
  "push-ups": {
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop&q=80",
    video: "https://www.youtube.com/embed/IODxDxX7oi4",
    description: "Push-ups classiques"
  },
  
  // Bodyweight exercises - Lower body
  "squats": {
    image: "https://images.unsplash.com/photo-1566241440091-ec10de8db2e1?w=600&h=400&fit=crop&q=80",
    video: "https://www.youtube.com/embed/YaXPRqUwItQ",
    description: "Squats avec technique parfaite",
    instructions: [
      "Pieds écartés largeur d'épaules",
      "Descendre comme pour s'asseoir sur une chaise",
      "Genoux dans l'axe des pieds",
      "Remonter en poussant sur les talons"
    ]
  },
  "squat": {
    image: "https://images.unsplash.com/photo-1566241440091-ec10de8db2e1?w=600&h=400&fit=crop&q=80",
    video: "https://www.youtube.com/embed/YaXPRqUwItQ",
    description: "Squats avec technique parfaite"
  },
  "fentes": {
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop&q=80",
    video: "https://www.youtube.com/embed/QOVaHwm-Q6U",
    description: "Fentes avant avec bon alignement",
    instructions: [
      "Grand pas vers l'avant",
      "Descendre en fléchissant les deux genoux", 
      "Genou avant au-dessus de la cheville",
      "Remonter et alterner"
    ]
  },
  "lunges": {
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop&q=80",
    video: "https://www.youtube.com/embed/QOVaHwm-Q6U",
    description: "Fentes avant avec bon alignement"
  },
  
  // Core exercises
  "planche": {
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop&q=80",
    video: "https://www.youtube.com/embed/pSHjTRCQxIw",
    description: "Position de planche pour renforcer le core",
    instructions: [
      "Position en appui sur les avant-bras",
      "Corps aligné des épaules aux chevilles",
      "Abdos contractés",
      "Respiration contrôlée"
    ]
  },
  "plank": {
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop&q=80",
    video: "https://www.youtube.com/embed/pSHjTRCQxIw",
    description: "Position de planche pour renforcer le core"
  },
  "abdos": {
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop&q=80",
    video: "https://www.youtube.com/embed/1fbU_MkV7NE",
    description: "Exercices d'abdominaux variés"
  },
  "crunches": {
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop&q=80",
    video: "https://www.youtube.com/embed/1fbU_MkV7NE",
    description: "Crunches abdominaux classiques"
  },
  
  // Cardio
  "jumping jacks": {
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop&q=80",
    video: "https://www.youtube.com/embed/2W4ZNSwoW_4",
    description: "Jumping jacks pour cardio et échauffement"
  },
  "saut étoile": {
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop&q=80",
    video: "https://www.youtube.com/embed/2W4ZNSwoW_4",
    description: "Saut étoile pour cardio et échauffement"
  },
  "burpees": {
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop&q=80",
    video: "https://www.youtube.com/embed/TU8QYVW0gDU",
    description: "Burpees - exercice complet intense",
    instructions: [
      "Position debout",
      "Squat + mains au sol",
      "Saut en position planche",
      "Pompe (optionnel)",
      "Retour squat + saut vertical"
    ]
  },
  
  // Flexibility/Stretching
  "étirements": {
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&h=400&fit=crop&q=80",
    description: "Étirements pour la récupération"
  },
  "stretching": {
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&h=400&fit=crop&q=80",
    description: "Étirements pour la récupération"
  }
};

// Keywords to help match exercise names
const EXERCISE_KEYWORDS = {
  running: ['course', 'courir', 'running', 'jogging', 'sprint'],
  pushups: ['pompes', 'push', 'up', 'ups'],  
  squats: ['squat', 'squats', 'flexion'],
  lunges: ['fente', 'fentes', 'lunge', 'lunges'],
  plank: ['planche', 'plank', 'gainage'],
  abs: ['abdos', 'abdo', 'crunch', 'crunches', 'abs'],
  cardio: ['jumping', 'jack', 'burpee', 'burpees', 'saut'],
  stretch: ['étirement', 'étirements', 'stretch', 'stretching']
};

/**
 * Get visual guide for an exercise
 * @param {string} exerciseName - Name of the exercise
 * @returns {Object|null} Visual guide object or null if not found
 */
export const getEnhancedExerciseVisual = (exerciseName) => {
  if (!exerciseName || typeof exerciseName !== 'string') {
    return createFallbackVisual(exerciseName);
  }

  const normalizedName = exerciseName.toLowerCase().trim();
  
  // Direct match first
  if (ENHANCED_EXERCISE_VISUALS[normalizedName]) {
    return ENHANCED_EXERCISE_VISUALS[normalizedName];
  }
  
  // Fuzzy matching with keywords
  for (const [category, keywords] of Object.entries(EXERCISE_KEYWORDS)) {
    if (keywords.some(keyword => normalizedName.includes(keyword))) {
      // Find first exercise in that category
      const matchingKey = Object.keys(ENHANCED_EXERCISE_VISUALS).find(key => 
        keywords.some(keyword => key.includes(keyword))
      );
      
      if (matchingKey) {
        return ENHANCED_EXERCISE_VISUALS[matchingKey];
      }
    }
  }
  
  // Partial string matching
  const partialMatch = Object.keys(ENHANCED_EXERCISE_VISUALS).find(key =>
    key.includes(normalizedName) || normalizedName.includes(key)
  );
  
  if (partialMatch) {
    return ENHANCED_EXERCISE_VISUALS[partialMatch];
  }
  
  // Return fallback
  return createFallbackVisual(exerciseName);
};

/**
 * Create a fallback visual for unknown exercises
 * @param {string} exerciseName - Name of the exercise
 * @returns {Object} Fallback visual object
 */
const createFallbackVisual = (exerciseName) => {
  const safeName = exerciseName ? encodeURIComponent(exerciseName) : 'Exercice';
  
  return {
    image: `https://via.placeholder.com/600x400/ff69b4/ffffff?text=${safeName}`,
    description: `Guide visuel pour ${exerciseName || 'cet exercice'}`,
    isFallback: true,
    instructions: [
      "Consultez un professionnel pour la technique correcte",
      "Échauffez-vous avant de commencer",
      "Respectez vos limites",
      "Maintenez une bonne forme tout au long de l'exercice"
    ]
  };
};

/**
 * Get all available exercise visuals
 * @returns {Object} All exercise visuals
 */
export const getAllExerciseVisuals = () => {
  return ENHANCED_EXERCISE_VISUALS;
};

/**
 * Check if an exercise has a video guide
 * @param {string} exerciseName - Name of the exercise
 * @returns {boolean} True if video is available
 */
export const hasVideoGuide = (exerciseName) => {
  const visual = getEnhancedExerciseVisual(exerciseName);
  return visual && visual.video && !visual.isFallback;
};

/**
 * Get just the video URL for an exercise
 * @param {string} exerciseName - Name of the exercise  
 * @returns {string|null} Video URL or null
 */
export const getExerciseVideo = (exerciseName) => {
  const visual = getEnhancedExerciseVisual(exerciseName);
  return visual && visual.video ? visual.video : null;
};

// Export the main function as default
export default getEnhancedExerciseVisual;