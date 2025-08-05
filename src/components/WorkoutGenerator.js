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

// Enhanced Exercise Card Components
const EnhancedExerciseCard = styled.div`
  background: ${props => props.theme.colors.secondary};
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.large};
  padding: ${props => props.theme.spacing.xl};
  margin-bottom: ${props => props.theme.spacing.lg};
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;

  &:hover {
    border-color: ${props => props.theme.colors.primary};
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(255, 105, 180, 0.15);
  }
`;

const ExerciseHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${props => props.theme.spacing.md};
  flex-wrap: wrap;
  gap: ${props => props.theme.spacing.sm};
`;

const ExerciseMetrics = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${props => props.theme.spacing.xs};
`;

const MetricBadge = styled.span`
  background: ${props => props.theme.colors.primary}20;
  color: ${props => props.theme.colors.primary};
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  border-radius: ${props => props.theme.borderRadius.pill};
  font-size: ${props => props.theme.fonts.sizes.sm};
  font-weight: ${props => props.theme.fonts.weights.medium};
`;

const PatternBadge = styled(MetricBadge)`
  background: ${props => props.theme.colors.success}20;
  color: ${props => props.theme.colors.success};
  font-weight: ${props => props.theme.fonts.weights.semibold};
`;

const ExerciseDescription = styled.p`
  color: ${props => props.theme.colors.text.secondary};
  font-size: ${props => props.theme.fonts.sizes.md};
  line-height: 1.6;
  margin-bottom: ${props => props.theme.spacing.md};
  font-style: italic;
`;

const InstructionSection = styled.div`
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const InstructionTitle = styled.h4`
  color: ${props => props.theme.colors.primary};
  font-size: ${props => props.theme.fonts.sizes.md};
  font-weight: ${props => props.theme.fonts.weights.semibold};
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const InstructionList = styled.ol`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const InstructionItem = styled.li`
  display: flex;
  align-items: flex-start;
  margin-bottom: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.sm};
  background: ${props => props.theme.colors.background.secondary};
  border-radius: ${props => props.theme.borderRadius.medium};
`;

const StepNumber = styled.span`
  background: ${props => props.theme.colors.primary};
  color: white;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${props => props.theme.fonts.sizes.sm};
  font-weight: ${props => props.theme.fonts.weights.bold};
  margin-right: ${props => props.theme.spacing.sm};
  flex-shrink: 0;
`;

const StepText = styled.span`
  color: ${props => props.theme.colors.text.primary};
  font-size: ${props => props.theme.fonts.sizes.md};
  line-height: 1.5;
`;

const SubExerciseSection = styled.div`
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const SubExerciseTitle = styled.h4`
  color: ${props => props.theme.colors.primary};
  font-size: ${props => props.theme.fonts.sizes.md};
  font-weight: ${props => props.theme.fonts.weights.semibold};
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const SubExerciseList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const SubExerciseItem = styled.li`
  background: ${props => props.theme.colors.accent};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  margin-bottom: ${props => props.theme.spacing.xs};
  border-radius: ${props => props.theme.borderRadius.medium};
  border-left: 4px solid ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.text.primary};
  font-size: ${props => props.theme.fonts.sizes.md};
`;

const TipsSection = styled.div`
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const TipsTitle = styled.h4`
  color: ${props => props.theme.colors.warning};
  font-size: ${props => props.theme.fonts.sizes.md};
  font-weight: ${props => props.theme.fonts.weights.semibold};
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const TipsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const TipItem = styled.li`
  background: ${props => props.theme.colors.warning}10;
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  margin-bottom: ${props => props.theme.spacing.xs};
  border-radius: ${props => props.theme.borderRadius.medium};
  border-left: 4px solid ${props => props.theme.colors.warning};
  color: ${props => props.theme.colors.text.primary};
  font-size: ${props => props.theme.fonts.sizes.sm};
  font-style: italic;
`;

const ModificationSection = styled.div`
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const ModificationTitle = styled.h4`
  color: ${props => props.theme.colors.success};
  font-size: ${props => props.theme.fonts.sizes.md};
  font-weight: ${props => props.theme.fonts.weights.semibold};
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const ModificationList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const ModificationItem = styled.li`
  background: ${props => props.theme.colors.success}10;
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  margin-bottom: ${props => props.theme.spacing.xs};
  border-radius: ${props => props.theme.borderRadius.medium};
  border-left: 4px solid ${props => props.theme.colors.success};
  color: ${props => props.theme.colors.text.primary};
  font-size: ${props => props.theme.fonts.sizes.sm};
