import React from 'react';
import UserOverview from './UserOverview';

import styles from './StaffDashboard.module.scss';
import btn from '../../button.module.scss';
import { NavLink } from 'react-router-dom';
import Card from '../Card';

const StaffDashboard = ({ user }) => {
  return (
    <main className={styles.StaffDashboard}>
      <div>
        <section className={styles.container}>
          <Card
            title='reports'
            navItems={[
              { text: 'live tracking', link: '/live-data' },
              { text: 'data tracking', link: '/data' },
              { text: 'system users', link: '/users' },
            ]}
          />
          <Card
            title='automobiles'
            navItems={[
              { text: 'all automobiles', link: '/automobiles' },
              { text: 'add automobile', link: '/automobiles/add' },
            ]}
          />
          <Card
            title='employees'
            navItems={[
              { text: 'all employees', link: '/employees' },
              { text: 'add employee', link: '/employees/add' },
            ]}
          />
        </section>
        <div className={styles.overview}>
          <section>
            <UserOverview user={user} />
            <button onClick={() => {}} className={btn.button}>
              <NavLink to='/logout'>LOGOUT</NavLink>
            </button>
          </section>
        </div>
      </div>
    </main>
  );
};

export default StaffDashboard;
