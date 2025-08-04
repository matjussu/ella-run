/**
 * Personalization Service
 * 
 * Creates dynamic, personalized content based on user profile data
 * Handles motivational messages, workout recommendations, and adaptive UI
 */

import { userProfileService } from './userProfileService';

/**
 * Generate personalized greeting based on user profile and time
 */
export const getPersonalizedGreeting = (profile) => {
  const hour = new Date().getHours();
  const day = new Date().toLocaleDateString('fr-FR', { weekday: 'long' });
  const userName = profile?.personalInfo?.name || 'Utilisateur';
  
  let timeGreeting;
  if (hour < 12) timeGreeting = 'Bonjour';
  else if (hour < 17) timeGreeting = 'Bon après-midi';
  else timeGreeting = 'Bonsoir';
  
  const personalizedGreetings = [
    `${timeGreeting}, ${userName} ! Prête pour un super ${day} ? 🌟`,
    `${timeGreeting} ma championne ${userName} ! C'est parti pour une journée incroyable ! ✨`,
    `Salut ${userName} ! Ce ${day} va être fantastique ! 💪`,
    `${timeGreeting}, ${userName} ! Tu vas briller aujourd'hui ! 🔥`
  ];

  const greetingIndex = Math.floor(Math.random() * personalizedGreetings.length);
  return personalizedGreetings[greetingIndex];
};

/**
 * Generate motivational messages based on user progress and goals
 */
export const getPersonalizedMotivation = (profile, progress) => {
  const userName = profile?.personalInfo?.name || 'Championne';
  const goals = profile?.fitnessProfile?.goals || [];
  const level = profile?.fitnessProfile?.level || 'débutante';
  
  const motivationalMessages = {
    general: [
      `${userName}, chaque pas en avant est une victoire ! 🎯`,
      `Tu es plus forte que tu ne le penses, ${userName} ! 💪`,
      `${userName}, ta détermination est inspirante ! Continue ! ✨`,
      `Bravo ${userName} ! Tu construis la meilleure version de toi-même ! 🌟`
    ],
    
    course_à_pied: [
      `${userName}, chaque foulée te rapproche de tes objectifs ! 🏃‍♀️`,
      `Tu cours vers ton succès, ${userName} ! Garde le rythme ! ⚡`,
      `${userName}, ta passion pour la course est contagieuse ! 🔥`
    ],
    
    renforcement_musculaire: [
      `${userName}, tu deviens plus forte à chaque répétition ! 💪`,
      `Ta force grandit chaque jour, ${userName} ! C'est impressionnant ! 🔥`,
      `${userName}, tu sculptes ton corps et ton mental ! Fantastique ! ✨`
    ],
    
    perte_de_poids: [
      `${userName}, chaque effort compte dans ton parcours ! 🎯`,
      `Tu transformes ton corps avec brio, ${userName} ! 🌟`,
      `${userName}, ta persévérance paie ! Continue sur cette lancée ! 💪`
    ]
  };

  // Choose message based on user's primary goal
  let selectedMessages = motivationalMessages.general;
  if (goals.length > 0 && motivationalMessages[goals[0]]) {
    selectedMessages = motivationalMessages[goals[0]];
  }

  // Add progress-based messages
  if (progress && progress.completionRate > 80) {
    selectedMessages.push(`${userName}, ton taux de réussite de ${progress.completionRate}% est exceptionnel ! 🏆`);
  }

  if (progress && progress.streak > 3) {
    selectedMessages.push(`${userName}, ${progress.streak} jours de suite ! Tu es incroyable ! 🔥`);
  }

  const messageIndex = Math.floor(Math.random() * selectedMessages.length);
  return selectedMessages[messageIndex];
};

/**
 * Generate personalized workout recommendations
 */
