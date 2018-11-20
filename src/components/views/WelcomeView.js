import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Typeahead from '../reusables/Typeahead';
import CSS from '../../css/WelcomeView.module.css';
import Option from '../reusables/Option';
import Input from '../reusables/Input';
import Button from '../reusables/Button';

function WelcomeView({ saveChanges }) {
  const [name, setName] = useState('');

  // The station should contain all the data for the station, not just the name.
  const [station, setStation] = useState({});
  const [zipCode, setZipCode] = useState('');
  const [lines, setLines] = useState([]);
  const [line, setLine] = useState('');

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
    // TODO: If the input completely matches a stop_name use that.
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

  const getData = (stationName, setOptions, enableOptionsView) => {
    fetch(`/searchStops?query=${stationName}`)
      .then(data => data.json())
      .then(json => {
        // Once I've retrieved data, store it and enable options view.
        setOptions(json);
        enableOptionsView(true);
      }) // TODO: What to do on error? Maybe App level network error dialogue.
      .catch(err => console.error(err));
  };

  useEffect(
    () => {
      // Every time the station changes generate a list of stop_id's it has, which will re-render Option.
      setLines(station.stop_id);
    },
    [station]
  );

  useEffect(
    () => {
      // When the line is changed, compose the result data package.
    },
    [line]
  );

  return (
    <section className={CSS.WelcomeView}>
      <h1 className={CSS.mainHeader}>Welcome to choochoo</h1>
      <h4 className={CSS.secondaryHeader}>I'll need some information before we start</h4>
      <div className={CSS.inputsContainer}>
        <Typeahead
          error={errorObj.station ? errorObj.station : ''}
          getData={getData}
          station={station}
          setStation={setStation}
        />
        <Input
          onChange={e => setName(e.target.value)}
          value={name}
          maxLength="16"
          placeholder="Name..."
          alt="name"
          label="First Name"
          error={errorObj.name ? errorObj.name : ''}
          fluid={1}
        />
        <Option
          data={lines}
          selection={line}
          onChange={e => setLine(e.target.value)}
          error={errorObj.line ? errorObj.line : ''}
          label="Line Type"
          alt="line"
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
          error={errorObj.zipCode ? errorObj.zipCode : ''}
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
