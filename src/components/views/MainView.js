import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import WeatherBlock from '../blocks/WeatherBlock';
import TrainBlock from '../blocks/TrainBlock';

import CSS from '../../css/views/MainView.module.css';

// Keep this stuff cached while I'm in settingsView.
function MainView({ name, stationObj, line, reqOn, gotoSettings, networkError }) {
  const [greeting, setGreeting] = useState();

  const calcGreeting = () => {
    const currT = new Date().getHours();

    if (currT > 5 && currT < 12) return 'Morning';
    if (currT > 12 && currT < 18) return 'Afternoon';
    if (currT > 18 || currT < 5) return 'Evening';
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
        <TrainBlock stationObj={stationObj} line={line} reqOn={reqOn} networkError={networkError} />
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
  reqOn: PropTypes.bool,
  gotoSettings: PropTypes.func,
  networkError: PropTypes.func
};

MainView.defaultProps = {
  name: '',
  stationObj: {},
  line: '',
  reqOn: true,
  gotoSettings: () => {
    throw new ReferenceError('gotoSettings not passed to MainView');
  },
  networkError: () => {
    throw new ReferenceError('networkError not passed to MainView');
  }
};

export default MainView;
