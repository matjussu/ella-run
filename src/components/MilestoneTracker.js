/**
 * Milestone Tracker Component for Ella
 * 
 * This component tracks Ella's fitness milestones, achievements, and progress
 * with personalized celebrations and motivational feedback.
 */

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { workoutSessionService, userProgressService } from '../services/firebaseService';

// Ella's Milestone Definitions
const ELLA_MILESTONES = {
  workout_count: [
    { count: 1, title: "Premier Pas Fait ! 🎉", message: "Tu l'as fait, Ella ! Ton premier entraînement est terminé. C'est le début de quelque chose d'incroyable !", emoji: "🎯", color: "#FF69B4" },
    { count: 3, title: "Prise d'Élan ! 💪", message: "Trois entraînements terminés ! Tu construis une habitude qui va changer ta vie.", emoji: "🔥", color: "#E91E63" },
    { count: 5, title: "Héroïne High Five ! ✋", message: "Cinq entraînements ! Ton dévouement se voit, et c'est magnifique à voir.", emoji: "⭐", color: "#9C27B0" },
    { count: 10, title: "Dix Parfait ! 🌟", message: "Deux chiffres, Ella ! Tu crées officiellement un changement durable dans ta vie.", emoji: "🏆", color: "#673AB7" },
    { count: 15, title: "Championne de Régularité ! 👑", message: "Quinze entraînements prouvent que tu n'essaies pas seulement - tu LE FAIS !", emoji: "💎", color: "#3F51B5" },
    { count: 20, title: "Vingt et Florissante ! 🚀", message: "Vingt entraînements ! Tu es passée de débutante à quelqu'un qui se présente constamment.", emoji: "🌈", color: "#2196F3" },
    { count: 30, title: "Trente et Inarrêtable ! ⚡", message: "Trente entraînements ! Tu n'es plus la même personne qui a commencé ce parcours - tu es plus forte !", emoji: "🔱", color: "#00BCD4" },
    { count: 50, title: "Cinquante et Fabuleuse ! 💫", message: "CINQUANTE ENTRAÎNEMENTS ! Ella, tu es absolument incroyable. C'est un dévouement qui change la vie !", emoji: "👸", color: "#4CAF50" }
  ],
  
  running_achievements: [
    { key: "first_run", title: "Première Course Terminée ! 🏃‍♀️", message: "Tu as couru, Ella ! Même si c'était juste des intervalles, tu es officiellement une coureuse maintenant !", emoji: "🏃‍♀️" },
    { key: "continuous_5min", title: "5 Minutes en Continu ! ⏰", message: "Cinq minutes complètes de course continue ! Ton endurance se développe magnifiquement.", emoji: "⏰" },
    { key: "continuous_10min", title: "10 Minutes de Force ! 💪", message: "Dix minutes sans s'arrêter ! Tu te souviens quand ça semblait impossible ?", emoji: "🎖️" },
    { key: "continuous_15min", title: "Coureuse d'un Quart d'Heure ! 🏅", message: "Quinze minutes en continu ! Tu deviens la coureuse dont tu rêvais d'être.", emoji: "🏅" },
    { key: "continuous_20min", title: "Guerrière de Vingt Minutes ! ⚔️", message: "Vingt minutes de course continue ! Tu es officiellement une VRAIE coureuse maintenant !", emoji: "⚔️" },
    { key: "continuous_30min", title: "Héroïne de la Demi-Heure ! 🦸‍♀️", message: "Trente minutes ! Ella, tu t'es transformée en athlète d'endurance !", emoji: "🦸‍♀️" }
  ],
  
  strength_achievements: [
    { key: "first_squat_set", title: "Premiers Squats Terminés ! 🍑", message: "Ta première série de squats ! Tes fessiers et tes jambes vont te remercier !", emoji: "🍑" },
    { key: "10_perfect_squats", title: "Squats Forme Parfaite ! ✨", message: "Dix squats parfaits ! Ta forme s'améliore à chaque fois.", emoji: "✨" },
    { key: "25_squats_straight", title: "Superstar des 25 Squats ! 🌟", message: "25 squats d'affilée ! Ta force des jambes devient impressionnante !", emoji: "🌟" },
    { key: "first_full_pushup", title: "Puissance Pompe Complète ! 💥", message: "Ta première pompe complète ! Tu te souviens quand tu commençais avec les pompes au mur ?", emoji: "💥" },
    { key: "plank_30_seconds", title: "Planche 30 Secondes ! ⏱️", message: "Trente secondes de planche ! Ton core devient sérieusement fort !", emoji: "⏱️" },
    { key: "plank_60_seconds", title: "Planche d'Une Minute ! 🔥", message: "Une minute complète de planche ! Ta force du core est absolument incroyable maintenant !", emoji: "🔥" }
  ],
  
  consistency_achievements: [
    { key: "week_streak", title: "Guerrière de la Semaine ! 📅", message: "Sept jours d'affilée à rester engagée ! Ta régularité est magnifique.", emoji: "📅" },
    { key: "two_week_streak", title: "Championne de Deux Semaines ! 🏆", message: "Deux semaines d'engagement ! Tu te prouves de quoi tu es capable !", emoji: "🏆" },
    { key: "month_milestone", title: "Un Mois de Force ! 🗓️", message: "Un mois entier de dévouement ! Tu as créé un changement durable dans ta vie !", emoji: "🗓️" }
  ]
};

