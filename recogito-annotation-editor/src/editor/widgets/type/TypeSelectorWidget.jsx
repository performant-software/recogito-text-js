import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { faStar } from '@fortawesome/free-solid-svg-icons';

/** 
 * The basic Place/Person/Event selector from original Recogito
 */
const TypeSelectorWidget = props => {

  const onSelect = type => event => {
    props.onSelect && props.onSelect(type);
  }

  return (
    <div className="type-selector">
      <div className="type place" onClick={onSelect('PLACE')}>
        <FontAwesomeIcon className="icon" icon={faMapMarkerAlt} /> Place
      </div>

      <div className="type person" onClick={onSelect('PERSON')}>
        <FontAwesomeIcon className="icon" icon={faUser} /> Person
      </div>

      <div className="type event" onClick={onSelect('EVENT')}>
        <FontAwesomeIcon className="icon" icon={faStar} /> Event
      </div>
    </div>
  )

}

export default TypeSelectorWidget;