import React from 'react';
import styled from 'styled-components';
import { useOnboarding } from '../../contexts/OnboardingContext';
import logoImg from '../../logo_run.svg';

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

const CompletionLogo = styled.img`
  width: 100px;
  height: auto;
  border-radius: 16px;
  margin-bottom: ${props => props.theme.spacing.lg};
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

const CompletionButton = styled.button`
  width: 100%;
  font-size: ${props => props.theme.fonts.sizes.xl};
  padding: ${props => props.theme.spacing.lg};
  background: linear-gradient(135deg, ${props => props.theme.colors.primary}, ${props => props.theme.colors.primaryDark});
  color: white;
  border: 2px solid ${props => props.theme.colors.primary};
  border-radius: ${props => props.theme.borderRadius.pill};
  font-weight: ${props => props.theme.fonts.weights.semibold};
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(255, 105, 180, 0.4);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export default CompletionStep;