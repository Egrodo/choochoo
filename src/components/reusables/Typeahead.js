import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import CSS from '../../css/Typeahead.module.css';
import useDebounce from './useDebounce';
import Input from './Input';

function Typeahead({ error, station, setStation }) {
  const [stationName, setStationName] = useState(station.stop_name || '');
  const [options, setOptions] = useState([]);
  const [optionsView, enableOptions] = useState(false);

  const debouncedQuery = useDebounce(stationName, 500);

  // TODO: Take the specific data logic out and put that in WelcomeView so this is reusable.
  const getData = () => {
    fetch(`/searchStops?query=${stationName}`)
      .then(data => data.json())
      .then(json => {
        // Once I've retrieved data, store it and enable options view.
        setOptions(json);
        enableOptions(true);
      })
      .catch(err => console.error(err));
  };

  const onOptionClick = ({ target: { id } }) => {
    if (!options[id]) throw new RangeError('Invalid id passed to onOptionClick');
    // If one is selected send it upwards for validation and disable option view.
    enableOptions(false);
    setStation(options[id]);
    setStationName(options[id].stop_name);
  };

  useEffect(
    () => {
      // If successfully debounced get data.
      if (debouncedQuery && optionsView) getData();
    },
    [debouncedQuery]
  );

  // TODO: On blur of input box if a suggestion wasn't clicked (or if not identical) error.
  return (
    <form>
      <div className={CSS.inputContainer}>
        <Input
          placeholder="Station..."
          value={stationName}
          onChange={e => {
            setStationName(e.target.value);
            enableOptions(true);
            if (!e.target.value && options.length) setOptions([]);
          }}
          onFocus={() => {
            if (options.length > 1) enableOptions(true);
          }}
          onBlur={() => {
            // Adding a bit of a delay here in case the blur was to click an option.
            setTimeout(() => {
              if (optionsView) enableOptions(false);
            }, 200);
          }}
          alt="station"
          label="Station Name"
          classes={CSS.input}
          fluid={1}
          error={error}
        />
      </div>
      <div className={`${CSS.dropDownContainer} ${!optionsView && CSS.hidden}`}>
        <ul className={CSS.listContainer}>
          {options.map((item, i) => (
            /* eslint-disable-next-line */
            <li key={item.stop_name} id={i} className={CSS.dropDownItem} onClick={onOptionClick}>
              {item.stop_name}
            </li>
          ))}
        </ul>
      </div>
    </form>
  );
}

Typeahead.propTypes = {
  error: PropTypes.string,
  station: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)])),
  setStation: PropTypes.func
};

Typeahead.defaultProps = {
  error: '',
  station: {},
  setStation: () => {
    throw new Error('setStation not passed to Typeahead');
  }
};

export default Typeahead;
