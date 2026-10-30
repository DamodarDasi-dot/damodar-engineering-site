"""Builds the service pages from index.html.

Run from the project root after changing index.html:  python tools/build_pages.py
Writes assets/site.css (the home page styles plus service-page styles), the reverse
logo files used by the service pages, and services/<slug>/index.html.
"""
import json, os, re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITE = 'https://damodarengineering.com'
home = open(os.path.join(ROOT, 'index.html'), encoding='utf-8').read()


def between(s, a, b, start=0):
    i = s.index(a, start)
    j = s.index(b, i) + len(b)
    return s[i:j]


def write(rel, text):
    path = os.path.join(ROOT, rel)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w', encoding='utf-8', newline='\n') as f:
        f.write(text)


# ---------- shared stylesheet: everything the home page uses, plus the service-page layout
SVC_CSS = r'''
/* service pages */
.brand .logo-img{display:block;height:46px;width:auto;max-width:calc(100vw - 112px)}
@media (min-width:881px){.brand .logo-img{height:76px;max-width:none}}
.svc-hero{position:relative;background:var(--canvas);border-bottom:1px solid var(--line);padding:calc(var(--hdr-h) + env(safe-area-inset-top,0px) + 28px) 0 clamp(40px,6vw,64px);
  background-image:linear-gradient(color-mix(in srgb,var(--line) 45%,transparent) 1px,transparent 1px),linear-gradient(90deg,color-mix(in srgb,var(--line) 45%,transparent) 1px,transparent 1px);background-size:40px 40px}
.svc-hero-in{display:grid;grid-template-columns:minmax(0,1.4fr) minmax(0,.9fr);gap:clamp(24px,4vw,48px);align-items:start}
.crumbs ol{list-style:none;margin:0 0 8px;padding:0;display:flex;flex-wrap:wrap;align-items:center;column-gap:8px;font-size:13px;color:var(--muted)}
.crumbs li{display:flex;align-items:center;gap:8px}
.crumbs li+li::before{content:"/";color:var(--line)}
.crumbs a{display:inline-flex;align-items:center;min-height:44px;color:var(--blue-ink);text-decoration:none;font-weight:600}
.crumbs a:hover{text-decoration:underline}
.svc-hero h1{font-family:var(--f-display);font-size:clamp(2rem,4.4vw,3.1rem);line-height:1.08;letter-spacing:-.03em;margin:8px 0 18px}
.svc-intro p{margin:0 0 14px;font-size:16.5px;line-height:1.65;color:var(--ink);max-width:64ch}
.svc-intro p+p{color:var(--muted)}
.svc-hero-ctas{display:flex;flex-wrap:wrap;gap:12px;margin-top:22px}
.svc-glance{background:var(--surface);border:1px solid var(--line);border-radius:var(--r);box-shadow:var(--sh-1);padding:20px;display:flex;flex-direction:column;gap:16px}
.svc-glance .svc-ic{width:64px;height:64px;padding:10px}
.svc-glance h2{font-size:15px;font-weight:700;margin:0 0 8px;font-family:var(--f-sans);letter-spacing:0}
.svc-two{display:grid;grid-template-columns:1fr 1fr;gap:16px}
.svc-list{list-style:none;margin:0;padding:0!important;display:grid;gap:10px!important}
.svc-list li{display:flex;gap:10px;align-items:flex-start;font-size:15px;color:var(--ink)}
.svc-list li::before{content:"";width:8px;height:8px;margin-top:8px;border-radius:2px;background:var(--gold);flex:none}
.svc-codes{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:12px}
.svc-codes .tag{font-size:13px;padding:4px 10px}
.svc-proj{grid-template-columns:repeat(auto-fill,minmax(300px,1fr))}
.svc-steps-link{display:inline-flex;align-items:center;min-height:44px;margin-top:12px;font-weight:600;color:var(--blue-ink);text-decoration:none}
.svc-steps-link:hover{text-decoration:underline}
.cta-band{background:var(--navy-2);color:var(--on-navy);padding-block:clamp(48px,6vw,72px);border-bottom:1px solid rgba(255,255,255,.08)}
.cta-band .wrap{display:flex;flex-wrap:wrap;gap:24px;align-items:center;justify-content:space-between}
.cta-band h2{font-family:var(--f-display);font-size:clamp(1.5rem,2.8vw,2rem);color:#fff;margin-bottom:8px}
.cta-band p{margin:0;color:var(--navy-muted);max-width:56ch}
.cta-acts{display:flex;flex-wrap:wrap;gap:12px}
.cta-band .b3.secondary{color:#fff;border-color:rgba(255,255,255,.55)}
.cta-band .b3.secondary:hover{background:rgba(255,255,255,.08)}
.cta-band :focus-visible{outline-color:var(--gold)}
.rel-svc{display:flex;flex-wrap:wrap;gap:8px 20px;margin-top:20px}
.rel-svc a{display:inline-flex;align-items:center;min-height:44px;color:var(--blue-ink);font-weight:600;text-decoration:none}
.rel-svc a:hover{text-decoration:underline}
.cta-band .rel-svc a{color:var(--gold)}
.cta-band p{color:#C3C7D6}
@media (max-width:880px){.svc-hero-in,.svc-two{grid-template-columns:1fr}}
@media (max-width:420px){.svc-proj{grid-template-columns:1fr}}
'''
style = between(home, '<style>', '</style>')[len('<style>'):-len('</style>')]
write('assets/site.css', style.strip() + '\n' + SVC_CSS.lstrip())

