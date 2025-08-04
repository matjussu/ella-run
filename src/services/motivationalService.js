/**
 * Motivational Service for Ella
 * 
 * This service provides personalized motivational messages, encouragement,
 * and affirmations specifically tailored for Ella's fitness journey.
 */

// Daily motivational messages for Ella
const DAILY_MOTIVATIONS = [
  "Bonjour ma belle ! Aujourd'hui est une nouvelle chance de devenir la version la plus forte de toi-même ! 💪✨",
  "Tu es capable de choses incroyables, Ella. Ta force grandit à chaque choix que tu fais ! 🌟",
  "Chaque entraînement est une victoire, chaque répétition est un progrès, chaque jour est un pas vers tes rêves ! 🎯",
  "Ton dévouement est inspirant, tes progrès sont réels, et ton avenir est radieux ! 🌈",
  "Les femmes fortes comme toi changent le monde en se changeant d'abord elles-mêmes. Continue de briller ! ✨",
  "Tu ne fais pas que te mettre en forme, tu deviens inarrêtable. Quel parcours incroyable ! 🚀",
  "Ton corps devient plus fort, ton esprit plus résistant, et ton âme s'élève ! 🦋",
  "Chaque squat te rend plus forte, chaque course te rend plus courageuse, chaque jour te rend plus incroyable ! 💖",
  "Tu as déjà prouvé que tu peux faire des choses difficiles. L'entraînement d'aujourd'hui n'est qu'une preuve de plus ! 🔥",
  "La femme qui commence son parcours fitness n'est pas la même que celle qui le termine. Tu te transformes ! 🌸",
  "Ta régularité est ton super-pouvoir, ta détermination est ta force ! 💎",
  "Tu ne fais pas que t'entraîner, tu travailles pour la vie que tu mérites ! 🎉",
  "Ton corps peut le faire. Ton esprit doit juste y croire. Et Ella, tu es si forte ! 🧠💪",
  "Chaque jour où tu choisis de prendre soin de toi est un jour où tu choisis de t'aimer ! 💕",
  "Tu construis plus que du muscle - tu construis la confiance, la force et un esprit incassable ! 🏗️✨"
];

// Phase-specific encouragement messages
const PHASE_ENCOURAGEMENTS = {
  PHASE_1: [
    "Commencer est la partie la plus difficile, et tu l'as déjà fait ! Tu es plus courageuse que tu ne le sais ! 🌟",
    "Ton corps apprend, ton esprit s'adapte, et tu fais un travail incroyable ! 💪",
    "Chaque débutante était une fois là où tu es maintenant. Tu es exactement où tu dois être ! 🎯",
    "Construire des habitudes prend du temps, mais tu te présentes déjà. C'est tout ! ⭐"
  ],
  PHASE_2: [
    "Regarde-toi gagner en confiance à chaque entraînement ! C'est magnifique à voir ! 💖",
    "Tu n'es plus la même personne qui a commencé ce parcours. La croissance te va bien ! 🌱",
    "Ta forme s'améliore, ta force se développe, et ton esprit brille ! ✨",
    "Tu as dépassé la partie la plus difficile - maintenant tu prends de l'élan ! 🚀"
  ],
  PHASE_3: [
    "Tes gains de force deviennent indéniables ! Tu devrais être si fière ! 🏆",
    "Tu es prête pour de plus grands défis parce que tu as prouvé que tu peux les gérer ! 💪",
    "Regarde comme ta confiance grandit avec ta force - c'est incroyable ! 🌟",
    "Tu ne survis pas seulement à tes entraînements, tu y prospères ! 🔥"
  ],
  PHASE_4: [
    "Tu es officiellement devenue forte ! Assume cette identité avec fierté ! 👑",
    "Ton endurance, ta force, ton dévouement - tout est impressionnant ! 🎖️",
    "Tu t'es prouvé de quoi tu es capable. Rêve plus grand ! 🚀",
    "Tu inspires tout le monde autour de toi juste en étant constamment incroyable ! ✨"
  ],
  PHASE_5: [
    "Tu t'es transformée en la femme forte et confiante que tu avais toujours en toi ! 🦸‍♀️",
    "Ton parcours est la preuve que la régularité et le dévouement créent des miracles ! 💫",
    "Tu es prête pour tout défi qui t'intéresse - le monde t'appartient ! 🌍",
    "Tu as construit une base de force qui te servira toute ta vie ! 🏗️💎"
  ]
};

// Workout-specific motivation
const WORKOUT_MOTIVATIONS = {
  running: [
    "Every step is a victory, every breath is strength, every mile is magic! 🏃‍♀️✨",
    "You're not just running - you're running toward your best self! 🎯",
    "Your legs are strong, your heart is powerful, your spirit is unstoppable! 💖",
    "Feel that rhythm, feel that power - that's your body getting stronger! 🎵💪",
    "You were born to move, built to run, meant to soar! Fly, Ella! 🦋"
  ],
  strength: [
    "Every rep is rebuilding you into someone stronger than yesterday! 💪",
    "Your muscles are learning, your body is adapting, your strength is growing! 🌱",
    "Squats for strength, abs for power, you for unstoppable! 🔥",
    "Feel that burn? That's weakness leaving your body! You're getting stronger! ⚡",
    "You're not lifting weights, you're lifting your entire life to a new level! 🚀"
  ],
  mixed: [
    "Cardio for endurance, strength for power, you for absolute amazing! 🌟",
    "Your body is becoming a masterpiece, sculpted by your dedication! 🎨",
    "Balance in training, balance in life - you're mastering both! ⚖️✨",
    "Every workout is a love letter to your future self! 💕",
    "You're building a body that can handle anything life throws at you! 🏗️💪"
  ]
};

