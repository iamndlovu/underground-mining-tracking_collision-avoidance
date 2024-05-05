import React from 'react';
import { Navigate } from 'react-router-dom';
import Layout from '../components/Layout';
import AddObject from '../components/AddObject';

const AddEmployee = ({ user }) => {
  return (
    <Layout title='Add Employee - UMT & CAS' user={user}>
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
          <AddObject user={user} type={'employee'} />
        </main>
      ) : (
        <Navigate to='/login' replace />
      )}
    </Layout>
  );
};

export default AddEmployee;
