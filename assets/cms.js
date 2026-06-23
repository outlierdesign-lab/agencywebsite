/* Outliers at Play · Sanity content renderer (runtime, no build step).
   Renders the Works grid (#work-grid) and case-study pages (#cs-root).
   If the CMS isn't configured yet, the grid keeps its static fallback markup. */
(function () {
  var S = window.SANITY || {};
  var DATASET = S.dataset || 'production';
  var CONFIGURED = !!S.projectId && S.projectId !== 'YOUR_PROJECT_ID';
  var API_VERSION = 'v2022-03-07';

  // ---- query helpers ----
  function query(groq) {
    var url =
      'https://' + S.projectId + '.apicdn.sanity.io/' + API_VERSION +
      '/data/query/' + DATASET + '?query=' + encodeURIComponent(groq);
    return fetch(url).then(function (r) { return r.json(); }).then(function (d) { return d.result; });
  }
  function img(url, w) {
    if (!url) return '';
    return url + '?auto=format&fit=max' + (w ? '&w=' + w : '');
  }
  function esc(s) {
    return (s == null ? '' : String(s))
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  var GRID_Q =
    '*[_type=="project"]|order(order asc){title,"slug":slug.current,subtitle,funding,"cover":coverImage.asset->url}';

  var FULL_Q =
    '*[_type=="project"]|order(order asc){' +
    'title,"slug":slug.current,subtitle,kicker,funding,year,client,services,stage,timeline,tagline,' +
    '"cover":coverImage.asset->url,overview,challenge,whatWeDid,' +
    '"pair":galleryPair[].asset->url,"feature":featureImage.asset->url,outcome,quote,results}';

  // ---- Works grid ----
  function frame(p) {
    if (p.cover) {
      return '<div class="frame"><div class="ph" data-label="" style="background-image:url(\'' +
        img(p.cover, 900) + '\');background-size:cover;background-position:center"></div></div>';
    }
    return '<div class="frame"><div class="ph" data-label="' + esc(p.title) + '"></div></div>';
  }
  function card(p) {
    var meta =
      '<div class="work-meta"><div><div class="t">' + esc(p.title) + '</div>' +
      '<div class="s">' + esc(p.subtitle || '') + '</div></div>' +
      (p.funding ? '<div class="fund">' + esc(p.funding) + '</div>' : '') + '</div>';
    return '<a href="work/case.html?slug=' + encodeURIComponent(p.slug) +
      '" class="work-card in" style="opacity:1">' + frame(p) + meta + '</a>';
  }
  function renderGrid() {
    var grid = document.querySelector('#work-grid');
    if (!grid || !CONFIGURED) return; // keep static fallback
    query(GRID_Q).then(function (items) {
      if (items && items.length) grid.innerHTML = items.map(card).join('');
    }).catch(function () { /* keep static fallback */ });
  }

  // ---- Case study ----
  function metaItem(k, v) {
    if (!v) return '';
    return '<div class="mi"><div class="k">' + esc(k) + '</div><div class="v">' + esc(v) + '</div></div>';
  }
  function block(n, label, inner) {
    return '<div class="cs-block reveal"><div class="lbl"><span class="n">' + esc(n) + '</span>' +
      esc(label) + '</div><div class="cs-rich">' + inner + '</div></div>';
  }
  function paras(arr) { return (arr || []).map(function (t) { return '<p>' + esc(t) + '</p>'; }).join(''); }
  function bullets(arr) {
    return '<ul class="cs-list cs-rich">' +
      (arr || []).map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul>';
  }
  function shot(url) {
    if (url) {
      return '<div class="ph" data-label="" style="background-image:url(\'' +
        img(url, 1400) + '\');background-size:cover;background-position:center"></div>';
    }
    return '<div class="ph" data-label=""></div>';
  }
  function notice(msg) {
    return '<header class="cs-hero"><div class="wrap">' +
      '<a href="/#work" class="cs-back btn">← Back to all works</a>' +
      '<p class="tagline" style="margin-top:30px">' + esc(msg) + '</p></div></header>';
  }

  function caseHTML(p, next) {
    var kicker = '<div class="cs-kicker reveal"><span class="step">' + esc(p.kicker || p.subtitle || '') + '</span>' +
      (p.funding ? '<span class="fund">' + esc(p.funding) + '</span>' : '') + '</div>';
    var meta = '<div class="cs-meta reveal">' +
      metaItem('Client', p.client) + metaItem('Services', p.services) +
      metaItem(p.stage ? 'Stage' : 'Timeline', p.stage || p.timeline) + metaItem('Year', p.year) + '</div>';
    var hero = '<header class="cs-hero"><div class="wrap">' +
      '<a href="/#work" class="cs-back btn reveal">← Back to all works</a>' +
      kicker +
      '<h1 class="reveal">' + esc(p.title) + '</h1>' +
      (p.tagline ? '<p class="tagline reveal">' + esc(p.tagline) + '</p>' : '') +
      meta + '</div></header>';
    var cover = '<section class="cs-cover"><div class="wrap reveal">' + shot(p.cover) + '</div></section>';
    var body = '<section class="cs-body"><div class="wrap">' +
      block('OVERVIEW', 'The brief', '<p class="big">' + esc(p.overview || '') + '</p>') +
      (p.challenge && p.challenge.length ? block('01', 'The challenge', paras(p.challenge)) : '') +
      (p.pair && p.pair.length
        ? '<div class="cs-gallery two">' + p.pair.map(function (u) { return shot(u); }).join('') + '</div>' : '') +
      (p.whatWeDid && p.whatWeDid.length ? block('02', 'What we did', bullets(p.whatWeDid)) : '') +
      (p.feature ? '<div class="cs-gallery full">' + shot(p.feature) + '</div>' : '') +
      (p.outcome ? block('03', 'The outcome', '<p>' + esc(p.outcome) + '</p>') : '') +
      '</div></section>';
    var quote = (p.quote && p.quote.text)
      ? '<section class="cs-quote"><div class="wrap reveal"><blockquote>“' + esc(p.quote.text) + '”</blockquote>' +
        '<div class="who"><span class="ph circle av" data-label=""></span><span>' +
        '<span class="nm">' + esc(p.quote.name || '') + '</span><br/>' +
        '<span class="rl">' + esc(p.quote.role || '') + '</span></span></div></div></section>' : '';
    var results = (p.results && p.results.length)
      ? '<section class="cs-results"><div class="wrap"><span class="eyebrow reveal">Results</span><div class="rg">' +
        p.results.map(function (r) {
          return '<div class="rc reveal"><div class="n">' + esc(r.value) + '</div><div class="l">' + esc(r.label) + '</div></div>';
        }).join('') + '</div></div></section>' : '';
    var nextS = next
      ? '<section class="cs-next"><div class="wrap"><a href="case.html?slug=' + encodeURIComponent(next.slug) +
        '" class="reveal"><div><div class="k">Next project</div><div class="t">' + esc(next.title) +
        '</div></div><span class="arrow">→</span></a></div></section>' : '';
    return hero + cover + body + quote + results + nextS;
  }

  function reveal(root) {
    root.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('in'); el.style.opacity = '1'; });
  }

  function renderCase() {
    var root = document.querySelector('#cs-root');
    if (!root) return;
    if (!CONFIGURED) { root.innerHTML = notice('The CMS isn’t connected yet. Add your Sanity Project ID in assets/cms-config.js.'); return; }
    var slug = new URLSearchParams(location.search).get('slug');
    if (!slug) { root.innerHTML = notice('No project specified.'); return; }
    query(FULL_Q).then(function (list) {
      if (!list || !list.length) { root.innerHTML = notice('No projects found in the CMS yet.'); return; }
      var idx = -1;
      for (var i = 0; i < list.length; i++) { if (list[i].slug === slug) { idx = i; break; } }
      if (idx < 0) { root.innerHTML = notice('Project not found.'); return; }
      var p = list[idx];
      var next = list.length > 1 ? list[(idx + 1) % list.length] : null;
      document.title = p.title + ' · Case Study · Outliers at Play';
      root.innerHTML = caseHTML(p, next);
      reveal(root);
    }).catch(function () {
      root.innerHTML = notice('Could not load this project. Check the connection and your Sanity CORS settings.');
    });
  }

  function init() { renderGrid(); renderCase(); }
  if (document.readyState !== 'loading') init();
  else document.addEventListener('DOMContentLoaded', init);
})();
