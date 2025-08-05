/**
 * Workout Generator Component
 * 
 * Displays the current week's 3 sessions from the static 4-week program.
 * Tracks user progress through Firebase and handles session validation.
 * Features a modern, responsive UI with pink/white theme.
 */

import React, { useState, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { WORKOUT_PROGRAM } from '../workouts/program';
import userProfileService from '../services/userProfileService';
import { useAppContext } from '../App';
import LoadingSpinner from './LoadingSpinner';
import WorkoutPlayer from './WorkoutPlayer';

// Styled Components
const GeneratorContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
`;

const GeneratorHeader = styled.div`
  text-align: center;
  margin-bottom: ${props => props.theme.spacing.xxl};
`;

const Title = styled.h1`
  color: ${props => props.theme.colors.primary};
  font-size: ${props => props.theme.fonts.sizes.xxxl};
  font-weight: ${props => props.theme.fonts.weights.bold};
  margin-bottom: ${props => props.theme.spacing.md};
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    font-size: ${props => props.theme.fonts.sizes.xxl};
  }
`;

const Subtitle = styled.p`
  color: ${props => props.theme.colors.text.secondary};
  font-size: ${props => props.theme.fonts.sizes.lg};
  max-width: 600px;
  margin: 0 auto ${props => props.theme.spacing.xl};
  line-height: 1.6;
`;

const ProgressSection = styled.div`
  background: ${props => props.theme.colors.secondary};
  padding: ${props => props.theme.spacing.xl};
  border-radius: ${props => props.theme.borderRadius.large};
  box-shadow: ${props => props.theme.colors.shadow};
  margin-bottom: ${props => props.theme.spacing.xl};
  text-align: center;
`;

const ProgressInfo = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${props => props.theme.spacing.md};
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const ProgressCard = styled.div`
  background: ${props => props.theme.colors.background.secondary};
  padding: ${props => props.theme.spacing.lg};
  border-radius: ${props => props.theme.borderRadius.medium};
  text-align: center;
`;

const ProgressIcon = styled.div`
  font-size: 2rem;
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const ProgressTitle = styled.h3`
  color: ${props => props.theme.colors.primary};
  font-size: ${props => props.theme.fonts.sizes.md};
  font-weight: ${props => props.theme.fonts.weights.semibold};
  margin-bottom: ${props => props.theme.spacing.xs};
`;

const ProgressValue = styled.p`
  color: ${props => props.theme.colors.text.primary};
  font-size: ${props => props.theme.fonts.sizes.lg};
  font-weight: ${props => props.theme.fonts.weights.medium};
`;

const WeekTitle = styled.h2`
  color: ${props => props.theme.colors.primary};
  font-size: ${props => props.theme.fonts.sizes.xxl};
  font-weight: ${props => props.theme.fonts.weights.bold};
  margin-bottom: ${props => props.theme.spacing.md};
`;

const SessionsGrid = styled.div`
  display: grid;
  gap: ${props => props.theme.spacing.lg};
  
  @media (min-width: ${props => props.theme.breakpoints.tablet}) {
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  }
`;

const SessionCard = styled.div`
  background: ${props => props.theme.colors.secondary};
  border-radius: ${props => props.theme.borderRadius.large};
  box-shadow: ${props => props.theme.colors.shadow};
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
  border: 3px solid transparent;

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${props => props.theme.colors.shadowHover};
  }

  ${props => props.isCompleted && `
    background-color: #e8f5e9;
    border-color: ${props.theme.colors.success};
  `}
`;

const SessionHeader = styled.div`
  background: linear-gradient(135deg, ${props => props.theme.colors.primary} 0%, ${props => props.theme.colors.primaryDark} 100%);
  color: white;
  padding: ${props => props.theme.spacing.lg};
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: ${props => props.theme.spacing.sm};
`;

const SessionTitleContainer = styled.div`
  flex: 1;
`;

const SessionTitle = styled.h3`
  font-size: ${props => props.theme.fonts.sizes.xl};
  font-weight: ${props => props.theme.fonts.weights.bold};
  margin: 0 0 ${props => props.theme.spacing.xs} 0;
`;

const SessionDay = styled.div`
  font-size: ${props => props.theme.fonts.sizes.sm};
  opacity: 0.9;
`;

