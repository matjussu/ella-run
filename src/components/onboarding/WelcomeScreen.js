/**
 * Welcome Screen Component
 * 
 * The first step of the onboarding process with branded introduction
 * and beautiful call-to-action to start the personalization journey
 */

import React, { useEffect, useState } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useOnboarding } from '../../contexts/OnboardingContext';
import logoImg from '../../logo_run.svg'; // Updated to use SVG logo

// Animations
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const logoFloat = keyframes`
  0%, 100% { transform: translateY(0px) scale(1); }
  50% { transform: translateY(-10px) scale(1.05); }
`;

const sparkle = keyframes`
  0%, 100% { opacity: 0.7; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.2); }
`;

const gradient = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

// Styled Components
const WelcomeContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: ${props => props.theme.spacing.xl};
  background: linear-gradient(-45deg, 
    ${props => props.theme.colors.background.secondary}20,
    ${props => props.theme.colors.primaryLight}10,
    ${props => props.theme.colors.secondary},
    ${props => props.theme.colors.background.secondary}30
  );
  background-size: 400% 400%;
  ${css`animation: ${gradient} 8s ease infinite;`}
  position: relative;
  overflow: hidden;

  &::before {
    content: '✨';
    position: absolute;
    top: 10%;
    left: 10%;
    font-size: 2rem;
    ${css`animation: ${sparkle} 2s ease infinite;`}
    animation-delay: 0.5s;
  }

  &::after {
    content: '💖';
    position: absolute;
    top: 20%;
    right: 10%;
    font-size: 1.5rem;
    ${css`animation: ${sparkle} 2s ease infinite;`}
    animation-delay: 1s;
  }
`;

const ContentCard = styled.div`
  background: ${props => props.theme.colors.secondary};
  border-radius: ${props => props.theme.borderRadius.large};
  padding: ${props => props.theme.spacing.xxl};
  box-shadow: 0 20px 60px rgba(255, 105, 180, 0.15);
  text-align: center;
  max-width: 600px;
  width: 100%;
  ${css`animation: ${fadeInUp} 1s ease-out;`}
  position: relative;
  border: 2px solid ${props => props.theme.colors.primaryLight}20;
`;

const LogoContainer = styled.div`
  margin-bottom: ${props => props.theme.spacing.xl};
  ${css`animation: ${logoFloat} 4s ease-in-out infinite;`}
`;

const WelcomeLogo = styled.img`
  width: 150px;
  height: auto;
  border-radius: 20px;
  box-shadow: 0 15px 35px rgba(255, 105, 180, 0.3);
  border: 3px solid ${props => props.theme.colors.primaryLight}50;
`;

const WelcomeTitle = styled.h1`
  font-size: ${props => props.theme.fonts.sizes.xxxl};
  font-weight: ${props => props.theme.fonts.weights.bold};
  background: linear-gradient(135deg, ${props => props.theme.colors.primary}, ${props => props.theme.colors.primaryDark});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: ${props => props.theme.spacing.lg};
  line-height: 1.2;
  ${css`animation: ${fadeInUp} 1s ease-out 0.3s both;`}
`;

const WelcomeSubtitle = styled.h2`
  font-size: ${props => props.theme.fonts.sizes.xl};
  color: ${props => props.theme.colors.text.secondary};
  font-weight: ${props => props.theme.fonts.weights.medium};
  margin-bottom: ${props => props.theme.spacing.xl};
  ${css`animation: ${fadeInUp} 1s ease-out 0.5s both;`}
`;

const WelcomeDescription = styled.p`
  font-size: ${props => props.theme.fonts.sizes.lg};
  color: ${props => props.theme.colors.text.primary};
  line-height: 1.7;
  margin-bottom: ${props => props.theme.spacing.xl};
  ${css`animation: ${fadeInUp} 1s ease-out 0.7s both;`}
`;

const FeaturesList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${props => props.theme.spacing.lg};
  margin-bottom: ${props => props.theme.spacing.xl};
  ${css`animation: ${fadeInUp} 1s ease-out 0.9s both;`}
`;

const FeatureItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.medium};
  background: ${props => props.theme.colors.background.secondary}30;
  border: 1px solid ${props => props.theme.colors.primaryLight}20;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(255, 105, 180, 0.15);
    background: ${props => props.theme.colors.background.secondary}50;
  }
