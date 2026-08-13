// Placeholder "product stage" for VOLREP PRM™. Final photography, or more
// likely a short (~6–10s, looping, cinematic) VOLREP PRM™ product video, is
// not ready yet. This frame is built for that: a dark, contained stage with
// its own corner/caption chrome, so the final asset can be dropped in as the
// stage's background layer without touching this layout again, e.g.:
//
//   import Image from "next/image"; // or a looping <video muted playsInline>
//
//   <Image
//     src="/products/volrep-prm-hero.png"
//     alt="VOLREP PRM™ — Percussive Recovery Massager"
//     fill
//     priority
//     sizes="(min-width: 1024px) 50vw, 100vw"
//     className="object-cover"
//   />
//
// Keep it as the first child inside the relative container below, behind
// the corner markers and caption — everything else can stay as-is.
export function HeroProductVisual() {
  return (
    <div className="hero-media-enter relative aspect-[4/5] w-full bg-ink transition-transform duration-500 ease-out sm:aspect-[4/3] hover:scale-[1.01]">
      <span aria-hidden="true" className="absolute left-4 top-4 h-3 w-3 border-l border-t border-paper/25" />
      <span aria-hidden="true" className="absolute right-4 top-4 h-3 w-3 border-r border-t border-paper/25" />
      <span aria-hidden="true" className="absolute bottom-4 left-4 h-3 w-3 border-b border-l border-paper/25" />
      <span aria-hidden="true" className="absolute bottom-4 right-4 h-3 w-3 border-b border-r border-paper/25" />

      <span
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 h-2/5 w-2/5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-paper/10"
      />

      <div aria-hidden="true" className="absolute left-5 top-5 flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-volt" />
        <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-paper/50">01</span>
      </div>

      <div className="absolute inset-x-5 bottom-5">
        <p className="text-sm font-medium tracking-tight text-paper">
          VOLREP PRM<span aria-hidden="true">™</span>
        </p>
        <p className="mt-1 text-xs text-paper/55">Percussive Recovery Massager</p>
      </div>
    </div>
  );
}
