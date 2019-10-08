import Highlighter from './selection/Highlighter';
import SelectionHandler from './selection/SelectionHandler';
import TextAnnotation from './annotation/WebAnnotation';

const el = document.getElementById('content');

const h = new Highlighter(el)
const s = new SelectionHandler(el, h);

s.on('select', evt => console.log(evt));
h.init(annotations.map(a => new TextAnnotation(a)));