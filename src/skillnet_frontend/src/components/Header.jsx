import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext';

function Header() {
  const { isAuthenticated, login, logout } = useAuth();

  return (
    <header>
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/profile">Profile</Link></li>
          <li><Link to="/nft-gallery">NFT Gallery</Link></li>
          <li><Link to="/mentor-match">Mentor Match</Link></li>
          <li><Link to="/leaderboard">Leaderboard</Link></li>
        </ul>
      </nav>
      {isAuthenticated ? (
        <button onClick={logout}>Logout</button>
      ) : (
        <button onClick={login}>Login</button>
      )}
    </header>
  );
}

export default Header;