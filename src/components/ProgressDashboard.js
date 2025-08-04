/**
 * Progress Dashboard Component
 * 
 * Displays user progress statistics, workout history, and achievements.
 * Provides visual insights into fitness journey with beautiful charts and metrics.
 */

import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { userProgressService, workoutSessionService } from '../services/firebaseService';
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
  const { setIsLoading, handleError } = useAppContext();
  const [workoutHistory, setWorkoutHistory] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [progressStats, setProgressStats] = useState(progress);

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
      
      // Load workout history
      const history = await workoutSessionService.getAllWorkoutSessions();
      setWorkoutHistory(history.slice(0, 10)); // Show last 10 workouts
      
      // Load progress stats if not provided
      if (!progressStats) {
        const stats = await userProgressService.getProgressStats();
        setProgressStats(stats);
      }
      
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      handleError(new Error('Failed to load progress data'));
    } finally {
      setIsRefreshing(false);
    }
  }, [progressStats, handleError]);

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
        title: 'Getting Started',
        description: 'Complete your first workout',
        icon: '🎯',
        unlocked: progressStats.totalSessions >= 1
      },
      {
        id: 'consistent_week',
        title: 'Weekly Warrior',
        description: 'Complete 3 workouts in a week',
        icon: '🔥',
        unlocked: progressStats.streak >= 3
      },
      {
        id: 'half_dozen',
        title: 'Half Dozen',
        description: 'Complete 6 workouts total',
        icon: '💪',
        unlocked: progressStats.completedSessions >= 6
      },
      {
        id: 'perfect_week',
        title: 'Perfect Week',
        description: 'Complete all planned workouts',
        icon: '⭐',
        unlocked: progressStats.completionRate >= 100
      },
      {
        id: 'consistent_month',
        title: 'Monthly Champion',
        description: 'Complete 12 workouts total',
        icon: '🏆',
        unlocked: progressStats.completedSessions >= 12
      },
      {
        id: 'dedication',
        title: 'Dedication Master',
        description: 'Maintain a 7-day streak',
        icon: '🌟',
        unlocked: progressStats.streak >= 7
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
            <StatIcon>📊</StatIcon>
            <StatValue>{progressStats.totalSessions}</StatValue>
            <StatLabel>Nombre d'entrainement</StatLabel>
            <StatSubtext>Généré</StatSubtext>
          </StatCard>
          
          <StatCard>
            <StatIcon>✅</StatIcon>
            <StatValue>{progressStats.completedSessions}</StatValue>
            <StatLabel>Complété</StatLabel>
            <StatSubtext>Entrainement terminé !</StatSubtext>
          </StatCard>
          
          <StatCard>
            <StatIcon>📈</StatIcon>
            <StatValue>{progressStats.completionRate}%</StatValue>
            <StatLabel>Taux de succés</StatLabel>
            <StatSubtext>Pourcentage</StatSubtext>
          </StatCard>
          
          <StatCard>
            <StatIcon>🔥</StatIcon>
            <StatValue>{progressStats.streak}</StatValue>
            <StatLabel>Nombre d'entrainement de suite</StatLabel>
            <StatSubtext>Abérrant</StatSubtext>
          </StatCard>
        </StatsGrid>
      ) : (
        <EmptyState>
          <div className="icon">📊</div>
          <div className="message">No progress data yet</div>
          <div className="submessage">Start by generating your first workout!</div>
        </EmptyState>
      )}

      {/* Progress Visualization */}
      {progressStats && progressStats.totalSessions > 0 && (
        <Section>
          <SectionTitle>📈 Progress Overview</SectionTitle>
          <ProgressBar>
            <ProgressFill $percentage={progressStats.completionRate} />
          </ProgressBar>
          <ProgressText>
            You've completed {progressStats.completedSessions} out of {progressStats.totalSessions} workouts ({progressStats.completionRate}%)
          </ProgressText>
        </Section>
      )}

      {/* Achievements */}
      <Section>
        <SectionTitle>🏆 Achievements</SectionTitle>
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
            <div className="message">No workout history yet</div>
            <div className="submessage">Your completed workouts will appear here</div>
          </EmptyState>
        )}
      </Section>
    </DashboardContainer>
  );
};

export default ProgressDashboard;