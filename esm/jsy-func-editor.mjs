import jsy_transpile from 'https://cdn.jsdelivr.net/npm/@jsy-lang/jsy/esm/index.js';
export { default as jsy_transpile } from 'https://cdn.jsdelivr.net/npm/@jsy-lang/jsy/esm/index.js';

function * relative_selection_ctxmgr(el) {
  const sel = el.ownerDocument.getSelection();
  const sel_rng = 1===sel.rangeCount && sel.getRangeAt(0);

  const rel_rng = as_range_relative(el, sel_rng);
  yield rel_rng;

  const rng = from_range_relative(el, rel_rng);
  if (rng) {
    sel.removeAllRanges();
    sel.addRange(rng);} }


function as_range_relative(el, rng) {
  if (! rng || ! rng.intersectsNode(el)) {return}

  const r_el = el.ownerDocument.createRange();
  r_el.selectNode(el);

  if (-1 === rng.compareBoundaryPoints(Range.START_TO_START, r_el)) {
    return}
  if (1 === rng.compareBoundaryPoints(Range.END_TO_END, r_el)) {
    return}

  return {
    start: as_range_relative_offset(el, rng.startContainer, rng.startOffset)
  , end: as_range_relative_offset(el, rng.endContainer, rng.endOffset) } }


function from_range_relative(el, rel_rng) {
  if (! rel_rng) {return}
  const start = from_range_relative_offset(el, rel_rng.start);
  const end = from_range_relative_offset(el, rel_rng.end);

  if (start && end) {
    const rng = el.ownerDocument.createRange();
    rng.setStart(start[0], start[1]);
    rng.setEnd(end[0], end[1]);
    return rng} }
function as_range_relative_offset(el_root, el, offset) {
  while (el !== el_root) {
    const tip = el;
    el = el.parentNode;
    for (const node of el.childNodes) {
      if (node !== tip) {
        offset += node.textContent.length;}
      else break} }
  return offset}


function from_range_relative_offset(el_root, offset) {
  if (offset > el_root.textContent.length) {
    return}

  let tip = el_root.childNodes[0];
  while (tip) {
    const n = tip.textContent.length;
    if (n < offset) {
      // consume leading textContent length
      offset -= n;
      tip = tip.nextSibling;}

    else if (3 === tip.nodeType) {
      // TEXT_NODE with more content than our offset
      return [tip, offset]}

    else {
      // drill down into first child
      tip = tip.childNodes[0];} } }

function _create_async_queue(self) {
  let _x, _q=[];
  return enqueue

  function enqueue(fn) {
    if (fn) {_q.push(fn);}
    if (undefined === _x && 0 !== _q.length) {
      _x = requestAnimationFrame(_q_step);} }

  async function _q_step() {
    let q_snap = _q;
    _q = [];

    for (let fn of q_snap) {
      await fn.call(self);}

    _x = undefined;
    enqueue();} }

class Undoer {

  /**
   * @template T
   * @param {function(T)} callback to call when undo/redo occurs
   * @param {T=} zero the zero state for undoing everything
   */
  constructor(callback, zero=null) {
    this._duringUpdate = false;
    this._stack = [zero];
 
    // nb. Previous versions of this used `input` for browsers other than Firefox (as Firefox
    // _only_ supports execCommand on contentEditable)
    this._ctrl = document.createElement('div');
    this._ctrl.setAttribute('aria-hidden', 'true');
    this._ctrl.style.opacity = 0;
    this._ctrl.style.position = 'fixed';
    this._ctrl.style.top = '-1000px';
    this._ctrl.style.pointerEvents = 'none';
    this._ctrl.tabIndex = -1;

    this._ctrl.contentEditable = true;
    this._ctrl.textContent = '0';
    this._ctrl.style.visibility = 'hidden';  // hide element while not used

    this._ctrl.addEventListener('focus', (ev) => {
      // Safari needs us to wait, can't blur immediately.
      window.setTimeout(() => void this._ctrl.blur(), 0);
    });
    this._ctrl.addEventListener('input', (ev) => {
      if (!this._duringUpdate) {
        callback(this.data);
      }

      // clear selection, otherwise user copy gesture will copy value
      // nb. this _probably_ won't work inside Shadow DOM
      // nb. this is mitigated by the fact that we set visibility: 'hidden'
      const s = window.getSelection();
      if (s.containsNode(this._ctrl, true)) {
        s.removeAllRanges();
      }
    });
  }