const SessionStatus = styled.div`
  background: ${props => props.$completed ? '#4caf50' : 'rgba(255, 255, 255, 0.2)'};
  display: inline-block;
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.pill};
  font-size: ${props => props.theme.fonts.sizes.sm};
  font-weight: ${props => props.theme.fonts.weights.medium};
`;

const SessionContent = styled.div`
  padding: ${props => props.theme.spacing.lg};
  display: ${props => props.$expanded ? 'block' : 'none'};
`;

const ExerciseList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 ${props => props.theme.spacing.lg} 0;
`;

const ExerciseListItem = styled.li`
  background: ${props => props.theme.colors.background.secondary};
  padding: ${props => props.theme.spacing.md};
  margin-bottom: ${props => props.theme.spacing.xs};
  border-radius: ${props => props.theme.borderRadius.medium};
  color: ${props => props.theme.colors.text.primary};
  border-left: 3px solid ${props => props.theme.colors.primary};
`;

const ExerciseName = styled.div`
  font-weight: ${props => props.theme.fonts.weights.semibold};
  margin-bottom: ${props => props.theme.spacing.xs};
`;

const ExerciseDetails = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.sm};
  flex-wrap: wrap;
`;

const DetailBadge = styled.span`
  background: ${props => props.theme.colors.primary}20;
  color: ${props => props.theme.colors.primary};
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  border-radius: ${props => props.theme.borderRadius.pill};
  font-size: ${props => props.theme.fonts.sizes.xs};
  font-weight: ${props => props.theme.fonts.weights.medium};
`;

const ExerciseDescription = styled.div`
  color: ${props => props.theme.colors.text.secondary};
  font-size: ${props => props.theme.fonts.sizes.sm};
  margin-top: ${props => props.theme.spacing.xs};
  font-style: italic;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.sm};
  margin-top: ${props => props.theme.spacing.lg};
`;

const ActionButton = styled.button`
  flex: 1;
  background: ${props => props.$primary ? 
    `linear-gradient(135deg, ${props.theme.colors.primary} 0%, ${props.theme.colors.primaryDark} 100%)` : 
    props.$success ? '#4caf50' : 'transparent'};
  color: ${props => props.$primary || props.$success ? 'white' : props.theme.colors.primary};
  border: 2px solid ${props => props.$success ? '#4caf50' : props.theme.colors.primary};
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.lg};
  border-radius: ${props => props.theme.borderRadius.pill};
  font-weight: ${props => props.theme.fonts.weights.medium};
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    background: ${props => props.$success ? '#45a049' : props.theme.colors.primary};
    color: white;
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.colors.shadowHover};
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const CompletionMessage = styled.div`
  background: ${props => props.theme.colors.success}10;
  border: 2px solid ${props => props.theme.colors.success};
  border-radius: ${props => props.theme.borderRadius.large};
  padding: ${props => props.theme.spacing.xl};
  text-align: center;
  margin: ${props => props.theme.spacing.xl} 0;
`;

const CompletionTitle = styled.h2`
  color: ${props => props.theme.colors.success};
  font-size: ${props => props.theme.fonts.sizes.xxl};
  font-weight: ${props => props.theme.fonts.weights.bold};
  margin-bottom: ${props => props.theme.spacing.md};
`;

const CompletionText = styled.p`
  color: ${props => props.theme.colors.text.primary};
  font-size: ${props => props.theme.fonts.sizes.lg};
  margin-bottom: ${props => props.theme.spacing.lg};
