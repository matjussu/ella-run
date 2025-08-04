/**
 * PWA Install Prompt Component
 * 
 * Displays a prompt to install the ELLA Run app on mobile devices
 * Shows when the browser supports PWA installation
 */

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

// Styled Components
const InstallPromptContainer = styled.div`
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, ${props => props.theme.colors.primary} 0%, ${props => props.theme.colors.primaryDark} 100%);
  color: white;
  padding: ${props => props.theme.spacing.lg} ${props => props.theme.spacing.xl};
  border-radius: ${props => props.theme.borderRadius.large};
  box-shadow: 0 8px 32px rgba(255, 105, 180, 0.4);
  z-index: 1000;
  max-width: 90vw;
  min-width: 300px;
  text-align: center;
  animation: slideUp 0.5s ease-out;

  @keyframes slideUp {
    from {
      transform: translateX(-50%) translateY(100px);
      opacity: 0;
    }
    to {
      transform: translateX(-50%) translateY(0);
      opacity: 1;
    }
  }

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    bottom: 10px;
    left: 10px;
    right: 10px;
    transform: none;
    max-width: none;
    min-width: auto;
  }
`;

const InstallTitle = styled.h3`
  font-size: ${props => props.theme.fonts.sizes.lg};
  font-weight: ${props => props.theme.fonts.weights.bold};
  margin: 0 0 ${props => props.theme.spacing.sm} 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${props => props.theme.spacing.sm};
`;

const InstallDescription = styled.p`
  font-size: ${props => props.theme.fonts.sizes.sm};
  margin: 0 0 ${props => props.theme.spacing.lg} 0;
  opacity: 0.9;
  line-height: 1.4;
`;

const InstallButtons = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.md};
  justify-content: center;
  flex-wrap: wrap;
`;

const InstallButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.lg};
  border-radius: ${props => props.theme.borderRadius.pill};
  font-weight: ${props => props.theme.fonts.weights.semibold};
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: ${props => props.theme.fonts.sizes.sm};

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    border-color: rgba(255, 255, 255, 0.5);
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const PrimaryButton = styled(InstallButton)`
  background: white;
  color: ${props => props.theme.colors.primary};
  border-color: white;
  
  &:hover {
    background: rgba(255, 255, 255, 0.9);
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: ${props => props.theme.spacing.sm};
  right: ${props => props.theme.spacing.sm};
  background: none;
  border: none;
  color: white;
  font-size: 20px;
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.3s ease;

  &:hover {
    opacity: 1;
  }
`;

/**
 * PWA Install Prompt Component
 */
const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    const checkIfInstalled = () => {
      if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) {
        setIsInstalled(true);
        return;
      }
      
      if (window.navigator.standalone === true) {
        setIsInstalled(true);
        return;
      }
    };

    checkIfInstalled();

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      console.log('💾 PWA: Install prompt available');
      e.preventDefault(); // Prevent the mini-infobar from appearing
      setDeferredPrompt(e);
      
      // Show our custom install prompt after a delay
      setTimeout(() => {
        if (!isInstalled) {
          setShowPrompt(true);
        }
      }, 3000); // Show after 3 seconds
    };

    // Listen for successful installation
    const handleAppInstalled = () => {
      console.log('✅ PWA: App installed successfully');
      setIsInstalled(true);
      setShowPrompt(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [isInstalled]);

  const handleInstall = async () => {
    if (!deferredPrompt) {
      console.log('❌ PWA: No install prompt available');
      return;
    }

    try {
      console.log('🚀 PWA: Showing install prompt');
      
      // Show the install prompt
      deferredPrompt.prompt();
      
      // Wait for the user to respond to the prompt
      const { outcome } = await deferredPrompt.userChoice;
      
      console.log(`👤 PWA: User choice: ${outcome}`);
      
      if (outcome === 'accepted') {
        console.log('✅ PWA: Installation accepted');
      } else {
        console.log('❌ PWA: Installation declined');
      }
      
      // Reset the deferred prompt
      setDeferredPrompt(null);
      setShowPrompt(false);
      
    } catch (error) {
      console.error('❌ PWA: Installation error:', error);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    // Remember user dismissed (could use localStorage)
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
  };

  const handleRemindLater = () => {
    setShowPrompt(false);
    // Show again in 24 hours
    setTimeout(() => {
      if (!isInstalled) {
        setShowPrompt(true);
      }
    }, 24 * 60 * 60 * 1000);
  };

  // Don't show if already installed or no prompt available
  if (isInstalled || !showPrompt || !deferredPrompt) {
    return null;
  }

  return (
    <InstallPromptContainer>
      <CloseButton onClick={handleDismiss} aria-label="Fermer">
        ×
      </CloseButton>
      
      <InstallTitle>
        📱 Installer ELLA Run
      </InstallTitle>
      
      <InstallDescription>
        Ajoutez ELLA Run à votre écran d'accueil pour un accès rapide à vos entraînements !
        L'app fonctionne même hors ligne.
      </InstallDescription>
      
      <InstallButtons>
        <PrimaryButton onClick={handleInstall}>
          ⬇️ Installer l'app
        </PrimaryButton>
        <InstallButton onClick={handleRemindLater}>
          ⏰ Plus tard
        </InstallButton>
        <InstallButton onClick={handleDismiss}>
          ❌ Non merci
        </InstallButton>
      </InstallButtons>
    </InstallPromptContainer>
  );
};

export default PWAInstallPrompt;