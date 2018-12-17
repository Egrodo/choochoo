import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import CSS from '../../css/reusables/Typeahead.module.css';
import useDebounce from '../hooks/useDebounce';
import Input from './Input';

function Typeahead({ error, getData, stationObj, setStationObj, loading }) {
  const [stationName, setStationName] = useState(stationObj.stop_name || '');
  const [options, setOptions] = useState([]);
  const [optionsView, enableOptionsView] = useState(false);

  const debouncedQuery = useDebounce(stationName, 500);

  const onOptionClick = ({ target: { id } }) => {
    if (!options[id]) throw new RangeError('Invalid id passed to onOptionClick');
    if (!options[id].stop_id) return; // If there is no stop_id, don't continue (for "none found")

    // If one is selected send it upwards for validation and disable option view.
    enableOptionsView(false);
    setStationObj(options[id]);
    setStationName(options[id].stop_name);
  };

  useEffect(
    () => {
      // If successfully debounced get data.
      if (debouncedQuery && optionsView) getData(stationName, setOptions, enableOptionsView);
    },
    [debouncedQuery]
  );

  useEffect(
    () => {
      if (options.length === 0 && optionsView) {
        // TODO: Set 'None Found' option.
        setOptions([
          {
            stop_name: 'No Results Found'
          }
        ]);
      }
    },
    [options]
  );

  return (
    <form>
      <div className={CSS.inputContainer}>
        <Input
          placeholder="Station..."
          initValue={stationName}
          onChange={e => {
            setStationName(e.target.value);
            enableOptionsView(true);
            if (!e.target.value && options.length) setOptions([]);
          }}
          onFocus={() => {
            if (options.length > 1) enableOptionsView(true);
          }}
          onBlur={() => {
            // Adding a bit of a delay here in case the blur was to click an option.
            setTimeout(() => {
              if (optionsView) enableOptionsView(false);
              if (!stationObj.stop_name || stationName !== stationObj.stop_name) {
                // On blur, if there is no station selected, try to match the typed str with an option.
                const currInp = stationName.toLowerCase().trim();
                for (let i = 0; i < options.length; ++i) {
                  if (currInp === options[i].stop_name.toLowerCase()) {
                    setStationObj(options[i]);
                    setStationName(options[i].stop_name);
                    break;
                  }
                }
              }
            }, 200);
          }}
          alt="station"
          label="Station Name"
          classes={CSS.input}
          fluid={1}
          error={error}
          loading={loading}
        />
      </div>
      <div className={`${CSS.dropDownContainer} ${!optionsView && CSS.hidden}`}>
        <ul className={CSS.listContainer}>
          {options.map((item, i) => (
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
  getData: PropTypes.func,
  stationObj: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)])),
  setStationObj: PropTypes.func,
  loading: PropTypes.bool
};

Typeahead.defaultProps = {
  error: '',
  getData: () => {
    throw new Error('getData not passed to Typeahead');
  },
  stationObj: {},
  setStationObj: () => {
    throw new Error('setStation not passed to Typeahead');
  },
  loading: false
};

export default Typeahead;
