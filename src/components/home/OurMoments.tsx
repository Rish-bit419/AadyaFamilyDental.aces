import { useEffect, useRef, useState } from "react";
import { Play, Instagram, Youtube, ChevronLeft, ChevronRight } from "lucide-react";

interface Moment {
  id: string;
  title: string;
  platform: "youtube" | "instagram";
  videoId?: string;
  embedUrl?: string;
  thumbnail?: string;
  /** approximate duration in seconds — controls how long before auto-advancing */
  duration?: number;
}

// Placeholder content — swap videoIds / embedUrls when the real links arrive
const moments: Moment[] = [
  { id: "1", title: "A Day at Our Clinic", platform: "youtube", videoId: "dQw4w9WgXcQ", duration: 18 },
  { id: "2", title: "Smile Transformations", platform: "youtube", videoId: "kJQP7kiw5Fk", duration: 18 },
  { id: "3", title: "Behind the Scenes", platform: "instagram", videoId: "9bZkp7q19f0", duration: 18 },
  { id: "4", title: "Patient Stories", platform: "youtube", videoId: "JGwWNGJdvx8", duration: 18 },
];

const buildSrc = (m: Moment) =>
  m.embedUrl ||
  (m.videoId
    ? `https://www.youtube.com/embed/${m.videoId}?autoplay=1&mute=1&controls=0&loop=0&modestbranding=1&playsinline=1&rel=0`
    : "");

const buildThumb = (m: Moment) =>
  m.thumbnail || (m.videoId ? `https://img.youtube.com/vi/${m.videoId}/hqdefault.jpg` : "");

const OurMoments = () => {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const startRef = useRef<number>(Date.now());

  const current = moments[active];
  const duration = (current?.duration ?? 18) * 1000;

  // Auto-advance + progress bar
  useEffect(() => {
    startRef.current = Date.now();
    setProgress(0);
    if (paused) return;

    const tick = window.setInterval(() => {
      const elapsed = Date.now() - startRef.current;
      const pct = Math.min(100, (elapsed / duration) * 100);
      setProgress(pct);
      if (elapsed >= duration) {
        setActive((p) => (p + 1) % moments.length);
      }
    }, 200);

    return () => window.clearInterval(tick);
  }, [active, paused, duration]);

  const goTo = (i: number) => setActive((i + moments.length) % moments.length);

  return (
    <section
      className="section-padding bg-gradient-to-b from-background via-secondary/40 to-background relative overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="absolute top-20 -left-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 -right-20 w-72 h-72 bg-teal-light/40 rounded-full blur-3xl" />

      <div className="container-custom relative">
        <div className="text-center max-w-2xl mx-auto mb-12 animate-slide-up">
          <span className="inline-block text-sm font-semibold text-primary uppercase tracking-wider mb-4">
            Our Moments
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4">
            Life Inside Our Clinic
          </h2>
          <p className="text-muted-foreground text-lg">
            A rolling reel of smiles, stories and little behind-the-scenes joys — plays automatically.
          </p>
        </div>

        <div className="grid lg:grid-cols-[1.6fr_1fr] gap-6 lg:gap-8 items-start">
          {/* Featured player */}
          <div
            className="relative aspect-video rounded-3xl overflow-hidden glass-card shadow-medium group touch-pan-y"
            onTouchStart={(e) => ((e.currentTarget as any)._sx = e.touches[0].clientX)}
            onTouchEnd={(e) => {
              const sx = (e.currentTarget as any)._sx;
              if (sx == null) return;
              const dx = e.changedTouches[0].clientX - sx;
              if (Math.abs(dx) > 40) goTo(active + (dx < 0 ? 1 : -1));
            }}
          >
            {current && (
              <iframe
                key={current.id}
                src={buildSrc(current)}
                title={current.title}
                className="absolute inset-0 w-full h-full"
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
              />
            )}

            {/* Progress bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-white/20 z-10">
              <div
                className="h-full bg-primary transition-[width] duration-200 ease-linear"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Title + controls */}
            <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5 flex items-end justify-between gap-3 bg-gradient-to-t from-black/70 to-transparent z-10 pointer-events-none">
              <div className="text-white">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider opacity-90">
                  {current?.platform === "instagram" ? (
                    <Instagram className="w-3.5 h-3.5" />
                  ) : (
                    <Youtube className="w-3.5 h-3.5" />
                  )}
                  {current?.platform}
                </span>
                <p className="font-display text-lg md:text-xl font-semibold drop-shadow-lg">
                  {current?.title}
                </p>
              </div>
              <div className="flex gap-2 pointer-events-auto">
                <button
                  onClick={() => goTo(active - 1)}
                  className="w-10 h-10 rounded-full glass-card flex items-center justify-center text-white hover:bg-primary hover:text-primary-foreground transition-colors"
                  aria-label="Previous moment"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => goTo(active + 1)}
                  className="w-10 h-10 rounded-full glass-card flex items-center justify-center text-white hover:bg-primary hover:text-primary-foreground transition-colors"
                  aria-label="Next moment"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Thumbnail list */}
          <div className="grid grid-cols-2 lg:grid-cols-1 gap-3 md:gap-4">
            {moments.map((m, i) => {
              const isActive = i === active;
              const Icon = m.platform === "instagram" ? Instagram : Youtube;
              return (
                <button
                  key={m.id}
                  onClick={() => goTo(i)}
                  className={`group relative flex items-center gap-3 p-2 pr-4 rounded-2xl text-left transition-all duration-300 ${
                    isActive
                      ? "glass-card ring-2 ring-primary shadow-medium -translate-y-0.5"
                      : "glass-card hover:-translate-y-0.5"
                  }`}
                >
                  <div className="relative w-24 h-16 md:w-28 md:h-20 rounded-xl overflow-hidden flex-shrink-0 bg-secondary">
                    {buildThumb(m) ? (
                      <img
                        src={buildThumb(m)}
                        alt={m.title}
                        loading="lazy"
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-teal-light" />
                    )}
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                      <Play className="w-5 h-5 text-white drop-shadow" fill="currentColor" />
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-primary">
                      <Icon className="w-3 h-3" />
                      {m.platform}
                    </span>
                    <p className="text-sm font-semibold text-foreground line-clamp-2">
                      {m.title}
                    </p>
                  </div>
                  {isActive && (
                    <span className="absolute right-3 top-3 w-2 h-2 rounded-full bg-primary animate-pulse" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-8">
          {moments.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Go to moment ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === active ? "w-8 bg-primary" : "w-3 bg-primary/30 hover:bg-primary/60"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurMoments;
