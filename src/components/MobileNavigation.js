/**
 * Mobile Navigation Component
 * 
 * Bottom navigation bar optimized for mobile touch interactions
 * Replaces the top navigation on mobile devices
 */

import React from 'react';
import styled from 'styled-components';

// Styled Components
const MobileNavContainer = styled.nav`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: ${props => props.theme.colors.secondary};
  border-top: 1px solid ${props => props.theme.colors.border};
  padding: ${props => props.theme.spacing.sm} 0;
  z-index: 100;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.1);
  
  /* Only show on mobile */
  display: none;
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    display: block;
  }
`;

const NavItems = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  max-width: 100%;
  padding: 0 ${props => props.theme.spacing.sm};
`;

const NavItem = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: ${props => props.theme.spacing.xs};
  border-radius: ${props => props.theme.borderRadius.medium};
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
  min-width: 60px;
  color: ${props => props.$active ? props.theme.colors.primary : props.theme.colors.text.secondary};
  
  &:hover, &:focus {
    background: ${props => props.theme.colors.background.secondary};
    color: ${props => props.theme.colors.primary};
    transform: translateY(-2px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const NavIcon = styled.div`
  font-size: 1.5rem;
  transition: transform 0.3s ease;
  
  ${NavItem}:hover & {
    transform: scale(1.1);
  }
`;

const NavLabel = styled.span`
  font-size: ${props => props.theme.fonts.sizes.xs};
  font-weight: ${props => props.$active ? props.theme.fonts.weights.semibold : props.theme.fonts.weights.medium};
  text-align: center;
  white-space: nowrap;
`;

// Navigation items configuration
const NAV_ITEMS = [
  {
    id: 'home',
    icon: '🏠',
    label: 'Accueil',
    action: 'HOME'
  },
  {
    id: 'workout',
    icon: '💪',
    label: 'Workout',
    action: 'WORKOUT_GENERATOR'
  },
  {
    id: 'progress',
    icon: '📊',
    label: 'Progrès',
    action: 'PROGRESS'
  },
  {
    id: 'profile',
    icon: '👤',
    label: 'Profil',
    action: 'PROFILE'
  },
  {
    id: 'achievements',
    icon: '🏆',
    label: 'Succès',
    action: 'ACHIEVEMENTS'
  }
];

/**
 * Mobile Navigation Component
 */
const MobileNavigation = ({ currentView, onNavigate }) => {
  const handleNavClick = (action) => {
    // Add haptic feedback on supported devices
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
    
    onNavigate(action);
  };

  return (
    <MobileNavContainer>
      <NavItems>
        {NAV_ITEMS.map((item) => (
          <NavItem
            key={item.id}
            $active={currentView === item.action}
            onClick={() => handleNavClick(item.action)}
            aria-label={item.label}
          >
            <NavIcon>{item.icon}</NavIcon>
            <NavLabel $active={currentView === item.action}>
              {item.label}
            </NavLabel>
          </NavItem>
        ))}
      </NavItems>
    </MobileNavContainer>
  );
};

export default MobileNavigation;