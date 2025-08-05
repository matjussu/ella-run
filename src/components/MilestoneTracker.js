/**
 * Milestone Tracker Component for Ella
 * 
 * This component tracks Ella's fitness milestones, achievements, and progress
 * with personalized celebrations and motivational feedback.
 * Now uses actual Firebase data for accurate progress tracking.
 */

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import userProfileService from '../services/userProfileService';

// Ella's Achievement Definitions
const ACHIEVEMENTS = [
  { 
    name: "Premier Pas Fait !", 
    required: 1, 
    emoji: "🎯", 
    color: "#FF69B4",
    message: "Tu l'as fait, Ella ! Ton premier entraînement est terminé. C'est le début de quelque chose d'incroyable !" 
  },
  { 
    name: "Prise d'Élan !", 
    required: 3, 
    emoji: "🔥", 
    color: "#E91E63",
    message: "Trois entraînements terminés ! Tu construis une habitude qui va changer ta vie." 
  },
  { 
    name: "Héroïne High Five !", 
    required: 5, 
    emoji: "⭐", 
    color: "#9C27B0",
    message: "Cinq entraînements ! Ton dévouement se voit, et c'est magnifique à voir." 
  },
  { 
    name: "Dix Parfait !", 
    required: 10, 
    emoji: "🏆", 
    color: "#673AB7",
    message: "Deux chiffres, Ella ! Tu crées officiellement un changement durable dans ta vie." 
  },
  { 
    name: "Championne de Régularité !", 
    required: 15, 
    emoji: "💎", 
    color: "#3F51B5",
    message: "Quinze entraînements prouvent que tu n'essaies pas seulement - tu LE FAIS !" 
  },
  { 
    name: "Vingt et Florissante !", 
    required: 20, 
    emoji: "🌈", 
    color: "#2196F3",
    message: "Vingt entraînements ! Tu es passée de débutante à quelqu'un qui se présente constamment." 
  },
  { 
    name: "Trente et Inarrêtable !", 
    required: 30, 
    emoji: "🔱", 
    color: "#00BCD4",
    message: "Trente entraînements ! Tu n'es plus la même personne qui a commencé ce parcours - tu es plus forte !" 
  },
  { 
    name: "Cinquante et Fabuleuse !", 
    required: 50, 
    emoji: "👸", 
    color: "#4CAF50",
    message: "CINQUANTE ENTRAÎNEMENTS ! Ella, tu es absolument incroyable. C'est un dévouement qui change la vie !" 
  }
];

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

const ProgressOverview = styled.div`
  background: ${props => props.theme.colors.secondary};
  padding: ${props => props.theme.spacing.xl};
  border-radius: ${props => props.theme.borderRadius.large};
  box-shadow: ${props => props.theme.colors.shadow};
  margin-bottom: ${props => props.theme.spacing.xl};
  text-align: center;
`;

const ProgressTitle = styled.h2`
  color: ${props => props.theme.colors.primary};
  font-size: ${props => props.theme.fonts.sizes.xxl};
  font-weight: ${props => props.theme.fonts.weights.bold};
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const ProgressStats = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${props => props.theme.spacing.md};
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const ProgressStat = styled.div`
  background: ${props => props.theme.colors.background.secondary};
  padding: ${props => props.theme.spacing.lg};
  border-radius: ${props => props.theme.borderRadius.medium};
  text-align: center;
`;

const StatIcon = styled.div`
  font-size: 2rem;
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const StatValue = styled.div`
  font-size: ${props => props.theme.fonts.sizes.xl};
  font-weight: ${props => props.theme.fonts.weights.bold};
  color: ${props => props.theme.colors.primary};
  margin-bottom: ${props => props.theme.spacing.xs};
`;

const StatLabel = styled.div`
  font-size: ${props => props.theme.fonts.sizes.md};
  color: ${props => props.theme.colors.text.secondary};
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

const AchievementsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${props => props.theme.spacing.lg};
`;

const AchievementCard = styled.div`
  background: ${props => props.theme.colors.secondary};
  border-radius: ${props => props.theme.borderRadius.large};
  box-shadow: ${props => props.theme.colors.shadow};
  overflow: hidden;
  transition: all 0.3s ease;
  border: 3px solid ${props => props.isUnlocked ? props.color || props.theme.colors.primary : '#e0e0e0'};
  opacity: ${props => props.isUnlocked ? 1 : 0.6};
  transform: ${props => props.isUnlocked ? 'scale(1)' : 'scale(0.98)'};

  &:hover {
    transform: ${props => props.isUnlocked ? 'translateY(-4px) scale(1)' : 'translateY(-2px) scale(0.98)'};
    box-shadow: ${props => props.theme.colors.shadowHover};
  }
`;

