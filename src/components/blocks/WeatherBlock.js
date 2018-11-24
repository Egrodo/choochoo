import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

import CSS from '../../css/WeatherBlock.module.css';

const dummyData = {
  temp: 46,
  desc: 'Sunny'
};

// Weather block. There will be a lot more logic when I actually connect to a weather API.
function WeatherBlock({ lat, lon }) {
  const [temp, setTemp] = useState('');
  const [desc, setDesc] = useState('');
  // settimeout to update this every 5 minutes maybe?
  useEffect(() => {
    // On first render get the weather data and place it in state.
    fetch(`/weatherInfo/${lat}/${lon}`).then(data => data.json())
      .then(({ temperature, summary }) => {
        setTemp(Math.round(temperature));
        setDesc(summary);
      }).catch(err => {
        console.error({ err, message: "Can't connect to /weatherInfo" });
      });
    setTemp(dummyData.temp);
    setDesc(dummyData.desc);
  }, []);

  return (
    <section className={CSS.WeatherBlock}>
      <div className={CSS.temperatureContainer}>
        <span className={CSS.temperature}>{temp}</span>
      </div>
      <div className={CSS.descContainer}>
        <span className={CSS.desc}>{desc}</span>
      </div>
    </section>
  );
}

WeatherBlock.propTypes = {
  lat: PropTypes.string,
  lon: PropTypes.string
};

WeatherBlock.defaultProps = {
  lat: '40.7831',
  lon: '73.9712'
};

export default WeatherBlock;