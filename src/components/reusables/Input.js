import React from 'react';
import CSS from '../../css/Input.module.css';

function Input(props) {
  return (
    <>
      {props.label && (
        <label htmlFor={props.alt} className={CSS.label}>
          {props.label}
        </label>
      )}
      <input
        name={props.alt}
        className={`
          ${CSS.Input}
          ${props.fluid && CSS.fluid}
          ${props.error.length && CSS.error}
        `}
        {...props}
      />
    </>
  );
}

export default Input;