  /**
   * @return {number} the current stack value
   */
  get _depth() {
    return +(this._ctrl.textContent) || 0;
  }

  /**
   * @return {T} the current data
   * @export
   */
  get data() {
    return this._stack[this._depth];
  }

  /**
   * Pushes a new undoable event. Adds to the browser's native undo/redo stack.
   *
   * @param {T} data the data for this undo event
   * @param {!Node=} parent to add to, uses document.body by default
   * @export
   */
  push(data, parent) {
    // nb. We can't remove this later: the only case we could is if the user undoes everything
    // and then does some _other_ action (which we can't detect).
    if (!this._ctrl.parentNode) {
      // nb. we check parentNode as this would remove contentEditable's history
      (parent || document.body).appendChild(this._ctrl);
    }

    const nextID = this._depth + 1;
    this._stack.splice(nextID, this._stack.length - nextID, data);

    const previousFocus = document.activeElement;
    try {
      this._duringUpdate = true;
      this._ctrl.style.visibility = null;
      this._ctrl.focus();
      document.execCommand('selectAll');
      document.execCommand('insertText', false, nextID);
    } finally {
      this._duringUpdate = false;
      this._ctrl.style.visibility = 'hidden';
    }

    previousFocus && previousFocus.focus();
  }
}

function code_editor_dom(host, el_code, state0, opt) {
  _init_code_dom(el_code, opt);
  _init_editor_api(host, el_code, state0);

  const events = opt.events || code_editor_events;
  const _on_evt = bind_evt_dispatch(events, host, opt);
  for (const key of events.keys) {
    el_code.addEventListener(key, _on_evt); }

  return (() => {
    for (const key of events.keys) {
      el_code.removeEventListener(key, _on_evt); } }) }



const code_editor_events = Object.freeze({
  keys: Object.freeze(['keydown', 'keyup', 'paste', 'input', 'blur'])
, attrs: Object.freeze(['key'])
, table: Object.freeze({
    ... bind_evt_editor_input()

  , 'evt:keydown,key:Tab'(evt, host, opt) {
      evt.preventDefault();
      document.execCommand('insertText', false, opt.tabs || '    '); }

  , 'evt:paste'(evt, host) {
      evt.preventDefault();
      const text = evt.clipboardData.getData('text/plain');
      if (text) {
        document.execCommand('insertText', false, text);
        host.dirty();} } }) });

function bind_evt_dispatch(events, ... ex_args) {
  const {table, attrs} = events;
  return (( evt ) => {
    const evec =[`evt:${evt.type}`, ...(
      attrs
        .map(k => `${k}:${evt[k]}`)
        .filter(Boolean) ) ];

    for (let i=evec.length; i>0; i--) {
      const fn = table[evec.slice(0,i)];
      if (fn) {
        return fn(evt, ... ex_args)} } }) }

function bind_evt_editor_input() {
  // specialized input event to work in concert with Undoer
  const wset = new WeakSet();
  return {
    'evt:blur'(evt, host) {
      if (wset.has(host)) {
        // blur caused by our undo command
        evt.preventDefault();}
      else {
        host._emit_code_change();} }

  , async 'evt:input'(evt, host) {
      if (wset.has(host)) {
        return}

      wset.add(host);
      await null;
      try {
        const src_code = host.src_code;
        for (const _ of host.with_selection()) {
          document.execCommand('undo', false);
          host.raw_src_code = src_code;
          host.dirty();} }
      finally {
        wset.delete(host);} } } }



