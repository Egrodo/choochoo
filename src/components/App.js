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
    // Submit the state to the localStorage.
    if (!name || !stopId || !zipCode) {
      /*  TODO:
          Handle errors with a prop? Or should this be done farther down?
          Handle empty zipCode.
      */
      throw new Error("saveToStorage wasn't given proper variables").trace;
    } else {
      // Need to validate stopId first
      localStorage.setItem('name', name);
      setName(newName);
      localStorage.setItem('stopId', stopId);
      setStopId(newStopId);
      localStorage.setItem('zipCode', zipCode);
      setZipCode(newZipCode);
    }
  }

  useEffect(() => {
    // This runs on componentDidMount componentWillUnmount.

    // On first load check if we have data. If we dont have any data, show welcome view. If we do, show mainView.
    const checkStorage = (key => localStorage.getItem(key) || '');
    const newName = checkStorage('name');
    const newStopId = checkStorage('stopId');
    const newZipCode = checkStorage('zipCode');

    setName(newName);
    setStopId(newStopId);
    setZipCode(newZipCode);
    if (newName && newStopId) {
      setView('main');
    } else setView('welcome');
  }, []);

  // General parent stylings setting the header img, fonts, bg color.
  return (
    <div className={CSS.App}>
      <header className={CSS.imgContainer}>
        <img src={SunAndClouds} className={CSS.headerImg} alt="SunAndClouds" />
      </header>
      <div className={CSS.content}>
        {view === 'welcome' && (
          <WelcomeView saveChanges={saveChanges} />
        )}
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
