import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import TrainStatus from '../reusables/TrainStatus';
import Spinner from '../reusables/Spinner';
import CSS from '../../css/TrainBlock.module.css';

// This component has to retrieve real-time data and render the information appropriately.
function TrainBlock({ stationObj, line }) {
  const [direction, setDirection] = useState('N');
  const [schedule, setSchedule] = useState({ N: [], S: [] }); // Obj containing incoming trains for both directions.
  const [loading, setLoading] = useState(false);

  // TODO: Maybe have my own timer running every time I get a network update and display info based on that instead   
  const getSchedule = () => {
    setLoading(true);
    console.log(`Getting /schedule/${line}`);
    fetch(`/schedule/${line}`).then(data => data.json()).then(json => {
      setSchedule(json);
      setLoading(false);
    }).catch(err => {
      // The server is offline / having troubles ?
      console.error(err);
    });

  };

  const switchDirection = () => {
    // On clickig of direction toggle rendered direction.
    setDirection(direction === 'N' ? 'S' : 'N');
  };

  // TODO: Handle offline and server offline at App level.
  useEffect(() => {
    // On mount getSchedule and set a timer to re-run getSchedule every minute.
    if (navigator.onLine) getSchedule();
    const timer = window.setInterval(() => {
      if (navigator.onLine) {
        getSchedule();
      } else {
        // If after the minute update we're suddenly offline, set as offine and retry every 5s.
        const online = window.setInterval(() => {
          if (navigator.onLine) {
            window.clearInterval(online);
          } else {
            console.log('Network Offline');
          }
        })
      }
    }, 60000);

    return () => window.clearInterval(timer);
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
      <div className={`${CSS.statusContainer} ${loading && CSS.loading}`}>
        {loading && <>
          <div className={CSS.floatLoader}><Spinner /></div>
          <div className={CSS.darken}>
            <TrainStatus loading />
            <TrainStatus loading />
            <TrainStatus loading />
          </div>
        </>}
        {schedule[direction].map(status =>
          <TrainStatus status={status} key={status.eta} />
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