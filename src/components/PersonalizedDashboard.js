/**
 * Personalized Dashboard for Ella
 * 
 * This component serves as Ella's personal fitness home screen with
 * customized content, progress tracking, and motivational elements.
 */

import React, { useState, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { userProgressService, workoutSessionService } from '../services/firebaseService';
import userProfileService from '../services/userProfileService';
import { getPersonalizedDashboardContent } from '../services/personalizationService';
import logoImg from '../logo_run.png';

// Get current day for personalized greetings
const getCurrentGreeting = () => {
  const hour = new Date().getHours();
  const day = new Date().toLocaleDateString('fr-FR', { weekday: 'long' });
  
  let greeting;
  if (hour < 12) greeting = 'Bonjour';
  else if (hour < 17) greeting = 'Bon après-midi';
  else greeting = 'Bonsoir';
  
  return `${greeting}, Ella ! Bonne ${day} ! 🌟`;
};

// Get personalized daily messages
const getDailyMessage = () => {
  const messages = [
    "Aujourd'hui est parfait pour atteindre tes objectifs fitness ! 💪",
    "Ta force inspire tous ceux qui t'entourent, ma belle ! ✨",
    "Chaque entraînement te rapproche de tes rêves ! 🎯",
    "Tu ne fais pas que te mettre en forme, tu deviens inarrêtable ! 🔥",
    "Ton dévouement est incroyable - continue de briller, Ella ! 🌟",
    "Forte, confiante, et de plus en plus forte chaque jour ! 💪",
    "Ton futur moi t'encourage en ce moment même ! 🎉"
  ];
  
  const today = new Date().getDate();
  return messages[today % messages.length];
};

// Workout day suggestions based on day of week
const getWorkoutSuggestion = () => {
  const dayOfWeek = new Date().getDay(); // 0 = Dimanche, 1 = Lundi, etc.
  
  const suggestions = {
    1: { // Lundi
      title: "💪 Motivation du Lundi",
      description: "Commence ta semaine en force avec un entraînement complet !",
      focus: "Corps Entier + Course",
      emoji: "🔥"
    },
    3: { // Mercredi
      title: "🏃‍♀️ Guerrière du Mercredi",
      description: "Journée parfaite pour les squats et le renforcement du core !",
      focus: "Squats + Abdos",
      emoji: "⚡"
    },
    5: { // Vendredi
      title: "🎉 Finisseur du Vendredi",
      description: "Termine ta semaine avec une incroyable session cardio !",
      focus: "Cardio + Core",
      emoji: "✨"
    }
  };
  
  return suggestions[dayOfWeek] || {
    title: "🌟 Journée Parfaite",
    description: "Chaque jour est parfait pour prendre soin de soi et bouger !",
    focus: "Récupération Active",
    emoji: "💫"
  };
};

// Styled Components
const DashboardContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${props => props.theme.spacing.lg};
`;

// Logo animations
const logoFloat = keyframes`
  0%, 100% { transform: translateY(0px) scale(1); }
  50% { transform: translateY(-8px) scale(1.02); }
`;

const logoPulse = keyframes`
  0%, 100% { box-shadow: 0 8px 32px rgba(255, 105, 180, 0.3); }
  50% { box-shadow: 0 12px 40px rgba(255, 105, 180, 0.5); }
`;

const WelcomeSection = styled.div`
  background: linear-gradient(135deg, ${props => props.theme.colors.primary} 0%, ${props => props.theme.colors.primaryDark} 100%);
  color: white;
  padding: ${props => props.theme.spacing.xxl};
  border-radius: ${props => props.theme.borderRadius.large};
  text-align: center;
  margin-bottom: ${props => props.theme.spacing.xl};
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${props => props.theme.spacing.lg};

  &::before {
    content: '💖';
    position: absolute;
    top: 20px;
    right: 30px;
    font-size: 2rem;
    opacity: 0.7;
  }

  &::after {
    content: '✨';
    position: absolute;
    bottom: 20px;
    left: 30px;
    font-size: 1.5rem;
    opacity: 0.7;
  }
`;

const WelcomeLogo = styled.img`
  width: 120px;
  height: auto;
  border-radius: 20px;
  ${css`animation: ${logoFloat} 4s ease-in-out infinite, ${logoPulse} 3s ease-in-out infinite;`}
  margin-bottom: ${props => props.theme.spacing.md};
  border: 3px solid rgba(255, 255, 255, 0.3);
`;

const WelcomeContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
`;

const WelcomeTitle = styled.h1`
  font-size: ${props => props.theme.fonts.sizes.xxxl};
  font-weight: ${props => props.theme.fonts.weights.bold};
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const WelcomeMessage = styled.p`
  font-size: ${props => props.theme.fonts.sizes.lg};
  opacity: 0.95;
  font-weight: ${props => props.theme.fonts.weights.medium};
`;

const QuickStatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${props => props.theme.spacing.lg};
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const StatCard = styled.div`
  background: ${props => props.theme.colors.secondary};
  padding: ${props => props.theme.spacing.lg};
  border-radius: ${props => props.theme.borderRadius.large};
  box-shadow: ${props => props.theme.colors.shadow};
  text-align: center;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${props => props.theme.colors.shadowHover};
  }
