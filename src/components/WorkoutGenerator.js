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
import { useAppContext } from '../App';
import LoadingSpinner from './LoadingSpinner';

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

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${props => props.theme.colors.shadowHover};
  }
`;

const SessionHeader = styled.div`
  background: linear-gradient(135deg, ${props => props.theme.colors.primary} 0%, ${props => props.theme.colors.primaryDark} 100%);
  color: white;
  padding: ${props => props.theme.spacing.lg};
  text-align: center;
`;

const SessionNumber = styled.div`
  font-size: ${props => props.theme.fonts.sizes.sm};
  opacity: 0.9;
  margin-bottom: ${props => props.theme.spacing.xs};
`;

const SessionTitle = styled.h3`
  font-size: ${props => props.theme.fonts.sizes.xl};
  font-weight: ${props => props.theme.fonts.weights.bold};
  margin-bottom: ${props => props.theme.spacing.xs};
`;

const SessionType = styled.div`
  background: rgba(255, 255, 255, 0.2);
  display: inline-block;
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.pill};
  font-size: ${props => props.theme.fonts.sizes.sm};
  font-weight: ${props => props.theme.fonts.weights.medium};
`;

const SessionContent = styled.div`
  padding: ${props => props.theme.spacing.lg};
`;

const SessionDescription = styled.p`
  color: ${props => props.theme.colors.text.secondary};
  margin-bottom: ${props => props.theme.spacing.lg};
  line-height: 1.6;
`;

const ExercisePhase = styled.div`
  margin-bottom: ${props => props.theme.spacing.lg};

  &:last-child {
    margin-bottom: 0;
  }
`;

const PhaseTitle = styled.h4`
  color: ${props => props.theme.colors.primary};
  font-size: ${props => props.theme.fonts.sizes.md};
  font-weight: ${props => props.theme.fonts.weights.semibold};
  margin-bottom: ${props => props.theme.spacing.sm};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const ExerciseList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.sm};
`;

const ExerciseItem = styled.div`
  background: ${props => props.theme.colors.background.secondary};
  padding: ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.medium};
  cursor: pointer;
  transition: all 0.2s ease;
  border: 2px solid transparent;

  &:hover {
    border-color: ${props => props.theme.colors.primary};
    background: ${props => props.theme.colors.primaryLight}22;
  }
`;

const ExerciseName = styled.div`
  font-weight: ${props => props.theme.fonts.weights.semibold};
  color: ${props => props.theme.colors.text.primary};
  margin-bottom: ${props => props.theme.spacing.xs};
`;

const ExerciseDetails = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.md};
  font-size: ${props => props.theme.fonts.sizes.sm};
  color: ${props => props.theme.colors.text.secondary};
  flex-wrap: wrap;
`;

const ExerciseDetail = styled.span`
  background: ${props => props.theme.colors.secondary};
  padding: ${props => props.theme.spacing.xs};
  border-radius: ${props => props.theme.borderRadius.small};
  font-weight: ${props => props.theme.fonts.weights.medium};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.md};
  justify-content: center;
  margin-top: ${props => props.theme.spacing.xl};
`;

