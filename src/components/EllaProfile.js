/**
 * Ella's Personal Profile Component
 * 
 * This component displays Ella's personal fitness profile including her stats,
 * BMI calculation, progress tracking, and personalized insights.
 */

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { userProgressService } from '../services/firebaseService';

// Ella's personal data
const ELLA_PROFILE = {
  name: 'Ella',
  weight: 63, // kg
  height: 170, // cm
  age: 25, // estimated
  fitnessLevel: 'Débutante',
  goals: ['Endurance en course', 'Renforcement musculaire'],
  targetAreas: ['Corps entier', 'Squats', 'Abdos'],
  sessionsPerWeek: 3,
  sessionDuration: '45-60 minutes',
  startDate: new Date('2024-08-01'), // When she started her fitness journey
};

// Calculate BMI
const calculateBMI = (weight, height) => {
  const heightInMeters = height / 100;
  const bmi = weight / (heightInMeters * heightInMeters);
  return Math.round(bmi * 10) / 10;
};

// BMI category
const getBMICategory = (bmi) => {
  if (bmi < 18.5) return { category: 'Poids insuffisant', color: '#2196F3' };
  if (bmi < 25) return { category: 'Poids normal', color: '#4CAF50' };
  if (bmi < 30) return { category: 'Surpoids', color: '#FF9800' };
  return { category: 'Obésité', color: '#F44336' };
};

// Calculate ideal weight range
const getIdealWeightRange = (height) => {
  const heightInMeters = height / 100;
  const minWeight = Math.round(18.5 * heightInMeters * heightInMeters);
  const maxWeight = Math.round(24.9 * heightInMeters * heightInMeters);
  return { min: minWeight, max: maxWeight };
};

// Styled Components
const ProfileContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: ${props => props.theme.spacing.lg};
`;

const ProfileHeader = styled.div`
  text-align: center;
  margin-bottom: ${props => props.theme.spacing.xxl};
  background: linear-gradient(135deg, ${props => props.theme.colors.primary} 0%, ${props => props.theme.colors.primaryDark} 100%);
  color: white;
  padding: ${props => props.theme.spacing.xxl};
  border-radius: ${props => props.theme.borderRadius.large};
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -20%;
    width: 100px;
    height: 100px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    transform: scale(3);
  }
`;

const ProfileName = styled.h1`
  font-size: ${props => props.theme.fonts.sizes.xxxl};
  font-weight: ${props => props.theme.fonts.weights.bold};
  margin-bottom: ${props => props.theme.spacing.sm};
  position: relative;
  z-index: 1;
`;

const ProfileSubtitle = styled.p`
  font-size: ${props => props.theme.fonts.sizes.lg};
  opacity: 0.9;
  margin-bottom: ${props => props.theme.spacing.lg};
  position: relative;
  z-index: 1;
`;

const WelcomeMessage = styled.div`
  font-size: ${props => props.theme.fonts.sizes.xl};
  font-weight: ${props => props.theme.fonts.weights.medium};
  position: relative;
  z-index: 1;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: ${props => props.theme.spacing.lg};
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const StatCard = styled.div`
  background: ${props => props.theme.colors.secondary};
  padding: ${props => props.theme.spacing.xl};
  border-radius: ${props => props.theme.borderRadius.large};
  box-shadow: ${props => props.theme.colors.shadow};
  text-align: center;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${props => props.theme.colors.shadowHover};
  }
`;

const StatIcon = styled.div`
  font-size: 3rem;
  margin-bottom: ${props => props.theme.spacing.md};
`;

const StatValue = styled.div`
  font-size: ${props => props.theme.fonts.sizes.xxl};
  font-weight: ${props => props.theme.fonts.weights.bold};
  color: ${props => props.theme.colors.primary};
  margin-bottom: ${props => props.theme.spacing.xs};
`;

const StatLabel = styled.div`
  font-size: ${props => props.theme.fonts.sizes.md};
  color: ${props => props.theme.colors.text.secondary};
  font-weight: ${props => props.theme.fonts.weights.medium};
`;

const StatDescription = styled.div`
  font-size: ${props => props.theme.fonts.sizes.sm};
  color: ${props => props.theme.colors.text.light};
  margin-top: ${props => props.theme.spacing.xs};
`;