`;

const FeatureIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const FeatureTitle = styled.h3`
  font-size: ${props => props.theme.fonts.sizes.md};
  font-weight: ${props => props.theme.fonts.weights.semibold};
  color: ${props => props.theme.colors.primary};
  margin-bottom: ${props => props.theme.spacing.xs};
`;

const FeatureDescription = styled.p`
  font-size: ${props => props.theme.fonts.sizes.sm};
  color: ${props => props.theme.colors.text.secondary};
  line-height: 1.5;
`;

const StartButton = styled.button`
  background: linear-gradient(135deg, ${props => props.theme.colors.primary}, ${props => props.theme.colors.primaryDark});
  color: white;
  border: none;
  padding: ${props => props.theme.spacing.lg} ${props => props.theme.spacing.xxl};
  border-radius: ${props => props.theme.borderRadius.pill};
  font-size: ${props => props.theme.fonts.sizes.xl};
  font-weight: ${props => props.theme.fonts.weights.bold};
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  ${css`animation: ${fadeInUp} 1s ease-out 1.1s both;`}
  box-shadow: 0 8px 25px rgba(255, 105, 180, 0.4);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
    transition: left 0.5s;
  }

  &:hover {
    transform: translateY(-3px) scale(1.05);
    box-shadow: 0 15px 40px rgba(255, 105, 180, 0.5);
    
    &::before {
      left: 100%;
    }
  }

  &:active {
    transform: translateY(-1px) scale(1.02);
  }
`;

const MotivationalText = styled.p`
  font-style: italic;
  color: ${props => props.theme.colors.primary};
  font-size: ${props => props.theme.fonts.sizes.md};
  margin-top: ${props => props.theme.spacing.lg};
  ${css`animation: ${fadeInUp} 1s ease-out 1.3s both;`}
`;

const WelcomeScreen = () => {
  const { nextStep } = useOnboarding();
  const [animationComplete, setAnimationComplete] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationComplete(true);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const features = [
    {
      icon: '🎯',
      title: 'Personnalisation Totale',
      description: 'Entraînements adaptés à tes objectifs et ton niveau'
    },
    {
      icon: '📈',
      title: 'Suivi Intelligent',
      description: 'Analyse tes progrès et célèbre tes victoires'
    },
    {
      icon: '💪',
      title: 'Motivation Continue',
      description: 'Messages encourageants et défis personnalisés'
    },
    {
      icon: '🏃‍♀️',
      title: 'Course & Force',
      description: 'Combine cardio et renforcement musculaire'
    }
  ];

  const handleStart = () => {
    nextStep();
  };

  return (
    <WelcomeContainer>
      <ContentCard>
        <LogoContainer>
          <WelcomeLogo src={logoImg} alt="ELLA Run - Ton Partenaire Fitness" />
        </LogoContainer>

        <WelcomeTitle>
          Bienvenue dans ELLA Run ! 🌟
        </WelcomeTitle>

        <WelcomeSubtitle>
          Ton Parcours Fitness Personnalisé Commence Ici
        </WelcomeSubtitle>

        <WelcomeDescription>
          Coucou ! je suis Vachou un bot spécialement créé pour toi. Prête à transformer ta vie avec un programme fitness conçu sur mesure? 
          En quelques minutes, nous allons créer ton plan d'entraînement personnalisé qui 
          s'adapte parfaitement à tes objectifs, ton niveau et ton emploi du temps de queen.
        </WelcomeDescription>

        <FeaturesList>
          {features.map((feature, index) => (
            <FeatureItem key={index}>
              <FeatureIcon>{feature.icon}</FeatureIcon>
              <FeatureTitle>{feature.title}</FeatureTitle>
              <FeatureDescription>{feature.description}</FeatureDescription>
            </FeatureItem>
          ))}
        </FeaturesList>

        <StartButton onClick={handleStart} disabled={!animationComplete}>
          🚀 Commencer Mon Parcours
        </StartButton>

        <MotivationalText>
          "Chaque expert était autrefois un débutant. Chaque pro était autrefois un amateur." ✨
        </MotivationalText>
      </ContentCard>
    </WelcomeContainer>
  );
};

export default WelcomeScreen;
