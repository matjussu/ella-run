# 🔧 Setup Guide - Custom Workout Generator

This guide will walk you through setting up the Custom Workout Generator app from scratch, including all external service configurations.

## 📋 Prerequisites Checklist

Before starting, ensure you have:
- [ ] Node.js 16.x or higher installed
- [ ] npm or yarn package manager
- [ ] A modern web browser (Chrome, Firefox, Safari, Edge)
- [ ] Internet connection for API services
- [ ] Text editor or IDE (VS Code recommended)

## 🚀 Step-by-Step Setup

### Step 1: Project Setup

1. **Clone or Download the Project**
   ```bash
   # If using Git
   git clone <repository-url>
   cd workout-generator-app

   # Or download and extract the ZIP file
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```
   
   This will install all required packages including:
   - React 18.2.0
   - Firebase 10.7.1
   - Styled Components 6.1.6
   - Axios for API calls

3. **Verify Installation**
   ```bash
   npm list --depth=0
   ```
   
   You should see all dependencies listed without errors.

### Step 2: Firebase Configuration

Firebase provides the backend database for storing workouts and progress.

#### 2.1 Create Firebase Project

1. **Go to Firebase Console**
   - Visit: https://console.firebase.google.com
   - Sign in with your Google account
   - Click "Create a project"

2. **Configure Project**
   - **Project name**: `workout-generator` (or your preferred name)
   - **Google Analytics**: Choose based on your preference
   - **Location**: Select your region
   - Click "Create project"

#### 2.2 Set Up Firestore Database

1. **Navigate to Firestore**
   - In your Firebase project dashboard
   - Click "Firestore Database" in the left sidebar
   - Click "Create database"

2. **Security Rules**
   - Select "Start in test mode" for development
   - **Important**: This allows read/write access to all users
   - For production, implement proper security rules

3. **Choose Location**
   - Select the region closest to your users
   - Click "Enable"

#### 2.3 Get Firebase Configuration

1. **Project Settings**
   - Click the gear icon ⚙️ next to "Project Overview"
   - Select "Project settings"

2. **Add Web App**
   - Scroll down to "Your apps"
   - Click the web icon `</>`
   - **App nickname**: `workout-generator-web`
   - **Enable Firebase Hosting**: Optional
   - Click "Register app"

3. **Copy Configuration**
   - Copy the configuration object that looks like:
   ```javascript
   const firebaseConfig = {
     apiKey: "AIza...",
     authDomain: "your-project.firebaseapp.com",
     projectId: "your-project-id",
     storageBucket: "your-project.appspot.com",
     messagingSenderId: "123456789",
     appId: "1:123456789:web:abcdef..."
   };
   ```

### Step 3: RapidAPI Configuration

RapidAPI provides the AI workout generation service.

#### 3.1 Create RapidAPI Account

1. **Sign Up**
   - Visit: https://rapidapi.com/hub
   - Click "Sign Up"
   - Use email or social login
   - Verify your email address

2. **Complete Profile**
   - Add basic profile information
   - Choose "Developer" as your role

#### 3.2 Subscribe to AI Workout Planner

1. **Find the API**
   - Search for "AI Workout Planner" in the RapidAPI Hub
   - Or visit the direct API URL (check RapidAPI documentation)

2. **Choose Subscription**
   - **Free Tier**: Usually includes limited requests per month
   - **Paid Tiers**: For higher usage limits
   - Click "Subscribe" on your chosen plan

3. **Get API Key**
   - After subscribing, go to the API page
   - Copy your `X-RapidAPI-Key` from the code examples
   - Note the `X-RapidAPI-Host` value

### Step 4: Environment Variables Setup

1. **Copy Environment Template**
   ```bash
   cp .env.example .env
   ```

2. **Edit .env File**
   Open the `.env` file and fill in your values:

   ```env
   # RapidAPI Configuration
   REACT_APP_RAPIDAPI_KEY=your_rapidapi_key_here
   REACT_APP_RAPIDAPI_HOST=ai-workout-planner.p.rapidapi.com

   # Firebase Configuration (from Step 2.3)
   REACT_APP_FIREBASE_API_KEY=AIza...
   REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   REACT_APP_FIREBASE_PROJECT_ID=your-project-id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
   REACT_APP_FIREBASE_APP_ID=1:123456789:web:abcdef...
   ```

