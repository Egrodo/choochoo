import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Typeahead from '../reusables/Typeahead';
import CSS from '../../css/views/WelcomeView.module.css';
import Option from '../reusables/Option';
import Input from '../reusables/Input';
import Button from '../reusables/Button';
import lineMap from '../data/lineMap';

function WelcomeView({ saveChanges, networkError }) {
  // The station should contain all the data for the station, not just the name.
  const [name, setName] = useState('');
  const [stationObj, setStationObj] = useState({});
  const [lines, setLines] = useState([]); // List of lines potential line
  const [line, setLine] = useState(''); // Selected line

  // Error handling: empty strings means no error, otherwise display error.
  const [errorObj, setErrorObj] = useState({
    name: '',
    stationObj: '',
    line: ''
  });

  const submit = () => {
    // On submit, ensure the fields are valid then saveChanges.
    const errors = {};

    // First check that they filled in all the areas.
    if (!Object.keys(stationObj).length) errors.stationObj = 'Missing station name';
    if (name.length > 16) errors.name = 'First name too long';
    if (!line) errors.line = 'Missing line';

    setErrorObj(errors);
    if (!Object.keys(errors).length) {
      // If there are no errors, save the changes.
      saveChanges(name, stationObj, line);
    }
  };

  const getData = (stationName, setOptions, enableOptionsView) => {
    fetch(`${process.env.REACT_APP_API_URL}/search/stops/?query=${stationName}`)
      .then(data => data.json())
      .then(json => {
        if (json.error) throw new Error(json.error);
        // Once I've retrieved data, store it and enable options view.
        setOptions(json);
        enableOptionsView(true);
      })
      .catch(err => {
        if (err.message === 'Rate Limit Reached') {
          networkError('Rate Limit Reached', false);
        } else networkError('/searchStops req failed', true, getData, stationName, setOptions, enableOptionsView);
      });
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
      <h1 className={CSS.mainHeader}>Welcome to Choochoo</h1>
      <h4 className={CSS.secondaryHeader}>
        Your friendly schedule helper! I work with all the trains in the MTA system, please pick one to get started!
      </h4>
      <div className={CSS.inputsContainer}>
        <Typeahead
          error={errorObj.stationObj ? errorObj.stationObj : ''}
          getData={getData}
          stationObj={stationObj}
          setStationObj={setStationObj}
        />
        <Input
          onChange={e => setName(e.target.value)}
          initValue={name}
          maxLength="16"
          placeholder="Name..."
          alt="name"
          label="First Name (optional)"
          error={errorObj.name ? errorObj.name : ''}
          fluid={1}
        />
        <Option
          data={lines}
          selection={line}
          onChange={e => setLine(lines[e.target.value])}
          error={errorObj.line ? errorObj.line : ''}
          lineMap={lineMap}
          label="Subway Line"
          alt="Subway Line"
        />
      </div>

      <div className={CSS.btnContainer}>
        <Button onClick={submit}>Get Started</Button>
      </div>
    </section>
  );
}

WelcomeView.propTypes = {
  saveChanges: PropTypes.func,
  networkError: PropTypes.func
};

WelcomeView.defaultProps = {
  saveChanges: () => {
    throw new ReferenceError('saveChanges not passed to MainView');
  },
  networkError: () => {
    throw new ReferenceError('networkError not passed to MainView');
  }
};

export default WelcomeView;
