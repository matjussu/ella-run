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
import GoalsStep from './onboarding/GoalsStep';
import TargetAreasStep from './onboarding/TargetAreasStep';
import ScheduleStep from './onboarding/ScheduleStep';
import EquipmentStep from './onboarding/EquipmentStep';
import PreferencesStep from './onboarding/PreferencesStep';
import CompletionStep from './onboarding/CompletionStep';

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
  width: ${props => props.$progress}%;
  transition: width 0.5s ease;
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
      case ONBOARDING_STEPS.EQUIPMENT:
        return <EquipmentStep />;
      case ONBOARDING_STEPS.PREFERENCES:
        return <PreferencesStep />;
      case ONBOARDING_STEPS.COMPLETION:
        return <CompletionStep />;
      default:
        return <WelcomeScreen />;
    }
  };

  return (
    <OnboardingContainer>
      <ProgressBar>
        <ProgressFill $progress={progress} />
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