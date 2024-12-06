import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { useAuth } from './components/AuthContext';
import { useUser } from './components/UserContext';
import { useWallet } from './components/WalletConnection';
import AppRoutes from './AppRoutes';
import ErrorBoundary from './components/ErrorBoundary'; // Import your ErrorBoundary

function App() {
    const { isAuthenticated, principal, login, logout } = useAuth();
    const { user } = useUser();
    // const { isConnected, connectWallet } = useWallet();

    return (
        <ErrorBoundary> {/* Wrap your app with ErrorBoundary */}
            <Router>
                <div className="app">
                    {isAuthenticated && (
                        <div className="wallet-status">
                            {/* {!isConnected && (
                                <button onClick={connectWallet}>
                                    Connect Wallet
                                </button>
                            )} */}
                        </div>
                    )}
                    <AppRoutes 
                        isAuthenticated={isAuthenticated}
                        principal={principal}
                        onLogin={login}
                        onLogout={logout}
                        // isWalletConnected={isConnected}
                    />
                </div>
            </Router>
        </ErrorBoundary>
    );
}

export default App;
