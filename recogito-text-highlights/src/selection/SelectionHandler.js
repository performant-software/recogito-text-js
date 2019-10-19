import { trimRange, rangeToSelection } from './SelectionUtils';
import EventEmitter from 'tiny-emitter';

export default class SelectionHandler extends EventEmitter {

  constructor(element, highlighter) {
    super();

    this.el = element;
    this.highlighter = highlighter;
    element.addEventListener('mousedown', this._onMouseDown);
    element.addEventListener('mouseup', this._onMouseUp);

    // TODO clean up - move touch handling into a separat function
    let touchTimeout;
    let lastTouchEvent;

    const onTouchStart = evt => {
      if (!touchTimeout) {
        lastTouchEvent = evt;
        touchTimeout = setTimeout(executeTouchSelect, 1000);
      }
    }

    const executeTouchSelect = () => {
      if (lastTouchEvent) {
        this._onMouseUp(lastTouchEvent);
        touchTimeout = null;
        lastTouchEvent = null;
      }
    };

    const resetTouch = evt => {
      if (touchTimeout) {
        clearTimeout(touchTimeout);
        touchTimeout = setTimeout(executeTouchSelect, 1500);
      }
    }

    element.addEventListener('touchstart', onTouchStart);
    document.addEventListener('selectionchange', resetTouch);
  }

  _

  _onTouchend = evt => {

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
          selection: this.highlighter.getAnnotationsAt(annotationSpan)[0],
          clientRect: annotationSpan.getBoundingClientRect() 
        });
      } else {
        // De-select
        this.emit('select', {});
      }
    } else {
      const selectedRange = trimRange(selection.getRangeAt(0));
      const stub = rangeToSelection(selectedRange, this.el);

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