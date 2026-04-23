/*!
 * enhance.js — kasidit-site client enhancements
 * Purpose: progressive enhancement for the static landing page.
 *   initSkillGallery()   — fetch catalog.json, render command + agent cards
 *   initCopyButtons()    — clipboard copy for [data-copy] buttons
 *   initFadeUp()         — IntersectionObserver reveal animations
 *   initSmoothAnchors()  — smooth-scroll for in-page anchors (reduced-motion aware)
 *   init()               — DOMContentLoaded entry; isolates module failures
 */
(function () {
  'use strict';

  // Map command-name prefix → pill text. Agents always "specialist".
  var CMD_CATEGORY = {
    'kasi-init': 'project', 'kasi-scaffold': 'project', 'kasi-docs': 'project', 'kasi-status': 'project',
    'kasi-review': 'mission', 'kasi-security': 'mission', 'kasi-fix': 'mission',
    'kasi-ui': 'mission', 'kasi-cascade': 'mission', 'kasi-multi': 'mission',
    'kasi-promote': 'gravity', 'kasi-pull': 'gravity', 'kasi-sync': 'gravity',
    'kasi-search': 'meta', 'kasi-wiki-sync': 'meta'
  };

  // GitHub wiki base — deep-link target for each gallery card.
  var WIKI_BASE = 'https://github.com/kasidit-wansudon/kasidit/wiki/';

  function escapeHtml(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function categoryFor(item) {
    var src = (item && item.source_file) || '';
    if (src.indexOf('agents/') === 0) return 'specialist';
    if (src.indexOf('commands/') === 0) {
      return CMD_CATEGORY[item.name] || 'command';
    }
    return 'skill';
  }

  // Convert "foo-bar-baz" → "Foo-Bar-Baz" (PascalCase each segment, keep hyphens).
  function pascalHyphen(s) {
    return String(s || '').split('-').map(function (p) {
      if (!p) return p;
      return p.charAt(0).toUpperCase() + p.slice(1).toLowerCase();
    }).join('-');
  }

  // Compute wiki page slug for a catalog item.
  //   commands: kasi-wiki-sync   → Kasi-Wiki-Sync
  //   agents:   bug-hunter       → Agent-Bug-Hunter
  function wikiPageFor(item) {
    var src  = (item && item.source_file) || '';
    var name = (item && item.name) || '';
    if (src.indexOf('agents/') === 0) {
      return 'Agent-' + pascalHyphen(name);
    }
    if (src.indexOf('commands/') === 0) {
      // strip leading "kasi-" if present, re-add canonical "Kasi-" prefix
      var tail = name.indexOf('kasi-') === 0 ? name.slice(5) : name;
      return 'Kasi-' + pascalHyphen(tail);
    }
    return pascalHyphen(name);
  }

  function wikiUrlFor(item) {
    return WIKI_BASE + wikiPageFor(item);
  }

  function cardHtml(item) {
    var name = escapeHtml(item.name);
    var desc = escapeHtml(item.description);
    var cat  = escapeHtml(categoryFor(item));
    var href = escapeHtml(wikiUrlFor(item));
    return '<a class="card skill-card fade-up card-link" href="' + href + '" target="_blank" rel="noopener">' +
             '<h3 class="font-mono text-amber-400 text-lg mb-1">' + name + '</h3>' +
             '<p class="text-slate-300 text-sm mb-3">' + desc + '</p>' +
             '<span class="pill">' + cat + '</span>' +
             '<span class="ext" aria-hidden="true">&rarr;</span>' +
           '</a>';
  }

  function renderInto(el, items) {
    if (!el) return;
    if (!items || !items.length) {
      el.innerHTML = '<p class="text-slate-400 text-sm">No entries yet.</p>';
      return;
    }
    el.innerHTML = items.map(cardHtml).join('');
  }

  function renderFallback() {
    var msg = '<p class="text-slate-400 text-sm">Catalog unavailable — see GitHub.</p>';
    var c = document.getElementById('commands-grid');
    var a = document.getElementById('agents-grid');
    if (c) c.innerHTML = msg;
    if (a) a.innerHTML = msg;
  }

  function initSkillGallery() {
    var cmdEl = document.getElementById('commands-grid');
    var agEl  = document.getElementById('agents-grid');
    if (!cmdEl && !agEl) return;
    fetch('data/catalog.json', { cache: 'no-cache' })
      .then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      })
      .then(function (data) {
        renderInto(cmdEl, (data && data.commands) || []);
        renderInto(agEl,  (data && data.agents)   || []);
        // Newly injected .fade-up cards need observer attachment.
        attachFadeUp(document.querySelectorAll('.fade-up:not(.is-visible)'));
      })
      .catch(function (err) {
        console.error('[enhance] catalog fetch failed:', err);
        renderFallback();
      });
  }

  function fallbackCopy(text) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'absolute';
    ta.style.left = '-9999px';
    document.body.appendChild(ta);
    ta.select();
    var ok = false;
    try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
    document.body.removeChild(ta);
    return ok;
  }

  function flashCopied(btn) {
    var original = btn.getAttribute('data-original-label') || btn.textContent;
    btn.setAttribute('data-original-label', original);
    btn.textContent = 'Copied';
    btn.classList.add('copied');
    setTimeout(function () {
      btn.textContent = original;
      btn.classList.remove('copied');
    }, 1500);
  }

  function initCopyButtons() {
    var btns = document.querySelectorAll('[data-copy]');
    for (var i = 0; i < btns.length; i++) {
      (function (btn) {
        btn.addEventListener('click', function (ev) {
          ev.preventDefault();
          var text = btn.getAttribute('data-copy') || '';
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text)
              .then(function () { flashCopied(btn); })
              .catch(function () { if (fallbackCopy(text)) flashCopied(btn); });
          } else if (fallbackCopy(text)) {
            flashCopied(btn);
          }
        });
      })(btns[i]);
    }
  }

  // Shared observer so all fade-up elements (incl. injected ones) share one instance.
  var _io = null;
  function getObserver() {
    if (_io || !('IntersectionObserver' in window)) return _io;
    _io = new IntersectionObserver(function (entries, obs) {
      for (var i = 0; i < entries.length; i++) {
        var e = entries[i];
        if (e.isIntersecting && e.intersectionRatio >= 0.25) {
          e.target.classList.add('is-visible');
          obs.unobserve(e.target);
        }
      }
    }, { threshold: 0.25, rootMargin: '0px 0px -10% 0px' });
    return _io;
  }

  function attachFadeUp(nodes) {
    if (!nodes || !nodes.length) return;
    if (!('IntersectionObserver' in window)) {
      for (var i = 0; i < nodes.length; i++) nodes[i].classList.add('is-visible');
      return;
    }
    var io = getObserver();
    for (var j = 0; j < nodes.length; j++) io.observe(nodes[j]);
  }

  function initFadeUp() {
    attachFadeUp(document.querySelectorAll('.fade-up'));
  }

  function initSmoothAnchors() {
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var behavior = reduce ? 'auto' : 'smooth';
    var links = document.querySelectorAll('a[href^="#"]');
    for (var i = 0; i < links.length; i++) {
      (function (a) {
        a.addEventListener('click', function (ev) {
          var href = a.getAttribute('href');
          if (!href || href === '#' || href.length < 2) return;
          var target = document.getElementById(href.slice(1));
          if (!target) return;
          ev.preventDefault();
          target.scrollIntoView({ behavior: behavior, block: 'start' });
          if (history.pushState) history.pushState(null, '', href);
        });
      })(links[i]);
    }
  }

  function safe(fn, label) {
    try { fn(); } catch (err) { console.error('[enhance] ' + label + ' failed:', err); }
  }

  function init() {
    safe(initFadeUp,       'initFadeUp');
    safe(initCopyButtons,  'initCopyButtons');
    safe(initSmoothAnchors,'initSmoothAnchors');
    safe(initSkillGallery, 'initSkillGallery');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
