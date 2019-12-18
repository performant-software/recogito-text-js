import React, { Component } from 'react';
import Highlighter from 'recogito-text-highlights/selection/Highlighter';
import SelectionHandler from 'recogito-text-highlights/selection/SelectionHandler';
import RelationsLayer from 'recogito-relations/RelationsLayer';
import RelationEditor from 'recogito-relations/editor/RelationEditor';
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
    selectedAnnotation: null,

    showRelationEditor: false,
    selectedRelation: null
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

    this.relationsLayer = new RelationsLayer(this.props.contentEl);
    this.relationsLayer.on('createRelation', this.onEditRelation);
    this.relationsLayer.on('selectRelation', this.onEditRelation);
    this.relationsLayer.on('cancelDrawing', this.onCancelRelation);
  }

  /**************************/  
  /* Annotation CRUD events */
  /**************************/    

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

  /** Common handler for annotation CREATE or UPDATE **/
  onCreateOrUpdateAnnotation = method => (annotation, previous) => {
    // Clear the annotation layer
    this._clearState();
    
    this.selectionHandler.clearSelection();
    this.highlighter.addOrUpdateAnnotation(annotation, previous);

    // Call CREATE or UPDATE handler
    this.props[method](annotation, previous);
  }

  /** Cancel button on annotation editor **/
  onCancelAnnotation = () => {
    this._clearState();
    this.selectionHandler.clearSelection();
  }

  /************************/  
  /* Relation CRUD events */
  /************************/  

  // Shorthand
  closeRelationsEditor = () => {
    this.setState({ showRelationEditor: false });
    this.relationsLayer.resetDrawing();
  }

  /**
   * Selection on the relations layer: open an existing
   * or newly created connection for editing.
   */
  onEditRelation = relation => {
    this.setState({ 
      showRelationEditor: true,
      selectedRelation: relation
    });
  }

  /** 'Ok' on the relation editor popup **/
  onCreateOrUpdateRelation = (relation, previous) => {
    this.relationsLayer.addOrUpdateRelation(relation, previous);
    this.closeRelationsEditor();
  }

  /** 'Delete' on the relation editor popup **/
  onDeleteRelation = relation => {
    this.relationsLayer.removeRelation(relation);
    this.closeRelationsEditor();
  }

  /****************/               
  /* External API */
  /****************/    

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
    this.relationsLayer.init(annotations);
  }

  setMode = mode => {
    if (mode === 'RELATIONS') {
      this.setState({ showEditor: false });
      this.selectionHandler.enabled = false;
      this.relationsLayer.startDrawing();
    } else {
      this.setState({ showRelationEditor: false });
      this.selectionHandler.enabled = true;
      this.relationsLayer.stopDrawing();
    }
  }

  render() {
    return (
      <>
        { this.state.showEditor &&
          <Editor
            open={this.state.showEditor}
            readOnly={this.props.readOnly}
            bounds={this.state.selectionBounds}
            containerEl={this.props.containerEl}
            annotation={this.state.selectedAnnotation}
            onAnnotationCreated={this.onCreateOrUpdateAnnotation('onAnnotationCreated')}
            onAnnotationUpdated={this.onCreateOrUpdateAnnotation('onAnnotationUpdated')}
            onCancel={this.onCancelAnnotation} 
          />
        }

        { this.state.showRelationEditor && 
          <RelationEditor 
            relation={this.state.selectedRelation}
            onRelationUpdated={this.onCreateOrUpdateRelation}
            onRelationDeleted={this.onDeleteRelation}
            onCancel={this.closeRelationsEditor}
          /> 
        }
      </>
    );
  }  

}