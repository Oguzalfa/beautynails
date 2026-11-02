/** Framework-free, opt-in motion layer. No form/link/layout changes. */
const mounted = new WeakMap();

export function initSaziMotion(root) {
  if (!root || root.nodeType !== 1) throw new TypeError('Pass the existing data-sazi-motion root element.');
  if (mounted.has(root)) return mounted.get(root);
  const doc = root.ownerDocument;
  const win = doc.defaultView;
  const media = win.matchMedia('(prefers-reduced-motion: reduce)');
  const phone = win.matchMedia('(max-width: 767px)');
  const connection = win.navigator.connection;
  const owns = el => el.closest('[data-sazi-motion]') === root;
  const targets = [...root.querySelectorAll('[data-sazi-drift],[data-sazi-shine],[data-sazi-glint]')].filter(owns);
  const reveals = [...root.querySelectorAll('[data-sazi-reveal]')].filter(owns);
  const snapshots = [];
  const clips = [];
  const visible = new Set();
  const listeners = [];
  let observer;
  let revealObserver;
  let manualPause = false;
  let manualReduced = false;
  let dead = false;
  let state = 'paused';

  function remember(el, name) { snapshots.push([el,name,el.getAttribute(name)]); }
  remember(root,'data-sazi-fx-state');
  targets.forEach(el => remember(el,'data-sazi-fx-active'));
  reveals.forEach(el => {
    remember(el,'data-sazi-fx-pending');
    remember(el,'data-sazi-fx-revealed');
  });
  function listen(obj,event,fn) {
    if (!obj) return;
    if (obj.addEventListener) {
      obj.addEventListener(event,fn);
      listeners.push(() => obj.removeEventListener(event,fn));
    } else if (event === 'change' && obj.addListener) {
      obj.addListener(fn);
      listeners.push(() => obj.removeListener(fn));
    }
  }
  function finishReveal(el) {
    el.removeAttribute('data-sazi-fx-pending');
    el.setAttribute('data-sazi-fx-revealed','yes');
    revealObserver?.unobserve(el);
  }
  function kind(el) {
    if (el.hasAttribute('data-sazi-drift')) return 'drift';
    if (el.hasAttribute('data-sazi-shine')) return 'shine';
    return 'glint';
  }
  function sync() {
    if (dead) return;
    const reduced = media.matches || manualReduced || !!connection?.saveData;
    state = reduced ? 'reduced' : ((manualPause || doc.hidden) ? 'paused' : 'running');
    root.setAttribute('data-sazi-fx-state',state);
    const budget = phone.matches ? {drift:1,shine:2,glint:2} : {drift:2,shine:3,glint:4};
    const count = {drift:0,shine:0,glint:0};
    const ordered = targets.map((el,index)=>({el,index,priority:Number(el.dataset.saziPriority)||0})).sort((a,b)=>b.priority-a.priority||a.index-b.index);
    ordered.forEach(({el}) => {
      const k = kind(el);
      const active = state === 'running' && visible.has(el) && count[k] < budget[k];
      el.setAttribute('data-sazi-fx-active',active?'yes':'no');
      if (active) count[k]++;
    });
    if (reduced) reveals.forEach(finishReveal);
  }
  function destroy() {
    if (dead) return;
    dead = true;
    observer?.disconnect();
    revealObserver?.disconnect();
    listeners.forEach(remove => remove());
    clips.forEach(el => el.remove());
    snapshots.reverse().forEach(([el,name,value]) => value === null ? el.removeAttribute(name) : el.setAttribute(name,value));
    mounted.delete(root);
  }
  const api = {
    pause() { manualPause=true;sync(); },
    resume() { manualPause=false;sync(); },
    setReducedMotion(value) { manualReduced=!!value;sync(); },
    sync,
    destroy,
    inspect() {
      const active={drift:0,shine:0,glint:0};
      targets.forEach(el=>{if(el.getAttribute('data-sazi-fx-active')==='yes')active[kind(el)]++;});
      return {state,active,targetCount:targets.length,revealCount:reveals.length,destroyed:dead};
    }
  };
  try {
    targets.filter(el=>el.hasAttribute('data-sazi-shine')).forEach(el=>{
      const clip=doc.createElement('span');
      clip.className='sazi-fx-clip';
      clip.setAttribute('aria-hidden','true');
      const band=doc.createElement('span');
      band.className='sazi-fx-shine-band';
      clip.append(band);
      el.append(clip);
      clips.push(clip);
    });
    if (win.IntersectionObserver) {
      observer=new win.IntersectionObserver(entries=>{
        entries.forEach(e=>e.isIntersecting?visible.add(e.target):visible.delete(e.target));
        sync();
      },{threshold:.12});
      targets.forEach(el=>observer.observe(el));
      revealObserver=new win.IntersectionObserver(entries=>{
        entries.forEach(e=>{if(e.isIntersecting)finishReveal(e.target);});
      },{threshold:.10});
      reveals.forEach(el=>{
        if (media.matches || connection?.saveData) finishReveal(el);
        else {
          el.setAttribute('data-sazi-fx-pending','');
          revealObserver.observe(el);
        }
      });
    } else {
      // Static fallback: no observer means no recurring animation work.
      manualReduced=true;
      reveals.forEach(finishReveal);
    }
    listen(media,'change',sync);
    listen(phone,'change',sync);
    listen(connection,'change',sync);
    listen(doc,'visibilitychange',sync);
    mounted.set(root,api);
    sync();
    return api;
  } catch (error) {
    destroy();
    throw error;
  }
}
