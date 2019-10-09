import React, { Component } from 'react';
import CommentSection from './sections/comment/CommentSection';

/** Maps WebAnno body types to section implementation classes **/
const SECTIONS = {
  TextualBody: CommentSection
}

/** 
 * The editor popup GUI component.
 */
export default class Editor extends Component {

  constructor(props) {
    super(props);

    this.state = {
      sections: this._createBodyState(this.props)
    }
  }

  /** The state is a list of tuples (original body vs. current state) **/
  _createBodyState = props => {
    return props.annotation ? props.annotation.bodies.map(body => ({ body, current: { ...body } })) : [];
  }

  /** On load, create the derived state from the props **/
  componentWillReceiveProps(props) {
    if (props.annotation)
      this.setState({ sections: this._createBodyState(props) });
    else 
      this.setState({ sections: [] });
  }

  /** Add key listeners, so we can close on Escape **/
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

  /**
   * Will be triggered AFTER each call to 'render'. If the call
   * attached an editor popup, there will be an element reference 
   * in this._ref, and we can call this.setPosition. 
   * 
   * If the render call closed the popup, this._ref will be null.
   */
  componentDidUpdate() {
    if (this._ref)
      this.setPosition();
  }

  /** 
   * Sets the position of the popup element, flipping its
   * orientation if necessary.
   */
  setPosition = () => {
    // Container element offset
    const { offsetLeft, offsetTop, clientHeight } = this.props.containerEl;
    const { scrollX, scrollY } = window;

    // Re-set orientation class
    this._ref.className = 'r6o-editor';

    // Default orientation
    const { x, y, height, top } = this.props.bounds; 
    this._ref.style.top = `${y + height + scrollY - offsetLeft}px`;
    this._ref.style.left = `${x + scrollX - offsetTop}px`;

    const defaultOrientation = this._ref.getBoundingClientRect();

    if (defaultOrientation.right > window.innerWidth) {
      // Default bounds clipped - flip horizontally
      this._ref.classList.add('align-right');
      this._ref.style.left = `${this.props.bounds.right - defaultOrientation.width + scrollX - offsetLeft}px`;
    }

    if (defaultOrientation.bottom > window.innerHeight) {
      // Flip vertically
      const annotationTop = top + scrollY; // Annotation top relative to parents
      const containerBounds = this.props.containerEl.getBoundingClientRect();
      const containerHeight = containerBounds.height + containerBounds.top + scrollY;
      
      this._ref.classList.add('align-bottom');
      this._ref.style.top = 'auto';
      this._ref.style.bottom = `${containerHeight - annotationTop}px`;
    }
  }

  /** Handles an update to one of the sections/annotation bodies **/
  handleSectionChanged = idx => updated => {
    const nextState = {
      body: this.state.sections[idx].body,
      current: updated
    }

    this.setState({ sections: Object.assign([], this.state.sections, { [idx]: nextState })} );
  }

  /** Handles OK button **/
  handleOk = () => {
    // props.annotation is either a selection (if it was created from scratch
    // just now) or an annotation (if it existed already and was opened for 
    // editing)
    if (this.props.annotation.isSelection) {
      const annotation = this.props.annotation.toAnnotation();
      annotation.bodies = this.state.sections.map(s => s.current);
      this.props.onAnnotationCreated(annotation);
    } else {
      const updated = this.props.annotation.clone();
      updated.bodies = this.state.sections.map(s => s.current);
      this.props.onAnnotationUpdated(updated, this.props.annotation);  
    }
  }

  /**
   * Renders the list of sections, based on the annotation bodies for 
   * which we have section implementations available.
   */
  renderSections = () => {
    return this.props.annotation.bodies.reduce((components, body, idx) => {
      const impl = SECTIONS[body.type];

      if (impl) {
        const component = React.createElement(impl, {
          key: idx,
          readOnly: this.props.readOnly,
          body: this.state.sections[idx].current, 
          onChange: this.handleSectionChanged(idx), 
          onOk: this.handleOk
        });

        return [...components, component];
      } else {
        console.log(`Unsupported body type: ${body.type}`);
        return components;
      }
    }, []);
  }

  render() {
    return this.props.open && (
      <div
        ref={el => this._ref = el}
        className="r6o-editor">

        <div className="arrow" />
        <div className="inner">
          <div>
            {  this.renderSections() }
          </div>
          { this.props.readOnly ? (
            <div className="footer">
              <button
                className="r6o-btn" 
                onClick={this.props.onCancel}>Close</button>
            </div>
          ) : (
            <div className="footer">
              <button 
                className="r6o-btn outline"
                onClick={this.props.onCancel}>Cancel</button>
  
              <button 
                className="r6o-btn "
                onClick={this.handleOk}>Ok</button>
            </div>
          )}
        </div>
      </div>
    )
  }

}