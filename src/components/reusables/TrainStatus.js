import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import CSS from '../../css/TrainStatus.module.css';

function TrainStatus({ status, line }) {
  // Use line (or routeId off status?) to get the relevant image.
  const [img, setImg] = useState();

  useEffect(() => {
    // On mount/unmount load the applicable route image.
    import(`../../assets/images/trainIcons/${status.routeId.toLowerCase()}.svg`)
      .then(image => {
        console.log(image);
        setImg(image.default);
      }).catch(err => {
        console.error(err);
      });
  }, []);

  return (
    <section className={CSS.TrainStatus}>
      <div className={CSS.timeContainer}>
        <span className={CSS.arrivalTime}>{Math.round(status.eta / 60)}</span>
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
        {status.arrivalTime}
      </div>
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
