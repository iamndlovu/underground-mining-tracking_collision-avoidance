import React from 'react';
import { Navigate } from 'react-router-dom';
import Layout from '../components/Layout';
import Restricted from '../components/Restricted';
import DataTable from '../components/DataTable';

const Data = ({ user }) => {
  return (
    <Layout title='Collected Data - UMT & CAS' user={user} hideFooter={true}>
      <main
        style={{
          display: 'flex',
          justifyContent: 'center',
          width: '100%',
          flexGrow: 1,
          height: '100%',
        }}
      >
        {user ? (
          Number(user.level) === 0 ? (
            <section>
              <h2
                style={{
                  textTransform: 'uppercase',
                  margin: '1rem 0 2rem 0',
                }}
              >
                plant Data tracking
              </h2>
              <DataTable showAll={true} />
            </section>
          ) : (
            <Restricted />
          )
        ) : (
          <Navigate to='/login' replace />
        )}
      </main>
    </Layout>
  );
};

export default Data;