// Styled Components
const TrackerContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: ${props => props.theme.spacing.lg};
`;

const TrackerHeader = styled.div`
  text-align: center;
  margin-bottom: ${props => props.theme.spacing.xxl};
  background: linear-gradient(135deg, ${props => props.theme.colors.primary} 0%, ${props => props.theme.colors.primaryDark} 100%);
  color: white;
  padding: ${props => props.theme.spacing.xxl};
  border-radius: ${props => props.theme.borderRadius.large};
`;

const TrackerTitle = styled.h1`
  font-size: ${props => props.theme.fonts.sizes.xxxl};
  font-weight: ${props => props.theme.fonts.weights.bold};
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const TrackerSubtitle = styled.p`
  font-size: ${props => props.theme.fonts.sizes.lg};
  opacity: 0.9;
`;

const MilestoneSection = styled.div`
  margin-bottom: ${props => props.theme.spacing.xxl};
`;

const SectionTitle = styled.h2`
  color: ${props => props.theme.colors.primary};
  font-size: ${props => props.theme.fonts.sizes.xxl};
  font-weight: ${props => props.theme.fonts.weights.bold};
  margin-bottom: ${props => props.theme.spacing.lg};
  text-align: center;
`;

const MilestonesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${props => props.theme.spacing.lg};
`;

const MilestoneCard = styled.div`
  background: ${props => props.theme.colors.secondary};
  border-radius: ${props => props.theme.borderRadius.large};
  box-shadow: ${props => props.theme.colors.shadow};
  overflow: hidden;
  transition: all 0.3s ease;
  border: 3px solid ${props => props.achieved ? props.color || props.theme.colors.primary : '#e0e0e0'};
  opacity: ${props => props.achieved ? 1 : 0.7};

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${props => props.theme.colors.shadowHover};
  }
`;

const MilestoneHeader = styled.div`
  background: ${props => props.achieved ? 
    `linear-gradient(135deg, ${props.color || props.theme.colors.primary} 0%, ${props.theme.colors.primaryDark} 100%)` : 
    '#f5f5f5'
  };
  color: ${props => props.achieved ? 'white' : props.theme.colors.text.secondary};
  padding: ${props => props.theme.spacing.lg};
  text-align: center;
  position: relative;

  ${props => props.achieved && `
    &::before {
      content: '✨';
      position: absolute;
      top: 10px;
      left: 15px;
      font-size: 1.5rem;
    }
    
    &::after {
      content: '✨';
      position: absolute;
      top: 10px;
      right: 15px;
      font-size: 1.5rem;
    }
  `}
`;

const MilestoneEmoji = styled.div`
  font-size: 3rem;
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const MilestoneTitle = styled.h3`
  font-size: ${props => props.theme.fonts.sizes.lg};
  font-weight: ${props => props.theme.fonts.weights.bold};
  margin-bottom: ${props => props.theme.spacing.xs};
`;

const MilestoneContent = styled.div`
  padding: ${props => props.theme.spacing.lg};
  text-align: center;
`;

const MilestoneMessage = styled.p`
  color: ${props => props.theme.colors.text.primary};
  font-size: ${props => props.theme.fonts.sizes.md};
  line-height: 1.6;
  margin-bottom: ${props => props.theme.spacing.md};
`;

