/**
 * Main Onboarding Flow Component
 * 
 * Orchestrates the complete onboarding experience with step navigation,
 * progress tracking, and seamless transitions between steps
 */

import React from 'react';
import styled, { keyframes } from 'styled-components';
import { OnboardingProvider, useOnboarding, ONBOARDING_STEPS } from '../contexts/OnboardingContext';
import WelcomeScreen from './onboarding/WelcomeScreen';
import PersonalInfoStep from './onboarding/PersonalInfoStep';
import FitnessLevelStep from './onboarding/FitnessLevelStep';
import logoImg from '../logo_run.png';

// Simple Goals Step Component (inline for brevity)
const GoalsStep = () => {
  const { userData, updateFitnessProfile, nextStep, previousStep, canGoNext, canGoPrevious } = useOnboarding();
  
  const goals = [
    { id: 'course_à_pied', label: 'Course à Pied', icon: '🏃‍♀️', description: 'Améliorer endurance et cardio' },
    { id: 'renforcement_musculaire', label: 'Renforcement Musculaire', icon: '💪', description: 'Développer force et tonus' },
    { id: 'perte_de_poids', label: 'Perte de Poids', icon: '⚖️', description: 'Brûler des calories efficacement' },
    { id: 'gain_de_muscle', label: 'Gain de Muscle', icon: '🔥', description: 'Développer la masse musculaire' },
    { id: 'endurance', label: 'Endurance', icon: '⚡', description: 'Améliorer la résistance' },
    { id: 'flexibilité', label: 'Flexibilité', icon: '🧘‍♀️', description: 'Mobilité et souplesse' }
  ];

  const toggleGoal = (goalId) => {
    const currentGoals = userData.fitnessProfile.goals || [];
    const updatedGoals = currentGoals.includes(goalId)
      ? currentGoals.filter(g => g !== goalId)
      : [...currentGoals, goalId];
    updateFitnessProfile({ goals: updatedGoals });
  };

  return (
    <StepContainer>
      <StepHeader>
        <StepTitle>🎯 Quels sont Tes Objectifs ?</StepTitle>
        <StepDescription>Sélectionne tous les objectifs qui te motivent (minimum 1)</StepDescription>
      </StepHeader>
      
      <GoalsGrid>
        {goals.map(goal => (
          <GoalCard 
            key={goal.id}
            selected={userData.fitnessProfile.goals?.includes(goal.id)}
            onClick={() => toggleGoal(goal.id)}
          >
            <GoalIcon>{goal.icon}</GoalIcon>
            <GoalTitle>{goal.label}</GoalTitle>
            <GoalDescription>{goal.description}</GoalDescription>
          </GoalCard>
        ))}
      </GoalsGrid>

      <ButtonContainer>
        <Button variant="secondary" onClick={previousStep} disabled={!canGoPrevious()}>← Retour</Button>
        <Button variant="primary" onClick={nextStep} disabled={!canGoNext()}>Continuer →</Button>
      </ButtonContainer>
    </StepContainer>
  );
};

// Target Areas Step Component (inline for brevity)
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
            selected={userData.fitnessProfile.targetAreas?.includes(area.id)}
            onClick={() => toggleArea(area.id)}
          >
            <GoalIcon>{area.icon}</GoalIcon>
            <GoalTitle>{area.label}</GoalTitle>
          </GoalCard>
        ))}
      </GoalsGrid>

      <ButtonContainer>
        <Button variant="secondary" onClick={previousStep} disabled={!canGoPrevious()}>← Retour</Button>
        <Button variant="primary" onClick={nextStep} disabled={!canGoNext()}>Continuer →</Button>
      </ButtonContainer>
    </StepContainer>
  );
};

// Schedule Step Component (inline for brevity)
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
        <Button variant="secondary" onClick={previousStep} disabled={!canGoPrevious()}>← Retour</Button>
        <Button variant="primary" onClick={nextStep} disabled={!canGoNext()}>Continuer →</Button>
      </ButtonContainer>
    </StepContainer>
  );
};

