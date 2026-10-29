/* Damodar Engineering Design – 3D compressor package: wireframe draws first, then the solid render. */
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
  renderer.toneMappingExposure = 0.92;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = T.PCFSoftShadowMap;
  host.appendChild(renderer.domElement);

  var scene = new T.Scene();
  var camera = new T.PerspectiveCamera(26, 1.24, 0.1, 100);
  camera.position.set(14.2, 9.6, 16.6);
  camera.lookAt(0.2, 2.05, 0);

  scene.add(new T.HemisphereLight(0xffffff, 0x9fb0c4, 0.62));
  var sun = new T.DirectionalLight(0xffffff, 1.55);
  sun.position.set(6, 12, 8); sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  var sc = sun.shadow.camera; sc.left = -8; sc.right = 8; sc.top = 8; sc.bottom = -8; sc.near = 1; sc.far = 40;
  sun.shadow.bias = -0.0004; sun.shadow.radius = 4;
  scene.add(sun);
  var fill = new T.DirectionalLight(0xdbe8ff, 0.45); fill.position.set(-8, 5, -4); scene.add(fill);

  var ground = new T.Mesh(new T.PlaneGeometry(40, 40), new T.ShadowMaterial({ opacity: 0.16 }));
  ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; scene.add(ground);

  var rig = new T.Group(); scene.add(rig);
  var mats = [];
  function mat(color, metal, rough) {
    var m = new T.MeshStandardMaterial({ color: color, metalness: metal == null ? 0.35 : metal, roughness: rough == null ? 0.45 : rough, transparent: !reduce, opacity: reduce ? 1 : 0 });
    m.color.convertSRGBToLinear(); mats.push(m); return m;
  }
  var M = {
    frame: mat(0x5f6b78, 0.25, 0.55), deck: mat(0x8f9aa6, 0.2, 0.7), steel: mat(0xaab4be, 0.3, 0.32),
    dark: mat(0x3a444f, 0.3, 0.5), motor: mat(0x1a56a0, 0.2, 0.4), motorDk: mat(0x123f78, 0.2, 0.5),
    yellow: mat(0xe8b100, 0.1, 0.45), grille: mat(0x262e37, 0.3, 0.6), blue: mat(0x2a78d0, 0.2, 0.4),
    red: mat(0xd2462e, 0.1, 0.5), panel: mat(0xbfc8d1, 0.15, 0.6)
  };
  var edgePts = [];
  function add(geo, m, x, y, z, rx, ry, rz, noEdge) {
    var mesh = new T.Mesh(geo, m);
    mesh.position.set(x || 0, y || 0, z || 0);
    mesh.rotation.set(rx || 0, ry || 0, rz || 0);
    mesh.castShadow = true; mesh.receiveShadow = true;
    rig.add(mesh);
    if (!noEdge) {
      mesh.updateMatrixWorld(true);
      var e = new T.EdgesGeometry(geo, 28); e.applyMatrix4(mesh.matrixWorld);
      var a = e.attributes.position.array; for (var i = 0; i < a.length; i++) edgePts.push(a[i]);
    }
    return mesh;
  }
  var box = function (w, h, d) { return new T.BoxGeometry(w, h, d); };
  var cylX = function (r, len, seg) { var g = new T.CylinderGeometry(r, r, len, seg || 40); g.rotateZ(Math.PI / 2); return g; };
  var cylY = function (r, len, seg) { return new T.CylinderGeometry(r, r, len, seg || 40); };
  var cylZ = function (r, len, seg) { var g = new T.CylinderGeometry(r, r, len, seg || 40); g.rotateX(Math.PI / 2); return g; };

  /* ---------- fabricated base frame ---------- */
  var L = 11, W = 4.2;
  add(box(L, 0.42, 0.28), M.frame, 0, 0.21, W / 2 - 0.14);
  add(box(L, 0.42, 0.28), M.frame, 0, 0.21, -W / 2 + 0.14);
  [-5.36, -3, -0.6, 1.8, 4.2, 5.36].forEach(function (x) { add(box(0.26, 0.42, W - 0.56), M.frame, x, 0.21, 0); });
  add(box(L, 0.06, W), M.deck, 0, 0.45, 0, 0, 0, 0);
  [[-5.2, 1], [-5.2, -1], [5.2, 1], [5.2, -1]].forEach(function (p) {                       // yellow lifting lugs
    add(box(0.42, 0.42, 0.08), M.yellow, p[0], 0.62, p[1] * (W / 2 + 0.04));
    add(cylZ(0.09, 0.1, 16), M.dark, p[0], 0.7, p[1] * (W / 2 + 0.06), 0, 0, 0, true);
  });

  /* ---------- centrifugal compressor ---------- */
  var cx = -2.7, cy = 2.0;
  add(box(1.3, 0.9, 1.6), M.dark, cx, 0.93, 0);                                             // pedestal
  add(cylX(1.02, 1.05, 56), M.steel, cx, cy, 0);                                            // casing
  var vol = new T.TorusGeometry(1.0, 0.36, 22, 64); vol.rotateY(Math.PI / 2);
  add(vol, M.steel, cx - 0.1, cy, 0);                                                       // volute
  add(cylX(1.18, 0.12, 56), M.steel, cx + 0.55, cy, 0);                                     // bolting flange
  add(cylX(0.5, 0.7, 32), M.steel, cx + 0.95, cy, 0);                                       // bearing housing
  /* suction (horizontal, along -x) */
  add(cylX(0.46, 2.6, 40), M.steel, cx - 2.05, cy, 0);
  add(cylX(0.66, 0.14, 40), M.steel, cx - 0.82, cy, 0);
  add(cylX(0.66, 0.14, 40), M.steel, cx - 3.35, cy, 0);
  add(box(0.18, cy - 0.5, 0.7), M.frame, cx - 2.6, (cy - 0.5) / 2 + 0.48, 0);                // pipe support
  /* discharge (vertical) */
  add(cylY(0.36, 2.0, 36), M.steel, cx, cy + 2.0, 0);
  add(cylY(0.52, 0.12, 36), M.steel, cx, cy + 1.05, 0);
  add(cylY(0.52, 0.12, 36), M.steel, cx, cy + 3.0, 0);
  var arrow = new T.ConeGeometry(0.22, 0.42, 24); add(arrow, M.red, cx, cy + 3.5, 0, 0, 0, 0, true);

  /* ---------- coupling guard + motor ---------- */
  add(box(1.0, 0.82, 0.92), M.yellow, -0.95, cy, 0);
  var mx = 1.25;
  add(box(2.6, 0.4, 1.6), M.motorDk, mx, 0.68, 0);                                           // motor feet
  add(cylX(0.98, 2.7, 56), M.motor, mx, cy, 0);                                              // frame
  for (var i = 0; i < 18; i++) {                                                             // cooling fins
    var a = (i / 18) * Math.PI * 2; if (Math.sin(a) < -0.55) continue;
    add(box(2.5, 0.06, 0.16), M.motorDk, mx, cy + Math.sin(a) * 1.02, Math.cos(a) * 1.02, a, 0, 0, true);
  }
  add(cylX(0.86, 0.5, 48), M.motorDk, mx + 1.55, cy, 0);                                     // fan cowl
  add(box(0.7, 0.55, 0.6), M.motor, mx + 0.2, cy + 1.1, 0.25);                               // terminal box

  /* ---------- air cooler ---------- */
  var kx = 4.45;
  add(box(1.3, 2.6, 2.8), M.panel, kx, 1.78, 0);
  var gr = add(box(0.04, 2.1, 2.3), M.grille, kx + 0.67, 1.85, 0, 0, 0, 0, true);
  for (var g = 0; g < 9; g++) add(box(0.02, 2.1, 0.03), M.steel, kx + 0.7, 1.85, -1.05 + g * 0.26, 0, 0, 0, true);
  for (var h2 = 0; h2 < 7; h2++) add(box(0.02, 0.03, 2.3), M.steel, kx + 0.7, 0.95 + h2 * 0.3, 0, 0, 0, 0, true);

  /* ---------- lube oil system + pumps (front of skid) ---------- */
  add(box(1.7, 1.05, 1.0), M.panel, -2.3, 1.0, 1.45);
  var cvs = document.createElement('canvas'); cvs.width = 256; cvs.height = 96;
  var cx2 = cvs.getContext('2d'); cx2.fillStyle = '#F2C12E'; cx2.fillRect(0, 0, 256, 96);
  cx2.fillStyle = '#1b2430'; cx2.font = 'bold 30px Arial'; cx2.textAlign = 'center'; cx2.fillText('LUBE OIL', 128, 42); cx2.fillText('SYSTEM', 128, 78);
  var tex = new T.CanvasTexture(cvs); tex.encoding = T.sRGBEncoding;
  var lm = new T.MeshStandardMaterial({ map: tex, transparent: !reduce, opacity: reduce ? 1 : 0, roughness: 0.6 }); mats.push(lm);
  add(new T.PlaneGeometry(0.75, 0.3), lm, -2.3, 1.12, 1.952, 0, 0, 0, true);
  add(cylX(0.18, 0.55, 24), M.blue, -0.9, 0.72, 1.55);
  add(cylX(0.18, 0.55, 24), M.blue, -0.9, 0.72, 1.05);
  add(cylY(0.22, 0.9, 24), M.steel, 0.1, 0.94, 1.55);                                        // filters
  add(cylY(0.22, 0.9, 24), M.steel, 0.65, 0.94, 1.55);

  /* ---------- secondary piping ---------- */
  function run(pts, r, m) {
    for (var j = 0; j < pts.length - 1; j++) {
      var p0 = new T.Vector3().fromArray(pts[j]), p1 = new T.Vector3().fromArray(pts[j + 1]);
      var len = p0.distanceTo(p1), g2 = new T.CylinderGeometry(r, r, len, 16);
      var mesh = add(g2, m, 0, 0, 0, 0, 0, 0, true);
      mesh.position.copy(p0).add(p1).multiplyScalar(0.5);
      mesh.quaternion.setFromUnitVectors(new T.Vector3(0, 1, 0), p1.clone().sub(p0).normalize());
      add(new T.SphereGeometry(r * 1.05, 12, 10), m, p1.x, p1.y, p1.z, 0, 0, 0, true);
    }
  }
  run([[-1.45, 1.0, 1.45], [-1.45, 1.0, 0.75], [-1.45, 1.55, 0.75], [-2.0, 1.55, 0.75]], 0.07, M.steel);
  run([[0.65, 1.39, 1.55], [0.65, 1.7, 1.55], [3.6, 1.7, 1.55], [3.6, 1.7, 0.9]], 0.08, M.steel);
  run([[3.8, 0.6, -1.2], [3.8, 2.6, -1.2], [2.6, 2.6, -1.2], [2.6, 2.6, -0.6]], 0.09, M.steel);
  add(cylZ(0.12, 0.22, 16), M.red, 3.6, 1.7, 1.25, 0, 0, 0, true);                          // valves
  add(cylZ(0.12, 0.22, 16), M.blue, -1.45, 1.0, 1.15, 0, 0, 0, true);


  /* ---------- wireframe ---------- */
  var eg = new T.BufferGeometry();
  eg.setAttribute('position', new T.Float32BufferAttribute(edgePts, 3));
  var em = new T.LineBasicMaterial({ color: new T.Color(0x2878d0).convertSRGBToLinear(), transparent: true, opacity: reduce ? 0 : 0.95 });
  var lines = new T.LineSegments(eg, em); rig.add(lines);
  var total = edgePts.length / 3;
  eg.setDrawRange(0, reduce ? total : 0);

  function size() {
    var w = host.clientWidth; if (w < 50) return; var h = Math.round(w / 1.24);
    renderer.setSize(w, h, false); renderer.domElement.style.width = '100%'; renderer.domElement.style.height = 'auto';
    camera.aspect = w / h; camera.updateProjectionMatrix();
  }
  size(); window.addEventListener('resize', size);

  var settled = false;
  if ('ResizeObserver' in window) new ResizeObserver(function () { size(); }).observe(host);
  var t0 = null, visible = true, figure = host.closest('.cad-art');
  if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { visible = es[0].isIntersecting; }).observe(host);
  var ease = function (x) { return x < 0 ? 0 : x > 1 ? 1 : 1 - Math.pow(1 - x, 3); };

  function frame(t) {
    requestAnimationFrame(frame);
    if (!visible) return;
    if (t0 === null) { t0 = t; if (figure) figure.classList.add('is-3d'); size(); }
    var s = (t - t0) / 1000;
    if (!reduce) {
      var draw = ease(s / 2.4);                                   // 0 – 2.4 s : lines draw
      var n = Math.floor(draw * total); eg.setDrawRange(0, n - (n % 2));
      var solid = ease((s - 2.2) / 1.3);                          // 2.2 – 3.5 s : solids appear
      for (var k = 0; k < mats.length; k++) mats[k].opacity = solid;
      if (solid >= 1 && !settled) { settled = true; for (var q = 0; q < mats.length; q++) { mats[q].transparent = false; mats[q].needsUpdate = true; } }
      em.opacity = 0.95 - 0.8 * solid;
      if (figure) figure.classList.toggle('phase-solid', solid > 0.5);
      rig.rotation.y = Math.sin(s * 0.25) * 0.22;
    }
    renderer.render(scene, camera);
  }
  requestAnimationFrame(frame);
})();