const ActionButton = styled.button`
  background: ${props => props.primary ? props.theme.colors.primary : 'transparent'};
  color: ${props => props.primary ? 'white' : props.theme.colors.primary};
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
const WorkoutGenerator = ({ onWorkoutGenerated, onExerciseSelect, currentWorkout }) => {
  const { setIsLoading, handleError } = useAppContext();
  const [isGenerating, setIsGenerating] = useState(false);
  const [savedWorkouts, setSavedWorkouts] = useState([]);

  // Load saved workouts on component mount
  useEffect(() => {
    loadSavedWorkouts();
  }, []);

  /**
   * Load previously saved workout sessions
   */
  const loadSavedWorkouts = useCallback(async () => {
    try {
      const workouts = await workoutSessionService.getAllWorkoutSessions();
      setSavedWorkouts(workouts.slice(0, 5)); // Show last 5 workouts
    } catch (error) {
      console.error('Error loading saved workouts:', error);
      // Don't show error for this non-critical operation
    }
  }, []);

  /**
   * Generate new workout plan
   */
  const handleGenerateWorkout = useCallback(async () => {
    setIsGenerating(true);
    
    try {
      // Try to generate workout using RapidAPI
      let workoutResult;
      
      try {
        workoutResult = await generateWorkoutPlan();
      } catch (apiError) {
        console.warn('RapidAPI failed, using mock data:', apiError);
        // Fallback to mock data if API fails
        workoutResult = getMockWorkoutPlan();
      }

      if (workoutResult.success) {
        // Save workout to Firebase
        const workoutId = await workoutSessionService.saveWorkoutSession(workoutResult.data);
        const savedWorkout = { ...workoutResult.data, id: workoutId };
        
        // Update parent component
        onWorkoutGenerated(savedWorkout);
        
        // Refresh saved workouts list
        await loadSavedWorkouts();
        
      } else {
        throw new Error('Failed to generate workout plan');
      }
      
    } catch (error) {
      console.error('Workout generation error:', error);
      handleError(new Error(`Failed to generate workout: ${error.message}`));
    } finally {
      setIsGenerating(false);
    }
  }, [onWorkoutGenerated, handleError, loadSavedWorkouts]);

  /**
   * Handle exercise click
   */
  const handleExerciseClick = useCallback((exercise) => {
    onExerciseSelect(exercise);
  }, [onExerciseSelect]);

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
   * Render exercise phase
   */
  const renderExercisePhase = (title, exercises) => {
    if (!exercises || exercises.length === 0) return null;

    return (
      <ExercisePhase>
        <PhaseTitle>{title}</PhaseTitle>
        <ExerciseList>
          {exercises.map((exercise) => (
            <ExerciseItem
              key={exercise.id}
              onClick={() => handleExerciseClick(exercise)}
            >
              <ExerciseName>{exercise.name}</ExerciseName>
              <ExerciseDetails>
                {exercise.duration && (
                  <ExerciseDetail>⏱️ {exercise.duration} min</ExerciseDetail>
                )}
                {exercise.sets && (
                  <ExerciseDetail>📊 {exercise.sets} sets</ExerciseDetail>
                )}
                {exercise.reps && (
                  <ExerciseDetail>🔄 {exercise.reps} reps</ExerciseDetail>
                )}
              </ExerciseDetails>
            </ExerciseItem>
          ))}
        </ExerciseList>
      </ExercisePhase>
    );
  };

  return (
    <GeneratorContainer>
      {/* Header Section */}
      <GeneratorHeader>
        <Title>Generate Your Perfect Workout</Title>
        <Subtitle>
          Get a personalized beginner-friendly workout plan combining running and strength training, 
          designed for 3 sessions per week to help you build fitness gradually and effectively.
        </Subtitle>
      </GeneratorHeader>

      {/* Generation Section */}
      <GenerateSection>
        <WorkoutInfo>
          <InfoCard>
            <InfoIcon>🎯</InfoIcon>
            <InfoTitle>Level</InfoTitle>
            <InfoValue>Beginner</InfoValue>
          </InfoCard>
          <InfoCard>
            <InfoIcon>💪</InfoIcon>
            <InfoTitle>Goals</InfoTitle>
            <InfoValue>Running + Strength</InfoValue>
          </InfoCard>
          <InfoCard>
            <InfoIcon>📅</InfoIcon>
            <InfoTitle>Frequency</InfoTitle>
            <InfoValue>3x per week</InfoValue>
          </InfoCard>
          <InfoCard>
            <InfoIcon>⏰</InfoIcon>
            <InfoTitle>Duration</InfoTitle>
            <InfoValue>45-60 minutes</InfoValue>
          </InfoCard>
        </WorkoutInfo>

        <GenerateButton
          onClick={handleGenerateWorkout}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <>
              <LoadingSpinner size="small" text="" />
              Generating Your Workout...
            </>
          ) : (
            '✨ Generate New Workout Plan'
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
                <span>Sessions</span>
              </StatItem>
              <StatItem>
                <strong>{currentWorkout.estimatedDuration} min</strong>
                <span>Per Session</span>
              </StatItem>
              <StatItem>
                <strong>{currentWorkout.level}</strong>
                <span>Difficulty</span>
              </StatItem>
            </WorkoutStats>
          </WorkoutHeader>

          {/* Sessions Grid */}
          <SessionsGrid>
            {currentWorkout.sessions?.map((session) => (
              <SessionCard key={session.id}>
                <SessionHeader>
                  <SessionNumber>Session {session.sessionNumber}</SessionNumber>
                  <SessionTitle>{session.title}</SessionTitle>
                  <SessionType>{session.type}</SessionType>
                </SessionHeader>
                
                <SessionContent>
                  <SessionDescription>{session.description}</SessionDescription>
                  
                  {renderExercisePhase('Warm-up', session.warmup)}
                  {renderExercisePhase('Main Workout', session.mainWorkout)}
                  {renderExercisePhase('Cool-down', session.cooldown)}
                </SessionContent>
              </SessionCard>
            ))}
          </SessionsGrid>

          {/* Action Buttons */}
          <ActionButtons>
            <ActionButton onClick={handleGenerateWorkout}>
              🔄 Generate New Plan
            </ActionButton>
            <ActionButton primary onClick={handleSaveWorkout}>
              ❤️ Save to Favorites
            </ActionButton>
          </ActionButtons>
        </WorkoutDisplay>
      )}
    </GeneratorContainer>
  );
};

export default WorkoutGenerator;