/**
 * Ella's Personalized Workout Service
 * 
 * This service creates progressive workout plans specifically designed for Ella's
 * fitness journey, goals, and preferences. All workouts are tailored to her
 * beginner level with focus on running endurance and strength building.
 */

// Ella's workout progression timeline (weeks)
const WORKOUT_PHASES = {
  PHASE_1: { weeks: [1, 2], level: 'Fondation Débutante' },
  PHASE_2: { weeks: [3, 4], level: 'Construction de Confiance' },
  PHASE_3: { weeks: [5, 6], level: 'Gain de Force' },
  PHASE_4: { weeks: [7, 8], level: 'Devenir Plus Forte' },
  PHASE_5: { weeks: [9, 10], level: 'Prête pour l\'Intermédiaire' }
};

// Calculate current phase based on start date
const getCurrentPhase = () => {
  const startDate = new Date('2024-08-01'); // Ella's start date
  const currentDate = new Date();
  const weeksSinceStart = Math.floor((currentDate - startDate) / (1000 * 60 * 60 * 24 * 7)) + 1;
  
  for (const [phase, info] of Object.entries(WORKOUT_PHASES)) {
    if (info.weeks.includes(weeksSinceStart)) {
      return { phase, weeksSinceStart, ...info };
    }
  }
  
  // Default to Phase 5 if beyond planned timeline
  return { phase: 'PHASE_5', weeksSinceStart, ...WORKOUT_PHASES.PHASE_5 };
};

// Generate workout ID
const generateWorkoutId = () => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 6);
  return `ella-workout-${timestamp}-${random}`;
};

// Ella's Motivational Messages by Phase
const getMotivationalMessage = (phase) => {
  const messages = {
    PHASE_1: "Tu fais tes premiers pas incroyables, Ella ! Chaque parcours commence par du courage, et tu en as tellement ! 💪✨",
    PHASE_2: "Regarde-toi construire cette confiance ! Tu es déjà plus forte qu'au début. Continue de briller ! 🌟",
    PHASE_3: "Ta force grandit chaque jour ! Peux-tu sentir à quel point tu es devenue capable ? Tu es incroyable ! 🔥",
    PHASE_4: "Wow, Ella ! Tu deviens si forte ! Ton dévouement inspire tous ceux qui t'entourent ! 💖",
    PHASE_5: "Tu es prête pour de plus grands défis maintenant ! Regarde le chemin parcouru - tu es absolument incroyable ! 🚀"
  };
  
  return messages[phase] || messages.PHASE_1;
};

