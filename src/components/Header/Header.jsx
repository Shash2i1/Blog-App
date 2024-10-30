import React, { useState } from 'react';
import { Container, Logo, LogoutBtn } from '../index';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const authStatus = useSelector((state) => state.auth.status);
  const navigate = useNavigate();

  const navItems = [
    { name: 'Home', slug: '/', active: true },
    { name: 'Login', slug: '/login', active: !authStatus },
    { name: 'Signup', slug: '/signup', active: !authStatus },
    { name: 'All Posts', slug: '/all-posts', active: authStatus },
    { name: 'Add Post', slug: '/add-post', active: authStatus },
  ];

  const handleMenuToggle = () => setMenuOpen(!menuOpen);

  return (
    <header className="py-3 shadow bg-[#ECFAFD] sticky top-0 z-50">
      <Container>
        <nav className="flex items-center">
          {/* Logo */}
          <div className="mr-4">
            <Link to="/">
              <Logo />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex ml-auto items-center">
            {navItems.map((item) =>
              item.active ? (
                <li key={item.name}>
                  <button
                    onClick={() => navigate(item.slug)}
                    className="inline-block px-6 py-2 duration-200 hover:bg-[#FF401A] hover:text-white text-gray-600 rounded-full"
                  >
                    {item.name}
                  </button>
                </li>
              ) : null
            )}
            {authStatus && (
              <li>
                <LogoutBtn />
              </li>
            )}
          </ul>

          {/* Hamburger Menu Icon for Mobile */}
          <button
            className="md:hidden ml-auto text-gray-600 focus:outline-none"
            onClick={handleMenuToggle}
          >
            <span className="text-3xl">
              {menuOpen ? '✕' : '☰'}
            </span>
          </button>
        </nav>

        {/* Mobile Navigation with Smooth Transition */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ${
            menuOpen ? 'max-h-96' : 'max-h-0'
          }`}
        >
          <ul className="flex flex-col items-center bg-[#ECFAFD] p-4 space-y-2">
            {navItems.map((item) =>
              item.active ? (
                <li key={item.name}>
                  <button
                    onClick={() => {
                      navigate(item.slug);
                      setMenuOpen(false); // Close menu after navigation
                    }}
                    className="w-full text-center inline-block px-6 py-2 duration-200 hover:bg-[#FF401A] hover:text-white text-gray-600 rounded-full"
                  >
                    {item.name}
                  </button>
                </li>
              ) : null
            )}
            {authStatus && (
              <li>
                <LogoutBtn />
              </li>
            )}
          </ul>
        </div>
      </Container>
    </header>
  );
}

export default Header;
