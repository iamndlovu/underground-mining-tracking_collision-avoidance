import React from 'react';
import Restricted from '../Restricted';
import AddObjectForm from './AddObjectForm';

import styles from './AddObject.module.scss';

const AddObject = ({ user, type }) => {
  return Number(user.level) === 0 ? (
    <section className={styles.AddObject}>
      <h2 className={styles.formHead}>Add {type}</h2>
      <AddObjectForm type={type} />
    </section>
  ) : (
    <Restricted />
  );
};

export default AddObject;
