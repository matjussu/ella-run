import React from 'react';
import styled from 'styled-components';
import { useOnboarding } from '../../contexts/OnboardingContext';

const TargetAreasStep = () => {
  const { userData, updateFitnessProfile, nextStep, previousStep, canGoNext, canGoPrevious } = useOnboarding();
  
  const areas = [
    { id: 'squats', label: 'Squats & Fessiers', icon: '🍑' },
    { id: 'abdos', label: 'Abdominaux', icon: '💎' },
    { id: 'corps_entier', label: 'Corps Entier', icon: '🏋️‍♀️' },
    { id: 'bras', label: 'Bras & Épaules', icon: '💪' },
    { id: 'jambes', label: 'Jambes', icon: '🦵' },
    { id: 'dos', label: 'Dos', icon: '🏃‍♀️' }
  ];

  const toggleArea = (areaId) => {
    const currentAreas = userData.fitnessProfile.targetAreas || [];
    const updatedAreas = currentAreas.includes(areaId)
      ? currentAreas.filter(a => a !== areaId)
      : [...currentAreas, areaId];
    updateFitnessProfile({ targetAreas: updatedAreas });
  };

  return (
    <StepContainer>
      <StepHeader>
        <StepTitle>🎯 Zones à Cibler</StepTitle>
        <StepDescription>Choisis les zones sur lesquelles tu veux te concentrer</StepDescription>
      </StepHeader>
      
      <GoalsGrid>
        {areas.map(area => (
          <GoalCard 
            key={area.id}
            $selected={userData.fitnessProfile.targetAreas?.includes(area.id)}
            onClick={() => toggleArea(area.id)}
          >
            <GoalIcon>{area.icon}</GoalIcon>
            <GoalTitle>{area.label}</GoalTitle>
          </GoalCard>
        ))}
      </GoalsGrid>

      <ButtonContainer>
        <Button $variant="secondary" onClick={previousStep} disabled={!canGoPrevious()}>← Retour</Button>
        <Button $variant="primary" onClick={nextStep} disabled={!canGoNext()}>Continuer →</Button>
      </ButtonContainer>
    </StepContainer>
  );
};

// Styled Components
const StepContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: ${props => props.theme.spacing.xl};
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const StepHeader = styled.div`
  text-align: center;
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const StepTitle = styled.h2`
  font-size: ${props => props.theme.fonts.sizes.xxl};
  font-weight: ${props => props.theme.fonts.weights.bold};
  color: ${props => props.theme.colors.primary};
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const StepDescription = styled.p`
  font-size: ${props => props.theme.fonts.sizes.lg};
  color: ${props => props.theme.colors.text.secondary};
  line-height: 1.6;
  max-width: 600px;
  margin: 0 auto;
`;

const GoalsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${props => props.theme.spacing.md};
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const GoalCard = styled.div`
  background: ${props => props.theme.colors.secondary};
  border: 2px solid ${props => props.$selected ? props.theme.colors.primary : 'transparent'};
  border-radius: ${props => props.theme.borderRadius.medium};
  padding: ${props => props.theme.spacing.lg};
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(255, 105, 180, 0.2);
  }
`;

const GoalIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const GoalTitle = styled.h3`
  font-size: ${props => props.theme.fonts.sizes.md};
  font-weight: ${props => props.theme.fonts.weights.semibold};
  color: ${props => props.theme.colors.text.primary};
  margin-bottom: ${props => props.theme.spacing.xs};
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: ${props => props.theme.spacing.md};
  margin-top: ${props => props.theme.spacing.xl};
`;

const Button = styled.button`
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.xl};
  border-radius: ${props => props.theme.borderRadius.pill};
  font-size: ${props => props.theme.fonts.sizes.lg};
  font-weight: ${props => props.theme.fonts.weights.semibold};
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid ${props => props.theme.colors.primary};
  
  ${props => props.$variant === 'primary' ? `
    background: linear-gradient(135deg, ${props.theme.colors.primary}, ${props.theme.colors.primaryDark});
    color: white;
    
    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(255, 105, 180, 0.4);
    }
    
    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  ` : `
    background: transparent;
    color: ${props.theme.colors.primary};
    
    &:hover {
      background: ${props.theme.colors.primaryLight}20;
      transform: translateY(-2px);
    }
  `}
`;

export default TargetAreasStep;