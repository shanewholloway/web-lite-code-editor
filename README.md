# lite-code-editor

Lightweight code editor web component using `contentEditable=true` and
[PrismJS][]-like highlighting

  [PrismJS]: https://prismjs.com
  [JSY]: https://jsy-lang.github.io


## Demo

Github.io hosted [lite-code-editor demo](https://shanewholloway.github.io/web-lite-code-editor/)

### Quickstart

#### In-browser JavaScript interactive editing and compilation:

See [JavaScript Demo](https://shanewholloway.github.io/web-lite-code-editor/with_func.html)

```html
...
<link href='https://cdn.jsdelivr.net/npm/prismjs/themes/prism.css' rel='stylesheet' />
<script src='https://cdn.jsdelivr.net/npm/prismjs/prism.js'></script>
<script type=module src='https://cdn.jsdelivr.net/npm/lite-code-editor/esm/js-func-editor.js'></script>
...

<js-func-editor func='async'>
  if (true != false) {
    console.log(
      'A log message',
      { ts: new Date,
        meta: import.meta }
    )
  }
</js-func-editor>
```

#### In-browser [JSY][] interactive editing and compilation:

See [JSY Demo](https://shanewholloway.github.io/web-lite-code-editor/with_jsy_func.html)

```html
...
<link href='https://cdn.jsdelivr.net/npm/prismjs/themes/prism.css' rel='stylesheet' />
<script src='https://cdn.jsdelivr.net/npm/prismjs/prism.js'></script>
<script src='https://cdn.jsdelivr.net/npm/prism-jsy/iife/prism-jsy-syntax.js'></script>
<script type=module src='https://cdn.jsdelivr.net/npm/lite-code-editor/esm/jsy-func-editor.js'></script>
...

<style>
  jsy-func-editor { display: flex; flex-wrap: wrap; }
  jsy-func-editor>pre { flex: 1 0; min-width: min-content; }
  jsy-func-editor>pre.dual { background-color: #ddd; border-left: 2px dashed black; }
</style>
<jsy-func-editor mode='dual' func='async'>
  if true != false ::
    console.log @
      'A log message'
      @{} ts: new Date
          meta: import.meta
</jsy-func-editor>
```

#### [PrismJS]() interactive editing

See [Multi-language Demo](https://shanewholloway.github.io/web-lite-code-editor/)

```html
...
<link href='https://cdn.jsdelivr.net/npm/prismjs/themes/prism.css' rel='stylesheet' />
<script src='https://cdn.jsdelivr.net/npm/prismjs/prism.js'></script>
...
<script type=module src='https://cdn.jsdelivr.net/npm/lite-code-editor/esm/prism-editor.js'></script>
...

<prism-code-editor lang='python'>
    def fib(n):
        a, b = 0, 1
        while a < n:
            print(a, end=' ')
            a, b = b, a+b
        print()

    fib(1000)
</prism-code-editor>
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

