import React from 'react';
import { Navigate } from 'react-router-dom';
import Dashboard from '../components/dashboard/Dashboard';
import Layout from '../components/Layout';

const Home = ({ user }) => {
  return (
    <Layout
      title='Welcome to UMT & CAS'
      user={user}
      hideFooter={true}
      hideHeader={true}
    >
      {user ? (
        user.temp ? (
          <Navigate to='/register' replace />
        ) : (
          <Dashboard user={user} />
        )
      ) : (
        <Navigate to='/login' replace />
      )}
    </Layout>
  );
};

export default Home;
