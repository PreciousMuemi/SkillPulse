import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import Logo from './skillnet.jpg';

function Header() {
  const { isAuthenticated, login, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="bg-[#16423C] shadow-lg">
      <nav className="container mx-auto px-4 flex items-center justify-between h-16">
        {/* Logo and App Name */}
        <div className="flex items-center">
          <img src={Logo} alt="App Logo" className="h-10 w-10 mr-2" />
          <span className="text-white font-bold text-xl">SkillNet</span>
        </div>

        {/* Desktop Nav */}
        <ul className="hidden md:flex items-center space-x-4 text-white font-semibold">
          <li>
            <Link to="/" className="hover:text-[#6A9C89] transition duration-300">Home</Link>
          </li>
          <li>
            <Link to="/profile" className="hover:text-[#6A9C89] transition duration-300">Profile</Link>
          </li>
          <li>
            <Link to="/nft-gallery" className="hover:text-[#6A9C89] transition duration-300">NFT Gallery</Link>
          </li>
          <li>
            <Link to="/mentor-match" className="hover:text-[#6A9C89] transition duration-300">Mentor Match</Link>
          </li>
          <li>
            <Link to="/leaderboard" className="hover:text-[#6A9C89] transition duration-300">Leaderboard</Link>
          </li>
        </ul>

        {/* Auth Button */}
        <div className="hidden md:flex">
          {isAuthenticated ? (
            <button
              onClick={logout}
              className="bg-[#6A9C89] text-white px-4 py-2 rounded-full font-semibold hover:bg-opacity-80 transition duration-300"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={login}
              className="bg-[#6A9C89] text-white px-4 py-2 rounded-full font-semibold hover:bg-opacity-80 transition duration-300"
            >
              Login
            </button>
          )}
        </div>

        {/* Mobile Menu Icon */}
        <button className="md:hidden text-white" onClick={toggleSidebar}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
      </nav>

      {/* Mobile Sidebar */}
      {isOpen && (
        <div className="md:hidden bg-[#16423C] h-full w-64 fixed top-0 right-0 z-50 shadow-lg transform transition-transform duration-300">
          <div className="flex flex-col p-6 text-white">
            <button className="self-end mb-6" onClick={toggleSidebar}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <Link to="/" className="mb-4 hover:text-[#6A9C89] transition duration-300" onClick={toggleSidebar}>
              Home
            </Link>
            <Link to="/profile" className="mb-4 hover:text-[#6A9C89] transition duration-300" onClick={toggleSidebar}>
              Profile
            </Link>
            <Link to="/nft-gallery" className="mb-4 hover:text-[#6A9C89] transition duration-300" onClick={toggleSidebar}>
              NFT Gallery
            </Link>
            <Link to="/mentor-match" className="mb-4 hover:text-[#6A9C89] transition duration-300" onClick={toggleSidebar}>
              Mentor Match
            </Link>
            <Link to="/leaderboard" className="mb-4 hover:text-[#6A9C89] transition duration-300" onClick={toggleSidebar}>
              Leaderboard
            </Link>
            {isAuthenticated ? (
              <button
                onClick={() => {
                  logout();
                  toggleSidebar();
                }}
                className="bg-[#6A9C89] text-white px-4 py-2 rounded-full font-semibold hover:bg-opacity-80 transition duration-300 mt-4"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={() => {
                  login();
                  toggleSidebar();
                }}
                className="bg-[#6A9C89] text-white px-4 py-2 rounded-full font-semibold hover:bg-opacity-80 transition duration-300 mt-4"
              >
                Login
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