# ---------- reverse logo files (navy background) from the header lockup
tag_svg = between(home, '<svg class="logo logo-tag"', '</svg>')
fills = {'lg-gold': '#D9A04A', 'lg-name': '#FFFFFF', 'lg-sub': '#C9D1DB', 'lg-div': '#3A3C5C'}
rev = tag_svg.replace('<svg class="logo logo-tag"', '<svg xmlns="http://www.w3.org/2000/svg"').replace(' aria-hidden="true"', '')
for c, f in fills.items():
    rev = rev.replace('class="%s"' % c, 'fill="%s"' % f)
rev = re.sub(r' id="lg-[a-z]+"', '', rev)
write('images/logo-reverse-tag.svg', rev + '\n')
compact = re.sub(r'<rect fill="#D9A04A" x="(0|519\.0)" y="145\.5"[^>]*/>', '', rev)
compact = re.sub(r'<path fill="#FFFFFF" transform="translate\(55\.0,153\.1\)" d="[^"]*"/>', '', compact)
compact = compact.replace('<g transform="translate(323.3,40)">', '<g transform="translate(323.3,58.5)">')
assert compact.count('<rect') == 1 and compact != rev
write('images/logo-reverse.svg', compact + '\n')

# ---------- page chrome copied from the home page, with links pointed back at it
def rehome(html):
    return html.replace('href="#top"', 'href="/"').replace('href="#', 'href="/#')

LOGO = ('<picture><source media="(min-width: 881px)" srcset="/images/logo-reverse-tag.svg">'
        '<img class="logo-img" src="/images/logo-reverse.svg" alt="" width="851" height="173"></picture>')
header = between(home, '<header class="top">', '</header>')
brand = between(header, '<a class="brand"', '</a>')
header = rehome(header.replace(brand, '<a class="brand" href="#top" aria-label="Damodar Engineering Design home">' + LOGO + '</a>'))
sprite = between(home, '<svg class="sprite"', '</defs></svg>')
menu = rehome(between(home, '<div class="menu-backdrop"', '</aside>'))
fabs = rehome(between(home, '<a class="fab-quote"', '</button>', home.index('</aside>')))
footer = between(home, '<footer>', '</footer>')
flogo = between(footer, '<svg class="logo f-logo"', '</svg>')
footer = rehome(footer.replace(flogo, '<img class="f-logo" src="/images/logo-reverse.svg" alt="" width="851" height="173">'))
js_menu = between(home, "(function(){\n  var hdr=document.querySelector('.top')", '\n})();')
js_fab = between(home, '(function(){\n  // phones: floating', '\n})();')
js_fab = js_fab.replace("[document.querySelector('.hero3-ctas'),document.getElementById('contact'),document.querySelector('footer')]",
                        "[document.querySelector('.svc-hero-ctas'),document.querySelector('.cta-band'),document.querySelector('footer')]")
