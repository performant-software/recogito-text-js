import React, { Component } from 'react';

import Highlighter from 'recogito-text-layer/selection/Highlighter';
import SelectionHandler from 'recogito-text-layer/selection/SelectionHandler';
import Editor from './editor/Editor';

import 'themes/theme.scss';

export default class App extends Component {

  state = {
    showEditor: false,
    selectionBounds: null,
    annotation: null
  }

  _clearState = () => {
    this.setState({
      showEditor: false,
      selectionBounds: null,
      annotation: null
    });
  }

  closeEditor = () => {
    this._clearState();
    this.selectionHandler.clearSelection();
  }

  componentDidMount() {
    this.highlighter = new Highlighter(this.props.content);
    this.selectionHandler = new SelectionHandler(this.props.content, this.highlighter);

    this.selectionHandler.on('select', this.onSelect);
    this.highlighter.init(this.props.annotations);
  }

  onSelect = evt => {
    const { selection, clientRect } = evt;
    if (selection)
      this.setState({ 
        showEditor: true, 
        selectionBounds: clientRect,
        annotation: selection 
      });
    else 
      this._clearState();
  }

  onUpdateAnnotation = annotation => {
    this.selectionHandler.clearSelection();
    this.highlighter.addOrUpdateAnnotation(annotation);
    this._clearState();
  }

  render() {
    return (
      <Editor
        open={this.state.showEditor}
        bounds={this.state.selectionBounds}
        annotation={this.state.annotation}
        onUpdateAnnotation={this.onUpdateAnnotation}
        onCancel={this.closeEditor}>
      </Editor>
    );
  }  

}