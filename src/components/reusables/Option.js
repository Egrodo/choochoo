import React from 'react';
import PropTypes from 'prop-types';

import CSS from '../../css/Option.module.css';

function Option(props) {
  // Display various line types and let the user select one. If there's only one, select it and disable field.
  // TODO: Placeholder for option?
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
          <option value={i} key={item} className={CSS.optionItem}>
            {item}
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
