// Line-art service icons in the drawing style: 48×48, ink strokes, no fills. Decorative only.
const paths = {
  skid: (
    <>
      <rect x="4" y="34" width="40" height="6" />
      <rect x="8" y="20" width="14" height="14" />
      <path d="M28 34V16a4 4 0 0 1 8 0v18" />
      <path d="M22 26h6M15 20v-6h17" />
    </>
  ),
  compressor: (
    <>
      <circle cx="14" cy="27" r="8" />
      <path d="M22 27h4" />
      <rect x="26" y="20" width="16" height="14" />
      <path d="M31 20v14M36 20v14M14 19v-9h12M6 40h38" />
    </>
  ),
  psa: (
    <>
      <path d="M9 40V15a5 5 0 0 1 10 0v25" />
      <path d="M29 40V15a5 5 0 0 1 10 0v25" />
      <path d="M14 10V5h20v5M24 5V2M5 40h38M19 30h10" />
    </>
  ),
  tank: (
    <>
      <path d="M15 14h18a10 10 0 0 1 0 20H15a10 10 0 0 1 0-20z" />
      <path d="M20 14v-4h7v4M11 40l2-6h6l2 6M27 40l2-6h6l2 6M5 24h38" strokeDasharray="6 2 1 2" />
    </>
  ),
  fuelling: (
    <>
      <rect x="4" y="12" width="40" height="24" />
      <path d="M13 12v24M22 12v24M4 40h40" />
      <path d="M30 18h9v12h-9zM34.5 30v6" />
    </>
  ),
  piping: (
    <>
      <path d="M6 6h14M6 22h14M13 6v16" />
      <path d="M26 42V32a8 8 0 0 1 8-8h10" />
      <path d="M21 42h10M44 19v10M4 42h14" />
    </>
  ),
  tender: (
    <>
      <path d="M11 4h19l8 8v32H11z" />
      <path d="M30 4v8h8" />
      <path d="M16 21l2.5 2.5L23 19M16 32l2.5 2.5L23 30M27 21h6M27 32h6" />
    </>
  ),
  review: (
    <>
      <rect x="4" y="6" width="30" height="24" />
      <path d="M4 24h14v6" />
      <circle cx="31" cy="30" r="8" />
      <path d="M36.7 35.7L44 43M27.5 30l2.5 2.5 4.5-5" />
    </>
  ),
}

function ServiceIcon({ name }) {
  return (
    <svg
      className="service-icon"
      viewBox="0 0 48 48"
      width="48"
      height="48"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="square"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  )
}

export default ServiceIcon
