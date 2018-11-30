import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import WeatherBlock from '../blocks/WeatherBlock';
import TrainBlock from '../blocks/TrainBlock';

import CSS from '../../css/views/MainView.module.css';

// Keep this stuff cached while I'm in settingsView.
function MainView({ name, stationObj, line, gotoSettings, networkError }) {
  const [greeting, setGreeting] = useState();

  const calcGreeting = () => {
    const currT = new Date().getHours();
    if (currT < 12) {
      return 'Morning';
    } else if (currT < 18) {
      return 'Afternoon';
    } else if (currT < 24) {
      return 'Evening';
    }
    return 'Day';
  };

  useEffect(() => {
    setGreeting(calcGreeting());
  }, []);

  return (
    <section className={CSS.MainView}>
      <h1 className={CSS.mainHeader}>
        Good {greeting} {name}
      </h1>
      <div className={CSS.weatherContainer}>
        <WeatherBlock lat={stationObj.stop_lat} lon={stationObj.stop_lon} networkError={networkError} />
      </div>
      <div className={CSS.trainContainer}>
        <TrainBlock stationObj={stationObj} line={line} networkError={networkError} />
      </div>
      <div className={CSS.settingsLink}>
        <span onClick={gotoSettings} role="button" tabIndex="0">
          Settings
        </span>
      </div>
    </section>
  );
}

MainView.propTypes = {
  name: PropTypes.string,
  stationObj: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)])),
  line: PropTypes.string,
  gotoSettings: PropTypes.func,
  networkError: PropTypes.func
};

MainView.defaultProps = {
  name: '',
  stationObj: {},
  line: '',
  gotoSettings: () => {
    throw new ReferenceError('gotoSettings not passed to MainView');
  },
  networkError: () => {
    throw new ReferenceError('networkError not passed to MainView');
  }
};

export default MainView;
