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
    this.highlighter = new Highlighter(this.props.contentEl, this.props.formatter);
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

  /** Common handler for annotation CREATE or UPDATE **/
  handleCreateOrUpdate = method => (annotation, previous) => {
    // Clear the annotation layer
    this.selectionHandler.clearSelection();
    this.highlighter.addOrUpdateAnnotation(annotation, previous);
    this._clearState();

    // Call CREATE or UPDATE handler
    this.props[method](annotation, previous);
  }

  /******************/               
  /*  External API  */
  /******************/    

  addAnnotation = annotation => {
    this.highlighter.addOrUpdateAnnotation(annotation);
  }

  removeAnnotation = annotation => {
    this.highlighter.removeAnnotation(annotation);

    // If the editor is currently open on this annotation, close it
    const { selectedAnnotation } = this.state;
    if (selectedAnnotation && annotation.isEqual(selectedAnnotation))
      this.setState({ showEditor: false });
  }

  setAnnotations = annotations => {
    this.highlighter.init(annotations);
  }

  render() {
    return (
      <Editor
        open={this.state.showEditor}
        readOnly={this.props.readOnly}
        bounds={this.state.selectionBounds}
        containerEl={this.props.containerEl}
        annotation={this.state.selectedAnnotation}
        onAnnotationCreated={this.handleCreateOrUpdate('onAnnotationCreated')}
        onAnnotationUpdated={this.handleCreateOrUpdate('onAnnotationUpdated')}
        onCancel={this.handleCancel}>
      </Editor>
    );
  }  

}