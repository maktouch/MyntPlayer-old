import React, { useState, useCallback, useRef } from 'react';
import cx from 'classnames';
import youtube from './youtube';
import { useDebouncedCallback } from 'use-debounce';
import styles from './Search.module.scss';
import { useStateContext } from '../State';
import { FaSearch } from 'react-icons/fa';

function Item(props) {
  const { id, title, src, link, onItemClicked } = props;
  const { addToQueue } = useStateContext();

  const onItemClick = useCallback(
    function(e) {
      e.preventDefault();

      addToQueue({ id, title, src });
      onItemClicked();
    },
    [addToQueue, id, title, src, onItemClicked]
  );

  return (
    <a href={link} className={styles.Result} onClick={onItemClick}>
      <span className={styles.ResultItem} dangerouslySetInnerHTML={{ __html: title }} />
      <img className={styles.ResultImage} src={src} alt={title} />
    </a>
  );
}

function Search() {
  const ref = useRef(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [focused, setFocused] = useState(false);

  const onItemClicked = useCallback(
    function() {
      setFocused(false);
      setLoading(false);
      setResults([]);

      ref.current.value = '';
    },
    [setLoading, setResults, setFocused]
  );

  const [onChange] = useDebouncedCallback(
    async value => {
      setLoading(true);
      const results = await youtube(value);
      setResults(results);
      setLoading(false);
    },
    250,
    { maxWait: 1000 }
  );

  const [onBlur] = useDebouncedCallback(() => {
    setFocused(false);
  }, 200);

  return (
    <div className={styles.Container}>
      <div className={styles.Search}>
        <input
          className={styles.input}
          placeholder="Add videos to the queue"
          onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={onBlur}
          ref={ref}
        />
        <FaSearch color="#8f908f" />
      </div>

      <div
        className={cx(styles.SearchResults, {
          [styles.SearchResultsFocused]: focused,
        })}
      >
        {results.map(item => (
          <Item {...item} onItemClicked={onItemClicked} />
        ))}
      </div>
    </div>
  );
}

export default Search;
