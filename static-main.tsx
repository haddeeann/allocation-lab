import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import '@/app/globals.css';
import { MiniSProcessExplorer } from '@/components/mini-s-process-explorer';

const root = document.getElementById('root');

if (!root) {
  throw new Error('Static application root was not found.');
}

createRoot(root).render(
  <StrictMode>
    <MiniSProcessExplorer />
  </StrictMode>,
);
