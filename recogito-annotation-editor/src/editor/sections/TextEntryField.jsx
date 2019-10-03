import React, { Component } from 'react';
import ContentEditable from 'react-contenteditable';

export default class TextEntryField extends Component {

  onKeyPress = evt => {
    if (evt.which === 13 && evt.ctrlKey) {
      this.props.onOk();
    }
  }

  render() {
    return (
      <div className="r6o-section r6o-textentry">
        <ContentEditable
          className="r6o-editable-text" 
          spellCheck={false}
          data-placeholder="Add a comment..."
          html={this.props.content || ''}
          onKeyPress={this.onKeyPress}
          onChange={this.props.onChange} />
      </div>
    )
  }

}