function _init_editor_api(host, el_code, state_tip) {
  let _undoer = new Undoer(_do_undo, state_tip);
  function _do_undo(prev_state) {
    const save = _undoer;
    _undoer = null;
    try {host._restore_state(prev_state);}
    finally {_undoer = save;} }

  const q_async = _create_async_queue(host);
  let evt_detail = null;

  Object.assign(host,{
    *with_selection() {
      for (const _ of relative_selection_ctxmgr(el_code)) {
        yield;} }

  , dirty() {
      q_async(host._refresh_selection);
      evt_detail = host._event_from_state(state_tip);
      q_async(host.refresh_code); }

  , _refresh_selection() {
      for (const _ of host.with_selection()) {
        host.src_code = host.src_code + '';} }

  , _emit_code_change() {
      _emit_code_event(host, evt_detail, ''); }

  , _emit_src_code(el, new_state, shape=['lang', 'src_code']) {
      if (_state_equal(new_state, state_tip, shape)) {
        return}

      state_tip = new_state;
      if (null !== _undoer) {
        _undoer.push(host._save_state(new_state), el); }

      evt_detail = host._event_from_state(state_tip);
      q_async(host.refresh_code);
      _emit_code_event(host, evt_detail, ':input'); } } );


  q_async(host.dirty);
  q_async(host._emit_code_change);
  return host}


function _emit_code_event(host, detail, kind) {
  if (detail) {
    return host.dispatchEvent(
      new CustomEvent('src_code'+kind,
        {detail, bubbles: true} ) ) } }

function _state_equal(a,b, shape) {
  for (const k of shape) {
    if (a[k] !== b[k]) {
      return false} }
  return true}


const _ed_attrs = {
  contentEditable: true
, spellcheck: false};

const _ed_style = {
  outline: 'none'
, overflowWrap: 'break-word'
, overflowY: 'auto'
, resize: 'vertical'
, whiteSpace: 'pre-wrap'};

function _init_code_dom(el_code, opt) {
  const attrs = {... _ed_attrs, ... opt.attrs || {}};
  for (const k in attrs) {
    el_code.setAttribute(k, attrs[k]);}

  Object.assign(el_code.style,
    {... _ed_style, ... opt.style || {}}); }

class CodeEditor extends HTMLElement {
  static with_options(opt={}) {
    return class extends this {
      _dom_connect(el, state0) {
        code_editor_dom(
          this, el, state0, opt); } } }

  static define_with(key, attrs) {
    let klass = class extends this {};
    Object.assign(klass.prototype, attrs);
    customElements.define(key, klass);
    return klass}


  connectedCallback() {
    const src_code = this.textContent
      .replace(/^\s*\r?\n/, '');
    this.textContent = '';
    const state0 ={src_code, lang: this.lang};

    const el = this._el_code = this._init_code_dom();
    this._dom_connect(el, state0);
    this.src_code = src_code;}


  _dom_connect(el, state0) {
    code_editor_dom(
      this, el, state0, {}); }


  disconnectedCallback() {
    if (this._dom_disconnect) {
      this._dom_disconnect();} }

  _init_code_dom(className) {
    let odoc = this.ownerDocument;
    const el_code = odoc.createElement('code');
    const el_pre = odoc.createElement('pre');
    el_pre.appendChild(el_code);
    this.appendChild(el_pre);
    if (className) {
      el_pre.className = className;}
    return el_code}


  static get observedAttributes() {return ['lang', 'mode']}
  attributeChangedCallback() {this.dirty();}
  dirty() {}

  get lang() {return this.getAttribute('lang') || this.default_lang || 'js'}
  set lang(lang) {this.setAttribute('lang', lang);}

  get raw_src_code() {
    return this._el_code.textContent}
  set raw_src_code(src_code) {
    const {_el_code: el, lang} = this;
    this.render_code(lang, src_code, el);
    this._emit_src_code(this, {src_code, lang}); }

  get src_code() {
    return this._el_code.textContent}
  set src_code(src_code) {
    this.raw_src_code = src_code;
    this.highlight_src(src_code, this._el_code);}