3. **Verify Environment Variables**
   - **Important**: All React environment variables must start with `REACT_APP_`
   - **Never** commit the `.env` file to version control
   - The `.env` file should be in your project root directory

### Step 5: First Run

1. **Start Development Server**
   ```bash
   npm start
   ```

2. **Verify Application**
   - Browser should automatically open to `http://localhost:3000`
   - You should see the workout generator homepage
   - Check browser console for any errors

3. **Test Core Functionality**
   - Click "Generate New Workout Plan"
   - If RapidAPI is configured correctly, you'll get a real workout
   - If not, the app will use mock data (this is normal for testing)

### Step 6: Testing Firebase Integration

1. **Generate a Workout**
   - Use the app to generate a workout plan
   - The workout should be saved automatically

2. **Check Firebase Console**
   - Go to your Firebase project
   - Navigate to Firestore Database
   - You should see collections created:
     - `workoutSessions`
     - Potentially others as you use the app

3. **Test Progress Tracking**
   - Navigate to the "Progress" tab
   - You should see your workout statistics

## 🔍 Troubleshooting

### Common Issues and Solutions

#### Issue: "Environment variables not found"
**Solution:**
- Ensure `.env` file is in the project root
- Check that all variables start with `REACT_APP_`
- Restart the development server after making changes

#### Issue: Firebase connection errors
**Symptoms:** Console errors about Firebase initialization
**Solution:**
- Double-check all Firebase configuration values
- Ensure Firestore is enabled in your Firebase project
- Verify project ID matches your Firebase project

#### Issue: RapidAPI errors
**Symptoms:** Workout generation fails, console shows API errors
**Solution:**
- Verify your RapidAPI key is correct
- Check your subscription status
- Ensure you're subscribed to the correct API
- The app will fallback to mock data if API fails

#### Issue: App won't start
**Solution:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm start
```

#### Issue: Build failures
**Solution:**
- Check for any TypeScript errors
- Ensure all imports are correct
- Verify environment variables are set

## 🚀 Production Deployment

### Environment Variables for Production

When deploying to production, set these environment variables in your hosting platform:

**For Netlify:**
- Go to Site Settings → Environment Variables
- Add each `REACT_APP_*` variable

**For Vercel:**
- Go to Project Settings → Environment Variables
- Add each variable

**For Firebase Hosting:**
- Environment variables are built into the app during `npm run build`
- Set them locally before building

### Firebase Security Rules for Production

Replace the test mode rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Exercises collection - read only
    match /exercises/{document} {
      allow read: if true;
      allow write: if false; // Only allow writes through admin
    }
    
    // Workout sessions - allow all operations for now
    // In a real app, you'd want user authentication
    match /workoutSessions/{document} {
      allow read, write: if true;
    }
    
    // User progress - allow all operations for now
    match /userProgress/{document} {
      allow read, write: if true;
    }
  }
}
```

## 📚 Next Steps

After successful setup:

1. **Customize the App**
   - Modify colors in the theme object (`src/App.js`)
   - Add your own branding and content
   - Extend the exercise database

2. **Add Features**
   - User authentication
   - Social sharing
   - Workout reminders
   - Custom exercise creation

3. **Monitor Usage**
   - Set up Firebase Analytics
   - Monitor API usage in RapidAPI dashboard
   - Track user engagement

## 🆘 Getting Help

If you encounter issues:

1. **Check the Console**
   - Open browser developer tools (F12)
   - Look for error messages in the console

2. **Review Configuration**
   - Double-check all environment variables
   - Verify Firebase project settings
   - Confirm RapidAPI subscription status

3. **Test Individual Components**
   - Try Firebase connection separately
   - Test RapidAPI endpoints in their dashboard
   - Use the app's built-in error handling

4. **Contact Support**
   - Create an issue in the project repository
   - Include error messages and configuration details (without API keys)
   - Describe steps to reproduce the problem

---

**Congratulations!** 🎉 You've successfully set up the Custom Workout Generator app. Start generating workouts and tracking your fitness journey!