/**
 * Enhanced Loading Spinner Component
 * 
 * A beautiful, branded loading spinner with ELLA Run logo
 * Used throughout the app for loading states
 */

import React from 'react';
import styled, { keyframes } from 'styled-components';
import logoImg from '../logo_run.png';

// Spinning animation
const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

// Pulse animation for the center
const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`;

const SpinnerContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: ${props => props.theme.spacing.xxl};
  min-height: ${props => props.fullHeight ? '50vh' : 'auto'};
  position: relative;
`;

// Floating animation for logo
const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
`;

// Logo container with floating animation
const LogoContainer = styled.div`
  position: relative;
  margin-bottom: ${props => props.theme.spacing.lg};
  animation: ${float} 3s ease-in-out infinite;
`;

const BrandedLogo = styled.img`
  width: ${props => props.size === 'large' ? '120px' : props.size === 'small' ? '60px' : '80px'};
  height: auto;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(255, 105, 180, 0.3);
  transition: all 0.3s ease;
`;

const SpinnerRing = styled.div`
  display: inline-block;
  position: relative;
  width: 64px;
  height: 64px;

  div {
    box-sizing: border-box;
    display: block;
    position: absolute;
    width: 51px;
    height: 51px;
    margin: 6px;
    border: 6px solid ${props => props.theme.colors.primary};
    border-radius: 50%;
    animation: ${spin} 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
    border-color: ${props => props.theme.colors.primary} transparent transparent transparent;
  }

  div:nth-child(1) {
    animation-delay: -0.45s;
  }

  div:nth-child(2) {
    animation-delay: -0.3s;
  }

  div:nth-child(3) {
    animation-delay: -0.15s;
  }
`;

const SpinnerText = styled.p`
  margin-top: ${props => props.theme.spacing.md};
  color: ${props => props.theme.colors.text.secondary};
  font-size: ${props => props.theme.fonts.sizes.md};
  font-weight: ${props => props.theme.fonts.weights.medium};
  animation: ${pulse} 2s ease-in-out infinite;
`;

const LoadingSpinner = ({ 
  text = 'Chargement...', 
  fullHeight = false,
  size = 'medium',
  showLogo = true,
  motivationalText = null
}) => {
  const encouragingTexts = [
    "Tu deviens plus forte ! 💪",
    "Ton entraînement se prépare... ✨",
    "ELLA, tu es incroyable ! 🌟",
    "Préparation de ton parcours fitness...",
    "Ton succès se construit maintenant ! 🚀"
  ];

  const displayText = motivationalText || encouragingTexts[Math.floor(Math.random() * encouragingTexts.length)];

  return (
    <SpinnerContainer fullHeight={fullHeight}>
      {showLogo && (
        <LogoContainer>
          <BrandedLogo src={logoImg} alt="ELLA Run" size={size} />
        </LogoContainer>
      )}
      <SpinnerRing size={size}>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </SpinnerRing>
      <SpinnerText>{text}</SpinnerText>
      {(fullHeight || motivationalText) && (
        <SpinnerText style={{ fontSize: '0.9rem', fontStyle: 'italic', marginTop: '8px' }}>
          {displayText}
        </SpinnerText>
      )}
    </SpinnerContainer>
  );
};

export default LoadingSpinner;