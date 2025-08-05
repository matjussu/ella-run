/**
 * Workout Player Component
 * 
 * Provides a step-by-step workout experience that guides users through exercises
 * one at a time in a focused, modal-style interface.
 */

import React, { useState, useCallback } from 'react';
import styled from 'styled-components';

// Styled Components
const PlayerOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: ${props => props.theme.spacing.md};
`;

const PlayerContainer = styled.div`
  background: ${props => props.theme.colors.secondary};
  border-radius: ${props => props.theme.borderRadius.large};
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
`;

const PlayerHeader = styled.div`
  background: linear-gradient(135deg, ${props => props.theme.colors.primary} 0%, ${props => props.theme.colors.primaryDark} 100%);
  color: white;
  padding: ${props => props.theme.spacing.xl};
  text-align: center;
  position: sticky;
  top: 0;
  z-index: 10;
`;

const CloseButton = styled.button`
  position: absolute;
  top: ${props => props.theme.spacing.md};
  right: ${props => props.theme.spacing.md};
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  color: white;
  font-size: ${props => props.theme.fonts.sizes.lg};
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: scale(1.1);
  }
`;

const ProgressInfo = styled.div`
  font-size: ${props => props.theme.fonts.sizes.md};
  opacity: 0.9;
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const ProgressBar = styled.div`
  background: rgba(255, 255, 255, 0.2);
  height: 8px;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: ${props => props.theme.spacing.md};
`;

const ProgressFill = styled.div`
  background: white;
  height: 100%;
  width: ${props => props.$progress}%;
  transition: width 0.3s ease;
  border-radius: 4px;
`;

const ExerciseTitle = styled.h2`
  font-size: ${props => props.theme.fonts.sizes.xxl};
  font-weight: ${props => props.theme.fonts.weights.bold};
  margin: 0;
`;

const PlayerContent = styled.div`
  padding: ${props => props.theme.spacing.xl};
`;

const ExerciseDetails = styled.div`
  background: ${props => props.theme.colors.background.secondary};
  padding: ${props => props.theme.spacing.lg};
  border-radius: ${props => props.theme.borderRadius.medium};
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const ExerciseMetrics = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${props => props.theme.spacing.sm};
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const MetricBadge = styled.span`
  background: ${props => props.theme.colors.primary}20;
  color: ${props => props.theme.colors.primary};
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  border-radius: ${props => props.theme.borderRadius.pill};
  font-size: ${props => props.theme.fonts.sizes.sm};
  font-weight: ${props => props.theme.fonts.weights.medium};
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
  background: ${props => props.theme.colors.secondary};
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

const TipsSection = styled.div`
  background: ${props => props.theme.colors.warning}10;
  padding: ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.medium};
  border-left: 4px solid ${props => props.theme.colors.warning};
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
  color: ${props => props.theme.colors.text.primary};
  font-size: ${props => props.theme.fonts.sizes.sm};
  margin-bottom: ${props => props.theme.spacing.xs};
  font-style: italic;
  
  &:before {
    content: "💡 ";
    margin-right: ${props => props.theme.spacing.xs};
  }
`;

const NavigationButtons = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.md};
  margin-top: ${props => props.theme.spacing.xl};
  padding-top: ${props => props.theme.spacing.xl};
  border-top: 1px solid ${props => props.theme.colors.border};
