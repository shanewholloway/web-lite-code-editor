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

### Notes

- [ ] Undo / redo with re-highlighting

### License

[BSD-2-Clause](./LICENSE)

Inspired by [CodeFlask][] and [CodeJar][]

 [CodeFlask]: https://kazzkiq.github.io/CodeFlask/
 [CodeJar]: https://medv.io/codejar/
