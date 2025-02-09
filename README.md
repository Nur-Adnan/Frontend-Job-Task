# Interactive Polygon Mapping Tool 🌐

**Live Demo:** [Access Production Environment](https://frontend-job-task-rho.vercel.app/)  
**Video Demonstration:** [View Functionality Walkthrough](https://github.com/user-attachments/assets/97b4c739-ad15-4419-9ed6-a37f21ad5df4)

## Overview
A geospatial web application enabling precise polygon creation and management with real-time geographic calculations. Designed for environmental monitoring, urban planning, and GIS applications.

## Key Features

### Core Functionality
- **Polygon Management**
  - Interactive drawing tools with vertex-level precision
  - Dynamic editing capabilities (position, shape, vertices)
  - Customizable visual properties (HEX color codes for fill/border)
  - Auto-generated centroid markers with hover-activated area displays

- **Data Integrity**
  - Geometric validation preventing overlaps/intersections
  - Complete CRUD operations for spatial features
  - Real-time metric conversions (hectares ↔ km²)

### Advanced Capabilities
- **Data Interoperability**
  - Full JSON schema import/export functionality
  - RESTful API-ready data structures

- **Geospatial Tools**
  - Browser geolocation integration
  - Polygon search by unique identifier
  - Responsive design optimized for field devices

## Technical Architecture

| Component              | Technology                          |
|------------------------|-------------------------------------|
| Frontend Framework     | Next.js 14 (App Router)             |
| State Management       | Redux Toolkit                       |
| Geospatial Rendering   | React Leaflet v4 + Leaflet Draw     |
| Style System           | SCSS Modules                        |
| Development Environment| Vite + TypeScript 5                 |

## System Requirements
- Node.js v18 LTS or newer
- npm v9+ or compatible package manager

## Implementation Guide

### Local Deployment
1. Clone the repository:
   ```bash
   git clone https://github.com/Nur-Adnan/Frontend-Job-Task.git
2. Install dependencies:
   ```bash
   cd Frontend_Job_Task
   npm install
3. Start the development server:
   ```bash
   npm run dev
4.Open your browser to:
  ```bash
  http://localhost:3000
