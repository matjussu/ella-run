/**
 * Fixed Main Application Component
 * 
 * This version includes proper error handling and prevents infinite loops
 */

import React, { useState, useEffect, createContext, useContext } from 'react';
import styled, { ThemeProvider, createGlobalStyle } from 'styled-components';
import WorkoutPlanner from './components/WorkoutPlanner';
import ExerciseDetails from './components/ExerciseDetails';
import ProgressDashboard from './components/ProgressDashboard';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingSpinner from './components/LoadingSpinner';
import PersonalizedDashboard from './components/PersonalizedDashboard';
import EditableProfile from './components/EditableProfile';
import MilestoneTracker from './components/MilestoneTracker';
import OnboardingFlow from './components/OnboardingFlow';
import PWAInstallPrompt from './components/PWAInstallPrompt';
import AppDownloadBanner from './components/AppDownloadBanner';
import MobileNavigation from './components/MobileNavigation';
import { useMobileGestures } from './hooks/useMobileGestures';
import { userProgressService } from './services/firebaseService';
import userProfileService from './services/userProfileService';
import { generateWorkoutPlan } from './services/rapidApiService';
import logoImg from './logo_run.svg';

// Theme configuration for pink/white aesthetic
const theme = {
  colors: {
    primary: '#ff69b4',
    primaryDark: '#e91e63',
    primaryLight: '#ffb3d9',
    secondary: '#ffffff',
    accent: '#f8f9fa',
    text: {
      primary: '#333333',
      secondary: '#666666',
      light: '#999999',
      white: '#ffffff'
    },
    background: {
      primary: '#ffffff',
      secondary: '#ffeef8',
      gradient: 'linear-gradient(135deg, #ffeef8 0%, #ffffff 100%)'
    },
    border: '#e8e8e8',
    shadow: '0 4px 20px rgba(255, 105, 180, 0.1)',
    shadowHover: '0 8px 30px rgba(255, 105, 180, 0.15)',
    error: '#ff4444',
    success: '#4caf50',
    warning: '#ff9800'
  },
  fonts: {
    primary: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    sizes: {
      xs: '0.75rem',
      sm: '0.875rem',
      md: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      xxl: '1.5rem',
      xxxl: '2rem'
    },
    weights: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700
    }
  },
  spacing: {
    xs: '0.5rem',
    sm: '1rem',
    md: '1.5rem',
    lg: '2rem',
    xl: '3rem',
    xxl: '4rem'
  },
  borderRadius: {
    small: '8px',
    medium: '12px',
    large: '16px',
    pill: '50px'
  },
  breakpoints: {
    mobile: '768px',
    tablet: '1024px',
    desktop: '1200px'
  }
};

// Global styles for the application with mobile optimizations
const GlobalStyle = createGlobalStyle`
  /* Base styles */
  * {
    box-sizing: border-box;
  }

  html {
    scroll-behavior: smooth;
    /* Prevent zoom on iOS */
    -webkit-text-size-adjust: 100%;
    /* Enable smooth scrolling */
    -webkit-overflow-scrolling: touch;
  }

  body {
    font-family: ${props => props.theme.fonts.primary};
    background: ${props => props.theme.colors.background.gradient};
    color: ${props => props.theme.colors.text.primary};
    line-height: 1.6;
    margin: 0;
    padding: 0;
    
    /* Mobile optimizations */
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    
    /* Prevent scroll bounce on iOS */
    overscroll-behavior: none;
    
    /* Safe area for notch devices */
    padding-top: env(safe-area-inset-top);
    padding-bottom: env(safe-area-inset-bottom);
    
    @media (max-width: ${props => props.theme.breakpoints.mobile}) {
      /* Add bottom padding for mobile navigation */
      padding-bottom: calc(80px + env(safe-area-inset-bottom));
    }
  }

  button {
    font-family: ${props => props.theme.fonts.primary};
    /* Improve touch targets on mobile */
    min-height: 44px;
    min-width: 44px;
    
    /* Remove iOS button styling */
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    
    /* Prevent text selection */
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    
    /* Better touch feedback */
    touch-action: manipulation;
  }

  /* Focus styles - better for mobile */
  *:focus {
    outline: 2px solid ${props => props.theme.colors.primary};
    outline-offset: 2px;
  }

  /* Remove focus outline on touch devices */
  @media (hover: none) and (pointer: coarse) {
    *:focus {
      outline: none;
    }
  }

  /* Input optimizations for mobile */
  input, textarea, select {
    /* Prevent zoom on iOS */
    font-size: 16px;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    
    /* Better touch targets */
    min-height: 44px;
    padding: ${props => props.theme.spacing.sm};
    border-radius: ${props => props.theme.borderRadius.medium};
    border: 1px solid ${props => props.theme.colors.border};
    background: ${props => props.theme.colors.secondary};
  }

  /* Scrollbar styling */
  ::-webkit-scrollbar {
    width: 6px;
  }

  ::-webkit-scrollbar-track {
    background: transparent;
  }

  ::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.primary}40;
    border-radius: 3px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${props => props.theme.colors.primary}60;
  }

  /* Selection styling */
  ::selection {
    background: ${props => props.theme.colors.primary}30;
    color: ${props => props.theme.colors.text.primary};
  }

  /* Tap highlight removal */
  * {
    -webkit-tap-highlight-color: transparent;
  }

  /* Better font rendering */
  @media screen and (max-width: ${props => props.theme.breakpoints.mobile}) {
    body {
      font-size: 14px;
    }
    
    h1, h2, h3, h4, h5, h6 {
      line-height: 1.3;
    }
  }
`;

