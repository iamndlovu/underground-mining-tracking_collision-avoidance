import React from 'react';
import { Navigate } from 'react-router-dom';
import StaffDashboard from './StaffDashboard';

const Dashboard = ({ user }) => {
  return user ? (
    <StaffDashboard user={user} />
  ) : (
    <Navigate to='/login' replace />
  );
};

export default Dashboard;