// Progressive Running Plans
const getRunningPlan = (phase) => {
  const runningPlans = {
    PHASE_1: {
      warmup: [
        {
          id: 'warmup-walk',
          name: 'Marche Douce de 5 Minutes',
          duration: 5,
          description: 'Commence par un rythme de marche confortable pour échauffer ton corps',
          instructions: [
            'Commence par un rythme de marche naturel',
            'Concentre-toi sur une bonne posture - épaules en arrière, tête haute',
            'Respire naturellement et profondément',
            'Laisse ton corps se réveiller graduellement'
          ],
          tips: ['C\'est ton moment pour te préparer mentalement', 'Pas de précipitation - profite du moment']
        }
      ],
      mainWorkout: [
        {
          id: 'run-walk-intervals',
          name: 'Intervalles Course-Marche',
          duration: 20,
          description: 'Introduction douce à la course avec beaucoup de récupération',
          instructions: [
            '🏃‍♀️ Cours à un rythme confortable pendant 1 minute',
            '🚶‍♀️ Marche pendant 2 minutes pour récupérer',
            'Répète ce cycle 6-7 fois',
            'Écoute ton corps - c\'est normal de marcher plus si nécessaire'
          ],
          pattern: '1 min course / 2 min marche × 6-7 cycles',
          tips: [
            'Ton rythme de course devrait permettre une conversation',
            'Concentre-toi sur l\'atterrissage du milieu du pied, pas sur les talons',
            'Garde tes bras détendus et balance-les naturellement'
          ]
        }
      ],
      cooldown: [
        {
          id: 'cooldown-walk',
          name: 'Marche de Récupération de 5 Minutes',
          duration: 5,
          description: 'Retour graduel au repos avec une marche douce',
          instructions: [
            'Marche à un rythme plus lent que ton échauffement',
            'Concentre-toi sur une respiration profonde et contrôlée',
            'Laisse ton rythme cardiaque redescendre naturellement',
            'Sois fière de ce que tu viens d\'accomplir !'
          ]
        }
      ]
    },
    
    PHASE_2: {
      warmup: [
        {
          id: 'dynamic-warmup',
          name: '7-Minute Dynamic Warm-up',
          duration: 7,
          description: 'More active preparation as you get stronger',
          instructions: [
            '3 minutes comfortable walk',
            '2 minutes brisk walk',
            '2 minutes light marching with arm swings'
          ]
        }
      ],
      mainWorkout: [
        {
          id: 'improved-intervals',
          name: 'Extended Run Intervals',
          duration: 25,
          description: 'Building your running endurance step by step',
          instructions: [
            '🏃‍♀️ Run for 2 minutes at comfortable pace',
            '🚶‍♀️ Walk for 1.5 minutes recovery',
            'Repeat 7-8 cycles',
            'You\'re getting stronger, Ella!'
          ],
          pattern: '2 min run / 1.5 min walk × 7-8 cycles',
          tips: [
            'Notice how much easier this feels than week 1!',
            'Your breathing should be steady during runs',
            'Smile - you\'re doing amazing!'
          ]
        }
      ],
      cooldown: [
        {
          id: 'extended-cooldown',
          name: '8-Minute Recovery Walk',
          duration: 8,
          description: 'Extended recovery as your workouts get longer',
          instructions: [
            '5 minutes slow walk',
            '3 minutes gentle stretching while walking',
            'Hydrate and appreciate your progress'
          ]
        }
      ]
    },
    
    PHASE_3: {
      warmup: [
        {
          id: 'thorough-warmup',
          name: '10-Minute Complete Warm-up',
          duration: 10,
          description: 'Comprehensive preparation for longer runs',
          instructions: [
            '5 minutes progressive walk (slow to brisk)',
            '3 minutes light jogging',
            '2 minutes dynamic movements (leg swings, arm circles)'
          ]
        }
      ],
      mainWorkout: [
        {
          id: 'continuous-run-prep',
          name: 'Preparing for Continuous Running',
          duration: 30,
          description: 'Building toward running without walk breaks',
          instructions: [
            '🏃‍♀️ Run for 5 minutes at steady pace',
            '🚶‍♀️ Walk for 1 minute recovery',
            'Repeat 5 times',
            'You\'re so close to continuous running!'
          ],
          pattern: '5 min run / 1 min walk × 5 cycles',
          tips: [
            'Focus on maintaining a steady rhythm',
            'Your endurance is building beautifully',
            'Trust your body - it\'s adapting and getting stronger'
          ]
        }
      ],
      cooldown: [
        {
          id: 'recovery-walk-stretch',
          name: '10-Minute Cool Down & Stretch',
          duration: 10,
          description: 'Proper recovery for your harder-working body',
          instructions: [
            '5 minutes gradual walk down',
            '5 minutes gentle stretching',
            'Focus on calves, hamstrings, and quads'
          ]
        }
      ]
    },
    
    PHASE_4: {
      warmup: [
        {
          id: 'runner-warmup',
          name: '12-Minute Runner\'s Warm-up',
          duration: 12,
          description: 'Proper warm-up for a real runner (that\'s you, Ella!)',
          instructions: [
            '5 minutes brisk walk',
            '5 minutes easy jog',
            '2 minutes running drills (high knees, butt kicks)'
          ]
        }
      ],
      mainWorkout: [
        {
          id: 'continuous-running',
          name: 'Continuous Running Achievement!',
          duration: 20,
          description: 'You\'re ready to run continuously - you\'ve earned this!',
          instructions: [
            '🏃‍♀️ Run continuously for 15-20 minutes',
            'Maintain a pace where you could have a conversation',
            'If you need to slow down, slow down but keep running',
            'You\'re officially a runner now, Ella! 🎉'
          ],
          pattern: 'Continuous 15-20 minute run',
          tips: [
            'This is a HUGE milestone - be proud!',
            'Focus on your breathing rhythm',
            'Enjoy this incredible achievement!'
          ]
        }
      ],
      cooldown: [
        {
          id: 'complete-cooldown',
          name: '15-Minute Complete Recovery',
          duration: 15,
          description: 'Full recovery routine for your longer runs',
          instructions: [
            '5 minutes walk down',
            '10 minutes comprehensive stretching routine',
            'Hydrate and celebrate your success!'
          ]
        }
      ]
    },
    
    PHASE_5: {
      warmup: [
        {
          id: 'advanced-warmup',
          name: '15-Minute Advanced Warm-up',
          duration: 15,
          description: 'Elite preparation for your stronger body',
          instructions: [
            '5 minutes dynamic walk',
            '7 minutes progressive jog',
            '3 minutes running-specific movements'
          ]
        }
      ],
      mainWorkout: [
        {
          id: 'endurance-building',
          name: 'Building Real Endurance',
          duration: 35,
          description: 'You\'re ready for serious running now!',
          instructions: [
            '🏃‍♀️ Run continuously for 25-30 minutes',
            'Include 3×2 minute tempo increases',
            'Challenge yourself while staying controlled',
            'You\'re becoming the runner you dreamed of being!'
          ],
          pattern: '25-30 minutes continuous + tempo intervals',
          tips: [
            'You\'ve come so incredibly far!',
            'Your body is now trained and capable',
            'Dream bigger - you can achieve anything!'
          ]
        }
      ],
      cooldown: [
        {
          id: 'athlete-cooldown',
          name: '20-Minute Athlete Recovery',
          duration: 20,
          description: 'Professional recovery for a real athlete',
          instructions: [
            '5 minutes gradual walk down',
            '15 minutes full-body stretching and mobility',
            'Reflect on your incredible transformation'
          ]
        }
      ]
    }
  };
  
  return runningPlans[phase] || runningPlans.PHASE_1;
};

