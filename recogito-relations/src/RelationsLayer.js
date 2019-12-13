import Connection from './Connection';
import CONST from './SVGConst';

import './RelationsLayer.scss';

export default class RelationsLayer {

  constructor(contentEl) {
    this.connections = []; 

    this.contentEl = contentEl;

    this.svg = document.createElementNS(CONST.NAMESPACE, 'svg');
    this.svg.classList.add('r6o-relations-layer');
    this.contentEl.appendChild(this.svg);
  }

  init = annotations => {
    // Filter annotations for 'relationship annotation' shape first
    this.connections = annotations.filter(annotation => {
      const allTargetsHashIDs = annotation.targets.every(t => t.id && t.id.startsWith('#'))
      return allTargetsHashIDs && annotation.motivation === 'linking';
    }).reduce((conns, annotation) => {
      try {
        const c = new Connection(this.contentEl, this.svg, annotation);
        return [ ...conns, c ];
      } catch (error) {
        console.log(error);
        console.log(`Error rendering relation for annotation ${annotation.id}`);
        return conns;
      }
    }, [])
  }

  show = function() {
    this.svg.style.display = 'inital';
  }

  hide = function() {
    this.drawingEnabled = false;
    this.svg.style.display = 'none';
  }

  set drawingEnabled(enabled) {
    if (this.editor) {
      editor.enabled = enabled;

      if (!enabled) {
        this.connections.forEach(function(conn) {
          conn.stopEditing();
        });
      }
    }
  }

  recomputeAll = function() {
    this.connections.forEach(function(conn) {
      conn.recompute();
    });
  }

}