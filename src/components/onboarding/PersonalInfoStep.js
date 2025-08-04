/**
 * Personal Information Step Component
 * 
 * Collects user's basic personal information including name, age, height, and weight
 * Includes BMI calculation and health insights
 */

import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { useOnboarding } from '../../contexts/OnboardingContext';

// Animations
const slideInLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const bmiPulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

// Styled Components
const StepContainer = styled.div`
  max-width: 700px;
  margin: 0 auto;
  padding: ${props => props.theme.spacing.xl};
  animation: ${slideInLeft} 0.6s ease-out;
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
`;

const FormCard = styled.div`
  background: ${props => props.theme.colors.secondary};
  border-radius: ${props => props.theme.borderRadius.large};
  padding: ${props => props.theme.spacing.xl};
  box-shadow: ${props => props.theme.colors.shadow};
  border: 2px solid ${props => props.theme.colors.primaryLight}20;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${props => props.theme.spacing.lg};
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.sm};
`;

const Label = styled.label`
  font-size: ${props => props.theme.fonts.sizes.md};
  font-weight: ${props => props.theme.fonts.weights.semibold};
  color: ${props => props.theme.colors.text.primary};
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
`;

const Input = styled.input`
  padding: ${props => props.theme.spacing.md};
  border: 2px solid ${props => props.hasError ? props.theme.colors.error : props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.medium};
  font-size: ${props => props.theme.fonts.sizes.md};
  font-family: ${props => props.theme.fonts.primary};
  transition: all 0.3s ease;
  background: ${props => props.theme.colors.background.primary};

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
    transform: translateY(-1px);
  }

  &::placeholder {
    color: ${props => props.theme.colors.text.light};
  }
`;

const Select = styled.select`
  padding: ${props => props.theme.spacing.md};
  border: 2px solid ${props => props.hasError ? props.theme.colors.error : props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.medium};
  font-size: ${props => props.theme.fonts.sizes.md};
  font-family: ${props => props.theme.fonts.primary};
  background: ${props => props.theme.colors.background.primary};
  cursor: pointer;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
  }
`;

const ErrorMessage = styled.span`
  color: ${props => props.theme.colors.error};
  font-size: ${props => props.theme.fonts.sizes.sm};
  font-weight: ${props => props.theme.fonts.weights.medium};
  margin-top: ${props => props.theme.spacing.xs};
`;

const BMISection = styled.div`
  background: linear-gradient(135deg, ${props => props.theme.colors.primaryLight}20, ${props => props.theme.colors.background.secondary});
  border-radius: ${props => props.theme.borderRadius.medium};
  padding: ${props => props.theme.spacing.lg};
  margin-bottom: ${props => props.theme.spacing.xl};
  text-align: center;
  border: 2px solid ${props => props.theme.colors.primaryLight}30;
  animation: ${props => props.show ? bmiPulse : 'none'} 2s ease infinite;
`;

const BMIValue = styled.div`
  font-size: ${props => props.theme.fonts.sizes.xxl};
  font-weight: ${props => props.theme.fonts.weights.bold};
  color: ${props => {
    if (props.bmi < 18.5) return '#ff9800';
    if (props.bmi >= 18.5 && props.bmi < 25) return '#4caf50';
    if (props.bmi >= 25 && props.bmi < 30) return '#ff9800';
    return '#f44336';
  }};
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const BMILabel = styled.p`
  font-size: ${props => props.theme.fonts.sizes.md};
  color: ${props => props.theme.colors.text.secondary};
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const BMICategory = styled.p`
  font-size: ${props => props.theme.fonts.sizes.lg};
  font-weight: ${props => props.theme.fonts.weights.semibold};
  color: ${props => {
    if (props.bmi < 18.5) return '#ff9800';
    if (props.bmi >= 18.5 && props.bmi < 25) return '#4caf50';
    if (props.bmi >= 25 && props.bmi < 30) return '#ff9800';
    return '#f44336';
  }};
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const BMIAdvice = styled.p`
  font-size: ${props => props.theme.fonts.sizes.sm};
  color: ${props => props.theme.colors.text.primary};
  font-style: italic;
  line-height: 1.5;
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

