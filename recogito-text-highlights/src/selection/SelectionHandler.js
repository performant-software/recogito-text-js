import { trimRange, rangeToAnnotationStub } from './SelectionUtils';
import EventEmitter from 'tiny-emitter';

export default class SelectionHandler extends EventEmitter {

  constructor(element, highlighter) {
    super();

    this.el = element;
    this.highlighter = highlighter;
    element.addEventListener('mousedown', this._onMouseDown);
    element.addEventListener('mouseup', this._onMouseUp);
  }

  _onMouseDown = evt => {
    this.clearSelection();
  }

  _onMouseUp = evt => {
    const selection = getSelection();

    if (selection.isCollapsed) {
      const annotationSpan = evt.target.closest('.annotation');
      if (annotationSpan) {
        this.emit('select', { 
          selection: annotationSpan.annotation,
          clientRect: annotationSpan.getBoundingClientRect() 
        });
      } else {
        // De-select
        this.emit('select', {});
      }
    } else {
      const selectedRange = trimRange(selection.getRangeAt(0));
      const stub = rangeToAnnotationStub(selectedRange, this.el);

      const clientRect = selectedRange.getBoundingClientRect();

      const spans = this.highlighter.wrapRange(selectedRange);
      spans.forEach(span => span.className = 'selection');

      this._clearNativeSelection();

      this.emit('select', {
        selection: stub,
        clientRect
      });
    }
  }

  _clearNativeSelection = () => {
    if (window.getSelection) {
      if (window.getSelection().empty) {  // Chrome
        window.getSelection().empty();
      } else if (window.getSelection().removeAllRanges) {  // Firefox
        window.getSelection().removeAllRanges();
      }
    } else if (document.selection) {  // IE?
      document.selection.empty();
    }
  }

  clearSelection = () => {
    this._currentSelection = null;

    const spans = Array.prototype.slice.call(this.el.querySelectorAll('.selection'));
    if (spans) {
      spans.forEach(span => {
        const parent = span.parentNode;
        parent.insertBefore(document.createTextNode(span.textContent), span);
        parent.removeChild(span);
      });
    }
    this.el.normalize();
  }

}