// Application Context for global state management
const AppContext = createContext();

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

// Main App Container
const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

// Header Component - hidden on mobile
const Header = styled.header`
  background: linear-gradient(135deg, ${props => props.theme.colors.secondary} 0%, ${props => props.theme.colors.background.secondary} 100%);
  box-shadow: ${props => props.theme.colors.shadow};
  padding: ${props => props.theme.spacing.lg} 0;
  position: sticky;
  top: 0;
  z-index: 100;
  border-bottom: 3px solid ${props => props.theme.colors.primary};
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    display: none;
  }
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${props => props.theme.spacing.md};
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: ${props => props.theme.spacing.lg};
`;

const BrandContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
  cursor: pointer;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
  }
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    gap: ${props => props.theme.spacing.sm};
  }
`;

const LogoImg = styled.img`
  height: 80px;
  width: auto;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(255, 105, 180, 0.3);
  object-fit: contain;
  display: block;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:hover {
    transform: scale(1.08) rotate(1deg);
    box-shadow: 0 8px 32px rgba(255, 105, 180, 0.4);
  }
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    height: 60px;
  }
`;

const BrandText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    display: none;
  }
`;

const AppTitle = styled.h1`
  font-size: ${props => props.theme.fonts.sizes.xl};
  font-weight: ${props => props.theme.fonts.weights.bold};
  color: ${props => props.theme.colors.primary};
  margin: 0;
  line-height: 1.2;
  background: linear-gradient(135deg, ${props => props.theme.colors.primary} 0%, ${props => props.theme.colors.primaryDark} 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const AppSubtitle = styled.p`
  font-size: ${props => props.theme.fonts.sizes.sm};
  font-weight: ${props => props.theme.fonts.weights.medium};
  color: ${props => props.theme.colors.text.secondary};
  margin: 0;
  font-style: italic;
`;

const Navigation = styled.nav`
  display: flex;
  gap: ${props => props.theme.spacing.sm};
  flex-wrap: wrap;
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    gap: ${props => props.theme.spacing.xs};
  }
`;

const NavButton = styled.button`
  background: ${props => props.active ? props.theme.colors.primary : 'transparent'};
  color: ${props => props.active ? props.theme.colors.text.white : props.theme.colors.text.primary};
  border: 2px solid ${props => props.theme.colors.primary};
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.pill};
  font-weight: ${props => props.theme.fonts.weights.medium};
  font-size: ${props => props.theme.fonts.sizes.sm};
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.theme.colors.primary};
    color: ${props => props.theme.colors.text.white};
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.colors.shadowHover};
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
    font-size: ${props => props.theme.fonts.sizes.xs};
    min-width: auto;
  }
