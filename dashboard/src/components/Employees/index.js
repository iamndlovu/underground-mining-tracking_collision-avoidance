import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Loading from '../Loading';
import EmployeeCard from './EmployeeCard';

import styles from './EmployeeList.module.scss';

const EmployeeList = () => {
  const [employees, setEmployees] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get('http://localhost:5000/employees');
        setEmployees(res.data);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  return (
    <section className={styles.EmployeeList}>
      {(employees &&
        employees.map((employee) => (
          <EmployeeCard employee={employee} key={employee._id} />
        ))) || <Loading message='Fetching employees...' />}
    </section>
  );
};

export default EmployeeList;
