export default class WebAnnotation {

  constructor(annotation) {
    this._annotation = annotation;
  }

  clone() {
    return new WebAnnotation(Object.assign({}, this._annotation));
  }

  get id() {
    return this._annotation.id; 
  }

  get bodies() {
    return this._annotation.body;
  }

  set bodies(bodies) {
    this._annotation.body = bodies;
  }

  get target() {
    return this._annotation.target;
  }

}