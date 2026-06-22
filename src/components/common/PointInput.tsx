interface PointInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
}

const QUICK_ADD = [10000, 1000, 500, 100];

export function PointInput({ label, value, onChange }: PointInputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <span className="text-sm text-white/70">{label}</span>
        <span className="text-lg font-bold tabular-nums text-white">{value}</span>
      </div>
      <div className="flex items-center gap-1.5">
        {QUICK_ADD.map((amount) => (
          <button
            key={amount}
            type="button"
            onClick={() => onChange(value + amount)}
            className="flex-1 rounded-lg border border-white/15 bg-white/5 py-3 text-xs font-medium text-white/80 active:scale-95"
          >
            +{amount}
          </button>
        ))}
        <button
          type="button"
          onClick={() => onChange(0)}
          className="shrink-0 rounded-lg border border-white/15 bg-white/5 px-3 py-3 text-xs font-medium text-white/60 active:scale-95"
        >
          クリア
        </button>
      </div>
    </div>
  );
}