const BMISection = styled.div`
  background: ${props => props.theme.colors.secondary};
  padding: ${props => props.theme.spacing.xl};
  border-radius: ${props => props.theme.borderRadius.large};
  box-shadow: ${props => props.theme.colors.shadow};
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const BMIHeader = styled.h3`
  color: ${props => props.theme.colors.primary};
  font-size: ${props => props.theme.fonts.sizes.xl};
  font-weight: ${props => props.theme.fonts.weights.bold};
  margin-bottom: ${props => props.theme.spacing.lg};
  text-align: center;
`;

const BMIDisplay = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: ${props => props.theme.spacing.lg};
  margin-bottom: ${props => props.theme.spacing.lg};
  flex-wrap: wrap;
`;

const BMIValue = styled.div`
  text-align: center;
`;

const BMINumber = styled.div`
  font-size: 3rem;
  font-weight: ${props => props.theme.fonts.weights.bold};
  color: ${props => props.color || props.theme.colors.primary};
`;

const BMICategory = styled.div`
  font-size: ${props => props.theme.fonts.sizes.lg};
  font-weight: ${props => props.theme.fonts.weights.medium};
  color: ${props => props.color || props.theme.colors.text.primary};
  margin-top: ${props => props.theme.spacing.xs};
`;

const BMIInsights = styled.div`
  background: ${props => props.theme.colors.background.secondary};
  padding: ${props => props.theme.spacing.lg};
  border-radius: ${props => props.theme.borderRadius.medium};
  font-size: ${props => props.theme.fonts.sizes.md};
  line-height: 1.6;
`;

const GoalsSection = styled.div`
  background: ${props => props.theme.colors.secondary};
  padding: ${props => props.theme.spacing.xl};
  border-radius: ${props => props.theme.borderRadius.large};
  box-shadow: ${props => props.theme.colors.shadow};
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const GoalsHeader = styled.h3`
  color: ${props => props.theme.colors.primary};
  font-size: ${props => props.theme.fonts.sizes.xl};
  font-weight: ${props => props.theme.fonts.weights.bold};
  margin-bottom: ${props => props.theme.spacing.lg};
  text-align: center;
`;

const GoalsList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${props => props.theme.spacing.md};
`;

const GoalItem = styled.div`
  background: ${props => props.theme.colors.background.secondary};
  padding: ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.medium};
  border-left: 4px solid ${props => props.theme.colors.primary};
  font-weight: ${props => props.theme.fonts.weights.medium};
`;

const MotivationalQuote = styled.div`
  background: linear-gradient(135deg, ${props => props.theme.colors.primaryLight} 0%, ${props => props.theme.colors.primary}22 100%);
  padding: ${props => props.theme.spacing.xl};
  border-radius: ${props => props.theme.borderRadius.large};
  text-align: center;
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const QuoteText = styled.div`
  font-size: ${props => props.theme.fonts.sizes.lg};
  font-style: italic;
  color: ${props => props.theme.colors.text.primary};
  margin-bottom: ${props => props.theme.spacing.sm};
  font-weight: ${props => props.theme.fonts.weights.medium};
`;

const QuoteAuthor = styled.div`
  font-size: ${props => props.theme.fonts.sizes.sm};
  color: ${props => props.theme.colors.text.secondary};
  font-weight: ${props => props.theme.fonts.weights.medium};
