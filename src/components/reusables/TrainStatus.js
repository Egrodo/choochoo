import React, { useStatus, useEffect } from 'react';
import PropTypes from 'prop-types';
import CSS from '../../css/TrainStatus.module.css';

function TrainStatus({ status, line }) {
  // Use line (or routeId off status?) to get the relevant image.
  return (
    <section className={CSS.TrainStatus}>
      Train Status for {line}: {status.arrivalTime} seconds left for {status.routeId} train.
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
