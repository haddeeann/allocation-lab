import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import '@/app/globals.css';
import { DecisionLabApp } from '@/components/decision-lab-app';

const root = document.getElementById('root');

if (!root) {
  throw new Error('Static application root was not found.');
}

createRoot(root).render(
  <StrictMode>
    <DecisionLabApp />
  </StrictMode>,
);