`;

const VariationSection = styled.div`
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const VariationTitle = styled.h4`
  color: ${props => props.theme.colors.primaryDark};
  font-size: ${props => props.theme.fonts.sizes.md};
  font-weight: ${props => props.theme.fonts.weights.semibold};
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const VariationList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const VariationItem = styled.li`
  background: ${props => props.theme.colors.primaryDark}10;
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  margin-bottom: ${props => props.theme.spacing.xs};
  border-radius: ${props => props.theme.borderRadius.medium};
  border-left: 4px solid ${props => props.theme.colors.primaryDark};
  color: ${props => props.theme.colors.text.primary};
  font-size: ${props => props.theme.fonts.sizes.sm};
`;

const ClickHint = styled.div`
  position: absolute;
  bottom: ${props => props.theme.spacing.sm};
  right: ${props => props.theme.spacing.sm};
  background: ${props => props.theme.colors.primary}20;
  color: ${props => props.theme.colors.primary};
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  border-radius: ${props => props.theme.borderRadius.pill};
  font-size: ${props => props.theme.fonts.sizes.xs};
  font-weight: ${props => props.theme.fonts.weights.medium};
  opacity: 0.7;
  transition: opacity 0.3s ease;

  ${EnhancedExerciseCard}:hover & {
    opacity: 1;
  }
