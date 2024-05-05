import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Loading from '../Loading';
import EmployeeCard from '../Employees/EmployeeCard';

import styles from './../Employees/EmployeeList.module.scss';

const AutomobileList = () => {
  const [automobiles, setAutomobiles] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get('http://localhost:5000/automobiles');
        setAutomobiles(res.data);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  return (
    <section className={styles.AutomobileList}>
      {(automobiles &&
        automobiles.map((automobile) => (
          <EmployeeCard automobile={automobile} key={automobile._id} />
        ))) || <Loading message='Fetching automobiles...' />}
    </section>
  );
};

export default AutomobileList;
