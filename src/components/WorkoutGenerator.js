/**
 * Workout Generator Component
 * 
 * Main component for generating and displaying workout plans.
 * Integrates with RapidAPI for workout generation and Firebase for saving sessions.
 * Features a modern, responsive UI with pink/white theme.
 */

import React, { useState, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { generateWorkoutPlan, getMockWorkoutPlan } from '../services/rapidApiService';
import { workoutSessionService } from '../services/firebaseService';
import { dailyWorkoutService } from '../services/dailyWorkoutService';
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

const GenerateSection = styled.div`
  background: ${props => props.theme.colors.secondary};
  padding: ${props => props.theme.spacing.xl};
  border-radius: ${props => props.theme.borderRadius.large};
  box-shadow: ${props => props.theme.colors.shadow};
  margin-bottom: ${props => props.theme.spacing.xl};
  text-align: center;
`;

const WorkoutInfo = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${props => props.theme.spacing.md};
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const InfoCard = styled.div`
  background: ${props => props.theme.colors.background.secondary};
  padding: ${props => props.theme.spacing.lg};
  border-radius: ${props => props.theme.borderRadius.medium};
  text-align: center;
`;

const InfoIcon = styled.div`
  font-size: 2rem;
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const InfoTitle = styled.h3`
  color: ${props => props.theme.colors.primary};
  font-size: ${props => props.theme.fonts.sizes.md};
  font-weight: ${props => props.theme.fonts.weights.semibold};
  margin-bottom: ${props => props.theme.spacing.xs};
`;

const InfoValue = styled.p`
  color: ${props => props.theme.colors.text.primary};
  font-size: ${props => props.theme.fonts.sizes.lg};
  font-weight: ${props => props.theme.fonts.weights.medium};
`;

const GenerateButton = styled.button`
  background: linear-gradient(135deg, ${props => props.theme.colors.primary} 0%, ${props => props.theme.colors.primaryDark} 100%);
  color: white;
  border: none;
  padding: ${props => props.theme.spacing.lg} ${props => props.theme.spacing.xxl};
  border-radius: ${props => props.theme.borderRadius.pill};
  font-size: ${props => props.theme.fonts.sizes.lg};
  font-weight: ${props => props.theme.fonts.weights.semibold};
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover:not(:disabled) {
    transform: translateY(-3px);
    box-shadow: ${props => props.theme.colors.shadowHover};
  }

  &:active:not(:disabled) {
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.xl};
    font-size: ${props => props.theme.fonts.sizes.md};
  }
`;

const WorkoutDisplay = styled.div`
  margin-top: ${props => props.theme.spacing.xl};
`;

const WorkoutHeader = styled.div`
  background: ${props => props.theme.colors.secondary};
  padding: ${props => props.theme.spacing.xl};
  border-radius: ${props => props.theme.borderRadius.large};
  box-shadow: ${props => props.theme.colors.shadow};
  margin-bottom: ${props => props.theme.spacing.lg};
  text-align: center;
`;

const WorkoutTitle = styled.h2`
  color: ${props => props.theme.colors.primary};
  font-size: ${props => props.theme.fonts.sizes.xxl};
  font-weight: ${props => props.theme.fonts.weights.bold};
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const WorkoutDescription = styled.p`
  color: ${props => props.theme.colors.text.secondary};
  font-size: ${props => props.theme.fonts.sizes.md};
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const WorkoutStats = styled.div`
  display: flex;
  justify-content: center;
  gap: ${props => props.theme.spacing.xl};
  flex-wrap: wrap;
`;

const StatItem = styled.div`
  text-align: center;

  strong {
    display: block;
    color: ${props => props.theme.colors.primary};
    font-size: ${props => props.theme.fonts.sizes.lg};
    font-weight: ${props => props.theme.fonts.weights.bold};
  }

  span {
    color: ${props => props.theme.colors.text.secondary};
    font-size: ${props => props.theme.fonts.sizes.sm};
  }
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

