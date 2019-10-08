import React, { Component } from 'react';
import Highlighter from 'recogito-text-highlights/selection/Highlighter';
import SelectionHandler from 'recogito-text-highlights/selection/SelectionHandler';
import Editor from './editor/Editor';

import 'themes/theme.scss';

/**
 * Pulls the strings between the annotation highlight layer
 * and the editor popup.
 */
export default class App extends Component {

  state = {
    showEditor: false,
    selectionBounds: null,
    selectedAnnotation: null
  }

  /** Helper **/
  _clearState = () => {
    this.setState({
      showEditor: false,
      selectionBounds: null,
      selectedAnnotation: null
    });
  }

  componentDidMount() {
    this.highlighter = new Highlighter(this.props.contentEl);
    this.selectionHandler = new SelectionHandler(this.props.contentEl, this.highlighter);
    this.selectionHandler.on('select', this.handleSelect);
  }

  /** Selection on the text **/
  handleSelect = evt => {
    const { selection, clientRect } = evt;
    if (selection) {
      this.setState({ 
        showEditor: true, 
        selectionBounds: clientRect,
        selectedAnnotation: selection 
      });
    } else {
      this._clearState();
    }
  }

  /** Cancel button on editor **/
  handleCancel = () => {
    this._clearState();
    this.selectionHandler.clearSelection();
  }

  /** TODO proper & explicit separation between CREATE and UPDATE **/
  handleUpdateAnnotation = (annotation, previous) => {
    this.selectionHandler.clearSelection();
    this.highlighter.addOrUpdateAnnotation(annotation, previous);
    this._clearState();

    if (previous.id) // ugly hack - temporary only
      this.props.onAnnotationUpdated(annotation, previous);
    else 
      this.props.onAnnotationCreated(annotation);
  }

  /******************/               
  /*  External API  */
  /******************/    

  setAnnotations = annotations => {
    this.highlighter.init(annotations);
  }

  render() {
    return (
      <Editor
        open={this.state.showEditor}
        bounds={this.state.selectionBounds}
        containerEl={this.props.containerEl}
        annotation={this.state.selectedAnnotation}
        onUpdateAnnotation={this.handleUpdateAnnotation}
        onCancel={this.handleCancel}>
      </Editor>
    );
  }  

}