  _save_state(state) {return state}
  _restore_state({lang, src_code}) {
    this.lang = lang;
    this.src_code = src_code;}

  _event_from_state(state) {
    return {... state} }

  render_code(lang, src_code, el_code, highlight) {
    el_code.innerText = ''; // clear content
    el_code.textContent = src_code;

    if (lang) {
      const cls_lang = `language-${lang}`;
      el_code.classList.add(cls_lang);
      el_code.parentNode.classList.add(cls_lang);}

    if (highlight) {
      this.highlight_src(src_code, el_code);}
    return el_code}

  highlight_src(src_code, el_code) {
    if (globalThis.Prism) {
      Prism.highlightElement(el_code);} } }

class FuncCodeEditorBase extends CodeEditor {
  constructor() {
    super();

    this.compiler = this.createCompiler();
    this.dyn_proto = this._bindDynProto(this, this.compiler); }

  createCompiler() {
    return new DynFuncCompiler(this.transpile)}

  _bindDynProto(host, compiler) {
    return {
      compiler
    , lazy() {
        let ctx = host.as_compile_ctx(host);
        let dyn = compiler.compile_func(this.src_code, ctx);
        Object.assign(this, dyn);
        this.lazy = _=>this;
        return this}

    , get dyn_fn() {return this.lazy().fn}
    , get dyn_js() {return this.lazy().js} } }


  static get observedAttributes() {
    return super.observedAttributes.concat(['name', 'func', 'args']) }

  get name() {return this.getAttribute('name') || this.default_name || ''}
  set name(value) {this.setAttribute('name', value);}

  get func() {return this.getAttribute('func') || this.default_func || ''}
  set func(value) {this.setAttribute('func', value);}

  get args() {return this.getAttribute('args') || this.default_args || ''}
  set args(value) {this.setAttribute('args', value);}

  get mode() {return this.getAttribute('mode')}
  set mode(value) {return this.setAttribute('mode', value)}

  as_compile_ctx({name, func, args}) {
    return {name, func, args} }


  get dyn_fn() {return this.dyn?.dyn_fn}
  get dyn_js() {return this.dyn?.dyn_js}

  _event_from_state(state) {
    return this.dyn ={
      __proto__: this.dyn_proto
    , ... state} }

  refresh_code() {
    let mode = this.mode;
    if (! mode) {
      this._el_dual &&= void this._el_dual.parentNode.remove();
      return}

    this._el_dual ||= this._init_code_dom(mode);

    let dyn = this.dyn.lazy();
    let src = this.hasAttribute('debug') ? ''+dyn.fn : dyn.js;

    if (null != dyn.err) {
      src = `// ${dyn.err}\n\n${src}`;}

    this.render_code('js', src, this._el_dual, true); } }


class DynFuncCompiler {
  constructor(fn_transpile=(src=>src)) {
    this.transpile = fn_transpile;}

  compile_func(src_code, ctx) {
    let res = {};
    try {
      res.js = this.transpile(src_code);}
    catch (err) {
      res.err = err;
      return res}

    try {
      let fn_compile = new Function(
  `return (${this.as_func_src(res.js, ctx)})`);

      res.fn = fn_compile();}
    catch (err) {
      res.err = err;
      return res}

    return res}

  as_func_src(js_src, {func, name, args}) {
    if (! func.match(/\bfunction\b/)) {
      const [_,pre,post] = func.match(/^([^\*]*)(\*.*)?$/);
      func = `${pre||''} function ${post||''}`;}

    return `${func.trim()} ${name||''}(${args||''}){\n${js_src}\n}`} }

const JSYFuncCodeEditor =
  FuncCodeEditorBase.define_with(
    'jsy-func-editor'
  , {default_lang: 'jsy'
      , transpile: jsy_transpile} );

export { JSYFuncCodeEditor, JSYFuncCodeEditor as default };
//# sourceMappingURL=jsy-func-editor.mjs.map
