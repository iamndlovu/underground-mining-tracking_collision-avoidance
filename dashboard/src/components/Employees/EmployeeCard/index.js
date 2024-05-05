import React from 'react';
import Thumbnail from './Thumbnail';

import employeeSrc from '../../../assets/images/user.png';
import automibleSrc from '../../../assets/images/bg';

import styles from './EmployeeCard.module.scss';
import Tags from './Tags';

const sidePadding = '0.63rem';

const EmployeeCard = ({ employee, automobile }) => {
  let fullName, uid, gender, age, grade, make, driver, photoSrc;

  if (employee) {
    fullName = employee.fullName;
    uid = employee.uid;
    gender = employee.gender;
    age = employee.age;
    grade = employee.grade;
  }

  if (automobile) {
    uid = automobile.uid;
    make = automobile.make;
    driver = automobile.driver;
  }

  if (employee) photoSrc = employeeSrc;
  if (automobile) photoSrc = automibleSrc;

  return (
    <div className={styles.container}>
      <div className={styles.EmployeeCard}>
        {photoSrc && <Thumbnail photoInfo={{ photoSrc, photoAlt: fullName }} />}
        <section className={styles.userInfo}>
          <h3 style={{ padding: `0 ${sidePadding}` }}>
            {(fullName && fullName) || (make && make)}
          </h3>
          <Tags
            taglist={
              (employee && [uid, gender, `age, ${age}`, `grade ${grade}`]) ||
              (automobile && [uid, `make: ${make}`, `driver: ${driver}`])
            }
            sidePadding={sidePadding}
          />
        </section>
      </div>
    </div>
  );
};

export default EmployeeCard;