`;

const StatIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: ${props => props.theme.spacing.md};
`;

const StatValue = styled.div`
  font-size: ${props => props.theme.fonts.sizes.xl};
  font-weight: ${props => props.theme.fonts.weights.bold};
  color: ${props => props.theme.colors.primary};
  margin-bottom: ${props => props.theme.spacing.xs};
`;

const StatLabel = styled.div`
  font-size: ${props => props.theme.fonts.sizes.md};
  color: ${props => props.theme.colors.text.secondary};
  font-weight: ${props => props.theme.fonts.weights.medium};
`;

const MainContent = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: ${props => props.theme.spacing.xl};
  margin-bottom: ${props => props.theme.spacing.xl};

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

const TodayWorkoutCard = styled.div`
  background: ${props => props.theme.colors.secondary};
  padding: ${props => props.theme.spacing.xl};
  border-radius: ${props => props.theme.borderRadius.large};
  box-shadow: ${props => props.theme.colors.shadow};
`;

const WorkoutCardHeader = styled.div`
  text-align: center;
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const WorkoutTitle = styled.h2`
  color: ${props => props.theme.colors.primary};
  font-size: ${props => props.theme.fonts.sizes.xxl};
  font-weight: ${props => props.theme.fonts.weights.bold};
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const WorkoutDescription = styled.p`
  color: ${props => props.theme.colors.text.secondary};
  font-size: ${props => props.theme.fonts.sizes.md};
  margin-bottom: ${props => props.theme.spacing.md};
`;

const WorkoutFocus = styled.div`
  background: ${props => props.theme.colors.background.secondary};
  padding: ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.medium};
  text-align: center;
  font-weight: ${props => props.theme.fonts.weights.semibold};
  color: ${props => props.theme.colors.primary};
`;

const WorkoutButton = styled.button`
  background: linear-gradient(135deg, ${props => props.theme.colors.primary} 0%, ${props => props.theme.colors.primaryDark} 100%);
  color: white;
  border: none;
  padding: ${props => props.theme.spacing.lg} ${props => props.theme.spacing.xl};
  border-radius: ${props => props.theme.borderRadius.pill};
  font-size: ${props => props.theme.fonts.sizes.lg};
  font-weight: ${props => props.theme.fonts.weights.semibold};
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  margin-top: ${props => props.theme.spacing.lg};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.colors.shadowHover};
  }
`;

const SidebarContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.lg};
`;

const MotivationCard = styled.div`
  background: linear-gradient(135deg, ${props => props.theme.colors.primaryLight}22 0%, ${props => props.theme.colors.primary}11 100%);
  padding: ${props => props.theme.spacing.lg};
  border-radius: ${props => props.theme.borderRadius.large};
  text-align: center;
  border: 2px solid ${props => props.theme.colors.primaryLight};
`;

const MotivationTitle = styled.h3`
  color: ${props => props.theme.colors.primary};
  font-size: ${props => props.theme.fonts.sizes.lg};
  font-weight: ${props => props.theme.fonts.weights.bold};
  margin-bottom: ${props => props.theme.spacing.md};
`;

const MotivationText = styled.p`
  color: ${props => props.theme.colors.text.primary};
  font-size: ${props => props.theme.fonts.sizes.md};
  font-style: italic;
  line-height: 1.6;
`;

const WeeklyProgressCard = styled.div`
  background: ${props => props.theme.colors.secondary};
  padding: ${props => props.theme.spacing.lg};
  border-radius: ${props => props.theme.borderRadius.large};
  box-shadow: ${props => props.theme.colors.shadow};
`;

const ProgressTitle = styled.h3`
  color: ${props => props.theme.colors.primary};
  font-size: ${props => props.theme.fonts.sizes.lg};
  font-weight: ${props => props.theme.fonts.weights.bold};
  margin-bottom: ${props => props.theme.spacing.md};
  text-align: center;
`;

const ProgressItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${props => props.theme.spacing.sm} 0;
  border-bottom: 1px solid ${props => props.theme.colors.border};

  &:last-child {
    border-bottom: none;
  }
`;

const ProgressLabel = styled.span`
  color: ${props => props.theme.colors.text.secondary};
  font-size: ${props => props.theme.fonts.sizes.sm};
`;

