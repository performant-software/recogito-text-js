import React from 'react';
import ContentEditable from 'react-contenteditable';

/** 
 * A basic text entry field, for reuse in different 
 * section types.
 */
const TextEntryField = props => {

  const onKeyPress = evt => {
    if (evt.which === 13 && evt.ctrlKey)
      props.onOk();
  }

  return (
    <div className="r6o-section r6o-textentry">
      <ContentEditable
        className="r6o-editable-text" 
        spellCheck={false}
        data-placeholder="Add a comment..."
        html={props.content || ''}
        onKeyPress={onKeyPress}
        onChange={props.onChange} />
    </div>
  )

}

export default TextEntryField;