import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import TrainTracks from './TrainTracks';
import CSS from '../../css/reusables/TrainStatus.module.css';

function TrainStatus({ status, loading }) {
  // Use line (or routeId off status?) to get the relevant image.
  const [img, setImg] = useState('');
  const [timeLeft, setTimeLeft] = useState(status.eta);

  useEffect(() => {
    if (loading) return; // If this TrainStatus is in loading mode don't do anything here.

    // On mount/unmount load the applicable route image.
    import(`../../assets/images/trainIcons/${status.routeId.toLowerCase()}.svg`)
      .then(image => {
        setImg(image.default);
      }).catch(err => {
        console.error(err);
      });

    // Every 10 seconds update the timeLeft state which will update the eta and trainPath.
    const timer = window.setInterval(() => {
      setTimeLeft(currTimeLeft => (currTimeLeft - 10 > 0 ? currTimeLeft - 10 : 0));
    }, 10000);
    /* eslint-disable-next-line */
    return () => window.clearInterval(timer);
  }, []);

  // Train path on a scale from 5 min to 0.
  return (
    <section className={`${CSS.TrainStatus} ${loading && CSS.loading}`}>
      {!loading && <>
        <div className={CSS.timeContainer}>
          <span className={CSS.arrivalTime}>
            {Math.round(timeLeft / 60) < 1 ? '<1' : Math.round(timeLeft / 60)}
          </span>
          <span className={CSS.min}>min</span>
        </div>
        <div className={CSS.routeId}>
          <img
            className={CSS.routeImg}
            alt={status.routeId}
            src={img}
          />
        </div>
        <div className={CSS.trainTracksContainer}>
          <TrainTracks eta={timeLeft} />
        </div>
      </>}
    </section>
  );
}

TrainStatus.propTypes = {
  status: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
  loading: PropTypes.bool
};

TrainStatus.defaultProps = {
  status: {},
  loading: false
};

export default TrainStatus;
