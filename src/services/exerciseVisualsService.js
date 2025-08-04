/**
 * Exercise Visuals Service
 * 
 * Provides visual guides (images/videos) for common bodyweight and running exercises.
 * Uses placeholder URLs for now - can be replaced with actual exercise media.
 */

// Map of exercise names to visual content
const EXERCISE_VISUALS = {
  // Running exercises
  "course à pied": {
    image: "https://via.placeholder.com/400x300/ff69b4/ffffff?text=Course+%C3%A0+Pied",
    description: "Position de course avec bonne posture"
  },
  "jogging": {
    image: "https://via.placeholder.com/400x300/ff69b4/ffffff?text=Jogging",
    description: "Jogging à rythme modéré"
  },
  "marche rapide": {
    image: "https://via.placeholder.com/400x300/ff69b4/ffffff?text=Marche+Rapide",
    description: "Marche rapide avec mouvement des bras"
  },
  "sprint": {
    image: "https://via.placeholder.com/400x300/ff69b4/ffffff?text=Sprint",
    description: "Course rapide avec technique optimale"
  },

  // Bodyweight exercises - Upper body
  "pompes": {
    image: "https://via.placeholder.com/400x300/ff69b4/ffffff?text=Pompes",
    description: "Position de pompe avec alignement correct",
    instructions: [
      "Position planche, mains à largeur d'épaules",
      "Corps aligné de la tête aux pieds", 
      "Descendre en contrôlant jusqu'à effleurer le sol",
      "Remonter en poussant fermement"
    ]
  },
  "pompes genoux": {
    image: "https://via.placeholder.com/400x300/ff69b4/ffffff?text=Pompes+Genoux",
    description: "Pompes modifiées sur les genoux"
  },
  "dips": {
    image: "https://via.placeholder.com/400x300/ff69b4/ffffff?text=Dips",
    description: "Dips sur chaise ou banc"
  },

  // Bodyweight exercises - Lower body  
  "squats": {
    image: "https://via.placeholder.com/400x300/ff69b4/ffffff?text=Squats",
    description: "Squat avec technique parfaite",
    instructions: [
      "Pieds écartés largeur d'épaules",
      "Descendre comme pour s'asseoir sur une chaise",
      "Genoux dans l'axe des pieds",
      "Remonter en poussant sur les talons"
    ]
  },
  "fentes": {
    image: "https://via.placeholder.com/400x300/ff69b4/ffffff?text=Fentes",
    description: "Fente avant avec bon alignement",
    instructions: [
      "Grand pas vers l'avant",
      "Descendre en fléchissant les deux genoux",
      "Genou avant au-dessus de la cheville",
      "Remonter et alterner"
    ]
  },
  "saut de squats": {
    image: "https://via.placeholder.com/400x300/ff69b4/ffffff?text=Jump+Squats",
    description: "Squat avec saut explosif"
  },

  // Core exercises
  "planche": {
    image: "https://via.placeholder.com/400x300/ff69b4/ffffff?text=Planche",
    description: "Position de planche parfaite",
    instructions: [
      "Appui sur avant-bras et pointes de pieds",
      "Corps parfaitement aligné",
      "Serrer les abdos et les fessiers",
      "Respirer normalement"
    ]
  },
  "crunch": {
    image: "https://via.placeholder.com/400x300/ff69b4/ffffff?text=Crunch",
    description: "Crunch abdominal contrôlé"
  },
  "mountain climbers": {
    image: "https://via.placeholder.com/400x300/ff69b4/ffffff?text=Mountain+Climbers",
    description: "Mountain climbers dynamiques"
  },
  "élévation bassin": {
    image: "https://via.placeholder.com/400x300/ff69b4/ffffff?text=Hip+Bridge",
    description: "Pont fessier avec contraction"
  },

  // Stretching
  "étirements": {
    image: "https://via.placeholder.com/400x300/ff69b4/ffffff?text=Etirements",
    description: "Étirements complets post-entraînement"
  }
};

/**
 * Get visual content for an exercise
 * @param {string} exerciseName - Name of the exercise
 * @returns {Object} Visual content object or null
 */
export const getExerciseVisual = (exerciseName) => {
  if (!exerciseName) return null;
  
  // Normalize exercise name for matching
  const normalizedName = exerciseName.toLowerCase().trim();
  
  // Direct match
  if (EXERCISE_VISUALS[normalizedName]) {
    return EXERCISE_VISUALS[normalizedName];
  }
  
  // Partial match for similar exercises
  for (const [key, visual] of Object.entries(EXERCISE_VISUALS)) {
    if (normalizedName.includes(key) || key.includes(normalizedName)) {
      return visual;
    }
  }
  
  // Default fallback visual
  return {
    image: "https://via.placeholder.com/400x300/ff69b4/ffffff?text=Exercice",
    description: "Guide visuel pour cet exercice"
  };
};

/**
 * Get all available exercise visuals
 * @returns {Object} All exercise visuals
 */
export const getAllExerciseVisuals = () => {
  return EXERCISE_VISUALS;
};

/**
 * Check if an exercise has visual content
 * @param {string} exerciseName - Name of the exercise
 * @returns {boolean} True if visual content exists
 */
export const hasExerciseVisual = (exerciseName) => {
  return getExerciseVisual(exerciseName) !== null;
};

export default {
  getExerciseVisual,
  getAllExerciseVisuals,
  hasExerciseVisual
};