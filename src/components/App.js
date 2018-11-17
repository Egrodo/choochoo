import React, { useState, useEffect } from 'react';
import SunAndClouds from '../assets/images/sunny-day.png';
import CSS from '../css/App.module.css';

import WelcomeView from './views/WelcomeView';
import MainView from './views/MainView';
import OptionsView from './views/OptionsView';

function App() {
  console.log('App render');
  // This function will run on every single render. But hooks is smart enough to not rewrite state with empty state.

  const [name, setName] = useState('');
  const [stopId, setStopId] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [view, setView] = useState('');

  const saveChanges = (newName, newStopId, newZipCode) => {
    console.log('Saving following to localStorage:');
    console.table({ newName, newStopId, newZipCode });
    // Submit the state to the localStorage.
    if (!newName || !newStopId || !newZipCode) {
      throw new Error("saveToStorage wasn't given proper variables");
    } else {
      // Need to validate stopId first
      localStorage.setItem('name', newName);
      localStorage.setItem('stopId', newStopId);
      localStorage.setItem('zipCode', newZipCode);
      setName(newName);
      setStopId(newStopId);
      setZipCode(newZipCode);
      setView('main');
    }
  };

  useEffect(() => {
    // This runs on componentDidMount componentWillUnmount.

    // On first load check if we have data. If we dont have any data, show welcome view. If we do, show mainView.
    const checkStorage = key => localStorage.getItem(key) || '';
    const newName = checkStorage('name');
    const newStopId = checkStorage('stopId');
    const newZipCode = checkStorage('zipCode');
    console.log({ newName, newStopId, newZipCode });
    setName(newName);
    setStopId(newStopId);
    setZipCode(newZipCode);
    if (newName && newStopId && newZipCode) {
      setView('main');
    } else setView('welcome');
  }, []);

  // General parent stylings setting the header img, fonts, bg color.
  return (
    <div className={CSS.App}>
      <header className={CSS.imgContainer}>
        <img
          src={SunAndClouds}
          className={CSS.headerImg}
          alt="Sun And Clouds"
        />
      </header>
      <div className={CSS.content}>
        {view === 'welcome' && <WelcomeView saveChanges={saveChanges} />}
        {view === 'main' && (
          <MainView name={name} stopId={stopId} zipCode={zipCode} />
        )}
        {view === 'options' && (
          <OptionsView
            name={name}
            stopId={stopId}
            zipCode={zipCode}
            saveChanges={saveChanges}
          />
        )}
      </div>
    </div>
  );
}

export default App;