const AchievementHeader = styled.div`
  background: ${props => props.isUnlocked ? 
    `linear-gradient(135deg, ${props.color || props.theme.colors.primary} 0%, ${props.theme.colors.primaryDark} 100%)` : 
    '#f5f5f5'
  };
  color: ${props => props.isUnlocked ? 'white' : props.theme.colors.text.secondary};
  padding: ${props => props.theme.spacing.lg};
  text-align: center;
  position: relative;

  ${props => props.isUnlocked && `
    &::before {
      content: '✨';
      position: absolute;
      top: 10px;
      left: 15px;
      font-size: 1.5rem;
      animation: sparkle 2s ease-in-out infinite;
    }
    
    &::after {
      content: '✨';
      position: absolute;
      top: 10px;
      right: 15px;
      font-size: 1.5rem;
      animation: sparkle 2s ease-in-out infinite 0.5s;
    }

    @keyframes sparkle {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.7; transform: scale(1.1); }
    }
  `}
`;

const AchievementEmoji = styled.div`
  font-size: 3rem;
  margin-bottom: ${props => props.theme.spacing.sm};
  filter: ${props => props.isUnlocked ? 'none' : 'grayscale(50%)'};
`;

const AchievementTitle = styled.h3`
  font-size: ${props => props.theme.fonts.sizes.lg};
  font-weight: ${props => props.theme.fonts.weights.bold};
  margin-bottom: ${props => props.theme.spacing.xs};
`;

const AchievementContent = styled.div`
  padding: ${props => props.theme.spacing.lg};
  text-align: center;
`;

const AchievementMessage = styled.p`
  color: ${props => props.theme.colors.text.primary};
  font-size: ${props => props.theme.fonts.sizes.md};
  line-height: 1.6;
  margin-bottom: ${props => props.theme.spacing.md};
  font-style: ${props => props.isUnlocked ? 'normal' : 'italic'};
`;

const ProgressText = styled.div`
  color: ${props => props.theme.colors.text.secondary};
  font-size: ${props => props.theme.fonts.sizes.sm};
  font-weight: ${props => props.theme.fonts.weights.medium};
  margin-top: ${props => props.theme.spacing.sm};
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: #e0e0e0;
  border-radius: 4px;
  margin: ${props => props.theme.spacing.sm} 0;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: linear-gradient(90deg, ${props => props.theme.colors.primary} 0%, ${props => props.theme.colors.primaryDark} 100%);
  width: ${props => Math.min(props.percentage, 100)}%;
  transition: width 0.3s ease;
`;

const NextMilestoneCard = styled.div`
  background: linear-gradient(135deg, ${props => props.theme.colors.primaryLight}22 0%, ${props => props.theme.colors.primary}11 100%);
  padding: ${props => props.theme.spacing.xl};
  border-radius: ${props => props.theme.borderRadius.large};
  text-align: center;
  margin-bottom: ${props => props.theme.spacing.xl};
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

const LoadingMessage = styled.div`
  text-align: center;
  padding: ${props => props.theme.spacing.xxl};
  color: ${props => props.theme.colors.text.secondary};
  font-size: ${props => props.theme.fonts.sizes.lg};
