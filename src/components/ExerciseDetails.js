/**
 * Exercise Details Component
 * 
 * Displays detailed information about a specific exercise including
 * instructions, tips, modifications, and completion tracking.
 * Integrates with Firebase for progress tracking.
 */

import React, { useState, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { exerciseService } from '../services/firebaseService';
import { useAppContext } from '../App';
import LoadingSpinner from './LoadingSpinner';

// Styled Components
const DetailsContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const BackButton = styled.button`
  background: transparent;
  border: 2px solid ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.primary};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.pill};
  font-weight: ${props => props.theme.fonts.weights.medium};
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: ${props => props.theme.spacing.xl};
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};

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

const ExerciseCard = styled.div`
  background: ${props => props.theme.colors.secondary};
  border-radius: ${props => props.theme.borderRadius.large};
  box-shadow: ${props => props.theme.colors.shadow};
  overflow: hidden;
`;

const ExerciseHeader = styled.div`
  background: linear-gradient(135deg, ${props => props.theme.colors.primary} 0%, ${props => props.theme.colors.primaryDark} 100%);
  color: white;
  padding: ${props => props.theme.spacing.xl};
  text-align: center;
`;

const ExerciseName = styled.h1`
  font-size: ${props => props.theme.fonts.sizes.xxxl};
  font-weight: ${props => props.theme.fonts.weights.bold};
  margin-bottom: ${props => props.theme.spacing.sm};
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    font-size: ${props => props.theme.fonts.sizes.xxl};
  }
`;

const ExerciseCategory = styled.div`
  background: rgba(255, 255, 255, 0.2);
  display: inline-block;
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.pill};
  font-size: ${props => props.theme.fonts.sizes.sm};
  font-weight: ${props => props.theme.fonts.weights.medium};
  margin-bottom: ${props => props.theme.spacing.md};
`;

const ExerciseDescription = styled.p`
  font-size: ${props => props.theme.fonts.sizes.lg};
  opacity: 0.9;
  line-height: 1.6;
  max-width: 600px;
  margin: 0 auto;
`;

const ExerciseContent = styled.div`
  padding: ${props => props.theme.spacing.xl};
`;

const Section = styled.div`
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

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: ${props => props.theme.spacing.md};
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const StatCard = styled.div`
  background: ${props => props.theme.colors.background.secondary};
  padding: ${props => props.theme.spacing.lg};
  border-radius: ${props => props.theme.borderRadius.medium};
  text-align: center;
`;

const StatValue = styled.div`
  font-size: ${props => props.theme.fonts.sizes.xl};
  font-weight: ${props => props.theme.fonts.weights.bold};
  color: ${props => props.theme.colors.primary};
  margin-bottom: ${props => props.theme.spacing.xs};
`;

const StatLabel = styled.div`
  font-size: ${props => props.theme.fonts.sizes.sm};
  color: ${props => props.theme.colors.text.secondary};
  font-weight: ${props => props.theme.fonts.weights.medium};
`;

const InstructionsList = styled.ol`
  list-style: none;
  counter-reset: instruction-counter;
  padding: 0;
`;

const InstructionItem = styled.li`
  counter-increment: instruction-counter;
  background: ${props => props.theme.colors.background.secondary};
  padding: ${props => props.theme.spacing.lg};
  border-radius: ${props => props.theme.borderRadius.medium};
  margin-bottom: ${props => props.theme.spacing.md};
  position: relative;
  padding-left: ${props => props.theme.spacing.xxl};

  &::before {
    content: counter(instruction-counter);
    position: absolute;
    left: ${props => props.theme.spacing.lg};
    top: ${props => props.theme.spacing.lg};
    background: ${props => props.theme.colors.primary};
    color: white;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: ${props => props.theme.fonts.weights.bold};
    font-size: ${props => props.theme.fonts.sizes.sm};
  }

  &:last-child {
    margin-bottom: 0;
  }
`;

const InstructionText = styled.p`
  margin: 0;
  line-height: 1.6;
  color: ${props => props.theme.colors.text.primary};
`;

const TagsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${props => props.theme.spacing.sm};
`;

const Tag = styled.span`
  background: ${props => props.theme.colors.primaryLight}22;
  color: ${props => props.theme.colors.primary};
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.pill};
  font-size: ${props => props.theme.fonts.sizes.sm};
  font-weight: ${props => props.theme.fonts.weights.medium};
  border: 1px solid ${props => props.theme.colors.primaryLight};
`;

const TipsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.md};
`;

const TipItem = styled.div`
  background: ${props => props.theme.colors.background.secondary};
  padding: ${props => props.theme.spacing.lg};
  border-radius: ${props => props.theme.borderRadius.medium};
  border-left: 4px solid ${props => props.theme.colors.primary};
  position: relative;
`;

