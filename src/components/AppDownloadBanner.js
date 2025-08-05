/**
 * App Download Banner Component
 * 
 * Prominent banner to encourage users to download the ELLA Run app
 * Shows on web but hides when app is installed
 */

import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

// Animations
const slideInFromTop = keyframes`
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const pulse = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(255, 105, 180, 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(255, 105, 180, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(255, 105, 180, 0);
  }
`;

// Styled Components
const BannerContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: linear-gradient(135deg, ${props => props.theme.colors.primary} 0%, ${props => props.theme.colors.primaryDark} 100%);
  color: white;
  padding: ${props => props.theme.spacing.md};
  z-index: 1001;
  animation: ${slideInFromTop} 0.6s ease-out;
  box-shadow: 0 4px 20px rgba(255, 105, 180, 0.3);

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    padding: ${props => props.theme.spacing.sm};
  }
`;

const BannerContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${props => props.theme.spacing.md};

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    flex-direction: column;
    gap: ${props => props.theme.spacing.sm};
    text-align: center;
  }
`;

const BannerText = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    flex-direction: column;
    gap: ${props => props.theme.spacing.sm};
  }
`;

const AppIcon = styled.div`
  font-size: 2.5rem;
  animation: ${pulse} 2s infinite;

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    font-size: 2rem;
  }
`;

const TextContent = styled.div`
  flex: 1;
`;

const MainText = styled.h3`
  font-size: ${props => props.theme.fonts.sizes.lg};
  font-weight: ${props => props.theme.fonts.weights.bold};
  margin: 0 0 ${props => props.theme.spacing.xs} 0;

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    font-size: ${props => props.theme.fonts.sizes.md};
  }
`;

const SubText = styled.p`
  font-size: ${props => props.theme.fonts.sizes.sm};
  margin: 0;
  opacity: 0.9;

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    font-size: ${props => props.theme.fonts.sizes.xs};
  }
`;

const BannerActions = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.sm};
  align-items: center;

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    flex-direction: column;
    width: 100%;
  }
`;

const DownloadButton = styled.button`
  background: white;
  color: ${props => props.theme.colors.primary};
  border: none;
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.xl};
  border-radius: ${props => props.theme.borderRadius.pill};
  font-weight: ${props => props.theme.fonts.weights.bold};
  font-size: ${props => props.theme.fonts.sizes.md};
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
    background: rgba(255, 255, 255, 0.95);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    width: 100%;
    justify-content: center;
    padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.lg};
    font-size: ${props => props.theme.fonts.sizes.sm};
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.3s ease;
  padding: ${props => props.theme.spacing.xs};

  &:hover {
    opacity: 1;
  }

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    position: absolute;
    top: ${props => props.theme.spacing.xs};
    right: ${props => props.theme.spacing.xs};
    font-size: 1.2rem;
  }
`;

// Floating Download Button (for when banner is dismissed)
const FloatingDownloadButton = styled.button`
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, ${props => props.theme.colors.primary} 0%, ${props => props.theme.colors.primaryDark} 100%);
  color: white;
  border: none;
  border-radius: 50%;
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(255, 105, 180, 0.4);
  z-index: 1000;
  animation: ${pulse} 3s infinite;

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 25px rgba(255, 105, 180, 0.6);
  }

  &:active {
    transform: scale(0.95);
  }

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    width: 55px;
    height: 55px;
    bottom: 15px;
    right: 15px;
    font-size: 1.3rem;
  }
`;

/**
 * App Download Banner Component
 */
const AppDownloadBanner = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showFloatingButton, setShowFloatingButton] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    // Check if app is already installed
    const checkIfInstalled = () => {
      if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) {
        setIsInstalled(true);
        return true;
      }
      
      if (window.navigator.standalone === true) {
        setIsInstalled(true);
        return true;
      }
      
      return false;
    };

    // Check if user previously dismissed the banner
    const bannerDismissed = localStorage.getItem('download-banner-dismissed');
    const bannerDismissedTime = bannerDismissed ? parseInt(bannerDismissed) : 0;
    const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);

    if (!checkIfInstalled()) {
      // Show banner if not dismissed or if dismissed more than 24h ago
      if (!bannerDismissed || bannerDismissedTime < oneDayAgo) {
        setTimeout(() => setShowBanner(true), 2000); // Show after 2 seconds
      } else {
        setShowFloatingButton(true); // Show floating button instead
      }
    }

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    // Listen for successful installation
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowBanner(false);
      setShowFloatingButton(false);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      try {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        
        if (outcome === 'accepted') {
          setShowBanner(false);
          setShowFloatingButton(false);
        }
        
        setDeferredPrompt(null);
      } catch (error) {
        console.error('Installation error:', error);
      }
    } else {
      // Fallback: show manual installation instructions
      alert('Pour installer ELLA Run :\n\n📱 Sur mobile :\n• Chrome : Menu → "Ajouter à l\'écran d\'accueil"\n• Safari : Partage → "Sur l\'écran d\'accueil"\n\n💻 Sur ordinateur :\n• Cliquez sur l\'icône d\'installation dans la barre d\'adresse');
    }
  };

  const handleDismissBanner = () => {
    setShowBanner(false);
    setShowFloatingButton(true);
    localStorage.setItem('download-banner-dismissed', Date.now().toString());
  };

  // Don't show anything if app is installed
  if (isInstalled) {
    return null;
  }

  return (
    <>
      {/* Main Banner */}
      {showBanner && (
        <BannerContainer>
          <BannerContent>
            <BannerText>
              <AppIcon>📱</AppIcon>
              <TextContent>
                <MainText>Télécharge l'App ELLA Run</MainText>
                <SubText>Accès rapide, mode hors ligne, notifications d'entraînement</SubText>
              </TextContent>
            </BannerText>
            
            <BannerActions>
              <DownloadButton onClick={handleInstall}>
                ⬇️ Installer l'App
              </DownloadButton>
              <CloseButton onClick={handleDismissBanner} aria-label="Fermer">
                ×
              </CloseButton>
            </BannerActions>
          </BannerContent>
        </BannerContainer>
      )}

      {/* Floating Button */}
      {showFloatingButton && (
        <FloatingDownloadButton 
          onClick={handleInstall}
          aria-label="Télécharger l'application ELLA Run"
          title="Installer ELLA Run"
        >
          📱
        </FloatingDownloadButton>
      )}
    </>
  );
};

export default AppDownloadBanner;