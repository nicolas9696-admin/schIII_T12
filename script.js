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
      <circle cx="80" cy="104" r="9" fill="${hole}"/>
      <circle cx="120" cy="104" r="9" fill="${hole}"/>
      <circle cx="100" cy="133" r="9" fill="${hole}"/>`;

    if (kind === 't1') {
      return wrap(plate +
        `<circle cx="82" cy="100" r="10" fill="${hole}"/><circle cx="118" cy="100" r="10" fill="${hole}"/>`);
    }
    if (kind === 't13') {
      // collerette hexagonale discrète, en léger renfoncement (comme la vraie T13)
      const hex = '74,72 126,72 150,105 126,138 74,138 50,105';
      const collar = `
        <polygon points="${hex}" fill="#f1f4f7" stroke="#c6cdd6" stroke-width="1.8"/>
        <polygon points="${hex}" fill="none" stroke="#ffffff" stroke-width="1.2" opacity=".9"/>`;
      return wrap(plate + collar + screw + holes3);
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

  /* ===================================================================
     DANGER LAB — fault scenarios
     =================================================================== */
  const lab = {
    svg: $('#labSvg'),
    enclosure: $('#labEnclosure'),
    glow: $('#dangerGlow'),
    breakMark: $('#breakMark'),
    switchArm: $('#switchArm'),
    person: $('#personG'),
    verdict: $('#verdict'),
    vText: $('.v-text', $('#verdict')),
    vIcon: $('.v-icon', $('#verdict')),
    desc: $('#verdictDesc'),
    pulse: $('#labPulse'),
    pulse2: $('#labPulse2')
  };

  // Coordonnées calquées sur les fils réellement dessinés dans le SVG
  const LOOP = [[90,175],[470,175],[515,175],[550,175],[580,175],[580,215],[515,215],[470,215],[90,215]];
  const FAULTS = {
    normal: {
      label: 'Tout va bien', icon: '✔', bad: false,
      desc: "Le courant part de la phase (brun), traverse l'appareil et revient par le neutre (bleu). Le boîtier reste à 0 volt : aucun danger.",
      show: { break: false, glow: false, person: 0.5, switchOpen: false },
      path: LOOP,
      danger: false
    },
    cut: {
      label: 'Danger : boîtier sous tension', icon: '⚡', bad: true,
      desc: "Le fil neutre est coupé en aval. Comme il servait AUSSI de protection (le pont N→PE), le courant cherche un autre retour : il passe par le boîtier métallique puis par la personne qui le touche. Le boîtier est sous tension et le fusible ne saute pas.",
      show: { break: true, glow: true, person: 1, switchOpen: false },
      path: [[90,175],[470,175],[515,175],[580,175],[580,215],[515,215],[500,250],[545,250],[544,270],[556,345]],
      danger: true
    },
    swap: {
      label: 'Danger : boîtier sous tension', icon: '⚡', bad: true,
      desc: "La phase et le neutre ont été inversés à un raccordement. Le pont amène alors directement la PHASE sur le boîtier — même interrupteur ouvert, appareil éteint. Toucher le boîtier revient à toucher la phase.",
      show: { break: false, glow: true, person: 1, switchOpen: true },
      path: [[90,215],[470,215],[515,215],[500,250],[545,250],[544,270],[556,345]],
      danger: true
    },
    nobridge: {
      label: 'Danger latent : plus aucune protection', icon: '⚡', bad: true,
      desc: "Lors d'un remplacement de prise, le petit pont N→PE a été oublié. Le boîtier n'est plus relié à rien : pas de tension tout de suite… mais au premier défaut interne, plus rien ne le met à la terre ni ne fait sauter le fusible.",
      show: { break: false, glow: true, person: 1, switchOpen: false, noBridge: true },
      path: LOOP,
      danger: true, latent: true
    }
  };

  let anim = null, t = 0;
  function stopAnim() { if (anim) cancelAnimationFrame(anim); anim = null; }

  function lerpPath(pts, tt) {
    // total length
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

  function applyFault(key) {
    const f = FAULTS[key];
    stopAnim();
    // toggles
    lab.breakMark.setAttribute('opacity', f.show.break ? '1' : '0');
    lab.glow.classList.toggle('on', !!f.show.glow);
    lab.glow.classList.toggle('warn', !!f.latent);
    lab.person.setAttribute('opacity', f.show.person);
    lab.switchArm.style.transform = f.show.switchOpen ? 'rotate(-24deg)' : 'none';
    lab.switchArm.style.transformOrigin = '45px 55px';
    $('#bridgeG').style.opacity = f.show.noBridge ? '0.18' : '1';

    // enclosure danger state (fill léger pour rester lisible)
    if (f.danger && !f.latent) {
      lab.enclosure.style.stroke = 'var(--danger)';
      lab.enclosure.style.fill = 'rgba(255,77,79,.06)';
    } else if (f.latent) {
      lab.enclosure.style.stroke = 'var(--warn)';
      lab.enclosure.style.fill = 'rgba(240,160,32,.05)';
    } else {
      lab.enclosure.style.stroke = 'var(--ok)';
      lab.enclosure.style.fill = '#1b2439';
    }

    // verdict
    lab.verdict.classList.toggle('bad', f.bad);
    lab.vText.textContent = f.label;
    lab.vIcon.textContent = f.icon;
    lab.desc.textContent = f.desc;

    // animate current dot(s)
    const dangerFlow = f.danger && !f.latent;
    lab.pulse.setAttribute('opacity', '1');
    lab.pulse.setAttribute('fill', 'var(--phase)');
    lab.pulse2.setAttribute('opacity', dangerFlow ? '1' : '0');

    t = 0;
    const speed = dangerFlow ? 0.012 : 0.007;
    const loop = () => {
      t += speed; if (t > 1) t = 0;
      const p = lerpPath(f.path, t);
      lab.pulse.setAttribute('cx', p[0]); lab.pulse.setAttribute('cy', p[1]);
      if (dangerFlow) {
        const p2 = lerpPath(f.path, (t + 0.5) % 1);
        lab.pulse2.setAttribute('cx', p2[0]); lab.pulse2.setAttribute('cy', p2[1]);
      }
      anim = requestAnimationFrame(loop);
    };
    loop();
  }

  $$('.lab-btn').forEach(b => b.addEventListener('click', () => {
    $$('.lab-btn').forEach(x => x.classList.remove('active'));
    b.classList.add('active');
    applyFault(b.dataset.fault);
  }));
  applyFault('normal');

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

  /* pause heavy animations when tab hidden */
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { stopAnim(); if (ddrAnim) cancelAnimationFrame(ddrAnim), ddrAnim = null; }
    else {
      if (!ddrAnim) ddrLoop();
      const active = $('.lab-btn.active'); if (active) applyFault(active.dataset.fault);
    }
  });
})();
