import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { faStar } from '@fortawesome/free-solid-svg-icons';

/** 
 * The basic Place/Person/Event selector from original Recogito
 */
const TypeSelector = props => {

  return (
    <div className="type-selector">
      <div className="type place">
        <FontAwesomeIcon icon={faMapMarkerAlt} /> Place
      </div>

      <div className="type person">
        <FontAwesomeIcon icon={faUser} /> Person
      </div>

      <div className="type event">
        <FontAwesomeIcon icon={faStar} /> Event
      </div>
    </div>
  )

}

export default TypeSelector;