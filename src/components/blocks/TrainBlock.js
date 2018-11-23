import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import TrainStatus from '../reusables/TrainStatus';
import CSS from '../../css/TrainBlock.module.css';

// This component has to retrieve real-time data and render the information appropriately.
function TrainBlock({ stationObj, line }) {
  const [direction, setDirection] = useState('N');
  const [schedule, setSchedule] = useState({ N: [], S: [] }); // Obj containing incoming trains for both directions.

  const getSchedule = () => {
    // TODO: Loading indicator for TrainBlock.
    console.log(`Getting /schedule/${line}`);
    fetch(`/schedule/${line}`).then(data => data.json()).then(json => {
      setSchedule(json);
    }).catch(err => console.error(err));
  };

  const switchDirection = () => {
    // On clickig of direction toggle rendered direction.
    setDirection(direction === 'N' ? 'S' : 'N');
  };

  useEffect(() => {
    // On mount getSchedule and set a timer to re-run getSchedule every minute.
    getSchedule();
    const timer = window.setInterval(() => {
      // Are there problems that could occur when this is re-ran?
      console.log('re-requesting at ' + Date.now());
      getSchedule();
    }, 60000);
    return () => { // Return callback to run on unmount.
      window.clearInterval(timer);
    };
  }, []);

  const stationName = stationObj.stop_name;
  return (
    <section className={CSS.TrainBlock}>
      <div className={CSS.headlineContainer}>
        <span className={CSS.stationName}>{stationName}</span>
        <span onClick={switchDirection} role="button" tabIndex="0" className={`${CSS.direction} ${CSS[direction]}`}>
          {`${direction === 'N' ? 'North' : 'South'}bound`}
        </span>
      </div>
      <div className={CSS.TrainStatusContainer}>
        {schedule[direction].map(status =>
          <TrainStatus status={status} line={line} key={status.eta} />
        )}
      </div>
    </section>
  );
}

TrainBlock.propTypes = {
  stationObj: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)])),
  line: PropTypes.string,
};

TrainBlock.defaultProps = {
  stationObj: {},
  line: '',
};

export default TrainBlock;