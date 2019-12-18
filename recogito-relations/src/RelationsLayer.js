import Connection from './Connection';
import DrawingTool from './drawing/DrawingTool';
import CONST from './SVGConst';
import EventEmitter from 'tiny-emitter';

import './RelationsLayer.scss';

export default class RelationsLayer extends EventEmitter {

  constructor(contentEl) {
    super();

    this.connections = []; 

    this.contentEl = contentEl;

    this.svg = document.createElementNS(CONST.NAMESPACE, 'svg');
    this.svg.classList.add('r6o-relations-layer');
    this.contentEl.appendChild(this.svg);

    this.drawingTool = new DrawingTool(contentEl, this.svg);

    // Forward events
    this.drawingTool.on('createRelation', relation => this.emit('createRelation', relation));
    this.drawingTool.on('cancelDrawing', () => this.emit('cancelDrawing'));
  }

  /** Shorthand **/
  createConnection = annotation => {
    const c = new Connection(this.contentEl, this.svg, annotation);
    c.on('click', relation => this.emit('selectRelation', relation));
    return c
  }

  init = annotations => {
    // Filter annotations for 'relationship annotation' shape first
    this.connections = annotations.filter(annotation => {
      const allTargetsHashIDs = annotation.targets.every(t => t.id && t.id.startsWith('#'))
      return allTargetsHashIDs && annotation.motivation === 'linking';
    }).reduce((conns, annotation) => {
      try {
        const c = this.createConnection(annotation);
        return [ ...conns, c ];
      } catch (error) {
        console.log(error);
        console.log(`Error rendering relation for annotation ${annotation.id}`);
        return conns;
      }
    }, [])
  }
  
  addOrUpdateRelation = (relation, maybePrevious) => {
    const previous = maybePrevious ? 
      this.connections.find(c => c.matchesRelation(relation)) : null;

    if (previous) {
      // Replace existing
      this.connections = this.connections.map(connection => {
        if (connection == previous) {
          connection.destroy();
          return this.createConnection(relation.annotation);
        } else {
          return connection;
        }
      });
    } else {
      // Add new
      const c = this.createConnection(relation.annotation);
      this.connections.push(c);
    }
  }

  removeRelation = relation => {
    const toRemove = this.connections.find(c => c.annotation.isEqual(annotation));

    if (toRemove) {
      this.connections = this.connections.filter(c => c !== toRemove);
      toRemove.destroy();
    }
  }

  show = function() {
    this.svg.style.display = 'inital';
  }

  hide = function() {
    this.drawingEnabled = false;
    this.svg.style.display = 'none';
  }

  startDrawing = function() {
    this.drawingTool.enabled = true;
  }

  stopDrawing = function() {
    this.drawingTool.enabled = false;
  }

  resetDrawing = function() {
    this.drawingTool.reset();
  }

}
