import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';

const annotations = require('../public/annotations.json');

const content = document.getElementById('content');
const container = document.getElementById('app');

ReactDOM.render(
  <App 
    content={content}
    annotations={annotations} />, container);