import React from 'react';
import cx from 'classnames';
import { useStateContext } from '../State';
import styles from './Queue.module.scss';
import { FaTrash, FaAngleDoubleUp, FaPlusSquare, FaArrowUp } from 'react-icons/fa';

function Button(props) {
  return <button {...props} className={cx(styles.Button, props.className)} />;
}

export function QueueItem(props) {
  const { id, title, src, index } = props;
  const { removeFromQueue, playNext } = useStateContext();

  const onDeleteClick = e => {
    e.preventDefault();
    removeFromQueue(id);
  };

  const onNextClick = e => {
    e.preventDefault();
    playNext(index);
  };

  return (
    <div className={styles.Queue} style={{ '--image-url': `url(${src})` }}>
      <div className={styles.QueueTitle} dangerouslySetInnerHTML={{ __html: title }} />
      <div className={styles.QueueOverlay}>
        {index > 1 && (
          <Button onClick={onNextClick}>
            Play Next <FaAngleDoubleUp style={{ marginLeft: 5 }} />
          </Button>
        )}
        <Button onClick={onDeleteClick}>
          <FaTrash />
        </Button>
      </div>
    </div>
  );
}

export default function Queue() {
  const { queue, generateMoreVideos } = useStateContext();

  return (
    <div>
      <h3 className={styles.Title}>
        Queued videos <span className={styles.Count}>{queue.length}</span>
      </h3>

      <div className={styles.QueueContainer}>
        {queue.map((item, index) => (
          <QueueItem key={item.id} {...item} index={index} />
        ))}

        {queue.length === 0 && (
          <h2 style={{ textAlign: 'center', padding: 10 }}>
            <FaArrowUp /> <br />
            Your video queue is empty. Use the search input bar and add one!
          </h2>
        )}

        {queue.length > 0 && (
          <Button
            className={styles.AddMore}
            onClick={e => {
              e.preventDefault();
              generateMoreVideos();
            }}
          >
            <FaPlusSquare style={{ marginRight: 5 }} /> Add related videos
          </Button>
        )}
      </div>
    </div>
  );
}
