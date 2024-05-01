import React from 'react';
import PushRequests from '../dashboard/PushRequests';

import styles from '../files/FileList.module.scss';

const RequestList = () => {
  return (
    <section className={styles.FileList}>
      <h1 className={`heading ${styles.heading}`}>Push Requests</h1>
      <PushRequests
        user={JSON.parse(
          localStorage.getItem('underground-mining-tracking-system user')
        )}
        showAll={true}
      />
    </section>
  );
};

export default RequestList;
