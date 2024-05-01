import React from 'react';
import { NavLink } from 'react-router-dom';

import styles from './AdminActions.module.scss';

const AdminActions = () => (
  <section className={styles.AdminActions}>
    <div className={styles.users}>
      <h3>User Management</h3>
      <nav role='menu'>
        <NavLink to='/register' role='menuitem'>
          Add New User
        </NavLink>
        <NavLink to='/users' role='menuitem'>
          All Users
        </NavLink>
      </nav>
    </div>
    <div className={styles.system}>
      <h3>System</h3>
      <nav>
        <NavLink to='/system/reports' role='menuitem'>
          System Reports
        </NavLink>
      </nav>
    </div>
  </section>
);

export default AdminActions;
