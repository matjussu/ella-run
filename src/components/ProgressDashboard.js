/**
 * Progress Dashboard Component
 * 
 * Displays user progress statistics, workout history, and achievements.
 * Provides visual insights into fitness journey with beautiful charts and metrics.
 */

import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import userProfileService from '../services/userProfileService';
import { useAppContext } from '../App';
import LoadingSpinner from './LoadingSpinner';

// Styled Components
const DashboardContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const DashboardHeader = styled.div`
  text-align: center;
  margin-bottom: ${props => props.theme.spacing.xxl};
`;

const Title = styled.h1`
  color: ${props => props.theme.colors.primary};
  font-size: ${props => props.theme.fonts.sizes.xxxl};
  font-weight: ${props => props.theme.fonts.weights.bold};
  margin-bottom: ${props => props.theme.spacing.sm};
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    font-size: ${props => props.theme.fonts.sizes.xxl};
  }
`;

const Subtitle = styled.p`
  color: ${props => props.theme.colors.text.secondary};
  font-size: ${props => props.theme.fonts.sizes.lg};
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${props => props.theme.spacing.lg};
  margin-bottom: ${props => props.theme.spacing.xxl};
`;

const StatCard = styled.div`
  background: ${props => props.theme.colors.secondary};
  border-radius: ${props => props.theme.borderRadius.large};
  box-shadow: ${props => props.theme.colors.shadow};
  padding: ${props => props.theme.spacing.xl};
  text-align: center;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${props => props.theme.colors.shadowHover};
  }
`;

const StatIcon = styled.div`
  font-size: 3rem;
  margin-bottom: ${props => props.theme.spacing.md};
`;

const StatValue = styled.div`
  font-size: ${props => props.theme.fonts.sizes.xxxl};
  font-weight: ${props => props.theme.fonts.weights.bold};
  color: ${props => props.theme.colors.primary};
  margin-bottom: ${props => props.theme.spacing.xs};
`;

const StatLabel = styled.div`
  font-size: ${props => props.theme.fonts.sizes.md};
  color: ${props => props.theme.colors.text.secondary};
  font-weight: ${props => props.theme.fonts.weights.medium};
`;

const StatSubtext = styled.div`
  font-size: ${props => props.theme.fonts.sizes.sm};
  color: ${props => props.theme.colors.text.light};
  margin-top: ${props => props.theme.spacing.xs};
`;

const Section = styled.div`
  background: ${props => props.theme.colors.secondary};
  border-radius: ${props => props.theme.borderRadius.large};
  box-shadow: ${props => props.theme.colors.shadow};
  padding: ${props => props.theme.spacing.xl};
  margin-bottom: ${props => props.theme.spacing.xl};

  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h2`
  color: ${props => props.theme.colors.primary};
  font-size: ${props => props.theme.fonts.sizes.xl};
  font-weight: ${props => props.theme.fonts.weights.bold};
  margin-bottom: ${props => props.theme.spacing.lg};
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
`;

const WorkoutHistoryGrid = styled.div`
  display: grid;
  gap: ${props => props.theme.spacing.md};
`;

const WorkoutItem = styled.div`
  background: ${props => props.theme.colors.background.secondary};
  padding: ${props => props.theme.spacing.lg};
  border-radius: ${props => props.theme.borderRadius.medium};
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.primaryLight}11;
    border-left: 4px solid ${props => props.theme.colors.primary};
  }

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    flex-direction: column;
    align-items: flex-start;
    gap: ${props => props.theme.spacing.sm};
  }
`;

const WorkoutInfo = styled.div`
  flex: 1;
`;

const WorkoutTitle = styled.div`
  font-weight: ${props => props.theme.fonts.weights.semibold};
  color: ${props => props.theme.colors.text.primary};
  margin-bottom: ${props => props.theme.spacing.xs};
`;

const WorkoutMeta = styled.div`
  font-size: ${props => props.theme.fonts.sizes.sm};
  color: ${props => props.theme.colors.text.secondary};
  display: flex;
  gap: ${props => props.theme.spacing.md};
  flex-wrap: wrap;
