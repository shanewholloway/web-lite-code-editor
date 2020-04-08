# lite-code-editor

Lightweight code editor web component using `contentEditable=true` and
[PrismJS][]-like highlighting

  [PrismJS]: https://prismjs.com


### Quickstart

```html
...
<link href='https://cdn.jsdelivr.net/npm/prismjs/themes/prism.css' rel='stylesheet' />
<script src='https://cdn.jsdelivr.net/npm/prismjs/prism.js'></script>
<script type=module src='https://cdn.jsdelivr.net/npm/lite-code-editor/esm/prism-editor.mjs'></script>
...

<prism-code-editor lang='javascript'>
  if (true != false) {
    console.log(
      'A log message',
      { ts: new Date,
        meta: import.meta }
    )
  }
</prism-code-editor>
```


### Code start

An alternative build of `esm/prism-editor.mjs` ::

```javascript
import Prism from 'prismjs'
import {bindCodeEditor} from 'lite-code-editor/esm/editor.mjs'

const PrismCodeEditor = bindCodeEditor(Prism.highlightElement)

customElements.define('prism-code-editor', PrismCodeEditor)
```


## Thanks!

Special thanks to [Sam Thorogood][samthor] for creating [Undoer][] and
the [excellent writeup][undoer-article] unpacking the approach to implementing undo/redo with the browser's
assistance.

 [Undoer]: https://github.com/samthor/undoer
 [samthor]: https://github.com/samthor
 [undoer-article]: https://dev.to/chromiumdev/-native-undo--redo-for-the-web-3fl3


Lightweight code editor inspired by similar [CodeFlask][] and [CodeJar][] projects.

 [CodeFlask]: https://kazzkiq.github.io/CodeFlask/
 [CodeJar]: https://medv.io/codejar/


## License

[BSD-2-Clause](./LICENSE)

