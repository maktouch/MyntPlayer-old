import React from 'react';
import logo from './logo.png';
import styles from './Header.module.scss';

function Wrapper() {
  return (
    <div className={styles.Header}>
      <img src={logo} alt="MyntPlayer" />
      <div className={styles.Credit}>v4.0 by MyntLabs.com © {new Date().getFullYear()}</div>
    </div>
  );
}

export default Wrapper;
