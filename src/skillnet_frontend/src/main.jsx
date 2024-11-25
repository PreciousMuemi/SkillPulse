import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
// import { ChakraProvider } from '@chakra-ui/react';
import { AuthProvider } from './components/AuthContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      {/* <ChakraProvider> */}
      <App />
      {/* </ChakraProvider> */}
    </AuthProvider>
  </React.StrictMode>,
);
