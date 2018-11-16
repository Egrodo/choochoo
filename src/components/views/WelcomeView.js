import React, { useState, useEffect } from 'react';
import CSS from '../../css/WelcomeView.module.css';
import Input from '../reusables/Input';
import Button from '../reusables/Button';

function WelcomeView({ saveChanges }) {
  // Control internal state for data here. Typeahead for stopId. After user clicks submit validate and then send it.

  const [name, setName] = useState('');
  // TODO: Abstract away stopId from station name.
  const [stopId, setStopId] = useState('');
  const [zipCode, setZipCode] = useState('');

  const submit = () => {};

  // Max length for name with errors. Do in pre-submit?
  return (
    <section className={CSS.WelcomeView}>
      <h1 className={CSS.mainHeader}>Welcome to choochoo</h1>
      <h4 className={CSS.secondaryHeader}>
        I'll need some information before we start
      </h4>

      <div className={CSS.inputContainer}>
        <Input
          onChange={e => setStopId(e.target.value)}
          value={stopId}
          placeholder="Station..."
          alt="station"
          label="Station Name"
          fluid
        />
        <Input
          onChange={e => setName(e.target.value)}
          value={name}
          maxLength="16"
          placeholder="Name..."
          alt="name"
          label="First Name"
          fluid
        />
        <Input
          onChange={e => setZipCode(e.target.value)}
          value={zipCode}
          placeholder="Zip..."
          alt="zip code"
          label="Zip Code"
          fluid
        />
      </div>

      <div className={CSS.btnContainer}>
        <Button onClick={submit}>Get Started</Button>
      </div>
    </section>
  );
}

export default WelcomeView;
