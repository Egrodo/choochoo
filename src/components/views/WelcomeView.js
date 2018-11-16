import React, { useState, useEffect } from 'react';
import CSS from '../../css/WelcomeView.module.css';
import Input from '../reusables/Input';

function WelcomeView({ saveChanges }) {
  // Control internal state for data here. Typeahead for stopId. After user clicks submit validate and then send it.

  const [name, setName] = useState('');
  // const [stopId, setStopId] = useState('');
  // const [zipCode, setZipCode] = useState('');

  // Max length for name with errors. Do in pre-submit?
  return (
    <section className={CSS.WelcomeView}>
      <h1 className={CSS.mainHeader}>Welcome to choochoo</h1>
      <h4 className={CSS.secondaryHeader}>
        I'll need some information before we start
      </h4>

      <div className={CSS.inputContainer}>
        <Input
          onChange={e => setName(e.target.value)}
          value={name}
          maxLength="16"
          placeholder="Bob..."
          alt="name"
          label="First Name"
          fluid
        />
      </div>
    </section>
  );
}

export default WelcomeView;
