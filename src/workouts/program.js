export const WORKOUT_PROGRAM = [
  // Week 1
  {
    week: 1,
    sessions: [
      {
        id: 'w1s1',
        title: 'Fondations Cardio et Force',
        exercises: [
          { name: 'Échauffement', duration: 10, details: 'Mobilisations articulaires, talons-fesses, montées de genoux.' },
          { name: 'Course Fractionnée', details: '6 répétitions de (2 min course lente / 2 min marche)' },
          { name: 'Squats (poids de corps)', sets: 3, reps: 10 },
          { name: 'Planche ventrale', sets: 3, reps: '20s' },
          { name: 'Retour au calme', duration: 10, details: 'Étirements doux des jambes et du tronc.' }
        ]
      },
      {
        id: 'w1s2',
        title: 'Développement de l\'Endurance',
        exercises: [
          { name: 'Échauffement', duration: 10, details: 'Similaire à la séance 1.' },
          { name: 'Course Fractionnée', details: '7 répétitions de (2 min course lente / 2 min marche)' },
          { name: 'Squats (poids de corps)', sets: 3, reps: 10 },
          { name: 'Planche ventrale', sets: 3, reps: '25s' },
          { name: 'Retour au calme', duration: 10, details: 'Similaire à la séance 1.' }
        ]
      },
      {
        id: 'w1s3',
        title: 'Consolidation des Acquis',
        exercises: [
          { name: 'Échauffement', duration: 10, details: 'Similaire à la séance 1.' },
          { name: 'Course Fractionnée', details: '8 répétitions de (2 min course lente / 2 min marche)' },
          { name: 'Squats (poids de corps)', sets: 3, reps: 12 },
          { name: 'Planche ventrale', sets: 3, reps: '30s' },
          { name: 'Retour au calme', duration: 10, details: 'Similaire à la séance 1.' }
        ]
      }
    ]
  },
  // Week 2
  {
    week: 2,
    sessions: [
      {
        id: 'w2s1',
        title: 'Augmentation de l\'Intensité',
        exercises: [
          { name: 'Échauffement', duration: 10 },
          { name: 'Course Fractionnée', details: '5 répétitions de (4 min course lente / 2 min marche)' },
          { name: 'Squats', sets: 3, reps: 12 },
          { name: 'Planche ventrale', sets: 3, reps: '30s' },
          { name: 'Planche latérale', sets: 3, reps: '15s de chaque côté' },
          { name: 'Retour au calme', duration: 10 }
        ]
      },
      {
        id: 'w2s2',
        title: 'Endurance et Stabilité',
        exercises: [
          { name: 'Échauffement', duration: 10 },
          { name: 'Course Fractionnée', details: '6 répétitions de (4 min course lente / 2 min marche)' },
          { name: 'Squats', sets: 3, reps: 12 },
          { name: 'Planche ventrale', sets: 3, reps: '35s' },
          { name: 'Planche latérale', sets: 3, reps: '20s de chaque côté' },
          { name: 'Retour au calme', duration: 10 }
        ]
      },
      {
        id: 'w2s3',
        title: 'Nouveaux Records',
        exercises: [
          { name: 'Échauffement', duration: 10 },
          { name: 'Course Fractionnée', details: '5 répétitions de (5 min course lente / 2 min marche)' },
          { name: 'Squats', sets: 3, reps: 15 },
          { name: 'Planche ventrale', sets: 3, reps: '40s' },
          { name: 'Planche latérale', sets: 3, reps: '20s de chaque côté' },
          { name: 'Retour au calme', duration: 10 }
        ]
      }
    ]
  },
  // Week 3
  {
    week: 3,
    sessions: [
      {
        id: 'w3s1',
        title: 'Force et Cardio Combinés',
        exercises: [
          { name: 'Échauffement', duration: 10 },
          { name: 'Course Fractionnée', details: '4 répétitions de (7 min course lente / 2 min marche)' },
          { name: 'Squats', sets: 3, reps: 15 },
          { name: 'Planche ventrale', sets: 3, reps: '40s' },
          { name: 'Planche latérale', sets: 3, reps: '20s de chaque côté' },
          { name: 'Relevé de bassin', sets: 3, reps: 12 },
          { name: 'Retour au calme', duration: 10 }
        ]
      },
      {
        id: 'w3s2',
        title: 'Dépassement de Soi',
        exercises: [
          { name: 'Échauffement', duration: 10 },
          { name: 'Course Fractionnée', details: '5 répétitions de (6 min course lente / 1 min marche)' },
          { name: 'Squats', sets: 3, reps: 15 },
          { name: 'Planche ventrale', sets: 3, reps: '45s' },
          { name: 'Planche latérale', sets: 3, reps: '25s de chaque côté' },
          { name: 'Relevé de bassin', sets: 3, reps: 12 },
          { name: 'Retour au calme', duration: 10 }
        ]
      },
      {
        id: 'w3s3',
        title: 'Puissance et Contrôle',
        exercises: [
          { name: 'Échauffement', duration: 10 },
          { name: 'Course Fractionnée', details: '4 répétitions de (8 min course lente / 2 min marche)' },
          { name: 'Squats', sets: 3, reps: 15 },
          { name: 'Planche ventrale', sets: 3, reps: '45s' },
          { name: 'Planche latérale', sets: 3, reps: '25s de chaque côté' },
          { name: 'Relevé de bassin', sets: 3, reps: 15 },
          { name: 'Retour au calme', duration: 10 }
        ]
      }
    ]
  },
  // Week 4
  {
    week: 4,
    sessions: [
      {
        id: 'w4s1',
        title: 'Endurance Avancée',
        exercises: [
          { name: 'Échauffement', duration: 10 },
          { name: 'Course Longue', details: '3 répétitions de (10 min course lente / 2 min marche)' },
          { name: 'Squats', sets: 3, reps: 15 },
          { name: 'Planche ventrale', sets: 3, reps: '50s' },
          { name: 'Planche latérale', sets: 3, reps: '25s de chaque côté' },
          { name: 'Relevé de bassin', sets: 3, reps: 15 },
          { name: 'Retour au calme', duration: 10 }
        ]
      },
      {
        id: 'w4s2',
        title: 'Vers la Course Continue',
        exercises: [
          { name: 'Échauffement', duration: 10 },
          { name: 'Course Très Longue', details: '2 répétitions de (15 min course lente / 3 min marche)' },
          { name: 'Squats', sets: 3, reps: 15 },
          { name: 'Planche ventrale', sets: 3, reps: '55s' },
          { name: 'Planche latérale', sets: 3, reps: '30s de chaque côté' },
          { name: 'Relevé de bassin', sets: 3, reps: 15 },
          { name: 'Retour au calme', duration: 10 }
        ]
      },
      {
        id: 'w4s3',
        title: 'Objectif Atteint',
        exercises: [
          { name: 'Échauffement', duration: 10 },
          { name: 'Course Continue', details: '20 minutes de course continue à un rythme confortable' },
          { name: 'Squats', sets: 3, reps: 15 },
          { name: 'Planche ventrale', sets: 3, reps: '60s' },
          { name: 'Planche latérale', sets: 3, reps: '30s de chaque côté' },
          { name: 'Relevé de bassin', sets: 3, reps: 15 },
          { name: 'Retour au calme', duration: 10 }
        ]
      }
    ]
  }
];