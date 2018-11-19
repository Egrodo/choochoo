import React, { useState, useEffect } from 'react';

import useDebounce from './useDebounce';
import Input from './Input';

function Typeahead(props) {
  // TODO: Extend Input
  const [query, setQuery] = useState('');

  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  const debouncedQuery = useDebounce(query, 500);

  const getInfo = () => {
    setLoading(true);
    fetch(`/searchStops?query=${query}`)
      .then(data => data.json())
      .then(json => {
        setOptions(json);
        setLoading(false);
      })
      .catch(err => console.error(err));
  };

  useEffect(
    () => {
      if (debouncedQuery) getInfo();
    },
    [debouncedQuery]
  );

  return (
    <form>
      <Input
        placeholder="Station..."
        onChange={e => setQuery(e.target.value)}
        alt="station"
        label="Station Name"
        loading={loading}
        fluid={1}
        {...props}
      />
      <p>{query}</p>
    </form>
  );
}

export default Typeahead;
