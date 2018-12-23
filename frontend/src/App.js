import React, { useState, useEffect } from 'react';
import YoutubeSearch from './YoutubeSearch';
import styles from './App.module.css';
import logo from './logo.png';
import './App.css';
import Player from './Player';
import Sidebar from './Sidebar';
import Search from './Search';

import WS from './Websocket';
import QR from './QR';

export function SearchContainer(props) {
  return <div className={styles.Search}>{props.children}</div>;
}

export function SidebarContainer(props) {
  return <div className={styles.Sidebar}>{props.children}</div>;
}

export default function App(props) {
  const { masterId } = props;
  const [queue, setQueue] = useState([]);
  const [progress, setProgress] = useState(0);
  const [lastVideoId, setLastVideoId] = useState(null);

  useEffect(
    _ => {
      // set it in the url
      window.history.replaceState({}, document.title, `${window.document.location.pathname}?masterId=${masterId}`);

      WS.on(`addToQueue:${masterId}`, function({ video }) {
        addToQueue(video);
      });

      return _ => {
        WS.off(`addToQueue:${masterId}`);
      };
    },
    [masterId, addToQueue]
  );

  useEffect(
    _ => {
      (async function() {
        setProgress(0);
        WS.emit(`sync`, { queue, masterId });

        if (queue.length === 0 && lastVideoId) {
          try {
            const results = await YoutubeSearch('', { relatedToVideoId: lastVideoId, maxResults: 5 });
            setQueue([...results.map(r => ({ ...r, autoadded: true }))]);
          } catch (err) {
            console.error(err);
          }
        }
      })();
    },
    [masterId, queue]
  );

  function addToQueue(video) {
    setQueue([...queue, video]);
  }

  async function onEnded() {
    queue.splice(0, 1);
    const newQueue = [...queue];

    setQueue(newQueue);
  }

  function onQueueNext(video, index) {
    const spliced = queue.splice(index, 1);
    const current = queue.splice(0, 1);
    const newQueue = [...current, ...spliced, ...queue];
    setQueue(newQueue);
  }

  function onRemove(video, index) {
    // copy the current queue cause splice is mutating
    const newQueue = [...queue];
    newQueue.splice(index, 1);
    setQueue(newQueue);
  }

  function onProgress({ played }) {
    setProgress(played * 100);
  }

  function onError(e) {
    console.error('ERROR!!!', e);
  }

  return (
    <div className={styles.App}>
      <div className={styles.Header}>
        <img src={logo} alt="MyntPlayer" />
        <div className={styles.Credit}>v3.0 by MyntLabs.com © {new Date().getFullYear()}</div>
      </div>
      <SearchContainer>
        <Search addToQueue={addToQueue} />
      </SearchContainer>
      <SidebarContainer>
        <Sidebar queue={queue} progress={progress} onQueueNext={onQueueNext} onRemove={onRemove} />
      </SidebarContainer>
      <div className={styles.Main}>
        <Player
          onEnded={onEnded}
          onProgress={onProgress}
          url={queue && queue[0] && queue[0].link}
          onStart={_ => setLastVideoId(queue && queue[0] && queue[0].id)}
          onError={onError}
        />
      </div>
      <div className={styles.QR}>
        <QR masterId={props.masterId} />
      </div>
    </div>
  );
}
