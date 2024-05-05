import React from 'react';
import { Navigate } from 'react-router-dom';
import Layout from '../components/Layout';
import AddObject from '../components/AddObject';

const AddAutomobile = ({ user }) => {
  return (
    <Layout title='Add Automobile - UMT & CAS' user={user}>
      {user ? (
        <main
          style={{
            display: 'flex',
            justifyContent: 'center',
            width: '100%',
            flexGrow: 1,
            height: '100%',
          }}
        >
          <AddObject user={user} type={'automobile'} />
        </main>
      ) : (
        <Navigate to='/login' replace />
      )}
    </Layout>
  );
};

export default AddAutomobile;
