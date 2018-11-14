import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router';
import { Input } from 'semantic-ui-react';

/*
  Use React Context to serve the data to the app, manage the data here.
*/

function App() {
  console.log('render');
  // On first load check local storage and establish variables.
  const checkStorage = (key => localStorage.getItem(key) || '');

  const [name, setName] = useState(checkStorage('name'));
  const [stopId, setStopId] = useState(checkStorage('stopId'));
  const [zipCode, setZipCode] = useState(checkStorage('zipCode'));


  useEffect(() => {
    // On first load and on an update of any of the global state items.

    // TODO: Only update localStorage when I save, not just on typing.
    if (name) localStorage.setItem('name', name);
    if (stopId) localStorage.setItem('stopId', stopId);
    if (zipCode) localStorage.setItem('zipCode', zipCode);
  }, [name, stopId, zipCode]);

  return (
    <>
      <Input placeholder="Name..." value={name} onChange={e => setName(e.target.value)} />
      <Input placeholder="stopId..." value={stopId} onChange={e => setStopId(e.target.value)} />
      <Input placeholder="zipCode..." value={zipCode} onChange={e => setZipCode(e.target.value)} />
    </>
  );
}

export default App;
