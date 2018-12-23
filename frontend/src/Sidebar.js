import React from 'react';
import { Item, Header, Button, Icon, Label, Progress, Segment } from 'semantic-ui-react';

import styles from './Sidebar.module.css';

function Video(props) {
  const { title, position, src, onPlayNext, onRemove, showHover } = props;

  const style = {};

  if (position === 0) {
    style.minHeight = 130;
  }

  return (
    <div className={styles.QueuedVideo} style={style}>
      <div className={styles.BGOverlay} style={{ backgroundImage: `url(${src})` }} />
      <div className={styles.BGOverlay} style={{ background: `rgba(0,0,0, 0.5)` }} />
      <p>{title}</p>
      {showHover && (
        <div className={styles.QueuedVideoHoverOverlay}>
          <Button icon negative onClick={onRemove}>
            <Icon name="trash" />
          </Button>
          {position > 0 && (
            <Button icon primary labelPosition="left" disabled={position === 0} onClick={onPlayNext}>
              <Icon name="play" />
              Play next
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

export default function Sidebar(props) {
  const { queue, progress, showHover = true, onPlayNext, onRemove } = props;
  return (
    <React.Fragment>
      <Header>
        Queued Videos <Label circular>{queue.length}</Label>
      </Header>

      {queue.length === 0 && (
        <Segment placeholder>
          <Header icon>
            <Icon name="search" />
            You have no video in the queue. Use the searchbar and find one! ⬆
          </Header>
        </Segment>
      )}

      <Item.Group divided>
        <Progress percent={progress} size="tiny" indicating color="olive" className={styles.Progress} />
        {queue.map((video, position) => (
          <Video
            {...video}
            position={position}
            showHover={showHover}
            className={styles.QueuedVideo}
            onPlayNext={_ => onPlayNext(video, position)}
            onRemove={_ => onRemove(video, position)}
          />
        ))}
      </Item.Group>
    </React.Fragment>
  );
}
