export default function ComplexityChip({ value, label }: { value: string; label?: string }) {
  if (!value) return null;
  const tone = value === "O(1)" ? "chip chip-green" : "chip";
  return (
    <span className={tone}>
      {label ? `${label} ` : ""}
      {value}
    </span>
  );
}