export const getPersonalizedWorkoutSuggestion = (profile) => {
  const dayOfWeek = new Date().getDay();
  const goals = profile?.fitnessProfile?.goals || [];
  const targetAreas = profile?.fitnessProfile?.targetAreas || [];
  const level = profile?.fitnessProfile?.level || 'débutante';
  
  const workoutSuggestions = {
    1: { // Lundi - Start strong
      title: "💪 Démarrage Puissant",
      description: "Commence ta semaine en force !",
      focus: goals.includes('renforcement_musculaire') ? 'Force & Endurance' : 'Cardio Dynamique',
      emoji: "🔥"
    },
    2: { // Mardi
      title: "⚡ Mardi Tonique",
      description: "Parfait pour travailler tes zones ciblées !",
      focus: targetAreas.includes('abdos') ? 'Core & Stabilité' : 'Corps Entier',
      emoji: "💎"
    },
    3: { // Mercredi
      title: "🏃‍♀️ Mercredi Cardio",
      description: "Milieu de semaine, on maintient le rythme !",
      focus: goals.includes('course_à_pied') ? 'Course & Cardio' : 'Mixte Énergisant',
      emoji: "⚡"
    },
    4: { // Jeudi
      title: "🎯 Jeudi Précision",
      description: "Focus sur la technique et la progression !",
      focus: targetAreas.includes('squats') ? 'Squats & Fessiers' : 'Renforcement',
      emoji: "🎯"
    },
    5: { // Vendredi
      title: "🎉 Vendredi Victoire",
      description: "Termine la semaine en beauté !",
      focus: 'Entraînement Complet',
      emoji: "✨"
    },
    6: { // Samedi
      title: "🌟 Weekend Actif",
      description: "Profite du weekend pour bouger !",
      focus: level === 'débutante' ? 'Douceur & Mobilité' : 'Challenge Weekend',
      emoji: "🌈"
    },
    0: { // Dimanche
      title: "💫 Dimanche Zen",
      description: "Une séance douce pour bien finir la semaine !",
      focus: 'Récupération Active',
      emoji: "🧘‍♀️"
    }
  };

  return workoutSuggestions[dayOfWeek] || workoutSuggestions[1];
};

/**
 * Generate personalized achievements and milestones
 */
export const getPersonalizedAchievements = (profile, progress) => {
  const userName = profile?.personalInfo?.name || 'Championne';
  const achievements = [];

  if (progress) {
    // Completion rate achievements
    if (progress.completionRate >= 90) {
      achievements.push({
        id: 'completion_master',
        title: 'Maître de la Régularité',
        description: `${userName}, ${progress.completionRate}% de réussite ! Tu es un modèle !`,
        icon: '🏆',
        color: 'gold'
      });
    } else if (progress.completionRate >= 75) {
      achievements.push({
        id: 'consistency_champion',
        title: 'Championne de la Constance',
        description: `${progress.completionRate}% de réussite, ${userName} ! Impressionnant !`,
        icon: '🥇',
        color: 'silver'
      });
    }

    // Streak achievements
    if (progress.streak >= 7) {
      achievements.push({
        id: 'week_warrior',
        title: 'Guerrière d\'une Semaine',
        description: `${progress.streak} jours consécutifs ! Tu es incroyable, ${userName} !`,
        icon: '🔥',
        color: 'orange'
      });
    }

    // Total sessions achievements
    if (progress.totalSessions >= 50) {
      achievements.push({
        id: 'session_master',
        title: 'Maître des Sessions',
        description: `${progress.totalSessions} entraînements ! Tu es une vraie athlète !`,
        icon: '💪',
        color: 'purple'
      });
    } else if (progress.totalSessions >= 25) {
      achievements.push({
        id: 'quarter_century',
        title: 'Quart de Siècle',
        description: `${progress.totalSessions} sessions ! Tu progresses à vitesse grand V !`,
        icon: '🚀',
        color: 'blue'
      });
    } else if (progress.totalSessions >= 10) {
      achievements.push({
        id: 'double_digits',
        title: 'Double Chiffres',
        description: `${progress.totalSessions} entraînements ! Tu prends le rythme !`,
        icon: '⭐',
        color: 'green'
      });
    }
  }

  // Goal-based achievements
  const goals = profile?.fitnessProfile?.goals || [];
  if (goals.includes('course_à_pied') && goals.includes('renforcement_musculaire')) {
    achievements.push({
      id: 'balanced_athlete',
      title: 'Athlète Équilibrée',
      description: `${userName}, cardio ET force ! Tu as tout compris !`,
      icon: '⚖️',
      color: 'pink'
    });
  }

  return achievements;
};

