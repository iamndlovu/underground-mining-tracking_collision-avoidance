import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

import headerStyles from './Header.module.scss';

const Header = ({ user }) => {
  //menu state
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className={headerStyles.Header}>
      <div
        className={`${headerStyles.menuButton} ${
          isMenuOpen && headerStyles.open
        }`}
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <div className={headerStyles.buttonLine}></div>
        <div className={headerStyles.buttonLine}></div>
        <div className={headerStyles.buttonLine}></div>
      </div>
      <nav>
        <div>
          <NavLink to='/'>
            <span className={headerStyles.Elephant}>UMT</span>
            {' & '}
            <span className={headerStyles.AvantGarde}>CAS</span>
          </NavLink>
        </div>
        <ul className={`${isMenuOpen && headerStyles.open}`}>
          <li>
            <NavLink
              to='/'
              exact
              className={({ isActive }) => isActive && headerStyles.active}
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to='/about'
              className={({ isActive }) => isActive && headerStyles.active}
            >
              About
            </NavLink>
          </li>
          <li>
            <NavLink
              to={user ? '/logout' : '/login'}
              className={({ isActive }) => isActive && headerStyles.active}
            >
              {user ? 'Log Out' : 'Log In'}
            </NavLink>
          </li>
          <li>
            <NavLink
              to='/contact'
              className={({ isActive }) => isActive && headerStyles.active}
            >
              Report a bug
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
