import React, { useState, useEffect } from 'react';
import SunAndClouds from '../assets/images/sunny-day.png';
import CSS from '../css/App.module.css';

import NetworkDialogue from './reusables/NetworkDialogue';
import WelcomeView from './views/WelcomeView';
import MainView from './views/MainView';
import SettingsView from './views/SettingsView';

function App() {
  const [stationObj, setStationObj] = useState('');
  const [name, setName] = useState('');
  const [line, setLine] = useState('');
  const [view, setView] = useState('');

  const [networkIssue, setNetworkIssue] = useState('');

  // BUG: Occasionally this won't adhere to tries and instead retry infinitely
  const networkRetry = (tries, cb, ...params) => {
    if (tries === 0) {
      setNetworkIssue('Tries exceeded, try reloading?');
      return false;
    }

    return new Promise(res => {
      console.log(`Retrying network, attempt: ${tries}`);
      if (navigator.onLine) {
        fetch(`${process.env.REACT_APP_API_URL}/api/stopInfo/115`)
          .then(({ status }) => {
            if (status !== 200) throw new Error('Server Error');
            // Otherwise if we're back online invoke the cb and undo errors.
            if (cb) cb(...params);
            res(status);
            setNetworkIssue('');
          })
          .catch(() => {
            if (networkIssue !== 'Server Down') setNetworkIssue('Server Down');
            // If sill offline, wait 10 seconds and try again.
            setTimeout(() => networkRetry(tries - 1, cb, ...params), 10000);
          });
      } else {
        if (!networkIssue) setNetworkIssue('Internet down');
        setTimeout(() => networkRetry(tries - 1, cb, ...params), 10000);
      }
    });
  };

  // When invoked, check if the user is online. If they are, check if the server is online.
  const networkError = (msg, retry, cb, ...params) => {
    if (!retry || networkIssue) {
      // Using this for rate limit, but it's usable for other things.
      setNetworkIssue(msg);
    } else if (retry) {
      // If requested to retry, send to async network retry system.
      networkRetry(5, cb, ...params);
    }
  };

  const saveChanges = (newName, newStationObj, newLine) => {
    // Submit the state to the localStorage.
    if (!newStationObj || !newLine) {
      throw new Error("saveChanges wasn't given proper variables");
    }

    localStorage.setItem('stationObj', JSON.stringify(newStationObj));
    localStorage.setItem('name', newName);
    localStorage.setItem('line', newLine);
    setStationObj(newStationObj);
    setName(newName);
    setLine(newLine);
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
    if (newStationObj && newLine) {
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
        <NetworkDialogue message={networkIssue} />
        {view === 'welcome' && <WelcomeView saveChanges={saveChanges} networkError={networkError} />}
        {view === 'main' && (
          <MainView
            name={name}
            stationObj={stationObj}
            line={line}
            networkError={networkError}
            gotoSettings={() => setView('settings')}
          />
        )}
        {view === 'settings' && (
          <SettingsView
            initData={{
              name,
              stationObj,
              line
            }}
            networkError={networkError}
            saveChanges={saveChanges}
          />
        )}
      </div>
    </div>
  );
}
export default App;