const ProgressValue = styled.span`
  color: ${props => props.theme.colors.primary};
  font-weight: ${props => props.theme.fonts.weights.semibold};
  font-size: ${props => props.theme.fonts.sizes.sm};
`;

const PersonalizedDashboard = ({ onStartWorkout }) => {
  const [progress, setProgress] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [personalizedContent, setPersonalizedContent] = useState(null);
  const [recentWorkouts, setRecentWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load user profile and progress data
      const [progressData, workoutsData, profileData] = await Promise.all([
        userProgressService.getProgressStats(),
        workoutSessionService.getAllWorkoutSessions(),
        userProfileService.getUserProfileByName('Ella')
      ]);
      
      setProgress(progressData);
      setRecentWorkouts(workoutsData.slice(0, 3));
      setUserProfile(profileData.profile);
      
      // Generate personalized content
      if (profileData.profile) {
        const content = await getPersonalizedDashboardContent(profileData.profile, progressData);
        setPersonalizedContent(content);
      }
      
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Use personalized content or fallback to default
  const workoutSuggestion = personalizedContent?.workoutSuggestion || getWorkoutSuggestion();
  const greeting = personalizedContent?.greeting || getCurrentGreeting();
  const dailyMessage = personalizedContent?.motivation || getDailyMessage();

  return (
    <DashboardContainer>
      {/* Welcome Section */}
      <WelcomeSection>
        <WelcomeLogo src={logoImg} alt="ELLA Run - Ton Partenaire Fitness" />
        <WelcomeContent>
          <WelcomeTitle>{greeting}</WelcomeTitle>
          <WelcomeMessage>{dailyMessage}</WelcomeMessage>
        </WelcomeContent>
      </WelcomeSection>

      {/* Quick Stats */}
      <QuickStatsGrid>
        <StatCard>
          <StatIcon>🏃‍♀️</StatIcon>
          <StatValue>{progress?.totalSessions || 0}</StatValue>
          <StatLabel>Entraînements Total</StatLabel>
        </StatCard>

        <StatCard>
          <StatIcon>🔥</StatIcon>
          <StatValue>{progress?.completedSessions || 0}</StatValue>
          <StatLabel>Sessions Terminées</StatLabel>
        </StatCard>

        <StatCard>
          <StatIcon>📈</StatIcon>
          <StatValue>{progress?.completionRate || 0}%</StatValue>
          <StatLabel>Taux de Réussite</StatLabel>
        </StatCard>

        <StatCard>
          <StatIcon>⚡</StatIcon>
          <StatValue>{progress?.streak || 0}</StatValue>
          <StatLabel>Série de Jours</StatLabel>
        </StatCard>
      </QuickStatsGrid>

      {/* Main Content */}
      <MainContent>
        {/* Today's Workout Suggestion */}
        <TodayWorkoutCard>
          <WorkoutCardHeader>
            <WorkoutTitle>
              {workoutSuggestion.emoji} {workoutSuggestion.title}
            </WorkoutTitle>
            <WorkoutDescription>
              {workoutSuggestion.description}
            </WorkoutDescription>
            <WorkoutFocus>
              Focus d'Aujourd'hui : {workoutSuggestion.focus}
            </WorkoutFocus>
          </WorkoutCardHeader>
          
          <WorkoutButton onClick={onStartWorkout}>
            🚀 Commencer l'Entraînement
          </WorkoutButton>
        </TodayWorkoutCard>

        {/* Sidebar Content */}
        <SidebarContent>
          {/* Daily Motivation */}
          <MotivationCard>
            <MotivationTitle>💪 Inspiration Quotidienne</MotivationTitle>
            <MotivationText>
              "Tu es plus forte que tu ne le penses, plus courageuse que tu ne le crois, et plus capable que tu ne l'imagines. Chaque pas en avant est une victoire, Ella !"
            </MotivationText>
          </MotivationCard>

          {/* Weekly Progress */}
          <WeeklyProgressCard>
            <ProgressTitle>📊 Progrès de Cette Semaine</ProgressTitle>
            <ProgressItem>
              <ProgressLabel>Entraînements Terminés</ProgressLabel>
              <ProgressValue>{progress?.completedSessions || 0}/3</ProgressValue>
            </ProgressItem>
            <ProgressItem>
              <ProgressLabel>Régularité</ProgressLabel>
              <ProgressValue>{progress?.streak || 0} jours</ProgressValue>
            </ProgressItem>
            <ProgressItem>
              <ProgressLabel>Prochain Objectif</ProgressLabel>
              <ProgressValue>10 entraînements</ProgressValue>
            </ProgressItem>
          </WeeklyProgressCard>
        </SidebarContent>
      </MainContent>
    </DashboardContainer>
  );
};

export default PersonalizedDashboard;