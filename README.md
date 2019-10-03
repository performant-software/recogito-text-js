# RecogitoJS (Working Title)

__RecogitoJS__ is an experiment to extract the annotation functionality
of [Recogito](https://recogito.pelagios.org) into an independent, client-only JavaScript library. With __RecogitoJS__, we want to bring Recogito-like 
annotation to any website, and enable everyone to build customized annotation
applications more easily. [Try the demo](https://pelagios.org/recogito-text-js/index.html).

![Screenshot](screenshot.png)

__This project is just getting started. To make it happen, we need your help. Get in touch if you want to contribute.__

## Developer Information

The plan is to organize the project into a number of sub-modules.

- __recogito-text-highlights__ is a dependency-free JavaScript
  library that handles text highlight rendering and mouse selection
- __recogito-annotation-editor__ is a [React](https://reactjs.org/)
  project for the annotation editor popup window

To run the project in development mode:

- Enter the `recogito-text-highlights` folder and run `npm install` to install dependencies
- Enter the `recogito-annotation-editor` folder and run `npm install`
- Run `npm start` and go to [localhost:3000](http://localhost:3000)

To build the minified bundle, run `npm run build`.

## Using RecogitoJS

At the moment, __RecogitoJS__ works only on plaintext content,
contained in a single `<pre>` tag. Usage instructions: coming soon.

### Annotation Format

The goal is to encode annotations in JSON-LD, according to the
[W3C Web Annotation model](https://www.w3.org/TR/annotation-model/).

```json
{
  "@context": "http://www.w3.org/ns/anno.jsonld",
  "id": "http://example.org/annotation/494718ed-72a7-4d33-b78e-e74b5f00259e",
  "type": "Annotation",
  "body": [{
    "type": "TextualBody",
    "value": "This is a comment."
  }],
  "target": {
    "source": "http://example.com/my-page",
    "selector": [{
      "type": "TextQuoteSelector",
      "exact": "Troy"
    },{
      "type": "TextPositionSelector",
      "start": 106,
      "end": 110
    }]
  }
}
```

### Storing Annotations

__RecogitoJS__ is a client-only library. That means it handles the
user interaction in the browser. Storage of annotations in a server
backend is beyond scope. Instead, there will be a JavaScript API
(with configuration options and a bunch of events) for writing your
own code that stores annotations on a server. 

Splitting out the [Recogito](https://github.com/pelagios/recogito2)
annotation store into a separate project and/or providing a standard
storage connector would be neat as a future project.

## License

[BSD 3-Clause](LICENSE) (feel free to use this code in whatever way
you wish. But keep the attribution/license file, and if this code
breaks something, don't complain to us :-) 

