import React from 'react';
import PropTypes from 'prop-types';
import CSS from '../../css/reusables/NetworkDialogue.module.css';

function NetworkDialogue({ message }) {
  return (
    <section className={`${CSS.NetworkDialogue} ${message && CSS.active}`}>
      {message}
      <span>.</span><span>.</span><span>.</span>
    </section>
  );
}

NetworkDialogue.propTypes = {
  message: PropTypes.string,
};

NetworkDialogue.defaultProps = {
  message: '',
};

export default NetworkDialogue;
