import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import TrainStatus from '../reusables/TrainStatus';
import Spinner from '../reusables/Spinner';
import CSS from '../../css/blocks/TrainBlock.module.css';

function TrainBlock({ stationObj, line, networkError }) {
  const [direction, setDirection] = useState('N');
  const [schedule, setSchedule] = useState({ N: [], S: [] }); // Obj containing incoming trains for both directions.
  const [loading, setLoading] = useState(false);

  const getSchedule = () => {
    // If we're already loading or something is broken, don't retry.
    if (loading) return;
    console.log(`Getting new schedule for line ${line}`);
    setLoading(true);

    // TODO: Don't load while the network req is in progress, instead do that in background and just load while rendering new content.
    fetch(`${process.env.REACT_APP_API_URL}/api/schedule/${line}`)
      .then(res => {
        if (!res.ok) throw res;
        return res.json();
      })
      .then(json => {
        if (json.error) throw new Error(json.error);
        setSchedule(json);
        setLoading(false);
      })
      .catch(err => {
        // If the server sends me a permanent error, don't retry.
        if (err.status === 500 || err.status === 503) {
          networkError(`500 on /api/schedule/${line}`, true, getSchedule);
        } else {
          console.error(err);
        }
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

    // Get fresh data every 60 seconds if not in error / loading state.
    const reload = window.setInterval(() => {
      // Workaround to get accurate state data inside the setInterval.
      setLoading(load => {
        if (!load) {
          getSchedule();
        }
        return load;
      });
    }, 60 * 1000);
    return () => {
      window.clearInterval(reload);
    };
  }, []);

  return (
    <section className={CSS.TrainBlock}>
      <div className={CSS.headlineContainer}>
        <span className={CSS.stationName}>{stationObj.stop_name}</span>
        <span onClick={switchDirection} role="button" tabIndex="0" className={`${CSS.direction} ${CSS[direction]}`}>
          {`${direction === 'N' ? 'Up' : 'Down'}town`}
        </span>
      </div>
      <div className={CSS.statusContainer}>
        {loading || !schedule[direction].length ? (
          <>
            <div className={CSS.floatLoader}>
              <Spinner />
            </div>
            <div className={CSS.darken}>
              <TrainStatus loading />
              <TrainStatus loading />
              <TrainStatus loading />
              {window.screen.height > 700 && <TrainStatus loading />}
            </div>
          </>
        ) : (
          <>
            <TrainStatus status={schedule[direction][0]} key={`${schedule[direction][0]}_${0}`} />
            <TrainStatus status={schedule[direction][1]} key={`${schedule[direction][1]}_${1}`} />
            <TrainStatus status={schedule[direction][2]} key={`${schedule[direction][2]}_${2}`} />
            {window.screen.height > 700 && (
              <TrainStatus status={schedule[direction][3]} key={`${schedule[direction][3]}_${3}`} />
            )}
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
