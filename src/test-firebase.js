/**
 * Firebase Connection Test
 * 
 * Simple test to verify Firebase is connected properly
 */

import { db } from './config/firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';

export const testFirebaseConnection = async () => {
  try {
    console.log('🔥 Testing Firebase connection...');
    
    // Test read access
    const testQuery = await getDocs(collection(db, 'test'));
    console.log('✅ Firebase read test successful');
    
    // Test write access
    const testDoc = await addDoc(collection(db, 'test'), {
      message: 'Hello from ELLA Run!',
      timestamp: new Date(),
      testId: Math.random().toString(36).substr(2, 9)
    });
    
    console.log('✅ Firebase write test successful:', testDoc.id);
    
    return { success: true, message: 'Firebase connection working properly' };
    
  } catch (error) {
    console.error('❌ Firebase connection test failed:', error);
    return { 
      success: false, 
      error: error.message,
      suggestion: 'Check Firebase configuration and network connection'
    };
  }
};

// Quick environment check
export const checkEnvironmentVariables = () => {
  const requiredVars = [
    'REACT_APP_FIREBASE_API_KEY',
    'REACT_APP_FIREBASE_AUTH_DOMAIN',
    'REACT_APP_FIREBASE_PROJECT_ID',
    'REACT_APP_FIREBASE_STORAGE_BUCKET',
    'REACT_APP_FIREBASE_MESSAGING_SENDER_ID',
    'REACT_APP_FIREBASE_APP_ID'
  ];
  
  const missing = requiredVars.filter(varName => !process.env[varName]);
  
  if (missing.length > 0) {
    console.error('❌ Missing Firebase environment variables:', missing);
    return { valid: false, missing };
  }
  
  console.log('✅ All Firebase environment variables are set');
  return { valid: true, missing: [] };
};