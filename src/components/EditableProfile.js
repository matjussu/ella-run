/**
 * Editable Profile Component
 * 
 * Always-editable profile form that saves changes automatically
 * and is used for workout generation
 */

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import userProfileService from '../services/userProfileService';

// Styled Components
const ProfileContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: ${props => props.theme.spacing.lg};
`;

const ProfileHeader = styled.div`
  text-align: center;
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const ProfileTitle = styled.h1`
  font-size: ${props => props.theme.fonts.sizes.xxxl};
  font-weight: ${props => props.theme.fonts.weights.bold};
  color: ${props => props.theme.colors.primary};
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const ProfileSubtitle = styled.p`
  font-size: ${props => props.theme.fonts.sizes.lg};
  color: ${props => props.theme.colors.text.secondary};
  margin: 0;
`;

const FormCard = styled.div`
  background: ${props => props.theme.colors.secondary};
  padding: ${props => props.theme.spacing.xl};
  border-radius: ${props => props.theme.borderRadius.large};
  box-shadow: ${props => props.theme.colors.shadow};
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const FormSection = styled.div`
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const SectionTitle = styled.h3`
  font-size: ${props => props.theme.fonts.sizes.xl};
  font-weight: ${props => props.theme.fonts.weights.semibold};
  color: ${props => props.theme.colors.primary};
  margin-bottom: ${props => props.theme.spacing.md};
  border-bottom: 2px solid ${props => props.theme.colors.primary}22;
  padding-bottom: ${props => props.theme.spacing.sm};
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${props => props.theme.spacing.md};
  margin-bottom: ${props => props.theme.spacing.md};
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.xs};
`;

const Label = styled.label`
  font-weight: ${props => props.theme.fonts.weights.semibold};
  color: ${props => props.theme.colors.text.primary};
  font-size: ${props => props.theme.fonts.sizes.sm};
`;

const Input = styled.input`
  padding: ${props => props.theme.spacing.sm};
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.medium};
  font-size: ${props => props.theme.fonts.sizes.md};
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}22;
  }
  
  &:invalid {
    border-color: ${props => props.theme.colors.error};
  }
`;

const Select = styled.select`
  padding: ${props => props.theme.spacing.sm};
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.medium};
  font-size: ${props => props.theme.fonts.sizes.md};
  background: ${props => props.theme.colors.secondary};
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}22;
  }
`;

const CheckboxGroup = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${props => props.theme.spacing.sm};
  margin-top: ${props => props.theme.spacing.sm};
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

const CheckboxItem = styled.label`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.sm};
  border-radius: ${props => props.theme.borderRadius.medium};
  cursor: pointer;
  transition: background-color 0.3s ease;
  
  &:hover {
    background: ${props => props.theme.colors.background.secondary};
  }
  
  input[type="checkbox"] {
    width: 18px;
    height: 18px;
    accent-color: ${props => props.theme.colors.primary};
  }
`;

const SaveIndicator = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  background: ${props => props.theme.colors.success};
  color: white;
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.pill};
  font-size: ${props => props.theme.fonts.sizes.sm};
  font-weight: ${props => props.theme.fonts.weights.medium};
  z-index: 1000;
  opacity: ${props => props.$visible ? 1 : 0};
  transform: translateY(${props => props.$visible ? '0' : '-10px'});
  transition: all 0.3s ease;
`;

const StatsPreview = styled.div`
  background: ${props => props.theme.colors.background.secondary};
  padding: ${props => props.theme.spacing.lg};
  border-radius: ${props => props.theme.borderRadius.medium};
  margin-top: ${props => props.theme.spacing.lg};
`;

const StatRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${props => props.theme.spacing.sm} 0;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  
  &:last-child {
    border-bottom: none;
  }
`;

const StatLabel = styled.span`
  font-weight: ${props => props.theme.fonts.weights.medium};
  color: ${props => props.theme.colors.text.secondary};
`;

const StatValue = styled.span`
  font-weight: ${props => props.theme.fonts.weights.semibold};
  color: ${props => props.theme.colors.text.primary};