const SessionStats = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.md};
  align-items: center;
  font-size: ${props => props.theme.fonts.sizes.sm};
  opacity: 0.9;
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    width: 100%;
    justify-content: center;
    margin-top: ${props => props.theme.spacing.xs};
  }
`;

const SessionTitle = styled.h3`
  font-size: ${props => props.theme.fonts.sizes.xl};
  font-weight: ${props => props.theme.fonts.weights.bold};
  margin: 0;
  flex: 1;
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

const StartButton = styled.button`
  background: linear-gradient(135deg, ${props => props.theme.colors.primary} 0%, ${props => props.theme.colors.primaryDark} 100%);
  color: white;
  border: none;
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.xl};
  border-radius: ${props => props.theme.borderRadius.pill};
  font-size: ${props => props.theme.fonts.sizes.md};
  font-weight: ${props => props.theme.fonts.weights.semibold};
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.colors.shadowHover};
  }
  
  &:active {
    transform: translateY(0);
  }
`;


const ActionButtons = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.md};
  justify-content: center;
  margin-top: ${props => props.theme.spacing.xl};
`;

const ActionButton = styled.button`
  background: ${props => props.$primary ? props.theme.colors.primary : 'transparent'};
  color: ${props => props.$primary ? 'white' : props.theme.colors.primary};
  border: 2px solid ${props => props.theme.colors.primary};
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.lg};
  border-radius: ${props => props.theme.borderRadius.pill};
  font-weight: ${props => props.theme.fonts.weights.medium};
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.theme.colors.primary};
    color: white;
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.colors.shadowHover};
  }

  &:active {
    transform: translateY(0);
  }
