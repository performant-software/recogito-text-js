import React, { Component } from 'react';
import TextEntryField from './sections/TextEntryField';

export default class Editor extends Component {

  state = {
    text: null
  }

  // TODO clean up
  componentWillReceiveProps(props) {
    if (props.annotation) {
      const firstCommentBody = props.annotation.bodies.find(b => b.type === 'COMMENT');
      this.setState({ text: firstCommentBody ? firstCommentBody.value : null });
    } else {
      this.setState({ text: null });
    }
  }

  componentDidMount() {
    document.addEventListener('keydown', this.onKeydown, false);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.onKeydown, false);
  }

  onKeydown = evt => {
    evt.stopPropagation();
    if (evt.which === 27) // Escape
      this.props.onCancel();
  }

  onChangeText = evt => this.setState({ text: evt.target.value });

  onOk = () => {
    const updated = {
      ...this.props.annotation,
      bodies: [ 
        ...this.props.annotation.bodies.filter(b => b.type !== 'COMMENT'),
        { type: 'COMMENT', value: this.state.text }
      ]
    };

    this.setState({ text: null });
    this.props.onUpdateAnnotation(updated);
  }

  setPosition = () => {
    const { x, y, height } = this.props.bounds; 
    return { left: x, top: y + height };
  };

  render() {
    if (this.props.open) {
      const position = this.setPosition();
      return this.props.open && (
        <div
          className="r6o-editor"
          style={position} >

          <div className="arrow" />
          <div className="inner">
            <div>
              <TextEntryField 
                content={this.state.text}
                onChange={this.onChangeText}
                onOk={this.onOk} />
            </div>
            <div className="footer">
              <button 
                className="r6o-btn outline"
                onClick={this.props.onCancel}>Cancel</button>

              <button 
                className="r6o-btn "
                onClick={this.onOk}>Ok</button>
            </div>
          </div>
        </div>
      )
    } else {
      return null;
    }
  }

}