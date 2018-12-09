import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import TrainTracks from './TrainTracks';
import CSS from '../../css/reusables/TrainStatus.module.css';

function TrainStatus({ status }) {
  const [img, setImg] = useState('');
  const [timeLeft, setTimeLeft] = useState(status.eta);

  const getImg = id => {
    import(`../../assets/images/trainIcons/${id}.svg`)
      .then(image => {
        setImg(image.default);
      })
      .catch(err => {
        // We don't need network error handling here because this won't load if there's one higher up.
        console.error(err);
      });
  };

  useEffect(() => {
    getImg(status.routeId.toLowerCase());

    // Every 10 seconds update the timeLeft state which will update the eta and trainPath.
    const timer = window.setInterval(() => {
      setTimeLeft(currTimeLeft => (currTimeLeft - 10 > 0 ? currTimeLeft - 10 : 0));
    }, 10 * 1000);
    return () => {
      window.clearInterval(timer);
    };
  }, []);

  useEffect(
    () => {
      // On change of 'status' (direction change) recalc everything.
      getImg(status.routeId.toLowerCase());
      setTimeLeft(status.eta);
    },
    [status]
  );

  return (
    <section className={CSS.TrainStatus}>
      <div className={CSS.timeContainer}>
        <span className={CSS.arrivalTime}>{Math.round(timeLeft / 60) < 1 ? '<1' : Math.round(timeLeft / 60)}</span>
        <span className={CSS.min}>min</span>
      </div>
      <div className={CSS.routeId}>
        <img className={CSS.routeImg} alt={status.routeId} src={img} />
      </div>
      <div className={CSS.trainTracksContainer}>
        <TrainTracks eta={timeLeft} />
      </div>
    </section>
  );
}

TrainStatus.propTypes = {
  status: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number]))
};

TrainStatus.defaultProps = {
  status: {}
};

export default TrainStatus;
