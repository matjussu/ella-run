/**
 * Fitness Level Step Component
 * 
 * Allows user to select their current fitness level with detailed descriptions
 * and visual cards for each level (Beginner, Intermediate, Advanced)
 */

import React, { useState, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useOnboarding } from '../../contexts/OnboardingContext';

// Animations
const slideInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const cardHover = keyframes`
  0% { box-shadow: 0 8px 25px rgba(255, 105, 180, 0.2); }
  100% { box-shadow: 0 15px 40px rgba(255, 105, 180, 0.3); }
`;

// Styled Components
const StepContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: ${props => props.theme.spacing.xl};
  ${css`animation: ${slideInUp} 0.6s ease-out;`}
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

const LevelsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: ${props => props.theme.spacing.xl};
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const LevelCard = styled.div`
  background: ${props => props.theme.colors.secondary};
  border-radius: ${props => props.theme.borderRadius.large};
  padding: ${props => props.theme.spacing.xl};
  border: 3px solid ${props => props.selected ? props.theme.colors.primary : 'transparent'};
  box-shadow: ${props => props.selected ? 
    '0 15px 40px rgba(255, 105, 180, 0.3)' : 
    '0 8px 25px rgba(255, 105, 180, 0.1)'
  };
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${props => props.selected ? 
      `linear-gradient(90deg, ${props.theme.colors.primary}, ${props.theme.colors.primaryDark})` : 
      'transparent'
    };
    transition: all 0.3s ease;
  }

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 50px rgba(255, 105, 180, 0.25);
    border-color: ${props => props.theme.colors.primaryLight};
  }

  &:active {
    transform: translateY(-4px);
  }
`;

const LevelIcon = styled.div`
  font-size: 4rem;
  text-align: center;
  margin-bottom: ${props => props.theme.spacing.lg};
  filter: ${props => props.selected ? 'drop-shadow(0 0 10px rgba(255, 105, 180, 0.5))' : 'none'};
  transition: all 0.3s ease;
`;

const LevelTitle = styled.h3`
  font-size: ${props => props.theme.fonts.sizes.xl};
  font-weight: ${props => props.theme.fonts.weights.bold};
  color: ${props => props.selected ? props.theme.colors.primary : props.theme.colors.text.primary};
  text-align: center;
  margin-bottom: ${props => props.theme.spacing.md};
  transition: color 0.3s ease;
`;

const LevelDescription = styled.p`
  font-size: ${props => props.theme.fonts.sizes.md};
  color: ${props => props.theme.colors.text.secondary};
  text-align: center;
  line-height: 1.6;
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const LevelFeatures = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const LevelFeature = styled.li`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  font-size: ${props => props.theme.fonts.sizes.sm};
  color: ${props => props.theme.colors.text.primary};
  margin-bottom: ${props => props.theme.spacing.sm};
  
  &::before {
    content: '✓';
    display: inline-block;
    width: 20px;
    height: 20px;
    background: ${props => props.selected ? props.theme.colors.primary : props.theme.colors.primaryLight};
    color: white;
    border-radius: 50%;
    text-align: center;
    line-height: 20px;
    font-size: 12px;
    font-weight: bold;
    flex-shrink: 0;
    transition: background 0.3s ease;
  }
