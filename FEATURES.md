# ExploreX - Comprehensive Feature List

ExploreX is a modern, full-stack web application designed for discovering and interacting with unique travel destinations. Below is a detailed breakdown of all the features implemented in the application.

## 🗺️ Interactive Map Exploration
- **Custom Map Engine**: Integrated with Leaflet and OpenStreetMap for highly responsive and detailed interactive maps.
- **Dynamic Markers**: Visual markers for all available offbeat destinations with custom styling and popups.
- **Route & Polyline Rendering**: Ability to visualize paths and connections between different geographical points on the map.
- **Empty State Handling**: Elegant fallback UI when no specific places are selected, guiding the user to start their exploration.

## 🤖 AI-Powered Discovery (Gemini AI)
- **Smart Recommendations**: Leverages Google's Gemini AI to generate personalized recommendations for new places and destinations.
- **AI Content Generation**: Dynamically creates detailed descriptions, travel tips, and insights for uncharted locations.
- **Contextual Awareness**: Provides suggestions based on the user's current view or selected categories.

## ☁️ Cloud Syncing & Data Persistence (Supabase)
- **Real-time Database**: Integrated with Supabase (PostgreSQL) for robust, scalable backend data storage.
- **Dual-Layer Persistence**: 
  - **Local Storage**: Caches user preferences and session data locally for immediate loading and offline resilience (`localStorage`).
  - **Cloud Sync**: Background synchronization mechanism (`supabaseSync.ts`) ensures local changes are safely backed up to the cloud.
- **Seamless User State**: Automatically fetches and restores user data upon authentication or application load using Express backend routes (`/api/sync/user/:email`).
- **Auto-Save Mechanism**: Background saving functionality (`/api/sync/save`) to prevent data loss without interrupting the user experience.

## 📍 Curated Destinations
- **Offbeat Locations**: Features a built-in dataset of unique, lesser-known travel spots (e.g., Ooty's hidden gems like Avalanche Lake, Emerald Lake).
- **Categorization**: Places are categorized (e.g., nature, adventure, historical) to filter and personalize the exploration experience.

## 🎨 Modern & Responsive UI
- **Tailwind CSS Integration**: Utilizes a utility-first CSS framework for a highly polished, consistent, and premium design aesthetic.
- **Glassmorphism & Micro-animations**: Modern design elements including smooth hover effects, transitions, and blurred backdrops to create an engaging user experience.
- **Fully Responsive**: Optimized layouts that adapt perfectly to desktops, tablets, and mobile devices.

## 🛠️ Technical Architecture
- **Frontend**: React (Vite) with TypeScript for type-safe, performant UI components.
- **Backend**: Express.js server (`server.ts`) handling API routes and database interactions.
- **API Integration**: Secure handling of environment variables for AI and Database credentials.
