import axios from 'axios';
import React, { useState, useEffect } from 'react';
import Search from './Search';
import Sidebar from './Sidebar';
import styles from './AddPage.module.css';

import WS from './Websocket';

import { SearchContainer, SidebarContainer } from './App';

export default function AddPage(props) {
  const { masterId } = props;
  const [queue, setQueue] = useState([]);

  useEffect(
    _ => {
      (async function() {
        const { data } = await axios.get('/api/queue', {
          params: {
            masterId,
          },
        });

        const { queue } = data;

        console.log({ queue });

        setQueue(queue);

        WS.on(`sync:${masterId}`, function({ queue }) {
          setQueue(queue);
        });
      })();

      return _ => {
        WS.off(`sync:${masterId}`);
      };
    },
    [masterId]
  );

  async function addToQueue(video) {
    await axios.post('/api/addToQueue', {
      video,
      masterId,
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
