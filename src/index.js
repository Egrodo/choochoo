import React from 'react';
import ReactDOM from 'react-dom';
import 'normalize.css';
import App from './components/App';

require('dotenv').config({ path: '../.env' });

ReactDOM.render(<App />, document.getElementById('root'));
