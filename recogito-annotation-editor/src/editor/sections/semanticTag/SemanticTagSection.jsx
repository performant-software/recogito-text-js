import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShareAltSquare } from '@fortawesome/free-solid-svg-icons'

export default class SemanticTagSection extends Component {

  render() {
    return (
      <div className="r6o-section semantic-tag">
        <span className="icon">
          <FontAwesomeIcon icon={faShareAltSquare} />
        </span>

        <input placeholder={this.props.quote} />
      </div>
    )
  }

}