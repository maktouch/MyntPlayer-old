import React from 'react';
import styles from './AddPage.module.scss';

import Search from '../Search';
import StateProvider from '../State';
import Queue from '../Queue';

function AddPage(props) {
  const { masterId } = props;

  return (
    <StateProvider masterId={masterId} slave={true}>
      <div className={styles.App}>
        <Search />

        <div className={styles.Sidebar}>
          <Queue />
        </div>
      </div>
    </StateProvider>
  );
}

export default AddPage;
