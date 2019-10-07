import React, { Component } from 'react';
import VisibilitySensor from 'react-visibility-sensor/visibility-sensor';
import CommentSection from './sections/comment/CommentSection';

const SECTIONS = {
  TextualBody: CommentSection
}

export default class Editor extends Component {

  constructor(props) {
    super(props);
    this.state = {
      sections: this._createBodyState(this.props)
    }
  }

  // State consists of a tuple (original body, current state)
  _createBodyState = props =>
    props.annotation ? 
      props.annotation.bodies.map(body => ({ body, current: { ...body } })) : [];

  componentWillReceiveProps(props) {
    if (props.annotation)
      this.setState({ sections: this._createBodyState(props) });
    else 
      this.setState({ sections: [] });
  }

  // Key listeners for Escape
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

  // Section update keeps original body, updates current
  onSectionChanged = idx => updated => {
    const nextState = {
      body: this.state.sections[idx].body,
      current: updated
    }

    this.setState({ sections: Object.assign([], this.state.sections, { [idx]: nextState })} );
  }

  onOk = () => {
    const updated = this.props.annotation.clone();
    updated.bodies = this.state.sections.map(s => s.current);
    this.props.onUpdateAnnotation(updated, this.props.annotation);
  }

  setPosition = clippedBounds => {
    if (!clippedBounds) {
      const { x, y, height } = this.props.bounds; 
      return { left: x + window.scrollX, top: y + height + window.scrollY };
    } else {
      // Default bounds are clipped - flip horizontally
      if (clippedBounds.right > window.innerWidth) {
        this._ref.classList.add('align-right');
        this._ref.style.left = `${this.props.bounds.right - clippedBounds.width + window.scrollX}px`;
      }

      // Flip vertically
      if (clippedBounds.bottom > window.innerHeight) {
        this._ref.classList.add('align-bottom');
        this._ref.style.top = 'auto';
        this._ref.style.bottom = `${window.innerHeight - this.props.bounds.top - window.scrollY}px`;
      }
    }
  };

  onVisible = fullyVisible => {
    if (!fullyVisible)
      this.setPosition(this._ref.getBoundingClientRect());
  }

  render() {
    if (this.props.open) {
      const position = this.setPosition();

      const sections = this.props.annotation.bodies.reduce((components, body, idx) => {
        const cls = SECTIONS[body.type];
        const component = React.createElement(cls, {
          key: idx,
          body: this.state.sections[idx].current, 
          onChange: this.onSectionChanged(idx), 
          onOk: this.onOk
        });

        return cls ? [ ...components, component ] : component;
      }, []);

      return this.props.open && (
        <VisibilitySensor onChange={this.onVisible}>
          <div
            ref={el => this._ref = el}
            className="r6o-editor"
            style={position} >

            <div className="arrow" />
            <div className="inner">
              <div>
                {  sections }
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
        </VisibilitySensor>
      )
    } else {
      return null;
    }
  }

}