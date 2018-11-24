import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import CSS from '../../css/reusables/Option.module.css';

const lineMap = {
  "1": ["1", "2", "3"],
  "2": ["2", "3"],
  "6": ["4", "5", "6"],
  "S": ["S", "SIR"],
  "9": ["GS Shuttle"],
  "A": ["A", "C", "E", "H"],
  "Q": ["N", "R", "W", "Q"],
  "N": ["N", "R", "W", "Q"],
  "R": ["N", "R", "W", "Q"],
  "G": ["G"],
  "J": ["J", "Z"],
  "7": ["7"],
  "L": ["L"]
};

function Option(props) {
  // Display various line types and let the user select one. If there's only one, select it and disable field.
  const [trains, setTrains] = useState();

  useEffect(() => {
    // On render and update display the appropriate trains.
    const newTrains = {};
    props.data.forEach(item => {
      let trainStr = '';
      lineMap[item.charAt(0)].forEach((line, i) => {
        trainStr += `${line}`;
        if (lineMap[item.charAt(0)].length - 1 !== i) trainStr += ', ';
      });
      newTrains[item] = trainStr;
    });
    setTrains(newTrains);
  }, [props.data]);

  return (
    <div className={CSS.selectContainer}>
      {props.label && (
        <label htmlFor={props.alt} className={CSS.label}>
          {props.label}
        </label>
      )}
      <select
        className={`${CSS.select} ${props.data.length < 2 && CSS.disabled}`}
        selected={props.selection}
        onChange={props.onChange}
        disabled={props.data.length < 2}
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
  selection: PropTypes.string,
  onChange: PropTypes.func,
  error: PropTypes.string,
  label: PropTypes.string,
  alt: PropTypes.string
};

Option.defaultProps = {
  data: [],
  selection: '',
  onChange: () => {
    throw new Error('onChange not passed to Typeahead');
  },
  error: '',
  label: '',
  alt: ''
};

export default Option;
