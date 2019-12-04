import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { CSSTransition } from 'react-transition-group';

/** 
 * The basic freetext tag control from original Recogito
 */
const TagWidget = props => {
  const [ showDelete, setShowDelete ] = useState(false);
  const [ newTag, setNewTag ] = useState('');

  const tagBodies = props.annotation ? 
    props.annotation.bodies.filter(b => b.purpose === 'tagging') : [];

  const toggle = tag => _ => {
    if (showDelete === tag)
      setShowDelete(false);
    else 
      setShowDelete(tag);
  }

  const handleDelete = tag => evt => { 
    evt.stopPropagation();
    props.onRemoveTag(tag);
  }

  const handleKeyDown = evt => {
    if (evt.which === 13) { // Enter
      props.onAddTag({ type: 'TextualBody', purpose: 'tagging', value: newTag.trim() });
      setNewTag('');
    }
  }

  return (
    <div className="tags">
      <ul>
        { tagBodies.map(tag => 
          <li key={tag.value} onClick={toggle(tag.value)}>
            <span className="label">{tag.value}</span>

            <CSSTransition in={showDelete === tag.value} timeout={100} classNames="delete">
              <span className="delete-wrapper" onClick={handleDelete(tag)}>
                <span className="delete">
                  <FontAwesomeIcon className="icon" icon={faTrash} />
                </span>
              </span>
            </CSSTransition>
          </li>
        )}
      </ul>
      <input 
        type="text" 
        value={newTag} 
        onChange={evt => setNewTag(evt.target.value)} 
        onKeyDown={handleKeyDown}
        placeholder="Add tag..." />
    </div>
  )

};

export default TagWidget;