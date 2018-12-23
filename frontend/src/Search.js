import React, { useState } from 'react';
import { Search, Input, Item } from 'semantic-ui-react';
import YoutubeSearch from './YoutubeSearch';
import debounce from 'lodash/debounce';

function SearchResult(props) {
  const { title, src } = props;
  return (
    <Item>
      <Item.Image size="tiny" src={src} />
      <Item.Content verticalAlign="top">
        <Item.Description>{title}</Item.Description>
      </Item.Content>
    </Item>
  );
}

export default function App(props) {
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState('');
  const [results, setResults] = useState([]);

  async function onResultSelect(e, { result }) {
    props.addToQueue(result);
    setValue('');
  }

  async function onSearchChange(e, { value }) {
    setLoading(true);
    setValue(value);

    const results = await YoutubeSearch(value);
    setResults(results);
    setLoading(false);
  }

  return (
    <Search
      aligned="right"
      fluid={true}
      input={<Input fluid placeholder="Add videos to the queue" />}
      loading={loading}
      onResultSelect={onResultSelect}
      onSearchChange={debounce(onSearchChange, 1000, { leading: true })}
      resultRenderer={SearchResult}
      results={results}
      size="tiny"
      value={value}
    />
  );
}
