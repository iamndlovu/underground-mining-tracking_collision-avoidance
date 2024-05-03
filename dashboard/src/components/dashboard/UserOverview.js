import React from 'react';

import styles from './UserOverview.module.scss';
// import avatar from '../../assets/images/user.png';

const UserOverview = ({ user }) => {
  let { username, fullName, level } = user;
  switch (level) {
    case 0:
      level = 'Administrator';
      break;

    case 1:
      level = 'Operator';
      break;

    default:
      level = 'Unknown';
      break;
  }
  return (
    <section className={styles.UserOverview}>
      <div className={styles.container}>
        {/*   <div className={styles.avatar}>
          <img src={avatar} alt={user.username} />
        </div> */}
        <div className={styles.userInfo}>
          <h2>{fullName}</h2>
          <h4>
            <span className={styles.username}>@{username}</span>
            <span className={styles.separator}></span>
            <span className={styles.level}>{level}</span>
          </h4>
        </div>
      </div>
    </section>
  );
};

export default UserOverview;
