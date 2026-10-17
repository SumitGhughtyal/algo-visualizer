// Shapes that sit BEHIND the glass panels. The panels blur and tint them.
export function Backdrop() {
  return (
    <div className="backdrop" aria-hidden="true">
      <div className="blob blob-green" />
      <div className="blob blob-orange" />
      <div className="orb orb-green bd-orb-1" />
      <div className="ring ring-green bd-ring-1" />
      <div className="orb orb-orange bd-orb-2" />
      <div className="orb orb-green bd-orb-3" />
    </div>
  );
}

// Small sharp shapes that sit IN FRONT of the glass, overlapping panel corners
export function Foreground() {
  return (
    <div className="foreground" aria-hidden="true">
      <div className="orb orb-green fg-orb-1" />
      <div className="orb orb-orange fg-orb-2" />
    </div>
  );
}