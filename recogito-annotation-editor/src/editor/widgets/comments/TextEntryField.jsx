import React, { Component } from 'react';
import ContentEditable from 'react-contenteditable';

/** 
 * A basic text entry field, for reuse in different 
 * section types.
 * 
 * Note that react-contenteditable has compatibility
 * issues with hooks, hence we need to make this
 * a class Component.
 */
export default class TextEntryField extends Component {

  onKeyDown = evt => {
    if (evt.which === 13 && evt.ctrlKey)
      this.props.onOk();
  }

  onRender = ref => {
    if (ref && this.props.editable)
      ref.focus();
  }

  render() {
    return (
      <ContentEditable
        innerRef={this.onRender}
        className="r6o-editable-text" 
        html={this.props.content}
        data-placeholder="Add a comment..."
        disabled={!this.props.editable}
        onChange={evt => this.props.onChange(evt)}
        onKeyDown={this.onKeyDown} />
    )
  }

} 