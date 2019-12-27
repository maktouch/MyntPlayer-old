import React from 'react';
import styles from './App.module.scss';

import Header from '../Header';
import Search from '../Search';
import StateProvider from '../State';
import Queue from '../Queue';
import Player from '../Player';
import QR from '../QR';

function App(props) {
  const { masterId } = props;

  return (
    <StateProvider masterId={masterId} slave={false}>
      <div className={styles.App}>
        <Header />
        <Search />

        <div className={styles.Sidebar}>
          <Queue />
        </div>

        <Player />

        <QR className={styles.QR} masterId={masterId} />
      </div>
    </StateProvider>
  );
}

export default App;