`;

/**
 * WorkoutGenerator Component
 */
const WorkoutGenerator = ({ onWorkoutGenerated, onExerciseSelect, currentWorkout }) => {
  const { setIsLoading, handleError } = useAppContext();
  const [isGenerating, setIsGenerating] = useState(false);
  const [savedWorkouts, setSavedWorkouts] = useState([]);
  const [isCompleting, setIsCompleting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [hasCompletedToday, setHasCompletedToday] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [todaysStats, setTodaysStats] = useState(null);
  const [profileData, setProfileData] = useState(null);

  // Load saved workouts and profile on component mount
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
      const workouts = await workoutSessionService.getAllWorkoutSessions();
      setSavedWorkouts(workouts.slice(0, 5)); // Show last 5 workouts
    } catch (error) {
      console.error('Error loading saved workouts:', error);
      // Don't show error for this non-critical operation
    }
  }, []);

  /**
   * Load today's workout status and stats
   */
  const loadTodaysStatus = useCallback(async () => {
    try {
      const hasCompleted = await dailyWorkoutService.hasCompletedWorkoutToday();
      const weeklyStats = await dailyWorkoutService.getWeeklyStats();
      
      setHasCompletedToday(hasCompleted);
      setTodaysStats(weeklyStats);
      
      console.log('📊 Today\'s status loaded:', { hasCompleted, weeklyStats });
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
      
      // Refresh stats
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
   * Render exercise phase with enhanced, clear instructions
   */
  const renderExercisePhase = (title, exercises) => {
    if (!exercises || exercises.length === 0) return null;

    return (
      <ExercisePhase>
        <PhaseTitle>{title}</PhaseTitle>
        <ExerciseList>
          {exercises.map((exercise) => (
            <EnhancedExerciseCard
              key={exercise.id}
              onClick={() => handleExerciseClick(exercise)}
            >
              <ExerciseHeader>
                <ExerciseName>{exercise.name}</ExerciseName>
                <ExerciseMetrics>
                  {exercise.duration && (
                    <MetricBadge>⏱️ {exercise.duration} min</MetricBadge>
                  )}
                  {exercise.sets && (
                    <MetricBadge>📊 {exercise.sets} séries</MetricBadge>
                  )}
                  {exercise.reps && (
                    <MetricBadge>🔄 {exercise.reps} répétitions</MetricBadge>
                  )}
                  {exercise.pattern && (
                    <PatternBadge>🔄 {exercise.pattern}</PatternBadge>
                  )}
                </ExerciseMetrics>
              </ExerciseHeader>

              {exercise.description && (
                <ExerciseDescription>{exercise.description}</ExerciseDescription>
              )}

              {exercise.instructions && exercise.instructions.length > 0 && (
                <InstructionSection>
                  <InstructionTitle>📝 Instructions :</InstructionTitle>
                  <InstructionList>
                    {exercise.instructions.map((instruction, index) => (
                      <InstructionItem key={index}>
                        <StepNumber>{index + 1}</StepNumber>
                        <StepText>{instruction}</StepText>
                      </InstructionItem>
                    ))}
                  </InstructionList>
                </InstructionSection>
              )}

              {exercise.exercises && exercise.exercises.length > 0 && (
                <SubExerciseSection>
                  <SubExerciseTitle>💪 Exercices dans ce set :</SubExerciseTitle>
                  <SubExerciseList>
                    {exercise.exercises.map((subExercise, index) => (
                      <SubExerciseItem key={index}>{subExercise}</SubExerciseItem>
                    ))}
                  </SubExerciseList>
                </SubExerciseSection>
              )}

              {exercise.tips && exercise.tips.length > 0 && (
                <TipsSection>
                  <TipsTitle>💡 Conseils :</TipsTitle>
                  <TipsList>
                    {exercise.tips.map((tip, index) => (
                      <TipItem key={index}>{tip}</TipItem>
                    ))}
                  </TipsList>
                </TipsSection>
              )}

              {exercise.modifications && exercise.modifications.length > 0 && (
                <ModificationSection>
                  <ModificationTitle>🔧 Options plus faciles :</ModificationTitle>
                  <ModificationList>
                    {exercise.modifications.map((mod, index) => (
                      <ModificationItem key={index}>{mod}</ModificationItem>
                    ))}
                  </ModificationList>
                </ModificationSection>
              )}

              {exercise.variations && exercise.variations.length > 0 && (
                <VariationSection>
                  <VariationTitle>🚀 Variations avancées :</VariationTitle>
                  <VariationList>
                    {exercise.variations.map((variation, index) => (
                      <VariationItem key={variation}>{variation}</VariationItem>
                    ))}
                  </VariationList>
                </VariationSection>
              )}

              <ClickHint>Cliquez pour plus de détails</ClickHint>
            </EnhancedExerciseCard>
          ))}
        </ExerciseList>
      </ExercisePhase>
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

      {/* Daily Status Section */}
      {todaysStats && (
        <GenerateSection>
          <h3 style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#ff69b4' }}>
            📊 Votre progression aujourd'hui
          </h3>
          <WorkoutInfo>
            <InfoCard>
              <InfoIcon>{hasCompletedToday ? '✅' : '⭕'}</InfoIcon>
              <InfoTitle>Aujourd'hui</InfoTitle>
              <InfoValue>{hasCompletedToday ? 'Terminé' : 'À faire'}</InfoValue>
            </InfoCard>
            <InfoCard>
              <InfoIcon>🔥</InfoIcon>
              <InfoTitle>Série</InfoTitle>
              <InfoValue>{todaysStats.streak} jours</InfoValue>
            </InfoCard>
            <InfoCard>
              <InfoIcon>📈</InfoIcon>
              <InfoTitle>Cette semaine</InfoTitle>
              <InfoValue>{todaysStats.totalWorkouts}/7 jours</InfoValue>
            </InfoCard>
            <InfoCard>
              <InfoIcon>⏱️</InfoIcon>
              <InfoTitle>Temps total</InfoTitle>
              <InfoValue>{todaysStats.totalDuration} min</InfoValue>
            </InfoCard>
          </WorkoutInfo>
        </GenerateSection>
      )}

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

          {/* Sessions Grid */}
          <SessionsGrid>
            {currentWorkout.sessions?.map((session) => (
              <SessionCard key={session.id}>
                <SessionHeader>
                  <SessionNumber>Séance {session.sessionNumber}</SessionNumber>
                  <SessionTitle>{session.title}</SessionTitle>
                  <SessionType>{session.type}</SessionType>
                </SessionHeader>
                
                <SessionContent>
                  <SessionDescription>{session.description}</SessionDescription>
                  
                  {renderExercisePhase('Échauffement', session.warmup)}
                  {renderExercisePhase('Entraînement principal', session.mainWorkout)}
                  {renderExercisePhase('Retour au calme', session.cooldown)}
                </SessionContent>
              </SessionCard>
            ))}
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
    </GeneratorContainer>
  );
};

export default WorkoutGenerator;