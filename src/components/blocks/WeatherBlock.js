import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Spinner from '../reusables/Spinner';

import CSS from '../../css/blocks/WeatherBlock.module.css';

function WeatherBlock({ lat, lon, networkError }) {
  const [temp, setTemp] = useState('00');
  const [desc, setDesc] = useState('Loading');
  const [loading, setLoading] = useState(true);

  const getWeather = () => {
    setLoading(true);
    fetch(`/api/weather/${lat}/${lon}`)
      .then(res => res.json())
      .then(json => {
        if (json.error) throw new Error(json.error);
        setTemp(Math.round(json.temperature));
        setDesc(json.summary);
      })
      .catch(err => {
        console.count('Throwing error from weatherBlock');
        if (err.message === 'Rate Limit Reached') {
          networkError('Rate Limit Reached', false);
        } else networkError('/api/weather req failed', true, getWeather);
      });
  };

  useEffect(() => {
    // On first render get the weather.
    getWeather();
  }, []);

  useEffect(
    () => {
      // When the temp and desc are loaded disable spinner.
      if (temp !== '00' && desc !== 'Loading') {
        setLoading(false);
      }
    },
    [temp, desc]
  );

  return (
    <section className={CSS.WeatherBlock}>
      {loading ? (
        <>
          <div className={CSS.loader}>
            <Spinner />
          </div>
        </>
      ) : (
        <>
          <div className={CSS.temperatureContainer}>
            <span className={CSS.temperature}>{temp}</span>
          </div>
          <div className={CSS.descContainer}>
            <span className={CSS.desc}>{desc}</span>
          </div>
        </>
      )}
    </section>
  );
}

WeatherBlock.propTypes = {
  lat: PropTypes.string,
  lon: PropTypes.string,
  networkError: PropTypes.func
};

WeatherBlock.defaultProps = {
  lat: '40.7831',
  lon: '73.9712',
  networkError: () => {
    throw new ReferenceError('networkError not passed to WeatherBlock');
  }
};

export default WeatherBlock;
