import WebAnnotation from '../annotation/WebAnnotation';

/**
 * An "annotation in draft mode". Really the same
 * data structure, but as a separate class so we can
 * tell things apart properly.
 */
export default class Selection {

  constructor(selectors) {
    this._stub = {
      type: 'Selection',
      body: [{
        type: 'TextualBody'
      }],
      target: {
        selector: selectors
      }
    }
  }

  get type() {
    return this._stub.type;
  }

  get body() {
    return this._stub.body;
  }

  get target() {
    return this._stub.target;
  }

  /** For consistency with WebAnnotation **/
  get bodies() {
    return this._stub.body;
  }

  /*******************************************/ 
  /* Selection-specific properties & methods */
  /*******************************************/

  get isSelection() {
    return true;
  }

  toAnnotation = () => {
    const a = Object.assign({
      '@context': 'http://www.w3.org/ns/anno.jsonld',
      'type': 'Annotation'
    }, this._stub, {})

    return new WebAnnotation(a);
  }

}