const AchievementDate = styled.div`
  color: ${props => props.theme.colors.text.light};
  font-size: ${props => props.theme.fonts.sizes.sm};
  font-style: italic;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: #e0e0e0;
  border-radius: 4px;
  margin: ${props => props.theme.spacing.md} 0;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: linear-gradient(90deg, ${props => props.theme.colors.primary} 0%, ${props => props.theme.colors.primaryDark} 100%);
  width: ${props => props.percentage}%;
  transition: width 0.3s ease;
`;

const NextMilestoneCard = styled.div`
  background: linear-gradient(135deg, ${props => props.theme.colors.primaryLight}22 0%, ${props => props.theme.colors.primary}11 100%);
  padding: ${props => props.theme.spacing.xl};
  border-radius: ${props => props.theme.borderRadius.large};
  text-align: center;
  margin-top: ${props => props.theme.spacing.xl};
  border: 2px dashed ${props => props.theme.colors.primary};
`;

const NextMilestoneTitle = styled.h3`
  color: ${props => props.theme.colors.primary};
  font-size: ${props => props.theme.fonts.sizes.xl};
  font-weight: ${props => props.theme.fonts.weights.bold};
  margin-bottom: ${props => props.theme.spacing.md};
`;

const NextMilestoneText = styled.p`
  color: ${props => props.theme.colors.text.primary};
  font-size: ${props => props.theme.fonts.sizes.md};
  margin-bottom: ${props => props.theme.spacing.md};
`;

