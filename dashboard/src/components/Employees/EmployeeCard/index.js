import React from 'react';
import Thumbnail from './Thumbnail';

import photoSrc from '../../../assets/images/user.png';

import styles from './EmployeeCard.module.scss';
import Tags from './Tags';

const sidePadding = '0.63rem';

const EmployeeCard = ({ employee }) => {
  const { fullName, uid, gender, age, grade } = employee;

  return (
    <div className={styles.container}>
      <div className={styles.EmployeeCard}>
        {photoSrc && <Thumbnail photoInfo={{ photoSrc, photoAlt: fullName }} />}
        <section className={styles.userInfo}>
          <h3 style={{ padding: `0 ${sidePadding}` }}>{fullName}</h3>
          <Tags
            taglist={[uid, gender, `age, ${age}`, `grade ${grade}`]}
            sidePadding={sidePadding}
          />
        </section>
      </div>
    </div>
  );
};

export default EmployeeCard;
