import React, { Component } from 'react';
import TextEntryField from '../TextEntryField';

/** 
 * Sections map a specific WebAnno body type to a GUI 
 * component.
 * 
 * This section represents a comment field, based on a
 * WebAnno TextualBody type.
 * 
 * TEMPORARY ONLY!
 * 
 * TODO implement an actual comment field, like in Recogito,
 * with an 'Edit' button that makes the field editable.
 * Right now, the CommentSection just wraps a TextEntryField.
 */
export default class CommentSection extends Component {

  onChange = evt => {
    this.props.onChange({ type: 'TextualBody', value: evt.target.value.trim() });
  }

  render() {
    return(
      <TextEntryField 
        content={this.props.body.value} 
        onChange={this.onChange} 
        onOk={this.props.onOk} />
    )
  }

}