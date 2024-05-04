import React from 'react';
import { Navigate } from 'react-router-dom';
import Layout from '../components/Layout';
import DataTable from '../components/DataTable';

const LiveData = ({ user }) => {
  return (
    <Layout title='Live Data - UMT & CAS' user={user} hideFooter={true}>
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
          <section>
            <h2
              style={{
                textTransform: 'uppercase',
                margin: '1rem 0 2rem 0',
              }}
            >
              Live Data tracking
            </h2>
            <DataTable showAll={false} />
          </section>
        ) : (
          <Navigate to='/login' replace />
        )}
      </main>
    </Layout>
  );
};

export default LiveData;
