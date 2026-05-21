import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ApolloProvider } from '@apollo/client/react'  // 👈 v4
import client from './apolloClient'
import './app.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </StrictMode>,
)