`;

const NavButton = styled.button`
  flex: 1;
  background: ${props => props.$primary ? 
    `linear-gradient(135deg, ${props.theme.colors.primary} 0%, ${props.theme.colors.primaryDark} 100%)` : 
    'transparent'};
  color: ${props => props.$primary ? 'white' : props.theme.colors.primary};
  border: 2px solid ${props => props.theme.colors.primary};
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.lg};
  border-radius: ${props => props.theme.borderRadius.pill};
  font-size: ${props => props.theme.fonts.sizes.md};
  font-weight: ${props => props.theme.fonts.weights.semibold};
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover:not(:disabled) {
    background: ${props => props.theme.colors.primary};
    color: white;
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.colors.shadowHover};
  }
  
  &:active:not(:disabled) {
    transform: translateY(0);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

/**
 * WorkoutPlayer Component
 */
const WorkoutPlayer = ({ sessionExercises, onFinish }) => {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);

  const currentExercise = sessionExercises[currentExerciseIndex];
  const progress = ((currentExerciseIndex + 1) / sessionExercises.length) * 100;
  const isFirstExercise = currentExerciseIndex === 0;
  const isLastExercise = currentExerciseIndex === sessionExercises.length - 1;

  /**
   * Handle previous exercise
   */
  const handlePrevious = useCallback(() => {
    if (!isFirstExercise) {
      setCurrentExerciseIndex(prev => prev - 1);
    }
  }, [isFirstExercise]);

  /**
   * Handle next exercise
   */
  const handleNext = useCallback(() => {
    if (!isLastExercise) {
      setCurrentExerciseIndex(prev => prev + 1);
    }
  }, [isLastExercise]);

  /**
   * Handle finish session
   */
  const handleFinish = useCallback(() => {
    onFinish();
  }, [onFinish]);

  return (
    <PlayerOverlay>
      <PlayerContainer>
        <PlayerHeader>
          <CloseButton onClick={onFinish}>×</CloseButton>
          <ProgressInfo>
            Exercice {currentExerciseIndex + 1} sur {sessionExercises.length}
          </ProgressInfo>
          <ProgressBar>
            <ProgressFill $progress={progress} />
          </ProgressBar>
          <ExerciseTitle>{currentExercise.name}</ExerciseTitle>
        </PlayerHeader>

        <PlayerContent>
          <ExerciseDetails>
            <ExerciseMetrics>
              {currentExercise.duration && (
                <MetricBadge>⏱️ {currentExercise.duration} min</MetricBadge>
              )}
              {currentExercise.sets && (
                <MetricBadge>📊 {currentExercise.sets} séries</MetricBadge>
              )}
              {currentExercise.reps && (
                <MetricBadge>🔄 {currentExercise.reps} répétitions</MetricBadge>
              )}
              {currentExercise.pattern && (
                <MetricBadge>🔄 {currentExercise.pattern}</MetricBadge>
              )}
            </ExerciseMetrics>

            {currentExercise.description && (
              <ExerciseDescription>{currentExercise.description}</ExerciseDescription>
            )}
          </ExerciseDetails>

          {currentExercise.instructions && currentExercise.instructions.length > 0 && (
            <InstructionSection>
              <InstructionTitle>📝 Instructions :</InstructionTitle>
              <InstructionList>
                {currentExercise.instructions.map((instruction, index) => (
                  <InstructionItem key={index}>
                    <StepNumber>{index + 1}</StepNumber>
                    <StepText>{instruction}</StepText>
                  </InstructionItem>
                ))}
              </InstructionList>
            </InstructionSection>
          )}

          {currentExercise.tips && currentExercise.tips.length > 0 && (
            <TipsSection>
              <TipsTitle>💡 Conseils :</TipsTitle>
              <TipsList>
                {currentExercise.tips.map((tip, index) => (
                  <TipItem key={index}>{tip}</TipItem>
                ))}
              </TipsList>
            </TipsSection>
          )}

          <NavigationButtons>
            <NavButton 
              onClick={handlePrevious} 
              disabled={isFirstExercise}
            >
              ← Précédent
            </NavButton>
            
            {isLastExercise ? (
              <NavButton $primary onClick={handleFinish}>
                🎉 Terminer la séance
              </NavButton>
            ) : (
              <NavButton $primary onClick={handleNext}>
                Suivant →
              </NavButton>
            )}
          </NavigationButtons>
        </PlayerContent>
      </PlayerContainer>
    </PlayerOverlay>
  );
};

export default WorkoutPlayer;