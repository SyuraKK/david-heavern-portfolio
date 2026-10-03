import type { RouteObject } from 'react-router';

import { lazy, Suspense } from 'react';
import { Navigate } from 'react-router';

const IndexPage = lazy(() => import('src/pages/dashboard/one'));
const page = (
  <Suspense
    fallback={
      <div className="route-loading" role="status">
        Loading portfolio…
      </div>
    }
  >
    <IndexPage />
  </Suspense>
);

export const dashboardRoutes: RouteObject[] = [
  {
    path: 'dashboard',
    children: [
      { index: true, element: <Navigate to="overview" replace /> },
      { path: 'overview', element: page },
      { path: 'experience', element: page },
      { path: 'expertise', element: page },
      { path: 'projects', element: <Navigate to="/dashboard/expertise" replace /> },
      { path: 'projects/:projectSlug', element: page },
      { path: 'education', element: <Navigate to="/dashboard/experience#education" replace /> },
      { path: 'contact', element: page },
    ],
  },
];
