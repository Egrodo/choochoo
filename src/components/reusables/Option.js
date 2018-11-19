import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import CSS from '../../css/Option.module.css';

function Option({ data, selection, onChange, disabled, error }) {
  // If there is only one, select it
  return (
    <select className={`${CSS.optionContainer} ${disabled && CSS.disabled}`} value={selection} onChange={onChange}>
      {data.map((item, i) => (
        <option value={i} key={item}>
          {item}
        </option>
      ))}
    </select>
  );
}

Option.propTypes = {
  data: PropTypes.arrayOf(PropTypes.string),
  selection: PropTypes.string,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  error: PropTypes.string
};

Option.defaultProps = {
  data: [],
  selection: '',
  onChange: () => {
    throw new Error('onChange not passed to Typeahead');
  },
  disabled: true,
  error: ''
};

export default Option;
