import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import TextAnnotation from 'recogito-text-highlights/annotation/text/TextAnnotation';
import App from './App';

class Recogito {

  constructor(config) {
    this._app = React.createRef();

    const content = document.getElementById(config.content);
    const container = document.getElementById(config.container);

    ReactDOM.render(
      <App 
        ref={this._app}
        content={content} />, container);
  }

  on = (event, handler) => {
    // console.log(`TODO: add ${event} handler`);
  }

  loadAnnotations = url => {
    return axios.get(url).then(response => {
      const annotations = response.data.map(a => new TextAnnotation(a));
      this._app.current.setAnnotations(annotations);
    });
  }

}

export const init = config => {
  return new Recogito(config);
}

