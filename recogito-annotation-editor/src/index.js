import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

class Recogito {

  constructor(config) {
    const content = document.getElementById(config.content);
    const container = document.getElementById(config.container);

    ReactDOM.render(
      <App 
        content={content}
        annotations={config.annotations} />, container);
  }

  on = (event, handler) => {
    console.log(`TODO: add ${event} handler`);
  }

}

export const init = config => {
  return new Recogito(config);
}