`;

/**
 * WorkoutGenerator Component
 */
const WorkoutGenerator = () => {
  const { handleError } = useAppContext();
  const [userProfile, setUserProfile] = useState(null);
  const [expandedSession, setExpandedSession] = useState(null);
  const [playingSession, setPlayingSession] = useState(null);
  const [validatingSession, setValidatingSession] = useState(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  // Load user profile on component mount
  useEffect(() => {
    loadUserProfile();
  }, []);

  /**
   * Load user profile with progress data
   */
  const loadUserProfile = useCallback(async () => {
    try {
      setIsLoadingProfile(true);
      
      // Try to get profile by ID first (from onboarding)
      let result = await userProfileService.getUserProfile('ella-default');
      
      if (!result.success) {
        // Fallback to getting by name
        result = await userProfileService.getUserProfileByName('Ella');
      }
      
      if (result.success && result.profile) {
        setUserProfile(result.profile);
        console.log('👤 User profile loaded:', result.profile);
      } else {
        console.log('📭 No profile found, creating default...');
        // Create default profile if none exists
        const createResult = await userProfileService.createUserProfile({
          id: 'ella-default'
        });
        if (createResult.success) {
          setUserProfile(createResult.profile);
        }
      }
      
    } catch (error) {
      console.error('Error loading user profile:', error);
      handleError(new Error('Failed to load user profile'));
    } finally {
      setIsLoadingProfile(false);
    }
  }, [handleError]);

  /**
   * Handle session card click to expand/collapse
   */
  const handleSessionClick = useCallback((sessionId) => {
    setExpandedSession(prev => prev === sessionId ? null : sessionId);
  }, []);

  /**
   * Handle start session button click
   */
  const handleStartSession = useCallback((session, event) => {
    event.stopPropagation();
    setPlayingSession(session.exercises);
  }, []);

  /**
   * Handle workout player finish
   */
  const handleFinishSession = useCallback(() => {
    setPlayingSession(null);
  }, []);

  /**
   * Handle session validation
   */
  const handleValidateSession = useCallback(async (sessionId, weekNumber, event) => {
    event.stopPropagation();
    
    if (!userProfile?.id || validatingSession === sessionId) return;
    
    try {
      setValidatingSession(sessionId);
      
      const result = await userProfileService.validateSession(
        userProfile.id, 
        sessionId, 
        weekNumber
      );
      
      if (result.success) {
        // Update local state with new profile data
        setUserProfile(result.profile);
        
        if (result.weekCompleted) {
          // Show week completion message
          console.log(`🎉 Week ${weekNumber} completed! Moving to week ${result.newWeek}`);
        }
        
        console.log(`✅ Session ${sessionId} validated successfully`);
      } else {
        throw new Error(result.error);
      }
      
    } catch (error) {
      console.error('Error validating session:', error);
      handleError(new Error('Failed to validate session'));
    } finally {
      setValidatingSession(null);
    }
  }, [userProfile, validatingSession, handleError]);

  /**
   * Get current week's sessions
   */
  const getCurrentWeekData = useCallback(() => {
    if (!userProfile) return null;
    
    const currentWeek = Math.min(userProfile.currentWeek || 1, 4); // Cap at week 4
    const weekData = WORKOUT_PROGRAM.find(week => week.week === currentWeek);
    
    return weekData;
  }, [userProfile]);

  /**
   * Map session to available day
   */
  const getSessionDay = useCallback((sessionIndex) => {
    const availableDays = userProfile?.schedule?.availableDays || ['lundi', 'mercredi', 'vendredi'];
    const dayMap = {
      0: availableDays[0] || 'lundi',
      1: availableDays[1] || 'mercredi', 
      2: availableDays[2] || 'vendredi'
    };
    return dayMap[sessionIndex] || `Jour ${sessionIndex + 1}`;
  }, [userProfile]);

  /**
   * Check if session is completed
   */
  const isSessionCompleted = useCallback((sessionId) => {
    return userProfile?.completedSessionsThisWeek?.includes(sessionId) || false;
  }, [userProfile]);

  /**
   * Render exercise list with details
   */
  const renderExerciseList = (exercises) => {
    return (
      <ExerciseList>
        {exercises.map((exercise, index) => (
          <ExerciseListItem key={index}>
            <ExerciseName>{exercise.name}</ExerciseName>
            <ExerciseDetails>
              {exercise.sets && (
                <DetailBadge>📊 {exercise.sets} séries</DetailBadge>
              )}
              {exercise.reps && (
                <DetailBadge>🔄 {exercise.reps} reps</DetailBadge>
              )}
              {exercise.duration && (
                <DetailBadge>⏱️ {exercise.duration} min</DetailBadge>
              )}
            </ExerciseDetails>
            {exercise.details && (
              <ExerciseDescription>{exercise.details}</ExerciseDescription>
            )}
          </ExerciseListItem>
        ))}
      </ExerciseList>
    );
  };

  if (isLoadingProfile) {
    return (
      <GeneratorContainer>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <LoadingSpinner size="large" text="Chargement de votre programme..." />
        </div>
      </GeneratorContainer>
    );
  }

  const currentWeekData = getCurrentWeekData();
  const isProgram = currentWeekData && userProfile?.currentWeek <= 4;

  return (
    <GeneratorContainer>
      {/* Header Section */}
      <GeneratorHeader>
        <Title>Votre Programme d'Entraînement</Title>
        <Subtitle>
          Programme progressif de 4 semaines pour développer votre endurance et votre force
        </Subtitle>
      </GeneratorHeader>

      {/* Progress Section */}
      {userProfile && (
        <ProgressSection>
          <WeekTitle>
            {userProfile.currentWeek > 4 ? 
              '🎉 Programme Terminé !' : 
              `Semaine ${userProfile.currentWeek} sur 4`
            }
          </WeekTitle>
          <ProgressInfo>
            <ProgressCard>
              <ProgressIcon>📅</ProgressIcon>
              <ProgressTitle>Semaine Actuelle</ProgressTitle>
              <ProgressValue>{Math.min(userProfile.currentWeek, 4)}/4</ProgressValue>
            </ProgressCard>
            <ProgressCard>
              <ProgressIcon>✅</ProgressIcon>
              <ProgressTitle>Séances Cette Semaine</ProgressTitle>
              <ProgressValue>{userProfile.completedSessionsThisWeek?.length || 0}/3</ProgressValue>
            </ProgressCard>
            <ProgressCard>
              <ProgressIcon>🏆</ProgressIcon>
              <ProgressTitle>Total Entraînements</ProgressTitle>
              <ProgressValue>{userProfile.totalWorkoutsCompleted || 0}</ProgressValue>
            </ProgressCard>
            <ProgressCard>
              <ProgressIcon>🔥</ProgressIcon>
              <ProgressTitle>Progression</ProgressTitle>
              <ProgressValue>
                {Math.round(((userProfile.totalWorkoutsCompleted || 0) / 12) * 100)}%
              </ProgressValue>
            </ProgressCard>
          </ProgressInfo>
        </ProgressSection>
      )}

      {/* Program Complete Message */}
      {userProfile?.currentWeek > 4 && (
        <CompletionMessage>
          <CompletionTitle>🎉 Félicitations !</CompletionTitle>
          <CompletionText>
            Vous avez terminé le programme de 4 semaines ! Vous avez développé votre endurance 
            et votre force. Continuez à vous entraîner régulièrement pour maintenir vos acquis.
          </CompletionText>
        </CompletionMessage>
      )}

      {/* Current Week Sessions */}
      {isProgram && (
        <SessionsGrid>
          {currentWeekData.sessions.map((session, index) => {
            const isExpanded = expandedSession === session.id;
            const isCompleted = isSessionCompleted(session.id);
            const sessionDay = getSessionDay(index);
            const isValidating = validatingSession === session.id;
            
            return (
              <SessionCard 
                key={session.id} 
                onClick={() => handleSessionClick(session.id)}
                isCompleted={isCompleted}
              >
                <SessionHeader>
                  <SessionTitleContainer>
                    <SessionTitle>{session.title}</SessionTitle>
                    <SessionDay>Entraînement du {sessionDay}</SessionDay>
                  </SessionTitleContainer>
                  <SessionStatus $completed={isCompleted}>
                    {isCompleted ? '✅ Terminé' : 'À faire'}
                  </SessionStatus>
                </SessionHeader>
                
                <SessionContent $expanded={isExpanded}>
                  {renderExerciseList(session.exercises)}
                  <ActionButtons>
                    <ActionButton 
                      onClick={(e) => handleStartSession(session, e)}
                    >
                      🚀 Commencer la séance
                    </ActionButton>
                    {!isCompleted ? (
                      <ActionButton 
                        $primary
                        onClick={(e) => handleValidateSession(session.id, currentWeekData.week, e)}
                        disabled={isValidating}
                      >
                        {isValidating ? (
                          <>
                            <LoadingSpinner size="small" text="" />
                            Validation...
                          </>
                        ) : (
                          '✅ Valider la séance'
                        )}
                      </ActionButton>
                    ) : (
                      <ActionButton $success disabled>
                        ✅ Séance validée
                      </ActionButton>
                    )}
                  </ActionButtons>
                </SessionContent>
              </SessionCard>
            );
          })}
        </SessionsGrid>
      )}
      
      {/* Workout Player Modal */}
      {playingSession && (
        <WorkoutPlayer 
          sessionExercises={playingSession}
          onFinish={handleFinishSession}
        />
      )}
    </GeneratorContainer>
  );
};

export default WorkoutGenerator;