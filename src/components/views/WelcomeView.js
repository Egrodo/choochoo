import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Typeahead from '../reusables/Typeahead.js';
import CSS from '../../css/WelcomeView.module.css';
import Input from '../reusables/Input';
import Button from '../reusables/Button';

function WelcomeView({ saveChanges }) {
  const [name, setName] = useState('');
  const [station, setStation] = useState('');
  const [zipCode, setZipCode] = useState('');

  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState([]);

  // Error handling: empty strings means no error, otherwise display error.
  const [errorObj, setErrorObj] = useState({
    name: '',
    station: '',
    zipCode: ''
  });

  const submit = () => {
    // On submit, ensure the fields are valid then saveChanges.
    const errors = {};

    // First check that they filled in all the areas.
    if (!station) errors.station = 'Missing station';
    if (!name.trim()) errors.name = 'Missing name';
    if (!zipCode) errors.zipCode = 'Missing zipcode';

    // TODO: Now validate the station > stopId here.
    // Ensure that there are no random characters in the station.

    if (name.length > 16) {
      errors.name = 'First name too long';
    }

    if (Number.isNaN(Number(zipCode))) {
      errors.zipCode = 'Only numbers allowed';
    } else if (Number(zipCode) < 10001 || Number(zipCode) > 11697) {
      // If it's not NaN, check if it's in the zipCode range for NYC.
      errors.zipCode = "This zipcode doesn't seem to be in NYC";
    }

    if (!Object.keys(errors).length) {
      // If there are no errors, remove the red and save the changes.
      setErrorObj(errors);
      saveChanges(name, station, zipCode);
    } else {
      // Otherwise display the errors given.
      setErrorObj(errors);
    }
  };

  return (
    <section className={CSS.WelcomeView}>
      <h1 className={CSS.mainHeader}>Welcome to choochoo</h1>
      <h4 className={CSS.secondaryHeader}>I'll need some information before we start</h4>
      <div className={CSS.inputsContainer}>
        <Typeahead error={errorObj.station || ''} />
        <Input
          onChange={e => setName(e.target.value)}
          value={name}
          maxLength="16"
          placeholder="Name..."
          alt="name"
          label="First Name"
          error={errorObj.name || ''}
          fluid={1}
        />
        <Input
          onChange={e => {
            // Only allow numbers to be typed in.
            if (!Number.isNaN(Number(e.target.value))) {
              setZipCode(e.target.value);
            }
          }}
          value={zipCode}
          placeholder="Zip..."
          alt="zip code"
          label="Zip Code"
          error={errorObj.zipCode || ''}
          fluid={1}
        />
      </div>

      <div className={CSS.btnContainer}>
        <Button onClick={submit}>Get Started</Button>
      </div>
    </section>
  );
}

WelcomeView.propTypes = {
  saveChanges: PropTypes.func
};

WelcomeView.defaultProps = {
  saveChanges: () => {
    console.error('PropTypes Error: saveChanges not passed into WelcomeView.');
  }
};

export default WelcomeView;