// Progressive Strength Plans (Squats & Abs Focus)
const getStrengthPlan = (phase) => {
  const strengthPlans = {
    PHASE_1: {
      warmup: [
        {
          id: 'gentle-movement',
          name: 'Gentle Body Activation',
          duration: 8,
          description: 'Wake up your muscles gently',
          instructions: [
            '2 minutes arm circles and shoulder rolls',
            '2 minutes gentle torso twists',
            '2 minutes leg swings (hold wall for balance)',
            '2 minutes marching in place'
          ]
        }
      ],
      mainWorkout: [
        {
          id: 'beginner-squats',
          name: 'Foundation Squats',
          sets: 3,
          reps: '8-12',
          description: 'Perfect your squat form with bodyweight',
          instructions: [
            'Stand with feet shoulder-width apart',
            'Lower as if sitting in a chair behind you',
            'Keep your chest up and knees behind toes',
            'Rise up by pushing through your heels',
            'Quality over quantity, Ella!'
          ],
          modifications: [
            'Use a chair behind you for confidence',
            'Hold onto a wall or doorframe for balance',
            'Start with partial squats if needed'
          ]
        },
        {
          id: 'beginner-abs',
          name: 'Gentle Core Building',
          sets: 3,
          reps: '10-15',
          description: 'Start building that strong core',
          instructions: [
            'Basic crunches: lie down, knees bent, hands behind head',
            'Lift shoulders off ground, exhale as you crunch up',
            'Focus on using your abs, not pulling your neck',
            'Lower slowly and with control'
          ],
          modifications: [
            'Keep hands on chest instead of behind head',
            'Do modified crunches with smaller range of motion'
          ]
        },
        {
          id: 'wall-pushups',
          name: 'Wall Push-ups',
          sets: 2,
          reps: '8-12',
          description: 'Building upper body strength gradually',
          instructions: [
            'Stand arm\'s length from wall',
            'Place palms flat against wall at shoulder height',
            'Lean in and push back smoothly',
            'Keep your body straight like a plank'
          ]
        }
      ],
      cooldown: [
        {
          id: 'gentle-stretches',
          name: 'Gentle Full-Body Stretches',
          duration: 10,
          description: 'Relax and recover those working muscles',
          instructions: [
            'Hold each stretch for 30 seconds',
            'Focus on legs, core, and arms',
            'Breathe deeply and relax',
            'You did amazing today!'
          ]
        }
      ]
    },
    
    PHASE_2: {
      warmup: [
        {
          id: 'active-warmup',
          name: 'Active Movement Prep',
          duration: 10,
          description: 'More dynamic preparation as you get stronger',
          instructions: [
            '3 minutes full-body movement',
            '3 minutes bodyweight squats (light)',
            '2 minutes arm swings and leg lifts',
            '2 minutes walking lunges'
          ]
        }
      ],
      mainWorkout: [
        {
          id: 'progressed-squats',
          name: 'Confidence-Building Squats',
          sets: 3,
          reps: '12-18',
          description: 'Your squat form is improving beautifully!',
          instructions: [
            'Regular bodyweight squats',
            'Focus on going a bit deeper',
            'Add a 2-second pause at the bottom',
            'Feel that strength building, Ella!'
          ],
          variations: [
            'Add squat pulses (mini bounces at bottom)',
            'Try wider stance squats',
            'Single-leg assisted squats (hold onto something)'
          ]
        },
        {
          id: 'core-progression',
          name: 'Stronger Core Work',
          sets: 3,
          reps: '12-20',
          description: 'Your abs are getting stronger every day',
          exercises: [
            'Standard crunches (15-20 reps)',
            'Bicycle crunches (10 each side)',
            'Leg raises (10-15 reps)',
            'Plank hold (20-30 seconds)'
          ],
          instructions: [
            'Focus on controlled movements',
            'Feel your core muscles working',
            'Rest between exercises as needed'
          ]
        },
        {
          id: 'knee-pushups',
          name: 'Knee Push-ups',
          sets: 3,
          reps: '6-10',
          description: 'Building real upper body strength',
          instructions: [
            'Start on knees and hands',
            'Keep straight line from knees to head',
            'Lower chest toward ground',
            'Push back up with control'
          ]
        }
      ],
      cooldown: [
        {
          id: 'thorough-stretching',
          name: 'Thorough Recovery Stretching',
          duration: 12,
          description: 'Your muscles deserve this care',
          instructions: [
            'Extended leg stretches',
            'Deep core and back stretches',
            'Shoulder and arm recovery',
            'Appreciate your growing strength'
          ]
        }
      ]
    },
    
    PHASE_3: {
      warmup: [
        {
          id: 'dynamic-prep',
          name: 'Dynamic Strength Preparation',
          duration: 12,
          description: 'Comprehensive warm-up for your stronger body',
          instructions: [
            '4 minutes movement flow',
            '4 minutes activation exercises',
            '4 minutes joint mobility'
          ]
        }
      ],
      mainWorkout: [
        {
          id: 'advanced-squats',
          name: 'Strong & Confident Squats',
          sets: 4,
          reps: '15-25',
          description: 'Look at how strong you\'ve become!',
          exercises: [
            'Regular squats (15-20 reps)',
            'Squat holds (30 seconds)',
            'Jump squats (5-10 reps)',
            'Single-leg assisted squats (5 each leg)'
          ],
          instructions: [
            'You\'re ready for more challenging variations',
            'Focus on explosive power in jump squats',
            'Control is key in single-leg work'
          ]
        },
        {
          id: 'core-strength',
          name: 'Real Core Strength',
          sets: 4,
          description: 'Your abs are getting seriously strong',
          exercises: [
            'Crunches (20-25 reps)',
            'Bicycle crunches (15 each side)',
            'Russian twists (20 total)',
            'Plank (45-60 seconds)',
            'Leg raises (15-20 reps)'
          ]
        },
        {
          id: 'pushup-progression',
          name: 'Push-up Progression',
          sets: 3,
          reps: '8-15',
          description: 'Building serious upper body strength',
          instructions: [
            'Mix of knee and full push-ups',
            'Try 2-3 full push-ups per set',
            'Focus on perfect form',
            'You\'re getting so strong!'
          ]
        }
      ],
      cooldown: [
        {
          id: 'comprehensive-recovery',
          name: 'Comprehensive Recovery',
          duration: 15,
          description: 'Professional recovery for your hard work',
          instructions: [
            'Full-body stretching routine',
            'Special focus on worked muscles',
            'Relaxation and mindfulness',
            'Celebrate your incredible progress'
          ]
        }
      ]
    },
    
    PHASE_4: {
      warmup: [
        {
          id: 'athlete-warmup',
          name: 'Athlete-Level Warm-up',
          duration: 15,
          description: 'You\'re training like a real athlete now!',
          instructions: [
            '5 minutes movement flow',
            '5 minutes activation exercises',
            '5 minutes sport-specific preparation'
          ]
        }
      ],
      mainWorkout: [
        {
          id: 'powerful-squats',
          name: 'Powerful Squat Training',
          sets: 4,
          description: 'Unleash that strength you\'ve built',
          exercises: [
            'Bodyweight squats (20-30 reps)',
            'Jump squats (10-15 reps)',
            'Single-leg squats assisted (8-12 each)',
            'Squat pulses (20-30 reps)',
            'Wall sits (60-90 seconds)'
          ]
        },
        {
          id: 'advanced-core',
          name: 'Advanced Core Training',
          sets: 4,
          description: 'Your core is becoming incredibly strong',
          exercises: [
            'Standard crunches (25-30 reps)',
            'Bicycle crunches (20 each side)',
            'Russian twists (30 total)',
            'Plank (60-90 seconds)',
            'Mountain climbers (20 total)',
            'Leg raises (20-25 reps)'
          ]
        },
        {
          id: 'full-pushups',
          name: 'Full Push-up Power',
          sets: 3,
          reps: '10-20',
          description: 'You\'re ready for full push-ups!',
          instructions: [
            'Aim for mostly full push-ups',
            'Drop to knees only when needed',
            'Focus on that full range of motion',
            'You\'ve earned this strength!'
          ]
        }
      ],
      cooldown: [
        {
          id: 'elite-recovery',
          name: 'Elite Recovery Session',
          duration: 18,
          description: 'Recovery fit for the strong woman you\'ve become',
          instructions: [
            'Extended stretching routine',
            'Muscle release and relaxation',
            'Mindful appreciation of your strength',
            'Hydration and nutrition planning'
          ]
        }
      ]
    },
    
    PHASE_5: {
      warmup: [
        {
          id: 'advanced-preparation',
          name: 'Advanced Athletic Preparation',
          duration: 18,
          description: 'Elite-level preparation for elite-level you',
          instructions: [
            '6 minutes dynamic movement',
            '6 minutes activation and mobility',
            '6 minutes sport-specific preparation'
          ]
        }
      ],
      mainWorkout: [
        {
          id: 'elite-squats',
          name: 'Elite Squat Training',
          sets: 5,
          description: 'You\'re ready for serious challenges!',
          exercises: [
            'Bodyweight squats (30-40 reps)',
            'Jump squats (15-25 reps)',
            'Single-leg squats (10-15 each)',
            'Squat jumps with rotation',
            'Pistol squat progressions',
            'Wall sits (90+ seconds)'
          ]
        },
        {
          id: 'elite-core',
          name: 'Elite Core Strength',
          sets: 5,
          description: 'Your core strength is incredible now',
          exercises: [
            'Advanced crunches (30+ reps)',
            'Bicycle crunches (25+ each side)',
            'Russian twists (40+ total)',
            'Plank variations (90+ seconds)',
            'Mountain climbers (30+ total)',
            'Advanced leg raises',
            'Dead bugs and bird dogs'
          ]
        },
        {
          id: 'advanced-upper',
          name: 'Advanced Upper Body',
          sets: 4,
          description: 'Push your boundaries - you\'re so strong!',
          exercises: [
            'Full push-ups (15-25 reps)',
            'Diamond push-ups (5-10 reps)',
            'Pike push-ups (8-12 reps)',
            'Tricep dips (10-15 reps)',
            'Plank to push-up (5-10 reps)'
          ]
        }
      ],
      cooldown: [
        {
          id: 'complete-recovery',
          name: 'Complete Recovery & Reflection',
          duration: 20,
          description: 'Honor the incredible athlete you\'ve become',
          instructions: [
            'Comprehensive stretching routine',
            'Deep muscle relaxation',
            'Reflection on your amazing journey',
            'Goal setting for your bright future'
          ]
        }
      ]
    }
  };
  
  return strengthPlans[phase] || strengthPlans.PHASE_1;
};

