import Bounds from './Bounds';
import TagHandle from './TagHandle';
import CONST from './SVGConst';

/** 
 * Fetches annotation & DOM elements based on the given
 * annotation ID.
 */
const getNode = function(contentEl, annotationId) {
  const elements = contentEl.querySelectorAll(`*[data-id="${annotationId}"]`);
  return (elements.length > 0) ? 
    { annotation: elements[0].annotation, elements: Array.from(elements) } : null;
};

export default class Connection {

  constructor(contentEl, svgEl, nodeOrAnnotation) {

    this.svgEl = svgEl;

    // SVG elements
    this.path = document.createElementNS(CONST.NAMESPACE, 'path'),
    this.startDot = document.createElementNS(CONST.NAMESPACE, 'circle'),
    this.endDot = document.createElementNS(CONST.NAMESPACE, 'circle'),

    svgEl.appendChild(this.path);
    svgEl.appendChild(this.startDot);
    svgEl.appendChild(this.endDot);

    // TODO conditional init from annotation or interactive drawing

    const props = this.initFromAnnotation(contentEl, svgEl, nodeOrAnnotation);

    // 'Descriptive' instance properties
    this.fromNode = props.fromNode;
    this.fromBounds = props.fromBounds;

    this.toNode = props.toNode;
    this.toBounds = props.toBounds;

    this.currentEnd = props.currentEnd;

    this.handle = props.handle;

    this.floating = props.floating;
    this.stored = props.stored;

    this.redraw();
  }

    /** Initializes a fixed connection from a relation **/
  initFromAnnotation = function(contentEl, svgEl, annotation) {
    const [ fromId, toId ] = annotation.target.map(t => t.id);
    const relation = annotation.bodies[0].value; // Temporary hack

    const fromNode = getNode(contentEl, fromId);
    const fromBounds = new Bounds(fromNode.elements, svgEl);

    const toNode = getNode(contentEl, toId);
    const toBounds = new Bounds(toNode.elements, svgEl);

    const currentEnd = toNode;

    const handle = new TagHandle(relation, svgEl);

    const floating = false;
    const stored = true;

    return { fromNode, fromBounds, toNode, toBounds, currentEnd, handle, floating, stored };
  }

  /**
   * A Floating connection is not fixed to a target node.
   */
  get isFloating() {
    return this.floating;
  }

  /** End XY coordinates **/
  get endXY() {
    return (this.currentEnd instanceof Array) ?
      this.currentEnd : 
        (this.fromBounds.top > this.toBounds.top) ?
          this.toBounds.bottomHandleXY : this.toBounds.topHandleXY;
  }

  /** 
   * Fixes the end of the connection to the current end node,
   * if it is currently floating.
   */
  fix = function() {
    if (this.currentEnd.elements)
      this.floating = false;
  }

  get isStored() {
    return this.stored;
  }

  set isStored(stored) {
    this.stored = stored;
  }

  /** Redraws this connection **/
  redraw = function() {
    if (this.currentEnd) {
      const end = this.endXY;

      const startsAtTop = end[1] <= (this.fromBounds.top + this.fromBounds.height / 2);
      const start = (startsAtTop) ?
        this.fromBounds.topHandleXY : this.fromBounds.bottomHandleXY;

      const deltaX = end[0] - start[0];
      const deltaY = end[1] - start[1];

      const half = (Math.abs(deltaX) + Math.abs(deltaY)) / 2; // Half of length, for middot pos computation
      const midX = (half > Math.abs(deltaX)) ? start[0] + deltaX : start[0] + half * Math.sign(deltaX);

      let midY; // computed later

      const orientation = (half > Math.abs(deltaX)) ?
        (deltaY > 0) ? 'down' : 'up' :
        (deltaX > 0) ? 'right' : 'left';

      const d = CONST.LINE_DISTANCE - CONST.BORDER_RADIUS; // Shorthand: vertical straight line length

      // Path that starts at the top edge of the annotation highlight
      const compileBottomPath = function() {
        const arc1 = (deltaX > 0) ? CONST.ARC_9CC : CONST.ARC_3CW;
        const arc2 = (deltaX > 0) ? CONST.ARC_0CW : CONST.ARC_0CC;

        midY = (half > Math.abs(deltaX)) ?
          start[1] + half - Math.abs(deltaX) + CONST.LINE_DISTANCE :
          start[1] + CONST.LINE_DISTANCE;

        return 'M' + start[0] +
                ' ' + start[1] +
                'v' + d +
                arc1 +
                'h' + (deltaX - 2 * Math.sign(deltaX) * CONST.BORDER_RADIUS) +
                arc2 +
                'V' + end[1];
      };

      // Path that starts at the bottom edge of the annotation highlight
      const compileTopPath = function() {
        const arc1 = (deltaX > 0) ? CONST.ARC_9CW : CONST.ARC_3CC;
        const arc2 = (deltaX > 0) ?
          (deltaY >= 0) ? CONST.ARC_0CW : CONST.ARC_6CC :
          (deltaY >= 0) ? CONST.ARC_0CC : CONST.ARC_6CW;

        midY = (half > Math.abs(deltaX)) ?
          start[1] - (half - Math.abs(deltaX)) - CONST.LINE_DISTANCE :
          start[1] - CONST.LINE_DISTANCE;

        return 'M' + start[0] +
                ' ' + start[1] +
                'v-' + (CONST.LINE_DISTANCE - CONST.BORDER_RADIUS) +
                arc1 +
                'h' + (deltaX - 2 * Math.sign(deltaX) * CONST.BORDER_RADIUS) +
                arc2 +
                'V' + end[1];
      };

      this.startDot.setAttribute('cx', start[0]);
      this.startDot.setAttribute('cy', start[1]);
      this.startDot.setAttribute('r', 2);
      this.startDot.setAttribute('class', 'start');

      this.endDot.setAttribute('cx', end[0]);
      this.endDot.setAttribute('cy', end[1]);
      this.endDot.setAttribute('r', 2);
      this.endDot.setAttribute('class', 'end');

      if (startsAtTop) 
        this.path.setAttribute('d', compileTopPath());
      else 
        this.path.setAttribute('d', compileBottomPath());

      this.path.setAttribute('class', 'connection');

      this.currentMidXY = [ midX, midY ];

      if (this.handle)
        this.handle.setPosition(this.currentMidXY, orientation);
    }
  }

};

