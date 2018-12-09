import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import TrainStatus from '../reusables/TrainStatus';
import Spinner from '../reusables/Spinner';
import { ReactComponent as ErrorImg } from '../../assets/images/cancel.svg';

import CSS from '../../css/blocks/TrainBlock.module.css';

// TODO: Implement https://github.com/mauricedb/use-abortable-fetch
function TrainBlock({ stationObj, line, reqOn, networkError }) {
  const [direction, setDirection] = useState(localStorage.getItem('direction') || 'N');
  const [schedule, setSchedule] = useState({ N: [], S: [] }); // Obj containing incoming trains for both directions.
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(false);
  const timerRef = useRef();

  const getSchedule = () => {
    console.log(`Getting new schedule for line ${line}.`);

    // If the request fails, error on both directions. If a direction is empty error just for that direction.
    fetch(`${process.env.REACT_APP_API_URL}/api/schedule/${line}`)
      .then(res => {
        if (!res.ok) throw res;
        return res.json();
      })
      .then(json => {
        if (json.error) throw new Error(json.error);

        // If a direction is empty set error for that direction. Otherwise clear error.
        if (!json.N.length || !json.S.length) {
          setApiError(true);
        } else setApiError(false);
        setLoading(false);
        setSchedule(json);
      })
      .catch(err => {
        setApiError(true);
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
    setLoading(true);
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
        timerRef.current = scheduleTimer();
        setLoading(true);
        getSchedule();
      } else if (!reqOn) {
        // If reqs turn off, clear reload interval and un-define the timer.
        window.clearInterval(timerRef.current);
        timerRef.current = undefined;
      }
    },
    [reqOn]
  );

  // Status logic in a function for cleaner render code.
  const Status = () => {
    // If there is an ApiError return for whichever direction erred (or both).
    if (apiError && !schedule[direction].length) {
      return (
        <div className={CSS.errorBlock}>
          <ErrorImg className={CSS.ErrorImg} />
          <h4>
            No schedule found for {`${direction === 'N' ? 'Up' : 'Down'}town`}
            <span role="img" aria-label="frowning face">
              🙁
            </span>
          </h4>
          <p>Check the MTA website for service alerts:</p>
          <a href="http://alert.mta.info/" target="_blank" rel="noopener noreferrer">
            http://alert.mta.info
          </a>
        </div>
      );
    }

    // If there is a schedule ready to load
    if (!loading && schedule[direction].length) {
      const status = schedule[direction];
      return (
        <>
          <TrainStatus status={status[0]} key={`${status[0]}_${0}`} />
          <TrainStatus status={status[1]} key={`${status[1]}_${1}`} />
          <TrainStatus status={status[2]} key={`${status[2]}_${2}`} />
          {window.screen.height > 775 && <TrainStatus status={status[3]} key={`${status[3]}_${3}`} />}
        </>
      );
    }

    return (
      <>
        <div className={CSS.floatLoader}>
          <Spinner />
        </div>
        <div className={CSS.darken}>
          <div className={CSS.loadingBlock} />
          <div className={CSS.loadingBlock} />
          <div className={CSS.loadingBlock} />
          {window.screen.height > 775 && <div className={CSS.loadingBlock} />}
        </div>
      </>
    );
  };

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
        <Status />
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
