import TextAnnotation from '../annotation/WebAnnotation';

const TEXT = 3; // HTML DOM node type for text nodes

export default class Highlighter {

  constructor(element, formatter) {
    this.el = element;
    this.formatter = formatter;
  }

  init = annotations => {
    // Even if there's only one text element, browsers may split them up 
    // into multiple nodes
    const textNodes = 
      // Need to convert NodeList to plain array, so we can reduce
      Array.prototype.slice.call(this.el.childNodes).reduce((nodes, n) => {
        const startOffset = nodes.length > 0 ? nodes[nodes.length - 1].start : 0;
        const charLength = n.textContent.length;

        const props = { 
          node: n, 
          start: startOffset, 
          end: startOffset + charLength 
        };

        return [...nodes, props];
      }, []);

    annotations.forEach(annotation => this._addAnnotation(annotation));
  }

  _addAnnotation = annotation => {
    const [ domStart, domEnd ] = this.charOffsetsToDOMPosition([ annotation.start, annotation.end ]);

    const range = document.createRange();
    range.setStart(domStart.node, domStart.offset);
    range.setEnd(domEnd.node, domEnd.offset);
    
    const spans = this.wrapRange(range);
    this.applyStyles(annotation, spans);
    this.bindAnnotation(annotation, spans);
  }

  addOrUpdateAnnotation = (annotation, maybePrevious) => {
    // TODO just a hack for now, until we figure out how to handle IDs in the new system
    const allAnnotationSpans = document.querySelectorAll('.annotation');
    const spansForThisAnnotation = maybePrevious ? Array.prototype.slice.call(allAnnotationSpans)
      .filter(span => span.annotation === maybePrevious) : [];

    if (spansForThisAnnotation.length > 0) {
      spansForThisAnnotation.forEach(span => span.annotation = annotation);
    } else {
      this._addAnnotation(annotation);
    }
  }

  applyStyles = (annotation, spans) => {
    const extraClasses = this.formatter ? this.formatter(annotation) : '';
    spans.forEach(span => span.className = `annotation ${extraClasses}`.trim());
  }

  bindAnnotation = (annotation, elements) => {
    elements.forEach(el => {
      el.annotation = annotation;
      if (annotation.id)
        el.dataset.id = annotation.id;
    });
  }

  walkTextNodes = (node, stopOffset, nodeArray) => {
    const nodes = (nodeArray) ? nodeArray : [];

    const offset = (function() {
          var runningOffset = 0;
          nodes.forEach(function(node) {
            runningOffset += node.textContent.length;;
          });
          return runningOffset;
        })();

    let keepWalking = true;

    if (offset > stopOffset)
      return false;

    if (node.nodeType === TEXT)
      nodes.push(node);

    node = node.firstChild;

    while(node && keepWalking) {
      keepWalking = this.walkTextNodes(node, stopOffset, nodes);
      node = node.nextSibling;
    }

    return nodes;
  }

  charOffsetsToDOMPosition = charOffsets => {
    const maxOffset = Math.max.apply(null, charOffsets);

    const textNodeProps = (() => {
      let start = 0;
      return this.walkTextNodes(this.el, maxOffset).map(function(node) {
        var nodeLength = node.textContent.length,
            nodeProps = { node: node, start: start, end: start + nodeLength };

        start += nodeLength;
        return nodeProps;
      });
    })();

    return this.calculateDomPositionWithin(textNodeProps, charOffsets);
  }

  /**
   * Given a rootNode, this helper gets all text between a given
   * start- and end-node. Basically combines walkTextNodes (above)
   * with a hand-coded dropWhile & takeWhile.
   */
  textNodesBetween = (startNode, endNode, rootNode) => {
    // To improve performance, don't walk the DOM longer than necessary
    var stopOffset = (function() {
          var rangeToEnd = document.createRange();
          rangeToEnd.setStart(rootNode, 0);
          rangeToEnd.setEnd(endNode, endNode.textContent.length);
          return rangeToEnd.toString().length;
        })(),

        allTextNodes = this.walkTextNodes(rootNode, stopOffset),

        nodesBetween = [],
        len = allTextNodes.length,
        take = false,
        n, i;

    for (i=0; i<len; i++) {
      n = allTextNodes[i];

      if (n === endNode) take = false;

      if (take) nodesBetween.push(n);

      if (n === startNode) take = true;
    }

    return nodesBetween;
  }

  calculateDomPositionWithin = (textNodeProperties, charOffsets) => {
    var positions = [];

    textNodeProperties.forEach(function(props, i) {
      charOffsets.forEach(function(charOffset, j)  {
        if (charOffset >= props.start && charOffset <= props.end) {
          // Don't attach nodes for the same charOffset twice
          var previousOffset = (positions.length > 0) ?
                positions[positions.length - 1].charOffset : false;

          if (previousOffset !== charOffset)
            positions.push({
              charOffset: charOffset,
              node: props.node,
              offset: charOffset - props.start
            });
        }
      });

      // Break (i.e. return false) if all positions are computed
      return positions.length < charOffsets.length;
    });

    return positions;
  }

  wrapRange = (range, commonRoot) => {
    const root = commonRoot ? commonRoot : this.el;

    const surround = range => {
      var wrapper = document.createElement('SPAN');
      range.surroundContents(wrapper);
      return wrapper;
    };

    if (range.startContainer === range.endContainer) {
      return [ surround(range) ];
    } else {
      // The tricky part - we need to break the range apart and create
      // sub-ranges for each segment
      var nodesBetween =
        this.textNodesBetween(range.startContainer, range.endContainer, root);

      // Start with start and end nodes
      var startRange = document.createRange();
      startRange.selectNodeContents(range.startContainer);
      startRange.setStart(range.startContainer, range.startOffset);
      var startWrapper = surround(startRange);

      var endRange = document.createRange();
      endRange.selectNode(range.endContainer);
      endRange.setEnd(range.endContainer, range.endOffset);
      var endWrapper = surround(endRange);

      // And wrap nodes in between, if any
      var centerWrappers = nodesBetween.reverse().map(function(node) {
        const wrapper = document.createElement('SPAN');
        node.parentNode.insertBefore(wrapper, node);
        wrapper.appendChild(node);
        return wrapper;
      });

      return [ startWrapper ].concat(centerWrappers,  [ endWrapper ]);
    }
  }

  getAnnotationsAt = element => {
    // Helper to get all annotations in case of multipe nested annotation spans
    var getAnnotationsRecursive = function(element, a) {
          var annotations = (a) ? a : [ ],
              parent = element.parentNode;

          annotations.push(element.annotation);

          return (parent.classList.contains('annotation')) ?
            getAnnotationsRecursive(parent, annotations) : annotations;
        },

        sortByQuoteLength = function(annotations) {
          return annotations.sort(function(a, b) {
            return new WebAnnotation(a).quote.length - new WebAnnotation(b).quote.length;
          });
        };

    return sortByQuoteLength(getAnnotationsRecursive(element));
  }

}