`;

const MilestoneTracker = () => {
  const [progress, setProgress] = useState({ totalWorkoutsCompleted: 0 });
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        setLoading(true);
        
        // Try to get profile by ID first (from onboarding)
        let result = await userProfileService.getUserProfile('ella-default');
        
        if (!result.success) {
          // Fallback to getting by name
          result = await userProfileService.getUserProfileByName('Ella');
        }
        
        if (result.success && result.profile) {
          setUserProfile(result.profile);
          setProgress({
            totalWorkoutsCompleted: result.profile.totalWorkoutsCompleted || 0,
            currentWeek: result.profile.currentWeek || 1,
            completedSessionsThisWeek: result.profile.completedSessionsThisWeek?.length || 0
          });
          
          console.log('📊 Achievement progress loaded:', {
            totalWorkouts: result.profile.totalWorkoutsCompleted || 0,
            currentWeek: result.profile.currentWeek || 1
          });
        } else {
          console.log('📭 No profile found for achievements');
          // Set default values
          setProgress({ 
            totalWorkoutsCompleted: 0,
            currentWeek: 1,
            completedSessionsThisWeek: 0
          });
        }
      } catch (error) {
        console.error('Error fetching progress:', error);
        setProgress({ 
          totalWorkoutsCompleted: 0,
          currentWeek: 1,
          completedSessionsThisWeek: 0
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, []);

  // Find next milestone
  const getNextMilestone = () => {
    for (const achievement of ACHIEVEMENTS) {
      if (progress.totalWorkoutsCompleted < achievement.required) {
        return achievement;
      }
    }
    return null;
  };

  const nextMilestone = getNextMilestone();

  if (loading) {
    return (
      <TrackerContainer>
        <LoadingMessage>Chargement de tes incroyables progrès...</LoadingMessage>
      </TrackerContainer>
    );
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

      {/* Progress Overview */}
      <ProgressOverview>
        <ProgressTitle>📊 Ton Parcours Jusqu'à Présent</ProgressTitle>
        <ProgressStats>
          <ProgressStat>
            <StatIcon>🏃‍♀️</StatIcon>
            <StatValue>{progress.totalWorkoutsCompleted}</StatValue>
            <StatLabel>Entraînements Terminés</StatLabel>
          </ProgressStat>
          <ProgressStat>
            <StatIcon>📅</StatIcon>
            <StatValue>{progress.currentWeek || 1}/4</StatValue>
            <StatLabel>Semaines Complétées</StatLabel>
          </ProgressStat>
          <ProgressStat>
            <StatIcon>✅</StatIcon>
            <StatValue>{progress.completedSessionsThisWeek || 0}/3</StatValue>
            <StatLabel>Séances Cette Semaine</StatLabel>
          </ProgressStat>
          <ProgressStat>
            <StatIcon>🔥</StatIcon>
            <StatValue>{Math.round((progress.totalWorkoutsCompleted / 12) * 100)}%</StatValue>
            <StatLabel>Programme Complété</StatLabel>
          </ProgressStat>
        </ProgressStats>
      </ProgressOverview>

      {/* Next Milestone */}
      {nextMilestone && (
        <NextMilestoneCard>
          <NextMilestoneTitle>
            🎯 Prochain Objectif : {nextMilestone.name}
          </NextMilestoneTitle>
          <NextMilestoneText>
            Plus que {nextMilestone.required - progress.totalWorkoutsCompleted} entraînement{nextMilestone.required - progress.totalWorkoutsCompleted !== 1 ? 's' : ''} à faire !
          </NextMilestoneText>
          <ProgressBar>
            <ProgressFill percentage={(progress.totalWorkoutsCompleted / nextMilestone.required) * 100} />
          </ProgressBar>
          <div>{Math.round((progress.totalWorkoutsCompleted / nextMilestone.required) * 100)}% Terminé</div>
        </NextMilestoneCard>
      )}

      {/* All Completed Message */}
      {!nextMilestone && (
        <NextMilestoneCard>
          <NextMilestoneTitle>🎉 Incroyable, Ella !</NextMilestoneTitle>
          <NextMilestoneText>
            Tu as débloqué tous les objectifs actuels ! Tu es une vraie championne !
          </NextMilestoneText>
        </NextMilestoneCard>
      )}

      {/* Achievement Cards */}
      <MilestoneSection>
        <SectionTitle>🏅 Tes Réussites</SectionTitle>
        <AchievementsGrid>
          {ACHIEVEMENTS.map((achievement, index) => {
            const isUnlocked = progress.totalWorkoutsCompleted >= achievement.required;
            const currentProgress = Math.min(progress.totalWorkoutsCompleted, achievement.required);
            const progressText = `Progrès : ${currentProgress}/${achievement.required} entraînements`;
            const progressPercentage = (currentProgress / achievement.required) * 100;
            
            return (
              <AchievementCard
                key={index}
                isUnlocked={isUnlocked}
                color={achievement.color}
              >
                <AchievementHeader isUnlocked={isUnlocked} color={achievement.color}>
                  <AchievementEmoji isUnlocked={isUnlocked}>
                    {achievement.emoji}
                  </AchievementEmoji>
                  <AchievementTitle>{achievement.name}</AchievementTitle>
                </AchievementHeader>
                <AchievementContent>
                  <AchievementMessage isUnlocked={isUnlocked}>
                    {achievement.message}
                  </AchievementMessage>
                  {!isUnlocked && (
                    <>
                      <ProgressText>{progressText}</ProgressText>
                      <ProgressBar>
                        <ProgressFill percentage={progressPercentage} />
                      </ProgressBar>
                    </>
                  )}
                  {isUnlocked && (
                    <ProgressText style={{ color: '#4CAF50', fontWeight: 'bold' }}>
                      ✅ Objectif Atteint !
                    </ProgressText>
                  )}
                </AchievementContent>
              </AchievementCard>
            );
          })}
        </AchievementsGrid>
      </MilestoneSection>
    </TrackerContainer>
  );
};

export default MilestoneTracker;