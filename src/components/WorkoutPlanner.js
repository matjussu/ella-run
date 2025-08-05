/**
 * Workout Planner Component
 * 
 * Focused workout page with weekly training schedule,
 * custom workout generation, and day-by-day planning
 */

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { generateWorkoutPlan } from '../services/rapidApiService';
import userProfileService from '../services/userProfileService';
import { dailyWorkoutService } from '../services/dailyWorkoutService';
import ExerciseDetails from './ExerciseDetails';

// Styled Components
const PlannerContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${props => props.theme.spacing.lg};
`;

const PlannerHeader = styled.div`
  text-align: center;
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const PlannerTitle = styled.h1`
  font-size: ${props => props.theme.fonts.sizes.xxxl};
  font-weight: ${props => props.theme.fonts.weights.bold};
  color: ${props => props.theme.colors.primary};
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const PlannerSubtitle = styled.p`
  font-size: ${props => props.theme.fonts.sizes.lg};
  color: ${props => props.theme.colors.text.secondary};
  margin: 0;
`;

const ActionCard = styled.div`
  background: ${props => props.theme.colors.secondary};
  padding: ${props => props.theme.spacing.xl};
  border-radius: ${props => props.theme.borderRadius.large};
  box-shadow: ${props => props.theme.colors.shadow};
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const GenerateSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.md};
  align-items: center;
`;

const GenerateButton = styled.button`
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.xl};
  border-radius: ${props => props.theme.borderRadius.pill};
  font-size: ${props => props.theme.fonts.sizes.lg};
  font-weight: ${props => props.theme.fonts.weights.semibold};
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 250px;
  
  &:hover:not(:disabled) {
    background: ${props => props.theme.colors.primaryDark};
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.colors.shadowHover};
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const WeeklyPlanCard = styled.div`
  background: ${props => props.theme.colors.secondary};
  border-radius: ${props => props.theme.borderRadius.large};
  box-shadow: ${props => props.theme.colors.shadow};
  overflow: hidden;
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const WeeklyPlanHeader = styled.div`
  background: linear-gradient(135deg, ${props => props.theme.colors.primary} 0%, ${props => props.theme.colors.primaryDark} 100%);
  color: white;
  padding: ${props => props.theme.spacing.lg};
  text-align: center;
`;

const WeekTitle = styled.h2`
  font-size: ${props => props.theme.fonts.sizes.xl};
  font-weight: ${props => props.theme.fonts.weights.bold};
  margin: 0;
`;

const WeekStats = styled.div`
  display: flex;
  justify-content: center;
  gap: ${props => props.theme.spacing.lg};
  margin-top: ${props => props.theme.spacing.sm};
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    flex-direction: column;
    gap: ${props => props.theme.spacing.sm};
  }
`;

const WeekStat = styled.div`
  text-align: center;
`;

const StatNumber = styled.div`
  font-size: ${props => props.theme.fonts.sizes.lg};
  font-weight: ${props => props.theme.fonts.weights.bold};
`;

const StatLabel = styled.div`
  font-size: ${props => props.theme.fonts.sizes.sm};
  opacity: 0.9;
`;

const DaysGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${props => props.theme.spacing.md};
  padding: ${props => props.theme.spacing.lg};
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

const DayCard = styled.div`
  background: ${props => props.isWorkoutDay ? props.theme.colors.background.secondary : '#f9f9f9'};
  border: 2px solid ${props => props.isWorkoutDay ? props.theme.colors.primary : '#e0e0e0'};
  border-radius: ${props => props.theme.borderRadius.medium};
  padding: ${props => props.theme.spacing.md};
  transition: all 0.3s ease;
  cursor: ${props => props.isWorkoutDay ? 'pointer' : 'default'};
  
  &:hover {
    transform: ${props => props.isWorkoutDay ? 'translateY(-2px)' : 'none'};
    box-shadow: ${props => props.isWorkoutDay ? props.theme.colors.shadowHover : 'none'};
  }
`;

const DayHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const DayName = styled.h3`
  font-size: ${props => props.theme.fonts.sizes.lg};
  font-weight: ${props => props.theme.fonts.weights.semibold};
  color: ${props => props.theme.colors.text.primary};
  margin: 0;
`;

const DayStatus = styled.span`
  font-size: ${props => props.theme.fonts.sizes.sm};
  font-weight: ${props => props.theme.fonts.weights.medium};
  color: ${props => props.isWorkoutDay ? props.theme.colors.primary : props.theme.colors.text.secondary};
`;

const WorkoutPreview = styled.div`
  margin-top: ${props => props.theme.spacing.sm};
`;

const ExerciseCount = styled.div`
  font-size: ${props => props.theme.fonts.sizes.sm};
  color: ${props => props.theme.colors.text.secondary};
  margin-bottom: ${props => props.theme.spacing.xs};
`;

const ExerciseList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.xs};
`;

const ExerciseItem = styled.div`
  background: white;
  padding: ${props => props.theme.spacing.sm};
  border-radius: ${props => props.theme.borderRadius.small};
  border-left: 3px solid ${props => props.theme.colors.primary};
  font-size: ${props => props.theme.fonts.sizes.sm};
  cursor: pointer;
  transition: background-color 0.3s ease;
  
  &:hover {
    background: ${props => props.theme.colors.background.secondary};
  }
`;

