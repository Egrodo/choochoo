import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Typeahead from '../reusables/Typeahead';
import CSS from '../../css/WelcomeView.module.css';
import Option from '../reusables/Option';
import Input from '../reusables/Input';
import Button from '../reusables/Button';

// TODO: Ctrl + enter should try to submit form.
function WelcomeView({ saveChanges }) {
  // The station should contain all the data for the station, not just the name.
  const [name, setName] = useState('');
  const [stationObj, setStationObj] = useState({});
  const [lines, setLines] = useState([]); // List of lines potential line
  const [line, setLine] = useState(''); // Selected line

  // Error handling: empty strings means no error, otherwise display error.
  const [errorObj, setErrorObj] = useState({
    name: '',
    stationObj: '',
    line: '',
  });

  const submit = () => {
    // On submit, ensure the fields are valid then saveChanges.
    const errors = {};

    // First check that they filled in all the areas.
    if (!stationObj) errors.stationObj = 'Missing stationObj';
    if (!name.trim()) errors.name = 'Missing name';
    if (!line) errors.line = 'Missing line';

    // Do I need to validate that the data in the station is valid? So long as it has all the fields...

    if (name.length > 16) {
      errors.name = 'First name too long';
    }

    setErrorObj(errors);
    if (!Object.keys(errors).length) {
      // If there are no errors, save the changes.
      saveChanges(name, stationObj, line);
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
      setLines(stationObj.stop_id);

      // Also default to the first option.
      if (stationObj.stop_id) setLine(stationObj.stop_id[0]);
    },
    [stationObj]
  );

  return (
    <section className={CSS.WelcomeView}>
      <h1 className={CSS.mainHeader}>Welcome to choochoo</h1>
      <h4 className={CSS.secondaryHeader}>I'll need some information before we start</h4>
      <div className={CSS.inputsContainer}>
        <Typeahead
          error={errorObj.stationObj ? errorObj.stationObj : ''}
          getData={getData}
          stationObj={stationObj}
          setStationObj={setStationObj}
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
          onChange={e => setLine(lines[e.target.value])}
          error={errorObj.line ? errorObj.line : ''}
          label="Line Type"
          alt="line"
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
