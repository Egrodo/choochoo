import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import TrainStatus from '../reusables/TrainStatus';
import Spinner from '../reusables/Spinner';
import CSS from '../../css/TrainBlock.module.css';

// This component has to retrieve real-time data and render the information appropriately.

function TrainBlock({ stationObj, line, setNetworkIssue }) {
  const [direction, setDirection] = useState('N');
  const [schedule, setSchedule] = useState({ N: [], S: [] }); // Obj containing incoming trains for both directions.
  const [loading, setLoading] = useState(true);

  const getSchedule = () => {
    setLoading(true);
    console.log(`Getting /schedule/${line}`);
    // BUG: Illegal offset sometimes appears here, track down.
    fetch(`/schedule/${line}`).then(data => data.json()).then(json => {
      setSchedule(json);
      setLoading(false);
      setNetworkIssue('');
    }).catch(err => {
      // If we don't already know about an issue, set one and retry network.
      setNetworkIssue("Server not responding...");
      console.error(err.message);
    });
  };

  const switchDirection = () => {
    // On clickig of direction toggle rendered direction.
    setDirection(direction === 'N' ? 'S' : 'N');
  };

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
            getSchedule();
            window.clearInterval(online);
          } else {
            setNetworkIssue('Internet down, retrying...');
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
        {loading ? <>
          <div className={CSS.floatLoader}><Spinner /></div>
          <div className={CSS.darken}>
            <TrainStatus loading />
            <TrainStatus loading />
            <TrainStatus loading />
          </div>
        </> : <>
            {schedule[direction].map((status, i) =>
              <TrainStatus status={status} key={`${status.routeId}_${i}`} />
            )}
          </>}
      </div>
    </section>
  );
}

TrainBlock.propTypes = {
  stationObj: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)])),
  line: PropTypes.string,
  networkIssue: PropTypes.string,
  setNetworkIssue: PropTypes.func,
};

TrainBlock.defaultProps = {
  stationObj: {},
  line: '',
  networkIssue: '',
  setNetworkIssue: (() => { throw new ReferenceError('setNetworkIssue not passed to MainView'); }),
};

export default TrainBlock;