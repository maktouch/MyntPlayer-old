import React from 'react';
import styles from './Player.module.scss';
import YouTube from 'react-youtube';
import { useStateContext } from '../State';

function Video(props) {
  const { onVideoEnd, debug } = useStateContext();
  const { video } = props;

  if (!video) {
    return null;
  }

  const opts = {
    height: '100%',
    width: '100%',
    playerVars: {
      autoplay: 1,
      controls: debug ? 0 : 1,
      fs: 0,
      showinfo: 0,
    },
  };

  return <YouTube videoId={video.id} opts={opts} onEnd={e => onVideoEnd()} className={styles.Player} />;
}

export default function Player() {
  const { queue } = useStateContext();
  const [current] = queue;

  return (
    <div className={styles.PlayerWrapper}>
      <Video video={current} />
    </div>
  );
}
