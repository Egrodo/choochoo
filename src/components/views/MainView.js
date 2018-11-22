import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import WeatherBlock from '../blocks/WeatherBlock';
import CSS from '../../css/MainView.module.css';

function MainView({name, stationObj, line, zipCode}) {

  const greeting = () => {
    // This will be re-ran on every re-render.
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

  return (
    <section className={CSS.MainView}>
      <h1 className={CSS.mainHeader}>Good {greeting()} {name}</h1>
      <div className={CSS.weatherContainer}>
        <WeatherBlock zipCode={zipCode} />
      </div>
      Main View rendering with {name}, {stationObj.stop_name}, {line}, {zipCode}
    </section>  
  );
}

MainView.propTypes = {
  name: PropTypes.string,
  stationObj: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)])),
  line: PropTypes.string,
  zipCode: PropTypes.string,
};

MainView.defaultProps = {
  name: '',
  stationObj: {},
  line: '',
  zipCode: '',
};

export default MainView;
