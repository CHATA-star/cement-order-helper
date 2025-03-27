
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Create root element for React application
const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element not found");

// Render the app wrapped with all necessary providers
createRoot(rootElement).render(<App />);
