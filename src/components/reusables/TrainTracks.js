import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import TrainImg from '../../assets/images/whiteTrain.png';
import CSS from '../../css/reusables/TrainTracks.module.css';

function TrainTracks({ eta }) {
  const [margin, setMargin] = useState(0);
  const [maxDist, setMaxDist] = useState(0);

  useEffect(() => {
    // On first mount and on update of eta and set of maxDist,
    // set the margin to be a percentage of the maxDist.
    if (eta > 600) {
      setMargin(0);
    } else {
      console.log(eta);
      const m = (1 - (eta / 600));
      // This is a percentage, need to get pixel amount to maxDist.
      const t = m * maxDist;
      console.log(t);
      setMargin(t);
    }
  }, [maxDist, eta]);

  // useEffect(() => {
  //   if (maxDist !== 0) {
  //     const m = (1 - (eta / maxDist)) * 100;
  //     setMargin(m);
  //   }
  //   // On every update of eta calc how far it is from dist
  //   // Say it starts at 5 minutes, or 300000 ms. If update n is at 1 minute, or 60000, it should be 80% there.
  //   // the max margin is the initialDist minus half the size of the train.
  // }, [maxDist, eta]);

  // I get new props every 10 seconds updating the time & position.
  // Depending on how far along the eta is, move the train. From 10 minutes?
  return (
    <section className={CSS.TrainTracks}>
      <img
        src={TrainImg}
        onLoad={(({ target }) => {
          // When the image loads, set the maximum distance to be 100% of the container width minus half the dist of the image width.
          const max = target.parentNode.offsetWidth - (target.offsetWidth / 2);
          setMaxDist(max);
        })}
        alt="Train" className={CSS.TrainImg}
        style={{ marginLeft: margin }}
      />
    </section>
  )
}

TrainTracks.propTypes = {
  eta: PropTypes.number,
};

TrainTracks.defaultProps = {
  eta: 600000,
};

export default TrainTracks;