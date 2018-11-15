import React, { useState, useEffect } from 'react';
import { Header, Input } from 'semantic-ui-react';
import CSS from '../css/WelcomeView.module.css';

function WelcomeView({ saveChanges }) {
  // Control internal state for data here. Typeahead for stopId. After user clicks submit validate and then send it.

  const [name, setName] = useState('');
  const [stopId, setStopId] = useState('');
  const [zipCode, setZipCode] = useState('');

  return (
    <section className={CSS.WelcomeView}>
      <Header as="h1" className="mainHeader">Welcome to choochoo</Header>
      <Header as="h4" className="secondaryHeader">I'll need some information before we start</Header>
    </section>
  )
}

export default WelcomeView;