const TipIcon = styled.div`
  color: ${props => props.theme.colors.primary};
  font-size: 1.2rem;
  margin-bottom: ${props => props.theme.spacing.xs};
`;

const TipText = styled.p`
  margin: 0;
  line-height: 1.6;
  color: ${props => props.theme.colors.text.primary};
`;

const MediaContainer = styled.div`
  background: ${props => props.theme.colors.background.secondary};
  border-radius: ${props => props.theme.borderRadius.medium};
  padding: ${props => props.theme.spacing.lg};
  text-align: center;
`;

const PlaceholderImage = styled.div`
  background: ${props => props.theme.colors.primaryLight}22;
  border: 2px dashed ${props => props.theme.colors.primary};
  border-radius: ${props => props.theme.borderRadius.medium};
  padding: ${props => props.theme.spacing.xxl};
  color: ${props => props.theme.colors.primary};
  font-weight: ${props => props.theme.fonts.weights.medium};
`;

const CompletionSection = styled.div`
  background: ${props => props.theme.colors.background.secondary};
  padding: ${props => props.theme.spacing.xl};
  border-radius: ${props => props.theme.borderRadius.medium};
  text-align: center;
`;

const CompletionButton = styled.button`
  background: ${props => props.completed ? props.theme.colors.success : props.theme.colors.primary};
  color: white;
  border: none;
  padding: ${props => props.theme.spacing.lg} ${props => props.theme.spacing.xl};
  border-radius: ${props => props.theme.borderRadius.pill};
  font-size: ${props => props.theme.fonts.sizes.lg};
  font-weight: ${props => props.theme.fonts.weights.semibold};
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  margin: 0 auto;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.colors.shadowHover};
    background: ${props => props.completed ? '#45a049' : props.theme.colors.primaryDark};
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

/**
 * ExerciseDetails Component
 */
const ExerciseDetails = ({ exercise, onBack }) => {
  const { setIsLoading, handleError } = useAppContext();
  const [isCompleted, setIsCompleted] = useState(false);
  const [isMarking, setIsMarking] = useState(false);
  const [exerciseData, setExerciseData] = useState(exercise);

  // Load exercise data and completion status
  useEffect(() => {
    if (exercise) {
      setExerciseData(exercise);
      loadExerciseData();
    }
  }, [exercise]);

  /**
   * Load additional exercise data from Firebase
   */
  const loadExerciseData = useCallback(async () => {
    if (!exercise?.id) return;

    try {
      // Try to get additional exercise data from Firebase
      const additionalData = await exerciseService.getExerciseById(exercise.id);
      setExerciseData(prev => ({ ...prev, ...additionalData }));
    } catch (error) {
      // If exercise doesn't exist in Firebase, use the provided data
      console.log('Exercise not in Firebase, using provided data');
    }
  }, [exercise]);

  /**
   * Toggle exercise completion status
   */
  const handleToggleCompletion = useCallback(async () => {
    setIsMarking(true);
    
    try {
      const newCompletionStatus = !isCompleted;
      setIsCompleted(newCompletionStatus);
      
      // Save completion status to Firebase (could be part of workout session)
      // For now, just update local state
      
      // Show success message
      if (newCompletionStatus) {
        console.log('Exercise marked as completed!');
      } else {
        console.log('Exercise marked as incomplete');
      }
      
    } catch (error) {
      console.error('Error updating completion status:', error);
      handleError(new Error('Failed to update exercise completion'));
      // Revert the state change
      setIsCompleted(prev => !prev);
    } finally {
      setIsMarking(false);
    }
  }, [isCompleted, handleError]);

  if (!exercise) {
    return (
      <DetailsContainer>
        <BackButton onClick={onBack}>
          ← Back to Workout
        </BackButton>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>No exercise selected</p>
        </div>
      </DetailsContainer>
    );
  }

  return (
    <DetailsContainer>
      <BackButton onClick={onBack}>
        ← Back to Workout
      </BackButton>

      <ExerciseCard>
        {/* Exercise Header */}
        <ExerciseHeader>
          <ExerciseName>{exerciseData.name}</ExerciseName>
          {exerciseData.category && (
            <ExerciseCategory>{exerciseData.category}</ExerciseCategory>
          )}
          {exerciseData.description && (
            <ExerciseDescription>{exerciseData.description}</ExerciseDescription>
          )}
        </ExerciseHeader>

        <ExerciseContent>
          {/* Exercise Stats */}
          <Section>
            <StatsGrid>
              {exerciseData.duration && (
                <StatCard>
                  <StatValue>{exerciseData.duration} min</StatValue>
                  <StatLabel>Duration</StatLabel>
                </StatCard>
              )}
              {exerciseData.sets && (
                <StatCard>
                  <StatValue>{exerciseData.sets}</StatValue>
                  <StatLabel>Sets</StatLabel>
                </StatCard>
              )}
              {exerciseData.reps && (
                <StatCard>
                  <StatValue>{exerciseData.reps}</StatValue>
                  <StatLabel>Reps</StatLabel>
                </StatCard>
              )}
              {exerciseData.restTime && (
                <StatCard>
                  <StatValue>{exerciseData.restTime}s</StatValue>
                  <StatLabel>Rest Time</StatLabel>
                </StatCard>
              )}
            </StatsGrid>
          </Section>

          {/* Instructions */}
          {exerciseData.instructions && exerciseData.instructions.length > 0 && (
            <Section>
              <SectionTitle>
                📋 Instructions
              </SectionTitle>
              <InstructionsList>
                {exerciseData.instructions.map((instruction, index) => (
                  <InstructionItem key={index}>
                    <InstructionText>{instruction}</InstructionText>
                  </InstructionItem>
                ))}
              </InstructionsList>
            </Section>
          )}

          {/* Target Muscles */}
          {exerciseData.targetMuscles && exerciseData.targetMuscles.length > 0 && (
            <Section>
              <SectionTitle>
                🎯 Target Muscles
              </SectionTitle>
              <TagsList>
                {exerciseData.targetMuscles.map((muscle, index) => (
                  <Tag key={index}>{muscle}</Tag>
                ))}
              </TagsList>
            </Section>
          )}

          {/* Equipment Needed */}
          {exerciseData.equipment && exerciseData.equipment.length > 0 && (
            <Section>
              <SectionTitle>
                🏋️ Equipment
              </SectionTitle>
              <TagsList>
                {exerciseData.equipment.map((item, index) => (
                  <Tag key={index}>{item}</Tag>
                ))}
              </TagsList>
            </Section>
          )}

          {/* Tips */}
          {exerciseData.tips && exerciseData.tips.length > 0 && (
            <Section>
              <SectionTitle>
                💡 Tips & Form Cues
              </SectionTitle>
              <TipsList>
                {exerciseData.tips.map((tip, index) => (
                  <TipItem key={index}>
                    <TipIcon>💡</TipIcon>
                    <TipText>{tip}</TipText>
                  </TipItem>
                ))}
              </TipsList>
            </Section>
          )}

          {/* Modifications */}
          {exerciseData.modifications && exerciseData.modifications.length > 0 && (
            <Section>
              <SectionTitle>
                🔄 Modifications
              </SectionTitle>
              <TipsList>
                {exerciseData.modifications.map((modification, index) => (
                  <TipItem key={index}>
                    <TipIcon>🔄</TipIcon>
                    <TipText>{modification}</TipText>
                  </TipItem>
                ))}
              </TipsList>
            </Section>
          )}

          {/* Media Placeholder */}
          <Section>
            <SectionTitle>
              🎥 Visual Guide
            </SectionTitle>
            <MediaContainer>
              {exerciseData.imageUrl || exerciseData.videoUrl ? (
                <div>
                  {exerciseData.imageUrl && (
                    <img 
                      src={exerciseData.imageUrl} 
                      alt={exerciseData.name}
                      style={{ maxWidth: '100%', borderRadius: '8px' }}
                    />
                  )}
                  {exerciseData.videoUrl && (
                    <video 
                      controls 
                      style={{ maxWidth: '100%', borderRadius: '8px' }}
                    >
                      <source src={exerciseData.videoUrl} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  )}
                </div>
              ) : (
                <PlaceholderImage>
                  📸 Exercise demonstration image/video will be available soon
                </PlaceholderImage>
              )}
            </MediaContainer>
          </Section>

          {/* Completion Tracking */}
          <Section>
            <CompletionSection>
              <SectionTitle style={{ marginBottom: '1rem', justifyContent: 'center' }}>
                ✅ Exercise Progress
              </SectionTitle>
              <CompletionButton
                completed={isCompleted}
                onClick={handleToggleCompletion}
                disabled={isMarking}
              >
                {isMarking ? (
                  <>
                    <LoadingSpinner size="small" text="" />
                    Updating...
                  </>
                ) : isCompleted ? (
                  <>
                    ✅ Completed
                  </>
                ) : (
                  <>
                    ⭕ Mark as Complete
                  </>
                )}
              </CompletionButton>
            </CompletionSection>
          </Section>
        </ExerciseContent>
      </ExerciseCard>
    </DetailsContainer>
  );
};

export default ExerciseDetails;