`;

const WorkoutStatus = styled.div`
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.pill};
  font-size: ${props => props.theme.fonts.sizes.sm};
  font-weight: ${props => props.theme.fonts.weights.medium};
  background: ${props => props.$completed ? props.theme.colors.success : props.theme.colors.warning};
  color: white;
`;

const ProgressBar = styled.div`
  background: ${props => props.theme.colors.background.secondary};
  border-radius: ${props => props.theme.borderRadius.pill};
  height: 12px;
  overflow: hidden;
  margin: ${props => props.theme.spacing.lg} 0;
`;

const ProgressFill = styled.div`
  background: linear-gradient(90deg, ${props => props.theme.colors.primary} 0%, ${props => props.theme.colors.primaryDark} 100%);
  height: 100%;
  width: ${props => props. $percentage}%;
  transition: width 0.3s ease;
  border-radius: ${props => props.theme.borderRadius.pill};
`;

const ProgressText = styled.div`
  text-align: center;
  font-size: ${props => props.theme.fonts.sizes.sm};
  color: ${props => props.theme.colors.text.secondary};
  margin-top: ${props => props.theme.spacing.sm};
`;

const AchievementGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${props => props.theme.spacing.md};
`;

const AchievementCard = styled.div`
  background: ${props => props.unlocked ? props.theme.colors.background.secondary : '#f8f9fa'};
  border: 2px solid ${props => props.unlocked ? props.theme.colors.primary : props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.medium};
  padding: ${props => props.theme.spacing.lg};
  text-align: center;
  opacity: ${props => props.unlocked ? 1 : 0.6};
  transition: all 0.3s ease;

  &:hover {
    transform: ${props => props.unlocked ? 'translateY(-2px)' : 'none'};
    box-shadow: ${props => props.unlocked ? props.theme.colors.shadowHover : 'none'};
  }
`;

const AchievementIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: ${props => props.theme.spacing.sm};
  filter: ${props => props.unlocked ? 'none' : 'grayscale(100%)'};
`;

const AchievementTitle = styled.div`
  font-weight: ${props => props.theme.fonts.weights.semibold};
  color: ${props => props.theme.colors.text.primary};
  margin-bottom: ${props => props.theme.spacing.xs};
`;

const AchievementDescription = styled.div`
  font-size: ${props => props.theme.fonts.sizes.sm};
  color: ${props => props.theme.colors.text.secondary};
`;

const RefreshButton = styled.button`
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.lg};
  border-radius: ${props => props.theme.borderRadius.pill};
  font-weight: ${props => props.theme.fonts.weights.medium};
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  margin: 0 auto ${props => props.theme.spacing.lg};

  &:hover:not(:disabled) {
    background: ${props => props.theme.colors.primaryDark};
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.colors.shadowHover};
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${props => props.theme.spacing.xxl};
  color: ${props => props.theme.colors.text.secondary};

  .icon {
    font-size: 4rem;
    margin-bottom: ${props => props.theme.spacing.lg};
    opacity: 0.5;
  }

  .message {
    font-size: ${props => props.theme.fonts.sizes.lg};
    margin-bottom: ${props => props.theme.spacing.md};
  }

  .submessage {
    font-size: ${props => props.theme.fonts.sizes.md};
  }
