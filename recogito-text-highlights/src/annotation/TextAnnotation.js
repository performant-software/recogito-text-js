export default class TextAnnotation {

  constructor(annotation) {
    this._annotation = annotation;
  }

  get charOffset() {
    return this._charOffset = this._charOffset || parseInt(this._annotation.anchor.substr(12));
  }

  get quote() {
    const getQuote = () => this._annotation.bodies.find(b => {
      return b.type === 'QUOTE';
    });
    return this._quote = this._quote || getQuote().value;
  }

}