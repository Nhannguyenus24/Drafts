import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import routes from './routes.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {Object.entries(routes).map(([path, { component: Component }]) => (
      <Route key={path} path={path} element={<Component />} />
    ))}
  </StrictMode>,
)
