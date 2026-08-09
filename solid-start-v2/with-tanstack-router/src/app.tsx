import { router } from './router';
import { RouterProvider } from '@tanstack/solid-router';
import { getRequestEvent } from 'solid-js/web';

import './app.css';

export default function App() {
  const event = getRequestEvent();
  const requestRouter = event?.locals.router as typeof router | undefined;

  return <RouterProvider router={requestRouter ?? router} />;
}
