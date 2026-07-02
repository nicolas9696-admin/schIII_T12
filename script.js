/* ===================================================================
   Schéma III / T12 — interactions
   =================================================================== */
(function () {
  'use strict';
  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  /* ---------- NAV: scrolled state + mobile toggle ---------- */
  const nav = $('#nav');
  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
    $('#toTop').classList.toggle('show', window.scrollY > 600);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  $('#navToggle').addEventListener('click', () => $('.nav-links').classList.toggle('open'));
  $$('.nav-links a').forEach(a => a.addEventListener('click', () => $('.nav-links').classList.remove('open')));
  $('#toTop').addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ---------- Reveal on scroll ---------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('reveal'); io.unobserve(e.target); } });
  }, { threshold: 0.12 });
  $$('.sec-head,.card,.compare-col,.step,.law-card,.mini-card,.tl-item').forEach(el => io.observe(el));

  /* ===================================================================
     TIMELINE — plug selector
     =================================================================== */
  const PLUGS = {
    t1: {
      title: 'Type 1 (T1) — la vénérable « à deux broches »',
      desc: "Une des plus anciennes prises suisses. Deux broches rondes, sans contact de protection accessible au même niveau. Typique des installations d'après-guerre.",
      flags: [['bad', 'Sans protection moderne'], ['neutral', '≈ 1955']],
      svg: socketSVG('t1')
    },
    t12: {
      title: 'Type 12 — le symbole des installations à assainir',
      desc: "Trois contacts (phase, neutre, terre) mais SANS collerette de protection. Au branchement/débranchement, les doigts peuvent frôler des broches encore sous tension. Interdite à la vente, au remplacement et au déplacement depuis 2017.",
      flags: [['bad', 'Interdite depuis 2017'], ['bad', 'Pas de collerette'], ['neutral', 'Souvent liée au schéma III']],
      svg: socketSVG('t12')
    },
    sep: {
      title: '1974 — le conducteur de protection posé séparément',
      desc: "Tournant réglementaire : à partir de 1974, le fil de protection (PE) est enfin tiré séparément du neutre. C'est le début de la fin pour la mise au neutre selon le schéma III, définitivement dépassée dès 1985.",
      flags: [['good', 'PE séparé du neutre'], ['neutral', 'Étape historique']],
      svg: flagSVG()
    },
    t13: {
      title: 'Type 13 — la norme d\'aujourd\'hui',
      desc: "Trois contacts AVEC collerette de protection : impossible de toucher une broche sous tension pendant la manipulation. C'est la prise à installer dans toute nouvelle installation depuis le 1ᵉʳ janvier 2017.",
      flags: [['good', 'Obligatoire depuis 2017'], ['good', 'Protection au contact'], ['neutral', 'Système TN']],
      svg: socketSVG('t13')
    },
    rcd: {
      title: 'DDR 30 mA — la protection généralisée',
      desc: "Depuis la NIBT 2010, les prises courantes (jusqu'à 32 A) doivent être protégées par un disjoncteur différentiel à courant résiduel de 30 mA. Il coupe l'alimentation en une fraction de seconde en cas de fuite à travers un corps. Impossible à réaliser correctement en schéma III.",
      flags: [['good', 'Anti-électrocution'], ['good', 'Anti-incendie'], ['bad', 'Incompatible schéma III']],
      svg: rcdSVG()
    }
  };

  // Prise suisse (vue de face), fidèle aux modèles réels
  function socketSVG(kind) {
    const wrap = inner => `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">${inner}</svg>`;
    const plate = `
      <rect x="10" y="10" width="180" height="180" rx="24" fill="#eef1f4" stroke="#c7ced7" stroke-width="2"/>
      <rect x="30" y="30" width="140" height="140" rx="14" fill="#fafbfc" stroke="#dbe0e7" stroke-width="1.5"/>`;
    const hole = '#171b20';
    const screw = `
      <circle cx="100" cy="80" r="8" fill="#c2c8cf" stroke="#98a0aa" stroke-width="1.5"/>
      <line x1="93.5" y1="80" x2="106.5" y2="80" stroke="#7c838c" stroke-width="1.8"/>`;
    const holes3 = `
      <circle cx="80" cy="104" r="6" fill="${hole}"/>
      <circle cx="120" cy="104" r="6" fill="${hole}"/>
      <circle cx="100" cy="133" r="6" fill="${hole}"/>`;

    if (kind === 't1') {
      return wrap(plate +
        `<circle cx="82" cy="100" r="10" fill="${hole}"/><circle cx="118" cy="100" r="10" fill="${hole}"/>`);
    }
    if (kind === 't13') {
      const screwT13 = `
        <circle cx="99" cy="88" r="7.5" fill="#c2c8cf" stroke="#98a0aa" stroke-width="1.5"/>
        <line x1="93" y1="88" x2="105" y2="88" stroke="#7c838c" stroke-width="1.6"/>`;
      const holesT13 = `
        <circle cx="82" cy="110" r="6" fill="${hole}"/>
        <circle cx="118" cy="108" r="6" fill="${hole}"/>
        <circle cx="100" cy="132" r="6" fill="${hole}"/>`;
      // collerette hexagonale asymétrique (penche à droite), biseau doux comme la vraie T13
      const hex = '72,80 120,76 152,108 120,140 72,138 48,110';
      const hexIn = '77,85 118,82 144,108 117,134 77,132 55,110';
      const collar = `
        <polygon points="${hex}" fill="#e7ebf0" stroke="#aab3bf" stroke-width="2.2"/>
        <polygon points="${hex}" fill="none" stroke="#ffffff" stroke-width="1.2" opacity=".9"/>
        <polygon points="${hexIn}" fill="#fbfcfd" stroke="#cfd6de" stroke-width="1.4"/>`;
      return wrap(plate + collar + screwT13 + holesT13);
    }
    // T12 : face plate, sans collerette
    return wrap(plate + screw + holes3);
  }
  function flagSVG() {
    return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="86" fill="#1b2439" stroke="#26324a" stroke-width="3"/>
      <line x1="72" y1="50" x2="72" y2="150" stroke="#4f9dff" stroke-width="5" stroke-linecap="round"/>
      <path d="M72 54 h56 l-14 18 14 18 h-56 z" fill="#4f9dff" opacity=".85"/>
      <text x="100" y="170" text-anchor="middle" fill="#a6b3c9" font-size="15" font-family="Inter">1974</text>
    </svg>`;
  }
  function rcdSVG() {
    return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect x="52" y="46" width="96" height="108" rx="12" fill="#1c2740" stroke="#4f9dff" stroke-width="3"/>
      <rect x="86" y="60" width="28" height="18" rx="4" fill="#f0a020"/>
      <text x="100" y="74" text-anchor="middle" fill="#20160a" font-size="12" font-weight="700" font-family="Inter">T</text>
      <line x1="72" y1="96" x2="128" y2="96" stroke="#a9793f" stroke-width="4" stroke-linecap="round"/>
      <line x1="72" y1="116" x2="128" y2="116" stroke="#3f8fe0" stroke-width="4" stroke-linecap="round"/>
      <text x="100" y="144" text-anchor="middle" fill="#39b972" font-size="15" font-weight="700" font-family="Inter">30 mA</text>
    </svg>`;
  }

  function selectPlug(key) {
    const p = PLUGS[key]; if (!p) return;
    $('#plugSvg').outerHTML = p.svg.replace('<svg', '<svg id="plugSvg" class="plug-svg" role="img"');
    $('#plugTitle').textContent = p.title;
    $('#plugDesc').textContent = p.desc;
    $('#plugFlags').innerHTML = p.flags.map(([t, l]) => `<span class="pflag ${t}">${l}</span>`).join('');
    $$('.tl-item').forEach(i => i.classList.toggle('active', i.dataset.plug === key));
  }
  $$('.tl-item').forEach(i => i.addEventListener('click', () => selectPlug(i.dataset.plug)));
  selectPlug('t13');

  /* utilitaire partagé (DDR + scène) : position le long d'une polyligne */
  function lerpPath(pts, tt) {
    let segs = [], total = 0;
    for (let i = 0; i < pts.length - 1; i++) {
      const dx = pts[i+1][0]-pts[i][0], dy = pts[i+1][1]-pts[i][1];
      const len = Math.hypot(dx, dy); segs.push(len); total += len;
    }
    let d = tt * total;
    for (let i = 0; i < segs.length; i++) {
      if (d <= segs[i]) {
        const r = d / segs[i];
        return [pts[i][0] + (pts[i+1][0]-pts[i][0]) * r, pts[i][1] + (pts[i+1][1]-pts[i][1]) * r];
      }
      d -= segs[i];
    }
    return pts[pts.length - 1];
  }

  /* ===================================================================
     DDR DEMO
     =================================================================== */
  const ddr = {
    pa: $('#ddrPulseA'), pb: $('#ddrPulseB'),
    status: $('#ddrStatus'), leak: $('#leakPath'),
    person: $('#personDDR'), btn: $('#ddrLeakBtn'),
    outP: $('#ddrPhaseOut'), outN: $('#ddrNeutralOut')
  };
  let ddrAnim = null, dt = 0, leaking = false;
  const ddrLoop = () => {
    dt += 0.01; if (dt > 1) dt = 0;
    // phase dot: entrée -> DDR -> descente dans l'appareil
    const pa = lerpPath([[40,66],[347,66],[347,150]], dt);
    ddr.pa.setAttribute('cx', pa[0]); ddr.pa.setAttribute('cy', pa[1]);
    ddr.pa.setAttribute('fill', 'var(--phase)');
    if (!leaking) {
      const pb = lerpPath([[315,150],[315,94],[40,94]], dt);
      ddr.pb.setAttribute('cx', pb[0]); ddr.pb.setAttribute('cy', pb[1]);
      ddr.pb.setAttribute('fill', 'var(--neutral)');
    } else {
      // fuite : de l'appareil vers la personne
      const pb = lerpPath([[315,216],[290,244],[258,254]], dt);
      ddr.pb.setAttribute('cx', pb[0]); ddr.pb.setAttribute('cy', pb[1]);
      ddr.pb.setAttribute('fill', 'var(--danger)');
    }
    ddrAnim = requestAnimationFrame(ddrLoop);
  };
  ddr.pa.setAttribute('r', '4'); ddr.pb.setAttribute('r', '4');
  ddrLoop();

  ddr.btn.addEventListener('click', () => {
    leaking = !leaking;
    if (leaking) {
      ddr.leak.setAttribute('opacity', '1');
      ddr.person.setAttribute('opacity', '1');
      ddr.status.textContent = 'Déséquilibre → coupure !';
      ddr.status.classList.add('trip');
      ddr.btn.textContent = '↺ Rétablir';
      // simulate trip: cut output wires after a beat
      setTimeout(() => {
        if (!leaking) return;
        ddr.outP.style.opacity = '.2'; ddr.outN.style.opacity = '.2';
      }, 700);
    } else {
      ddr.leak.setAttribute('opacity', '0');
      ddr.person.setAttribute('opacity', '0');
      ddr.status.textContent = 'Équilibré ✔';
      ddr.status.classList.remove('trip');
      ddr.btn.textContent = '⚡ Simuler une fuite';
      ddr.outP.style.opacity = '1'; ddr.outN.style.opacity = '1';
    }
  });

  /* ===================================================================
     SCÈNE — installation × situation (dont les 3 défauts du schéma III)
     =================================================================== */
  const scene = {
    wrap: $('#sceneWrap'), pulse: $('#scenePulse'), cap: $('#sceneCaption'),
    fuseBox: $('#fuseBox'), fuseTxt: $('#fuseTxt'),
    person: $('#scenePerson'), personLbl: $('#personLbl'),
    pont: $('#pont'), scenBtns: $('#scenBtns')
  };
  const OVL = ['gBolt', 'gCut', 'gSwap', 'gNobridge'];
  // toutes les trajectoires partent de la source (fusible) pour montrer d'où vient le courant
  const LOOP_N    = [[108,62],[244,62],[244,152],[272,152],[272,86],[108,86]];
  const PATH_PE   = [[108,62],[244,62],[244,152],[238,176],[214,250],[212,286],[150,286],[150,304]];
  const PATH_BODY = [[108,62],[244,62],[244,152],[238,176],[300,205],[356,228],[430,212],[430,252],[420,304]];
  // neutre coupé : phase (bleu) -> remonte le neutre jaune -> jonction -> prend le pont vert-jaune -> à travers la machine -> l'homme -> le sol
  const PATH_CUT  = [[108,62],[244,62],[244,152],[272,152],[272,124],[306,124],[306,176],[356,228],[430,212],[430,252],[420,304]];
  const PATH_SWAP = [[108,86],[272,86],[272,124],[306,124],[306,176],[356,228],[430,212],[430,252],[420,304]];
  const SC = {
    modern_ok: {
      install: 'modern', tone: 'ok', col: 'var(--phase)', path: LOOP_N, spd: 0.006,
      fuse: ['sous tension', 'f-ok'], pers: ['', 'p-none'], show: [],
      cap: "Fonctionnement normal&nbsp;: le courant circule entre la phase et le neutre. Le " +
           "<b>fil de sécurité</b> (vert‑jaune) ne transporte rien — il attend, prêt à agir."
    },
    modern_fault: {
      install: 'modern', tone: 'safe', col: 'var(--pe)', path: PATH_PE, spd: 0.01,
      fuse: ['SAUTÉ ✔', 'f-good'], pers: ["à l'abri ✔", 'p-safe'], show: ['gBolt'],
      cap: "Un fil se détache et touche le boîtier. Le <b>fil de sécurité</b> l'évacue aussitôt vers le " +
           "sol&nbsp;: un fort courant passe et <b>fait sauter le fusible</b>. Vous êtes à l'abri."
    },
    sch3_ok: {
      install: 'sch3', tone: 'warn', col: 'var(--phase-old)', path: LOOP_N, spd: 0.006,
      fuse: ['sous tension', 'f-ok'], pers: ['', 'p-none'], show: [],
      cap: "En apparence, tout marche. Le boîtier est relié au neutre par un pont&nbsp;: tant que rien ne " +
           "casse, il reste à 0&nbsp;V. C'est <b>l'illusion de sécurité</b> du schéma III."
    },
    cut: {
      install: 'sch3', tone: 'danger', col: 'var(--danger)', path: PATH_CUT, spd: 0.009,
      fuse: ['resté actif ✗', 'f-bad'], pers: ['⚡ électrisé', 'p-live'], show: ['gBolt', 'gCut'],
      cap: "<b>Neutre coupé.</b> Le seul fil qui servait de « terre » est interrompu. Au moindre défaut, " +
           "plus d'évacuation&nbsp;: le courant traverse le boîtier, puis <b>vous</b>. Le fusible ne saute pas."
    },
    swap: {
      install: 'sch3', tone: 'danger', col: 'var(--danger)', path: PATH_SWAP, spd: 0.011,
      fuse: ['resté actif ✗', 'f-bad'], pers: ['⚡ électrisé', 'p-live'], show: ['gSwap'],
      cap: "<b>Phase et neutre inversés</b> à un raccordement. Le pont amène alors la phase " +
           "<b>directement sur le boîtier</b> — dangereux même appareil éteint et interrupteur ouvert."
    },
    nobridge: {
      install: 'sch3', tone: 'danger', col: 'var(--danger)', path: PATH_BODY, spd: 0.011,
      fuse: ['resté actif ✗', 'f-bad'], pers: ['⚡ électrisé', 'p-live'], show: ['gBolt', 'gNobridge'],
      cap: "<b>Pont oublié.</b> Lors d'un changement de prise, la liaison au boîtier n'a pas été refaite. " +
           "Le boîtier n'est plus relié à rien&nbsp;: au défaut, rien ne l'évacue ni ne fait sauter le fusible."
    }
  };
  const CASES = {
    modern: [['ok', 'Sans défaut'], ['fault', 'Avec défaut']],
    sch3: [['ok', 'Sans défaut'], ['cut', 'Neutre coupé'], ['swap', 'Phase/neutre inversés'], ['nobridge', 'Pont oublié']]
  };
  let sceneAnim = null, st = 0, sceneInstall = 'modern', sceneCase = 'ok';
  function effKey() {
    if (sceneInstall === 'modern') return sceneCase === 'ok' ? 'modern_ok' : 'modern_fault';
    return sceneCase === 'ok' ? 'sch3_ok' : sceneCase;
  }
  function stopScene() { if (sceneAnim) cancelAnimationFrame(sceneAnim); sceneAnim = null; }
  function renderScene() {
    stopScene();
    const c = SC[effKey()];
    scene.wrap.dataset.install = c.install;
    scene.wrap.dataset.tone = c.tone;
    OVL.forEach(id => { const el = document.getElementById(id); if (el) el.style.display = c.show.includes(id) ? '' : 'none'; });
    if (scene.pont) scene.pont.style.opacity = c.show.includes('gNobridge') ? '0.22' : '1';
    scene.fuseBox.setAttribute('class', 'box ' + c.fuse[1]);
    scene.fuseTxt.setAttribute('class', c.fuse[1] + '-t');
    scene.fuseTxt.textContent = c.fuse[0];
    scene.personLbl.textContent = c.pers[0];
    scene.personLbl.setAttribute('class', c.pers[1]);
    scene.person.classList.toggle('live', c.pers[1] === 'p-live');
    scene.cap.innerHTML = c.cap;
    scene.pulse.setAttribute('fill', c.col);
    scene.pulse.setAttribute('opacity', '1');
    st = 0;
    const loop = () => {
      st += c.spd; if (st > 1) st = 0;
      const p = lerpPath(c.path, st);
      scene.pulse.setAttribute('cx', p[0]); scene.pulse.setAttribute('cy', p[1]);
      sceneAnim = requestAnimationFrame(loop);
    };
    loop();
  }
  function buildCases() {
    scene.scenBtns.innerHTML = CASES[sceneInstall]
      .map((o, i) => `<button class="scene-btn2${i === 0 ? ' active' : ''}" data-case="${o[0]}" role="tab">${o[1]}</button>`).join('');
    sceneCase = 'ok';
    $$('.scene-btn2', scene.scenBtns).forEach(b => b.addEventListener('click', () => {
      $$('.scene-btn2', scene.scenBtns).forEach(x => x.classList.remove('active'));
      b.classList.add('active'); sceneCase = b.dataset.case; renderScene();
    }));
  }
  $$('.scene-btn').forEach(b => b.addEventListener('click', () => {
    $$('.scene-btn').forEach(x => x.classList.remove('active'));
    b.classList.add('active'); sceneInstall = b.dataset.install; buildCases(); renderScene();
  }));
  buildCases(); renderScene();

  /* pause heavy animations when tab hidden */
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopScene();
      if (ddrAnim) cancelAnimationFrame(ddrAnim), ddrAnim = null;
    } else {
      if (!ddrAnim) ddrLoop();
      renderScene();
    }
  });
})();