`;

const SelectionIndicator = styled.div`
  position: absolute;
  top: ${props => props.theme.spacing.md};
  right: ${props => props.theme.spacing.md};
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: ${props => props.selected ? props.theme.colors.primary : 'transparent'};
  border: 2px solid ${props => props.selected ? props.theme.colors.primary : props.theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 14px;
  transition: all 0.3s ease;

  ${props => props.selected && css`
    animation: ${cardHover} 0.3s ease;
  `}
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

const MotivationalNote = styled.div`
  background: linear-gradient(135deg, ${props => props.theme.colors.primaryLight}20, ${props => props.theme.colors.background.secondary});
  border-radius: ${props => props.theme.borderRadius.medium};
  padding: ${props => props.theme.spacing.lg};
  text-align: center;
  margin-bottom: ${props => props.theme.spacing.xl};
  border: 2px solid ${props => props.theme.colors.primaryLight}30;
`;

const MotivationalText = styled.p`
  font-size: ${props => props.theme.fonts.sizes.md};
  color: ${props => props.theme.colors.primary};
  font-weight: ${props => props.theme.fonts.weights.medium};
  margin: 0;
  font-style: italic;
`;

const FitnessLevelStep = () => {
  const { 
    userData, 
    updateFitnessProfile, 
    nextStep, 
    previousStep, 
    canGoNext, 
    canGoPrevious 
  } = useOnboarding();

  const [selectedLevel, setSelectedLevel] = useState(userData.fitnessProfile.level);

  useEffect(() => {
    if (selectedLevel) {
      updateFitnessProfile({ level: selectedLevel });
    }
  }, [selectedLevel, updateFitnessProfile]);

  const fitnessLevels = [
    {
      id: 'débutante',
      icon: '🌱',
      title: 'Débutante',
      description: 'Tu commences ton parcours fitness ou tu n\'as pas fait de sport depuis longtemps.',
      features: [
        'Peu ou pas d\'expérience en fitness',
        'Exercices adaptés et progressifs',
        'Focus sur la technique et les bases',
        'Durée et intensité modérées',
        'Accompagnement étape par étape'
      ]
    },
    {
      id: 'intermédiaire',
      icon: '🚀',
      title: 'Intermédiaire',
      description: 'Tu fais du sport régulièrement depuis quelques mois et tu maîtrises les mouvements de base.',
      features: [
        '3-6 mois d\'expérience régulière',
        'Bonne maîtrise des exercices de base',
        'Prête pour plus de challenges',
        'Variation et progression des entraînements',
        'Combinaisons d\'exercices plus complexes'
      ]
    },
    {
      id: 'avancée',
      icon: '💪',
      title: 'Avancée',
      description: 'Tu t\'entraînes depuis plus d\'un an et tu cherches des défis plus intenses.',
      features: [
        'Plus d\'un an d\'expérience',
        'Excellente forme physique',
        'Techniques avancées et haute intensité',
        'Entraînements complexes et variés',
        'Objectifs de performance élevés'
      ]
    }
  ];

  const handleLevelSelect = (levelId) => {
    setSelectedLevel(levelId);
  };

  const getMotivationalMessage = () => {
    switch (selectedLevel) {
      case 'débutante':
        return "🌟 Parfait ! Chaque expert était autrefois débutant. Ton parcours va être incroyable !";
      case 'intermédiaire':
        return "🔥 Excellent ! Tu as déjà de bonnes bases. Il est temps de passer au niveau supérieur !";
      case 'avancée':
        return "⚡ Impressionnant ! Tu es prête pour des défis qui vont te faire grandir encore plus !";
      default:
        return "💖 Quel que soit ton niveau, nous sommes là pour t'accompagner vers tes objectifs !";
    }
  };

  return (
    <StepContainer>
      <StepHeader>
        <StepTitle>💪 Quel est Ton Niveau Actuel ?</StepTitle>
        <StepDescription>
          Sélectionne le niveau qui correspond le mieux à ton expérience actuelle en fitness. 
          Cela nous aide à créer des entraînements parfaitement adaptés à tes capacités.
        </StepDescription>
      </StepHeader>

      <LevelsGrid>
        {fitnessLevels.map((level) => (
          <LevelCard
            key={level.id}
            selected={selectedLevel === level.id}
            onClick={() => handleLevelSelect(level.id)}
          >
            <SelectionIndicator selected={selectedLevel === level.id}>
              {selectedLevel === level.id && '✓'}
            </SelectionIndicator>
            
            <LevelIcon selected={selectedLevel === level.id}>
              {level.icon}
            </LevelIcon>
            
            <LevelTitle selected={selectedLevel === level.id}>
              {level.title}
            </LevelTitle>
            
            <LevelDescription>
              {level.description}
            </LevelDescription>
            
            <LevelFeatures>
              {level.features.map((feature, index) => (
                <LevelFeature key={index} selected={selectedLevel === level.id}>
                  {feature}
                </LevelFeature>
              ))}
            </LevelFeatures>
          </LevelCard>
        ))}
      </LevelsGrid>

      {selectedLevel && (
        <MotivationalNote>
          <MotivationalText>
            {getMotivationalMessage()}
          </MotivationalText>
        </MotivationalNote>
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
    </StepContainer>
  );
};

export default FitnessLevelStep;