const PersonalInfoStep = () => {
  const { 
    userData, 
    updatePersonalInfo, 
    nextStep, 
    previousStep, 
    canGoNext, 
    canGoPrevious,
    validation 
  } = useOnboarding();

  const [localData, setLocalData] = useState(userData.personalInfo);
  const [showBMI, setShowBMI] = useState(false);

  useEffect(() => {
    updatePersonalInfo(localData);
  }, [localData, updatePersonalInfo]);

  useEffect(() => {
    if (localData.height && localData.weight) {
      const timer = setTimeout(() => setShowBMI(true), 500);
      return () => clearTimeout(timer);
    } else {
      setShowBMI(false);
    }
  }, [localData.height, localData.weight]);

  const handleInputChange = (field, value) => {
    setLocalData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const calculateBMI = () => {
    if (!localData.height || !localData.weight) return null;
    const heightInM = localData.height / 100;
    return (localData.weight / (heightInM * heightInM)).toFixed(1);
  };

  const getBMICategory = (bmi) => {
    if (bmi < 18.5) return 'Insuffisance pondérale';
    if (bmi >= 18.5 && bmi < 25) return 'Poids normal';
    if (bmi >= 25 && bmi < 30) return 'Surpoids';
    return 'Obésité';
  };

  const getBMIAdvice = (bmi) => {
    if (bmi < 18.5) return 'Concentre-toi sur le renforcement musculaire et une alimentation équilibrée pour développer ta masse musculaire.';
    if (bmi >= 18.5 && bmi < 25) return 'Excellent ! Ton IMC est dans la fourchette idéale. Continue avec un programme équilibré cardio et force.';
    if (bmi >= 25 && bmi < 30) return 'Un programme combinant cardio et renforcement musculaire t\'aidera à optimiser ta composition corporelle.';
    return 'Consulte un professionnel de santé et commence doucement avec des activités adaptées à ton niveau.';
  };

  const bmi = calculateBMI();

  return (
    <StepContainer>
      <StepHeader>
        <StepTitle>📋 Parle-nous de Toi</StepTitle>
        <StepDescription>
          Ces informations nous permettent de créer ton programme parfaitement adapté à ton profil et tes besoins.
        </StepDescription>
      </StepHeader>

      <FormCard>
        <FormGrid>
          <FormGroup>
            <Label>
              👤 Prénom
            </Label>
            <Input
              type="text"
              value={localData.name || ''}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Ton prénom"
              hasError={validation.errors.name}
            />
            {validation.errors.name && (
              <ErrorMessage>{validation.errors.name}</ErrorMessage>
            )}
          </FormGroup>

          <FormGroup>
            <Label>
              🎂 Âge
            </Label>
            <Select
              value={localData.age || ''}
              onChange={(e) => handleInputChange('age', parseInt(e.target.value))}
              hasError={validation.errors.age}
            >
              <option value="">Sélectionne ton âge</option>
              {Array.from({ length: 85 }, (_, i) => i + 16).map(age => (
                <option key={age} value={age}>{age} ans</option>
              ))}
            </Select>
            {validation.errors.age && (
              <ErrorMessage>{validation.errors.age}</ErrorMessage>
            )}
          </FormGroup>

          <FormGroup>
            <Label>
              📏 Taille (cm)
            </Label>
            <Input
              type="number"
              value={localData.height || ''}
              onChange={(e) => handleInputChange('height', parseInt(e.target.value))}
              placeholder="Taille en centimètres"
              min="120"
              max="220"
              hasError={validation.errors.height}
            />
            {validation.errors.height && (
              <ErrorMessage>{validation.errors.height}</ErrorMessage>
            )}
          </FormGroup>

          <FormGroup>
            <Label>
              ⚖️ Poids (kg)
            </Label>
            <Input
              type="number"
              value={localData.weight || ''}
              onChange={(e) => handleInputChange('weight', parseInt(e.target.value))}
              placeholder="Poids en kilogrammes"
              min="30"
              max="200"
              hasError={validation.errors.weight}
            />
            {validation.errors.weight && (
              <ErrorMessage>{validation.errors.weight}</ErrorMessage>
            )}
          </FormGroup>
        </FormGrid>

        {bmi && showBMI && (
          <BMISection show={showBMI}>
            <BMIValue bmi={parseFloat(bmi)}>
              {bmi}
            </BMIValue>
            <BMILabel>Indice de Masse Corporelle (IMC)</BMILabel>
            <BMICategory bmi={parseFloat(bmi)}>
              {getBMICategory(parseFloat(bmi))}
            </BMICategory>
            <BMIAdvice>
              {getBMIAdvice(parseFloat(bmi))}
            </BMIAdvice>
          </BMISection>
        )}

        <ButtonContainer>
          <Button 
            variant="secondary" 
            onClick={previousStep}
            disabled={!canGoPrevious()}
          >
            ← Retour
          </Button>
          <Button 
            variant="primary" 
            onClick={nextStep}
            disabled={!canGoNext()}
          >
            Continuer →
          </Button>
        </ButtonContainer>
      </FormCard>
    </StepContainer>
  );
};

export default PersonalInfoStep;