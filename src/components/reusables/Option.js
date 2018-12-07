import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import CSS from '../../css/reusables/Option.module.css';

function Option(props) {
  // Display various line types and let the user select one. If there's only one, select it and disable field.
  const [trains, setTrains] = useState();

  useEffect(
    () => {
      // On render and update display the appropriate trains.
      const newTrains = {};
      props.data.forEach(item => {
        let trainStr = '';
        props.lineMap[item.charAt(0)].forEach((line, i) => {
          trainStr += `${line}`;
          if (props.lineMap[item.charAt(0)].length - 1 !== i) trainStr += ', ';
        });
        newTrains[item] = trainStr;
      });
      setTrains(newTrains);
    },
    [props.data]
  );

  return (
    <div className={CSS.selectContainer}>
      {props.label && (
        <label htmlFor={props.alt} className={CSS.label}>
          {props.label}
        </label>
      )}
      <select
        className={`${CSS.select} ${props.data.length < 2 && CSS.disabled}`}
        onChange={props.onChange}
        disabled={props.data.length < 2}
        value={props.selected}
      >
        {props.data.map((item, i) => (
          <option value={i} key={item}>
            {`${trains[item]} Trains`}
          </option>
        ))}
      </select>
      {props.error && (
        <label htmlFor={props.alt} className={`${CSS.label} ${CSS.error}`}>
          {props.error}
        </label>
      )}
    </div>
  );
}

Option.propTypes = {
  data: PropTypes.arrayOf(PropTypes.string),
  selected: PropTypes.number,
  onChange: PropTypes.func,
  lineMap: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.string)),
  error: PropTypes.string,
  label: PropTypes.string,
  alt: PropTypes.string
};

Option.defaultProps = {
  data: [],
  selected: 0,
  onChange: () => {
    throw new Error('onChange not passed to Typeahead');
  },
  lineMap: {},
  error: '',
  label: '',
  alt: ''
};

export default Option;
