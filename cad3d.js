/* Damodar Engineering Design – hero 3D render.
   An original centrifugal compressor package: edges draw as a wireframe, the solid render fades in,
   a ghost wireframe with dimensions slides away, then callout labels appear. */
(function () {
  var host = document.getElementById('cad3d');
  if (!host || !window.THREE) return;
  var T = window.THREE;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var renderer;
  try { renderer = new T.WebGLRenderer({ antialias: true, alpha: true }); } catch (e) { return; }
  if (!renderer.getContext()) return;

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputEncoding = T.sRGBEncoding;
  renderer.toneMapping = T.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = T.PCFSoftShadowMap;
  host.appendChild(renderer.domElement);

  var ASPECT = 1.3;
  var scene = new T.Scene();
  if (T.RoomEnvironment) {
    var pm = new T.PMREMGenerator(renderer);
    scene.environment = pm.fromScene(new T.RoomEnvironment(), 0.04).texture;
  }
  var camera = new T.PerspectiveCamera(28, ASPECT, 0.1, 120);
  camera.position.set(12.0, 9.4, 17.0);
  var LOOK = new T.Vector3(-3.5, 1.85, -1.7);
  camera.lookAt(LOOK);

  scene.add(new T.HemisphereLight(0xffffff, 0xa9b9cc, scene.environment ? 0.35 : 0.7));
  var sun = new T.DirectionalLight(0xffffff, scene.environment ? 1.25 : 1.6);
  sun.position.set(7, 14, 9); sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  var sc = sun.shadow.camera; sc.left = -10; sc.right = 10; sc.top = 10; sc.bottom = -10; sc.near = 1; sc.far = 45;
  sun.shadow.bias = -0.0005; sun.shadow.radius = 5;
  scene.add(sun);

  var ground = new T.Mesh(new T.PlaneGeometry(60, 60), new T.ShadowMaterial({ opacity: 0.18 }));
  ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; scene.add(ground);
  var grid = new T.GridHelper(60, 60, 0x2878d0, 0x2878d0);
  grid.material.transparent = true; grid.material.opacity = 0.08; grid.position.y = 0.002; scene.add(grid);

  var rig = new T.Group(); scene.add(rig);
  var mats = [];
  function mat(color, metal, rough) {
    var m = new T.MeshStandardMaterial({ color: color, metalness: metal, roughness: rough, transparent: !reduce, opacity: reduce ? 1 : 0, envMapIntensity: 1 });
    m.color.convertSRGBToLinear(); mats.push(m); return m;
  }
  var M = {
    frame: mat(0x8a96a2, 0.55, 0.42), frameDk: mat(0x5d6874, 0.5, 0.5), deck: mat(0x9aa5b0, 0.5, 0.55),
    steel: mat(0xd5dbe1, 0.92, 0.2), steelDk: mat(0x9aa4ae, 0.85, 0.3),
    blue: mat(0x1e4f9c, 0.35, 0.32), blueDk: mat(0x153c78, 0.35, 0.4), blueLt: mat(0x2c6bc4, 0.3, 0.35),
    yellow: mat(0xf0b400, 0.25, 0.4), panel: mat(0xc3cbd3, 0.4, 0.45), dark: mat(0x323b45, 0.4, 0.5),
    red: mat(0xd2462e, 0.2, 0.45)
  };
  var edgePts = [];
  function add(geo, m, x, y, z, rx, ry, rz, noEdge) {
    var mesh = new T.Mesh(geo, m);
    mesh.position.set(x || 0, y || 0, z || 0);
    mesh.rotation.set(rx || 0, ry || 0, rz || 0);
    mesh.castShadow = true; mesh.receiveShadow = true;
    rig.add(mesh);
    if (!noEdge) edges(mesh);
    return mesh;
  }
  function edges(mesh) {
    mesh.updateMatrix();
    var e = new T.EdgesGeometry(mesh.geometry, 30); e.applyMatrix4(mesh.matrix);
    var a = e.attributes.position.array; for (var i = 0; i < a.length; i++) edgePts.push(a[i]);
  }
  var box = function (w, h, d) { return new T.BoxGeometry(w, h, d); };
  var cylX = function (r, len, seg) { var g = new T.CylinderGeometry(r, r, len, seg || 40); g.rotateZ(Math.PI / 2); return g; };
  var cylY = function (r, len, seg) { return new T.CylinderGeometry(r, r, len, seg || 40); };
  var cylZ = function (r, len, seg) { var g = new T.CylinderGeometry(r, r, len, seg || 40); g.rotateX(Math.PI / 2); return g; };
  var flX = function (r, x, y, z) { add(cylX(r, 0.12, 40), M.steel, x, y, z); };
  var flY = function (r, x, y, z) { add(cylY(r, 0.12, 40), M.steel, x, y, z); };
  var joint = function (r, x, y, z, m) { add(new T.SphereGeometry(r, 28, 20), m || M.steel, x, y, z, 0, 0, 0, true); };
  function wheel(x, y, z, axis) {                                           // yellow valve handwheel
    var g = new T.TorusGeometry(0.16, 0.03, 10, 24);
    if (axis === 'y') g.rotateX(Math.PI / 2); if (axis === 'x') g.rotateY(Math.PI / 2);
    add(g, M.yellow, x, y, z, 0, 0, 0, true);
  }
  function run(pts, r, m) {
    for (var j = 0; j < pts.length - 1; j++) {
      var p0 = new T.Vector3().fromArray(pts[j]), p1 = new T.Vector3().fromArray(pts[j + 1]);
      var mesh = add(new T.CylinderGeometry(r, r, p0.distanceTo(p1), 16), m || M.steel, 0, 0, 0, 0, 0, 0, true);
      mesh.position.copy(p0).add(p1).multiplyScalar(0.5);
      mesh.quaternion.setFromUnitVectors(new T.Vector3(0, 1, 0), p1.clone().sub(p0).normalize());
      edges(mesh);
      if (j < pts.length - 2) joint(r * 1.08, p1.x, p1.y, p1.z, m);
    }
  }

  /* ---------- open fabricated base frame (I-beams) ---------- */
  var L = 11, W = 4, H = 0.5;
  function ibeamX(len, x, z) { add(box(len, H - 0.1, 0.06), M.frame, x, H / 2, z); add(box(len, 0.05, 0.32), M.frame, x, H - 0.025, z); add(box(len, 0.05, 0.32), M.frame, x, 0.025, z); }
  function ibeamZ(len, x) { add(box(0.06, H - 0.1, len), M.frame, x, H / 2, 0); add(box(0.32, 0.05, len), M.frame, x, H - 0.025, 0); add(box(0.32, 0.05, len), M.frame, x, 0.025, 0); }
  ibeamX(L, 0, W / 2 - 0.16); ibeamX(L, 0, -W / 2 + 0.16); ibeamX(L, 0, 0);
  [-5.34, -3.4, -1.1, 1.3, 3.4, 5.34].forEach(function (x) { ibeamZ(W - 0.32, x); });
  add(box(3.6, 0.06, 2.6), M.deck, -1.1, H + 0.03, 0);                       // compressor deck plate
  add(box(3.8, 0.06, 2.4), M.deck, 2.9, H + 0.03, 0);                        // motor deck plate
  add(box(3.2, 0.06, 1.3), M.deck, -3.4, H + 0.03, 1.3);                     // lube oil deck plate
  [[-5.3, 1], [-5.3, -1], [5.3, 1], [5.3, -1]].forEach(function (p) {         // lifting posts
    var z = p[1] * (W / 2 - 0.16);
    add(cylY(0.07, 1.3, 16), M.steelDk, p[0], H + 0.65, z);
    var eye = new T.TorusGeometry(0.13, 0.035, 10, 20); add(eye, M.steelDk, p[0], H + 1.42, z, 0, Math.PI / 4, 0, true);
  });

  /* ---------- centrifugal compressor ---------- */
  var cx = -1.0, cy = 2.15;
  add(box(1.5, 1.15, 1.9), M.blueDk, cx, H + 0.6, 0);                        // pedestal
  add(cylX(1.15, 1.1, 64), M.blue, cx, cy, 0);                               // casing
  var vol = new T.TorusGeometry(1.15, 0.42, 26, 72); vol.rotateY(Math.PI / 2);
  add(vol, M.blue, cx - 0.12, cy, 0);                                        // volute
  add(cylX(0.85, 0.22, 56), M.steel, cx - 0.72, cy, 0);                      // front cover
  var ring = new T.TorusGeometry(1.02, 0.05, 10, 64); ring.rotateY(Math.PI / 2); add(ring, M.steel, cx + 0.56, cy, 0, 0, 0, 0, true);
  add(cylX(0.52, 0.7, 40), M.steel, cx + 0.95, cy, 0);                       // bearing housing
  /* overhead suction loop */
  var sx = cx - 0.25, top = 4.75;
  add(cylY(0.46, 1.25, 40), M.steel, sx, 3.65 + 0.4, 0); flY(0.66, sx, 3.55, 0);
  joint(0.5, sx, top, 0);
  add(cylX(0.46, sx + 4.35, 40), M.steel, (sx - 4.35) / 2, top, 0);
  flX(0.66, -2.6, top, 0); flX(0.66, -2.72, top, 0);
  joint(0.5, -4.35, top, 0);
  add(cylY(0.46, top - 1.15, 40), M.steel, -4.35, (top + 1.15) / 2, 0);
  flY(0.66, -4.35, 1.35, 0); flY(0.66, -4.35, 3.0, 0);
  add(box(0.9, 0.5, 0.9), M.steelDk, -4.35, 0.85, 0);                       // suction inlet base
  add(cylY(0.09, top - 0.95, 16), M.frameDk, -3.0, (top - 0.95) / 2 + 0.5, -0.55); add(box(0.5, 0.08, 1.2), M.frameDk, -3.0, top - 0.5, 0);  // pipe support
  wheel(-2.66, top + 0.75, 0, 'y'); add(cylY(0.03, 0.5, 8), M.steelDk, -2.66, top + 0.5, 0, 0, 0, 0, true);
  /* discharge */
  var dz = 1.1;
  add(cylY(0.36, 1.05, 36), M.steel, cx + 0.1, 3.55, dz); flY(0.52, cx + 0.1, 3.1, dz);
  joint(0.4, cx + 0.1, 4.1, dz);
  add(cylX(0.36, 2.2, 36), M.steel, cx + 1.2, 4.1, dz); flX(0.52, cx + 2.3, 4.1, dz); flX(0.52, cx + 2.42, 4.1, dz);
  /* coupling guard */
  add(box(0.95, 0.85, 0.95), M.yellow, 0.75, cy, 0);

  /* ---------- drive motor ---------- */
  var mx = 2.85;
  add(box(3.0, 0.55, 1.8), M.blueDk, mx, H + 0.33, 0);                       // feet
  add(cylX(1.02, 3.0, 64), M.blue, mx, cy, 0);                               // frame
  for (var i = 0; i < 30; i++) {
    var a = (i / 30) * Math.PI * 2; if (Math.sin(a) < -0.6) continue;
    add(box(2.8, 0.05, 0.14), M.blueLt, mx, cy + Math.sin(a) * 1.06, Math.cos(a) * 1.06, a, 0, 0, true);
  }
  add(cylX(0.9, 0.42, 48), M.blueDk, mx + 1.7, cy, 0);                       // fan cowl
  add(box(0.85, 0.6, 0.7), M.blue, mx - 0.3, cy + 1.32, 0.15);              // terminal box
  [mx - 1.0, mx + 1.0].forEach(function (x) { var e2 = new T.TorusGeometry(0.12, 0.035, 10, 20); add(e2, M.steelDk, x, cy + 1.2, 0, 0, 0, 0, true); });

  /* ---------- lube oil system ---------- */
  add(box(2.3, 1.0, 1.05), M.panel, -3.55, H + 0.56, 1.35);
  var cvs = document.createElement('canvas'); cvs.width = 256; cvs.height = 96;
  var g2 = cvs.getContext('2d'); g2.fillStyle = '#F0B400'; g2.fillRect(0, 0, 256, 96);
  g2.fillStyle = '#1b2430'; g2.font = 'bold 30px Arial'; g2.textAlign = 'center'; g2.fillText('LUBE OIL', 128, 42); g2.fillText('SYSTEM', 128, 78);
  var tex = new T.CanvasTexture(cvs); tex.encoding = T.sRGBEncoding;
  var lm = new T.MeshStandardMaterial({ map: tex, transparent: !reduce, opacity: reduce ? 1 : 0, roughness: 0.6 }); mats.push(lm);
  add(new T.PlaneGeometry(0.8, 0.3), lm, -3.55, H + 0.62, 1.88, 0, 0, 0, true);
  [1.65, 1.1].forEach(function (z) {                                          // pumps
    add(cylX(0.2, 0.55, 24), M.blueLt, -1.95, H + 0.32, z); add(cylX(0.24, 0.06, 24), M.yellow, -2.25, H + 0.32, z, 0, 0, 0, true);
  });
  [-4.75, -4.3].forEach(function (x) {                                        // duplex filters
    add(cylY(0.2, 1.0, 24), M.steel, x, H + 0.95, 1.55); wheel(x, H + 1.55, 1.55, 'y');
  });

  /* ---------- cooling system (shell & tube) ---------- */
  add(cylX(0.42, 2.3, 40), M.steel, 3.3, 1.25, 1.5);
  add(cylX(0.46, 0.25, 40), M.blueLt, 2.05, 1.25, 1.5); add(cylX(0.46, 0.25, 40), M.blueLt, 4.55, 1.25, 1.5);
  add(box(0.12, 0.5, 0.7), M.frameDk, 2.6, 0.8, 1.5); add(box(0.12, 0.5, 0.7), M.frameDk, 4.0, 0.8, 1.5);

  /* ---------- small bore piping & instruments ---------- */
  run([[-2.4, 1.2, 1.35], [-2.4, 1.2, 0.95], [0.2, 1.2, 0.95], [0.2, 1.9, 0.95]], 0.07);
  run([[2.05, 1.25, 1.95], [1.4, 1.25, 1.95], [1.4, 1.25, 1.2], [1.4, 1.9, 1.2]], 0.08);
  run([[4.55, 1.25, 1.05], [4.9, 1.25, 1.05], [4.9, 3.2, 1.05], [4.9, 3.2, 0.5]], 0.08, M.steelDk);
  [-5.05, -4.7].forEach(function (x, k) {                                     // instrument columns
    run([[x, 0.55, -1.25], [x, 3.1 - k * 0.4, -1.25]], 0.06, M.steelDk);
    add(box(0.22, 0.28, 0.18), M.yellow, x, 2.0 - k * 0.3, -1.25, 0, 0, 0, true);
  });
  wheel(1.4, 1.55, 1.42, 'z'); wheel(-0.6, 1.2, 1.15, 'z');

  /* ---------- wireframe + ghost with dimensions ---------- */
  var eg = new T.BufferGeometry(); eg.setAttribute('position', new T.Float32BufferAttribute(edgePts, 3));
  var lineCol = new T.Color(0x2878d0).convertSRGBToLinear();
  var em = new T.LineBasicMaterial({ color: lineCol, transparent: true, opacity: reduce ? 0 : 0.95 });
  var lines = new T.LineSegments(eg, em); rig.add(lines);
  var total = edgePts.length / 3; eg.setDrawRange(0, reduce ? total : 0);

  var ghost = new T.Group(); scene.add(ghost);
  var gm = new T.LineBasicMaterial({ color: lineCol, transparent: true, opacity: reduce ? 0.32 : 0 });
  var ghostGeo = eg.clone(); ghostGeo.setDrawRange(0, Infinity); ghost.add(new T.LineSegments(ghostGeo, gm));
  var dim = [], HT = 5.25;
  function seg(a, b) { dim.push(a[0], a[1], a[2], b[0], b[1], b[2]); }
  function dimLine(a, b, n) { seg(a, b); [a, b].forEach(function (p) { seg([p[0] - n[0], p[1] - n[1], p[2] - n[2]], [p[0] + n[0], p[1] + n[1], p[2] + n[2]]); }); }
  var zf = W / 2 + 0.9, xr = L / 2 + 0.9, xl = -L / 2 - 0.9;
  dimLine([-L / 2, 0, zf], [L / 2, 0, zf], [0, 0, 0.25]); seg([-L / 2, 0, W / 2], [-L / 2, 0, zf + 0.25]); seg([L / 2, 0, W / 2], [L / 2, 0, zf + 0.25]);
  dimLine([xl, 0, W / 2], [xl, HT, W / 2], [0.25, 0, 0]); seg([xl - 0.25, HT, W / 2], [-L / 2, HT, W / 2]);
  var dg = new T.BufferGeometry(); dg.setAttribute('position', new T.Float32BufferAttribute(dim, 3));
  var dm = new T.LineBasicMaterial({ color: new T.Color(0x0b2e50).convertSRGBToLinear(), transparent: true, opacity: reduce ? 0.55 : 0 });
  ghost.add(new T.LineSegments(dg, dm));
  var GHOST_TO = new T.Vector3(-7.4, 0, -3.0);
  if (reduce) ghost.position.copy(GHOST_TO);
  var dimLabels = [
    { p: new T.Vector3(0, 0, zf + 0.5), t: '11,000' },
    { p: new T.Vector3(xl - 0.6, HT / 2, W / 2), t: '5,250' }
  ];

  /* ---------- HTML overlay: callouts + dimension labels ---------- */
  var figure = host.closest('.cad-art');
  var over = document.createElement('div'); over.className = 'cad-over'; host.appendChild(over);
  var svgNS = 'http://www.w3.org/2000/svg';
  var lead = document.createElementNS(svgNS, 'svg'); lead.setAttribute('class', 'cad-leads'); over.appendChild(lead);
  var ICON = {
    suction: '<path d="M4 12h9a4 4 0 1 0-4-4M4 16h12a3 3 0 1 1-3 3"/>',
    compressor: '<circle cx="12" cy="12" r="8"/><path d="M12 4a6 6 0 0 1 0 8 6 6 0 0 0 0 8M4.5 9.5a6 6 0 0 1 7.5 2.5 6 6 0 0 0 7.5 2.5"/><circle cx="12" cy="12" r="1.6"/>',
    motor: '<rect x="4" y="7" width="12" height="10" rx="2"/><path d="M16 12h4M7 7V5h6v2M7 10v4M10 10v4M13 10v4"/>',
    oil: '<path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"/>',
    cooling: '<rect x="4" y="5" width="16" height="14" rx="1.5"/><path d="M8 5v14M12 5v14M16 5v14M4 9h16M4 15h16"/>'
  };
  var callouts = [
    { k: 'suction', t: 'Suction<br>system', a: new T.Vector3(-3.3, 4.75, 0), at: [0.40, 0.07] },
    { k: 'compressor', t: 'Centrifugal<br>compressor', a: new T.Vector3(-1.1, 3.1, 0.6), at: [0.69, 0.05] },
    { k: 'motor', t: 'Drive<br>motor', a: new T.Vector3(3.4, 3.0, 0.5), at: [0.93, 0.30] },
    { k: 'oil', t: 'Lube oil<br>system', a: new T.Vector3(-3.6, 1.1, 1.9), at: [0.40, 0.86] },
    { k: 'cooling', t: 'Cooling<br>system', a: new T.Vector3(4.2, 1.3, 1.9), at: [0.93, 0.80] }
  ];
  callouts.forEach(function (c, i) {
    var el = document.createElement('div'); el.className = 'cad-call'; el.style.setProperty('--n', i);
    el.innerHTML = '<span class="cc-ic"><svg viewBox="0 0 24 24" aria-hidden="true">' + ICON[c.k] + '</svg></span><span class="cc-t">' + c.t + '</span>';
    over.appendChild(el); c.el = el;
    c.line = document.createElementNS(svgNS, 'line'); lead.appendChild(c.line);
    c.dot = document.createElementNS(svgNS, 'circle'); c.dot.setAttribute('r', '3.5'); lead.appendChild(c.dot);
  });
  dimLabels.forEach(function (d) { var el = document.createElement('div'); el.className = 'cad-dim'; el.textContent = d.t; over.appendChild(el); d.el = el; });

  var tmp = new T.Vector3(), W2 = 0, H2 = 0;
  function project(v, obj) { tmp.copy(v); obj.localToWorld(tmp); tmp.project(camera); return [(tmp.x + 1) / 2 * W2, (1 - tmp.y) / 2 * H2]; }
  function layout() {
    callouts.forEach(function (c) {
      var p = project(c.a, rig), lx = c.at[0] * W2, ly = c.at[1] * H2;
      c.el.style.transform = 'translate(' + lx.toFixed(1) + 'px,' + ly.toFixed(1) + 'px)';
      var r = c.el.getBoundingClientRect(), hr = host.getBoundingClientRect();
      var ex = p[0] < lx ? lx : lx + r.width * 0.5, ey = ly + r.height / 2;
      if (p[0] < lx) ex = lx; else if (p[0] > lx + r.width) ex = lx + r.width; else { ex = lx + 22; ey = p[1] > ly ? ly + r.height : ly; }
      c.line.setAttribute('x1', ex); c.line.setAttribute('y1', ey); c.line.setAttribute('x2', p[0]); c.line.setAttribute('y2', p[1]);
      c.dot.setAttribute('cx', p[0]); c.dot.setAttribute('cy', p[1]);
    });
    dimLabels.forEach(function (d) { var p = project(d.p, ghost); d.el.style.opacity = dm.opacity > 0.3 ? 1 : 0; d.el.style.transform = 'translate(' + p[0].toFixed(1) + 'px,' + p[1].toFixed(1) + 'px) translate(-50%,-50%)'; });
  }

  function size() {
    var w = host.clientWidth; if (w < 50) return; var h = Math.round(w / ASPECT);
    W2 = w; H2 = h;
    renderer.setSize(w, h, false); renderer.domElement.style.width = '100%'; renderer.domElement.style.height = 'auto';
    lead.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
    camera.aspect = w / h; camera.updateProjectionMatrix();
  }
  size(); window.addEventListener('resize', size);
  if ('ResizeObserver' in window) new ResizeObserver(size).observe(host);

  var settled = false, t0 = null, visible = true;
  if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { visible = es[0].isIntersecting; }).observe(host);
  var ease = function (x) { return x < 0 ? 0 : x > 1 ? 1 : 1 - Math.pow(1 - x, 3); };
  if (reduce && figure) figure.classList.add('phase-solid', 'phase-labels');

  function frame(t) {
    requestAnimationFrame(frame);
    if (!visible) return;
    if (t0 === null) { t0 = t; if (figure) figure.classList.add('is-3d'); size(); }
    var s = (t - t0) / 1000;
    if (!reduce) {
      var n = Math.floor(ease(s / 2.6) * total); eg.setDrawRange(0, n - (n % 2));      // 0–2.6 s wireframe draws
      var solid = ease((s - 2.3) / 1.3);                                                // 2.3–3.6 s solid appears
      for (var k = 0; k < mats.length; k++) mats[k].opacity = solid;
      if (solid >= 1 && !settled) { settled = true; for (var q = 0; q < mats.length; q++) { mats[q].transparent = false; mats[q].needsUpdate = true; } }
      em.opacity = 0.95 * (1 - solid);
      var gs = ease((s - 3.0) / 1.6);                                                   // 3.0–4.6 s ghost slides out
      ghost.position.copy(GHOST_TO).multiplyScalar(gs);
      gm.opacity = 0.38 * gs; dm.opacity = 0.6 * ease((s - 4.2) / 0.8);
      if (figure) { figure.classList.toggle('phase-solid', solid > 0.5); figure.classList.toggle('phase-labels', s > 4.4); }
      rig.rotation.y = Math.sin(Math.max(0, s - 4.4) * 0.22) * 0.08;
    }
    renderer.render(scene, camera);
    layout();
  }
  requestAnimationFrame(frame);
})();
