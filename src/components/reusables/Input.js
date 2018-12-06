import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import CSS from '../../css/reusables/Input.module.css';

// If loading, show spinner. Otherwise show cross to allow input deletion.
function Input(props) {
  const {
    initValue,
    placeholder,
    onChange,
    onBlur,
    onFocus,
    alt,
    label,
    classes,
    fluid,
    error,
    loading,
    maxLength
  } = props;

  const [inpVal, setInpVal] = useState(initValue);
  const inpRef = useRef();
  const [active, setActive] = useState(false);

  const onInpChange = e => {
    setInpVal(e.target.value);
    onChange(e);
  };

  useEffect(
    () => {
      setInpVal(initValue);
    },
    [initValue]
  );

  return (
    <section className={CSS.Input}>
      {label && (
        <label htmlFor={alt} className={CSS.label}>
          {label}
        </label>
      )}
      <div className={CSS.inputContainer}>
        <input
          value={inpVal}
          onChange={onInpChange}
          onFocus={() => {
            // Giving these a bit of a timeout so that the user will be able to click delete before its hidden.
            setTimeout(() => {
              setActive(true);
            }, 200);
            onFocus();
          }}
          onBlur={() => {
            setTimeout(() => {
              setActive(false);
            }, 200);
            onBlur();
          }}
          className={`
          ${CSS.input}
          ${classes || ''}
          ${fluid && CSS.fluid}
          ${error && CSS.error}
          `}
          autoComplete="off"
          autoCorrect="off"
          spellCheck="false"
          placeholder={placeholder}
          maxLength={maxLength}
          ref={inpRef}
          name={alt}
          alt={alt}
        />
        {loading ? (
          <i role="button" tabIndex="0" alt="Spinner" className={`${CSS.icon} ${CSS.spinner}`} />
        ) : (
          active && (
            <i
              role="button"
              tabIndex="0"
              alt="Delete"
              className={`${CSS.icon} ${CSS.cancel}`}
              onClick={() => {
                setInpVal('');
                inpRef.current.focus();
              }}
            />
          )
        )}
      </div>
      {error && (
        <label htmlFor={alt} className={`${CSS.label} ${CSS.error}`}>
          {error}
        </label>
      )}
    </section>
  );
}

Input.propTypes = {
  initValue: PropTypes.string,
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  alt: PropTypes.string,
  label: PropTypes.string,
  classes: PropTypes.string,
  fluid: PropTypes.number,
  error: PropTypes.string,
  loading: PropTypes.bool,
  maxLength: PropTypes.string
};

Input.defaultProps = {
  initValue: '',
  placeholder: '',
  onChange: () => {},
  onBlur: () => {},
  onFocus: () => {},
  alt: '',
  label: '',
  classes: '',
  fluid: 1,
  error: '',
  loading: false,
  maxLength: '50'
};

export default Input;