assert '.svc-hero-ctas' in js_fab
fonts = between(home, '<link rel="preconnect" href="https://fonts.googleapis.com">', 'display=swap">')

# ---------- facts reused from the home page
def project(ref):
    found = [a for a in re.findall(r'<article class="card" data-c="[a-z0-9]+">.*?</article>', home, re.S)
             if '<span class="eyebrow">Ref ' + ref + '</span>' in a]
    assert len(found) == 1, ref
    art = re.sub(r'^<article class="card" data-c="[a-z0-9]+">\s*(<!--.*?-->)?', '', found[0], flags=re.S)[:-len('</article>')]
    link = '<a href="/#projects">All project experience →</a>'
    if '<div class="card-foot code"><span class="status">' in art:
        art = art[:art.rindex('</div>')] + link + '</div>'
    else:
        art += '<div class="card-foot code">' + link + '</div>'
    return '<article class="card">' + art + '</article>'

stages = re.findall(r'<li><div class="pipe-st"><span class="pipe-n code">\d+</span><h3>(.*?)</h3></div><dl>.*?<dt class="code">Engineering activity</dt><dd>(.*?)</dd>', home)
assert len(stages) == 7, len(stages)
DISCLAIMER = 'Applicable codes depend on the project specification and agreed scope; listing a code does not imply certification.'
assert DISCLAIMER in home

