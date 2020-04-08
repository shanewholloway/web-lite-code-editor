function * relative_selection_ctxmgr(el) {
  const sel = el.ownerDocument.getSelection();
  const sel_rng = 1===sel.rangeCount && sel.getRangeAt(0);

  const rel_rng = as_range_relative(el, sel_rng);
  if (rel_rng) {
    yield rel_rng;

    const rng = from_range_relative(el, rel_rng);
    if (rng) {
      sel.removeAllRanges();
      sel.addRange(rng);} } }


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

const _ed_attrs ={
  contentEditable: true
, spellcheck: false};

const _ed_style ={
  outline: 'none'
, overflowWrap: 'break-word'
, overflowY: 'auto'
, resize: 'vertical'
, whiteSpace: 'pre-wrap'};

function init_dom_editor(host, el, src_code0, opt) {
  const attrs = {... _ed_attrs, ... opt.attrs || {}}; 
  for (const k in attrs) {
    el.setAttribute(k, attrs[k]);}

  Object.assign(el.style,
    {... _ed_style, ... opt.style || {}});


  const ktbl ={
    'evt keydown Tab'(evt) {
      evt.preventDefault();
      document.execCommand('insertText', false, opt.tabs || '    '); } };

  function ktbl_evt(evt) {
    const fn = ktbl[`evt ${evt.type} ${evt.key}`];
    if (fn) {fn(evt, host);} }

  el.addEventListener('keydown', ktbl_evt);
  el.addEventListener('keyup', ktbl_evt);
  el.addEventListener('input', (() => {host.dirty();}));

  el.addEventListener('paste', (( evt ) => {
    evt.preventDefault();
    const text = evt.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
    host.dirty();}) );


  host.refresh = (() => {
    for (const _ of relative_selection_ctxmgr(el)) {
      host.src_code = host.src_code + '';} });

  host._emit_src_code = (() => {
    const {src_code} = host;
    if (src_code != src_code0) {
      src_code0 = src_code;
      host.dispatchEvent(
        new CustomEvent('src_code', 
          {detail: src_code} ) ); } }); }

function _create_async_queue() {
  let _x, _q=new Set();
  return enqueue

  function enqueue(fn) {
    if (fn) {_q.add(fn);}
    if (undefined === _x && 0 !== _q.size) {
      _x = requestAnimationFrame(_q_step); } }

  async function _q_step() {
    const q_snap = _q;
    _q = new Set();

    for (const fn of q_snap) {
      await fn();}

    _x = undefined;
    enqueue();} }

function bindCodeEditor(fn_src_highlight, opt = {}) {
  opt ={... opt || {}};
  const _q_async = _create_async_queue();

  class CodeEditor extends HTMLElement {
    connectedCallback() {
      let src_code = this.textContent
        .replace(/^(\s*\r?\n)+/, '')
        .trimEnd();

      this.textContent = '';

      const el = this._el_code = this._init_dom(this.ownerDocument);
      init_dom_editor(this, el, src_code, opt);
      this.src_code = src_code;}


    _init_dom(odoc) {
      const el_code = odoc.createElement('code');
      const el_pre = odoc.createElement('pre');
      el_pre.appendChild(el_code);
      this.appendChild(el_pre);
      return el_code}


    get lang() {
      return this.getAttribute('lang')}
    set lang(lang) {
      this.setAttribute('lang', lang);
      this.dirty();}


    get src_code() {
      return this._el_code.textContent}
    set src_code(src_code) {
      const {_el_code: el, lang} = this;
      el.innerHTML = '';
      el.textContent = src_code;

      if (lang) {
        const cls_lang = `language-${lang}`;
        el.className = cls_lang || '';
        el.parentNode.className = cls_lang || '';}

      _q_async(this._emit_src_code);
      fn_src_highlight(el);}

    dirty() {_q_async(this.refresh);} }

  return CodeEditor}

const PrismCodeEditor = bindCodeEditor(Prism.highlightElement);
customElements.define('prism-code-editor', PrismCodeEditor);

export { PrismCodeEditor };
//# sourceMappingURL=prism-editor.mjs.map