const MilestoneTracker = () => {
  const [achievements, setAchievements] = useState({});
  const [progress, setProgress] = useState(null);
  const [workoutCount, setWorkoutCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAchievements();
    loadProgress();
  }, []);

  const loadAchievements = async () => {
    // In a real app, you'd load this from Firebase
    // For now, we'll simulate some achievements based on workout count
    const savedAchievements = JSON.parse(localStorage.getItem('ella_achievements') || '{}');
    setAchievements(savedAchievements);
  };

  const loadProgress = async () => {
    try {
      const [progressData, workoutsData] = await Promise.all([
        userProgressService.getProgressStats(),
        workoutSessionService.getAllWorkoutSessions()
      ]);
      
      setProgress(progressData);
      setWorkoutCount(progressData.totalSessions);
      
      // Check for new achievements
      checkAndUnlockAchievements(progressData.totalSessions, workoutsData);
    } catch (error) {
      console.error('Error loading progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkAndUnlockAchievements = (totalWorkouts, workoutData) => {
    const newAchievements = { ...achievements };
    let hasNewAchievements = false;

    // Check workout count milestones
    ELLA_MILESTONES.workout_count.forEach(milestone => {
      const key = `workout_${milestone.count}`;
      if (totalWorkouts >= milestone.count && !newAchievements[key]) {
        newAchievements[key] = {
          achieved: true,
          date: new Date().toISOString(),
          milestone: milestone
        };
        hasNewAchievements = true;
      }
    });

    // Check other achievements (simplified for demo)
    if (totalWorkouts >= 1 && !newAchievements['first_run']) {
      newAchievements['first_run'] = {
        achieved: true,
        date: new Date().toISOString(),
        milestone: ELLA_MILESTONES.running_achievements[0]
      };
      hasNewAchievements = true;
    }

    if (hasNewAchievements) {
      setAchievements(newAchievements);
      localStorage.setItem('ella_achievements', JSON.stringify(newAchievements));
    }
  };

  const getNextMilestone = () => {
    for (const milestone of ELLA_MILESTONES.workout_count) {
      if (workoutCount < milestone.count) {
        return {
          ...milestone,
          remaining: milestone.count - workoutCount,
          progress: (workoutCount / milestone.count) * 100
        };
      }
    }
    return null;
  };

  const nextMilestone = getNextMilestone();

  if (loading) {
    return <TrackerContainer>Loading your amazing progress...</TrackerContainer>;
  }

  return (
    <TrackerContainer>
      {/* Header */}
      <TrackerHeader>
        <TrackerTitle>🏆 Galerie des Réussites d'Ella</TrackerTitle>
        <TrackerSubtitle>
          Célébrant chaque étape de ton incroyable parcours fitness !
        </TrackerSubtitle>
      </TrackerHeader>

      {/* Next Milestone */}
      {nextMilestone && (
        <NextMilestoneCard>
          <NextMilestoneTitle>
            🎯 Prochain Objectif : {nextMilestone.title}
          </NextMilestoneTitle>
          <NextMilestoneText>
            Plus que {nextMilestone.remaining} entraînement{nextMilestone.remaining !== 1 ? 's' : ''} à faire !
          </NextMilestoneText>
          <ProgressBar>
            <ProgressFill percentage={nextMilestone.progress} />
          </ProgressBar>
          <div>{Math.round(nextMilestone.progress)}% Terminé</div>
        </NextMilestoneCard>
      )}

      {/* Workout Count Milestones */}
      <MilestoneSection>
        <SectionTitle>💪 Objectifs d'Entraînement</SectionTitle>
        <MilestonesGrid>
          {ELLA_MILESTONES.workout_count.map((milestone, index) => {
            const achievementKey = `workout_${milestone.count}`;
            const achieved = achievements[achievementKey]?.achieved || false;
            
            return (
              <MilestoneCard
                key={index}
                achieved={achieved}
                color={milestone.color}
              >
                <MilestoneHeader achieved={achieved} color={milestone.color}>
                  <MilestoneEmoji>{milestone.emoji}</MilestoneEmoji>
                  <MilestoneTitle>{milestone.title}</MilestoneTitle>
                </MilestoneHeader>
                <MilestoneContent>
                  <MilestoneMessage>{milestone.message}</MilestoneMessage>
                  {achieved && achievements[achievementKey]?.date && (
                    <AchievementDate>
                      Atteint le : {new Date(achievements[achievementKey].date).toLocaleDateString('fr-FR')}
                    </AchievementDate>
                  )}
                  {!achieved && (
                    <div>
                      Progrès : {workoutCount}/{milestone.count} entraînements
                    </div>
                  )}
                </MilestoneContent>
              </MilestoneCard>
            );
          })}
        </MilestonesGrid>
      </MilestoneSection>

      {/* Running Achievements */}
      <MilestoneSection>
        <SectionTitle>🏃‍♀️ Réussites en Course</SectionTitle>
        <MilestonesGrid>
          {ELLA_MILESTONES.running_achievements.map((milestone, index) => {
            const achieved = achievements[milestone.key]?.achieved || false;
            
            return (
              <MilestoneCard
                key={index}
                achieved={achieved}
              >
                <MilestoneHeader achieved={achieved}>
                  <MilestoneEmoji>{milestone.emoji}</MilestoneEmoji>
                  <MilestoneTitle>{milestone.title}</MilestoneTitle>
                </MilestoneHeader>
                <MilestoneContent>
                  <MilestoneMessage>{milestone.message}</MilestoneMessage>
                  {achieved && achievements[milestone.key]?.date && (
                    <AchievementDate>
                      Atteint le : {new Date(achievements[milestone.key].date).toLocaleDateString('fr-FR')}
                    </AchievementDate>
                  )}
                </MilestoneContent>
              </MilestoneCard>
            );
          })}
        </MilestonesGrid>
      </MilestoneSection>

      {/* Strength Achievements */}
      <MilestoneSection>
        <SectionTitle>💪 Réussites en Force</SectionTitle>
        <MilestonesGrid>
          {ELLA_MILESTONES.strength_achievements.map((milestone, index) => {
            const achieved = achievements[milestone.key]?.achieved || false;
            
            return (
              <MilestoneCard
                key={index}
                achieved={achieved}
              >
                <MilestoneHeader achieved={achieved}>
                  <MilestoneEmoji>{milestone.emoji}</MilestoneEmoji>
                  <MilestoneTitle>{milestone.title}</MilestoneTitle>
                </MilestoneHeader>
                <MilestoneContent>
                  <MilestoneMessage>{milestone.message}</MilestoneMessage>
                  {achieved && achievements[milestone.key]?.date && (
                    <AchievementDate>
                      Atteint le : {new Date(achievements[milestone.key].date).toLocaleDateString('fr-FR')}
                    </AchievementDate>
                  )}
                </MilestoneContent>
              </MilestoneCard>
            );
          })}
        </MilestonesGrid>
      </MilestoneSection>
    </TrackerContainer>
  );
};

export default MilestoneTracker;