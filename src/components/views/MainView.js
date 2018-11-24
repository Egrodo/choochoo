import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import WeatherBlock from '../blocks/WeatherBlock';
import TrainBlock from '../blocks/TrainBlock';

import CSS from '../../css/views/MainView.module.css';

function MainView({ name, stationObj, line, gotoOptions, networkRetry, networkIssue }) {
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

  const memoWeather = useMemo(() => (
    <WeatherBlock lat={stationObj.stop_lat} lon={stationObj.stop_lon} networkRetry={networkRetry} networkIssue={networkIssue} />
  ), [networkIssue]);

  return (
    <section className={CSS.MainView}>
      <h1 className={CSS.mainHeader}>Good {greeting} {name}</h1>
      <div className={CSS.weatherContainer}>
        {memoWeather}
      </div>
      <div className={CSS.trainContainer}>
        <TrainBlock stationObj={stationObj} line={line} networkRetry={networkRetry} networkIssue={networkIssue} />
      </div>
      <div className={CSS.optionsLink}>
        <span onClick={gotoOptions} role="button" tabIndex="0">Options</span>
      </div>
    </section>
  );
}

MainView.propTypes = {
  name: PropTypes.string,
  stationObj: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)])),
  line: PropTypes.string,
  gotoOptions: PropTypes.func,
  networkRetry: PropTypes.func,
  networkIssue: PropTypes.bool,
};

MainView.defaultProps = {
  name: '',
  stationObj: {},
  line: '',
  gotoOptions: (() => { throw new ReferenceError('gotoOptions not passed to MainView'); }),
  networkRetry: (() => { throw new ReferenceError('networkRetry not passed to MainView'); }),
  networkIssue: false,
};

export default MainView;
