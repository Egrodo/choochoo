import React, { useState } from 'react';
import CSS from '../../css/WelcomeView.module.css';
import Input from '../reusables/Input';
import Button from '../reusables/Button';

function WelcomeView({ saveChanges }) {
  const [name, setName] = useState('');
  // TODO: Handle the station > stopId stuff.
  const [station, setStation] = useState('');
  const [zipCode, setZipCode] = useState('');

  // Error handling: empty strings means no error, otherwise display error. Where?
  const [errorObj, setErrorObj] = useState({
    name: '',
    station: '',
    zipCode: ''
  });

  const submit = () => {
    // On submit, ensure the fields are valid then saveChanges.
    const errors = {};

    // First check that they filled in all the areas.
    if (!station) errors.station = 'Missing station';
    if (!name) errors.name = 'Missing name';
    if (!zipCode) errors.zipCode = 'Missing zipcode';

    // TODO: Now validate the station > stopId here.

    if (name.length > 16) {
      errors.name = 'First name too long';
    }

    // TODO: Now validate the zipCode here.

    if (!Object.keys(errors).length) {
      // If there are no errors, save the changes.
      saveChanges(name, station, zipCode);
    } else {
      console.table(errors);
      // Otherwise display the errors given and preserve the others.
      setErrorObj(errors);
    }
  };

  return (
    <section className={CSS.WelcomeView}>
      <h1 className={CSS.mainHeader}>Welcome to choochoo</h1>
      <h4 className={CSS.secondaryHeader}>
        I'll need some information before we start
      </h4>

      <div className={CSS.inputContainer}>
        {/* TODO: The station input needs a typeahead. */}
        <Input
          onChange={e => setStation(e.target.value)}
          value={station}
          placeholder="Station..."
          alt="station"
          label="Station Name"
          error={errorObj.station || ''}
          fluid={1}
        />
        <Input
          onChange={e => setName(e.target.value)}
          value={name}
          maxLength="16"
          placeholder="Name..."
          alt="name"
          label="First Name"
          error={errorObj.name || ''}
          fluid={1}
        />
        <Input
          onChange={e => setZipCode(e.target.value)}
          value={zipCode}
          placeholder="Zip..."
          alt="zip code"
          label="Zip Code"
          error={errorObj.zipCode || ''}
          fluid={1}
        />
      </div>

      <div className={CSS.btnContainer}>
        <Button onClick={submit}>Get Started</Button>
      </div>
    </section>
  );
}

export default WelcomeView;
