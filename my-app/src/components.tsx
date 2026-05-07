
export function ControlSlider({label, min, max, value, onChange}) {
  return (
    <div
      style={{
        background: "var(--accent-bg)",
        padding: "12px 14px",
        flex: 1,
      }}
    >
      <div
        style={{
          fontSize: 11,
          color: "var(--accent)",
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          marginBottom: 6,
        }}>
        {label}
      </div>
      <div style={{display: 'flex', alignItems: "center", gap: 8}}>
        <input
          type='range'
          min={min}
          max={max}
          value={value}
          step={1}
          onChange={(e) => onChange(parseInt(e.target.value))}
          style={{flex: 1}}
        />
        <span
          style={{
            fontSize: 14,
            fontWeight: 500,
            color: "var(--color-text-primary)",
            minWidth: 18,
            textAlign: "right",
          }}
        >
          {value}
        </span>
      </div>
    </div>
  );
}

type BoardState = (string | null) [][];

interface BoardDisplayProps {
  board: BoardState;
}

function Cell({ value }: { value: string | null}) {
  const bg = 
    value === "X" ? "#f5c518" :
    value === "O" ? "#e83030" :
    "#0a1633";

    return (
      <div style={{
        width: 52, height: 52,
        borderRadius: "50%",
        background: bg,
        boxShadow: "inset 0 2px 5px rgba(0,0,0,0.5)",
      }} />
    );
}
export function BoardDisplay( {board}: BoardDisplayProps) {
  return (
    <div style={{
      background: "#1a3a8a",
      borderRadius: 12,
      padding: 10,
      display: "inline-block"
    }}>
      {board.map((row, r) => (
        <div key={r} style={{display: "flex", gap: 8, marginBottom: 8}}>
          {row.map((cell, c) => (
            <Cell key={c} value={cell} />
          ))}
        </div>
      ))}
    </div>
  )
}