// Achievement celebrations
const ACHIEVEMENT_CELEBRATIONS = {
  first_workout: "🎉 YOU DID IT! Your first workout is complete! This is the beginning of something incredible, Ella! 🌟",
  first_week: "🏆 One week of dedication! You're not just trying anymore - you're DOING! So proud of you! 💪",
  first_month: "🎊 ONE MONTH! Ella, you've officially created lasting change in your life. This is huge! 💖",
  first_continuous_run: "🏃‍♀️ YOU RAN WITHOUT STOPPING! Remember when that seemed impossible? Look at you now! ⭐",
  strength_milestone: "💪 Your strength gains are incredible! You're becoming the powerful woman you were meant to be! 🔥",
  consistency_streak: "📅 Your consistency is your superpower! Every day you show up for yourself is a victory! 🏅"
};

// Time-based greetings
const getTimeBasedGreeting = () => {
  const hour = new Date().getHours();
  const name = "Ella";
  
  if (hour < 6) {
    return `Early bird ${name}! Your dedication even shows in your timing! 🌅`;
  } else if (hour < 12) {
    return `Good morning, beautiful ${name}! Ready to make today amazing? ☀️`;
  } else if (hour < 17) {
    return `Good afternoon, ${name}! Perfect time to energize your day! 🌞`;
  } else if (hour < 21) {
    return `Good evening, ${name}! Time to unwind with some movement! 🌅`;
  } else {
    return `Evening warrior ${name}! Your commitment knows no boundaries! 🌙`;
  }
};

// Day-specific motivation
const getDaySpecificMotivation = () => {
  const days = [
    "Sunday: A new week starts tomorrow - prepare your mind and body for greatness! 🌟",
    "Monday: Monday Motivation! Set the tone for an incredible week, Ella! 💪",
    "Tuesday: Terrific Tuesday! Your consistency is building something beautiful! ✨",
    "Wednesday: Wednesday Warrior! You're halfway through another successful week! ⚡",
    "Thursday: Thursday Thunder! Your strength is growing with every passing day! 🔥",
    "Friday: Friday Finisher! End your week strong and proud of your progress! 🎉",
    "Saturday: Saturday Strength! Weekend warrior mode - you're unstoppable! 🚀"
  ];
  
  return days[new Date().getDay()];
};

// Export functions
export const getDailyMotivation = () => {
  const today = new Date().getDate();
  return DAILY_MOTIVATIONS[today % DAILY_MOTIVATIONS.length];
};

export const getPhaseEncouragement = (phase) => {
  const messages = PHASE_ENCOURAGEMENTS[phase] || PHASE_ENCOURAGEMENTS.PHASE_1;
  const randomIndex = Math.floor(Math.random() * messages.length);
  return messages[randomIndex];
};

export const getWorkoutMotivation = (workoutType) => {
  const type = workoutType.toLowerCase().includes('run') ? 'running' : 
               workoutType.toLowerCase().includes('strength') ? 'strength' : 'mixed';
  const messages = WORKOUT_MOTIVATIONS[type];
  const randomIndex = Math.floor(Math.random() * messages.length);
  return messages[randomIndex];
};

export const getAchievementCelebration = (achievementType) => {
  return ACHIEVEMENT_CELEBRATIONS[achievementType] || "🎉 Amazing achievement, Ella! You're becoming stronger every day! 💪✨";
};

export const getPersonalizedGreeting = () => {
  return getTimeBasedGreeting();
};

export const getTodaysMotivation = () => {
  return {
    greeting: getTimeBasedGreeting(),
    daily: getDailyMotivation(),
    daySpecific: getDaySpecificMotivation()
  };
};

// Random encouragement for any moment
export const getRandomEncouragement = () => {
  const encouragements = [
    "You're stronger than you think, Ella! 💪",
    "Every step forward is a victory! 🎯",
    "Your dedication is inspiring! ✨",
    "You've got this, beautiful! 💖",
    "Progress, not perfection! 🌟",
    "You're building something amazing! 🏗️",
    "Believe in your strength! 🔥",
    "You're becoming unstoppable! 🚀"
  ];
  
  const randomIndex = Math.floor(Math.random() * encouragements.length);
  return encouragements[randomIndex];
};

export default {
  getDailyMotivation,
  getPhaseEncouragement,
  getWorkoutMotivation,
  getAchievementCelebration,
  getPersonalizedGreeting,
  getTodaysMotivation,
  getRandomEncouragement
};