PAGES = [
 dict(slug='compressor-package-design', icon='i-comp', crumb='Compressor package design',
      title='Compressor Package Design UAE | Damodar Engineering Design',
      desc='Compressor and compander package design in the UAE: package GA, lube-oil and seal-gas console layouts, process piping and base frames, with FAT support.',
      h1='Compressor &amp; compander package design',
      intro=['Damodar Engineering Design provides compressor package design for fabricators, EPC contractors and equipment OEMs in the UAE, the GCC and India. Package layouts, lube-oil consoles, seal-gas racks, process piping and heavy base frames are developed together in one 3D assembly, then issued as GA and fabrication drawings in your title block.',
             'The work draws on compressor and compander packages designed in previous roles for a global compressor OEM, including a four-stage N₂ compander package for a shipyard newbuild and a four-stage natural gas compressor redesign that completed FAT in Singapore. Nozzle load checks are carried out by agreement, and FAT is supported on request.'],
      scope=['Process piping integration &amp; nozzle orientation', 'Lube-oil consoles &amp; seal-gas rack layouts', 'Heavy base frames &amp; acoustic enclosures', 'Suction/discharge piping &amp; tie-ins', 'Support layout &amp; FAT support; nozzle load checks by agreement'],
      deliver=['Package GA', 'Lube-oil &amp; seal-gas layouts', 'Piping &amp; base frame integration', 'Shop drawings', 'Weight &amp; CoG report'],
      codes=['API 614', 'API 617', 'API 692', 'ASME B31.3', 'ASME B16.5'], projects=['C-01', 'C-03']),
 dict(slug='skid-package-design', icon='i-skid', crumb='Skid &amp; package design',
      title='Skid &amp; Package Design UAE | Damodar Engineering Design',
      desc='Industrial skid design in the UAE: 3D SolidWorks models, GA and fabrication drawings, piping isometrics, base frames and BOMs for skid-mounted packages.',
      h1='Industrial skid &amp; package design',
      intro=['Industrial skid design for packaged equipment: 3D SolidWorks models, GA and fabrication drawings, welding and assembly drawings, piping isometrics and BOM schedules for skid-mounted packages. Work is delivered for fabricators, EPC contractors and OEMs across the UAE, the GCC and India, as a complete design package or as single deliverables that plug into your team’s workflow.',
             'Each skid is designed with the workshop in mind. Base frames, drip trays and lifting lugs, valve and instrument access, centre of gravity and transport are checked in the model before drawings are issued, so fewer questions reach the shop floor.'],
      scope=['3D SolidWorks modelling &amp; GA', 'Fabrication, welding &amp; assembly drawings', 'Piping isometrics &amp; BOM schedules', 'Base frames, drip trays &amp; lifting lugs', 'Beam selection, gussets &amp; anchor layouts', 'Pump baseplates &amp; vibration pads'],
      deliver=['3D assembly model', 'GA drawings', 'Fabrication &amp; assembly drawings', 'Piping isometrics &amp; BOM', 'Base frame fabrication drawings', 'Weight &amp; CoG report'],
      codes=['ASME B31.3', 'ASME B16.5', 'ASME B16.9'], projects=['C-03', 'P-01', 'F-07']),
 dict(slug='psa-nitrogen-package-design', icon='i-psa', crumb='PSA nitrogen package design',
      title='PSA Nitrogen Package Design | Damodar Engineering Design',
      desc='PSA nitrogen generator package design: twin-tower CMS generator integration, air receivers, N₂ buffer vessels, valve manifolds and filtration skids.',
      h1='PSA nitrogen package design',
      intro=['PSA nitrogen generator package design for packaged-equipment manufacturers and EPC contractors: twin-tower carbon molecular sieve generators integrated with air receivers, nitrogen buffer vessels, valve manifolds and filtration skids, delivered as 3D models, skid GA and fabrication drawings.',
             'Experience includes a high-purity PSA nitrogen generation package for a national operator in India, with a 12 m³ receiver and a 25 m³ buffer vessel and an output of 99.9% purity at 6 barg. Shell and head sizing is coordinated with the vessel designer, and compressed-air quality follows ISO 8573-1 where the project specifies it.'],
      scope=['Twin-tower CMS generator integration', 'Air receivers &amp; N₂ buffer vessels', 'Valve manifolds &amp; filtration skids', 'Utility tie-ins &amp; vent silencing'],
      deliver=['Skid GA', 'Receiver &amp; buffer vessel layouts', 'Nozzle orientation drawings', 'Piping isometrics', 'BOM'],
      codes=['ASME VIII Div 1', 'IS 2825', 'ISO 8573-1', 'ASME B31.3'], projects=['P-01']),
 dict(slug='fuel-system-design', icon='i-fuel', crumb='Fuel system design',
      title='Fuel System Design UAE | Damodar Engineering Design',
      desc='Fuel system design in the UAE: mobile fuelling stations, fuel skids and storage tanks, with GA, fit-out and fabrication drawings and zone layouts.',
      h1='Fuel system &amp; mobile fuelling station design',
      intro=['Fuel system design for mobile fuelling stations, fuel skids and storage tanks: 20 ft and 40 ft containerised stations, dual-compartment tanks with spill containment, Stage 1 vapour recovery and ATG integration, issued as GA, fit-out and fabrication drawings.',
             'Experience includes the Emarat 40 ft mobile fuelling unit (42,600 L gross, commissioned in the UAE) and a Maser portable fuelling unit for a commercial fleet, from a track record of seven fuel station units and more than 25 tanks from 500 L to 60 kL. Zone layout drawings are based on the client’s area classification, and codes such as UL 142 and UL 2085 are applied as the project specifies.'],
      scope=['20 ft &amp; 40 ft containerised stations', 'Dual-compartment tanks with spill containment', 'Stage 1 vapour recovery &amp; ATG', 'Single &amp; double-wall fuel tanks', 'Baffles, vortex breakers &amp; hydrotest fixtures', 'Zone layout drawings based on the client’s area classification'],
      deliver=['Station GA &amp; fit-out drawings', 'Tank &amp; containment drawings', 'Zone layout drawings', 'Fabrication drawings', 'BOM'],
      codes=['UL 142', 'UL 2085', 'IEC 60079', 'ATEX 2014/34/EU', 'ADR', 'TRAKHEES'], projects=['F-01', 'F-07']),
 dict(slug='tank-and-vessel-design', icon='i-tank', crumb='Tank &amp; vessel design',
      title='Tank &amp; Vessel Design UAE | Damodar Engineering Design',
      desc='Storage tank and pressure vessel design in the UAE: single and double-wall fuel tanks, nozzle orientations, hydrotest fixtures, fabrication drawings and BOMs.',
      h1='Storage tank &amp; pressure vessel design',
      intro=['Storage tank and pressure vessel design for fabricators, EPC contractors and equipment OEMs in the UAE, the GCC and India: single and double-wall fuel tanks, filter vessels and heavy tanks, issued as fabrication drawings, nozzle orientation drawings, hydrotest fixture details and weight, BOM and centre of gravity reports.',
             'The track record covers more than 25 tanks from 500 L to 60 kL, including a 6,000 L filter vessel with heavy tanks at 8.0 bar design pressure. Shell and dished-head sizing is coordinated with the vessel designer, while nozzles, manways, baffles, vortex breakers, hydrotest fixtures and transport tie-downs are detailed for the workshop.'],
      scope=['Single &amp; double-wall fuel tanks', 'Nozzles &amp; manways; shell/head sizing coordinated with the vessel designer', 'Baffles, vortex breakers &amp; hydrotest fixtures', 'Nozzle orientations &amp; transport tie-downs', 'Weight, BOM &amp; centre of gravity'],
      deliver=['Fabrication drawings', 'Nozzle orientation drawings', 'Hydrotest fixture details', 'Weight, BOM &amp; CoG'],
      codes=['UL 142', 'UL 2085', 'ASME VIII Div 1', 'API 650 · vertical atmospheric'],
      codes_note='UL 142 and UL 2085 apply to horizontal fuel tanks, ASME VIII Div 1 to pressure vessels, and API 650 only to vertical atmospheric tanks.',
      projects=['S-01', 'F-01']),
]

