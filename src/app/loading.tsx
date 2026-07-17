export default function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center" style={{ background: "var(--bg-primary)" }}>
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-16 h-16">
          <div
            className="absolute inset-0 rounded-full animate-spin"
            style={{
              border: "3px solid transparent",
              borderTopColor: "var(--gold)",
              borderRightColor: "var(--purple-accent)",
            }}
          />
          <div
            className="absolute inset-2 rounded-full animate-spin"
            style={{
              border: "3px solid transparent",
              borderBottomColor: "var(--gold-light)",
              animationDirection: "reverse",
              animationDuration: "1.5s",
            }}
          />
          <div
            className="absolute inset-4 rounded-full"
            style={{ background: "var(--gradient-cosmic)", opacity: 0.3 }}
          />
        </div>
        <p className="text-sm animate-pulse" style={{ color: "var(--text-muted)" }}>
          Aligning the stars...
        </p>
      </div>
    </div>
  );
}
