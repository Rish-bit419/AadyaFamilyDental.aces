import { useRef, useState } from "react";
import { Play, Instagram, Youtube } from "lucide-react";

interface Moment {
  id: string;
  title: string;
  platform: "youtube" | "instagram";
  // YouTube video ID or Instagram reel embed URL
  videoId?: string;
  embedUrl?: string;
  thumbnail?: string;
}

// Placeholder content — replace videoIds / embedUrls with real ones later
const moments: Moment[] = [
  {
    id: "1",
    title: "A Day at Our Clinic",
    platform: "youtube",
    videoId: "dQw4w9WgXcQ",
  },
  {
    id: "2",
    title: "Smile Transformations",
    platform: "youtube",
    videoId: "kJQP7kiw5Fk",
  },
  {
    id: "3",
    title: "Behind the Scenes",
    platform: "instagram",
    videoId: "9bZkp7q19f0",
  },
  {
    id: "4",
    title: "Patient Stories",
    platform: "youtube",
    videoId: "JGwWNGJdvx8",
  },
];

const MomentCard = ({ moment, index }: { moment: Moment; index: number }) => {
  const [playing, setPlaying] = useState(false);
  const timer = useRef<number | null>(null);

  const handleEnter = () => {
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setPlaying(true), 150);
  };
  const handleLeave = () => {
    if (timer.current) window.clearTimeout(timer.current);
    setPlaying(false);
  };

  const thumb = moment.videoId
    ? `https://img.youtube.com/vi/${moment.videoId}/hqdefault.jpg`
    : moment.thumbnail;

  const src =
    moment.embedUrl ||
    (moment.videoId
      ? `https://www.youtube.com/embed/${moment.videoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${moment.videoId}&modestbranding=1&playsinline=1`
      : "");

  const Icon = moment.platform === "instagram" ? Instagram : Youtube;

  return (
    <div
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onTouchStart={handleEnter}
      onClick={() => setPlaying(true)}
      className="group relative aspect-[9/16] rounded-3xl overflow-hidden cursor-pointer shadow-soft hover:shadow-medium transition-all duration-500 hover:-translate-y-2 animate-slide-up bg-secondary"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {playing && src ? (
        <iframe
          src={src}
          title={moment.title}
          className="absolute inset-0 w-full h-full"
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
          loading="lazy"
        />
      ) : (
        <>
          {thumb ? (
            <img
              src={thumb}
              alt={moment.title}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              loading="lazy"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-teal-light" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          <div className="absolute top-4 right-4 w-9 h-9 rounded-full glass-card flex items-center justify-center">
            <Icon className="w-4 h-4 text-white" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
              <Play className="w-7 h-7 text-primary ml-1" fill="currentColor" />
            </div>
          </div>
          <div className="absolute bottom-4 left-4 right-4">
            <p className="text-white font-semibold text-sm md:text-base drop-shadow-lg">
              {moment.title}
            </p>
          </div>
        </>
      )}
    </div>
  );
};

const OurMoments = () => {
  return (
    <section className="section-padding bg-gradient-to-b from-background via-secondary/40 to-background relative overflow-hidden">
      <div className="absolute top-20 -left-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 -right-20 w-72 h-72 bg-teal-light/40 rounded-full blur-3xl" />

      <div className="container-custom relative">
        <div className="text-center max-w-2xl mx-auto mb-14 animate-slide-up">
          <span className="inline-block text-sm font-semibold text-primary uppercase tracking-wider mb-4">
            Our Moments
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4">
            Life Inside Our Clinic
          </h2>
          <p className="text-muted-foreground text-lg">
            Hover any clip to play — a peek into the smiles, stories and small joys we capture every day.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {moments.map((m, i) => (
            <MomentCard key={m.id} moment={m} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurMoments;
