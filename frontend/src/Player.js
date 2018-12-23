import React from 'react';
import styles from './Player.module.css';
import ReactPlayer from 'react-player';
import './App.css';

export default function Player(props) {
  return (
    <div className={styles.ReactPlayerWrapper}>
      <ReactPlayer className={styles.ReactPlayer} height="100%" playing width="100%" {...props} />
    </div>
  );
}
