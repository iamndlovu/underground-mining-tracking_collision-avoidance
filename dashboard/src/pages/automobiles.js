import React from 'react';
import { Navigate } from 'react-router-dom';
import Layout from '../components/Layout';
import AutomobileList from '../components/Automobiles';

const Automobiles = ({ user }) => {
  return (
    <Layout title='Automobiles- UMT & CAS' user={user}>
      {user ? (
        <main
          style={{
            width: '100%',
            flexGrow: 1,

            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <AutomobileList />
        </main>
      ) : (
        <Navigate to='/login' replace />
      )}
    </Layout>
  );
};

export default Automobiles;
