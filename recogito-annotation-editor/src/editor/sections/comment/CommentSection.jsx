import React, { Component } from 'react';
import TextEntryField from '../TextEntryField';

/** Sections map a specific WebAnno body type to a GUI component **/
export default class CommentSection extends Component {

  onChange = evt =>
    this.props.onChange({ type: 'TextualBody', value: evt.target.value.trim() });

  render() {
    return(
      <TextEntryField 
        content={this.props.body.value} 
        onChange={this.onChange} 
        onOk={this.props.onOk} />
    )
  }

}