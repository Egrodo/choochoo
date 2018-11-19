import React, { useState, useEffect } from 'react';
import CSS from '../../css/Typeahead.module.css';

import useDebounce from './useDebounce';
import Input from './Input';

function Typeahead(props) {
  // TODO: Extend Input
  const [query, setQuery] = useState('');

  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  const debouncedQuery = useDebounce(query, 500);

  const getInfo = () => {
    fetch(`/searchStops?query=${query}`)
      .then(data => data.json())
      .then(json => {
        setOptions(json);
        console.log(json);
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
        onChange={e => {
          setLoading(true);
          setQuery(e.target.value);
        }}
        alt="station"
        label="Station Name"
        loading={loading ? 1 : 0}
        fluid={1}
        {...props}
      />
      <ul className={CSS.dropDownContainer}>
        {options.map((item, i) => (
          <li className={CSS.dropDownItem}>{item.stop_name}</li>
        ))}
      </ul>
    </form>
  );
}

export default Typeahead;
