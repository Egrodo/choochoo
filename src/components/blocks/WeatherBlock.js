import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import CSS from '../../css/WeatherBlock.module.css';

const dummyData = {
  temp: 46,
  desc: 'Sunny'
};

// Weather block. There will be a lot more logic when I actually connect to a weather API.
function WeatherBlock({ zipCode }) {
  // TODO: Memoize this so it doesn't re-render every time MainView does.

  const [temp, setTemp] = useState('');
  const [desc, setDesc] = useState('');
  // settimeout to update this every 5 minutes maybe?
  useEffect(() => {
    // On first render get the weather data and place it in state.
    setTemp(dummyData.temp);
    setDesc(dummyData.desc);
  }, []);

  return (
    <section className={CSS.WeatherBlock}>
      <div className={CSS.tempContainer}>
        <span className={CSS.temp}>{temp}</span>
      </div>
      <div className={CSS.descContainer}>
        <span className={CSS.desc}>{desc}</span>
      </div>
    </section>
  );
}

WeatherBlock.propTypes = {
  zipCode: PropTypes.string,
};

WeatherBlock.defaultProps = {
  zipCode: '',
};

export default WeatherBlock;