// Generate Ella's personalized workout
export const generateEllaWorkout = async (profileData = null) => {
  const currentPhase = getCurrentPhase();
  
  // Determine workout type based on profile preferences or alternate randomly
  let workoutType = 'running'; // default
  if (profileData?.preferences?.length) {
    const hasCardio = profileData.preferences.some(p => ['cardio', 'hiit', 'running'].includes(p));
    const hasStrength = profileData.preferences.some(p => ['strength_training', 'bodyweight', 'functional'].includes(p));
    
    if (hasCardio && hasStrength) {
      workoutType = Math.random() > 0.5 ? 'running' : 'strength';
    } else if (hasCardio) {
      workoutType = 'running';
    } else if (hasStrength) {
      workoutType = 'strength';
    }
  } else {
    workoutType = Math.random() > 0.5 ? 'running' : 'strength'; // Alternate between types
  }
  
  let workout;
  if (workoutType === 'running') {
    const runningPlan = getRunningPlan(currentPhase.phase);
    workout = {
      id: generateWorkoutId(),
      title: `Parcours Course d'Ella - ${currentPhase.level}`,
      description: `Entraînement course semaine ${currentPhase.weeksSinceStart} conçu spécialement pour toi, Ella ! ${getMotivationalMessage(currentPhase.phase)}`,
      type: 'Focus Course',
      level: currentPhase.level,
      phase: currentPhase.phase,
      week: currentPhase.weeksSinceStart,
      estimatedDuration: 45,
      totalSessions: 1,
      personalizedFor: 'Ella',
      sessions: [{
        id: 'running-session',
        sessionNumber: 1,
        title: `🏃‍♀️ Course ${currentPhase.level}`,
        type: 'cardio',
        duration: 45,
        description: runningPlan.mainWorkout[0]?.description || 'Ta session de course personnalisée',
        warmup: runningPlan.warmup,
        mainWorkout: runningPlan.mainWorkout,
        cooldown: runningPlan.cooldown
      }]
    };
  } else {
    const strengthPlan = getStrengthPlan(currentPhase.phase);
    workout = {
      id: generateWorkoutId(),
      title: `Renforcement Musculaire d'Ella - ${currentPhase.level}`,
      description: `Entraînement force semaine ${currentPhase.weeksSinceStart} axé sur les squats et les abdos ! ${getMotivationalMessage(currentPhase.phase)}`,
      type: 'Focus Force',
      level: currentPhase.level,
      phase: currentPhase.phase,
      week: currentPhase.weeksSinceStart,
      estimatedDuration: 60,
      totalSessions: 1,
      personalizedFor: 'Ella',
      sessions: [{
        id: 'strength-session',
        sessionNumber: 1,
        title: `💪 Force ${currentPhase.level}`,
        type: 'strength',
        duration: 60,
        description: 'Développement de ta force avec focus sur squats et core',
        warmup: strengthPlan.warmup,
        mainWorkout: strengthPlan.mainWorkout,
        cooldown: strengthPlan.cooldown
      }]
    };
  }
  
  return {
    success: true,
    data: workout,
    timestamp: new Date().toISOString(),
    personalMessage: `Cet entraînement est conçu spécialement pour toi, Ella ! Tu es en ${currentPhase.level} et tu t'en sors incroyablement bien ! 💪💖`
  };
};