`;

// Main Content Area
const MainContent = styled.main`
  flex: 1;
  max-width: 1200px;
  margin: 0 auto;
  padding: ${props => props.theme.spacing.xl} ${props => props.theme.spacing.md};
  width: 100%;
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    padding: ${props => props.theme.spacing.lg} ${props => props.theme.spacing.sm};
    /* Add top padding to account for potential download banner */
    padding-top: calc(${props => props.theme.spacing.lg} + 20px);
  }
`;

// Footer Component - hidden on mobile
const Footer = styled.footer`
  background: ${props => props.theme.colors.secondary};
  padding: ${props => props.theme.spacing.lg} 0;
  text-align: center;
  color: ${props => props.theme.colors.text.secondary};
  border-top: 1px solid ${props => props.theme.colors.border};
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    display: none;
  }
`;

// App States
const APP_STATES = {
  HOME: 'home',
  WORKOUT_GENERATOR: 'workout_generator',
  EXERCISE_DETAILS: 'exercise_details',
  PROGRESS: 'progress',
  PROFILE: 'profile',
  ACHIEVEMENTS: 'achievements'
};

// Error Message Component
const ErrorMessage = styled.div`
  background: ${props => props.theme.colors.error};
  color: white;
  padding: ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.medium};
  margin-bottom: ${props => props.theme.spacing.md};
  display: flex;
  justify-content: space-between;
  align-items: center;

  button {
    background: transparent;
    border: 1px solid white;
    color: white;
    padding: ${props => props.theme.spacing.xs};
    border-radius: ${props => props.theme.borderRadius.small};
    cursor: pointer;
    
    &:hover {
      background: white;
      color: ${props => props.theme.colors.error};
    }
  }
