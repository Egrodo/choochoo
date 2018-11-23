import React, { useState, useEffect } from 'react';
import SunAndClouds from '../assets/images/sunny-day.png';
import CSS from '../css/App.module.css';

import WelcomeView from './views/WelcomeView';
import MainView from './views/MainView';
import OptionsView from './views/OptionsView';

function App() {
  console.log('App render');
  // This function will run on every single render. But hooks is smart enough to not rewrite existing state !

  const [name, setName] = useState('');
  const [stationObj, setStationObj] = useState('');
  const [line, setLine] = useState('');
  const [view, setView] = useState('');

  const saveChanges = (newName, newStationObj, newLine) => {
    // Submit the state to the localStorage.
    if (!newName || !newStationObj || !newLine) {
      throw new Error("saveChanges wasn't given proper variables");
    }

    // On submit, validate the station I guess?
    localStorage.setItem('name', newName);
    localStorage.setItem('line', newLine);
    localStorage.setItem('stationObj', JSON.stringify(newStationObj));
    setName(newName);
    setLine(newLine);
    setStationObj(newStationObj);
    setView('main');
  };

  useEffect(() => {
    // On first load check if we have data. If we don't have any data, show welcome view. If we do, show mainView.
    const checkStorage = key => localStorage.getItem(key) || '';
    const newName = checkStorage('name');
    const newLine = checkStorage('line');
    const newStationObj = JSON.parse(checkStorage('stationObj') || '{}');
    setName(newName);
    setLine(newLine);
    setStationObj(newStationObj);
    if (newName && newStationObj && newLine) {
      setView('main');
    } else setView('welcome');
  }, []);

  // General parent stylings setting the header img, fonts, bg color.
  return (
    <div className={CSS.App}>
      <header className={CSS.imgContainer}>
        <img src={SunAndClouds} className={CSS.headerImg} alt="Sun And Clouds" />
      </header>
      <div className={CSS.content}>
        {view === 'welcome' && <WelcomeView saveChanges={saveChanges} />}
        {view === 'main' && <MainView name={name} stationObj={stationObj} line={line} gotoOptions={() => setView('options')} />}
        {view === 'options' && <OptionsView name={name} stationObj={stationObj} line={line} saveChanges={saveChanges} />}
      </div>
    </div>
  );
}

export default App;
