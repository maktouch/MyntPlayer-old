import axios from 'axios';
import React, { useState, useEffect } from 'react';
import Search from './Search';
import Sidebar from './Sidebar';
import styles from './AddPage.module.css';

import WS from './Websocket';

import { SearchContainer, SidebarContainer } from './App';

export default function AddPage(props) {
  const [queue, setQueue] = useState([]);

  useEffect(_ => {
    WS.on('sync', function({ queue }) {
      setQueue(queue);
    });

    return _ => {
      WS.off('sync');
    };
  });

  async function addToQueue(video) {
    await axios.post('/api/addToQueue', {
      video,
    });

    setQueue([...queue, video]);
  }

  return (
    <div className={styles.AddPage}>
      <SearchContainer>
        <Search addToQueue={addToQueue} />
      </SearchContainer>
      <SidebarContainer>
        <Sidebar queue={queue} progress={0} showHover={false} />
      </SidebarContainer>
    </div>
  );
}
