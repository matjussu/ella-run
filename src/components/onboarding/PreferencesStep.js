/**
 * Preferences Step Component
 * 
 * Allows users to select their workout preferences for better personalization
 */

import React from 'react';
import styled from 'styled-components';
import { useOnboarding } from '../../contexts/OnboardingContext';

// Workout preference options
const WORKOUT_PREFERENCES = [
  { value: 'hiit', label: 'HIIT', description: 'Entraînement par intervalles haute intensité' },
  { value: 'strength_training', label: 'Musculation', description: 'Renforcement musculaire avec poids' },
  { value: 'cardio', label: 'Cardio', description: 'Exercices cardiovasculaires' },
  { value: 'yoga', label: 'Yoga', description: 'Flexibilité et relaxation' },
  { value: 'pilates', label: 'Pilates', description: 'Renforcement du core et posture' },
  { value: 'bodyweight', label: 'Poids du corps', description: 'Exercices sans équipement' },
  { value: 'stretching', label: 'Étirements', description: 'Mobilité et récupération' },
  { value: 'functional', label: 'Fonctionnel', description: 'Mouvements du quotidien' },
  { value: 'dance', label: 'Danse fitness', description: 'Cardio ludique et rythmé' }
];

// Styled Components (réutilisation du style de EquipmentStep)
const StepContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: ${props => props.theme.spacing.xl};
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  justify-content: center;
`;

const StepHeader = styled.div`
  text-align: center;
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const StepTitle = styled.h1`
  font-size: ${props => props.theme.fonts.sizes.xxxl};
  font-weight: ${props => props.theme.fonts.weights.bold};
  color: ${props => props.theme.colors.primary};
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const StepSubtitle = styled.p`
  font-size: ${props => props.theme.fonts.sizes.lg};
  color: ${props => props.theme.colors.text.secondary};
  margin: 0;
`;

const PreferencesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: ${props => props.theme.spacing.md};
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const PreferenceCard = styled.div`
  background: ${props => props.theme.colors.secondary};
  border: 2px solid ${props => props.selected ? props.theme.colors.primary : 'transparent'};
  border-radius: ${props => props.theme.borderRadius.large};
  padding: ${props => props.theme.spacing.lg};
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
    border-color: ${props => props.theme.colors.primaryLight};
  }

  ${props => props.selected && `
    background: ${props.theme.colors.primaryLight}15;
    box-shadow: 0 8px 25px ${props.theme.colors.primary}20;
  `}
`;

const PreferenceIcon = styled.div`
  width: 50px;
  height: 50px;
  background: ${props => props.selected ? props.theme.colors.primary : props.theme.colors.text.secondary};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: ${props => props.theme.spacing.md};
  font-size: 24px;
  color: white;
  transition: all 0.3s ease;
`;

const PreferenceName = styled.h3`
  font-size: ${props => props.theme.fonts.sizes.lg};
  font-weight: ${props => props.theme.fonts.weights.semiBold};
  color: ${props => props.theme.colors.text.primary};
  margin: 0 0 ${props => props.theme.spacing.xs};
`;

const PreferenceDescription = styled.p`
  font-size: ${props => props.theme.fonts.sizes.sm};
  color: ${props => props.theme.colors.text.secondary};
  margin: 0;
  line-height: 1.4;
`;

const CheckIcon = styled.div`
  position: absolute;
  top: ${props => props.theme.spacing.sm};
  right: ${props => props.theme.spacing.sm};
  width: 24px;
  height: 24px;
  background: ${props => props.theme.colors.primary};
  border-radius: 50%;
  display: ${props => props.selected ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 14px;
`;

const NavigationButtons = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: ${props => props.theme.spacing.xl};
`;

const NavButton = styled.button`
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.xl};
  border: none;
  border-radius: ${props => props.theme.borderRadius.medium};
  font-size: ${props => props.theme.fonts.sizes.md};
  font-weight: ${props => props.theme.fonts.weights.semiBold};
  cursor: pointer;
  transition: all 0.3s ease;
  
  ${props => props.variant === 'primary' ? `
    background: ${props.theme.colors.primary};
    color: white;
    
    &:hover:not(:disabled) {
      background: ${props.theme.colors.primaryDark};
      transform: translateY(-1px);
    }
    
    &:disabled {
      background: ${props.theme.colors.text.disabled};
      cursor: not-allowed;
    }
  ` : `
    background: transparent;
    color: ${props.theme.colors.text.secondary};
    border: 2px solid ${props.theme.colors.border};
    
    &:hover {
      background: ${props.theme.colors.background.secondary};
      border-color: ${props.theme.colors.text.secondary};
    }
  `}
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

const PreferencesStep = () => {
  const { 
    userData, 
    updatePreferences, 
    nextStep, 
    previousStep, 
    canGoNext, 
    canGoPrevious,
    validation
  } = useOnboarding();

  const handlePreferenceToggle = (preferenceValue) => {
    const currentPreferences = userData.preferences?.workoutPreferences || [];
    const newPreferences = currentPreferences.includes(preferenceValue)
      ? currentPreferences.filter(pref => pref !== preferenceValue)
      : [...currentPreferences, preferenceValue];
    
    updatePreferences({ workoutPreferences: newPreferences });
  };

  const getPreferenceIcon = (preferenceValue) => {
    const icons = {
      hiit: '⚡',
      strength_training: '💪',
      cardio: '❤️',
      yoga: '🧘‍♀️',
      pilates: '🎯',
      bodyweight: '🏃‍♀️',
      stretching: '🤸‍♀️',
      functional: '🔧',
      dance: '💃'
    };
    return icons[preferenceValue] || '🏋️';
  };

  return (
    <StepContainer>
      <StepHeader>
        <StepTitle>Tes préférences d'exercices</StepTitle>
        <StepSubtitle>
          Choisis les types d'entraînements que tu préfères pour des séances sur mesure
        </StepSubtitle>
      </StepHeader>

      {validation.errors.workoutPreferences && (
        <ErrorMessage>
          {validation.errors.workoutPreferences}
        </ErrorMessage>
      )}

      <PreferencesGrid>
        {WORKOUT_PREFERENCES.map(preference => {
          const isSelected = userData.preferences?.workoutPreferences?.includes(preference.value);
          
          return (
            <PreferenceCard
              key={preference.value}
              selected={isSelected}
              onClick={() => handlePreferenceToggle(preference.value)}
            >
              <CheckIcon selected={isSelected}>
                ✓
              </CheckIcon>
              
              <PreferenceIcon selected={isSelected}>
                {getPreferenceIcon(preference.value)}
              </PreferenceIcon>
              
              <PreferenceName>{preference.label}</PreferenceName>
              <PreferenceDescription>{preference.description}</PreferenceDescription>
            </PreferenceCard>
          );
        })}
      </PreferencesGrid>

      <NavigationButtons>
        <NavButton 
          onClick={previousStep}
          disabled={!canGoPrevious()}
        >
          ← Précédent
        </NavButton>

        <NavButton 
          variant="primary"
          onClick={nextStep}
          disabled={!canGoNext()}
        >
          Suivant →
        </NavButton>
      </NavigationButtons>
    </StepContainer>
  );
};

export default PreferencesStep;