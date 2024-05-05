import React from 'react';
import { Navigate } from 'react-router-dom';
import Layout from '../components/Layout';
import EmployeeList from '../components/Employees';

const Employees = ({ user }) => {
  return (
    <Layout title='Employees- UMT & CAS' user={user}>
      {user ? (
        <main
          style={{
            width: '100%',
            flexGrow: 1,

            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <EmployeeList />
        </main>
      ) : (
        <Navigate to='/login' replace />
      )}
    </Layout>
  );
};

export default Employees;