const RestDay = styled.div`
  text-align: center;
  color: ${props => props.theme.colors.text.secondary};
  font-style: italic;
  padding: ${props => props.theme.spacing.md};
`;

const LoadingSpinner = styled.div`
  text-align: center;
  padding: ${props => props.theme.spacing.xl};
  color: ${props => props.theme.colors.primary};
  font-size: ${props => props.theme.fonts.sizes.lg};
`;

const ErrorMessage = styled.div`
  background: ${props => props.theme.colors.error};
  color: white;
  padding: ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.medium};
  margin: ${props => props.theme.spacing.md} 0;
  text-align: center;
`;

// Days of the week in French
const DAYS_OF_WEEK = [
  { key: 'monday', name: 'Lundi', short: 'Lun' },
  { key: 'tuesday', name: 'Mardi', short: 'Mar' },
  { key: 'wednesday', name: 'Mercredi', short: 'Mer' },
  { key: 'thursday', name: 'Jeudi', short: 'Jeu' },
  { key: 'friday', name: 'Vendredi', short: 'Ven' },
  { key: 'saturday', name: 'Samedi', short: 'Sam' },
  { key: 'sunday', name: 'Dimanche', short: 'Dim' }
];

const WorkoutPlanner = ({ onExerciseSelect }) => {
  const [weeklyPlan, setWeeklyPlan] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedExercise, setSelectedExercise] = useState(null);

  // Load user profile on mount
  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      const profile = await userProfileService.getUserProfileByName('Ella');
      setUserProfile(profile);
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  const generateWeeklyPlan = async () => {
    if (!userProfile) {
      setError('Profil utilisateur non chargé. Veuillez configurer votre profil d\'abord.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      console.log('🏋️ Generating weekly workout plan with profile:', userProfile);

      // Map profile data to the format expected by generateWorkoutPlan
      const profileData = userProfile.profile ? {
        goals: userProfile.profile.fitnessProfile?.goals || userProfile.profile.goals || [],
        level: userProfile.profile.fitnessProfile?.level || userProfile.profile.level || 'débutante',
        equipment: userProfile.profile.equipment || [],
        preferences: userProfile.profile.fitnessProfile?.preferredWorkoutTypes || userProfile.profile.preferences?.workoutPreferences || userProfile.profile.preferences || [],
        sessionsPerWeek: userProfile.profile.schedule?.sessionsPerWeek || userProfile.profile.sessionsPerWeek || 3,
        sessionDuration: userProfile.profile.schedule?.sessionDuration || userProfile.profile.sessionDuration || 45,
        availableDays: userProfile.profile.schedule?.availableDays || userProfile.profile.availableDays || ['monday', 'wednesday', 'friday']
      } : null;
      
      console.log('🎯 Mapped profile data for API:', profileData);

      const workoutResult = await generateWorkoutPlan(profileData);

      if (workoutResult.success) {
        const plan = organizeWorkoutsByDays(workoutResult.data, profileData?.availableDays || userProfile.profile?.availableDays || ['monday', 'wednesday', 'friday']);
        setWeeklyPlan(plan);
        console.log('✅ Weekly plan generated:', plan);
      } else {
        throw new Error(workoutResult.error || 'Échec de la génération du plan');
      }
    } catch (error) {
      console.error('❌ Error generating weekly plan:', error);
      setError(`Erreur lors de la génération du plan: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const organizeWorkoutsByDays = (workoutData, availableDays) => {
    console.log('📋 Organizing workout data:', workoutData);
    
    // Extract exercises from the new session structure
    let exercises = [];
    if (workoutData.sessions && workoutData.sessions.length > 0) {
      // Flatten all exercises from all sessions
      exercises = workoutData.sessions.flatMap(session => [
        ...(session.warmup || []),
        ...(session.mainWorkout || []),
        ...(session.cooldown || [])
      ]);
    } else if (workoutData.exercises) {
      // Fallback for old structure
      exercises = workoutData.exercises;
    }
    
    console.log('💪 Extracted exercises:', exercises);
    const exercisesPerDay = Math.ceil(exercises.length / availableDays.length);
    
    const weekPlan = {};
    
    DAYS_OF_WEEK.forEach(day => {
      weekPlan[day.key] = {
        name: day.name,
        short: day.short,
        isWorkoutDay: availableDays.includes(day.key),
        exercises: [],
        completed: false
      };
    });

    // Distribute exercises across available days
    availableDays.forEach((dayKey, index) => {
      const startIdx = index * exercisesPerDay;
      const endIdx = startIdx + exercisesPerDay;
      const dayExercises = exercises.slice(startIdx, endIdx);
      
      if (weekPlan[dayKey]) {
        weekPlan[dayKey].exercises = dayExercises;
      }
    });

    return {
      weekOf: new Date(),
      totalDays: availableDays.length,
      totalExercises: exercises.length,
      estimatedTime: availableDays.length * (userProfile.sessionDuration || 45),
      days: weekPlan
    };
  };

  const handleExerciseClick = (exercise) => {
    setSelectedExercise(exercise);
    if (onExerciseSelect) {
      onExerciseSelect(exercise);
    }
  };

  const handleMarkDayComplete = async (dayKey) => {
    if (!weeklyPlan || !weeklyPlan.days[dayKey]) return;

    try {
      const dayData = weeklyPlan.days[dayKey];
      
      // Save to daily workout service
      await dailyWorkoutService.saveDailyWorkout({
        day: dayKey,
        exercises: dayData.exercises,
        duration: userProfile.sessionDuration || 45,
        userProfile: userProfile
      });

      // Update local state
      const updatedPlan = {
        ...weeklyPlan,
        days: {
          ...weeklyPlan.days,
          [dayKey]: {
            ...dayData,
            completed: true
          }
        }
      };
      
      setWeeklyPlan(updatedPlan);
      console.log('✅ Day marked as complete:', dayKey);
    } catch (error) {
      console.error('❌ Error marking day complete:', error);
    }
  };

  if (selectedExercise) {
    return (
      <ExerciseDetails
        exercise={selectedExercise}
        onBack={() => setSelectedExercise(null)}
      />
    );
  }

  return (
    <PlannerContainer>
      <PlannerHeader>
        <PlannerTitle>Planning d'Entraînement</PlannerTitle>
        <PlannerSubtitle>Génère ton programme personnalisé et organise ta semaine</PlannerSubtitle>
      </PlannerHeader>

      <ActionCard>
        <GenerateSection>
          <GenerateButton
            onClick={generateWeeklyPlan}
            disabled={loading}
          >
            {loading ? '⏳ Génération en cours...' : '🎯 Générer un Nouveau Plan'}
          </GenerateButton>
          
          {userProfile && (
            <p style={{ textAlign: 'center', color: '#666', fontSize: '14px', margin: 0 }}>
              Plan basé sur: {userProfile.availableDays?.length || 3} jours/semaine • {userProfile.sessionDuration || 45} min/session
            </p>
          )}
        </GenerateSection>
      </ActionCard>

      {error && (
        <ErrorMessage>
          {error}
        </ErrorMessage>
      )}

      {loading && (
        <LoadingSpinner>
          🏋️ Création de ton programme personnalisé...
        </LoadingSpinner>
      )}

      {weeklyPlan && (
        <WeeklyPlanCard>
          <WeeklyPlanHeader>
            <WeekTitle>
              Semaine du {weeklyPlan.weekOf.toLocaleDateString('fr-FR', { 
                day: 'numeric', 
                month: 'long' 
              })}
            </WeekTitle>
            <WeekStats>
              <WeekStat>
                <StatNumber>{weeklyPlan.totalDays}</StatNumber>
                <StatLabel>Jours d'entraînement</StatLabel>
              </WeekStat>
              <WeekStat>
                <StatNumber>{weeklyPlan.totalExercises}</StatNumber>
                <StatLabel>Exercices total</StatLabel>
              </WeekStat>
              <WeekStat>
                <StatNumber>{weeklyPlan.estimatedTime}</StatNumber>
                <StatLabel>Minutes/semaine</StatLabel>
              </WeekStat>
            </WeekStats>
          </WeeklyPlanHeader>

          <DaysGrid>
            {DAYS_OF_WEEK.map(day => {
              const dayData = weeklyPlan.days[day.key];
              
              return (
                <DayCard
                  key={day.key}
                  isWorkoutDay={dayData.isWorkoutDay}
                  onClick={() => dayData.isWorkoutDay && !dayData.completed && handleMarkDayComplete(day.key)}
                >
                  <DayHeader>
                    <DayName>{day.name}</DayName>
                    <DayStatus isWorkoutDay={dayData.isWorkoutDay}>
                      {dayData.completed ? '✅ Terminé' : 
                       dayData.isWorkoutDay ? '💪 Entraînement' : '😌 Repos'}
                    </DayStatus>
                  </DayHeader>

                  {dayData.isWorkoutDay ? (
                    <WorkoutPreview>
                      <ExerciseCount>
                        {dayData.exercises.length} exercices • ~{userProfile?.sessionDuration || 45} min
                      </ExerciseCount>
                      <ExerciseList>
                        {dayData.exercises.slice(0, 3).map((exercise, index) => (
                          <ExerciseItem
                            key={index}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleExerciseClick(exercise);
                            }}
                          >
                            {exercise.name || exercise.exercise || `Exercice ${index + 1}`}
                          </ExerciseItem>
                        ))}
                        {dayData.exercises.length > 3 && (
                          <ExerciseItem style={{ opacity: 0.7, fontStyle: 'italic' }}>
                            +{dayData.exercises.length - 3} autres exercices...
                          </ExerciseItem>
                        )}
                      </ExerciseList>
                    </WorkoutPreview>
                  ) : (
                    <RestDay>
                      Jour de repos - Récupération active recommandée
                    </RestDay>
                  )}
                </DayCard>
              );
            })}
          </DaysGrid>
        </WeeklyPlanCard>
      )}
    </PlannerContainer>
  );
};

export default WorkoutPlanner;