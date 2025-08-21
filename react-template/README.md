# Frontend Template

A modern React TypeScript template built with Vite, featuring Material-UI, Redux Toolkit, and other powerful tools for building scalable web applications.

## 🚀 Features

- ⚡️ Vite 6.x - Next Generation Frontend Tooling
- ⚛️ React 19.x with TypeScript
- 🎨 Material-UI (MUI) for beautiful UI components
- 📦 Redux Toolkit for state management
- 🔄 React Router for routing
- 📝 React Hook Form for form handling
- ✅ Zod for schema validation
- 📅 Date-fns for date manipulation
- 🛠 ESLint & Prettier for code quality
- 🐶 Husky for git hooks
- 🐳 Docker support for containerization

## 📋 Prerequisites

- Node.js 20.x or later
- npm or yarn package manager

## 🛠 Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd frontend
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

## 🚀 Development

To start the development server:

```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:5173`

## 🏗 Building for Production

To build the application for production:

```bash
npm run build
# or
yarn build
```

The build output will be in the `dist` directory.

## 🐳 Docker Deployment

Build and run using Docker:

```bash
# Build the image
docker build -t frontend-app .

# Run the container
docker run -p 80:80 frontend-app
```

## 📁 Project Structure

```
src/
├── assets/         # Static assets (images, fonts, etc.)
├── components/     # Reusable UI components
├── constants/      # Application constants
├── hooks/         # Custom React hooks
├── layouts/       # Layout components
├── pages/         # Page components
├── schemas/       # Zod validation schemas
├── stores/        # Redux store configuration
├── styles/        # Global styles and theme
├── utils/         # Utility functions
├── config.ts      # Application configuration
├── main.tsx       # Application entry point
└── routes.tsx     # Route definitions
```

## 📦 Key Dependencies

### Core Dependencies

- `@mui/material` & `@mui/icons-material` - Material-UI components
- `@reduxjs/toolkit` & `react-redux` - State management
- `react-router-dom` - Routing
- `react-hook-form` - Form handling
- `zod` - Schema validation
- `axios` - HTTP client
- `date-fns` - Date manipulation
- `lodash` - Utility functions

### Development Dependencies

- `typescript` - TypeScript support
- `vite` - Build tool
- `eslint` & `prettier` - Code quality
- `husky` & `lint-staged` - Git hooks
- `@vitejs/plugin-react` - Vite React plugin

## 🔧 Code Style

The project uses ESLint and Prettier for code formatting. The configuration is set up to enforce consistent code style across the project.

## 📝 License

[Add your license information here]