/**
 * Generate personalized health insights based on BMI and profile
 */
export const getPersonalizedHealthInsights = (profile) => {
  const insights = [];
  const bmi = profile?.personalInfo?.bmi;
  const userName = profile?.personalInfo?.name || 'Utilisateur';

  if (bmi) {
    if (bmi >= 18.5 && bmi < 25) {
      insights.push({
        type: 'success',
        title: 'IMC Parfait',
        message: `${userName}, ton IMC de ${bmi} est dans la fourchette idéale ! 🎯`,
        advice: 'Continue avec ton programme équilibré pour maintenir cette excellente forme !'
      });
    } else if (bmi < 18.5) {
      insights.push({
        type: 'info',
        title: 'Focus Renforcement',
        message: `${userName}, concentre-toi sur le développement musculaire ! 💪`,
        advice: 'Ajoute plus d\'exercices de renforcement et assure-toi d\'avoir une nutrition adaptée.'
      });
    } else if (bmi >= 25 && bmi < 30) {
      insights.push({
        type: 'warning',
        title: 'Équilibre Cardio-Force',
        message: `${userName}, combine cardio et renforcement pour optimiser ta composition ! ⚡`,
        advice: 'Varie tes entraînements entre cardio pour brûler et force pour tonifier.'
      });
    }
  }

  // Age-based insights
  const age = profile?.personalInfo?.age;
  if (age && age >= 40) {
    insights.push({
      type: 'info',
      title: 'Récupération Premium',
      message: `${userName}, la récupération devient encore plus importante ! 🧘‍♀️`,
      advice: 'N\'oublie pas les étirements et prends des jours de repos réguliers.'
    });
  }

  return insights;
};

/**
 * Generate personalized calorie estimates
 */
export const getPersonalizedCalorieEstimate = (profile, workoutType, duration) => {
  if (!profile?.personalInfo?.weight) return null;

  const weight = profile.personalInfo.weight;
  const age = profile.personalInfo.age || 25;
  const fitnessLevel = profile.fitnessProfile.level || 'débutante';

  // Adjust MET values based on fitness level
  const levelMultiplier = {
    'débutante': 0.8,
    'intermédiaire': 1.0,
    'avancée': 1.2
  };

  const baseMET = {
    'running': 8.0,
    'strength_training': 6.0,
    'cardio': 7.0,
    'mixed': 6.5,
    'yoga': 3.0,
    'walking': 3.5
  };

  const met = (baseMET[workoutType] || 6.5) * levelMultiplier[fitnessLevel];
  const caloriesPerMinute = (met * weight * 3.5) / 200;
  
  return Math.round(caloriesPerMinute * duration);
};

/**
 * Get all personalized content for dashboard
 */
export const getPersonalizedDashboardContent = async (profile, progress) => {
  return {
    greeting: getPersonalizedGreeting(profile),
    motivation: getPersonalizedMotivation(profile, progress),
    workoutSuggestion: getPersonalizedWorkoutSuggestion(profile),
    achievements: getPersonalizedAchievements(profile, progress),
    healthInsights: getPersonalizedHealthInsights(profile),
    userName: profile?.personalInfo?.name || 'Utilisateur'
  };
};

export default {
  getPersonalizedGreeting,
  getPersonalizedMotivation,
  getPersonalizedWorkoutSuggestion,
  getPersonalizedAchievements,
  getPersonalizedHealthInsights,
  getPersonalizedCalorieEstimate,
  getPersonalizedDashboardContent
};