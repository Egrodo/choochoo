import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import TrainStatus from '../reusables/TrainStatus';
import Spinner from '../reusables/Spinner';
import CSS from '../../css/blocks/TrainBlock.module.css';

// This component has to retrieve real-time data and render the information appropriately.

function TrainBlock({ stationObj, line, networkRetry, networkIssue }) {
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
    }).catch(err => {
      // If there's an issue connecting, wait a second then retry connections.
      if (!networkIssue) {
        networkRetry(10, getSchedule);
        console.error(err.message);
      }
    });
  };

  const switchDirection = () => {
    // On clickig of direction toggle rendered direction.
    setDirection(direction === 'N' ? 'S' : 'N');
  };

  useEffect(() => {
    getSchedule();
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
        {(loading || !schedule[direction]) ? <>
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
  networkRetry: PropTypes.func,
  networkIssue: PropTypes.bool,
};

TrainBlock.defaultProps = {
  stationObj: {},
  line: '',
  networkRetry: (() => { throw new ReferenceError('networkRetry not passed to MainView'); }),
  networkIssue: false,
};

export default TrainBlock;