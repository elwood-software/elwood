import { createMemoryRouter } from 'react-router-dom';

import { ElwoodThemeProvider } from '@elwood/ui';
import { dashboardRoutes, Router, ElwoodProvider } from '@elwood/react';
import { createClient } from '@elwood/js';

import './global.css';

export default function App() {
  const client = createClient(
    'http://127.0.0.1:54321',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0',
  );
  const router = createMemoryRouter(dashboardRoutes);

  return (
    <ElwoodThemeProvider>
      <ElwoodProvider workspaceName="Test" client={client}>
        <Router router={router} />
      </ElwoodProvider>
    </ElwoodThemeProvider>
  );
}
