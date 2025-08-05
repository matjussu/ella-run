import React from 'react';
import styled from 'styled-components';
import { useOnboarding } from '../../contexts/OnboardingContext';

// Days of the week options
const DAYS_OF_WEEK = [
  { value: 'monday', label: 'Lundi' },
  { value: 'tuesday', label: 'Mardi' },
  { value: 'wednesday', label: 'Mercredi' },
  { value: 'thursday', label: 'Jeudi' },
  { value: 'friday', label: 'Vendredi' },
  { value: 'saturday', label: 'Samedi' },
  { value: 'sunday', label: 'Dimanche' }
];

const ScheduleStep = () => {
  const { userData, updateSchedule, nextStep, previousStep, canGoNext, canGoPrevious, validation } = useOnboarding();

  const handleDayToggle = (dayValue) => {
    const currentDays = userData.schedule?.availableDays || [];
    const newDays = currentDays.includes(dayValue)
      ? currentDays.filter(day => day !== dayValue)
      : [...currentDays, dayValue];
    
    updateSchedule({ availableDays: newDays });
  };

  return (
    <StepContainer>
      <StepHeader>
        <StepTitle>📅 Ton Planning</StepTitle>
        <StepDescription>Définissons ensemble ton programme d'entraînement idéal</StepDescription>
      </StepHeader>

      {validation.errors.availableDays && (
        <ErrorMessage>
          {validation.errors.availableDays}
        </ErrorMessage>
      )}
      
      <ScheduleCard>
        <ScheduleGroup>
          <ScheduleLabel>Séances par semaine :</ScheduleLabel>
          <Select 
            value={userData.schedule.sessionsPerWeek || 3}
            onChange={(e) => updateSchedule({ sessionsPerWeek: parseInt(e.target.value) })}
          >
            {[1,2,3,4,5,6,7].map(n => <option key={n} value={n}>{n} séance{n>1?'s':''}</option>)}
          </Select>
        </ScheduleGroup>
        
        <ScheduleGroup>
          <ScheduleLabel>Durée par séance :</ScheduleLabel>
          <Select 
            value={userData.schedule.sessionDuration || 60}
            onChange={(e) => updateSchedule({ sessionDuration: parseInt(e.target.value) })}
          >
            <option value={30}>30 minutes</option>
            <option value={45}>45 minutes</option>
            <option value={60}>60 minutes</option>
            <option value={90}>90 minutes</option>
          </Select>
        </ScheduleGroup>

        <ScheduleGroup>
          <ScheduleLabel>Jours disponibles :</ScheduleLabel>
          <DaysGrid>
            {DAYS_OF_WEEK.map(day => {
              const isSelected = userData.schedule?.availableDays?.includes(day.value);
              
              return (
                <DayCard
                  key={day.value}
                  selected={isSelected}
                  onClick={() => handleDayToggle(day.value)}
                >
                  <CheckIcon selected={isSelected}>
                    ✓
                  </CheckIcon>
                  {day.label}
                </DayCard>
              );
            })}
          </DaysGrid>
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
`;

const ScheduleLabel = styled.label`
  font-weight: ${props => props.theme.fonts.weights.semiBold};
  color: ${props => props.theme.colors.text.primary};
  font-size: ${props => props.theme.fonts.sizes.md};
`;

const Select = styled.select`
  padding: ${props => props.theme.spacing.md};
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.medium};
  font-size: ${props => props.theme.fonts.sizes.md};
  background: white;
  color: ${props => props.theme.colors.text.primary};
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const DaysGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: ${props => props.theme.spacing.sm};
  margin-top: ${props => props.theme.spacing.sm};
`;

const DayCard = styled.div`
  background: ${props => props.selected ? props.theme.colors.primary + '15' : 'white'};
  border: 2px solid ${props => props.selected ? props.theme.colors.primary : props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.medium};
  padding: ${props => props.theme.spacing.md};
  text-align: center;
  cursor: pointer;
  position: relative;
  transition: all 0.3s ease;
  font-weight: ${props => props.theme.fonts.weights.semiBold};
  color: ${props => props.selected ? props.theme.colors.primary : props.theme.colors.text.primary};

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border-color: ${props => props.theme.colors.primary};
  }
`;

const CheckIcon = styled.div`
  position: absolute;
  top: 4px;
  right: 4px;
  width: 16px;
  height: 16px;
  background: ${props => props.theme.colors.primary};
  border-radius: 50%;
  display: ${props => props.selected ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 10px;
`;

const ErrorMessage = styled.div`
  background: ${props => props.theme.colors.error}15;
  color: ${props => props.theme.colors.error};
  padding: ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.medium};
  margin-bottom: ${props => props.theme.spacing.lg};
  text-align: center;
  font-size: ${props => props.theme.fonts.sizes.sm};
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