`;

/**
 * ProgressDashboard Component
 */
const ProgressDashboard = ({ progress, onRefresh }) => {
  const { handleError } = useAppContext();
  const [workoutHistory, setWorkoutHistory] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [progressStats, setProgressStats] = useState(null);

  // Load data on component mount
  useEffect(() => {
    loadDashboardData();
  }, []);

  // Update progress stats when prop changes
  useEffect(() => {
    setProgressStats(progress);
  }, [progress]);

  /**
   * Load all dashboard data
   */
  const loadDashboardData = useCallback(async () => {
    try {
      setIsRefreshing(true);
      
      // Load user profile with progress data
      let result = await userProfileService.getUserProfile('ella-default');
      
      if (!result.success) {
        // Fallback to getting by name
        result = await userProfileService.getUserProfileByName('Ella');
      }
      
      if (result.success && result.profile) {
        const userProfile = result.profile;
        
        // Convert user profile data to progress stats format
        const stats = {
          totalSessions: 12, // Total sessions in 4-week program
          completedSessions: result.profile.totalWorkoutsCompleted || 0,
          completionRate: Math.round(((result.profile.totalWorkoutsCompleted || 0) / 12) * 100),
          streak: result.profile.completedSessionsThisWeek?.length || 0,
          currentWeek: result.profile.currentWeek || 1,
          sessionsThisWeek: result.profile.completedSessionsThisWeek?.length || 0
        };
        
        setProgressStats(stats);
        
        // Create workout history from user profile data
        const mockHistory = [];
        for (let i = 0; i < (userProfile.totalWorkoutsCompleted || 0); i++) {
          mockHistory.push({
            id: `workout-${i + 1}`,
            title: `Entraînement ${i + 1}`,
            createdAt: new Date(Date.now() - (i * 24 * 60 * 60 * 1000)), // Mock dates
            estimatedDuration: 45,
            totalSessions: 1,
            isCompleted: true
          });
        }
        setWorkoutHistory(mockHistory.slice(0, 10));
        
        console.log('📊 Live progress data loaded:', stats);
      } else {
        // Set default values if no profile found
        setProgressStats({
          totalSessions: 12,
          completedSessions: 0,
          completionRate: 0,
          streak: 0,
          currentWeek: 1,
          sessionsThisWeek: 0
        });
        setWorkoutHistory([]);
      }
      
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      handleError(new Error('Failed to load progress data'));
      
      // Set fallback data
      setProgressStats({
        totalSessions: 12,
        completedSessions: 0,
        completionRate: 0,
        streak: 0,
        currentWeek: 1,
        sessionsThisWeek: 0
      });
    } finally {
      setIsRefreshing(false);
    }
  }, [handleError]);

  /**
   * Handle refresh button click
   */
  const handleRefresh = useCallback(async () => {
    await loadDashboardData();
    if (onRefresh) {
      await onRefresh();
    }
  }, [loadDashboardData, onRefresh]);

  /**
   * Calculate achievements based on progress
   */
  const calculateAchievements = useCallback(() => {
    if (!progressStats) return [];

    const achievements = [
      {
        id: 'first_workout',
        title: 'Premier Pas Fait !',
        description: 'Terminer ton premier entraînement',
        icon: '🎯',
        unlocked: progressStats.completedSessions >= 1
      },
      {
        id: 'consistent_week',
        title: 'Héroïne de la Semaine',
        description: 'Compléter 3 entraînements cette semaine',
        icon: '🔥',
        unlocked: progressStats.sessionsThisWeek >= 3
      },
      {
        id: 'half_dozen',
        title: 'Demi-Douzaine',
        description: 'Compléter 6 entraînements au total',
        icon: '💪',
        unlocked: progressStats.completedSessions >= 6
      },
      {
        id: 'perfect_week',
        title: 'Semaine Parfaite',
        description: 'Terminer tous les entraînements prévus',
        icon: '⭐',
        unlocked: progressStats.completionRate >= 100
      },
      {
        id: 'program_complete',
        title: 'Championne du Programme',
        description: 'Terminer le programme de 4 semaines',
        icon: '🏆',
        unlocked: progressStats.completedSessions >= 12
      },
      {
        id: 'weekly_consistency',
        title: 'Régularité Exemplaire',
        description: 'Terminer au moins 2 semaines complètes',
        icon: '🌟',
        unlocked: progressStats.currentWeek >= 3
      }
    ];

    return achievements;
  }, [progressStats]);

  /**
   * Format date for display
   */
  const formatDate = (timestamp) => {
    if (!timestamp) return 'Unknown';
    
    const date = timestamp.seconds ? new Date(timestamp.seconds * 1000) : new Date(timestamp);
    return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (isRefreshing && !progressStats) {
    return <LoadingSpinner text="Loading your progress..." fullHeight />;
  }

  return (
    <DashboardContainer>
      {/* Header */}
      <DashboardHeader>
        <Title>💪 Ton Recap !</Title>
        <Subtitle>
          Suis tes progrés, célèbre tes reussites, et reste motivée mon doudou hehe !.
        </Subtitle>
        <RefreshButton onClick={handleRefresh} disabled={isRefreshing}>
          {isRefreshing ? (
            <>
              <LoadingSpinner size="small" text="" />
              Refreshing...
            </>
          ) : (
            <>
              🔄 Refresh Data
            </>
          )}
        </RefreshButton>
      </DashboardHeader>

      {/* Progress Stats */}
      {progressStats ? (
        <StatsGrid>
          <StatCard>
            <StatIcon>📅</StatIcon>
            <StatValue>{progressStats.currentWeek}/4</StatValue>
            <StatLabel>Semaine Actuelle</StatLabel>
            <StatSubtext>Programme de 4 semaines</StatSubtext>
          </StatCard>
          
          <StatCard>
            <StatIcon>✅</StatIcon>
            <StatValue>{progressStats.completedSessions}</StatValue>
            <StatLabel>Entraînements Terminés</StatLabel>
            <StatSubtext>Au total</StatSubtext>
          </StatCard>
          
          <StatCard>
            <StatIcon>📈</StatIcon>
            <StatValue>{progressStats.completionRate}%</StatValue>
            <StatLabel>Programme Complété</StatLabel>
            <StatSubtext>Progression globale</StatSubtext>
          </StatCard>
          
          <StatCard>
            <StatIcon>🔥</StatIcon>
            <StatValue>{progressStats.sessionsThisWeek}/3</StatValue>
            <StatLabel>Séances Cette Semaine</StatLabel>
            <StatSubtext>En cours</StatSubtext>
          </StatCard>
        </StatsGrid>
      ) : (
        <EmptyState>
          <div className="icon">📊</div>
          <div className="message">Aucune donnée de progression pour le moment</div>
          <div className="submessage">Commence par faire ton premier entraînement !</div>
        </EmptyState>
      )}

      {/* Progress Visualization */}
      {progressStats && progressStats.totalSessions > 0 && (
        <Section>
          <SectionTitle>📈 Vue d'Ensemble des Progrès</SectionTitle>
          <ProgressBar>
            <ProgressFill $percentage={progressStats.completionRate} />
          </ProgressBar>
          <ProgressText>
            Tu as terminé {progressStats.completedSessions} entraînements sur {progressStats.totalSessions} ({progressStats.completionRate}%)
          </ProgressText>
        </Section>
      )}

      {/* Achievements */}
      <Section>
        <SectionTitle>🏆 Tes Réussites</SectionTitle>
        <AchievementGrid>
          {calculateAchievements().map((achievement) => (
            <AchievementCard key={achievement.id} unlocked={achievement.unlocked}>
              <AchievementIcon unlocked={achievement.unlocked}>
                {achievement.icon}
              </AchievementIcon>
              <AchievementTitle>{achievement.title}</AchievementTitle>
              <AchievementDescription>{achievement.description}</AchievementDescription>
            </AchievementCard>
          ))}
        </AchievementGrid>
      </Section>

      {/* Workout History */}
      <Section>
        <SectionTitle>📅 Entrainements récents</SectionTitle>
        {workoutHistory.length > 0 ? (
          <WorkoutHistoryGrid>
            {workoutHistory.map((workout) => (
              <WorkoutItem key={workout.id}>
                <WorkoutInfo>
                  <WorkoutTitle>{workout.title || 'Custom Workout'}</WorkoutTitle>
                  <WorkoutMeta>
                    <span>📅 {formatDate(workout.createdAt)}</span>
                    <span>⏱️ {workout.estimatedDuration || 60}min</span>
                    <span>📊 {workout.totalSessions || 3} sessions</span>
                  </WorkoutMeta>
                </WorkoutInfo>
                <WorkoutStatus $completed={workout.isCompleted}>
                  {workout.isCompleted ? '✅ Completed' : '⏳ In Progress'}
                </WorkoutStatus>
              </WorkoutItem>
            ))}
          </WorkoutHistoryGrid>
        ) : (
          <EmptyState>
            <div className="icon">📝</div>
            <div className="message">Aucun historique d'entraînement pour le moment</div>
            <div className="submessage">Tes entraînements terminés apparaîtront ici</div>
          </EmptyState>
        )}
      </Section>
    </DashboardContainer>
  );
};

export default ProgressDashboard;