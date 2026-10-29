// Drawing title block (see CLAUDE.md "Title block"). `rows` is a list of [label, value] pairs.
function TitleBlock({ rows, className = '' }) {
  return (
    <dl className={`title-block ${className}`.trim()}>
      {rows.map(([label, value]) => (
        <div key={label}>
          <dt>{label}</dt>
          <dd>{value}</dd>
        </div>
      ))}
    </dl>
  )
}

export default TitleBlock
