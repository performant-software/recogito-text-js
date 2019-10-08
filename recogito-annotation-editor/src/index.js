import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import Emitter from 'tiny-emitter';
import TextAnnotation from 'recogito-text-highlights/annotation/text/TextAnnotation';
import App from './App';

class Recogito {

  constructor(config) {
    this._app = React.createRef();
    this._emitter = new Emitter();

    const content = document.getElementById(config.content);
    const container = document.getElementById(config.container);

    ReactDOM.render(
      <App 
        ref={this._app}
        content={content} 
        onAnnotationCreated={a => this._emitter.emit('createAnnotation', a)} 
        onAnnotationUpdated={(a, previous)=> this._emitter.emit('updateAnnotation', a, previous)} />, container);
  }

  on = (event, handler) =>
    this._emitter.on(event, handler);

  off = (event, callback) => 
    this._emitter.off(event, callback);

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

