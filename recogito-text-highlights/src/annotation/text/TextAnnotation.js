import WebAnnotation from '../WebAnnotation';

export default class TextAnnotation extends WebAnnotation {

  constructor(annotation) {
    super(annotation);
  }

  clone() {
    return new TextAnnotation(Object.assign({}, this._annotation));
  }

  _getSelector = type => {
    return this._annotation.target.selector.find(t => t.type === type);
  }

  get quote() {
    return this._quote = this._quote || this._getSelector('TextQuoteSelector').exact;
  }

  get start() {
    return this._start = this._start || this._getSelector('TextPositionSelector').start;
  }

  get end() {
    return this._end = this._end || this._getSelector('TextPositionSelector').end;
  }

}