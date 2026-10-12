# FindIt+ Frontend — College Lost & Found Portal

Modern, responsive single-page web application for FindIt+, built with React 18 and Vite.

## Technology Stack
- **React 18** (Functional components, hooks, React Context API)
- **React Router DOM v6** (Client-side routing with protected routes)
- **Vite 5** (Fast development server and optimized build)
- **Lucide React** (Modern, clean icon set)
- **Axios** (Centralized API client with JWT interceptor)
- **Vanilla CSS** (Custom responsive design system)

## Development Setup

### Prerequisites
- Node.js 18+ and npm

### Installation
```bash
npm install
```

### Running Locally
```bash
npm run dev
```
The application will be accessible at: `http://localhost:5173`

The development server proxies `/api` and `/uploads` requests to the Spring Boot backend at `http://localhost:8080`.

### Production Build
```bash
npm run build
```
Build output is generated into the `dist/` directory.

### Preview Production Build
```bash
npm run preview
```

## Project Structure
```
frontend/
├── public/
├── src/
│   ├── components/      # Reusable UI components (Navbar, Footer, ItemCard, etc.)
│   ├── context/         # AuthContext and NotificationContext
│   ├── pages/           # Application views (Home, Browse, Claim, Admin, etc.)
│   ├── services/        # Axios API client and endpoint helpers
│   ├── styles/          # Global CSS and themes
│   ├── App.jsx          # Route declarations
│   └── main.jsx         # React application entry point
├── index.html
├── package.json
├── package-lock.json
└── vite.config.js
```
