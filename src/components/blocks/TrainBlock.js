import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import TrainStatus from '../reusables/TrainStatus';
import Spinner from '../reusables/Spinner';
import CSS from '../../css/blocks/TrainBlock.module.css';

// TODO: Remember default direction
function TrainBlock({ stationObj, line, networkError }) {
  const [direction, setDirection] = useState('N');
  const [schedule, setSchedule] = useState({ N: [], S: [] }); // Obj containing incoming trains for both directions.
  const [loading, setLoading] = useState(false);

  const getSchedule = () => {
    // If we're already loading or something is broken, don't retry.
    if (loading) return;
    console.log(`Getting new schedule for line ${line}`);
    setLoading(true);

    fetch(`/api/schedule/${line}`)
      .then(data => data.json())
      .then(json => {
        if (json.error) throw new Error(json.error);
        setSchedule(json);
        setLoading(false);
      })
      .catch(err => {
        if (err.message === 'Rate Limit Reached') {
          networkError('Rate Limit Reached', false);
        } else networkError(`/api/schedule/${line}`, true, getSchedule);
      });
  };

  const switchDirection = () => {
    // On clicking of direction toggle rendered direction and save to localStorage.
    setDirection(dir => {
      const newDir = dir === 'N' ? 'S' : 'N';
      localStorage.setItem('direction', newDir);
      return newDir;
    });
  };

  useEffect(() => {
    // On first mount, get schedule and check for direction.
    if (localStorage.getItem('direction')) setDirection(localStorage.getItem('direction'));

    getSchedule();

    // Get fresh data every 60 seconds.
    const reload = window.setInterval(() => {
      getSchedule();
    }, 60 * 1000);
    return () => window.clearInterval(reload);
  }, []);

  return (
    <section className={CSS.TrainBlock}>
      <div className={CSS.headlineContainer}>
        <span className={CSS.stationName}>{stationObj.stop_name}</span>
        <span onClick={switchDirection} role="button" tabIndex="0" className={`${CSS.direction} ${CSS[direction]}`}>
          {`${direction === 'N' ? 'North' : 'South'}bound`}
        </span>
      </div>
      <div className={CSS.statusContainer}>
        {loading || !schedule[direction] ? (
          <>
            <div className={CSS.floatLoader}>
              <Spinner />
            </div>
            <div className={CSS.darken}>
              <TrainStatus loading />
              <TrainStatus loading />
              <TrainStatus loading />
            </div>
          </>
        ) : (
          <>
            {schedule[direction].map((status, i) => (
              <TrainStatus status={status} key={`${status.routeId}_${i}`} />
            ))}
          </>
        )}
      </div>
    </section>
  );
}

TrainBlock.propTypes = {
  stationObj: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)])),
  line: PropTypes.string,
  networkError: PropTypes.func
};

TrainBlock.defaultProps = {
  stationObj: {},
  line: '',
  networkError: () => {
    throw new ReferenceError('networkError not passed to MainView');
  }
};

export default TrainBlock;