`;


/**
 * WorkoutGenerator Component
 */
const WorkoutGenerator = ({ onWorkoutGenerated, currentWorkout }) => {
  const { setIsLoading, handleError } = useAppContext();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [hasCompletedToday, setHasCompletedToday] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [expandedSession, setExpandedSession] = useState(null);
  const [playingSession, setPlayingSession] = useState(null);
  const [completedSessions, setCompletedSessions] = useState([]);

  // Load profile on component mount
  useEffect(() => {
    loadSavedWorkouts();
    loadTodaysStatus();
    loadProfileData();
  }, []);

  // Reset completion status when workout changes
  useEffect(() => {
    setIsCompleted(false);
  }, [currentWorkout]);

  /**
   * Load previously saved workout sessions
   */
  const loadSavedWorkouts = useCallback(async () => {
    try {
      await workoutSessionService.getAllWorkoutSessions();
      // savedWorkouts state removed for accordion refactor
    } catch (error) {
      console.error('Error loading saved workouts:', error);
      // Don't show error for this non-critical operation
    }
  }, []);

  /**
   * Load today's workout status
   */
  const loadTodaysStatus = useCallback(async () => {
    try {
      const hasCompleted = await dailyWorkoutService.hasCompletedWorkoutToday();
      setHasCompletedToday(hasCompleted);
      
      console.log('📊 Today\'s status loaded:', { hasCompleted });
    } catch (error) {
      console.error('Error loading today\'s status:', error);
      // Don't show error for this non-critical operation
    }
  }, []);

  /**
   * Load user profile data for workout generation
   */
  const loadProfileData = useCallback(async () => {
    try {
      // Try to get profile by ID first (from onboarding)
      let result = await userProfileService.getUserProfile('ella-default');
      
      if (!result.success) {
        // Fallback to getting by name
        result = await userProfileService.getUserProfileByName('Ella');
      }
      
      if (result.success && result.profile) {
        const profile = result.profile;
        
        // Map profile structure to workout generation format
        const workoutProfile = {
          goals: profile.fitnessProfile?.goals || profile.goals || [],
          level: profile.fitnessProfile?.level || profile.level || 'débutante',
          equipment: profile.equipment || [],
          preferences: profile.fitnessProfile?.preferredWorkoutTypes || profile.preferences?.workoutPreferences || profile.preferences || [],
          sessionsPerWeek: profile.schedule?.sessionsPerWeek || profile.sessionsPerWeek || 3,
          sessionDuration: profile.schedule?.sessionDuration || profile.sessionDuration || 45,
          availableDays: profile.schedule?.availableDays || profile.availableDays || []
        };
        
        setProfileData(workoutProfile);
        console.log('👤 Profile data loaded for workout generation:', workoutProfile);
      } else {
        console.log('📭 No profile found, using default settings');
      }
    } catch (error) {
      console.error('Error loading profile data:', error);
      // Don't show error for this non-critical operation
    }
  }, []);

  /**
   * Generate new workout plan
   */
  const handleGenerateWorkout = useCallback(async () => {
    setIsGenerating(true);
    
    try {
      console.log('🎯 Génération d\'un nouveau plan d\'entraînement...');
      console.log('👤 Using profile data:', profileData);
      
      // Try to generate workout using RapidAPI first with profile data
      let workoutResult = await generateWorkoutPlan(profileData);
      
      // If RapidAPI fails, use Ella service as fallback
      if (!workoutResult.success) {
        console.log('⚠️ RapidAPI failed, using Ella service fallback...');
        try {
          const { generateEllaWorkout } = await import('../services/ellaWorkoutService');
          workoutResult = await generateEllaWorkout(profileData);
          console.log('✅ Fallback to Ella service successful');
        } catch (ellaError) {
          console.warn('⚠️ Ella service also failed, using mock data:', ellaError);
          workoutResult = getMockWorkoutPlan();
        }
      }

      if (workoutResult.success) {
        // Save workout to Firebase
        const workoutId = await workoutSessionService.saveWorkoutSession(workoutResult.data);
        const savedWorkout = { ...workoutResult.data, id: workoutId };
        
        // Update parent component
        onWorkoutGenerated(savedWorkout);
        
        // Refresh saved workouts list
        await loadSavedWorkouts();
        
        console.log('✅ Plan d\'entraînement généré avec succès');
        
      } else {
        throw new Error(workoutResult.error || 'Failed to generate workout plan');
      }
      
    } catch (error) {
      console.error('❌ Erreur génération workout:', error);
      handleError(new Error(`Échec génération plan: ${error.message}`));
    } finally {
      setIsGenerating(false);
    }
  }, [profileData, onWorkoutGenerated, handleError, loadSavedWorkouts]);


  /**
   * Save current workout to favorites
   */
  const handleSaveWorkout = useCallback(async () => {
    if (!currentWorkout) return;
    
    try {
      setIsLoading(true);
      // Workout is already saved when generated, just show success
      await loadSavedWorkouts();
    } catch (error) {
      handleError(new Error('Failed to save workout'));
    } finally {
      setIsLoading(false);
    }
  }, [currentWorkout, setIsLoading, handleError, loadSavedWorkouts]);

  /**
   * Mark current workout as completed
   */
  const handleCompleteWorkout = useCallback(async () => {
    if (!currentWorkout || isCompleting) return;
    
    try {
      setIsCompleting(true);
      
      // Mark workout session as completed in Firebase
      if (currentWorkout.id) {
        await workoutSessionService.markSessionCompleted(currentWorkout.id);
      }
      
      // Update local state
      setIsCompleted(true);
      
      // Refresh saved workouts to reflect completion status
      await loadSavedWorkouts();
      
      console.log('✅ Workout marked as completed!');
      
    } catch (error) {
      console.error('Error completing workout:', error);
      handleError(new Error('Failed to mark workout as completed'));
    } finally {
      setIsCompleting(false);
    }
  }, [currentWorkout, isCompleting, handleError, loadSavedWorkouts]);

  /**
   * Mark a session as completed
   */
  const handleCompleteSession = useCallback(async (sessionId) => {
    try {
      // Add session to completed sessions
      setCompletedSessions(prev => [...prev, sessionId]);
      
      console.log('✅ Session marked as completed:', sessionId);
      
    } catch (error) {
      console.error('Error completing session:', error);
      handleError(new Error('Failed to mark session as completed'));
    }
  }, [handleError]);

  /**
   * Validate today's workout and record it in daily progress
   */
  const handleValidateDailyWorkout = useCallback(async () => {
    if (!currentWorkout || isValidating || hasCompletedToday) return;
    
    try {
      setIsValidating(true);
      
      // Record in daily workout tracking
      await dailyWorkoutService.validateWorkoutSession(currentWorkout);
      
      // Update today's status
      setHasCompletedToday(true);
      
      // Refresh status
      await loadTodaysStatus();
      
      console.log('🎉 Daily workout validated and recorded!');
      
    } catch (error) {
      console.error('Error validating daily workout:', error);
      handleError(new Error('Failed to validate daily workout'));
    } finally {
      setIsValidating(false);
    }
  }, [currentWorkout, isValidating, hasCompletedToday, handleError, loadTodaysStatus]);

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
    const sessionExercises = [
      ...(session.warmup || []),
      ...(session.mainWorkout || []),
      ...(session.cooldown || [])
    ];
    setPlayingSession(sessionExercises);
  }, []);

  /**
   * Handle workout player finish
   */
  const handleFinishSession = useCallback(() => {
    setPlayingSession(null);
  }, []);

  /**
   * Count total exercises in a session
   */
  const getSessionExerciseCount = useCallback((session) => {
    const warmupCount = session.warmup?.length || 0;
    const mainCount = session.mainWorkout?.length || 0;
    const cooldownCount = session.cooldown?.length || 0;
    return warmupCount + mainCount + cooldownCount;
  }, []);

  /**
   * Estimate session duration
   */
  const getSessionDuration = useCallback((session) => {
    // Simple estimation based on exercise count
    const exerciseCount = getSessionExerciseCount(session);
    return Math.round(exerciseCount * 3 + 10); // ~3min per exercise + 10min overhead
  }, [getSessionExerciseCount]);

  /**
   * Render detailed exercise list for expanded session view
   */
  const renderDetailedExerciseList = (session) => {
    const allExercises = [
      ...(session.warmup || []),
      ...(session.mainWorkout || []),
      ...(session.cooldown || [])
    ];

    return (
      <ExerciseList>
        {allExercises.slice(0, 4).map((exercise, index) => (
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
          </ExerciseListItem>
        ))}
        {allExercises.length > 4 && (
          <ExerciseListItem style={{ fontStyle: 'italic', opacity: 0.7 }}>
            +{allExercises.length - 4} autres exercices...
          </ExerciseListItem>
        )}
      </ExerciseList>
    );
  };

  return (
    <GeneratorContainer>
      {/* Header Section */}
      <GeneratorHeader>
        <Title>Générez votre entraînement parfait</Title>
        <Subtitle>
          {profileData ? (
            `Plan personnalisé pour ${profileData.level} • ${profileData.goals?.join(' + ') || 'Fitness général'} • ${profileData.sessionsPerWeek}x par semaine • ${profileData.sessionDuration} min par séance`
          ) : (
            'Obtenez un plan d\'entraînement personnalisé basé sur vos objectifs, niveau et équipement disponible.'
          )}
        </Subtitle>
      </GeneratorHeader>


      {/* Generation Section */}
      <GenerateSection>
        <WorkoutInfo>
          <InfoCard>
            <InfoIcon>🎯</InfoIcon>
            <InfoTitle>Objectifs</InfoTitle>
            <InfoValue>{profileData?.goals?.length ? profileData.goals.join(', ') : 'Fitness général'}</InfoValue>
          </InfoCard>
          <InfoCard>
            <InfoIcon>🏃‍♀️</InfoIcon>
            <InfoTitle>Niveau</InfoTitle>
            <InfoValue>{profileData?.level || 'Débutante'}</InfoValue>
          </InfoCard>
          <InfoCard>
            <InfoIcon>📅</InfoIcon>
            <InfoTitle>Fréquence</InfoTitle>
            <InfoValue>{profileData?.sessionsPerWeek || 3}x par semaine</InfoValue>
          </InfoCard>
          <InfoCard>
            <InfoIcon>⏰</InfoIcon>
            <InfoTitle>Durée</InfoTitle>
            <InfoValue>{profileData?.sessionDuration || 45} minutes</InfoValue>
          </InfoCard>
        </WorkoutInfo>

        <GenerateButton
          onClick={handleGenerateWorkout}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <>
              <LoadingSpinner size="small" text="" />
              Génération de votre entraînement...
            </>
          ) : (
            '✨ Générer un nouveau plan d\'entraînement'
          )}
        </GenerateButton>
      </GenerateSection>

      {/* Current Workout Display */}
      {currentWorkout && (
        <WorkoutDisplay>
          <WorkoutHeader>
            <WorkoutTitle>{currentWorkout.title}</WorkoutTitle>
            <WorkoutDescription>{currentWorkout.description}</WorkoutDescription>
            <WorkoutStats>
              <StatItem>
                <strong>{currentWorkout.totalSessions}</strong>
                <span>Séances</span>
              </StatItem>
              <StatItem>
                <strong>{currentWorkout.estimatedDuration} min</strong>
                <span>Par séance</span>
              </StatItem>
              <StatItem>
                <strong>{currentWorkout.level}</strong>
                <span>Difficulté</span>
              </StatItem>
            </WorkoutStats>
          </WorkoutHeader>

          {/* Sessions Grid - Accordion Style */}
          <SessionsGrid>
            {currentWorkout.sessions?.map((session) => {
              const isExpanded = expandedSession === session.id;
              const exerciseCount = getSessionExerciseCount(session);
              const duration = getSessionDuration(session);
              const isCompleted = completedSessions.includes(session.id);
              
              return (
                <SessionCard 
                  key={session.id} 
                  onClick={() => handleSessionClick(session.id)}
                  isCompleted={isCompleted}
                >
                  <SessionHeader>
                    <div>
                      <SessionTitle>{session.title}</SessionTitle>
                    </div>
                    <SessionStats>
                      <span>💪 {exerciseCount} Exercices</span>
                      <span>⏱️ {duration} min</span>
                      <SessionStatus $completed={isCompleted}>
                        {isCompleted ? '✅ Terminé' : 'À faire'}
                      </SessionStatus>
                    </SessionStats>
                  </SessionHeader>
                  
                  <SessionContent $expanded={isExpanded}>
                    {renderDetailedExerciseList(session)}
                    <StartButton onClick={(e) => handleStartSession(session, e)}>
                      🚀 Commencer la séance
                    </StartButton>
                    {!isCompleted && (
                      <StartButton 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCompleteSession(session.id);
                        }}
                        style={{ marginTop: '8px', background: '#4caf50' }}
                      >
                        ✅ Marquer comme terminé
                      </StartButton>
                    )}
                  </SessionContent>
                </SessionCard>
              );
            })}
          </SessionsGrid>

          {/* Action Buttons */}
          <ActionButtons>
            <ActionButton onClick={handleGenerateWorkout}>
              🔄 Générer un nouveau plan
            </ActionButton>
            <ActionButton onClick={handleSaveWorkout}>
              ❤️ Ajouter aux favoris
            </ActionButton>
            <ActionButton 
              $primary 
              onClick={handleCompleteWorkout}
              disabled={isCompleting || isCompleted}
            >
              {isCompleting ? (
                <>Chargement...</>
              ) : isCompleted ? (
                '✅ Terminé !'
              ) : (
                '✨ Marquer comme terminé'
              )}
            </ActionButton>
            <ActionButton 
              $primary 
              onClick={handleValidateDailyWorkout}
              disabled={isValidating || hasCompletedToday}
              style={{
                background: hasCompletedToday ? '#4caf50' : undefined,
                transform: hasCompletedToday ? 'none' : undefined
              }}
            >
              {isValidating ? (
                <>
                  <LoadingSpinner size="small" text="" />
                  Validation...
                </>
              ) : hasCompletedToday ? (
                '🎉 Validé aujourd\'hui !'
              ) : (
                '📊 Valider l\'entraînement du jour'
              )}
            </ActionButton>
          </ActionButtons>
        </WorkoutDisplay>
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