// Get Ella's current fitness phase info
export const getEllaPhaseInfo = () => {
  return getCurrentPhase();
};

// Get phase-specific tips and encouragement
export const getPhaseSpecificTips = (phase) => {
  const tips = {
    PHASE_1: [
      "Focus on consistency over intensity - showing up is 90% of success!",
      "Your body is learning new movement patterns - be patient and proud!",
      "Every workout makes you stronger, even when it doesn't feel like it.",
      "Listen to your body - rest days are part of getting stronger too!"
    ],
    PHASE_2: [
      "Notice how much more confident you feel? That's real progress!",
      "Your form is improving with every workout - quality over quantity!",
      "You're building habits that will last a lifetime - how amazing is that?",
      "Challenge yourself gently - you're capable of more than you think!"
    ],
    PHASE_3: [
      "Your strength gains are becoming really noticeable now!",
      "Trust your body - it's adapting and getting more capable every day.",
      "You're ready for bigger challenges - embrace them with confidence!",
      "Remember where you started - look how far you've come already!"
    ],
    PHASE_4: [
      "You're officially strong now - own that identity with pride!",
      "Your endurance and strength are impressive - you should be so proud!",
      "You've proven to yourself that you can achieve anything you set your mind to.",
      "Think about setting even bigger goals - you're ready for them!"
    ],
    PHASE_5: [
      "You've transformed into the strong, confident woman you always had inside!",
      "Your consistency and dedication have paid off in incredible ways.",
      "You're ready to take on any fitness challenge that interests you!",
      "You've built a foundation of strength that will serve you for life!"
    ]
  };
  
  return tips[phase] || tips.PHASE_1;
};

export default {
  generateEllaWorkout,
  getEllaPhaseInfo,
  getPhaseSpecificTips,
  getCurrentPhase
};