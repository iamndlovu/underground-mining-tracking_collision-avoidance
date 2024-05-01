import React from 'react';
import { Navigate } from 'react-router-dom';
import Layout from '../components/Layout';
import RegistrationForm from './../components/registrationForm/RegistrationForm';

const register = ({ user, handler }) => {
  if (!user) return <Navigate to='/' replace />;
  const { level } = user;
  if (level === 0)
    return (
      <Layout title='Register - UMT & CAS' user={user}>
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
          <RegistrationForm handler={handler} />
        </main>
      </Layout>
    );
  else <Navigate to='/' replace />;
};

export default register;
