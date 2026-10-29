// Small line-art project illustrations in the drawing style (240×120). Decorative only.
const sketches = {
  fuelling40: (
    <>
      <rect className="ps-line" x="12" y="28" width="216" height="62" />
      <path className="ps-thin" d="M36 28v62M60 28v62M84 28v62M108 28v62M132 28v62" />
      <rect className="ps-line" x="160" y="40" width="22" height="38" />
      <path className="ps-thin" d="M166 48h10v8h-10zM171 78V84" />
      <circle className="ps-line" cx="205" cy="58" r="11" />
      <circle className="ps-thin" cx="205" cy="58" r="4" />
      <path className="ps-line" d="M8 96h224M8 96v-4M232 96v-4" />
      <path className="ps-dim" d="M12 108h216M12 102v10M228 102v10" />
      <path className="ps-arrow" d="M12 108l7 -2.5v5zM228 108l-7 -2.5v5z" />
    </>
  ),
  compander: (
    <>
      <rect className="ps-line" x="20" y="92" width="200" height="8" />
      <rect className="ps-line" x="92" y="46" width="56" height="46" />
      <circle className="ps-line" cx="70" cy="52" r="13" />
      <circle className="ps-line" cx="70" cy="80" r="11" />
      <circle className="ps-line" cx="170" cy="52" r="13" />
      <circle className="ps-line" cx="170" cy="80" r="11" />
      <path className="ps-thin" d="M83 52h9M81 80h11M148 52h9M148 80h11" />
      <path className="ps-pipe" d="M70 39V22h100v17M60 80H34V40" />
      <rect className="ps-line" x="196" y="62" width="22" height="30" />
      <path className="ps-center" d="M120 36v64M40 66h160" />
    </>
  ),
  gasCompressor: (
    <>
      <path className="ps-hood" d="M18 30h204v66H18z" />
      <rect className="ps-line" x="26" y="88" width="188" height="8" />
      <path className="ps-line" d="M44 52h70v32H44z" />
      <path className="ps-line" d="M40 48v40M118 48v40" />
      <rect className="ps-line" x="124" y="60" width="12" height="12" />
      <rect className="ps-line" x="136" y="50" width="60" height="38" />
      <path className="ps-thin" d="M148 50v38M160 50v38M172 50v38M184 50v38" />
      <path className="ps-pipe" d="M64 52V16M94 52V40h30V16" />
      <path className="ps-line" d="M58 16h12M118 16h12" />
      <path className="ps-center" d="M30 68h102" />
    </>
  ),
  psa: (
    <>
      <path className="ps-line" d="M14 100h212" />
      <path className="ps-line" d="M30 96V34a10 10 0 0 1 20 0v62zM62 96V34a10 10 0 0 1 20 0v62z" />
      <path className="ps-line" d="M120 96V44a18 18 0 0 1 36 0v52z" />
      <path className="ps-line" d="M180 96V56a14 14 0 0 1 28 0v40z" />
      <path className="ps-pipe" d="M40 24V14h32v10M56 14V8h82v18M156 66h24" />
      <path className="ps-thin" d="M32 84h48M28 96v4M52 96v4M60 96v4M84 96v4" />
      <path className="ps-line" d="M96 66h10l6 -6v12l-6 -6M106 66h14" />
      <path className="ps-center" d="M138 20v80M194 36v64" />
    </>
  ),
  portableFuel: (
    <>
      <path className="ps-line" d="M24 92h150v8H24z" />
      <path className="ps-line" d="M48 46h86a20 20 0 0 1 0 40H48a20 20 0 0 1 0-40z" />
      <path className="ps-line" d="M60 92l4 -6h16l4 6M118 92l4 -6h16l4 6" />
      <rect className="ps-line" x="184" y="40" width="34" height="60" />
      <rect className="ps-thin" x="190" y="48" width="22" height="14" />
      <path className="ps-thin" d="M190 70h22M190 78h22" />
      <path className="ps-line" d="M201 40V22M195 16l6 6 6 -6" />
      <path className="ps-pipe" d="M154 66h30" />
      <path className="ps-hood" d="M18 102h208v6H18z" />
      <path className="ps-center" d="M22 66h160" />
    </>
  ),
  filterVessel: (
    <>
      <path className="ps-line" d="M150 32h44a20 20 0 0 1 0 40h-44a20 20 0 0 1 0-40z" />
      <path className="ps-line" d="M146 96l4 -24h12l4 24M182 96l4 -24h12l4 24" />
      <path className="ps-line" d="M46 30a24 14 0 0 1 48 0v52a24 14 0 0 1 -48 0z" />
      <path className="ps-line" d="M50 92l-6 8M90 92l6 8" />
      <path className="ps-line" d="M36 46h10M94 70h10M32 41v10M104 65v10M70 16V8M64 8h12" />
      <path className="ps-thin" d="M46 40h48" />
      <path className="ps-center" d="M70 20v80M128 52h92" />
      <path className="ps-line" d="M14 100h212" />
      <path className="ps-hood" d="M160 32l-6 68M188 32l6 68" />
    </>
  ),
}

function ProjectSketch({ name }) {
  return (
    <svg className="project-sketch" viewBox="0 0 240 120" aria-hidden="true" focusable="false">
      {sketches[name]}
    </svg>
  )
}

export default ProjectSketch
