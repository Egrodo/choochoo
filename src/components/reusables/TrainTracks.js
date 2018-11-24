import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import TrainImg from '../../assets/images/whiteTrain.png';
import CSS from '../../css/reusables/TrainTracks.module.css';

function TrainTracks({ eta }) {
  const [margin, setMargin] = useState(0);
  const [maxDist, setMaxDist] = useState(0);

  useEffect(() => {
    // On first mount and on update of eta and set of maxDist,
    // If eta is greater than 5 minutes, just keep train on the left.
    console.log(maxDist);
    if (eta > 600) {
      setMargin(0);
    } else {
      // Otherwise calculate the percentage of the way we are to 5 minutes,
      const m = (1 - (eta / 600));
      // and convert it to a pixel count of maxDist
      const t = m * maxDist;
      // console.log(`eta: ${eta} t: ${t}`);
      // So long as t isn't greater than maxDist minus a 20px~ fuzz, set it. Otherwise keep it at max.
      if (t < maxDist) {
        setMargin(t);
      } else if (t !== maxDist) setMargin(maxDist);
    }
  }, [maxDist, eta]);

  // I get new props every 10 seconds updating the time & position.
  // Depending on how far along the eta is, move the train. From 10 minutes?
  return (
    <section className={CSS.TrainTracks}>
      <img
        src={TrainImg}
        onLoad={(({ target }) => {
          // When the image loads, set the maximum distance to be 100% of the container width minus the dist of the image width.
          const max = target.parentNode.offsetWidth - target.offsetWidth;
          setMaxDist(max);
        })}
        alt="Train" className={CSS.TrainImg}
        style={{ left: margin }}
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