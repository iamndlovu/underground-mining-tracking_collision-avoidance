import React from 'react';
import { Navigate } from 'react-router-dom';
import UserList from '../components/users/UserList';
import Layout from '../components/Layout';

const Users = ({ user }) => {
  return (
    <Layout title='Users - UMT & CAS' user={user}>
      {user ? (
        <main
          style={{
            width: '100%',
            flexGrow: 1,

            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <UserList user={user} />
        </main>
      ) : (
        <Navigate to='/login' replace />
      )}
    </Layout>
  );
};

export default Users;
