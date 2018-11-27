import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Spinner from '../reusables/Spinner';

import CSS from '../../css/blocks/WeatherBlock.module.css';

// Would rather this load until it's ready rather than have defaults.
function WeatherBlock({ lat, lon, networkRetry, networkIssue }) {
  const [temp, setTemp] = useState('00');
  const [desc, setDesc] = useState('Loading');
  const [loading, setLoading] = useState(true);

  const getWeather = () => {
    setLoading(true);
    fetch(`/weather/${lat}/${lon}`)
      .then(data => data.json())
      .then(({ temperature, summary }) => {
        setTemp(Math.round(temperature));
        setDesc(summary);
      })
      .catch(err => {
        if (!networkIssue) {
          networkRetry(10);
          console.error(err);
        }
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
  networkRetry: PropTypes.func,
  networkIssue: PropTypes.bool
};

WeatherBlock.defaultProps = {
  lat: '40.7831',
  lon: '73.9712',
  networkRetry: () => {
    throw new ReferenceError('networkRetry not passed to WeatherBlock');
  },
  networkIssue: false
};

export default WeatherBlock;