// Completion Step Component (inline for brevity)
const CompletionStep = () => {
  const { userData, completeOnboarding, isLoading } = useOnboarding();

  const handleComplete = async () => {
    const result = await completeOnboarding();
    if (result.success) {
      window.location.reload(); // Reload to show main app
    }
  };

  return (
    <StepContainer>
      <StepHeader>
        <CompletionLogo src={logoImg} alt="ELLA Run" />
        <StepTitle>🎉 Félicitations !</StepTitle>
        <StepDescription>
          Ton profil personnalisé est prêt ! Découvre maintenant des entraînements parfaitement adaptés à tes objectifs.
        </StepDescription>
      </StepHeader>

      <SummaryCard>
        <SummaryTitle>📋 Ton Profil</SummaryTitle>
        <SummaryGrid>
          <SummaryItem>
            <strong>👤 {userData.personalInfo.name}</strong>
            <span>{userData.personalInfo.age} ans • {userData.personalInfo.height}cm • {userData.personalInfo.weight}kg</span>
            {userData.personalInfo.bmi && <span>IMC: {userData.personalInfo.bmi}</span>}
          </SummaryItem>
          
          <SummaryItem>
            <strong>💪 Niveau: {userData.fitnessProfile.level}</strong>
            <span>{userData.schedule.sessionsPerWeek} séances/semaine • {userData.schedule.sessionDuration}min</span>
          </SummaryItem>
          
          <SummaryItem>
            <strong>🎯 Objectifs:</strong>
            <span>{userData.fitnessProfile.goals?.map(g => g.replace('_', ' ')).join(', ')}</span>
          </SummaryItem>
          
          <SummaryItem>
            <strong>🎯 Zones ciblées:</strong>
            <span>{userData.fitnessProfile.targetAreas?.map(a => a.replace('_', ' ')).join(', ')}</span>
          </SummaryItem>
        </SummaryGrid>
      </SummaryCard>

      <CompletionButton onClick={handleComplete} disabled={isLoading}>
        {isLoading ? '⏳ Finalisation...' : '🚀 Commencer Mon Parcours !'}
      </CompletionButton>
    </StepContainer>
  );
};

// Animations
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

// Styled Components
const OnboardingContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, 
    ${props => props.theme.colors.background.secondary}30,
    ${props => props.theme.colors.secondary},
    ${props => props.theme.colors.primaryLight}20
  );
`;

const ProgressBar = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: ${props => props.theme.colors.border};
  z-index: 1000;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: linear-gradient(90deg, ${props => props.theme.colors.primary}, ${props => props.theme.colors.primaryDark});
  width: ${props => props.progress}%;
  transition: width 0.5s ease;
`;

const StepContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: ${props => props.theme.spacing.xl};
  animation: ${fadeIn} 0.5s ease-out;
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
  border: 2px solid ${props => props.selected ? props.theme.colors.primary : 'transparent'};
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

const GoalDescription = styled.p`
  font-size: ${props => props.theme.fonts.sizes.sm};
  color: ${props => props.theme.colors.text.secondary};
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

const SummaryCard = styled.div`
  background: ${props => props.theme.colors.secondary};
  border-radius: ${props => props.theme.borderRadius.large};
  padding: ${props => props.theme.spacing.xl};
  margin-bottom: ${props => props.theme.spacing.xl};
  border: 2px solid ${props => props.theme.colors.primaryLight}30;
`;

const SummaryTitle = styled.h3`
  font-size: ${props => props.theme.fonts.sizes.xl};
  color: ${props => props.theme.colors.primary};
  margin-bottom: ${props => props.theme.spacing.lg};
  text-align: center;
`;

const SummaryGrid = styled.div`
  display: grid;
  gap: ${props => props.theme.spacing.md};
`;

const SummaryItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.xs};
  padding: ${props => props.theme.spacing.md};
  background: ${props => props.theme.colors.background.secondary}30;
  border-radius: ${props => props.theme.borderRadius.small};

  strong {
    color: ${props => props.theme.colors.text.primary};
  }

  span {
    color: ${props => props.theme.colors.text.secondary};
    font-size: ${props => props.theme.fonts.sizes.sm};
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
  
  ${props => props.variant === 'primary' ? `
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

const CompletionLogo = styled.img`
  width: 100px;
  height: auto;
  border-radius: 16px;
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const CompletionButton = styled(Button)`
  width: 100%;
  font-size: ${props => props.theme.fonts.sizes.xl};
  padding: ${props => props.theme.spacing.lg};
`;

// Main component that renders appropriate step
const OnboardingContent = () => {
  const { currentStep, progress } = useOnboarding();

  const renderStep = () => {
    switch (currentStep) {
      case ONBOARDING_STEPS.WELCOME:
        return <WelcomeScreen />;
      case ONBOARDING_STEPS.PERSONAL_INFO:
        return <PersonalInfoStep />;
      case ONBOARDING_STEPS.FITNESS_LEVEL:
        return <FitnessLevelStep />;
      case ONBOARDING_STEPS.GOALS:
        return <GoalsStep />;
      case ONBOARDING_STEPS.TARGET_AREAS:
        return <TargetAreasStep />;
      case ONBOARDING_STEPS.SCHEDULE:
        return <ScheduleStep />;
      case ONBOARDING_STEPS.COMPLETION:
        return <CompletionStep />;
      default:
        return <WelcomeScreen />;
    }
  };

  return (
    <OnboardingContainer>
      <ProgressBar>
        <ProgressFill progress={progress} />
      </ProgressBar>
      {renderStep()}
    </OnboardingContainer>
  );
};

// Main exported component with provider
const OnboardingFlow = () => {
  return (
    <OnboardingProvider>
      <OnboardingContent />
    </OnboardingProvider>
  );
};

export default OnboardingFlow;