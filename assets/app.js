/* Outliers at Play — shared interactions */
(function () {
  // ---- nav scroll state ----
  const nav = document.querySelector('.nav');
  const onScroll = () => {
    if (!nav) return;
    nav.classList.toggle('scrolled', window.scrollY > 20);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ---- homepage scroll-spy: toggle Home/Works active as user passes #work ----
  const spy = document.querySelector('.nav-links[data-spy]');
  const workSection = document.getElementById('work');
  if (spy && workSection) {
    const home = spy.querySelector('[data-nav="home"]');
    const works = spy.querySelector('[data-nav="works"]');
    const updateSpy = () => {
      const top = workSection.getBoundingClientRect().top;
      const onWorks = top < 120;
      if (home) home.classList.toggle('active', !onWorks);
      if (works) works.classList.toggle('active', onWorks);
    };
    window.addEventListener('scroll', updateSpy, { passive: true });
    window.addEventListener('resize', updateSpy, { passive: true });
    updateSpy();
  }

  // ---- mobile menu ----
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.querySelector('.mobile-menu');
  if (toggle && menu) {
    const setOpen = (v) => {
      menu.classList.toggle('open', v);
      toggle.classList.toggle('active', v);
      document.body.style.overflow = v ? 'hidden' : '';
    };
    toggle.addEventListener('click', () => setOpen(!menu.classList.contains('open')));
    menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setOpen(false)));
  }

  // ---- scroll reveals (inline resting state + WAAPI entrance; never gates
  //      visibility behind CSS transitions/observers, which are unreliable in
  //      some embedded/iframe contexts) ----
  const items = Array.from(document.querySelectorAll('.reveal'));
  if (items.length) {
    const show = (el) => {
      if (el.classList.contains('in')) return;
      el.classList.add('in');
      el.style.opacity = '1';   // guaranteed-visible resting state (no time-based
                                 // animation: this webview freezes transitions/WAAPI)
    };
    let pending = items.slice();
    const pass = () => {
      if (!pending.length) return;
      const vh = window.innerHeight || document.documentElement.clientHeight;
      pending = pending.filter(el => {
        const r = el.getBoundingClientRect();
        if (r.top < vh * 0.92 && r.bottom > -40) { show(el); return false; }
        return true;
      });
    };
    pass();
    requestAnimationFrame(pass);
    window.addEventListener('scroll', pass, { passive: true });
    window.addEventListener('resize', pass, { passive: true });
    window.addEventListener('load', () => { pass(); requestAnimationFrame(pass); });
    // failsafe: never leave content hidden.
    setTimeout(pass, 300);
    setTimeout(() => { pending.forEach(show); pending = []; }, 1200);
  }

  // ---- manifesto: scroll-scrubbed sentence reveal + closing attribution ----
  const manifesto = document.querySelector('[data-manifesto]');
  const manifestoText = document.querySelector('[data-manifesto-text]');
  if (manifesto && manifestoText) {
    const sentences = Array.from(manifestoText.querySelectorAll('.s'));
    const attrEl = document.querySelector('[data-manifesto-attr]');
    const stages = sentences.length + (attrEl ? 1 : 0);

    let ticking = false;
    let lastStage = -1;
    const update = () => {
      ticking = false;
      const rect = manifesto.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      const travel = rect.height - vh;
      let stage;
      if (travel <= 0) {
        stage = stages;
      } else {
        const p = Math.max(0, Math.min(1, -rect.top / travel));
        // buffer 6% head / 10% tail so the last sentence + attribution sit on screen briefly
        const eased = Math.max(0, Math.min(1, (p - 0.06) / 0.84));
        stage = Math.min(stages, Math.floor(eased * stages + 0.001));
      }
      if (stage === lastStage) return;
      lastStage = stage;
      sentences.forEach((s, i) => s.classList.toggle('on', i < stage));
      if (attrEl) attrEl.classList.toggle('on', stage > sentences.length);
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    update();
  }

  // ---- FAQ accordion ----
  document.querySelectorAll('[data-faq]').forEach(item => {
    const q = item.querySelector('.faq-q');
    const a = item.querySelector('.faq-a');
    if (!q || !a) return;
    q.addEventListener('click', () => {
      const open = item.classList.contains('open');
      // close siblings
      item.closest('.faq-list')?.querySelectorAll('[data-faq].open').forEach(o => {
        if (o !== item) { o.classList.remove('open'); o.querySelector('.faq-a').style.maxHeight = null; }
      });
      item.classList.toggle('open', !open);
      a.style.maxHeight = !open ? a.scrollHeight + 'px' : null;
    });
  });

  // ---- testimonial carousel ----
  const car = document.querySelector('[data-carousel]');
  if (car) {
    const track = car.querySelector('.t-track');
    const cards = Array.from(track.children);
    let i = 0;
    const go = (n) => {
      i = (n + cards.length) % cards.length;
      track.style.transform = `translateX(calc(${-i * 100}% - ${i * 24}px))`;
      car.querySelectorAll('.t-dot').forEach((d, di) => d.classList.toggle('on', di === i));
    };
    car.querySelector('[data-prev]')?.addEventListener('click', () => go(i - 1));
    car.querySelector('[data-next]')?.addEventListener('click', () => go(i + 1));
    car.querySelectorAll('.t-dot').forEach((d, di) => d.addEventListener('click', () => go(di)));
    let timer = setInterval(() => go(i + 1), 6500);
    car.addEventListener('mouseenter', () => clearInterval(timer));
    car.addEventListener('mouseleave', () => timer = setInterval(() => go(i + 1), 6500));
    window.addEventListener('resize', () => go(i));
  }

  // ---- year ----
  document.querySelectorAll('[data-year]').forEach(el => el.textContent = new Date().getFullYear());

  // ---- Tweaks (pixel display font switcher) ----
  const FONTS = {
    departure:  { label: 'Departure Mono', stack: "'Departure Mono', ui-monospace, monospace" },
    pixelify:   { label: 'Pixelify Sans',  stack: "'Pixelify Sans', monospace" },
    silkscreen: { label: 'Silkscreen',     stack: "'Silkscreen', monospace"    }
  };
  const STORE = 'outlier_tweaks_v2';
  let state = { font: 'departure' };
  try {
    const saved = JSON.parse(localStorage.getItem(STORE) || '{}');
    if (saved && FONTS[saved.font]) state.font = saved.font;
  } catch (e) {}

  const apply = () => {
    const f = FONTS[state.font] || FONTS.departure;
    document.documentElement.style.setProperty('--pixel', f.stack);
  };
  apply();

  const sync = () => {
    document.querySelectorAll('.tw-seg button').forEach(b => b.classList.toggle('on', b.dataset.font === state.font));
  };
  const save = () => {
    try { localStorage.setItem(STORE, JSON.stringify(state)); } catch (e) {}
    try { window.parent.postMessage({ type: '__edit_mode_set_keys', edits: state }, '*'); } catch (e) {}
  };

  // build panel
  const panel = document.createElement('div');
  panel.className = 'tweaks';
  panel.innerHTML = `
    <div class="tweaks-head"><span class="ttl">Tweaks</span><button class="tweaks-close" aria-label="Close">✕</button></div>
    <div class="tw-group">
      <div class="tw-label">Display font</div>
      <div class="tw-seg">
        ${Object.entries(FONTS).map(([k, v]) => `<button data-font="${k}"><span class="px" style="font-family:${v.stack}">${v.label}</span></button>`).join('')}
      </div>
    </div>`;
  document.body.appendChild(panel);

  panel.querySelectorAll('.tw-seg button').forEach(b => b.addEventListener('click', () => { state.font = b.dataset.font; apply(); sync(); save(); }));
  panel.querySelector('.tweaks-close').addEventListener('click', () => {
    panel.classList.remove('open');
    try { window.parent.postMessage({ type: '__edit_mode_dismissed' }, '*'); } catch (e) {}
  });
  sync();

  // host protocol — listener first, then announce
  window.addEventListener('message', (e) => {
    const t = e.data && e.data.type;
    if (t === '__activate_edit_mode') { panel.classList.add('open'); sync(); }
    else if (t === '__deactivate_edit_mode') { panel.classList.remove('open'); }
  });
  try { window.parent.postMessage({ type: '__edit_mode_available' }, '*'); } catch (e) {}
})();
