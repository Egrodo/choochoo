import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import CSS from '../../css/TrainStatus.module.css';

function TrainStatus({ status, loading = false }) {
  // Use line (or routeId off status?) to get the relevant image.
  const [img, setImg] = useState('');
  const [timeLeft, setTimeLeft] = useState(status.eta);

  useEffect(() => {
    // On mount/unmount load the applicable route image.
    if (loading) return; // If this TrainStatus is in loading mode don't do anything here.
    import(`../../assets/images/trainIcons/${status.routeId.toLowerCase()}.svg`)
      .then(image => {
        setImg(image.default);
      }).catch(err => {
        console.error(err);
      });

    // Every 10 seconds update the timeLeft state which will update the eta and trainPath.
    const timer = window.setInterval(() => {
      setTimeLeft(timeLeft => (timeLeft - 10 > 0 ? timeLeft - 10 : 0));
    }, 10000);
    return () => {
      window.clearInterval(timer);
    }
  }, []);

  // Train path on a scale from 5 min to 0.
  return (
    <section className={`${CSS.TrainStatus} ${loading && CSS.loading}`}>
      {!loading && <>
        <div className={CSS.timeContainer}>
          <span className={CSS.arrivalTime}>
            {(status.eta / 60) < 1 ? '<1' : Math.round(timeLeft / 60)}
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
        <div className={CSS.trainPathContainer}>
          {timeLeft}
        </div>
      </>}
    </section>
  );
}

TrainStatus.propTypes = {
  status: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
  line: PropTypes.string,
};

TrainStatus.defaultProps = {
  status: {},
  line: '',
};

export default TrainStatus;