`;

const EllaProfile = () => {
  const [progress, setProgress] = useState(null);
  const [currentQuote, setCurrentQuote] = useState(0);
  
  // Motivational quotes for Ella
  const motivationalQuotes = [
    { text: "Les femmes fortes n'ont pas d'attitudes, elles ont des standards. Tu élèves les tiens chaque jour, Ella !", author: "Ton Coach Personnel ❤️" },
    { text: "Chaque squat te rapproche de tes objectifs. Chaque course te rend plus forte. Tu peux le faire !", author: "Crois en toi" },
    { text: "Le progrès, pas la perfection. Tu es déjà incroyable, et tu deviens encore meilleure.", author: "Ton plus grand fan" },
    { text: "Ton corps peut le faire. C'est ton esprit qu'il faut convaincre. Et Ella, ton esprit est incroyablement fort !", author: "L'esprit avant tout" },
  ];

  useEffect(() => {
    loadProgress();
    // Rotate quotes every 10 seconds
    const quoteInterval = setInterval(() => {
      setCurrentQuote(prev => (prev + 1) % motivationalQuotes.length);
    }, 10000);
    return () => clearInterval(quoteInterval);
  }, []);

  const loadProgress = async () => {
    try {
      const progressData = await userProgressService.getProgressStats();
      setProgress(progressData);
    } catch (error) {
      console.error('Error loading progress:', error);
    }
  };

  const bmi = calculateBMI(ELLA_PROFILE.weight, ELLA_PROFILE.height);
  const bmiInfo = getBMICategory(bmi);
  const idealWeight = getIdealWeightRange(ELLA_PROFILE.height);
  const daysSinceStart = Math.floor((new Date() - ELLA_PROFILE.startDate) / (1000 * 60 * 60 * 24));

  return (
    <ProfileContainer>
      {/* Profile Header */}
      <ProfileHeader>
        <ProfileName>💪 Le Parcours Fitness d'{ELLA_PROFILE.name}</ProfileName>
        <ProfileSubtitle>Ton Compagnon Fitness Personnel</ProfileSubtitle>
        <WelcomeMessage>
          Re-bonjour ma belle ! Prête à exploser tes objectifs d'aujourd'hui ? ✨
        </WelcomeMessage>
      </ProfileHeader>

      {/* Motivational Quote */}
      <MotivationalQuote>
        <QuoteText>"{motivationalQuotes[currentQuote].text}"</QuoteText>
        <QuoteAuthor>— {motivationalQuotes[currentQuote].author}</QuoteAuthor>
      </MotivationalQuote>

      {/* Personal Stats */}
      <StatsGrid>
        <StatCard>
          <StatIcon>⚖️</StatIcon>
          <StatValue>{ELLA_PROFILE.weight} kg</StatValue>
          <StatLabel>Poids Actuel</StatLabel>
          <StatDescription>Parfait pour ta taille et tes objectifs !</StatDescription>
        </StatCard>

        <StatCard>
          <StatIcon>📏</StatIcon>
          <StatValue>{ELLA_PROFILE.height} cm</StatValue>
          <StatLabel>Taille</StatLabel>
          <StatDescription>Grande et forte ! 💪</StatDescription>
        </StatCard>

        <StatCard>
          <StatIcon>🎯</StatIcon>
          <StatValue>{ELLA_PROFILE.fitnessLevel}</StatValue>
          <StatLabel>Niveau Fitness</StatLabel>
          <StatDescription>Tu construis ta force chaque jour</StatDescription>
        </StatCard>

        <StatCard>
          <StatIcon>📅</StatIcon>
          <StatValue>{daysSinceStart}</StatValue>
          <StatLabel>Jours de Parcours</StatLabel>
          <StatDescription>Chaque jour compte, Ella !</StatDescription>
        </StatCard>
      </StatsGrid>

      {/* BMI Section */}
      <BMISection>
        <BMIHeader>Tes Indicateurs de Santé</BMIHeader>
        <BMIDisplay>
          <BMIValue>
            <BMINumber color={bmiInfo.color}>{bmi}</BMINumber>
            <BMICategory color={bmiInfo.color}>{bmiInfo.category}</BMICategory>
          </BMIValue>
        </BMIDisplay>
        <BMIInsights>
          <strong>Excellente nouvelle, Ella !</strong> Ton IMC de {bmi} te place dans la catégorie "{bmiInfo.category}", 
          ce qui est parfait pour tes objectifs fitness. Avec {ELLA_PROFILE.height}cm et {ELLA_PROFILE.weight}kg, 
          tu as une excellente base pour développer force et endurance. 
          La fourchette de poids idéale pour ta taille est {idealWeight.min}-{idealWeight.max}kg, 
          et tu es exactement où tu devrais être ! 🌟
        </BMIInsights>
      </BMISection>

      {/* Goals Section */}
      <GoalsSection>
        <GoalsHeader>Tes Objectifs Personnels</GoalsHeader>
        <GoalsList>
          {ELLA_PROFILE.goals.map((goal, index) => (
            <GoalItem key={index}>
              🎯 {goal}
            </GoalItem>
          ))}
          {ELLA_PROFILE.targetAreas.map((area, index) => (
            <GoalItem key={`area-${index}`}>
              💪 Focus sur {area}
            </GoalItem>
          ))}
          <GoalItem>
            📅 {ELLA_PROFILE.sessionsPerWeek} sessions par semaine
          </GoalItem>
          <GoalItem>
            ⏰ {ELLA_PROFILE.sessionDuration} par session
          </GoalItem>
        </GoalsList>
      </GoalsSection>
    </ProfileContainer>
  );
};

export default EllaProfile;