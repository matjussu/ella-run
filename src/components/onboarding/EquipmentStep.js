/**
 * Equipment Step Component
 * 
 * Allows users to select their available equipment for personalized workouts
 */

import React from 'react';
import styled from 'styled-components';
import { useOnboarding } from '../../contexts/OnboardingContext';

// Equipment options
const EQUIPMENT_OPTIONS = [
  { value: 'none', label: 'Aucun équipement', description: 'Exercices au poids du corps uniquement' },
  { value: 'dumbbells', label: 'Haltères', description: 'Poids libres pour renforcement' },
  { value: 'resistance_bands', label: 'Bandes élastiques', description: 'Résistance variable et portable' },
  { value: 'kettlebells', label: 'Kettlebells', description: 'Exercices fonctionnels' },
  { value: 'barbell', label: 'Barre olympique', description: 'Powerlifting et squats' },
  { value: 'pull_up_bar', label: 'Barre de traction', description: 'Exercices du haut du corps' },
  { value: 'yoga_mat', label: 'Tapis de yoga', description: 'Étirements et yoga' },
  { value: 'bench', label: 'Banc de musculation', description: 'Support pour exercices' },
  { value: 'cardio_machine', label: 'Machine cardio', description: 'Tapis de course, vélo, etc.' }
];

// Styled Components
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

const EquipmentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: ${props => props.theme.spacing.md};
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const EquipmentCard = styled.div`
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

const EquipmentIcon = styled.div`
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

const EquipmentName = styled.h3`
  font-size: ${props => props.theme.fonts.sizes.lg};
  font-weight: ${props => props.theme.fonts.weights.semiBold};
  color: ${props => props.theme.colors.text.primary};
  margin: 0 0 ${props => props.theme.spacing.xs};
`;

const EquipmentDescription = styled.p`
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

const EquipmentStep = () => {
  const { 
    userData, 
    updateEquipment, 
    nextStep, 
    previousStep, 
    canGoNext, 
    canGoPrevious,
    validation
  } = useOnboarding();

  const handleEquipmentToggle = (equipmentValue) => {
    const currentEquipment = userData.equipment || [];
    const newEquipment = currentEquipment.includes(equipmentValue)
      ? currentEquipment.filter(eq => eq !== equipmentValue)
      : [...currentEquipment, equipmentValue];
    
    updateEquipment(newEquipment);
  };

  const getEquipmentIcon = (equipmentValue) => {
    const icons = {
      none: '🏃',
      dumbbells: '🏋️',
      resistance_bands: '🔗',
      kettlebells: '⚖️',
      barbell: '🏋️‍♀️',
      pull_up_bar: '🎯',
      yoga_mat: '🧘',
      bench: '🪑',
      cardio_machine: '🚴'
    };
    return icons[equipmentValue] || '💪';
  };

  return (
    <StepContainer>
      <StepHeader>
        <StepTitle>Quel équipement as-tu ?</StepTitle>
        <StepSubtitle>
          Sélectionne tout l'équipement dont tu disposes pour des entraînements personnalisés
        </StepSubtitle>
      </StepHeader>

      {validation.errors.equipment && (
        <ErrorMessage>
          {validation.errors.equipment}
        </ErrorMessage>
      )}

      <EquipmentGrid>
        {EQUIPMENT_OPTIONS.map(equipment => {
          const isSelected = userData.equipment?.includes(equipment.value);
          
          return (
            <EquipmentCard
              key={equipment.value}
              selected={isSelected}
              onClick={() => handleEquipmentToggle(equipment.value)}
            >
              <CheckIcon selected={isSelected}>
                ✓
              </CheckIcon>
              
              <EquipmentIcon selected={isSelected}>
                {getEquipmentIcon(equipment.value)}
              </EquipmentIcon>
              
              <EquipmentName>{equipment.label}</EquipmentName>
              <EquipmentDescription>{equipment.description}</EquipmentDescription>
            </EquipmentCard>
          );
        })}
      </EquipmentGrid>

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

export default EquipmentStep;