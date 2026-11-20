(function () {
  'use strict';

  var stage = document.querySelector('.stage');
  var morph = document.getElementById('morph');
  var glyph = document.getElementById('reflect-glyph');
  var S_PATH = 'M52 48 L148 48 L148 66 L70 66 L70 84 L148 84 L148 152 L52 152 L52 134 L130 134 L130 102 L52 102 L52 84 Z';
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Hero strike sequence: drop in, ZIP slash, ZAP bolt, then the finished tile.
  if (stage) {
    if (reduceMotion) {
      ['is-drop', 'is-zip', 'is-zap', 'is-done'].forEach(function (c) { stage.classList.add(c); });
      if (morph) morph.remove();
      if (glyph) glyph.setAttribute('d', S_PATH);
    } else {
      var steps = [
        [0, 'is-drop'],
        [700, 'is-zip'],
        [1300, 'is-zap'],
        [1900, 'is-done']
      ];
      steps.forEach(function (step) {
        setTimeout(function () { stage.classList.add(step[1]); }, step[0]);
      });
      // Reflection morphs its Z into an S shortly after the strike lands.
      if (morph && morph.beginElement) {
        setTimeout(function () { morph.beginElement(); }, 2300);
      }

      // Pointer parallax on the tile.
      var hero = document.querySelector('.hero');
      hero.addEventListener('pointermove', function (e) {
        var px = (e.clientX / window.innerWidth) - 0.5;
        var py = (e.clientY / window.innerHeight) - 0.5;
        stage.style.setProperty('--px', (px * 2).toFixed(3));
        stage.style.setProperty('--py', (py * 2).toFixed(3));
      });
      hero.addEventListener('pointerleave', function () {
        stage.style.setProperty('--px', 0);
        stage.style.setProperty('--py', 0);
      });

      // Device tilt where the browser allows it without a permission prompt.
      window.addEventListener('deviceorientation', function (e) {
        if (e.gamma == null || e.beta == null) return;
        stage.style.setProperty('--px', (Math.max(-30, Math.min(30, e.gamma)) / 30).toFixed(3));
        stage.style.setProperty('--py', ((Math.max(-30, Math.min(30, e.beta - 45)) / 30)).toFixed(3));
      });
    }
  }

  // Highlight the nav link for the section in view.
  var links = document.querySelectorAll('.site-nav a');
  var sections = ['top', 'apps', 'about', 'support', 'contact']
    .map(function (id) { return document.getElementById(id); })
    .filter(Boolean);
  if ('IntersectionObserver' in window && sections.length) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (link) {
          link.classList.toggle('is-active', link.getAttribute('href') === '#' + entry.target.id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { observer.observe(s); });
  }
})();
