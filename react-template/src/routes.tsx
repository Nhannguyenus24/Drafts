import { Suspense, lazy } from 'react';
import type { LazyExoticComponent, FC } from 'react';
import { Navigate, useRoutes } from 'react-router-dom';
import LoadingScreen from './components/LoadingScreen';

const Loadable = <P extends object>(Component: LazyExoticComponent<FC<P>>) => {
  return function LoadableComponent(props: P) {
    return (
      <Suspense fallback={<LoadingScreen />}>
        <Component {...props} />
      </Suspense>
    );
  };
};

const Page404 = Loadable(lazy(() => import('./pages/Page404')));

export default function Router() {
  return useRoutes([
    { path: '/404', element: <Page404 /> },
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}
