import React, { Component } from 'react';

import Highlighter from 'recogito-text-highlights/selection/Highlighter';
import SelectionHandler from 'recogito-text-highlights/selection/SelectionHandler';
import Editor from './editor/Editor';

import 'themes/theme.scss';

export default class App extends Component {

  state = {
    showEditor: false,
    selectionBounds: null,
    selectedAnnotation: null
  }

  _clearState = () => {
    this.setState({
      showEditor: false,
      selectionBounds: null,
      selectedAnnotation: null
    });
  }

  setAnnotations = annotations => {
    this.highlighter.init(annotations);
  }

  closeEditor = () => {
    this._clearState();
    this.selectionHandler.clearSelection();
  }

  componentDidMount() {
    this.highlighter = new Highlighter(this.props.content);
    this.selectionHandler = new SelectionHandler(this.props.content, this.highlighter);
    this.selectionHandler.on('select', this.onSelect);
  }

  onSelect = evt => {
    const { selection, clientRect } = evt;
    if (selection)
      this.setState({ 
        showEditor: true, 
        selectionBounds: clientRect,
        selectedAnnotation: selection 
      });
    else 
      this._clearState();
  }

  onUpdateAnnotation = (annotation, maybePrevious) => {
    this.selectionHandler.clearSelection();
    this.highlighter.addOrUpdateAnnotation(annotation, maybePrevious);
    this._clearState();
  }

  render() {
    return (
      <Editor
        open={this.state.showEditor}
        bounds={this.state.selectionBounds}
        annotation={this.state.selectedAnnotation}
        onUpdateAnnotation={this.onUpdateAnnotation}
        onCancel={this.closeEditor}>
      </Editor>
    );
  }  

}