`;

// Default profile data
const DEFAULT_PROFILE = {
  name: 'Ella',
  age: 25,
  weight: 63,
  height: 170,
  gender: 'female',
  fitnessLevel: 'beginner',
  goals: ['endurance', 'strength'],
  targetAreas: ['full_body', 'legs', 'core'],
  availableDays: ['monday', 'wednesday', 'friday'],
  sessionDuration: 45,
  equipment: ['none'],
  injuries: [],
  preferences: ['running', 'bodyweight']
};

// Helper function to ensure profile has all required array fields
const ensureProfileArrays = (profile) => {
  return {
    ...profile,
    goals: Array.isArray(profile.goals) ? profile.goals : ['endurance'],
    targetAreas: Array.isArray(profile.targetAreas) ? profile.targetAreas : ['full_body'],
    availableDays: Array.isArray(profile.availableDays) ? profile.availableDays : ['monday', 'wednesday', 'friday'],
    equipment: Array.isArray(profile.equipment) ? profile.equipment : ['none'],
    injuries: Array.isArray(profile.injuries) ? profile.injuries : [],
    preferences: Array.isArray(profile.preferences) ? profile.preferences : ['running']
  };
};

const FITNESS_LEVELS = [
  { value: 'beginner', label: 'Débutante' },
  { value: 'intermediate', label: 'Intermédiaire' },
  { value: 'advanced', label: 'Avancée' }
];

const GOALS = [
  { value: 'weight_loss', label: 'Perte de poids' },
  { value: 'muscle_gain', label: 'Prise de muscle' },
  { value: 'endurance', label: 'Endurance' },
  { value: 'strength', label: 'Force' },
  { value: 'flexibility', label: 'Flexibilité' },
  { value: 'general_fitness', label: 'Forme générale' }
];

const TARGET_AREAS = [
  { value: 'full_body', label: 'Corps entier' },
  { value: 'upper_body', label: 'Haut du corps' },
  { value: 'lower_body', label: 'Bas du corps' },
  { value: 'core', label: 'Abdominaux' },
  { value: 'legs', label: 'Jambes' },
  { value: 'arms', label: 'Bras' },
  { value: 'back', label: 'Dos' },
  { value: 'glutes', label: 'Fessiers' }
];

const DAYS_OF_WEEK = [
  { value: 'monday', label: 'Lundi' },
  { value: 'tuesday', label: 'Mardi' },
  { value: 'wednesday', label: 'Mercredi' },
  { value: 'thursday', label: 'Jeudi' },
  { value: 'friday', label: 'Vendredi' },
  { value: 'saturday', label: 'Samedi' },
  { value: 'sunday', label: 'Dimanche' }
];

const EQUIPMENT = [
  { value: 'none', label: 'Aucun équipement' },
  { value: 'dumbbells', label: 'Haltères' },
  { value: 'resistance_bands', label: 'Bandes élastiques' },
  { value: 'kettlebell', label: 'Kettlebell' },
  { value: 'pull_up_bar', label: 'Barre de traction' },
  { value: 'yoga_mat', label: 'Tapis de yoga' }
];

const PREFERENCES = [
  { value: 'running', label: 'Course à pied' },
  { value: 'bodyweight', label: 'Poids du corps' },
  { value: 'hiit', label: 'HIIT' },
  { value: 'yoga', label: 'Yoga' },
  { value: 'pilates', label: 'Pilates' },
  { value: 'strength_training', label: 'Musculation' }
];

const EditableProfile = () => {
  const [profile, setProfile] = useState(DEFAULT_PROFILE);
  const [loading, setLoading] = useState(true);
  const [saveVisible, setSaveVisible] = useState(false);
  const [autoSaveTimeout, setAutoSaveTimeout] = useState(null);

  // Load profile on mount
  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const savedProfile = await userProfileService.getUserProfileByName('Ella');
      
      console.log('📁 Saved profile from database:', savedProfile);
      console.log('📁 Default profile:', DEFAULT_PROFILE);
      
      if (savedProfile) {
        const mergedProfile = ensureProfileArrays({ ...DEFAULT_PROFILE, ...savedProfile });
        console.log('📁 Merged profile:', mergedProfile);
        setProfile(mergedProfile);
      } else {
        console.log('📁 Using default profile');
        const defaultProfile = ensureProfileArrays(DEFAULT_PROFILE);
        setProfile(defaultProfile);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      // Fallback to default profile on error
      setProfile(ensureProfileArrays(DEFAULT_PROFILE));
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async (newProfile = profile) => {
    try {
      await userProfileService.saveUserProfile(newProfile);
      
      setSaveVisible(true);
      setTimeout(() => setSaveVisible(false), 2000);
      
      console.log('✅ Profile saved successfully');
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  const handleInputChange = (field, value) => {
    console.log(`💾 Input change: ${field} =`, value);
    
    const newProfile = { ...profile, [field]: value };
    console.log(`💾 New profile state:`, newProfile);
    
    setProfile(newProfile);
    
    // Auto-save after 1 second of no changes
    if (autoSaveTimeout) {
      clearTimeout(autoSaveTimeout);
    }
    
    const timeout = setTimeout(() => {
      console.log(`💾 Auto-saving profile for field: ${field}`);
      saveProfile(newProfile);
    }, 1000);
    
    setAutoSaveTimeout(timeout);
  };

  const handleArrayChange = (field, value, checked) => {
    console.log(`🔄 Array change: ${field}, value: ${value}, checked: ${checked}`);
    
    // Force a fresh copy of the current profile to avoid reference issues
    const currentProfile = { ...profile };
    const currentArray = Array.isArray(currentProfile[field]) ? [...currentProfile[field]] : [];
    console.log(`Current ${field}:`, currentArray);
    
    let newArray;
    
    if (checked) {
      // Add if not already present
      if (!currentArray.includes(value)) {
        newArray = [...currentArray, value];
        console.log(`✅ Adding ${value} to ${field}`);
      } else {
        console.log(`⚠️ ${value} already in ${field}`);
        return; // Don't update if already present
      }
    } else {
      // Remove if present
      newArray = currentArray.filter(item => item !== value);
      console.log(`❌ Removing ${value} from ${field}`);
    }
    
    console.log(`New ${field}:`, newArray);
    
    // Update the profile immediately with the new array
    const updatedProfile = { ...currentProfile, [field]: newArray };
    setProfile(updatedProfile);
    
    // Then handle auto-save
    if (autoSaveTimeout) {
      clearTimeout(autoSaveTimeout);
    }
    
    const timeout = setTimeout(() => {
      console.log(`💾 Auto-saving profile for array field: ${field}`);
      saveProfile(updatedProfile);
    }, 1000);
    
    setAutoSaveTimeout(timeout);
  };

  // Calculate BMI
  const calculateBMI = () => {
    const heightInMeters = profile.height / 100;
    const bmi = profile.weight / (heightInMeters * heightInMeters);
    return Math.round(bmi * 10) / 10;
  };

  const getBMICategory = (bmi) => {
    if (bmi < 18.5) return 'Poids insuffisant';
    if (bmi < 25) return 'Poids normal';
    if (bmi < 30) return 'Surpoids';
    return 'Obésité';
  };

  if (loading) {
    return (
      <ProfileContainer>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <p>Chargement du profil...</p>
        </div>
      </ProfileContainer>
    );
  }

  const bmi = calculateBMI();

  return (
    <ProfileContainer>
      <SaveIndicator $visible={saveVisible}>
        ✅ Profil sauvegardé
      </SaveIndicator>

      <ProfileHeader>
        <ProfileTitle>Mon Profil</ProfileTitle>
        <ProfileSubtitle>Informations utilisées pour personnaliser tes entraînements</ProfileSubtitle>
      </ProfileHeader>

      <FormCard>
        <FormSection>
          <SectionTitle>Informations personnelles</SectionTitle>
          
          <FormRow>
            <FormGroup>
              <Label htmlFor="name">Nom</Label>
              <Input
                id="name"
                type="text"
                value={profile.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Ton nom"
              />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="age">Âge</Label>
              <Input
                id="age"
                type="number"
                min="16"
                max="100"
                value={profile.age}
                onChange={(e) => handleInputChange('age', parseInt(e.target.value))}
              />
            </FormGroup>
          </FormRow>

          <FormRow>
            <FormGroup>
              <Label htmlFor="weight">Poids (kg)</Label>
              <Input
                id="weight"
                type="number"
                min="30"
                max="200"
                step="0.1"
                value={profile.weight}
                onChange={(e) => handleInputChange('weight', parseFloat(e.target.value))}
              />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="height">Taille (cm)</Label>
              <Input
                id="height"
                type="number"
                min="120"
                max="220"
                value={profile.height}
                onChange={(e) => handleInputChange('height', parseInt(e.target.value))}
              />
            </FormGroup>
          </FormRow>

          <FormGroup>
            <Label htmlFor="fitnessLevel">Niveau de forme</Label>
            <Select
              id="fitnessLevel"
              value={profile.fitnessLevel}
              onChange={(e) => handleInputChange('fitnessLevel', e.target.value)}
            >
              {FITNESS_LEVELS.map(level => (
                <option key={level.value} value={level.value}>
                  {level.label}
                </option>
              ))}
            </Select>
          </FormGroup>
        </FormSection>

        <FormSection>
          <SectionTitle>Objectifs fitness</SectionTitle>
          <CheckboxGroup>
            {GOALS.map(goal => {
              const isChecked = profile.goals?.includes(goal.value) || false;
              console.log(`🎯 Goal ${goal.value}: checked=${isChecked}, profile.goals=`, profile.goals);
              
              return (
                <CheckboxItem key={goal.value}>
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={(e) => {
                      console.log(`🎯 Goal checkbox changed: ${goal.value}, checked: ${e.target.checked}`);
                      handleArrayChange('goals', goal.value, e.target.checked);
                    }}
                  />
                  {goal.label}
                </CheckboxItem>
              );
            })}
          </CheckboxGroup>
        </FormSection>

        <FormSection>
          <SectionTitle>Zones à travailler</SectionTitle>
          <CheckboxGroup>
            {TARGET_AREAS.map(area => (
              <CheckboxItem key={area.value}>
                <input
                  type="checkbox"
                  checked={profile.targetAreas?.includes(area.value) || false}
                  onChange={(e) => handleArrayChange('targetAreas', area.value, e.target.checked)}
                />
                {area.label}
              </CheckboxItem>
            ))}
          </CheckboxGroup>
        </FormSection>

        <FormSection>
          <SectionTitle>Planning d'entraînement</SectionTitle>
          
          <FormGroup>
            <Label>Jours disponibles</Label>
            <CheckboxGroup>
              {DAYS_OF_WEEK.map(day => {
                const isChecked = profile.availableDays?.includes(day.value) || false;
                console.log(`📅 Day ${day.value}: checked=${isChecked}, profile.availableDays=`, profile.availableDays);
                
                return (
                  <CheckboxItem key={day.value}>
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={(e) => {
                        console.log(`📅 Day checkbox changed: ${day.value}, checked: ${e.target.checked}`);
                        handleArrayChange('availableDays', day.value, e.target.checked);
                      }}
                    />
                    {day.label}
                  </CheckboxItem>
                );
              })}
            </CheckboxGroup>
          </FormGroup>

          <FormGroup>
            <Label htmlFor="sessionDuration">Durée par session (minutes)</Label>
            <Select
              id="sessionDuration"
              value={profile.sessionDuration}
              onChange={(e) => handleInputChange('sessionDuration', parseInt(e.target.value))}
            >
              <option value={30}>30 minutes</option>
              <option value={45}>45 minutes</option>
              <option value={60}>60 minutes</option>
              <option value={90}>90 minutes</option>
            </Select>
          </FormGroup>
        </FormSection>

        <FormSection>
          <SectionTitle>Équipement disponible</SectionTitle>
          <CheckboxGroup>
            {EQUIPMENT.map(eq => (
              <CheckboxItem key={eq.value}>
                <input
                  type="checkbox"
                  checked={profile.equipment?.includes(eq.value) || false}
                  onChange={(e) => handleArrayChange('equipment', eq.value, e.target.checked)}
                />
                {eq.label}
              </CheckboxItem>
            ))}
          </CheckboxGroup>
        </FormSection>

        <FormSection>
          <SectionTitle>Types d'exercices préférés</SectionTitle>
          <CheckboxGroup>
            {PREFERENCES.map(pref => (
              <CheckboxItem key={pref.value}>
                <input
                  type="checkbox"
                  checked={profile.preferences?.includes(pref.value) || false}
                  onChange={(e) => handleArrayChange('preferences', pref.value, e.target.checked)}
                />
                {pref.label}
              </CheckboxItem>
            ))}
          </CheckboxGroup>
        </FormSection>

        <StatsPreview>
          <SectionTitle>Statistiques</SectionTitle>
          <StatRow>
            <StatLabel>IMC</StatLabel>
            <StatValue>{bmi} ({getBMICategory(bmi)})</StatValue>
          </StatRow>
          <StatRow>
            <StatLabel>Jours d'entraînement par semaine</StatLabel>
            <StatValue>{profile.availableDays?.length || 0}</StatValue>
          </StatRow>
          <StatRow>
            <StatLabel>Durée totale par semaine</StatLabel>
            <StatValue>{(profile.availableDays?.length || 0) * profile.sessionDuration} minutes</StatValue>
          </StatRow>
        </StatsPreview>
      </FormCard>
    </ProfileContainer>
  );
};

export default EditableProfile;