`;

/**
 * Main App Component - FINAL FIXED VERSION
 */
function App() {
  console.log('🚀 ELLA Run App starting...');

  // Application state
  const [currentView, setCurrentView] = useState(APP_STATES.HOME);
  const [currentWorkout, setCurrentWorkout] = useState(null);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [userProgress, setUserProgress] = useState(null);
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Mobile gestures hook
  const { addHapticFeedback, isMobile } = useMobileGestures({
    onSwipeLeft: () => {
      // Navigate to next view on swipe left
      if (currentView === 'home') handleNavigate('workout_generator');
      else if (currentView === 'workout_generator') handleNavigate('progress');
    },
    onSwipeRight: () => {
      // Navigate to previous view on swipe right
      if (currentView === 'progress') handleNavigate('workout_generator');
      else if (currentView === 'workout_generator') handleNavigate('home');
    },
    onPullToRefresh: () => {
      // Refresh current view content
      if (currentView === 'progress') loadUserProgress();
      else if (currentView === 'home') initializeApp();
    }
  });
  
  // No longer need the initializationAttempted state
  // const [initializationAttempted, setInitializationAttempted] = useState(false);

  // CORRECTED: This useEffect now runs ONLY ONCE when the app first mounts.
  useEffect(() => {
    initializeApp();
    registerServiceWorker();
  }, []); // <-- THE FIX: An empty dependency array tells React to run this only once.


  /**
   * Register service worker for PWA functionality
   */
  const registerServiceWorker = async () => {
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      try {
        console.log('🔧 PWA: Registering service worker...');
        
        const registration = await navigator.serviceWorker.register('/sw.js');
        
        console.log('✅ PWA: Service worker registered successfully');
        
        // Listen for updates
        registration.addEventListener('updatefound', () => {
          console.log('🔄 PWA: New version available');
          const newWorker = registration.installing;
          
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('🆕 PWA: New version ready to install');
              // Could show an update notification here
            }
          });
        });
        
      } catch (error) {
        console.error('❌ PWA: Service worker registration failed:', error);
      }
    } else if (process.env.NODE_ENV === 'development') {
      console.log('🔧 PWA: Service worker disabled in development mode');
    } else {
      console.log('❌ PWA: Service worker not supported');
    }
  };

  /**
   * Initialize the application and check onboarding status - FIXED VERSION
   */
  const initializeApp = async () => {
    console.log('🔄 Initializing ELLA Run app...');
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Add timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Initialization timeout')), 10000)
      );
      
      const initPromise = (async () => {
        // Check if user has completed onboarding
        const onboardingStatus = await userProfileService.checkOnboardingStatus();
        
        if (onboardingStatus.completed && onboardingStatus.profile) {
          console.log('✅ User has completed onboarding');
          setOnboardingCompleted(true);
          
          // Load progress data
          try {
            const progress = await userProgressService.getProgressStats();
            setUserProgress(progress);
            console.log('✅ Progress data loaded');
          } catch (progressError) {
            console.warn('⚠️ Progress loading failed (non-critical):', progressError);
            // Don't fail the entire init for progress loading
          }
        } else {
          console.log('📝 User needs to complete onboarding');
          setOnboardingCompleted(false);
        }
      })();
      
      await Promise.race([initPromise, timeoutPromise]);
      
      console.log('✅ App initialization completed');
      
    } catch (error) {
      console.error('❌ Error initializing app:', error);
      setError(`Failed to load app: ${error.message}`);
      
      // Fallback to showing onboarding
      setOnboardingCompleted(false);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Load user progress statistics
   */
  const loadUserProgress = async () => {
    try {
      setIsLoading(true);
      const progress = await userProgressService.getProgressStats();
      setUserProgress(progress);
    } catch (error) {
      console.error('Error loading user progress:', error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle workout generation completion
   */
  const handleWorkoutGenerated = (workout) => {
    setCurrentWorkout(workout);
    setError(null);
  };

  /**
   * Generate personalized workout using RapidAPI
   */
  const handleGenerateEllaWorkout = async () => {
    try {
      setIsLoading(true);
      
      // Get user profile for personalization
      const userProfile = await userProfileService.getUserProfileByName();
      const workoutResult = await generateWorkoutPlan(userProfile);
      
      if (workoutResult.success) {
        handleWorkoutGenerated(workoutResult.data);
        setCurrentView(APP_STATES.WORKOUT_GENERATOR);
      } else {
        throw new Error(workoutResult.error || 'Failed to generate workout');
      }
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle exercise selection
   */
  const handleExerciseSelect = (exercise) => {
    setSelectedExercise(exercise);
    setCurrentView(APP_STATES.EXERCISE_DETAILS);
  };

  /**
   * Handle navigation between views
   */
  const handleNavigate = (view) => {
    // Add haptic feedback on mobile
    if (isMobile()) {
      addHapticFeedback([50]);
    }
    
    setCurrentView(view);
    setError(null);
  };

  /**
   * Handle global error states
   */
  const handleError = (error) => {
    setError(error);
    console.error('App Error:', error);
  };

  /**
   * Clear current error
   */
  const clearError = () => {
    setError(null);
  };

  // Context value for child components
  const contextValue = {
    currentWorkout,
    setCurrentWorkout,
    selectedExercise,
    setSelectedExercise,
    userProgress,
    loadUserProgress,
    handleError,
    clearError,
    isLoading,
    setIsLoading
  };

  /**
   * Render current view based on state
   */
  const renderCurrentView = () => {
    try {
      switch (currentView) {
        case APP_STATES.HOME:
          return (
            <PersonalizedDashboard
              onStartWorkout={handleGenerateEllaWorkout}
            />
          );
        case APP_STATES.WORKOUT_GENERATOR:
          return (
            <WorkoutPlanner
              onExerciseSelect={handleExerciseSelect}
            />
          );
        case APP_STATES.EXERCISE_DETAILS:
          return (
            <ExerciseDetails
              exercise={selectedExercise}
              onBack={() => setCurrentView(APP_STATES.WORKOUT_GENERATOR)}
            />
          );
        case APP_STATES.PROGRESS:
          return (
            <ProgressDashboard
              progress={userProgress}
              onRefresh={loadUserProgress}
            />
          );
        case APP_STATES.PROFILE:
          return <EditableProfile />;
        case APP_STATES.ACHIEVEMENTS:
          return <MilestoneTracker />;
        default:
          return (
            <PersonalizedDashboard
              onStartWorkout={handleGenerateEllaWorkout}
            />
          );
      }
    } catch (renderError) {
      console.error('❌ View render error:', renderError);
      return (
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <h2>Oops! Une erreur s'est produite</h2>
          <p>Nous travaillons à résoudre ce problème.</p>
          <button onClick={() => window.location.reload()}>
            Recharger l'application
          </button>
        </div>
      );
    }
  };

  // Show loading screen during initialization
  if (isLoading) {
    return (
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <LoadingSpinner 
          fullHeight={true} 
          text="Initialisation d'ELLA Run..."
          motivationalText="Préparation de ton expérience personnalisée ! ✨"
          size="large"
        />
      </ThemeProvider>
    );
  }

  // Show critical error screen
  if (error && !onboardingCompleted) {
    return (
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <div style={{ 
          minHeight: '100vh', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          padding: '2rem',
          textAlign: 'center' 
        }}>
          <div>
            <h1 style={{ color: theme.colors.primary }}>ELLA Run</h1>
            <h2>Problème de connexion</h2>
            <p>{error}</p>
            <button 
              onClick={() => {
                setError(null);
                initializeApp();
              }}
              style={{
                background: theme.colors.primary,
                color: 'white',
                border: 'none',
                padding: '1rem 2rem',
                borderRadius: '25px',
                cursor: 'pointer',
                fontSize: '1rem'
              }}
            >
              Réessayer
            </button>
          </div>
        </div>
      </ThemeProvider>
    );
  }

  // Show onboarding flow if not completed
  if (!onboardingCompleted) {
    return (
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <ErrorBoundary onError={handleError}>
          <OnboardingFlow />
        </ErrorBoundary>
      </ThemeProvider>
    );
  }

  // Show main application
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <ErrorBoundary onError={handleError}>
        <AppContext.Provider value={contextValue}>
          <AppContainer>
            {/* App Download Banner */}
            <AppDownloadBanner />
            
            {/* PWA Install Prompt */}
            <PWAInstallPrompt />
            
            {/* Header */}
            <Header>
              <HeaderContent>
                <BrandContainer onClick={() => handleNavigate(APP_STATES.HOME)}>
                  <LogoImg src={logoImg} alt="ELLA Run Logo" />
                  <BrandText>
                    <AppTitle>ELLA Run</AppTitle>
                    <AppSubtitle>Personal Trainer</AppSubtitle>
                  </BrandText>
                </BrandContainer>
                <Navigation>
                  <NavButton
                    active={currentView === APP_STATES.HOME}
                    onClick={() => handleNavigate(APP_STATES.HOME)}
                  >
                    🏠 Accueil
                  </NavButton>
                  <NavButton
                    active={currentView === APP_STATES.WORKOUT_GENERATOR}
                    onClick={() => handleNavigate(APP_STATES.WORKOUT_GENERATOR)}
                  >
                    💪 Entraînement
                  </NavButton>
                  <NavButton
                    active={currentView === APP_STATES.PROFILE}
                    onClick={() => handleNavigate(APP_STATES.PROFILE)}
                  >
                    👤 Profil
                  </NavButton>
                  <NavButton
                    active={currentView === APP_STATES.PROGRESS}
                    onClick={() => handleNavigate(APP_STATES.PROGRESS)}
                  >
                    📊 Progrès
                  </NavButton>
                  <NavButton
                    active={currentView === APP_STATES.ACHIEVEMENTS}
                    onClick={() => handleNavigate(APP_STATES.ACHIEVEMENTS)}
                  >
                    🏆 Réussites
                  </NavButton>
                </Navigation>
              </HeaderContent>
            </Header>

            {/* Main Content */}
            <MainContent>
              {/* Global Error Display */}
              {error && (
                <ErrorMessage>
                  <strong>Erreur:</strong> {error.message || error}
                  <button onClick={clearError}>Fermer</button>
                </ErrorMessage>
              )}

              {/* Current View */}
              {renderCurrentView()}
            </MainContent>

            {/* Mobile Navigation */}
            <MobileNavigation 
              currentView={currentView}
              onNavigate={handleNavigate}
            />
            
            {/* Footer - hidden on mobile */}
            <Footer>
              <p>Créé avec 💖 pour l'incroyable parcours fitness d'Ella • Tu deviens plus forte chaque jour ! 🌟</p>
            </Footer>
          </AppContainer>
        </AppContext.Provider>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;