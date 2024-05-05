import React from 'react';
import Thumbnail from './Thumbnail';

import photoSrc from '../../../assets/images/user.png';

import styles from './EmployeeCard.module.scss';
import Tags from './Tags';

const EmployeeCard = ({ employee }) => {
  const { fullName, uid, gender, age, grade } = employee;

  return (
    <div className={styles.container}>
      <div className={styles.EmployeeCard}>
        {photoSrc && <Thumbnail photoInfo={{ photoSrc, photoAlt: fullName }} />}
        <section className={styles.userInfo}>
          <h3>
            <span>full name:</span>
            <span>{fullName}</span>
          </h3>
          <div>
            <span>UID:</span>
            <span>{uid}</span>
          </div>
          <Tags taglist={[gender, age, `grade ${grade}`]} />
        </section>
      </div>
    </div>
  );
};

export default EmployeeCard;
