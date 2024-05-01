import React from 'react';
import { Navigate } from 'react-router-dom';
import Layout from '../components/Layout';

import styles from '../button.module.scss';

const logout = ({ user, handler }) => {
  return (
    <Layout title='Logout - UMT & CAS' user={user}>
      <main
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          flexGrow: 1,
          height: '100%',
        }}
      >
        {user ? (
          <section>
            <p
              style={{
                marginBottom: '1.2rem',
                fontSize: '2rem',
              }}
            >
              Are you sure you want to sign out?
            </p>
            <button onClick={handler} className={styles.button}>
              Log Out
            </button>
          </section>
        ) : (
          <Navigate to='/login' replace />
        )}
      </main>
    </Layout>
  );
};

export default logout;
