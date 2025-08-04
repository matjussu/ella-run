/**
 * Minimal App Component for Debugging
 * 
 * This is a simplified version to identify what's causing the startup issue
 */

import React from 'react';
import styled, { ThemeProvider, createGlobalStyle } from 'styled-components';

// Minimal theme
const theme = {
  colors: {
    primary: '#ff69b4',
    secondary: '#ffffff',
    text: {
      primary: '#333333'
    }
  },
  fonts: {
    primary: "'Inter', sans-serif"
  }
};

const GlobalStyle = createGlobalStyle`
  body {
    font-family: ${props => props.theme.fonts.primary};
    margin: 0;
    padding: 0;
  }
`;

const Container = styled.div`
  padding: 2rem;
  text-align: center;
`;

const Title = styled.h1`
  color: ${props => props.theme.colors.primary};
  font-size: 2rem;
  margin-bottom: 1rem;
`;

const Message = styled.p`
  color: ${props => props.theme.colors.text.primary};
  font-size: 1.2rem;
`;

function App() {
  console.log('🚀 Minimal App rendering...');
  
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Container>
        <Title>ELLA Run - Debug Mode</Title>
        <Message>✅ Basic app is loading successfully!</Message>
        <Message>This confirms React, styled-components, and basic rendering work.</Message>
      </Container>
    </ThemeProvider>
  );
}

export default App;