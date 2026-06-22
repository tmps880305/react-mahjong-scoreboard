interface NumberStepperProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  suffix?: string;
}

export function NumberStepper({ label, value, min, max, step = 1, onChange, suffix }: NumberStepperProps) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-sm text-white/70">{label}</span>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - step))}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-lg text-white active:scale-90"
        >
          −
        </button>
        <span className="w-12 text-center text-lg font-semibold tabular-nums text-white">
          {value}
          {suffix}
        </span>
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + step))}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-lg text-white active:scale-90"
        >
          ＋
        </button>
      </div>
    </div>
  );
}
