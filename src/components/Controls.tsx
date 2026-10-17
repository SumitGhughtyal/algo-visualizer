import type { Player } from "@/engine/usePlayer";

export default function Controls({ player }: { player: Player }) {
  const playLabel = player.playing ? "Pause" : player.atEnd ? "Replay" : "Play";

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        <button className="glass-btn" onClick={player.reset} disabled={player.atStart}>
          Reset
        </button>
        <button className="glass-btn" onClick={player.prev} disabled={player.atStart}>
          Prev
        </button>
        <button
          className="glass-btn glass-btn-primary"
          onClick={player.toggle}
          disabled={player.total <= 1}
        >
          {playLabel}
        </button>
        <button className="glass-btn" onClick={player.next} disabled={player.atEnd}>
          Next
        </button>
      </div>
      <label className="flex items-center gap-3 text-sm text-slate-300">
        Speed
        <input
          type="range"
          className="glass-range flex-1"
          min={100}
          max={1500}
          step={100}
          value={1600 - player.speed}
          onChange={(e) => player.setSpeed(1600 - Number(e.target.value))}
        />
      </label>
    </div>
  );
}