for p in PAGES:
    plain = lambda t: re.sub(r'<[^>]+>', '', t).replace('&amp;', '&')
    assert len(plain(p['title'])) < 60, p['title']
    assert len(p['desc']) < 160, (len(p['desc']), p['slug'])
    for c in p['codes']:
        assert '<span class="tag">' + c in home, c

for p in PAGES:
    url = '%s/services/%s/' % (SITE, p['slug'])
    crumbs = json.dumps({'@context': 'https://schema.org', '@type': 'BreadcrumbList', 'itemListElement': [
        {'@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': SITE + '/'},
        {'@type': 'ListItem', 'position': 2, 'name': 'Services', 'item': SITE + '/#services'},
        {'@type': 'ListItem', 'position': 3, 'name': re.sub(r'&amp;', '&', p['crumb']), 'item': url}]}, ensure_ascii=False)
    others = [q for q in PAGES if q is not p]
    steps = ''.join('<li><div><h3>%s</h3><p>%s</p></div></li>' % st for st in stages)
    page = f'''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>{p['title']}</title>
<meta name="description" content="{p['desc']}">
<link rel="canonical" href="{url}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Damodar Engineering Design">
<meta property="og:locale" content="en_GB">
<meta property="og:url" content="{url}">
<meta property="og:title" content="{p['title']}">
<meta property="og:description" content="{p['desc']}">
<meta property="og:image" content="{SITE}/images/og-image.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Damodar Engineering Design logo on navy: skid, package and pressure vessel design, Sharjah, UAE">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{p['title']}">
<meta name="twitter:description" content="{p['desc']}">
<meta name="twitter:image" content="{SITE}/images/og-image.png">
<meta name="theme-color" content="#191A35">
<link rel="icon" href="/images/favicon.ico" sizes="any">
<link rel="icon" type="image/svg+xml" href="/images/logo-icon.svg">
<link rel="apple-touch-icon" href="/images/apple-touch-icon.png">
<script type="application/ld+json">{crumbs}</script>
{fonts}
<link rel="stylesheet" href="/assets/site.css">
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
{sprite}

{header}

<main id="top">
<span id="main" tabindex="-1"></span>
<section class="svc-hero" aria-labelledby="svc-title">
  <div class="wrap svc-hero-in">
    <div>
      <nav class="crumbs" aria-label="Breadcrumb"><ol><li><a href="/">Home</a></li><li><a href="/#services">Services</a></li><li aria-current="page">{p['crumb']}</li></ol></nav>
      <span class="code eyebrow">Design service</span>
      <h1 id="svc-title">{p['h1']}</h1>
      <div class="svc-intro"><p>{p['intro'][0]}</p><p>{p['intro'][1]}</p></div>
      <div class="svc-hero-ctas"><a class="b3 primary" href="/#contact">Request a Quote</a><a class="b3 secondary" href="/#projects">View Project Experience</a></div>
    </div>
    <aside class="svc-glance" aria-label="At a glance">
      <svg class="ico svc-ic" viewBox="0 0 48 48" aria-hidden="true"><use href="#{p['icon']}"/></svg>
      <div><h2>Typical deliverables</h2><div class="dl-chips">{''.join('<span class="tag">%s</span>' % d for d in p['deliver'])}</div></div>
      <div><h2>Based in</h2><p class="muted" style="margin:0">Sharjah, UAE · serving the UAE, GCC and India</p></div>
    </aside>
  </div>
</section>

<section class="band alt" aria-labelledby="scope-title">
  <div class="wrap">
    <div class="sec-head"><span class="code eyebrow">Scope</span><h2 id="scope-title">Typical scope and deliverables</h2><p class="muted">Delivered as a complete design package or as single deliverables, in your title block and formats.</p></div>
    <div class="svc-two">
      <div class="card"><div class="card-head code"><span class="eyebrow">Typical scope</span></div><div class="card-body"><ul class="svc-list">{''.join('<li>%s</li>' % x for x in p['scope'])}</ul></div></div>
      <div class="card"><div class="card-head code"><span class="eyebrow">Deliverables</span></div><div class="card-body"><ul class="svc-list">{''.join('<li>%s</li>' % x for x in p['deliver'])}</ul></div></div>
    </div>
  </div>
</section>

<section class="band" aria-labelledby="codes-title">
  <div class="wrap">
    <div class="sec-head"><span class="code eyebrow">Standards</span><h2 id="codes-title">Relevant codes and standards</h2></div>
    <div class="svc-codes code">{''.join('<span class="tag">%s</span>' % c for c in p['codes'])}</div>
    {('<p class="cap-note">%s</p>' % p['codes_note']) if p.get('codes_note') else ''}<p class="muted cap-note">{DISCLAIMER}</p>
  </div>
</section>

<section class="band alt" aria-labelledby="proj-title">
  <div class="wrap">
    <div class="sec-head"><span class="code eyebrow">Project experience</span><h2 id="proj-title">Related project experience</h2><p class="muted">Projects delivered as lead/senior design engineer in previous roles.</p></div>
    <div class="grid svc-proj">
      {(chr(10) + '      ').join(project(r) for r in p['projects'])}
    </div>
  </div>
</section>

<section class="band" aria-labelledby="proc-title">
  <div class="wrap">
    <div class="sec-head"><span class="code eyebrow">Process</span><h2 id="proc-title">How a project runs</h2><p class="muted">Seven stages from enquiry to documentation and handover.</p></div>
    <ol class="steps">{steps}</ol>
    <a class="svc-steps-link" href="/#process">See each stage’s inputs, deliverables and review points →</a>
  </div>
</section>

<section class="cta-band" aria-labelledby="cta-title">
  <div class="wrap">
    <div><h2 id="cta-title">Discuss your scope</h2><p>Send your spec or tender and I reply within one working day. NDAs are available for confidential drawings.</p>
      <nav class="rel-svc" aria-label="Other services">{''.join('<a href="/services/%s/">%s →</a>' % (q['slug'], q['crumb']) for q in others)}</nav></div>
    <div class="cta-acts"><a class="b3 primary" href="/#contact">Request a Quote</a><a class="b3 secondary" href="tel:+971509633421">Call +971 50 963 3421</a></div>
  </div>
</section>
</main>
{menu}
{fabs}

{footer}

<script>
{js_menu}

{js_fab}
</script>
</body>
</html>
'''
    write('services/%s/index.html' % p['slug'], page)
print('built', len(PAGES), 'pages')
