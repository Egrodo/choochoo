import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import CSS from '../../css/views/SettingsView.module.css';
import Typeahead from '../reusables/Typeahead';
import Input from '../reusables/Input';
import Option from '../reusables/Option';
import Button from '../reusables/Button';
import lineMap from '../data/lineMap';
import mailIcon from '../../assets/images/emailIcon.svg';
import cloudIcon from '../../assets/images/cloudIcon.svg';

// SettingsView is just a re-branded WelcomeView, check that component for comments.
// BUG: Option isn't defaulting to the currently selected line.
function SettingsView({ initData, networkError, saveChanges }) {
  const [name, setName] = useState(initData.name);
  const [stationObj, setStationObj] = useState(initData.stationObj);
  const [lines, setLines] = useState([]);
  const [line, setLine] = useState(initData.line);

  const [errorObj, setErrorObj] = useState({
    name: '',
    stationObj: '',
    line: ''
  });

  const submit = () => {
    const errors = {};

    if (!Object.keys(stationObj).length) errors.stationObj = 'Missing station name';
    if (name.length > 16) errors.name = 'First name too long';
    if (!line) errors.line = 'Missing line';

    setErrorObj(errors);
    if (!Object.keys(errors).length) {
      saveChanges(name, stationObj, line);
    }
  };

  const getData = (stationName, setOptions, enableOptionsView) => {
    fetch(`${process.env.REACT_APP_API_URL}/search/stops/?query=${stationName}`)
      .then(data => data.json())
      .then(json => {
        if (json.error) throw new Error(json.error);
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
      setLines(stationObj.stop_id);
      if (stationObj.stop_id) {
        const ind = stationObj.stop_id.indexOf(line);
        if (ind !== -1) {
          setLine(stationObj.stop_id[ind]);
        } else setLine(stationObj.stop_id[0]);
      }
    },
    [stationObj]
  );

  return (
    <section className={CSS.SettingsView}>
      <h1 className={CSS.mainHeader}>Settings</h1>
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
          label="First Name (optional)"
          error={errorObj.name ? errorObj.name : ''}
          fluid={1}
        />
        <Option
          data={lines}
          lineMap={lineMap}
          selected={lines.indexOf(line)}
          onChange={e => setLine(lines[e.target.value])}
          error={errorObj.line ? errorObj.line : ''}
          label="Subway Line"
          alt="Subway Line"
        />
      </div>

      <div className={CSS.btnContainer}>
        <a href="mailto:noahryamamoto@gmail.com" target="_blank" rel="noopener noreferrer">
          <Button icon={mailIcon}>Feedback</Button>
        </a>
        <a href="https://darksky.net/poweredby/" target="_blank" rel="noopener noreferrer">
          <Button icon={cloudIcon}>Powered by Dark Sky</Button>
        </a>
      </div>
      <div className={CSS.saveContainer}>
        <Button onClick={submit}>Save Changes</Button>
      </div>
    </section>
  );
}

SettingsView.propTypes = {
  initData: PropTypes.objectOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.objectOf(PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]))
    ])
  ),
  networkError: PropTypes.func,
  saveChanges: PropTypes.func
};

SettingsView.defaultProps = {
  initData: {
    name: '',
    line: '',
    stationObj: {}
  },
  networkError: () => {
    throw new ReferenceError('networkError not passed to MainView');
  },
  saveChanges: () => {
    throw new ReferenceError('saveChanges not passed to MainView');
  }
};

export default SettingsView;
