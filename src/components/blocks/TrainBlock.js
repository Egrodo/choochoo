import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import TrainStatus from '../reusables/TrainStatus';
import Spinner from '../reusables/Spinner';
import CSS from '../../css/blocks/TrainBlock.module.css';

function TrainBlock({ stationObj, line, reqOn, networkError }) {
  const [direction, setDirection] = useState('N');
  const [schedule, setSchedule] = useState({ N: [], S: [] }); // Obj containing incoming trains for both directions.
  const [loading, setLoading] = useState(false);
  const timerRef = useRef();

  const getSchedule = () => {
    // If we're already loading or something is broken, don't retry.
    if (loading) return;
    console.log(`Getting new schedule for line ${line}`);

    // TODO: Don't load while the network req is in progress, instead do that in background and just load while rendering new content.
    fetch(`${process.env.REACT_APP_API_URL}/api/schedule/${line}`)
      .then(res => {
        if (!res.ok) throw res;
        return res.json();
      })
      .then(json => {
        if (json.error) throw new Error(json.error);
        setSchedule(json);
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

  // Return a reference to a timer that gets fresh data every 60 seconds if not in error / loading state.
  const scheduleTimer = () =>
    window.setInterval(() => {
      // Before reloading, check if currently loading and if requests are on.
      // Workaround to get accurate state data in timer.
      setLoading(load => {
        if (!load) {
          getSchedule();
        }
        return load;
      });
    }, 60 * 1000);

  // On first mount, check for direction, get schedule, and initialize a scheduleTimer.
  useEffect(() => {
    if (localStorage.getItem('direction')) setDirection(localStorage.getItem('direction'));

    getSchedule();
    timerRef.current = scheduleTimer();
    return () => {
      window.clearInterval(timerRef.current);
    };
  }, []);

  // On updates of reqOn (see App.js visibilityChange)
  useEffect(
    () => {
      if (reqOn && !timerRef.current) {
        // If reqs turn back on after having been off, setSchedule and restart interval.
        getSchedule();
        timerRef.current = scheduleTimer();
      } else {
        // If reqs turn off, clear reload interval and undefine the timer.
        window.clearInterval(timerRef.current);
        timerRef.current = undefined;
      }
    },
    [reqOn]
  );

  // Only render the TrainStatus if we have a direction for that block.
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
              {window.screen.height > 775 && <TrainStatus loading />}
            </div>
          </>
        ) : (
          <>
            {schedule[direction].map((status, i) => {
              if (i < 3) return <TrainStatus status={status} key={`${status}_${i}`} />;
              return false;
            })}
            {window.screen.height > 775 && schedule[direction][3] && (
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
  reqOn: PropTypes.bool,
  networkError: PropTypes.func
};

TrainBlock.defaultProps = {
  stationObj: {},
  line: '',
  reqOn: true,
  networkError: () => {
    throw new ReferenceError('networkError not passed to MainView');
  }
};

export default TrainBlock;
