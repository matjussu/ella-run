import React from 'react';
import styled from 'styled-components';
import { useOnboarding } from '../../contexts/OnboardingContext';

const ScheduleStep = () => {
  const { userData, updateSchedule, nextStep, previousStep, canGoNext, canGoPrevious } = useOnboarding();

  return (
    <StepContainer>
      <StepHeader>
        <StepTitle>📅 Ton Planning</StepTitle>
        <StepDescription>Définissons ensemble ton programme d'entraînement idéal</StepDescription>
      </StepHeader>
      
      <ScheduleCard>
        <ScheduleGroup>
          <label>Séances par semaine :</label>
          <select 
            value={userData.schedule.sessionsPerWeek || 3}
            onChange={(e) => updateSchedule({ sessionsPerWeek: parseInt(e.target.value) })}
          >
            {[1,2,3,4,5,6,7].map(n => <option key={n} value={n}>{n} séance{n>1?'s':''}</option>)}
          </select>
        </ScheduleGroup>
        
        <ScheduleGroup>
          <label>Durée par séance :</label>
          <select 
            value={userData.schedule.sessionDuration || 60}
            onChange={(e) => updateSchedule({ sessionDuration: parseInt(e.target.value) })}
          >
            <option value={30}>30 minutes</option>
            <option value={45}>45 minutes</option>
            <option value={60}>60 minutes</option>
            <option value={90}>90 minutes</option>
          </select>
        </ScheduleGroup>
      </ScheduleCard>

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

const ScheduleCard = styled.div`
  background: ${props => props.theme.colors.secondary};
  border-radius: ${props => props.theme.borderRadius.large};
  padding: ${props => props.theme.spacing.xl};
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const ScheduleGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.sm};
  margin-bottom: ${props => props.theme.spacing.lg};

  label {
    font-weight: ${props => props.theme.fonts.weights.semibold};
    color: ${props => props.theme.colors.text.primary};
  }

  select {
    padding: ${props => props.theme.spacing.md};
    border: 2px solid ${props => props.theme.colors.border};
    border-radius: ${props => props.theme.borderRadius.medium};
    font-size: ${props => props.theme.fonts.sizes.md};
  }
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

export default ScheduleStep;