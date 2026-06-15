import { useState, useEffect, useRef } from "react";
import BoxLoader from "./components/ui/box-loader";
import useEmblaCarousel from "embla-carousel-react";
import {
  motion,
  AnimatePresence,
  usePresence,
} from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Plus,
  Monitor,
  Code2,
  Palette,
  TrendingUp,
  FlaskConical,
  Bot,
  Phone,
} from "lucide-react";

const base = import.meta.env.BASE_URL;

const SITE = "https://franckv001.github.io/site_dino";

function setPageMeta(title: string, description: string, path: string) {
  const url = `${SITE}${path}`;
  document.title = title;
  document.querySelector('meta[name="description"]')?.setAttribute("content", description);
  document.querySelector('link[rel="canonical"]')?.setAttribute("href", url);
  document.querySelector('meta[property="og:url"]')?.setAttribute("content", url);
  document.querySelector('meta[property="og:title"]')?.setAttribute("content", title);
  history.replaceState(null, "", `/site_dino${path}`);
}

const PATH_TO_PAGE: Record<string, string> = {
  "/blog/":                      "blog",
  "/blog/nocode-vs-dev/":        "blog-nocode-vs-dev",
  "/blog/5-processus-automatiser/": "blog-5-processus-automatiser",
  "/blog/ia-productivite-pme/":  "blog-ia-productivite-pme",
  "/blog/site-qui-fait-fuir/":   "blog-site-qui-fait-fuir",
  "/blog/app-sans-developpeur/": "blog-app-sans-developpeur",
  "/projets/sailingloc/":        "p1",
  "/projets/apex-pro/":          "p2",
  "/projets/renaissance-afrik/": "p3",
  "/projets/targo/":             "p6",
  "/processus/decouverte-analyse/":   "decouverte-analyse",
  "/processus/architecture-design/":  "architecture-design",
  "/processus/production-build/":     "production-build",
  "/processus/test-validation/":      "test-validation",
  "/processus/lancement-suivi/":      "lancement-suivi",
  "/a-propos/":                       "a-propos",
};

// ─── DATA ───────────────────────────────────────────────────────────────────

const chaptersData = [
  { name: "Découverte & Analyse", image: `${base}processus/01_decouverte.webp`, description: "Audit de vos besoins, analyse de l'existant, cadrage du projet et définition des objectifs clés." },
  { name: "Architecture & Design", image: `${base}processus/02_architecture.webp`, description: "Conception de la structure digitale, wireframing, choix des outils no-code ou dev selon le contexte." },
  { name: "Production & Build", image: `${base}processus/03_production.webp`, description: "Développement, intégration et automatisation. Livraison rapide avec itérations continues." },
  { name: "Test & Validation", image: `${base}processus/04_test.webp`, description: "Recette fonctionnelle, tests UX, corrections et validation avant mise en production." },
  { name: "Lancement & Suivi", image: `${base}processus/05_lancement.webp`, description: "Mise en ligne, monitoring des performances et accompagnement post-livraison." },
];

// ─── ANIMATION VARIANTS ──────────────────────────────────────────────────────

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const letterBlock = {
  initial: { y: 120, opacity: 0 },
  animate: {
    y: 0,
    opacity: 1,
    transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] as const },
  },
};

// ─── SAND TRANSITION IMAGE ───────────────────────────────────────────────────

function SandTransitionImage({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const [isPresent, safeToRemove] = usePresence();
  const filterIdRef = useRef(`sand-filter-${Math.random().toString(36).slice(2)}`);
  const filterId = filterIdRef.current;
  const turbRef = useRef<SVGFETurbulenceElement | null>(null);
  const dispRef = useRef<SVGFEDisplacementMapElement | null>(null);
  const offsetRef = useRef<SVGFEOffsetElement | null>(null);
  const blurRef = useRef<SVGFEGaussianBlurElement | null>(null);
  const colorRef = useRef<SVGFEColorMatrixElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const startTime = performance.now();
    const duration = 900;

    function animate(now: number) {
      const elapsed = now - startTime;
      const rawT = Math.min(elapsed / duration, 1);

      if (isPresent) {
        const t = 1 - Math.pow(1 - rawT, 4);
        const progress = 1 - t;

        if (turbRef.current) turbRef.current.setAttribute("baseFrequency", "1.8");
        if (dispRef.current) dispRef.current.setAttribute("scale", String(progress * 150));
        if (offsetRef.current) {
          offsetRef.current.setAttribute("dy", String(progress * -80));
          offsetRef.current.setAttribute("dx", String(progress * -30));
        }
        if (blurRef.current) blurRef.current.setAttribute("stdDeviation", String(progress * 6));
        if (colorRef.current) {
          const opacity = 1 - progress * 1.2;
          colorRef.current.setAttribute(
            "values",
            `1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 ${Math.max(0, opacity)} 0`
          );
        }
      } else {
        const t = Math.pow(rawT, 3);

        if (turbRef.current) turbRef.current.setAttribute("baseFrequency", "1.8");
        if (dispRef.current) dispRef.current.setAttribute("scale", String(t * 150));
        if (offsetRef.current) {
          offsetRef.current.setAttribute("dy", String(t * 120));
          offsetRef.current.setAttribute("dx", String(t * 30));
        }
        if (blurRef.current) blurRef.current.setAttribute("stdDeviation", String(t * 6));
        if (colorRef.current) {
          const opacity = 1 - t * 1.2;
          colorRef.current.setAttribute(
            "values",
            `1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 ${Math.max(0, opacity)} 0`
          );
        }
      }

      if (rawT < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else if (!isPresent) {
        safeToRemove();
      }
    }

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isPresent, safeToRemove]);

  return (
    <>
      <svg
        ref={svgRef}
        style={{ position: "absolute", width: 0, height: 0 }}
        aria-hidden="true"
      >
        <defs>
          <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence
              ref={turbRef}
              type="fractalNoise"
              baseFrequency="1.8"
              numOctaves={4}
              result="noise"
            />
            <feDisplacementMap
              ref={dispRef}
              in="SourceGraphic"
              in2="noise"
              scale="0"
              xChannelSelector="R"
              yChannelSelector="G"
              result="displaced"
            />
            <feOffset
              ref={offsetRef}
              in="displaced"
              dx="0"
              dy="0"
              result="offset"
            />
            <feGaussianBlur
              ref={blurRef}
              in="offset"
              stdDeviation="0"
              result="blurred"
            />
            <feColorMatrix
              ref={colorRef}
              in="blurred"
              type="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0"
            />
          </filter>
        </defs>
      </svg>
      <img
        src={src}
        alt={alt}
        crossOrigin="anonymous"
        referrerPolicy="no-referrer"
        className={className}
        style={{ filter: `url(#${filterId})` }}
      />
    </>
  );
}

// ─── PROJECTS DATA ───────────────────────────────────────────────────────────

const projectsData = [
  {
    id: "p1",
    title: "Création de site e-commerce",
    category: "Design Web",
    tags: ["Design Web", "No Code", "Marketing Digital", "IA", "Branding", "Test Application"],
    summary: "Redesign complet avec intégration Webflow et automatisation des commandes via Make. Résultat : +40 % de conversions.",
    url: "#",
    image: `${base}Index/sailingloc.webp`,
  },
  {
    id: "p2",
    title: "Site vitrine",
    category: "Design Web",
    tags: ["Design Web", "No Code"],
    summary: "Conception et développement d'un site vitrine immersif pour Apex Pro, spécialiste des exosquelettes de nouvelle génération.",
    url: "https://apex-pro-sigma.vercel.app",
    image: `${base}index_2/apex.webp?v=2`,
    objectPosition: "right",
  },
  {
    id: "p3",
    title: "Animation IA",
    category: "No Code & IA",
    summary: "Création d'animations générées par intelligence artificielle — personnages, environnements et séquences visuelles produits entièrement avec des outils IA.",
    url: "https://youtu.be/gYeV3tKIgSQ",
    image: `${base}index__3/hero_rennaissance_afrik.webp`,
  },
  {
    id: "p4",
    title: "Automatisation CRM & Marketing",
    category: "No Code & IA",
    summary: "Workflows automatisés avec n8n et HubSpot pour qualifier et nurture les leads entrants. Gain de 8h/semaine.",
    url: "#",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=900&h=600&fit=crop&q=80",
  },
  {
    id: "p5",
    title: "Dashboard Analytics temps réel",
    category: "Stratégie",
    summary: "Tableau de bord connectant GA4, Search Console et CRM pour piloter la croissance avec des données unifiées.",
    url: "#",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900&h=600&fit=crop&q=80",
  },
  {
    id: "p6",
    title: "Site vitrine Targo",
    category: "Design Web",
    summary: "Conception d'un site vitrine moderne pour Targo, service de transport rapide et simple. Interface claire, épurée et orientée conversion.",
    url: "https://franckv001.github.io/targo-website-/",
    image: `${base}index_6/targo_card.webp`,
  },
];

// ─── PROJECTS SECTION ─────────────────────────────────────────────────────────

function ProjectsSection({ onProjectClick }: { onProjectClick: (id: string) => void }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    breakpoints: { "(max-width: 768px)": { dragFree: true } },
  });
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  useEffect(() => {
    if (!emblaApi) return;
    const update = () => {
      setCanScrollPrev(emblaApi.canScrollPrev());
      setCanScrollNext(emblaApi.canScrollNext());
    };
    update();
    emblaApi.on("select", update);
    emblaApi.on("reInit", update);
    return () => {
      emblaApi.off("select", update);
      emblaApi.off("reInit", update);
    };
  }, [emblaApi]);

  return (
    <section className="relative w-full bg-[#fcfcfc] pt-24 md:pt-32 pb-16 md:pb-24 overflow-hidden z-20">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="px-6 md:px-16 mb-10 md:mb-14"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-8">
          <div>
            <div className="flex items-center gap-3 text-[10px] md:text-[11px] font-mono tracking-[0.2em] mb-5">
              <span className="text-gray-500">[ 03 ]</span>
              <span className="text-gray-900 font-bold uppercase">Nos Projets</span>
            </div>
            <h2 className="text-[2.2rem] sm:text-[2.8rem] md:text-[3.5rem] font-medium tracking-tight leading-[1.1] text-[#111]">
              Réalisations récentes
            </h2>
            <a
              href="#"
              className="group inline-flex items-center gap-2 mt-4 text-[11px] font-mono tracking-[0.15em] uppercase text-gray-500 hover:text-black transition-colors duration-300"
            >
              Voir tous les projets
              <ArrowUpRight
                size={14}
                strokeWidth={1.5}
                className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </a>
          </div>
          {/* Navigation arrows */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => emblaApi?.scrollPrev()}
              disabled={!canScrollPrev}
              aria-label="Précédent"
              className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center transition-all duration-300 hover:border-black hover:bg-[#111] hover:text-white disabled:opacity-25 disabled:cursor-not-allowed"
            >
              <ArrowLeft size={15} strokeWidth={1.5} />
            </button>
            <button
              onClick={() => emblaApi?.scrollNext()}
              disabled={!canScrollNext}
              aria-label="Suivant"
              className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center transition-all duration-300 hover:border-black hover:bg-[#111] hover:text-white disabled:opacity-25 disabled:cursor-not-allowed"
            >
              <ArrowRight size={15} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Carousel viewport */}
      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex pl-6 md:pl-16 gap-4 md:gap-6 pr-6 md:pr-0">
          {projectsData.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: "easeOut", delay: i * 0.07 }}
              className="min-w-0 shrink-0 grow-0 w-[80vw] sm:w-[55vw] md:w-[400px] lg:w-[440px]"
            >
              <a
                href={["p1","p2","p3","p6"].includes(project.id) ? undefined : (project.url?.startsWith("https://") || project.url?.startsWith("http://") ? project.url : undefined)}
                onClick={(e) => { if (["p1","p2","p3","p6"].includes(project.id)) { e.preventDefault(); onProjectClick(project.id); } }}
                className="group block cursor-pointer"
              >
                {/* Image */}
                <div className="aspect-[3/2] rounded-md overflow-hidden mb-4 bg-gray-100 relative">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full transition-transform duration-700 group-hover:scale-105 object-cover"
                    style={"objectPosition" in project ? { objectPosition: (project as { objectPosition: string }).objectPosition } : undefined}
                  />
                  {(project.id === "p4" || project.id === "p5") && (
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-[#111]/80 backdrop-blur-sm text-white text-[9px] font-mono uppercase tracking-[0.18em] px-2.5 py-1.5 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      En cours
                    </div>
                  )}
                </div>
                {/* Category / Tags */}
                {"tags" in project ? (
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {(project as { tags: string[] }).tags.map((tag) => (
                      <span key={tag} className="text-[9px] font-mono tracking-[0.15em] uppercase text-gray-500 border border-gray-200 px-2 py-0.5 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                ) : (
                  <div className="text-[10px] font-mono tracking-[0.2em] uppercase text-gray-400 mb-2">
                    {project.category}
                  </div>
                )}
                {/* Title */}
                <h3 className="text-lg md:text-xl font-medium tracking-tight text-[#111] mb-2 leading-snug group-hover:underline underline-offset-4 decoration-[1.5px] transition-all duration-300">
                  {project.title}
                </h3>
                {/* Summary */}
                <p className="text-[13px] text-gray-500 leading-[1.7] line-clamp-2 mb-5">
                  {project.summary}
                </p>
                {/* CTA */}
                <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-wider text-[#111]">
                  <span>Voir le projet</span>
                  <ArrowRight
                    size={13}
                    strokeWidth={1.5}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </div>
              </a>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Divider bas */}
      <div className="h-[1px] bg-gray-200 mt-16 md:mt-20 mx-6 md:mx-16" />
    </section>
  );
}

// ─── PROJECT DETAIL PAGE ─────────────────────────────────────────────────────

const sailinglocImages = [
  { src: `${base}carrouselle/hero_sailingLoc.webp?v=9`, alt: "Hero — SailingLoc", contain: true },
  { src: `${base}carrouselle/back_office_sailingLoc.webp?v=9`, alt: "Back office — SailingLoc", contain: true },
  { src: `${base}carrouselle/tableau_de_boord_sailig_Loc.webp?v=9`, alt: "Tableau de bord — SailingLoc", contain: true },
  { src: `${base}carrouselle/sauvegarde_sailingloc.webp?v=9`, alt: "Sauvegarde — SailingLoc", contain: true },
  { src: `${base}carrouselle/location_sailingloc.webp?v=9`, alt: "Location — SailingLoc", contain: true },
  { src: `${base}carrouselle/flyers.webp?v=9`, alt: "Flyers — SailingLoc", contain: true },
  { src: `${base}carrouselle/logotype_sailingloc.webp?v=9`, alt: "Logotype — SailingLoc", contain: true },
  { src: `${base}carrouselle/moodbard_sailingloc.webp?v=9`, alt: "Moodboard — SailingLoc", contain: true },
  { src: `${base}carrouselle/affiche_street_sailingloc.webp?v=9`, alt: "Affiche street — SailingLoc", contain: true },
];

function ProjectDetailSailingloc({ onBack }: { onBack: () => void }) {
  useEffect(() => {
    window.scrollTo(0, 0);
    setPageMeta(
      "SailingLoc — Réservation de Voiliers · FRK",
      "SailingLoc — plateforme de réservation de voiliers conçue par FRK-France. Design Webflow, intégration paiement et automatisation Make.",
      "/projets/sailingloc/"
    );
  }, []);

  const [detailEmblaRef, detailEmblaApi] = useEmblaCarousel({ loop: true });
  const [detailIndex, setDetailIndex] = useState(0);

  useEffect(() => {
    if (!detailEmblaApi) return;
    const onSelect = () => setDetailIndex(detailEmblaApi.selectedScrollSnap());
    detailEmblaApi.on("select", onSelect);
    return () => { detailEmblaApi.off("select", onSelect); };
  }, [detailEmblaApi]);

  return (
    <div className="bg-[#fcfcfc] min-h-screen font-sans text-[#111] overflow-x-hidden">

      {/* Hero carousel */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="pt-[57px] w-full h-[55vh] md:h-[75vh] bg-gray-50 overflow-hidden relative"
      >
        <div ref={detailEmblaRef} className="overflow-hidden h-full">
          <div className="flex h-full">
            {sailinglocImages.map((img, i) => (
              <div key={i} className="min-w-0 shrink-0 grow-0 basis-full h-full">
                <img
                  src={img.src}
                  alt={img.alt}
                  className={`w-full h-full ${img.contain ? "object-contain" : "object-cover"}`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Prev */}
        <button
          onClick={() => detailEmblaApi?.scrollPrev()}
          aria-label="Image précédente"
          className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm border border-gray-200 flex items-center justify-center hover:bg-white hover:border-gray-400 transition-all duration-300 shadow-sm"
        >
          <ArrowLeft size={14} strokeWidth={1.5} />
        </button>

        {/* Next */}
        <button
          onClick={() => detailEmblaApi?.scrollNext()}
          aria-label="Image suivante"
          className="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm border border-gray-200 flex items-center justify-center hover:bg-white hover:border-gray-400 transition-all duration-300 shadow-sm"
        >
          <ArrowRight size={14} strokeWidth={1.5} />
        </button>

        {/* Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
          {sailinglocImages.map((_, i) => (
            <button
              key={i}
              onClick={() => detailEmblaApi?.scrollTo(i)}
              className={`rounded-full transition-all duration-300 ${
                i === detailIndex
                  ? "bg-gray-800 w-5 h-1.5"
                  : "bg-gray-400/60 w-1.5 h-1.5 hover:bg-gray-600"
              }`}
            />
          ))}
        </div>

        {/* Counter */}
        <div className="absolute bottom-4 right-4 text-[10px] font-mono text-gray-500 bg-white/75 backdrop-blur-sm px-2.5 py-1 rounded-full">
          {String(detailIndex + 1).padStart(2, "0")} / {String(sailinglocImages.length).padStart(2, "0")}
        </div>
      </motion.div>

      {/* Main content */}
      <div className="px-6 md:px-16 max-w-5xl mx-auto">

        {/* Title block */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="py-12 md:py-20 border-b border-gray-200"
        >
          <div className="flex items-center gap-3 text-[10px] font-mono tracking-[0.2em] uppercase mb-6">
            <span className="text-gray-400">[ Design Web ]</span>
            <span className="w-8 h-[1px] bg-gray-300 block" />
            <span className="text-gray-400">2024</span>
          </div>
          <h1 className="text-[2.5rem] sm:text-[3.5rem] md:text-[5rem] font-medium tracking-tight leading-[1] mb-8">
            Création de site<br />e-commerce
          </h1>
          <p className="text-[15px] md:text-[17px] text-gray-600 leading-[1.8] max-w-2xl">
            Conception et développement d'un site e-commerce complet pour SailingLoc,
            spécialiste de la location de voiliers. Intégration HTML avec automatisation
            des réservations via Make. Le projet a permis une augmentation de 40 % des
            conversions et une réduction significative du temps de gestion administratif.
          </p>
        </motion.div>

        {/* Metadata */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25 }}
          className="py-10 md:py-14 grid grid-cols-2 md:grid-cols-4 gap-8 border-b border-gray-200"
        >
          {[
            { label: "Client",       value: "SailingLoc" },
            { label: "Année",        value: "2024" },
            { label: "Services",     value: "Design Web" },
            { label: "Technologie",  value: "HTML / CSS / JS" },
          ].map(({ label, value }) => (
            <div key={label}>
              <div className="text-[10px] font-mono tracking-[0.2em] uppercase text-gray-400 mb-2">{label}</div>
              <div className="text-[14px] font-medium">{value}</div>
            </div>
          ))}
        </motion.div>

        {/* Le défi */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.32 }}
          className="py-10 md:py-16 border-b border-gray-200"
        >
          <div className="text-[10px] font-mono tracking-[0.2em] uppercase text-gray-400 mb-8">Le défi</div>
          <div className="grid md:grid-cols-2 gap-8 md:gap-16">
            <p className="text-[14px] md:text-[15px] text-gray-600 leading-[1.8]">
              SailingLoc avait besoin d'un site vitrine clair et performant pour présenter
              son offre de location de voiliers, générer des demandes de réservation en ligne
              et réduire les échanges manuels par email.
            </p>
            <p className="text-[14px] md:text-[15px] text-gray-600 leading-[1.8]">
              Le défi principal : concevoir une expérience utilisateur simple pour un public
              non-initié, tout en offrant un système de recherche et de filtrage efficace
              pour trouver le bon voilier selon la destination, la durée et le budget.
            </p>
          </div>
        </motion.div>

        {/* Mon rôle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.38 }}
          className="py-10 md:py-16 border-b border-gray-200"
        >
          <div className="text-[10px] font-mono tracking-[0.2em] uppercase text-gray-400 mb-8">Mon rôle</div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                num: "01",
                title: "Design & Intégration",
                desc: "Conception de la maquette, choix typographiques et mise en page responsive en HTML / CSS.",
              },
              {
                num: "02",
                title: "Développement Front",
                desc: "Intégration complète en HTML, CSS et JavaScript vanilla — filtres de recherche, interactions UI et optimisation mobile.",
              },
              {
                num: "03",
                title: "Mise en ligne",
                desc: "Déploiement sur Netlify, configuration du domaine et tests cross-navigateurs avant livraison.",
              },
            ].map(({ num, title, desc }) => (
              <div key={num} className="flex flex-col gap-3">
                <span className="text-[10px] font-mono text-gray-400">{num}</span>
                <h4 className="text-[15px] font-medium tracking-tight text-[#111]">{title}</h4>
                <p className="text-[13px] text-gray-500 leading-[1.7]">{desc}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Results */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35 }}
          className="py-10 md:py-16 border-b border-gray-200"
        >
          <div className="text-[10px] font-mono tracking-[0.2em] uppercase text-gray-400 mb-10">Résultats</div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
            {[
              { stat: "+40 %", desc: "de conversions" },
              { stat: "−60 %", desc: "de temps de gestion" },
              { stat: "100 %", desc: "responsive & optimisé" },
            ].map(({ stat, desc }) => (
              <div key={stat}>
                <div className="text-[3rem] md:text-[4rem] font-medium tracking-tight leading-none mb-3">{stat}</div>
                <div className="text-[11px] font-mono uppercase tracking-widest text-gray-500">{desc}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Dark CTA */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.45 }}
        className="mt-16 md:mt-24 bg-[#0a0a0a] text-white px-6 md:px-16 py-20 md:py-32 flex flex-col items-center text-center"
      >
        <div className="text-[10px] font-mono tracking-[0.2em] uppercase text-gray-500 mb-6">Projet en ligne</div>
        <h2 className="text-[2rem] md:text-[3.5rem] font-medium tracking-tight mb-10 max-w-xl">
          Voir le site SailingLoc en ligne
        </h2>
        <a
          href="https://franckvsailingloc2.netlify.app/index.html"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative overflow-hidden inline-flex items-center gap-3 bg-white text-[#111] px-8 py-4 rounded-md text-[13px] font-medium tracking-wide hover:shadow-[4px_4px_0px_rgba(255,255,255,0.3)] transition-all duration-300"
        >
          Visiter le projet
          <ArrowUpRight size={16} strokeWidth={1.5} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </a>
      </motion.section>
      <SiteFooter />
    </div>
  );
}

// ─── PROJECT DETAIL: APEX PRO ────────────────────────────────────────────────

function ProjectDetailApex({ onBack }: { onBack: () => void }) {
  useEffect(() => {
    window.scrollTo(0, 0);
    setPageMeta(
      "Apex Pro — Coaching Sportif · FRK-France",
      "Apex Pro — site vitrine premium pour une agence de coaching sportif, conçu et développé par FRK-France. Design moderne et animations fluides.",
      "/projets/apex-pro/"
    );
  }, []);

  return (
    <div className="bg-[#fcfcfc] min-h-screen font-sans text-[#111] overflow-x-hidden">

      {/* Hero image */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="pt-[57px] w-full h-[55vh] md:h-[75vh] bg-gray-900 overflow-hidden"
      >
        <img
          src={`${base}index_2/apex_hero.webp?v=2`}
          alt="Site vitrine Apex Pro"
          className="w-full h-full object-contain"
        />
      </motion.div>

      {/* Main content */}
      <div className="px-6 md:px-16 max-w-5xl mx-auto">

        {/* Title block */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="py-12 md:py-20 border-b border-gray-200"
        >
          <div className="flex items-center gap-3 text-[10px] font-mono tracking-[0.2em] uppercase mb-6">
            <span className="text-gray-400">[ Design Web ]</span>
            <span className="w-8 h-[1px] bg-gray-300 block" />
            <span className="text-gray-400">2025</span>
          </div>
          <h1 className="text-[2.5rem] sm:text-[3.5rem] md:text-[5rem] font-medium tracking-tight leading-[1] mb-8">
            Site vitrine<br />Apex Pro
          </h1>
          <p className="text-[15px] md:text-[17px] text-gray-600 leading-[1.8] max-w-2xl">
            Conception et développement d'un site vitrine immersif pour Apex Pro,
            spécialiste des exosquelettes de nouvelle génération. Une interface moderne
            et impactante pour présenter une technologie complexe à un public professionnel
            et industriel.
          </p>
        </motion.div>

        {/* Metadata */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25 }}
          className="py-10 md:py-14 grid grid-cols-2 md:grid-cols-4 gap-8 border-b border-gray-200"
        >
          {[
            { label: "Client",       value: "Apex Pro" },
            { label: "Année",        value: "2025" },
            { label: "Services",     value: "Design Web" },
            { label: "Technologie",  value: "React / Vercel" },
          ].map(({ label, value }) => (
            <div key={label}>
              <div className="text-[10px] font-mono tracking-[0.2em] uppercase text-gray-400 mb-2">{label}</div>
              <div className="text-[14px] font-medium">{value}</div>
            </div>
          ))}
        </motion.div>

        {/* Le défi */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.32 }}
          className="py-10 md:py-16 border-b border-gray-200"
        >
          <div className="text-[10px] font-mono tracking-[0.2em] uppercase text-gray-400 mb-8">Le défi</div>
          <div className="grid md:grid-cols-2 gap-8 md:gap-16">
            <p className="text-[14px] md:text-[15px] text-gray-600 leading-[1.8]">
              Apex Pro développe des exosquelettes de nouvelle génération à destination
              du secteur industriel. L'enjeu était de traduire une technologie complexe
              en une expérience visuelle claire, moderne et immédiatement impactante.
            </p>
            <p className="text-[14px] md:text-[15px] text-gray-600 leading-[1.8]">
              Le défi principal : concevoir une interface qui inspire confiance aux
              décideurs industriels tout en communiquant l'innovation et la performance
              technique de la solution — sans noyer le visiteur dans des détails trop techniques.
            </p>
          </div>
        </motion.div>

        {/* Mon rôle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.38 }}
          className="py-10 md:py-16 border-b border-gray-200"
        >
          <div className="text-[10px] font-mono tracking-[0.2em] uppercase text-gray-400 mb-8">Mon rôle</div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                num: "01",
                title: "Design & Direction Artistique",
                desc: "Maquettage, choix typographiques, palette de couleurs sombre et mise en page orientée impact et conversion.",
              },
              {
                num: "02",
                title: "Développement Front",
                desc: "Intégration en React, animations fluides, transitions et optimisation des performances de rendu.",
              },
              {
                num: "03",
                title: "Déploiement Vercel",
                desc: "Mise en ligne sur Vercel, configuration CI/CD et optimisation des temps de chargement avant livraison.",
              },
            ].map(({ num, title, desc }) => (
              <div key={num} className="flex flex-col gap-3">
                <span className="text-[10px] font-mono text-gray-400">{num}</span>
                <h4 className="text-[15px] font-medium tracking-tight text-[#111]">{title}</h4>
                <p className="text-[13px] text-gray-500 leading-[1.7]">{desc}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Results */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.44 }}
          className="py-10 md:py-16 border-b border-gray-200"
        >
          <div className="text-[10px] font-mono tracking-[0.2em] uppercase text-gray-400 mb-10">Résultats</div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
            {[
              { stat: "100 %", desc: "responsive & optimisé" },
              { stat: "<1 s",  desc: "temps de chargement" },
              { stat: "2025",  desc: "projet livré" },
            ].map(({ stat, desc }) => (
              <div key={stat}>
                <div className="text-[3rem] md:text-[4rem] font-medium tracking-tight leading-none mb-3">{stat}</div>
                <div className="text-[11px] font-mono uppercase tracking-widest text-gray-500">{desc}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Dark CTA */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.5 }}
        className="mt-16 md:mt-24 bg-[#0a0a0a] text-white px-6 md:px-16 py-20 md:py-32 flex flex-col items-center text-center"
      >
        <div className="text-[10px] font-mono tracking-[0.2em] uppercase text-gray-500 mb-6">Projet en ligne</div>
        <h2 className="text-[2rem] md:text-[3.5rem] font-medium tracking-tight mb-10 max-w-xl">
          Voir le site Apex Pro en ligne
        </h2>
        <a
          href="https://apex-pro-sigma.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-3 bg-white text-[#111] px-8 py-4 rounded-md text-[13px] font-medium tracking-wide hover:shadow-[4px_4px_0px_rgba(255,255,255,0.3)] transition-all duration-300"
        >
          Visiter le projet
          <ArrowUpRight size={16} strokeWidth={1.5} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </a>
      </motion.section>
      <SiteFooter />
    </div>
  );
}

// ─── PROJECT DETAIL: TARGO ───────────────────────────────────────────────────

function ProjectDetailTargo({ onBack }: { onBack: () => void }) {
  useEffect(() => {
    window.scrollTo(0, 0);
    setPageMeta(
      "Targo — Application No-Code · FRK-France",
      "Targo — application no-code développée par FRK-France pour optimiser la gestion et la mise en relation de professionnels. Conçu avec Bubble.",
      "/projets/targo/"
    );
  }, []);

  return (
    <div className="bg-[#fcfcfc] min-h-screen font-sans text-[#111] overflow-x-hidden">

      {/* Hero image */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="pt-[57px] w-full h-[55vh] md:h-[75vh] bg-gray-50 overflow-hidden"
      >
        <img
          src={`${base}index_6/targo.webp`}
          alt="Site vitrine Targo"
          className="w-full h-full object-cover"
        />
      </motion.div>

      {/* Main content */}
      <div className="px-6 md:px-16 max-w-5xl mx-auto">

        {/* Title block */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="py-12 md:py-20 border-b border-gray-200"
        >
          <div className="flex items-center gap-3 text-[10px] font-mono tracking-[0.2em] uppercase mb-6">
            <span className="text-gray-400">[ Design Web ]</span>
            <span className="w-8 h-[1px] bg-gray-300 block" />
            <span className="text-gray-400">2025</span>
          </div>
          <h1 className="text-[2.5rem] sm:text-[3.5rem] md:text-[5rem] font-medium tracking-tight leading-[1] mb-8">
            Site vitrine<br />Targo
          </h1>
          <p className="text-[15px] md:text-[17px] text-gray-600 leading-[1.8] max-w-2xl">
            Conception et développement d'un site vitrine moderne pour Targo,
            service de transport rapide et simple. Une interface épurée et orientée
            conversion pour convaincre rapidement les clients professionnels et particuliers.
          </p>
        </motion.div>

        {/* Metadata */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25 }}
          className="py-10 md:py-14 grid grid-cols-2 md:grid-cols-4 gap-8 border-b border-gray-200"
        >
          {[
            { label: "Client",      value: "Targo" },
            { label: "Année",       value: "2025" },
            { label: "Services",    value: "Design Web" },
            { label: "Technologie", value: "HTML / CSS / JS" },
          ].map(({ label, value }) => (
            <div key={label}>
              <div className="text-[10px] font-mono tracking-[0.2em] uppercase text-gray-400 mb-2">{label}</div>
              <div className="text-[14px] font-medium">{value}</div>
            </div>
          ))}
        </motion.div>

        {/* Le défi */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.32 }}
          className="py-10 md:py-16 border-b border-gray-200"
        >
          <div className="text-[10px] font-mono tracking-[0.2em] uppercase text-gray-400 mb-8">Le défi</div>
          <div className="grid md:grid-cols-2 gap-8 md:gap-16">
            <p className="text-[14px] md:text-[15px] text-gray-600 leading-[1.8]">
              Targo proposait un service de transport rapide avec un positionnement clair :
              simplicité et efficacité. L'enjeu était de traduire cette promesse en une
              expérience web immédiate, lisible et rassurante pour ses clients.
            </p>
            <p className="text-[14px] md:text-[15px] text-gray-600 leading-[1.8]">
              Le défi principal : concevoir une interface épurée qui communique la rapidité
              et la fiabilité du service dès les premières secondes, sans surcharger
              le visiteur d'informations inutiles.
            </p>
          </div>
        </motion.div>

        {/* Mon rôle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.38 }}
          className="py-10 md:py-16 border-b border-gray-200"
        >
          <div className="text-[10px] font-mono tracking-[0.2em] uppercase text-gray-400 mb-8">Mon rôle</div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                num: "01",
                title: "Design & Maquettage",
                desc: "Conception de la mise en page, choix typographiques et palette de couleurs alignés avec l'identité Targo.",
              },
              {
                num: "02",
                title: "Développement Front",
                desc: "Intégration complète en HTML, CSS et JavaScript vanilla — responsive, rapide et optimisé pour tous les écrans.",
              },
              {
                num: "03",
                title: "Mise en ligne",
                desc: "Déploiement sur GitHub Pages, configuration et tests cross-navigateurs avant livraison finale.",
              },
            ].map(({ num, title, desc }) => (
              <div key={num} className="flex flex-col gap-3">
                <span className="text-[10px] font-mono text-gray-400">{num}</span>
                <h4 className="text-[15px] font-medium tracking-tight text-[#111]">{title}</h4>
                <p className="text-[13px] text-gray-500 leading-[1.7]">{desc}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Results */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.44 }}
          className="py-10 md:py-16 border-b border-gray-200"
        >
          <div className="text-[10px] font-mono tracking-[0.2em] uppercase text-gray-400 mb-10">Résultats</div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
            {[
              { stat: "100 %", desc: "responsive & optimisé" },
              { stat: "<2 s",  desc: "temps de chargement" },
              { stat: "2025",  desc: "projet livré" },
            ].map(({ stat, desc }) => (
              <div key={stat}>
                <div className="text-[3rem] md:text-[4rem] font-medium tracking-tight leading-none mb-3">{stat}</div>
                <div className="text-[11px] font-mono uppercase tracking-widest text-gray-500">{desc}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Dark CTA */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.5 }}
        className="mt-16 md:mt-24 bg-[#0a0a0a] text-white px-6 md:px-16 py-20 md:py-32 flex flex-col items-center text-center"
      >
        <div className="text-[10px] font-mono tracking-[0.2em] uppercase text-gray-500 mb-6">Projet en ligne</div>
        <h2 className="text-[2rem] md:text-[3.5rem] font-medium tracking-tight mb-10 max-w-xl">
          Voir le site Targo en ligne
        </h2>
        <a
          href="https://franckv001.github.io/targo-website-/"
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-3 bg-white text-[#111] px-8 py-4 rounded-md text-[13px] font-medium tracking-wide hover:shadow-[4px_4px_0px_rgba(255,255,255,0.3)] transition-all duration-300"
        >
          Visiter le projet
          <ArrowUpRight size={16} strokeWidth={1.5} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </a>
      </motion.section>
      <SiteFooter />
    </div>
  );
}

// ─── PROJECT DETAIL: RENAISSANCE AFRIK ──────────────────────────────────────

function ProjectDetailRenaissanceAfrik({ onBack }: { onBack: () => void }) {
  useEffect(() => {
    window.scrollTo(0, 0);
    setPageMeta(
      "Projet Renaissance Afrik — FRK-France",
      "Renaissance Afrik — identité visuelle et présence digitale créées par FRK-France pour valoriser l'artisanat et la culture africaine en ligne.",
      "/projets/renaissance-afrik/"
    );
  }, []);

  return (
    <div className="bg-[#fcfcfc] min-h-screen font-sans text-[#111] overflow-x-hidden">

      {/* Hero image */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="pt-[57px] w-full h-[55vh] md:h-[75vh] bg-[#0a0a0a] overflow-hidden"
      >
        <img
          src={`${base}index__3/hero_rennaissance_afrik.webp`}
          alt="Renaissance Afrik — Animation IA"
          className="w-full h-full object-contain"
        />
      </motion.div>

      {/* Main content */}
      <div className="px-6 md:px-16 max-w-5xl mx-auto">

        {/* Title block */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="py-12 md:py-20 border-b border-gray-200"
        >
          <div className="flex items-center gap-3 text-[10px] font-mono tracking-[0.2em] uppercase mb-6">
            <span className="text-gray-400">[ No Code & IA ]</span>
            <span className="w-8 h-[1px] bg-gray-300 block" />
            <span className="text-gray-400">2025</span>
          </div>
          <h1 className="text-[2.5rem] sm:text-[3.5rem] md:text-[5rem] font-medium tracking-tight leading-[1] mb-8">
            Afrique<br />Renaissance
          </h1>
          <p className="text-[15px] md:text-[17px] text-gray-600 leading-[1.8] max-w-2xl">
            Création d'une animation entièrement générée par intelligence artificielle
            célébrant la renaissance culturelle et artistique africaine. Personnages,
            décors et séquences produits avec des outils IA de dernière génération
            pour un rendu visuel inédit et immersif.
          </p>
        </motion.div>

        {/* Metadata */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25 }}
          className="py-10 md:py-14 grid grid-cols-2 md:grid-cols-4 gap-8 border-b border-gray-200"
        >
          {[
            { label: "Projet",       value: "Renaissance Afrik" },
            { label: "Année",        value: "2025" },
            { label: "Type",         value: "Animation IA" },
            { label: "Outils",       value: "Midjourney / Runway / Kling" },
          ].map(({ label, value }) => (
            <div key={label}>
              <div className="text-[10px] font-mono tracking-[0.2em] uppercase text-gray-400 mb-2">{label}</div>
              <div className="text-[14px] font-medium">{value}</div>
            </div>
          ))}
        </motion.div>

        {/* Video embed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="py-10 md:py-16 border-b border-gray-200"
        >
          <div className="text-[10px] font-mono tracking-[0.2em] uppercase text-gray-400 mb-8">Vidéo</div>
          <div className="aspect-video w-full rounded-md overflow-hidden bg-black">
            <iframe
              src="https://www.youtube.com/embed/gYeV3tKIgSQ"
              title="Renaissance Afrik — Animation IA"
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
              sandbox="allow-scripts allow-same-origin allow-presentation"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        </motion.div>

        {/* Le défi */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35 }}
          className="py-10 md:py-16 border-b border-gray-200"
        >
          <div className="text-[10px] font-mono tracking-[0.2em] uppercase text-gray-400 mb-8">Le défi</div>
          <div className="grid md:grid-cols-2 gap-8 md:gap-16">
            <p className="text-[14px] md:text-[15px] text-gray-600 leading-[1.8]">
              Concevoir une animation visuellement forte autour de la thématique de la
              renaissance culturelle africaine, sans équipe de production traditionnelle —
              uniquement des outils d'intelligence artificielle générative.
            </p>
            <p className="text-[14px] md:text-[15px] text-gray-600 leading-[1.8]">
              Le défi : maintenir une cohérence visuelle et narrative d'un bout à l'autre
              de la séquence, en maîtrisant les outils IA pour obtenir un rendu
              cinématographique de qualité professionnelle.
            </p>
          </div>
        </motion.div>

        {/* Mon rôle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="py-10 md:py-16 border-b border-gray-200"
        >
          <div className="text-[10px] font-mono tracking-[0.2em] uppercase text-gray-400 mb-8">Mon rôle</div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                num: "01",
                title: "Direction Artistique",
                desc: "Conception du concept visuel, choix de l'esthétique, du style graphique et de la narration de l'animation.",
              },
              {
                num: "02",
                title: "Génération IA",
                desc: "Production des visuels et séquences avec Midjourney, Runway et Kling — prompt engineering et itérations créatives.",
              },
              {
                num: "03",
                title: "Montage & Export",
                desc: "Assemblage des séquences, synchronisation, post-traitement et export final pour diffusion sur YouTube.",
              },
            ].map(({ num, title, desc }) => (
              <div key={num} className="flex flex-col gap-3">
                <span className="text-[10px] font-mono text-gray-400">{num}</span>
                <h4 className="text-[15px] font-medium tracking-tight text-[#111]">{title}</h4>
                <p className="text-[13px] text-gray-500 leading-[1.7]">{desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Dark CTA */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.5 }}
        className="mt-16 md:mt-24 bg-[#0a0a0a] text-white px-6 md:px-16 py-20 md:py-32 flex flex-col items-center text-center"
      >
        <div className="text-[10px] font-mono tracking-[0.2em] uppercase text-gray-500 mb-6">Disponible sur YouTube</div>
        <h2 className="text-[2rem] md:text-[3.5rem] font-medium tracking-tight mb-10 max-w-xl">
          Voir Afrique Renaissance en entier
        </h2>
        <a
          href="https://youtu.be/gYeV3tKIgSQ"
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-3 bg-white text-[#111] px-8 py-4 rounded-md text-[13px] font-medium tracking-wide hover:shadow-[4px_4px_0px_rgba(255,255,255,0.3)] transition-all duration-300"
        >
          Voir la vidéo
          <ArrowUpRight size={16} strokeWidth={1.5} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </a>
      </motion.section>
      <SiteFooter />
    </div>
  );
}

// ─── RELATED ARTICLES ────────────────────────────────────────────────────────

const allArticles: Record<string, { id: string; cat: string; catColor: string; title: string }> = {
  "nocode-vs-dev":           { id: "nocode-vs-dev",           cat: "No-Code",        catColor: "bg-[#f97316]", title: "No-Code vs Développement classique" },
  "5-processus-automatiser": { id: "5-processus-automatiser", cat: "Automatisation",  catColor: "bg-[#a855f7]", title: "5 processus à automatiser cette année" },
  "ia-productivite-pme":     { id: "ia-productivite-pme",     cat: "IA",             catColor: "bg-[#a855f7]", title: "L'IA pour doubler la productivité de votre équipe" },
  "site-qui-fait-fuir":      { id: "site-qui-fait-fuir",      cat: "Web Design",     catColor: "bg-[#ec4899]", title: "Pourquoi votre site fait fuir vos clients" },
  "app-sans-developpeur":    { id: "app-sans-developpeur",    cat: "No-Code",        catColor: "bg-[#f97316]", title: "Créer une app sans développeur en 30 jours" },
};

function RelatedArticles({ ids, onNavigate }: { ids: string[]; onNavigate: (page: string) => void }) {
  const articles = ids.map(id => allArticles[id]).filter(Boolean);
  if (!articles.length) return null;
  return (
    <div className="mt-16 pt-10 border-t border-gray-200">
      <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-gray-400 mb-6">Articles liés</p>
      <div className="grid sm:grid-cols-2 gap-4">
        {articles.map(a => (
          <button
            key={a.id}
            onClick={() => onNavigate(`blog-${a.id}`)}
            className="group text-left border border-gray-200 rounded-md px-5 py-4 hover:border-[#111] transition-colors duration-300"
          >
            <span className={`inline-block text-[9px] font-mono uppercase tracking-widest text-white ${a.catColor} px-2 py-0.5 rounded-full mb-2`}>{a.cat}</span>
            <p className="text-[13px] font-medium text-[#111] leading-snug group-hover:underline underline-offset-2">{a.title}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── BLOG ARTICLE: NO-CODE VS DEV ───────────────────────────────────────────

function BlogArticleNocodeVsDev({ onBack, onNavigate }: { onBack: () => void; onNavigate: (p: string) => void }) {
  useEffect(() => {
    window.scrollTo(0, 0);
    setPageMeta(
      "No-Code vs Développement classique — FRK-France",
      "No-Code ou développement classique ? Comparez budgets, délais et cas d'usage pour choisir la meilleure approche pour votre projet digital en 2026.",
      "/blog/nocode-vs-dev/"
    );
  }, []);

  const tableRows = [
    { crit: "Budget moyen",        nocode: "1 000 – 8 000 €",  dev: "5 000 – 50 000 €" },
    { crit: "Délai livraison",     nocode: "1 – 4 semaines",   dev: "3 – 12 mois" },
    { crit: "Autonomie client",    nocode: "Élevée ✓",         dev: "Faible" },
    { crit: "Flexibilité technique", nocode: "Limitée",        dev: "Totale ✓" },
    { crit: "Scalabilité",         nocode: "Moyenne",          dev: "Élevée ✓" },
  ];

  return (
    <div className="bg-[#fcfcfc] min-h-screen font-sans text-[#111] overflow-x-hidden">

      {/* Hero */}
      <section className="pt-[57px] bg-[#0a0a0a] text-white px-6 md:px-16 py-20 md:py-32">
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="flex items-center gap-4 mb-8">
              <span className="bg-[#f97316] text-white text-[10px] font-mono uppercase tracking-widest px-3 py-1.5 rounded-full">No-Code & IA</span>
              <span className="text-[11px] font-mono uppercase tracking-widest text-gray-500">7 Avril 2026 · 8 min de lecture</span>
            </div>
            <h1 className="text-[2rem] sm:text-[2.8rem] md:text-[3.8rem] font-medium tracking-tight leading-[1.05] mb-8">
              No-Code vs Développement classique : que choisir pour votre PME en 2026 ?
            </h1>
            <p className="text-[16px] md:text-[18px] text-gray-400 leading-[1.8] max-w-2xl">
              Deux approches, deux philosophies, deux budgets. Voici un comparatif honnête pour prendre la bonne décision selon votre contexte.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Article body */}
      <article className="px-6 md:px-16 py-16 md:py-24">
        <div className="max-w-3xl mx-auto space-y-10 text-[15px] text-gray-600 leading-[1.9]">

          {/* Section 1 */}
          <div>
            <h2 className="text-[1.5rem] md:text-[2rem] font-medium tracking-tight text-[#111] mb-5">La question que tout dirigeant de PME se pose</h2>
            <p>Vous avez besoin d'un site web, d'une application ou d'un outil digital pour votre entreprise. Deux options s'offrent à vous : faire appel à un développeur pour coder une solution sur-mesure, ou utiliser des outils No-Code comme Webflow, Bubble ou Weweb. La question n'est pas "lequel est meilleur" — c'est "lequel est adapté à votre situation".</p>
            <blockquote className="border-l-2 border-[#f97316] pl-6 my-8">
              <p className="text-[#111] text-[16px] italic">"Le meilleur outil est celui qui vous permet d'atteindre vos objectifs dans votre budget et votre délai — pas le plus techniquement sophistiqué."</p>
            </blockquote>
          </div>

          {/* Section 2 */}
          <div>
            <h2 className="text-[1.5rem] md:text-[2rem] font-medium tracking-tight text-[#111] mb-5">Le Développement classique : puissance et flexibilité totale</h2>
            <h3 className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#f97316] mb-3">Ce que c'est</h3>
            <p>Le développement traditionnel consiste à écrire du code from scratch (HTML, CSS, JavaScript, Python, etc.) ou à utiliser des frameworks (React, Laravel, Django) pour construire une solution entièrement personnalisée.</p>
            <h3 className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#f97316] mb-3 mt-8">Les avantages</h3>
            <ul className="space-y-2">
              {[
                ["Flexibilité totale", "Aucune limite technique sur ce que vous pouvez construire"],
                ["Performance optimale", "Code optimisé = chargement ultra-rapide"],
                ["Scalabilité", "S'adapte à des millions d'utilisateurs"],
                ["Intégrations complexes", "Connectez n'importe quel système ou API"],
                ["Propriété totale", "Vous possédez 100% du code source"],
              ].map(([k, v]) => (
                <li key={k} className="flex gap-3"><span className="text-[#f97316] shrink-0">—</span><span><strong className="text-[#111] font-medium">{k}</strong> — {v}</span></li>
              ))}
            </ul>
            <h3 className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#f97316] mb-3 mt-8">Les inconvénients</h3>
            <ul className="space-y-2">
              {[
                ["Coût élevé", "Entre 5 000 € et 50 000 € selon la complexité"],
                ["Délais longs", "3 à 12 mois pour une application complète"],
                ["Maintenance technique", "Nécessite un développeur pour chaque modification"],
                ["Risque de bugs", "Plus de code = plus de risques d'erreurs"],
              ].map(([k, v]) => (
                <li key={k} className="flex gap-3"><span className="text-[#f97316] shrink-0">—</span><span><strong className="text-[#111] font-medium">{k}</strong> — {v}</span></li>
              ))}
            </ul>
          </div>

          {/* Section 3 */}
          <div>
            <h2 className="text-[1.5rem] md:text-[2rem] font-medium tracking-tight text-[#111] mb-5">Le No-Code : rapidité et autonomie</h2>
            <h3 className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#f97316] mb-3">Ce que c'est</h3>
            <p>Le No-Code utilise des plateformes visuelles (Webflow, Bubble, Weweb, Make) pour construire des produits digitaux sans écrire de code. Vous assemblez des composants, définissez des logiques et créez des automatisations via des interfaces graphiques.</p>
            <h3 className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#f97316] mb-3 mt-8">Les avantages</h3>
            <ul className="space-y-2">
              {[
                ["10× plus rapide", "Un site professionnel en 1 à 4 semaines"],
                ["Coût réduit", "Entre 1 000 € et 8 000 € pour la majorité des projets PME"],
                ["Autonomie", "Vous pouvez modifier le contenu vous-même"],
                ["Itération rapide", "Tester et ajuster en quelques heures"],
                ["Maintenance simplifiée", "Les plateformes gèrent les mises à jour techniques"],
              ].map(([k, v]) => (
                <li key={k} className="flex gap-3"><span className="text-[#f97316] shrink-0">—</span><span><strong className="text-[#111] font-medium">{k}</strong> — {v}</span></li>
              ))}
            </ul>
            <h3 className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#f97316] mb-3 mt-8">Les inconvénients</h3>
            <ul className="space-y-2">
              {[
                ["Limites techniques", "Fonctionnalités très complexes difficiles à implémenter"],
                ["Dépendance plateforme", "Si Webflow ferme, votre site aussi"],
                ["Performance variable", "Peut être moins rapide qu'une solution custom"],
                ["Coûts d'abonnement", "Entre 20 € et 200 €/mois selon la plateforme"],
              ].map(([k, v]) => (
                <li key={k} className="flex gap-3"><span className="text-[#f97316] shrink-0">—</span><span><strong className="text-[#111] font-medium">{k}</strong> — {v}</span></li>
              ))}
            </ul>
          </div>

          {/* Table */}
          <div>
            <h2 className="text-[1.5rem] md:text-[2rem] font-medium tracking-tight text-[#111] mb-5">Le tableau comparatif</h2>
            <p className="mb-6">Voici une synthèse chiffrée pour faciliter votre décision :</p>
            <div className="overflow-hidden rounded-md border border-gray-200">
              <div className="grid grid-cols-3 bg-gray-100 text-[10px] font-mono uppercase tracking-[0.2em]">
                <div className="p-4 text-[#f97316]">Critère</div>
                <div className="p-4 text-[#111] border-l border-gray-200">No-Code</div>
                <div className="p-4 text-[#111] border-l border-gray-200">Dev classique</div>
              </div>
              {tableRows.map((row, i) => (
                <div key={i} className={`grid grid-cols-3 border-t border-gray-200 text-[13px] ${i % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                  <div className="p-4 text-gray-500">{row.crit}</div>
                  <div className={`p-4 border-l border-gray-200 ${row.nocode.includes("✓") ? "text-emerald-600 font-medium" : "text-[#111]"}`}>{row.nocode}</div>
                  <div className={`p-4 border-l border-gray-200 ${row.dev.includes("✓") ? "text-emerald-600 font-medium" : "text-[#111]"}`}>{row.dev}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Quand choisir */}
          <div>
            <h2 className="text-[1.5rem] md:text-[2rem] font-medium tracking-tight text-[#111] mb-5">Quand choisir le No-Code ?</h2>
            <ul className="space-y-2">
              {[
                "Vous lancez un MVP ou souhaitez valider une idée rapidement",
                "Votre budget est inférieur à 10 000 €",
                "Vous avez besoin d'autonomie pour modifier le contenu",
                "Votre projet est un site vitrine, portfolio, e-commerce ou app métier standard",
                "Vous visez une mise en ligne en moins de 2 mois",
              ].map((item) => (
                <li key={item} className="flex gap-3"><span className="text-[#f97316] shrink-0">—</span><span>{item}</span></li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-[1.5rem] md:text-[2rem] font-medium tracking-tight text-[#111] mb-5">Quand choisir le développement classique ?</h2>
            <ul className="space-y-2">
              {[
                "Votre application a des besoins techniques très spécifiques (algorithmes complexes, IA sur-mesure)",
                "Vous anticipez des millions d'utilisateurs ou des pics de trafic extrêmes",
                "Vous avez des exigences de sécurité ou de conformité strictes (santé, finance)",
                "Vous voulez posséder et contrôler 100% du code sans dépendance plateforme",
                "Votre budget dépasse 15 000 € et vous avez du temps",
              ].map((item) => (
                <li key={item} className="flex gap-3"><span className="text-[#f97316] shrink-0">—</span><span>{item}</span></li>
              ))}
            </ul>
          </div>

          {/* Conclusion */}
          <div>
            <h2 className="text-[1.5rem] md:text-[2rem] font-medium tracking-tight text-[#111] mb-5">La bonne nouvelle : les deux peuvent coexister</h2>
            <p>De nombreux projets réussis combinent les deux approches. <strong className="text-[#111] font-medium">Webflow pour le front-end</strong> (rapide, beau, autonome) connecté à une <strong className="text-[#111] font-medium">API custom</strong> pour la logique métier complexe. Ou un <strong className="text-[#111] font-medium">Bubble pour le MVP</strong> suivi d'une migration vers du code natif une fois le produit validé par le marché.</p>
            <p>L'essentiel : commencez par définir vos objectifs, votre budget et votre délai — la technologie suivra naturellement.</p>
            <blockquote className="border-l-2 border-[#f97316] pl-6 my-8">
              <p className="text-[#111] text-[16px] italic">"Ne construisez pas un Boeing quand vous avez besoin d'une voiture."</p>
            </blockquote>
          </div>
        </div>
      </article>

      {/* CTA */}
      <section className="px-6 md:px-16 py-16 bg-gray-50">
        <div className="max-w-3xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 bg-[#0a0a0a] p-10 rounded-md">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-[#f97316] mb-2">Vous hésitez encore ?</div>
            <h3 className="text-xl font-medium text-white tracking-tight">Parlons de votre projet.</h3>
            <p className="text-gray-400 text-[13px] mt-2">Je vous aide à choisir la bonne approche selon votre contexte.</p>
          </div>
          <a href="mailto:franck@fkr-france.fr" className="shrink-0 inline-flex items-center gap-2 bg-[#f97316] text-white px-7 py-3.5 rounded-md text-[13px] font-medium tracking-wide hover:bg-[#ea6b0a] transition-colors duration-300">
            Me contacter
            <ArrowUpRight size={15} strokeWidth={1.5} />
          </a>
        </div>
      </section>
      <div className="px-6 md:px-16 max-w-3xl mx-auto">
        <RelatedArticles ids={["5-processus-automatiser", "ia-productivite-pme", "site-qui-fait-fuir", "app-sans-developpeur"]} onNavigate={onNavigate} />
      </div>
      <SiteFooter />
    </div>
  );
}

// ─── BLOG ARTICLE: 5 PROCESSUS ───────────────────────────────────────────────

function BlogArticle5Processus({ onBack, onNavigate }: { onBack: () => void; onNavigate: (p: string) => void }) {
  useEffect(() => {
    window.scrollTo(0, 0);
    setPageMeta(
      "5 processus à automatiser dans votre PME — FRK-France",
      "Découvrez 5 processus que toute PME devrait automatiser avec Make, n8n ou Zapier pour gagner des heures par semaine et réduire les erreurs humaines.",
      "/blog/5-processus-automatiser/"
    );
  }, []);
  const li = (txt: string) => <li className="flex gap-3"><span className="text-[#f97316] shrink-0">—</span><span>{txt}</span></li>;
  const h2 = (txt: string) => <h2 className="text-[1.5rem] md:text-[2rem] font-medium tracking-tight text-[#111] mb-5">{txt}</h2>;
  const h3 = (txt: string) => <h3 className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#f97316] mb-3 mt-8">{txt}</h3>;
  const bq = (txt: string) => <blockquote className="border-l-2 border-[#f97316] pl-6 my-8"><p className="text-[#111] text-[16px] italic">{txt}</p></blockquote>;
  return (
    <div className="bg-[#fcfcfc] min-h-screen font-sans text-[#111] overflow-x-hidden">
      <section className="pt-[57px] bg-[#0a0a0a] text-white px-6 md:px-16 py-20 md:py-32">
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="flex items-center gap-4 mb-8">
              <span className="bg-[#a855f7] text-white text-[10px] font-mono uppercase tracking-widest px-3 py-1.5 rounded-full">Automatisation</span>
              <span className="text-[11px] font-mono uppercase tracking-widest text-gray-500">7 Avril 2026 · 6 min de lecture</span>
            </div>
            <h1 className="text-[2rem] sm:text-[2.8rem] md:text-[3.8rem] font-medium tracking-tight leading-[1.05] mb-8">5 processus que toute PME devrait automatiser cette année</h1>
            <p className="text-[16px] md:text-[18px] text-gray-400 leading-[1.8] max-w-2xl">Facturation, relances clients, onboarding, reporting, support… Voici les cinq automatisations qui libèrent en moyenne 10 heures par semaine dans une PME de 10 à 50 personnes.</p>
          </motion.div>
        </div>
      </section>
      <article className="px-6 md:px-16 py-16 md:py-24">
        <div className="max-w-3xl mx-auto space-y-10 text-[15px] text-gray-600 leading-[1.9]">
          <div>{h2("Pourquoi automatiser maintenant ?")}
            <p>Les PME croulent sous les tâches répétitives. Saisie manuelle, copier-coller entre outils, relances oubliées, rapports faits à la main chaque lundi… Ces micro-pertes de temps s'accumulent et représentent souvent <strong className="text-[#111] font-medium">2 à 3 ETP non productifs</strong> par an dans une structure de 15 personnes.</p>
            <p>Avec des outils comme <strong className="text-[#111] font-medium">Make</strong>, <strong className="text-[#111] font-medium">n8n</strong> ou <strong className="text-[#111] font-medium">Airtable</strong>, la plupart de ces processus s'automatisent sans une seule ligne de code.</p>
            {bq("Automatiser une tâche répétitive, c'est s'offrir un collaborateur qui travaille 24h/24, ne fait jamais d'erreur, et ne prend pas de congés.")}
          </div>
          {[
            { num: "01", title: "La Facturation et le suivi des paiements",
              pb: "Créer des factures, envoyer des relances, mettre à jour la trésorerie — dans la plupart des PME, cette chaîne est encore semi-manuelle.",
              cible: ["Création automatique de la facture depuis le CRM dès qu'un devis est accepté","Envoi par email avec un lien de paiement (Stripe, Mollie)","Relance à J+7, J+14, J+30 si le paiement n'est pas reçu","Mise à jour automatique du tableau de trésorerie dans Airtable ou Google Sheets"],
              outils: "Make + Pennylane / Qonto + Stripe. Résultat constaté : −80% du temps de gestion administrative.", },
            { num: "02", title: "L'Onboarding nouveaux clients",
              pb: "Chaque nouveau client déclenche la même séquence manuelle — email de bienvenue, contrat, accès outils, réunion kick-off. Fait à la main : 2 à 4 heures par client.",
              cible: ["Dès la signature du contrat : déclenchement de la séquence","Création automatique du dossier client dans Notion / Google Drive","Email de bienvenue personnalisé + questionnaire d'onboarding","Invitation aux outils partagés (Slack, Notion, Figma…)","Création d'une tâche dans votre outil de gestion de projet"],
              outils: "n8n + Notion + Gmail. Ce que vous faisiez en 3 heures se fait en 3 minutes. Sans erreur. Sans oubli.", },
            { num: "03", title: "La Gestion des leads entrants",
              pb: "Un prospect remplit votre formulaire. Et ensuite ? La plupart des PME perdent entre 20 et 40% de leurs leads faute de suivi structuré.",
              cible: ["Réception du formulaire → création automatique d'une fiche contact dans le CRM","Email de confirmation immédiat au prospect (chaleureux, personnalisé)","Notification interne (Slack, SMS) à la personne en charge","Si pas de réponse à J+3 : relance automatique","Score de lead calculé selon les informations fournies"],
              outils: "Make + HubSpot + Brevo. Délai de prise en charge : < 60 secondes.", },
            { num: "04", title: "Le Reporting hebdomadaire",
              pb: "Chaque lundi, quelqu'un collecte des données éparpillées dans 5 outils, fait des copier-collers dans un Google Slides. Répétitif, chronophage, données souvent en retard.",
              cible: ["Collecte automatique des KPIs depuis toutes vos sources (GA4, HubSpot, Stripe, Airtable)","Compilation dans un dashboard Notion ou Google Sheets","Envoi automatique du rapport par email ou Slack chaque lundi à 8h00","Alertes en temps réel si un indicateur passe sous un seuil critique"],
              outils: "n8n + Google Sheets + Slack. Le lundi matin, votre équipe lit le rapport au lieu de le fabriquer.", },
            { num: "05", title: "Le Support client de premier niveau",
              pb: "60 à 70% des demandes de support concernent les mêmes 10 à 15 questions. Faire répondre un humain à ces questions est un gâchis de temps — et de talent.",
              cible: ["Chatbot IA (formé sur votre FAQ) pour les questions récurrentes","Réponses automatiques aux emails entrants selon des mots-clés","Escalade intelligente : si l'IA ne sait pas, ticket créé et assigné à un humain","Suivi automatique : email de clôture + demande d'avis"],
              outils: "n8n + OpenAI API + Freshdesk. Résultat moyen : −60% de tickets traités manuellement.", },
          ].map(({ num, title, pb, cible, outils }) => (
            <div key={num}>
              <div className="text-[4rem] font-bold leading-none text-[#f97316]/15 font-mono mb-0">{num}</div>
              {h2(title)}
              {h3("Le problème")}<p>{pb}</p>
              {h3("L'automatisation cible")}<ul className="space-y-2">{cible.map(t => li(t))}</ul>
              {h3("Outils recommandés")}<p><strong className="text-[#111] font-medium">{outils}</strong></p>
            </div>
          ))}
          <div>{h2("Par où commencer ?")}
            <p>Ne cherchez pas à tout automatiser d'un coup. Voici la méthode appliquée avec les clients PME :</p>
            <ul className="space-y-2">{[
              "Étape 1 — Audit de 2h : lister toutes les tâches répétitives effectuées chaque semaine",
              "Étape 2 — Priorisation : classer par fréquence × temps passé × risque d'erreur humaine",
              "Étape 3 — Quick wins : automatiser d'abord les 2 processus avec le meilleur ROI",
              "Étape 4 — Itération : une nouvelle automatisation par mois, mesurer l'impact",
            ].map(t => li(t))}</ul>
            <p>La plupart des clients PME récupèrent leur investissement en <strong className="text-[#111] font-medium">moins de 6 semaines</strong>.</p>
          </div>
        </div>
      </article>
      <section className="px-6 md:px-16 py-16 bg-gray-50">
        <div className="max-w-3xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 bg-[#0a0a0a] p-10 rounded-md">
          <div><div className="text-[10px] font-mono uppercase tracking-widest text-[#f97316] mb-2">Passons à l'action</div><h3 className="text-xl font-medium text-white tracking-tight">Audit gratuit de 30 min</h3><p className="text-gray-400 text-[13px] mt-2">J'identifie vos meilleures opportunités d'automatisation.</p></div>
          <a href="mailto:franck@fkr-france.fr" className="shrink-0 inline-flex items-center gap-2 bg-[#f97316] text-white px-7 py-3.5 rounded-md text-[13px] font-medium tracking-wide hover:bg-[#ea6b0a] transition-colors duration-300">Me contacter<ArrowUpRight size={15} strokeWidth={1.5} /></a>
        </div>
      </section>
      <div className="px-6 md:px-16 max-w-3xl mx-auto">
        <RelatedArticles ids={["ia-productivite-pme", "nocode-vs-dev"]} onNavigate={onNavigate} />
      </div>
            <SiteFooter />
    </div>
  );
}

// ─── BLOG ARTICLE: IA PRODUCTIVITÉ PME ───────────────────────────────────────

function BlogArticleIaProductivite({ onBack, onNavigate }: { onBack: () => void; onNavigate: (p: string) => void }) {
  useEffect(() => {
    window.scrollTo(0, 0);
    setPageMeta(
      "L'IA double votre productivité — FRK-France",
      "ChatGPT, Claude, Copilot : comment intégrer l'IA générative dans votre PME dès cette semaine pour doubler la productivité sans écrire de code.",
      "/blog/ia-productivite-pme/"
    );
  }, []);
  const li = (txt: string) => <li className="flex gap-3"><span className="text-[#f97316] shrink-0">—</span><span>{txt}</span></li>;
  const h2 = (txt: string) => <h2 className="text-[1.5rem] md:text-[2rem] font-medium tracking-tight text-[#111] mb-5">{txt}</h2>;
  const h3 = (txt: string) => <h3 className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#f97316] mb-3 mt-8">{txt}</h3>;
  const bq = (txt: string) => <blockquote className="border-l-2 border-[#f97316] pl-6 my-8"><p className="text-[#111] text-[16px] italic">{txt}</p></blockquote>;
  return (
    <div className="bg-[#fcfcfc] min-h-screen font-sans text-[#111] overflow-x-hidden">
      <section className="pt-[57px] bg-[#0a0a0a] text-white px-6 md:px-16 py-20 md:py-32">
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="flex items-center gap-4 mb-8">
              <span className="bg-[#a855f7] text-white text-[10px] font-mono uppercase tracking-widest px-3 py-1.5 rounded-full">IA & Productivité</span>
              <span className="text-[11px] font-mono uppercase tracking-widest text-gray-500">7 Avril 2026 · 7 min de lecture</span>
            </div>
            <h1 className="text-[2rem] sm:text-[2.8rem] md:text-[3.8rem] font-medium tracking-tight leading-[1.05] mb-8">Comment l'IA peut doubler la productivité de votre équipe sans coder</h1>
            <p className="text-[16px] md:text-[18px] text-gray-400 leading-[1.8] max-w-2xl">ChatGPT, Claude, Copilot, Perplexity… L'IA générative n'est plus une promesse futuriste. Voici comment l'intégrer concrètement dans votre PME dès cette semaine — sans écrire une ligne de code.</p>
          </motion.div>
        </div>
      </section>
      <article className="px-6 md:px-16 py-16 md:py-24">
        <div className="max-w-3xl mx-auto space-y-10 text-[15px] text-gray-600 leading-[1.9]">
          <div>{h2("Le mythe de l'IA réservée aux grandes entreprises")}
            <p>Beaucoup de dirigeants de PME pensent encore que l'IA, c'est pour les GAFAM. En 2026, c'est faux. Les outils IA les plus puissants sont accessibles dès <strong className="text-[#111] font-medium">20€/mois</strong> et peuvent transformer des postes entiers dès la première semaine.</p>
            {bq("L'IA ne remplace pas les humains qui l'utilisent bien — elle les rend 2 à 3 fois plus efficaces que ceux qui ne l'utilisent pas.")}
          </div>
          <div>{h2("Le principe de base : l'IA comme collaborateur permanent")}
            <p>La plupart des équipes utilisent l'IA comme un moteur de recherche amélioré. La vraie puissance vient quand vous la traitez comme un <strong className="text-[#111] font-medium">collaborateur intégré dans vos workflows</strong> : elle connaît votre contexte, votre style, vos contraintes.</p>
          </div>
          <div>{h2("Par métier : comment l'IA multiplie la productivité")}
            {[
              { role: "Marketing & Communication", gain: "8 à 12h/semaine par marketeur", items: ["Rédaction des posts LinkedIn, emails, newsletters (en maintenant la voix de marque)","Brief créatif complet en 15 minutes au lieu de 3 heures","Analyse de contenu concurrent + angles non couverts","Génération de 20 variantes d'un même message pour A/B testing","Traduction et adaptation culturelle pour des marchés internationaux"] },
              { role: "Commercial & Business Development", gain: "6 à 10h/semaine par commercial", items: ["Recherche et synthèse sur un prospect en 5 minutes","Rédaction d'emails de prospection ultra-personnalisés","Préparation de réponses aux objections courantes","Compte-rendu de réunion depuis une transcription vocale (Otter.ai + GPT)","Qualification de leads : analyse des emails entrants et scoring automatique"] },
              { role: "Opérations & Administration", gain: "5 à 8h/semaine par profil administratif", items: ["Rédaction de procédures internes à partir d'une description orale","Analyse de contrats et identification des clauses à risque","Réponses aux emails courants selon des templates personnalisables","Synthèse de documents longs (rapports, études, PV de réunion)","Création de formules complexes dans Excel / Google Sheets"] },
              { role: "Direction & Management", gain: "4 à 6h/semaine pour un dirigeant", items: ["Préparation de présentations investisseurs / comités de direction","Analyse de données financières et construction de scénarios","Rédaction de job descriptions attractives et structurées","Veille stratégique condensée chaque matin (Perplexity + prompt personnalisé)","Coaching de rédaction pour les communications internes importantes"] },
            ].map(({ role, gain, items }) => (
              <div key={role}>{h3(role)}<ul className="space-y-2">{items.map(t => li(t))}</ul><p><strong className="text-[#111] font-medium">Gain estimé : {gain}.</strong></p></div>
            ))}
          </div>
          <div>{h2("Les outils incontournables en 2026")}
            <ul className="space-y-2">{[
              "Claude (Anthropic) — Meilleur pour la rédaction longue, l'analyse de documents, les tâches complexes",
              "ChatGPT Teams — Idéal pour les équipes, partage de conversations et GPTs personnalisés",
              "Microsoft Copilot — Intégré à Office 365, parfait si vous utilisez déjà l'écosystème Microsoft",
              "Perplexity — Recherche en temps réel avec sources, idéal pour la veille",
              "Otter.ai — Transcription et synthèse de réunions en temps réel",
              "Midjourney / Adobe Firefly — Génération d'images pour les équipes créatives",
            ].map(t => li(t))}</ul>
          </div>
          <div>{h2("La méthode en 3 semaines pour déployer l'IA dans votre équipe")}
            {[
              { s: "Semaine 1 — Expérimentation individuelle", txt: "Demandez à chaque membre de l'équipe de choisir une tâche répétitive dans sa semaine et de la tester avec ChatGPT ou Claude. Pas d'objectif de productivité, juste l'exploration. Débrief de 30 minutes en fin de semaine." },
              { s: "Semaine 2 — Construction des prompts maison", txt: "À partir des retours, créez une bibliothèque de prompts partagée dans Notion. Un bon prompt inclut toujours : le rôle de l'IA, le contexte, la tâche précise, le format de sortie, les contraintes. Ces prompts deviennent de véritables assets d'entreprise." },
              { s: "Semaine 3 — Intégration dans les workflows", txt: "Choisissez les 3 cas d'usage les plus impactants et intégrez-les formellement dans vos processus : checklist d'onboarding, SOP mise à jour, formation de 1h pour les nouveaux arrivants." },
            ].map(({ s, txt }) => <div key={s}>{h3(s)}<p>{txt}</p></div>)}
          </div>
          <div>{h2("Les erreurs à éviter")}
            <ul className="space-y-2">{[
              "Faire confiance aveuglément aux outputs : l'IA hallucine. Vérifiez toujours les faits, les chiffres, les sources",
              "Publier sans relecture : l'IA produit le premier jet — un humain produit le texte final",
              "Ignorer la confidentialité : ne jamais coller de données clients sensibles dans des outils grand public",
              "Vouloir tout automatiser d'un coup : commencez par 2-3 cas d'usage, maîtrisez-les, puis scalez",
              "Négliger la formation : une heure de formation bien faite vaut 10 heures de tâtonnement individuel",
            ].map(t => li(t))}</ul>
            {bq("Dans 3 ans, il n'y aura plus d'entreprises IA et non-IA. Il y aura des entreprises efficaces, et des entreprises en retard.")}
          </div>
        </div>
      </article>
      <section className="px-6 md:px-16 py-16 bg-gray-50">
        <div className="max-w-3xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 bg-[#0a0a0a] p-10 rounded-md">
          <div><div className="text-[10px] font-mono uppercase tracking-widest text-[#f97316] mb-2">Accélérez votre transformation</div><h3 className="text-xl font-medium text-white tracking-tight">Intégrons l'IA dans vos workflows</h3><p className="text-gray-400 text-[13px] mt-2">Workshop demi-journée pour construire vos premiers prompts d'entreprise.</p></div>
          <a href="mailto:franck@fkr-france.fr" className="shrink-0 inline-flex items-center gap-2 bg-[#f97316] text-white px-7 py-3.5 rounded-md text-[13px] font-medium tracking-wide hover:bg-[#ea6b0a] transition-colors duration-300">Me contacter<ArrowUpRight size={15} strokeWidth={1.5} /></a>
        </div>
      </section>
      <div className="px-6 md:px-16 max-w-3xl mx-auto">
        <RelatedArticles ids={["5-processus-automatiser", "nocode-vs-dev"]} onNavigate={onNavigate} />
      </div>
            <SiteFooter />
    </div>
  );
}

// ─── BLOG ARTICLE: SITE QUI FAIT FUIR ────────────────────────────────────────

function BlogArticleSiteFuir({ onBack, onNavigate }: { onBack: () => void; onNavigate: (p: string) => void }) {
  useEffect(() => {
    window.scrollTo(0, 0);
    setPageMeta(
      "7 erreurs qui font fuir vos visiteurs — FRK-France",
      "Trop lent, illisible sur mobile, sans CTA clair ? Découvrez les 7 erreurs de site qui font fuir vos visiteurs et comment les corriger rapidement.",
      "/blog/site-qui-fait-fuir/"
    );
  }, []);
  const li = (txt: string) => <li className="flex gap-3"><span className="text-[#f97316] shrink-0">—</span><span>{txt}</span></li>;
  const h2 = (txt: string) => <h2 className="text-[1.5rem] md:text-[2rem] font-medium tracking-tight text-[#111] mb-5">{txt}</h2>;
  const h3 = (txt: string) => <h3 className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#f97316] mb-3 mt-8">{txt}</h3>;
  const bq = (txt: string) => <blockquote className="border-l-2 border-[#f97316] pl-6 my-8"><p className="text-[#111] text-[16px] italic">{txt}</p></blockquote>;
  return (
    <div className="bg-[#fcfcfc] min-h-screen font-sans text-[#111] overflow-x-hidden">
      <section className="pt-[57px] bg-[#0a0a0a] text-white px-6 md:px-16 py-20 md:py-32">
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="flex items-center gap-4 mb-8">
              <span className="bg-[#ec4899] text-white text-[10px] font-mono uppercase tracking-widest px-3 py-1.5 rounded-full">Web Design</span>
              <span className="text-[11px] font-mono uppercase tracking-widest text-gray-500">7 Avril 2026 · 6 min de lecture</span>
            </div>
            <h1 className="text-[2rem] sm:text-[2.8rem] md:text-[3.8rem] font-medium tracking-tight leading-[1.05] mb-8">Pourquoi votre site web fait fuir vos clients (et comment y remédier)</h1>
            <p className="text-[16px] md:text-[18px] text-gray-400 leading-[1.8] max-w-2xl">Vous avez un site. Les gens arrivent dessus. Et pourtant, le téléphone ne sonne pas. Voici les 7 erreurs qui transforment votre site en repoussoir à clients — et les solutions concrètes.</p>
          </motion.div>
        </div>
      </section>
      {/* Stats */}
      <section className="px-6 md:px-16 py-10 bg-[#f5f5f5] border-b border-gray-200">
        <div className="max-w-3xl mx-auto grid grid-cols-3 gap-4">
          {[{ n: "53%", l: "des visiteurs quittent un site si le chargement dépasse 3 secondes" },{ n: "88%", l: "ne reviennent jamais après une mauvaise expérience mobile" },{ n: "0.05s", l: "le temps pour se forger une première impression" }].map(({ n, l }) => (
            <div key={n} className="text-center p-5 bg-white rounded-md border border-gray-100">
              <div className="text-[2rem] font-bold text-[#ec4899] font-mono leading-none mb-2">{n}</div>
              <div className="text-[11px] text-gray-500 leading-[1.6]">{l}</div>
            </div>
          ))}
        </div>
      </section>
      <article className="px-6 md:px-16 py-16 md:py-24">
        <div className="max-w-3xl mx-auto space-y-10 text-[15px] text-gray-600 leading-[1.9]">
          <div>{h2("Le problème invisible")}
            <p>La plupart des dirigeants ne savent pas que leur site fait fuir des clients. Les clients qui partent ne disent rien — ils s'en vont. Vous ne voyez pas les 70% de visiteurs qui quittent votre page d'accueil en moins de 30 secondes.</p>
            {bq("Votre site n'est pas votre vitrine en ligne. C'est votre meilleur commercial. Et s'il ne vend pas, c'est qu'il a besoin d'une formation urgente.")}
          </div>
          {[
            { num: "Erreur 1", title: "Votre site est trop lent",
              diag: "Google PageSpeed Insights vous donne un score entre 0 et 100. En dessous de 70, vous perdez des clients. La majorité des sites PME tournent entre 30 et 50 : chaque seconde de chargement supplémentaire coûte 7% de conversions.",
              causes: ["Images non compressées (une photo de 8 Mo là où 200 Ko suffit)","Hébergement mutualisé bas de gamme","Trop de scripts tiers chargés au démarrage (chat, analytics, pixels)","Pas de cache navigateur configuré"],
              solution: "Compressez toutes vos images (Squoosh / TinyPNG). Passez sur un hébergeur de qualité (Infomaniak, o2switch). Activez un CDN (Cloudflare, gratuit). Ces actions seules peuvent faire passer un score de 35 à 75 en une journée." },
            { num: "Erreur 2", title: "Il n'est pas fait pour le mobile",
              diag: "En 2026, 65 à 70% de vos visiteurs arrivent sur mobile. Un vrai site mobile-first est pensé d'abord pour les pouces, pas pour les curseurs.",
              causes: ["Les boutons sont trop petits pour être cliqués facilement","Du texte qui déborde ou qui nécessite de zoomer","Les formulaires sont impossibles à remplir sur mobile","Les menus hamburger ne s'ouvrent pas correctement"],
              solution: "Testez votre site depuis votre propre téléphone, dans la peau d'un client qui ne vous connaît pas. Notez tout ce qui est difficile." },
            { num: "Erreur 3", title: "Le message est flou",
              diag: "Allez sur votre page d'accueil : peut-on répondre en 10 secondes à Qui êtes-vous ? Que faites-vous ? Pour qui ? Si non, vous perdez des leads immédiatement.",
              causes: ["Un titre hero du type « Bienvenue chez [nom] » (ne dit rien)","Un texte centré sur l'entreprise plutôt que sur le problème client","Du jargon que seuls vos pairs comprennent","Pas de proposition de valeur claire above the fold"],
              solution: 'Reformulez votre titre hero : "J\'aide [cible] à [résultat désirable] sans [contrainte principale]." Simple, direct, centré sur le client.' },
            { num: "Erreur 4", title: "Pas d'appel à l'action clair",
              diag: "Votre visiteur est convaincu. Il veut agir. Et là… il cherche. Un CTA ambigu ou trop discret coûte en moyenne 30 à 40% des conversions potentielles.",
              causes: ["Plusieurs CTAs qui se concurrencent","Formulation orientée entreprise plutôt que bénéfice client","Bouton visuellement indistinct du reste","CTA absent above the fold"],
              solution: "Une seule action principale par page. Visible sans scroller, formulée en bénéfice (pas 'Contactez-nous' mais 'Obtenir un devis gratuit'), répétée 2 à 3 fois sur la page." },
            { num: "Erreur 5", title: "Pas de preuve sociale",
              diag: "Vous dites que vous êtes excellent. Mais qui d'autre le dit ? En l'absence d'avis clients, le visiteur ne vous croit pas — même si tout ce que vous dites est vrai.",
              causes: ["Aucun témoignage client visible","Pas de logos de clients ou partenaires","Absence de chiffres concrets","Études de cas inexistantes"],
              solution: "" },
            { num: "Erreur 6", title: "Le design est daté ou générique",
              diag: "Les visiteurs jugent la crédibilité d'une entreprise en 0,05 seconde — et ce jugement est basé à 94% sur le design. Un site qui ressemble à un template 2015 envoie un signal négatif.",
              causes: [],
              solution: "Vous n'avez pas besoin d'un site révolutionnaire. Vous avez besoin d'un site cohérent avec votre positionnement. Une PME premium doit avoir un site premium." },
            { num: "Erreur 7", title: "Pas de stratégie de contenu",
              diag: "La majorité des visiteurs ne sont pas prêts à acheter lors de leur première visite. Si votre site ne propose aucun contenu (blog, guides), vous les perdez au profit des concurrents qui, eux, produisent du contenu.",
              causes: [],
              solution: "Commencez par 4 à 6 articles ciblant les questions que vos prospects se posent avant d'acheter. Ce contenu travaille pour vous 24h/24, 365 jours par an." },
          ].map(({ num, title, diag, causes, solution }) => (
            <div key={num}>
              {h2(`${num} — ${title}`)}
              {h3("Le diagnostic")}<p>{diag}</p>
              {causes.length > 0 && <>{h3("Les causes courantes")}<ul className="space-y-2">{causes.map(t => li(t))}</ul></>}
              {solution && <>{h3("La solution")}<p>{solution}</p></>}
            </div>
          ))}
          <div>{h2("Par où commencer ?")}
            <ul className="space-y-2">{[
              "Aujourd'hui : testez votre score PageSpeed et votre site sur mobile",
              "Cette semaine : réécrivez votre titre hero selon la formule ci-dessus",
              "Ce mois : collectez 3 témoignages clients et ajoutez-les à la page d'accueil",
              "Ce trimestre : envisagez une refonte partielle ou totale avec un professionnel",
            ].map(t => li(t))}</ul>
          </div>
        </div>
      </article>
      <section className="px-6 md:px-16 py-16 bg-gray-50">
        <div className="max-w-3xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 bg-[#0a0a0a] p-10 rounded-md">
          <div><div className="text-[10px] font-mono uppercase tracking-widest text-[#f97316] mb-2">Audit offert</div><h3 className="text-xl font-medium text-white tracking-tight">Votre site perd des clients en ce moment</h3><p className="text-gray-400 text-[13px] mt-2">Audit UX complet + rapport d'actions priorisées sous 48h.</p></div>
          <a href="mailto:franck@fkr-france.fr" className="shrink-0 inline-flex items-center gap-2 bg-[#f97316] text-white px-7 py-3.5 rounded-md text-[13px] font-medium tracking-wide hover:bg-[#ea6b0a] transition-colors duration-300">Me contacter<ArrowUpRight size={15} strokeWidth={1.5} /></a>
        </div>
      </section>
      <div className="px-6 md:px-16 max-w-3xl mx-auto">
        <RelatedArticles ids={["nocode-vs-dev", "app-sans-developpeur"]} onNavigate={onNavigate} />
      </div>
            <SiteFooter />
    </div>
  );
}

// ─── BLOG ARTICLE: APP SANS DÉVELOPPEUR ──────────────────────────────────────

function BlogArticleAppSansDev({ onBack, onNavigate }: { onBack: () => void; onNavigate: (p: string) => void }) {
  useEffect(() => {
    window.scrollTo(0, 0);
    setPageMeta(
      "Créer une app sans développeur — FRK-France",
      "Créez votre application web sans coder avec Bubble, Glide ou Softr. Guide pratique, coûts réels et étapes clés pour lancer votre app en 30 jours.",
      "/blog/app-sans-developpeur/"
    );
  }, []);
  const li = (txt: string) => <li className="flex gap-3"><span className="text-[#f97316] shrink-0">—</span><span>{txt}</span></li>;
  const h2 = (txt: string) => <h2 className="text-[1.5rem] md:text-[2rem] font-medium tracking-tight text-[#111] mb-5">{txt}</h2>;
  const h3 = (txt: string) => <h3 className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#f97316] mb-3 mt-8">{txt}</h3>;
  const bq = (txt: string) => <blockquote className="border-l-2 border-[#f97316] pl-6 my-8"><p className="text-[#111] text-[16px] italic">{txt}</p></blockquote>;
  const weeks = [
    { w: "Semaine 1 — Jours 1 à 7", title: "Définir & Prototyper", tools: ["Figma","FigJam","Notion"],
      items: ["Jour 1-2 : Listez toutes les fonctionnalités envisagées. Barrez tout ce qui n'est pas indispensable au MVP.","Jour 3-4 : Dessinez les wireframes des 3 à 5 écrans clés (papier suffit, Figma c'est mieux)","Jour 5-6 : Définissez votre modèle de données : quelles tables (utilisateurs, produits, commandes…) et quels champs","Jour 7 : Montrez votre prototype à 5 personnes de votre cible. Leurs questions et confusions = vos bugs de design."],
      deliverable: "Un prototype Figma cliquable + un schéma de données." },
    { w: "Semaine 2 — Jours 8 à 14", title: "Construire la base", tools: ["Weweb","Bubble","Supabase","Airtable"],
      items: ["Jour 8-9 : Créez votre compte et suivez le tutoriel officiel de votre outil. Ne sautez pas cette étape.","Jour 10-11 : Construisez votre base de données selon votre schéma. Créez quelques entrées de test.","Jour 12-13 : Construisez la page principale avec des données de test affichées","Jour 14 : Ajoutez l'authentification (login / signup) — la plupart des outils No-Code ont cette fonctionnalité en natif"],
      deliverable: "Une app avec authentification et une vue principale fonctionnelle avec vraies données." },
    { w: "Semaine 3 — Jours 15 à 21", title: "Logique & Workflows", tools: ["Make","n8n","Stripe","Brevo"],
      items: ["Jour 15-16 : Construisez les formulaires de création/édition d'entrées","Jour 17-18 : Ajoutez les workflows métier (si X alors Y : si un utilisateur s'inscrit, envoyer un email de bienvenue)","Jour 19-20 : Intégrez le paiement si nécessaire (Stripe s'intègre nativement dans Bubble et via Make dans Weweb)","Jour 21 : Testez l'app de bout en bout. Notez tous les bugs et comportements inattendus."],
      deliverable: "Un parcours utilisateur complet fonctionnel de A à Z." },
    { w: "Semaine 4 — Jours 22 à 30", title: "Polish & Lancement", tools: ["Cloudflare","Google Analytics","Hotjar"],
      items: ["Jour 22-24 : Corrigez les bugs. Améliorez l'UI des points de friction identifiés","Jour 25-26 : Connectez votre nom de domaine, configurez les emails transactionnels, activez SSL","Jour 27-28 : Installez Google Analytics 4 et Hotjar pour mesurer dès le premier jour","Jour 29 : Beta test avec 10 utilisateurs réels — pas des amis bienveillants","Jour 30 : Mise en ligne publique. Annonce LinkedIn, Product Hunt, newsletter…"],
      deliverable: "Votre app est en production, accessible au monde entier." },
  ];
  return (
    <div className="bg-[#fcfcfc] min-h-screen font-sans text-[#111] overflow-x-hidden">
      <section className="pt-[57px] bg-[#0a0a0a] text-white px-6 md:px-16 py-20 md:py-32">
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="flex items-center gap-4 mb-8">
              <span className="bg-[#f97316] text-white text-[10px] font-mono uppercase tracking-widest px-3 py-1.5 rounded-full">No-Code & IA</span>
              <span className="text-[11px] font-mono uppercase tracking-widest text-gray-500">7 Avril 2026 · 9 min de lecture</span>
            </div>
            <h1 className="text-[2rem] sm:text-[2.8rem] md:text-[3.8rem] font-medium tracking-tight leading-[1.05] mb-8">De l'idée à la mise en ligne : créer une app web sans développeur en 30 jours</h1>
            <p className="text-[16px] md:text-[18px] text-gray-400 leading-[1.8] max-w-2xl">Vous avez une idée d'application. Vous n'avez pas de budget pour un développeur. Ce guide vous montre comment passer de zéro à une app fonctionnelle en production — en 4 semaines.</p>
          </motion.div>
        </div>
      </section>
      <article className="px-6 md:px-16 py-16 md:py-24">
        <div className="max-w-3xl mx-auto space-y-10 text-[15px] text-gray-600 leading-[1.9]">
          <div>{h2("La révolution No-Code est déjà là")}
            <p>En 2026, le No-Code est une voie légitime pour lancer des produits sérieux. Des applications générant des millions d'euros de revenus ont été construites sur Bubble. La vraie limite du No-Code n'est pas technique — c'est la pensée produit.</p>
            {bq("Le No-Code ne rend pas les développeurs obsolètes. Il rend les idées exécutables par ceux qui les ont.")}
          </div>
          <div>{h2("Avant de commencer : les 3 questions décisives")}
            {[
              { q: "1. Qu'est-ce que votre app fait, exactement ?", a: "Pas une description floue : quelle est la toute première action que fait un nouvel utilisateur ? Quelle valeur reçoit-il dans les 60 premières secondes ? Si vous ne pouvez pas répondre en une phrase, l'idée n'est pas assez définie pour être construite." },
              { q: "2. Quel est votre MVP réel ?", a: "Un MVP n'est pas une version réduite de votre vision complète. C'est la version la plus simple possible qui permet de valider votre hypothèse principale. La plupart des gens construisent un MMP (Most Maximalist Product) en pensant faire un MVP." },
              { q: "3. Quel outil No-Code pour votre cas ?", a: "" },
            ].map(({ q, a }) => <div key={q}>{h3(q)}{a && <p>{a}</p>}</div>)}
            <ul className="space-y-2">{[
              "Site marketing + quelques formulaires : Weweb, Webflow, Framer",
              "App avec base de données et logique métier : Bubble, Weweb + Supabase",
              "Outil interne / dashboard : Retool, Softr, AppSmith",
              "Automatisations complexes : n8n, Make",
              "Marketplace ou SaaS B2B : Bubble (le plus puissant pour la logique complexe)",
            ].map(t => li(t))}</ul>
          </div>
          <div>{h2("Le planning 30 jours — semaine par semaine")}
            {weeks.map(({ w, title, tools, items, deliverable }) => (
              <div key={w} className="mt-8">
                <div className="bg-gray-50 border border-gray-200 rounded-md p-6 mb-4">
                  <div className="text-[9px] font-mono uppercase tracking-[0.2em] text-[#f97316] mb-2">{w}</div>
                  <h3 className="text-[15px] font-medium text-[#111] mb-3">{title}</h3>
                  <div className="flex flex-wrap gap-2">{tools.map(t => <span key={t} className="text-[9px] font-mono uppercase tracking-widest bg-[#111] text-white px-2 py-1 rounded-sm">{t}</span>)}</div>
                </div>
                <ul className="space-y-2 mb-3">{items.map(t => li(t))}</ul>
                <p><strong className="text-[#111] font-medium">Livrable : </strong>{deliverable}</p>
              </div>
            ))}
          </div>
          <div>{h2("Les erreurs classiques à éviter")}
            <ul className="space-y-2">{[
              '"Je vais ajouter juste cette fonctionnalité avant de lancer" : C\'est ainsi que le Day 30 devient Day 120. Lancez imparfait, améliorez avec les retours réels.',
              "Choisir le mauvais outil : Passer de Weweb à Bubble après 3 semaines, c'est repartir de zéro.",
              "Ne pas penser mobile : Construisez chaque écran en vue mobile dès le début, pas après.",
              "Ignorer les performances : Une base de données mal structurée sur Bubble peut rendre une app inutilisable à 100 utilisateurs simultanés.",
              "Lancer sans analytics : Sans données, vous naviguez à l'aveugle. Installez GA4 et Hotjar avant le lancement.",
            ].map(t => li(t))}</ul>
          </div>
          <div>{h2("Budget réaliste pour 30 jours")}
            <ul className="space-y-2">{[
              "Weweb + Supabase : ~60 à 100€/mois pour un projet professionnel",
              "Bubble : ~29 à 119€/mois selon les besoins en performance",
              "Make (automatisations) : ~9 à 29€/mois",
              "Nom de domaine : ~10 à 15€/an",
              "Brevo (emails transactionnels) : Gratuit jusqu'à 300 emails/jour",
            ].map(t => li(t))}</ul>
            <p>Total pour lancer : <strong className="text-[#111] font-medium">entre 100 et 250€/mois.</strong> À comparer aux 15 000 à 60 000€ qu'aurait coûté la même app en custom.</p>
            {bq("En 30 jours, vous pouvez avoir une app en production. La vraie question n'est pas 'est-ce possible ?' — c'est 'êtes-vous prêt à vous y mettre vraiment ?'")}
          </div>
        </div>
      </article>
      <section className="px-6 md:px-16 py-16 bg-gray-50">
        <div className="max-w-3xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 bg-[#0a0a0a] p-10 rounded-md">
          <div><div className="text-[10px] font-mono uppercase tracking-widest text-[#f97316] mb-2">Accélérez le process</div><h3 className="text-xl font-medium text-white tracking-tight">Votre app lancée en 30 jours</h3><p className="text-gray-400 text-[13px] mt-2">Conception, architecture No-Code, et lancement — je vous accompagne.</p></div>
          <a href="mailto:franck@fkr-france.fr" className="shrink-0 inline-flex items-center gap-2 bg-[#f97316] text-white px-7 py-3.5 rounded-md text-[13px] font-medium tracking-wide hover:bg-[#ea6b0a] transition-colors duration-300">Me contacter<ArrowUpRight size={15} strokeWidth={1.5} /></a>
        </div>
      </section>
      <div className="px-6 md:px-16 max-w-3xl mx-auto">
        <RelatedArticles ids={["nocode-vs-dev", "5-processus-automatiser"]} onNavigate={onNavigate} />
      </div>
            <SiteFooter />
    </div>
  );
}

// ─── BLOG PAGE ───────────────────────────────────────────────────────────────

function BlogPage({ onBack, onArticleClick }: { onBack: () => void; onArticleClick: (id: string) => void }) {
  useEffect(() => {
    window.scrollTo(0, 0);
    setPageMeta(
      "Blog — No-Code, IA et Automatisation — FRK-France",
      "Tous les articles de FRK-France sur le no-code, l'automatisation, l'IA et le design web. Conseils pratiques pour PME et entrepreneurs.",
      "/blog/"
    );
  }, []);

  return (
    <div className="bg-[#fcfcfc] min-h-screen font-sans text-[#111] overflow-x-hidden">

      {/* Title */}
      <section className="pt-[57px] px-6 md:px-16 py-20 md:py-28 border-b border-gray-200">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <div className="text-[10px] font-mono tracking-[0.2em] uppercase text-gray-400 mb-6">[ Blog ]</div>
          <h1 className="text-[3rem] sm:text-[4rem] md:text-[6rem] font-medium tracking-tight leading-[1]">
            Insights &<br />Ressources
          </h1>
          <p className="mt-6 text-[14px] text-gray-500 max-w-md leading-[1.8]">
            Articles, guides et retours d'expérience sur le design web, le no-code et l'IA.
          </p>
        </motion.div>
      </section>

      {/* Articles list */}
      <main className="px-6 md:px-16 py-16 md:py-24">
        <div className="max-w-4xl mx-auto">
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            onClick={() => onArticleClick("nocode-vs-dev")}
            className="group cursor-pointer border-b border-gray-200 pb-12 mb-12"
          >
            <div className="flex flex-col md:flex-row md:items-start gap-6 md:gap-12">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <span className="bg-[#f97316] text-white text-[9px] font-mono uppercase tracking-widest px-2.5 py-1 rounded-full">No-Code & IA</span>
                  <span className="text-[11px] font-mono uppercase tracking-widest text-gray-400">7 Avril 2026 · 8 min</span>
                </div>
                <h2 className="text-[1.4rem] md:text-[1.8rem] font-medium tracking-tight leading-[1.15] text-[#111] mb-4 group-hover:underline underline-offset-4 decoration-[1.5px] transition-all">
                  No-Code vs Développement classique : que choisir pour votre PME en 2026 ?
                </h2>
                <p className="text-[14px] text-gray-500 leading-[1.8] mb-6 max-w-2xl">
                  Deux approches, deux philosophies, deux budgets. Voici un comparatif honnête pour prendre la bonne décision selon votre contexte.
                </p>
                <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-wider text-[#111]">
                  <span>Lire l'article</span>
                  <ArrowRight size={13} strokeWidth={1.5} className="transition-transform duration-300 group-hover:translate-x-1" />
                </div>
              </div>
              <div className="md:w-[240px] shrink-0 aspect-[4/3] rounded-md overflow-hidden bg-[#0a0a0a] flex items-center justify-center">
                <div className="text-center px-6">
                  <div className="text-[#f97316] text-[10px] font-mono uppercase tracking-widest mb-2">No-Code</div>
                  <div className="text-white text-[13px] font-medium leading-snug">vs<br />Dev classique</div>
                </div>
              </div>
            </div>
          </motion.article>

          {[
            { id: "5-processus-automatiser", cat: "Automatisation", catColor: "bg-[#a855f7]", date: "7 Avril 2026 · 6 min", title: "5 processus que toute PME devrait automatiser cette année", summary: "Facturation, relances, onboarding, reporting, support… Les cinq automatisations qui libèrent en moyenne 10h par semaine.", thumb: { label: "Automatisation", sub: "Make · n8n · Airtable" } },
            { id: "ia-productivite-pme", cat: "IA & Productivité", catColor: "bg-[#a855f7]", date: "7 Avril 2026 · 7 min", title: "Comment l'IA peut doubler la productivité de votre équipe sans coder", summary: "ChatGPT, Claude, Copilot, Perplexity… Comment intégrer l'IA dans vos workflows dès cette semaine, sans ligne de code.", thumb: { label: "IA & Productivité", sub: "Claude · ChatGPT · Copilot" } },
            { id: "site-qui-fait-fuir", cat: "Web Design", catColor: "bg-[#ec4899]", date: "7 Avril 2026 · 6 min", title: "Pourquoi votre site web fait fuir vos clients (et comment y remédier)", summary: "Les 7 erreurs qui transforment votre site en repoussoir à clients — et les solutions concrètes pour chaque problème.", thumb: { label: "Web Design", sub: "UX · Performance · Mobile" } },
            { id: "app-sans-developpeur", cat: "No-Code & IA", catColor: "bg-[#f97316]", date: "7 Avril 2026 · 9 min", title: "De l'idée à la mise en ligne : créer une app web sans développeur en 30 jours", summary: "Weweb, Bubble, Supabase, Make… Le guide complet pour lancer votre première application web sans coder.", thumb: { label: "No-Code", sub: "Bubble · Weweb · Supabase" } },
          ].map(({ id, cat, catColor, date, title, summary, thumb }, idx) => (
            <motion.article
              key={id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 + idx * 0.08 }}
              onClick={() => onArticleClick(id)}
              className="group cursor-pointer border-b border-gray-200 pb-12 mb-12"
            >
              <div className="flex flex-col md:flex-row md:items-start gap-6 md:gap-12">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <span className={`${catColor} text-white text-[9px] font-mono uppercase tracking-widest px-2.5 py-1 rounded-full`}>{cat}</span>
                    <span className="text-[11px] font-mono uppercase tracking-widest text-gray-400">{date}</span>
                  </div>
                  <h2 className="text-[1.4rem] md:text-[1.8rem] font-medium tracking-tight leading-[1.15] text-[#111] mb-4 group-hover:underline underline-offset-4 decoration-[1.5px] transition-all">{title}</h2>
                  <p className="text-[14px] text-gray-500 leading-[1.8] mb-6 max-w-2xl">{summary}</p>
                  <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-wider text-[#111]">
                    <span>Lire l'article</span>
                    <ArrowRight size={13} strokeWidth={1.5} className="transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </div>
                <div className="md:w-[240px] shrink-0 aspect-[4/3] rounded-md overflow-hidden bg-[#0a0a0a] flex items-center justify-center">
                  <div className="text-center px-6">
                    <div className="text-[#f97316] text-[10px] font-mono uppercase tracking-widest mb-2">{thumb.label}</div>
                    <div className="text-white text-[13px] font-medium leading-snug">{thumb.sub}</div>
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

// ─── PAGE: DÉCOUVERTE & ANALYSE ──────────────────────────────────────────────

function PageDecouverteAnalyse({ onBack }: { onBack: () => void }) {
  useEffect(() => {
    window.scrollTo(0, 0);
    setPageMeta(
      "Découverte & Analyse — Notre processus — FRK-France",
      "FRK-France audite vos besoins digitaux, analyse l'existant et cadre votre projet pour un lancement efficace, ciblé et aligné sur vos objectifs.",
      "/processus/decouverte-analyse/"
    );
  }, []);

  return (
    <div className="bg-[#fcfcfc] min-h-screen font-sans text-[#111] overflow-x-hidden">

      {/* Hero */}
      <section className="pt-[57px] bg-[#0a0a0a] text-white px-6 md:px-16 py-20 md:py-32">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="flex items-center gap-4 mb-8">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-gray-500 border border-gray-700 px-3 py-1.5 rounded-full">Étape 01</span>
              <span className="w-8 h-[1px] bg-gray-700 block" />
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-gray-500">Notre Processus</span>
            </div>
            <h1 className="text-[2.5rem] sm:text-[4rem] md:text-[5.5rem] font-medium tracking-tight leading-[1] mb-8">
              Découverte<br />&amp; Analyse
            </h1>
            <p className="text-[16px] md:text-[18px] text-gray-400 leading-[1.8] max-w-2xl">
              Avant d'écrire la moindre ligne de code ou de poser le premier pixel, on prend le temps de comprendre — vraiment — votre contexte, vos contraintes et vos ambitions.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main content */}
      <div className="px-6 md:px-16 max-w-5xl mx-auto">

        {/* Intro */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.15 }}
          className="py-12 md:py-20 border-b border-gray-200">
          <div className="grid md:grid-cols-2 gap-8 md:gap-16">
            <p className="text-[15px] text-gray-600 leading-[1.9]">
              La phase de découverte est la fondation de tout projet réussi. C'est ici que l'on aligne la vision, qu'on identifie les risques et qu'on définit ce que "succès" signifie concrètement pour vous.
            </p>
            <p className="text-[15px] text-gray-600 leading-[1.9]">
              Un projet mal cadré au départ coûte en moyenne 3× plus cher à corriger en cours de route. Cette étape vous évite les mauvaises surprises et vous donne une feuille de route claire dès le premier jour.
            </p>
          </div>
        </motion.div>

        {/* Ce qu'on fait */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.22 }}
          className="py-10 md:py-16 border-b border-gray-200">
          <div className="text-[10px] font-mono tracking-[0.2em] uppercase text-gray-400 mb-10">Ce qu'on fait</div>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { num: "01", title: "Audit de l'existant", desc: "Analyse de votre site, outils, processus et présence digitale actuelle. On part de ce qui existe pour éviter de réinventer la roue." },
              { num: "02", title: "Entretien de cadrage", desc: "Session de travail pour comprendre vos objectifs, vos utilisateurs cibles, vos contraintes budget/délai et vos critères de succès." },
              { num: "03", title: "Analyse concurrentielle", desc: "Étude de vos concurrents directs et indirects : positionnement, forces, faiblesses et opportunités de différenciation." },
              { num: "04", title: "Définition des objectifs", desc: "Traduction de vos ambitions en objectifs mesurables (KPIs, métriques, jalons) pour piloter le projet avec des données concrètes." },
            ].map(({ num, title, desc }) => (
              <div key={num} className="flex flex-col gap-3 p-6 border border-gray-100 rounded-md hover:border-gray-300 transition-colors duration-300">
                <span className="text-[10px] font-mono text-gray-400">{num}</span>
                <h3 className="text-[15px] font-medium tracking-tight text-[#111]">{title}</h3>
                <p className="text-[13px] text-gray-500 leading-[1.7]">{desc}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Livrables */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.28 }}
          className="py-10 md:py-16 border-b border-gray-200">
          <div className="text-[10px] font-mono tracking-[0.2em] uppercase text-gray-400 mb-8">Livrables</div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: "Brief projet", desc: "Document de référence synthétisant le contexte, les objectifs, les contraintes et le périmètre du projet." },
              { title: "Audit digital", desc: "Rapport d'analyse de l'existant avec recommandations prioritaires." },
              { title: "Feuille de route", desc: "Planning macro avec jalons, livrables et points de validation pour toute la durée du projet." },
            ].map(({ title, desc }) => (
              <div key={title} className="flex flex-col gap-3">
                <div className="w-8 h-[2px] bg-[#111]" />
                <h4 className="text-[14px] font-medium tracking-tight text-[#111]">{title}</h4>
                <p className="text-[13px] text-gray-500 leading-[1.7]">{desc}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Durée & outils */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.34 }}
          className="py-10 md:py-16 border-b border-gray-200">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
            {[
              { stat: "1 – 3 j", desc: "Durée moyenne de la phase" },
              { stat: "3",       desc: "Livrables documentés" },
              { stat: "100 %",   desc: "Alignement avant démarrage" },
            ].map(({ stat, desc }) => (
              <div key={stat}>
                <div className="text-[3rem] md:text-[4rem] font-medium tracking-tight leading-none mb-3">{stat}</div>
                <div className="text-[11px] font-mono uppercase tracking-widest text-gray-500">{desc}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Next step CTA */}
      <motion.section initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.4 }}
        className="mt-16 md:mt-24 bg-[#0a0a0a] text-white px-6 md:px-16 py-20 md:py-32 flex flex-col items-center text-center">
        <div className="text-[10px] font-mono tracking-[0.2em] uppercase text-gray-500 mb-6">Étape suivante</div>
        <h2 className="text-[2rem] md:text-[3.5rem] font-medium tracking-tight mb-4 max-w-xl">
          Architecture &amp; Design
        </h2>
        <p className="text-gray-500 text-[14px] mb-10 max-w-sm">Une fois le cadrage validé, on conçoit la structure et l'interface de votre solution.</p>
        <a href="mailto:franck@fkr-france.fr"
          className="group inline-flex items-center gap-3 bg-white text-[#111] px-8 py-4 rounded-md text-[13px] font-medium tracking-wide hover:shadow-[4px_4px_0px_rgba(255,255,255,0.3)] transition-all duration-300">
          Démarrer un projet
          <ArrowUpRight size={16} strokeWidth={1.5} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </a>
      </motion.section>
      <SiteFooter />
    </div>
  );
}

// ─── PAGE: ARCHITECTURE & DESIGN ─────────────────────────────────────────────

function PageArchitectureDesign({ onBack }: { onBack: () => void }) {
  useEffect(() => {
    window.scrollTo(0, 0);
    setPageMeta(
      "Architecture & Design — Notre processus — FRK-France",
      "FRK-France conçoit la structure digitale et le design de votre projet, du wireframing au choix des outils no-code ou dev les mieux adaptés.",
      "/processus/architecture-design/"
    );
  }, []);
  return (
    <div className="bg-[#fcfcfc] min-h-screen font-sans text-[#111] overflow-x-hidden">
      <section className="pt-[57px] bg-[#0a0a0a] text-white px-6 md:px-16 py-20 md:py-32">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="flex items-center gap-4 mb-8">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-gray-500 border border-gray-700 px-3 py-1.5 rounded-full">Étape 02</span>
              <span className="w-8 h-[1px] bg-gray-700 block" />
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-gray-500">Notre Processus</span>
            </div>
            <h1 className="text-[2.5rem] sm:text-[4rem] md:text-[5.5rem] font-medium tracking-tight leading-[1] mb-8">Architecture<br />&amp; Design</h1>
            <p className="text-[16px] md:text-[18px] text-gray-400 leading-[1.8] max-w-2xl">La structure avant le style. On conçoit l'architecture de votre solution et l'expérience utilisateur avant d'écrire la première ligne de code.</p>
          </motion.div>
        </div>
      </section>
      <div className="px-6 md:px-16 max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.15 }} className="py-12 md:py-20 border-b border-gray-200">
          <div className="grid md:grid-cols-2 gap-8 md:gap-16">
            <p className="text-[15px] text-gray-600 leading-[1.9]">Une bonne architecture digitale, c'est comme un bon plan d'architecte : elle anticipe les usages, évite les impasses techniques et garantit une expérience fluide pour vos utilisateurs.</p>
            <p className="text-[15px] text-gray-600 leading-[1.9]">Cette phase traduit le brief issu de la découverte en maquettes concrètes, validées avec vous avant toute production. Zéro surprise à la livraison.</p>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.22 }} className="py-10 md:py-16 border-b border-gray-200">
          <div className="text-[10px] font-mono tracking-[0.2em] uppercase text-gray-400 mb-10">Ce qu'on fait</div>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { num: "01", title: "Wireframing", desc: "Schémas basse-fidélité pour valider la structure des pages, les parcours utilisateurs et la hiérarchie de l'information." },
              { num: "02", title: "Design UI haute-fidélité", desc: "Maquettes finales avec typographie, couleurs, composants et micro-interactions. Livraison sur Figma." },
              { num: "03", title: "Choix des outils", desc: "Sélection des technologies et plateformes adaptées à votre budget, vos délais et vos besoins de maintenabilité." },
              { num: "04", title: "Design System", desc: "Bibliothèque de composants réutilisables pour garantir la cohérence visuelle sur l'ensemble du projet." },
            ].map(({ num, title, desc }) => (
              <div key={num} className="flex flex-col gap-3 p-6 border border-gray-100 rounded-md hover:border-gray-300 transition-colors duration-300">
                <span className="text-[10px] font-mono text-gray-400">{num}</span>
                <h3 className="text-[15px] font-medium tracking-tight text-[#111]">{title}</h3>
                <p className="text-[13px] text-gray-500 leading-[1.7]">{desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.28 }} className="py-10 md:py-16 border-b border-gray-200">
          <div className="text-[10px] font-mono tracking-[0.2em] uppercase text-gray-400 mb-8">Livrables</div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: "Wireframes", desc: "Schémas annotés de toutes les pages clés du projet." },
              { title: "Maquettes Figma", desc: "Design haute-fidélité validé et prêt pour la production." },
              { title: "Design System", desc: "Bibliothèque de composants réutilisables documentée." },
            ].map(({ title, desc }) => (
              <div key={title} className="flex flex-col gap-3"><div className="w-8 h-[2px] bg-[#111]" /><h4 className="text-[14px] font-medium tracking-tight text-[#111]">{title}</h4><p className="text-[13px] text-gray-500 leading-[1.7]">{desc}</p></div>
            ))}
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.34 }} className="py-10 md:py-16 border-b border-gray-200">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
            {[{ stat: "1 – 2 sem.", desc: "Durée moyenne" }, { stat: "3", desc: "Livrables Figma" }, { stat: "100 %", desc: "Validé avant production" }].map(({ stat, desc }) => (
              <div key={stat}><div className="text-[3rem] md:text-[4rem] font-medium tracking-tight leading-none mb-3">{stat}</div><div className="text-[11px] font-mono uppercase tracking-widest text-gray-500">{desc}</div></div>
            ))}
          </div>
        </motion.div>
      </div>
      <motion.section initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.4 }}
        className="mt-16 md:mt-24 bg-[#0a0a0a] text-white px-6 md:px-16 py-20 md:py-32 flex flex-col items-center text-center">
        <div className="text-[10px] font-mono tracking-[0.2em] uppercase text-gray-500 mb-6">Étape suivante</div>
        <h2 className="text-[2rem] md:text-[3.5rem] font-medium tracking-tight mb-4 max-w-xl">Production &amp; Build</h2>
        <p className="text-gray-500 text-[14px] mb-10 max-w-sm">Les maquettes validées, on passe à la production et au développement de votre solution.</p>
        <a href="mailto:franck@fkr-france.fr" className="group inline-flex items-center gap-3 bg-white text-[#111] px-8 py-4 rounded-md text-[13px] font-medium tracking-wide hover:shadow-[4px_4px_0px_rgba(255,255,255,0.3)] transition-all duration-300">
          Démarrer un projet<ArrowUpRight size={16} strokeWidth={1.5} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </a>
      </motion.section>
      <SiteFooter />
    </div>
  );
}

// ─── PAGE: PRODUCTION & BUILD ─────────────────────────────────────────────────

function PageProductionBuild({ onBack }: { onBack: () => void }) {
  useEffect(() => {
    window.scrollTo(0, 0);
    setPageMeta(
      "Production & Build — Notre processus — FRK-France",
      "FRK-France développe et intègre votre solution digitale avec des itérations rapides, automatisation incluse et livraison orientée résultats.",
      "/processus/production-build/"
    );
  }, []);
  return (
    <div className="bg-[#fcfcfc] min-h-screen font-sans text-[#111] overflow-x-hidden">
      <section className="pt-[57px] bg-[#0a0a0a] text-white px-6 md:px-16 py-20 md:py-32">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="flex items-center gap-4 mb-8">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-gray-500 border border-gray-700 px-3 py-1.5 rounded-full">Étape 03</span>
              <span className="w-8 h-[1px] bg-gray-700 block" />
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-gray-500">Notre Processus</span>
            </div>
            <h1 className="text-[2.5rem] sm:text-[4rem] md:text-[5.5rem] font-medium tracking-tight leading-[1] mb-8">Production<br />&amp; Build</h1>
            <p className="text-[16px] md:text-[18px] text-gray-400 leading-[1.8] max-w-2xl">On construit. Vite, bien, avec itérations continues. Développement, intégration des contenus et automatisation des processus métier.</p>
          </motion.div>
        </div>
      </section>
      <div className="px-6 md:px-16 max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.15 }} className="py-12 md:py-20 border-b border-gray-200">
          <div className="grid md:grid-cols-2 gap-8 md:gap-16">
            <p className="text-[15px] text-gray-600 leading-[1.9]">C'est la phase de construction concrète. On développe votre solution en s'appuyant sur les maquettes validées, avec des livraisons intermédiaires pour garder le contrôle à chaque étape.</p>
            <p className="text-[15px] text-gray-600 leading-[1.9]">On travaille en sprints courts pour livrer des résultats visibles rapidement, intégrer vos retours au fil de l'eau et éviter les longs tunnels de développement sans feedback.</p>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.22 }} className="py-10 md:py-16 border-b border-gray-200">
          <div className="text-[10px] font-mono tracking-[0.2em] uppercase text-gray-400 mb-10">Ce qu'on fait</div>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { num: "01", title: "Développement & Intégration", desc: "Code ou No-Code selon le contexte : HTML/CSS/JS, React, Webflow, Bubble. Intégration des contenus, médias et données." },
              { num: "02", title: "Automatisation", desc: "Mise en place des workflows automatisés (Make, n8n, Zapier) pour connecter vos outils et automatiser les tâches répétitives." },
              { num: "03", title: "Livraisons itératives", desc: "Démos régulières sur environnement de staging pour valider chaque fonctionnalité avant la mise en production." },
              { num: "04", title: "Optimisation performance", desc: "Optimisation des temps de chargement, du SEO technique et de l'accessibilité tout au long du développement." },
            ].map(({ num, title, desc }) => (
              <div key={num} className="flex flex-col gap-3 p-6 border border-gray-100 rounded-md hover:border-gray-300 transition-colors duration-300">
                <span className="text-[10px] font-mono text-gray-400">{num}</span>
                <h3 className="text-[15px] font-medium tracking-tight text-[#111]">{title}</h3>
                <p className="text-[13px] text-gray-500 leading-[1.7]">{desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.28 }} className="py-10 md:py-16 border-b border-gray-200">
          <div className="text-[10px] font-mono tracking-[0.2em] uppercase text-gray-400 mb-8">Livrables</div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: "Solution déployée", desc: "Environnement de staging fonctionnel, accessible pour validation client." },
              { title: "Automatisations", desc: "Workflows configurés, testés et documentés." },
              { title: "Code source", desc: "Accès complet au code ou au projet No-Code livré." },
            ].map(({ title, desc }) => (
              <div key={title} className="flex flex-col gap-3"><div className="w-8 h-[2px] bg-[#111]" /><h4 className="text-[14px] font-medium tracking-tight text-[#111]">{title}</h4><p className="text-[13px] text-gray-500 leading-[1.7]">{desc}</p></div>
            ))}
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.34 }} className="py-10 md:py-16 border-b border-gray-200">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
            {[{ stat: "2 – 6 sem.", desc: "Durée moyenne" }, { stat: "Agile", desc: "Méthode de travail" }, { stat: "∞", desc: "Itérations possibles" }].map(({ stat, desc }) => (
              <div key={stat}><div className="text-[3rem] md:text-[4rem] font-medium tracking-tight leading-none mb-3">{stat}</div><div className="text-[11px] font-mono uppercase tracking-widest text-gray-500">{desc}</div></div>
            ))}
          </div>
        </motion.div>
      </div>
      <motion.section initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.4 }}
        className="mt-16 md:mt-24 bg-[#0a0a0a] text-white px-6 md:px-16 py-20 md:py-32 flex flex-col items-center text-center">
        <div className="text-[10px] font-mono tracking-[0.2em] uppercase text-gray-500 mb-6">Étape suivante</div>
        <h2 className="text-[2rem] md:text-[3.5rem] font-medium tracking-tight mb-4 max-w-xl">Test &amp; Validation</h2>
        <p className="text-gray-500 text-[14px] mb-10 max-w-sm">Avant de lancer, on teste chaque fonctionnalité pour garantir une mise en production sans accroc.</p>
        <a href="mailto:franck@fkr-france.fr" className="group inline-flex items-center gap-3 bg-white text-[#111] px-8 py-4 rounded-md text-[13px] font-medium tracking-wide hover:shadow-[4px_4px_0px_rgba(255,255,255,0.3)] transition-all duration-300">
          Démarrer un projet<ArrowUpRight size={16} strokeWidth={1.5} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </a>
      </motion.section>
      <SiteFooter />
    </div>
  );
}

// ─── PAGE: TEST & VALIDATION ──────────────────────────────────────────────────

function PageTestValidation({ onBack }: { onBack: () => void }) {
  useEffect(() => {
    window.scrollTo(0, 0);
    setPageMeta(
      "Test & Validation — Notre processus — FRK-France",
      "FRK-France assure la recette fonctionnelle, les tests UX et les corrections nécessaires avant chaque mise en production de votre projet digital.",
      "/processus/test-validation/"
    );
  }, []);
  return (
    <div className="bg-[#fcfcfc] min-h-screen font-sans text-[#111] overflow-x-hidden">
      <section className="pt-[57px] bg-[#0a0a0a] text-white px-6 md:px-16 py-20 md:py-32">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="flex items-center gap-4 mb-8">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-gray-500 border border-gray-700 px-3 py-1.5 rounded-full">Étape 04</span>
              <span className="w-8 h-[1px] bg-gray-700 block" />
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-gray-500">Notre Processus</span>
            </div>
            <h1 className="text-[2.5rem] sm:text-[4rem] md:text-[5.5rem] font-medium tracking-tight leading-[1] mb-8">Test<br />&amp; Validation</h1>
            <p className="text-[16px] md:text-[18px] text-gray-400 leading-[1.8] max-w-2xl">On ne livre pas au hasard. Chaque fonctionnalité est testée, chaque parcours utilisateur est vérifié, chaque bug est corrigé avant la mise en production.</p>
          </motion.div>
        </div>
      </section>
      <div className="px-6 md:px-16 max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.15 }} className="py-12 md:py-20 border-b border-gray-200">
          <div className="grid md:grid-cols-2 gap-8 md:gap-16">
            <p className="text-[15px] text-gray-600 leading-[1.9]">La phase de test est trop souvent négligée dans les projets digitaux. C'est pourtant elle qui garantit une livraison sans mauvaises surprises et une expérience utilisateur irréprochable dès le premier jour.</p>
            <p className="text-[15px] text-gray-600 leading-[1.9]">On teste sur les vrais navigateurs, les vrais appareils et les vrais cas d'usage — pas dans un environnement idéalisé. Votre validation formelle est requise avant toute mise en production.</p>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.22 }} className="py-10 md:py-16 border-b border-gray-200">
          <div className="text-[10px] font-mono tracking-[0.2em] uppercase text-gray-400 mb-10">Ce qu'on fait</div>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { num: "01", title: "Tests fonctionnels", desc: "Vérification de chaque fonctionnalité, formulaire, lien et automatisation sur les principaux navigateurs et appareils." },
              { num: "02", title: "Tests UX & accessibilité", desc: "Parcours utilisateurs clés testés end-to-end. Vérification des contrastes, de la navigation clavier et des standards WCAG." },
              { num: "03", title: "Tests de performance", desc: "Analyse Lighthouse, Core Web Vitals et temps de chargement. Optimisations si nécessaire avant livraison." },
              { num: "04", title: "Recette client", desc: "Session de validation avec vous sur environnement de staging. On corrige tous les points relevés avant la mise en ligne." },
            ].map(({ num, title, desc }) => (
              <div key={num} className="flex flex-col gap-3 p-6 border border-gray-100 rounded-md hover:border-gray-300 transition-colors duration-300">
                <span className="text-[10px] font-mono text-gray-400">{num}</span>
                <h3 className="text-[15px] font-medium tracking-tight text-[#111]">{title}</h3>
                <p className="text-[13px] text-gray-500 leading-[1.7]">{desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.28 }} className="py-10 md:py-16 border-b border-gray-200">
          <div className="text-[10px] font-mono tracking-[0.2em] uppercase text-gray-400 mb-8">Livrables</div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: "Rapport de tests", desc: "Liste des scénarios testés, résultats et corrections apportées." },
              { title: "Validation client", desc: "Bon à livrer signé après recette sur staging." },
              { title: "Score performance", desc: "Rapport Lighthouse final avec métriques Core Web Vitals." },
            ].map(({ title, desc }) => (
              <div key={title} className="flex flex-col gap-3"><div className="w-8 h-[2px] bg-[#111]" /><h4 className="text-[14px] font-medium tracking-tight text-[#111]">{title}</h4><p className="text-[13px] text-gray-500 leading-[1.7]">{desc}</p></div>
            ))}
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.34 }} className="py-10 md:py-16 border-b border-gray-200">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
            {[{ stat: "3 – 5 j", desc: "Durée moyenne" }, { stat: "0", desc: "Bug en production" }, { stat: "100 %", desc: "Validé avant go-live" }].map(({ stat, desc }) => (
              <div key={stat}><div className="text-[3rem] md:text-[4rem] font-medium tracking-tight leading-none mb-3">{stat}</div><div className="text-[11px] font-mono uppercase tracking-widest text-gray-500">{desc}</div></div>
            ))}
          </div>
        </motion.div>
      </div>
      <motion.section initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.4 }}
        className="mt-16 md:mt-24 bg-[#0a0a0a] text-white px-6 md:px-16 py-20 md:py-32 flex flex-col items-center text-center">
        <div className="text-[10px] font-mono tracking-[0.2em] uppercase text-gray-500 mb-6">Étape suivante</div>
        <h2 className="text-[2rem] md:text-[3.5rem] font-medium tracking-tight mb-4 max-w-xl">Lancement &amp; Suivi</h2>
        <p className="text-gray-500 text-[14px] mb-10 max-w-sm">Tests validés — on met en ligne et on assure le suivi post-lancement.</p>
        <a href="mailto:franck@fkr-france.fr" className="group inline-flex items-center gap-3 bg-white text-[#111] px-8 py-4 rounded-md text-[13px] font-medium tracking-wide hover:shadow-[4px_4px_0px_rgba(255,255,255,0.3)] transition-all duration-300">
          Démarrer un projet<ArrowUpRight size={16} strokeWidth={1.5} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </a>
      </motion.section>
      <SiteFooter />
    </div>
  );
}

// ─── PAGE: LANCEMENT & SUIVI ──────────────────────────────────────────────────

function PageLancementSuivi({ onBack }: { onBack: () => void }) {
  useEffect(() => {
    window.scrollTo(0, 0);
    setPageMeta(
      "Lancement & Suivi — Notre processus — FRK-France",
      "FRK-France accompagne la mise en production et assure le suivi post-lancement pour garantir la performance et l'évolution de votre projet digital.",
      "/processus/lancement-suivi/"
    );
  }, []);
  return (
    <div className="bg-[#fcfcfc] min-h-screen font-sans text-[#111] overflow-x-hidden">
      <section className="pt-[57px] bg-[#0a0a0a] text-white px-6 md:px-16 py-20 md:py-32">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="flex items-center gap-4 mb-8">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-gray-500 border border-gray-700 px-3 py-1.5 rounded-full">Étape 05</span>
              <span className="w-8 h-[1px] bg-gray-700 block" />
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-gray-500">Notre Processus</span>
            </div>
            <h1 className="text-[2.5rem] sm:text-[4rem] md:text-[5.5rem] font-medium tracking-tight leading-[1] mb-8">Lancement<br />&amp; Suivi</h1>
            <p className="text-[16px] md:text-[18px] text-gray-400 leading-[1.8] max-w-2xl">La mise en ligne n'est pas une fin, c'est un départ. On déploie, on monitore et on accompagne votre croissance digitale dans la durée.</p>
          </motion.div>
        </div>
      </section>
      <div className="px-6 md:px-16 max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.15 }} className="py-12 md:py-20 border-b border-gray-200">
          <div className="grid md:grid-cols-2 gap-8 md:gap-16">
            <p className="text-[15px] text-gray-600 leading-[1.9]">Le lancement est une opération chirurgicale. On s'assure que chaque composante est prête — DNS, redirections, SEO, analytics — avant d'appuyer sur le bouton.</p>
            <p className="text-[15px] text-gray-600 leading-[1.9]">Après la mise en ligne, on reste disponible pour surveiller les performances, répondre aux imprévus et piloter les premières optimisations en conditions réelles.</p>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.22 }} className="py-10 md:py-16 border-b border-gray-200">
          <div className="text-[10px] font-mono tracking-[0.2em] uppercase text-gray-400 mb-10">Ce qu'on fait</div>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { num: "01", title: "Mise en production", desc: "Déploiement sur l'hébergement final, configuration des domaines, DNS, SSL et redirections 301." },
              { num: "02", title: "Configuration analytics", desc: "Mise en place de GA4, Search Console, heatmaps et alertes de performance pour piloter avec des données dès J+1." },
              { num: "03", title: "Monitoring post-lancement", desc: "Surveillance des métriques clés pendant les 2 premières semaines. Intervention rapide si anomalie détectée." },
              { num: "04", title: "Accompagnement & évolutions", desc: "Formation à l'autonomie, documentation et support pour les évolutions futures de votre solution digitale." },
            ].map(({ num, title, desc }) => (
              <div key={num} className="flex flex-col gap-3 p-6 border border-gray-100 rounded-md hover:border-gray-300 transition-colors duration-300">
                <span className="text-[10px] font-mono text-gray-400">{num}</span>
                <h3 className="text-[15px] font-medium tracking-tight text-[#111]">{title}</h3>
                <p className="text-[13px] text-gray-500 leading-[1.7]">{desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.28 }} className="py-10 md:py-16 border-b border-gray-200">
          <div className="text-[10px] font-mono tracking-[0.2em] uppercase text-gray-400 mb-8">Livrables</div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: "Site en production", desc: "Solution live, accessible et indexable sur les moteurs de recherche." },
              { title: "Dashboard analytics", desc: "Tableau de bord configuré avec les KPIs définis en phase de découverte." },
              { title: "Documentation", desc: "Guide d'utilisation et de maintenance remis à votre équipe." },
            ].map(({ title, desc }) => (
              <div key={title} className="flex flex-col gap-3"><div className="w-8 h-[2px] bg-[#111]" /><h4 className="text-[14px] font-medium tracking-tight text-[#111]">{title}</h4><p className="text-[13px] text-gray-500 leading-[1.7]">{desc}</p></div>
            ))}
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.34 }} className="py-10 md:py-16 border-b border-gray-200">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
            {[{ stat: "J+0", desc: "Mise en ligne" }, { stat: "2 sem.", desc: "Monitoring actif" }, { stat: "∞", desc: "Accompagnement possible" }].map(({ stat, desc }) => (
              <div key={stat}><div className="text-[3rem] md:text-[4rem] font-medium tracking-tight leading-none mb-3">{stat}</div><div className="text-[11px] font-mono uppercase tracking-widest text-gray-500">{desc}</div></div>
            ))}
          </div>
        </motion.div>
      </div>
      <motion.section initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.4 }}
        className="mt-16 md:mt-24 bg-[#0a0a0a] text-white px-6 md:px-16 py-20 md:py-32 flex flex-col items-center text-center">
        <div className="text-[10px] font-mono tracking-[0.2em] uppercase text-gray-500 mb-6">Prêt à démarrer ?</div>
        <h2 className="text-[2rem] md:text-[3.5rem] font-medium tracking-tight mb-4 max-w-xl">Parlons de votre projet</h2>
        <p className="text-gray-500 text-[14px] mb-10 max-w-sm">Découverte, design, build, tests, lancement — on gère tout de A à Z.</p>
        <a href="mailto:franck@fkr-france.fr" className="group inline-flex items-center gap-3 bg-white text-[#111] px-8 py-4 rounded-md text-[13px] font-medium tracking-wide hover:shadow-[4px_4px_0px_rgba(255,255,255,0.3)] transition-all duration-300">
          Me contacter<ArrowUpRight size={16} strokeWidth={1.5} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </a>
      </motion.section>
      <SiteFooter />
    </div>
  );
}

// ─── SLIDING NAV ─────────────────────────────────────────────────────────────

function NavCursor({ position }: { position: { left: number; width: number; opacity: number } }) {
  return (
    <motion.li
      animate={position}
      transition={{ type: "spring", stiffness: 400, damping: 35 }}
      className="absolute z-0 h-7 rounded-full bg-black md:h-9"
    />
  );
}

function NavTab({
  children,
  setPosition,
  onClick,
}: {
  children: React.ReactNode;
  setPosition: React.Dispatch<React.SetStateAction<{ left: number; width: number; opacity: number }>>;
  onClick: () => void;
}) {
  const ref = useRef<HTMLLIElement>(null);
  return (
    <li
      ref={ref}
      onMouseEnter={() => {
        if (!ref.current) return;
        const { width } = ref.current.getBoundingClientRect();
        setPosition({ width, opacity: 1, left: ref.current.offsetLeft });
      }}
      onClick={onClick}
      className="relative z-10 block cursor-pointer px-3 py-1.5 text-[9px] uppercase tracking-widest text-white mix-blend-difference md:px-5 md:py-2 md:text-[10px] font-mono select-none whitespace-nowrap"
    >
      {children}
    </li>
  );
}

const faqItems = [
  {
    q: "Combien coûte un projet ?",
    a: "Chaque projet est unique. Un site vitrine no-code démarre à partir de 800 €, une application sur mesure à partir de 2 500 €. Je fournis un devis détaillé après une session de découverte gratuite de 30 minutes.",
    link: "blog-app-sans-developpeur",
    linkLabel: "Créer une app en 30 jours →",
  },
  {
    q: "Quel est le délai de livraison ?",
    a: "Un site vitrine est livré en 1 à 3 semaines. Une application avec automatisations prend généralement 3 à 6 semaines selon le périmètre défini en phase de cadrage.",
    link: null,
    linkLabel: null,
  },
  {
    q: "No-Code ou développement classique ?",
    a: "Le No-Code (Webflow, Bubble…) livre plus vite à moindre coût, avec un contenu modifiable par vous-même. Le développement sur mesure est préféré pour des logiques métier très spécifiques ou des performances maximales. Je vous conseille l'approche adaptée à votre contexte.",
    link: "blog-nocode-vs-dev",
    linkLabel: "Lire le comparatif complet →",
  },
  {
    q: "Puis-je modifier mon site après la livraison ?",
    a: "Oui. Les projets No-Code sont conçus pour que vous puissiez mettre à jour contenus et images sans toucher au code. Pour les projets développés, je fournis une documentation et une formation à la prise en main.",
    link: "blog-site-qui-fait-fuir",
    linkLabel: "7 erreurs qui font fuir vos visiteurs →",
  },
  {
    q: "L'IA peut-elle vraiment automatiser mes processus ?",
    a: "Oui — traitement d'emails, qualification de leads, génération de rapports, relances clients… Lors de notre session de découverte, j'identifie les 3 automatisations les plus impactantes à prioriser pour votre activité.",
    link: "blog-5-processus-automatiser",
    linkLabel: "5 processus à automatiser dès maintenant →",
  },
  {
    q: "Proposez-vous un suivi après le lancement ?",
    a: "Oui, une période de suivi post-lancement de 2 semaines est incluse dans chaque projet. Des forfaits de maintenance mensuelle sont disponibles pour assurer mises à jour et optimisations continues.",
    link: null,
    linkLabel: null,
  },
];

function FaqSection({ onNavigate }: { onNavigate?: (page: string) => void }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="w-full bg-[#f5f5f3] py-20 md:py-28 px-6 md:px-16">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-gray-400">[ FAQ ]</span>
        </div>
        <h2 className="text-[2rem] md:text-[3rem] font-medium tracking-tight text-[#111] mb-12 leading-tight">
          Questions fréquentes
        </h2>

        {/* Accordion */}
        <div className="flex flex-col divide-y divide-gray-200 border-t border-gray-200">
          {faqItems.map((item, i) => (
            <div key={i} className="py-5">
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-start justify-between gap-6 text-left group"
              >
                <span className="text-[15px] md:text-[17px] font-medium text-[#111] leading-snug group-hover:text-gray-600 transition-colors duration-200">
                  {item.q}
                </span>
                <span className="shrink-0 mt-0.5 w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center transition-all duration-300 group-hover:border-gray-500">
                  <motion.span
                    animate={{ rotate: openIndex === i ? 45 : 0 }}
                    transition={{ duration: 0.22, ease: "easeInOut" }}
                    className="block"
                  >
                    <Plus size={13} strokeWidth={1.5} className="text-gray-500" />
                  </motion.span>
                </span>
              </button>
              <AnimatePresence initial={false}>
                {openIndex === i && (
                  <motion.div
                    key="answer"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.28, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <p className="pt-4 pr-10 text-[14px] text-gray-500 leading-relaxed">
                      {item.a}
                    </p>
                    {item.link && item.linkLabel && onNavigate && (
                      <button
                        onClick={() => onNavigate(item.link!)}
                        className="mt-3 text-[11px] font-mono tracking-[0.12em] text-[#f97316] hover:text-[#ea6b0a] transition-colors duration-200"
                      >
                        {item.linkLabel}
                      </button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-[13px] text-gray-400 mb-4">Vous avez une question spécifique ?</p>
          <a
            href="mailto:franck@fkr-france.fr"
            className="inline-flex items-center gap-2 text-[12px] font-mono tracking-[0.15em] uppercase text-[#111] hover:text-gray-500 transition-colors duration-200"
          >
            Écrire un message <ArrowUpRight size={14} strokeWidth={1.5} />
          </a>
        </div>
      </div>
    </section>
  );
}

// ─── PAGE : À PROPOS ─────────────────────────────────────────────────────────

function PageAPropos({ onBack }: { onBack: () => void }) {
  useEffect(() => {
    window.scrollTo(0, 0);
    setPageMeta(
      "À propos de FRK-France — Agence No-Code Paris",
      "Découvrez FRK-France : notre histoire, nos valeurs et l'équipe derrière vos projets digitaux. Agence No-Code & IA fondée à Paris en 2024.",
      "/a-propos/"
    );
  }, []);

  const values = [
    {
      icon: "→",
      title: "Impact avant tout",
      desc: "Chaque décision de design ou de technologie est évaluée à l'aune d'un seul critère : est-ce que ça fait croître votre activité ?",
    },
    {
      icon: "◎",
      title: "Transparence totale",
      desc: "Devis détaillé, planning visible, code ou plateforme livrés. Pas de boîte noire. Vous savez toujours où en est votre projet.",
    },
    {
      icon: "⚡",
      title: "Vitesse de livraison",
      desc: "Le No-Code n'est pas un compromis — c'est un avantage. Un site vitrine en 2 semaines, une app en 6. Vous testez vite, vous itérez vite.",
    },
    {
      icon: "⊕",
      title: "Autonomie client",
      desc: "Vos outils vous appartiennent. Formation, documentation, accès complet. Vous devez pouvoir gérer votre site sans dépendre de nous.",
    },
  ];

  const timeline = [
    {
      year: "2019",
      label: "Premiers pas",
      desc: "Formation autodidacte au design web et développement front-end. Premiers projets pour des associations et TPE parisiennes.",
    },
    {
      year: "2021",
      label: "Découverte du No-Code",
      desc: "Webflow, Bubble, Make : une révélation. La promesse de livrer vite, à moindre coût, sans sacrifier la qualité. Le tournant.",
    },
    {
      year: "2023",
      label: "Automatisation & IA",
      desc: "Intégration de l'IA générative dans les workflows clients. Automatisation de processus métier qui libèrent des dizaines d'heures par mois.",
    },
    {
      year: "2024",
      label: "Création de FRK-France",
      desc: "Fondation de l'agence à Paris. Une structure légère, réactive, orientée résultats — pour PME et entrepreneurs qui veulent aller vite.",
    },
  ];

  const stats = [
    { value: "15+", label: "projets livrés" },
    { value: "< 3 sem.", label: "délai moyen site vitrine" },
    { value: "800 €", label: "budget de départ" },
    { value: "100 %", label: "clients autonomes à la livraison" },
  ];

  return (
    <div className="bg-[#fcfcfc] min-h-screen font-sans text-[#111] overflow-x-hidden">
      {/* Hero */}
      <section className="pt-[57px] bg-[#0a0a0a] text-white px-6 md:px-16 py-20 md:py-36">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className="text-[10px] font-mono tracking-[0.25em] uppercase text-gray-500 mb-8">FRK-France · Paris · Fondée en 2024</div>
            <h1 className="text-[2.4rem] sm:text-[3.2rem] md:text-[4.5rem] font-medium tracking-tight leading-[1.04] mb-8">
              On construit des outils<br className="hidden md:block" /> qui font vraiment<br className="hidden md:block" />{" "}
              <span className="text-[#f97316]">croître votre activité.</span>
            </h1>
            <p className="text-[16px] md:text-[18px] text-gray-400 leading-[1.8] max-w-2xl">
              FRK-France est une agence digitale indépendante spécialisée en No-Code, design web et automatisation IA. Pas de structure lourde, pas d'intermédiaires inutiles — juste l'essentiel, livré vite et bien.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Chiffres clés */}
      <section className="px-6 md:px-16 py-16 border-b border-gray-100">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map(({ value, label }) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex flex-col gap-1"
            >
              <span className="text-[2rem] md:text-[2.6rem] font-medium tracking-tight text-[#111]">{value}</span>
              <span className="text-[11px] font-mono uppercase tracking-widest text-gray-400">{label}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Histoire */}
      <section className="px-6 md:px-16 py-20 md:py-28">
        <div className="max-w-4xl mx-auto">
          <div className="text-[10px] font-mono tracking-[0.25em] uppercase text-[#f97316] mb-6">Notre histoire</div>
          <h2 className="text-[1.8rem] md:text-[2.6rem] font-medium tracking-tight mb-16 max-w-2xl">
            De freelance à agence — une trajectoire construite sur le terrain.
          </h2>
          <div className="relative">
            {/* Ligne verticale */}
            <div className="absolute left-[3.5rem] top-0 bottom-0 w-px bg-gray-100 hidden md:block" />
            <div className="flex flex-col gap-12">
              {timeline.map(({ year, label, desc }, i) => (
                <motion.div
                  key={year}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="flex gap-8 md:gap-16"
                >
                  <div className="shrink-0 w-14 text-right">
                    <span className="text-[11px] font-mono text-[#f97316] tracking-widest">{year}</span>
                  </div>
                  <div className="flex flex-col gap-1 pb-2">
                    <span className="text-[15px] font-medium text-[#111]">{label}</span>
                    <p className="text-[14px] text-gray-500 leading-relaxed">{desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Valeurs */}
      <section className="px-6 md:px-16 py-20 md:py-28 bg-[#0a0a0a] text-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-[10px] font-mono tracking-[0.25em] uppercase text-gray-500 mb-6">Nos valeurs</div>
          <h2 className="text-[1.8rem] md:text-[2.6rem] font-medium tracking-tight mb-16 max-w-2xl">
            Ce qui guide chaque projet, chaque décision, chaque ligne de code.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {values.map(({ icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.07 }}
                className="flex flex-col gap-3 border-t border-white/10 pt-6"
              >
                <span className="text-[#f97316] text-[18px] font-light">{icon}</span>
                <span className="text-[15px] font-medium tracking-tight">{title}</span>
                <p className="text-[14px] text-gray-400 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Équipe */}
      <section className="px-6 md:px-16 py-20 md:py-28">
        <div className="max-w-4xl mx-auto">
          <div className="text-[10px] font-mono tracking-[0.25em] uppercase text-[#f97316] mb-6">L'équipe</div>
          <h2 className="text-[1.8rem] md:text-[2.6rem] font-medium tracking-tight mb-16 max-w-2xl">
            Une agence à taille humaine, un interlocuteur unique.
          </h2>

          {/* Profil fondateur */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col md:flex-row gap-10 items-start pb-12 border-b border-gray-100"
          >
            {/* Avatar */}
            <div className="shrink-0 w-20 h-20 rounded-full bg-[#0a0a0a] flex items-center justify-center">
              <span className="text-[#f97316] text-[28px] font-medium tracking-tight">F</span>
            </div>
            <div className="flex flex-col gap-4">
              <div>
                <p className="text-[18px] font-medium tracking-tight">Franck Viator</p>
                <p className="text-[11px] font-mono uppercase tracking-widest text-[#f97316] mt-0.5">Fondateur · Lead No-Code & IA</p>
              </div>
              <p className="text-[14px] text-gray-600 leading-relaxed max-w-xl">
                Développeur autodidacte reconverti dans le No-Code, je travaille à l'intersection du design, de la technologie et de l'automatisation. Mon objectif : livrer des projets qui durent et que vous pouvez gérer vous-même.
              </p>
              <div className="flex flex-wrap gap-2 mt-1">
                {["Webflow", "Bubble", "Make", "n8n", "React", "TypeScript", "ChatGPT API"].map((skill) => (
                  <span key={skill} className="text-[10px] font-mono tracking-widest uppercase px-2.5 py-1 bg-gray-100 text-gray-500 rounded-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Réseau */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="pt-10"
          >
            <p className="text-[13px] text-gray-500 leading-relaxed max-w-xl">
              Sur les projets plus larges, FRK-France s'appuie sur un réseau de freelances qualifiés — rédacteurs SEO, développeurs back-end, graphistes — tous sélectionnés pour leur exigence et leur réactivité.
            </p>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 md:px-16 py-16 bg-gray-50">
        <div className="max-w-3xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 bg-[#0a0a0a] p-10 rounded-md">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-[#f97316] mb-2">Démarrons ensemble</div>
            <h3 className="text-xl font-medium text-white tracking-tight">Parlez-moi de votre projet.</h3>
            <p className="text-gray-400 text-[13px] mt-2">Session de découverte gratuite · 30 minutes · Sans engagement</p>
          </div>
          <a href="mailto:franckviator@gmail.com" className="shrink-0 inline-flex items-center gap-2 bg-[#f97316] text-white px-7 py-3.5 rounded-md text-[13px] font-medium tracking-wide hover:bg-[#ea6b0a] transition-colors duration-300">
            Prendre contact
            <ArrowUpRight size={15} strokeWidth={1.5} />
          </a>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

function SiteFooter({ onNavigate }: { onNavigate?: (page: string) => void } = {}) {
  const scrollTo = (id: string) => {
    if (id === "top") window.scrollTo({ top: 0, behavior: "smooth" });
    else document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="bg-[#0a0a0a] text-white">
      {/* Plan du site */}
      <div className="px-6 md:px-16 pt-14 md:pt-20 pb-10 max-w-6xl mx-auto">
        <p className="text-[9px] font-mono tracking-[0.25em] uppercase text-gray-600 mb-10">Plan du site</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-8 pb-12 border-b border-white/10">

          {/* Colonne 1 — Brand */}
          <div className="col-span-2 md:col-span-1 flex flex-col gap-4">
            <span className="text-[15px] font-semibold tracking-tight">FRK-France</span>
            <span className="text-[10px] font-mono text-gray-500 tracking-widest uppercase leading-relaxed">Agence Digitale<br />Paris, France</span>
            <div className="flex flex-col gap-1 mt-2">
              <a href="mailto:franckviator@gmail.com" className="text-[11px] font-mono text-gray-500 hover:text-white transition-colors duration-200">franckviator@gmail.com</a>
              <span className="text-[11px] font-mono text-gray-500">06 50 13 58 57</span>
            </div>
          </div>

          {/* Colonne 2 — Navigation */}
          <div className="flex flex-col gap-3">
            <p className="text-[9px] font-mono tracking-[0.2em] uppercase text-gray-600 mb-1">Navigation</p>
            {[
              { label: "Accueil",   action: () => scrollTo("top") },
              { label: "Expertise", action: () => scrollTo("expertise") },
              { label: "Projets",   action: () => scrollTo("projets") },
              { label: "Processus", action: () => scrollTo("processus") },
              { label: "Blog",      action: () => onNavigate?.("blog") },
              { label: "À propos",  action: () => onNavigate?.("a-propos") },
              { label: "Contact",   action: () => scrollTo("contact") },
            ].map(({ label, action }) => (
              <button key={label} onClick={action} className="text-left text-[11px] font-mono text-gray-400 hover:text-white transition-colors duration-200 tracking-wide">
                {label}
              </button>
            ))}
          </div>

          {/* Colonne 3 — Projets */}
          <div className="flex flex-col gap-3">
            <p className="text-[9px] font-mono tracking-[0.2em] uppercase text-gray-600 mb-1">Projets</p>
            {[
              { label: "Site e-commerce",     action: () => onNavigate?.("p1") },
              { label: "Site vitrine Apex",    action: () => onNavigate?.("p2") },
              { label: "Animation IA",         action: () => onNavigate?.("p3") },
              { label: "Automatisation CRM",   action: () => scrollTo("projets") },
              { label: "Dashboard Analytics",  action: () => scrollTo("projets") },
              { label: "Site vitrine Targo",   action: () => onNavigate?.("p6") },
            ].map(({ label, action }) => (
              <button key={label} onClick={action} className="text-left text-[11px] font-mono text-gray-400 hover:text-white transition-colors duration-200 tracking-wide">
                {label}
              </button>
            ))}
          </div>

          {/* Colonne 4 — Blog */}
          <div className="flex flex-col gap-3">
            <p className="text-[9px] font-mono tracking-[0.2em] uppercase text-gray-600 mb-1">Blog</p>
            {[
              { label: "No-Code vs Développement",   action: () => onNavigate?.("blog-nocode-vs-dev") },
              { label: "5 processus à automatiser",   action: () => onNavigate?.("blog-5-processus-automatiser") },
              { label: "IA & Productivité PME",       action: () => onNavigate?.("blog-ia-productivite-pme") },
              { label: "Site qui fait fuir",           action: () => onNavigate?.("blog-site-qui-fait-fuir") },
              { label: "App sans développeur",        action: () => onNavigate?.("blog-app-sans-developpeur") },
            ].map(({ label, action }) => (
              <button key={label} onClick={action} className="text-left text-[11px] font-mono text-gray-400 hover:text-white transition-colors duration-200 tracking-wide">
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="text-[10px] font-mono text-gray-600 tracking-widest uppercase">© 2026 FRK-France — Tous droits réservés</div>
          <div className="text-[10px] font-mono text-gray-600 tracking-widest uppercase">Solution No Code · Paris, France</div>
        </div>
      </div>
    </footer>
  );
}

function PhoneReveal() {
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);
  const p = ["06", "50", "13", "58", "57"];
  const full = p.join(" ");

  const handleCopy = () => {
    navigator.clipboard.writeText(p.join("")).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (!revealed) {
    return (
      <button
        onClick={() => setRevealed(true)}
        className="group inline-flex items-center gap-3 text-[1rem] md:text-[1.1rem] font-mono tracking-tight text-gray-400 hover:text-[#111] transition-colors duration-300"
      >
        <span className="tracking-widest">+33 ·· ·· ·· ·· ··</span>
        <span className="text-[9px] uppercase tracking-[0.18em] font-mono border border-gray-300 group-hover:border-[#111] px-2 py-1 rounded-sm transition-colors duration-300">
          Révéler
        </span>
      </button>
    );
  }

  return (
    <button
      onClick={handleCopy}
      title="Copier"
      className="group inline-flex items-center gap-3 text-[1rem] md:text-[1.1rem] font-mono tracking-tight text-[#111] transition-colors duration-300"
    >
      <span>{full}</span>
      <span className="text-[9px] uppercase tracking-[0.18em] font-mono border border-gray-300 group-hover:border-[#111] px-2 py-1 rounded-sm transition-colors duration-300">
        {copied ? "Copié ✓" : "Copier"}
      </span>
    </button>
  );
}

function SlidingNav({ onNavigate, onScrollTo }: { onNavigate: (page: string | null) => void; onScrollTo: (id: string) => void }) {
  const [position, setPosition] = useState<{ left: number; width: number; opacity: number }>({
    left: 0,
    width: 0,
    opacity: 0,
  });

  const scrollOrGo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
    else onScrollTo(id);
  };

  const tabs = [
    { label: "Accueil",   action: () => { onNavigate(null); onScrollTo("top"); } },
    { label: "Expertise", action: () => scrollOrGo("expertise") },
    { label: "Projets",   action: () => scrollOrGo("projets") },
    { label: "Processus", action: () => scrollOrGo("processus") },
    { label: "Blog",      action: () => onNavigate("blog") },
    { label: "À propos",  action: () => onNavigate("a-propos") },
    { label: "Contact",   action: () => scrollOrGo("contact") },
  ];

  return (
    <ul
      className="relative mx-auto flex w-fit rounded-full bg-white/80 backdrop-blur-xl p-1 shadow-md"
      onMouseLeave={() => setPosition((pv) => ({ ...pv, opacity: 0 }))}
    >
      {tabs.map(({ label, action }) => (
        <NavTab key={label} setPosition={setPosition} onClick={action}>
          {label}
        </NavTab>
      ))}
      <NavCursor position={position} />
    </ul>
  );
}

function MobileNav({ onNavigate, onScrollTo }: { onNavigate: (page: string | null) => void; onScrollTo: (id: string) => void }) {
  const [open, setOpen] = useState(false);

  const scrollOrGo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
    else onScrollTo(id);
  };

  const tabs = [
    { label: "Accueil",   action: () => { onNavigate(null); onScrollTo("top"); } },
    { label: "Expertise", action: () => scrollOrGo("expertise") },
    { label: "Projets",   action: () => scrollOrGo("projets") },
    { label: "Processus", action: () => scrollOrGo("processus") },
    { label: "Blog",      action: () => onNavigate("blog") },
    { label: "À propos",  action: () => onNavigate("a-propos") },
    { label: "Contact",   action: () => scrollOrGo("contact") },
  ];

  return (
    <>
      {/* Burger button — fixed directly in viewport, no transform parent */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Menu"
        className="md:hidden fixed top-4 right-4 z-[61] flex flex-col justify-center items-center gap-[5px] w-11 h-11 rounded-full bg-white/90 backdrop-blur-xl shadow-md border border-gray-100"
      >
        <span className={`block bg-[#111] transition-all duration-300 h-[1.5px] ${open ? "w-5 rotate-45 translate-y-[6.5px]" : "w-5"}`} />
        <span className={`block bg-[#111] transition-all duration-300 h-[1.5px] ${open ? "opacity-0 w-5" : "w-5"}`} />
        <span className={`block bg-[#111] transition-all duration-300 h-[1.5px] ${open ? "w-5 -rotate-45 -translate-y-[6.5px]" : "w-5"}`} />
      </button>

      {/* Dropdown — also fixed directly, no transform parent */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-nav-menu"
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="md:hidden fixed top-[72px] left-4 right-4 z-[60] bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
          >
            {tabs.map(({ label, action }, i) => (
              <button
                key={label}
                onClick={() => { setOpen(false); action(); }}
                className={`w-full text-left px-5 py-4 text-[11px] font-mono tracking-[0.18em] uppercase text-gray-700 hover:text-black hover:bg-gray-50 transition-colors duration-150 ${i < tabs.length - 1 ? "border-b border-gray-100" : ""}`}
              >
                {label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ─── APP ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [activePage, setActivePage] = useState<string | null>(null);
  const [scrollTarget, setScrollTarget] = useState<string | null>(null);
  const [showVideo, setShowVideo] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [showPhone, setShowPhone] = useState(false);
  const [activeChapter, setActiveChapter] = useState(2);

  useEffect(() => {
    if (activePage === null) {
      setPageMeta(
        "FRK-France — Design Web, No-Code & IA",
        "FRK-France, agence digitale à Paris. Création de sites web, applications no-code et automatisation IA sur-mesure pour PME et entrepreneurs.",
        "/"
      );
    }
  }, [activePage]);

  // Deep-link: restore page from sessionStorage (set by 404.html redirect)
  useEffect(() => {
    const redirect = sessionStorage.getItem("spa_redirect");
    if (redirect) {
      sessionStorage.removeItem("spa_redirect");
      const page = PATH_TO_PAGE[redirect];
      if (page) setActivePage(page);
    }
  }, []);

  // Video delay
  useEffect(() => {
    const t = setTimeout(() => setShowVideo(true), 2800);
    return () => clearTimeout(t);
  }, []);

  // Chapter auto-cycle
  useEffect(() => {
    const t = setInterval(() => {
      setActiveChapter((prev) => (prev + 1) % 5);
    }, 3500);
    return () => clearInterval(t);
  }, []);

  // Scroll to section after navigation back to home
  useEffect(() => {
    if (scrollTarget && activePage === null) {
      const id = scrollTarget;
      setScrollTarget(null);
      if (id === "top") { window.scrollTo({ top: 0, behavior: "smooth" }); return; }
      // small delay to let home page render
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }, 80);
    }
  }, [activePage, scrollTarget]);

  const handleScrollTo = (id: string) => {
    setActivePage(null);
    setScrollTarget(id);
  };

  const nav = (
    <>
      <div className="hidden md:block fixed top-4 left-1/2 -translate-x-1/2 z-[60]">
        <SlidingNav onNavigate={(p) => setActivePage(p)} onScrollTo={handleScrollTo} />
      </div>
      <MobileNav onNavigate={(p) => setActivePage(p)} onScrollTo={handleScrollTo} />
    </>
  );

  if (activePage === "p1") {
    return <>{nav}<ProjectDetailSailingloc onBack={() => setActivePage(null)} /></>;
  }
  if (activePage === "p2") {
    return <>{nav}<ProjectDetailApex onBack={() => setActivePage(null)} /></>;
  }
  if (activePage === "p3") {
    return <>{nav}<ProjectDetailRenaissanceAfrik onBack={() => setActivePage(null)} /></>;
  }
  if (activePage === "p6") {
    return <>{nav}<ProjectDetailTargo onBack={() => setActivePage(null)} /></>;
  }
  if (activePage === "blog") {
    return <>{nav}<BlogPage onBack={() => setActivePage(null)} onArticleClick={(id) => setActivePage(`blog-${id}`)} /></>;
  }
  if (activePage === "blog-nocode-vs-dev") {
    return <>{nav}<BlogArticleNocodeVsDev onBack={() => setActivePage("blog")} onNavigate={setActivePage} /></>;
  }
  if (activePage === "blog-5-processus-automatiser") {
    return <>{nav}<BlogArticle5Processus onBack={() => setActivePage("blog")} onNavigate={setActivePage} /></>;
  }
  if (activePage === "blog-ia-productivite-pme") {
    return <>{nav}<BlogArticleIaProductivite onBack={() => setActivePage("blog")} onNavigate={setActivePage} /></>;
  }
  if (activePage === "blog-site-qui-fait-fuir") {
    return <>{nav}<BlogArticleSiteFuir onBack={() => setActivePage("blog")} onNavigate={setActivePage} /></>;
  }
  if (activePage === "blog-app-sans-developpeur") {
    return <>{nav}<BlogArticleAppSansDev onBack={() => setActivePage("blog")} onNavigate={setActivePage} /></>;
  }
  if (activePage === "a-propos") {
    return <>{nav}<PageAPropos onBack={() => setActivePage(null)} /></>;
  }
  if (activePage === "decouverte-analyse") {
    return <>{nav}<PageDecouverteAnalyse onBack={() => setActivePage(null)} /></>;
  }
  if (activePage === "architecture-design") {
    return <>{nav}<PageArchitectureDesign onBack={() => setActivePage(null)} /></>;
  }
  if (activePage === "production-build") {
    return <>{nav}<PageProductionBuild onBack={() => setActivePage(null)} /></>;
  }
  if (activePage === "test-validation") {
    return <>{nav}<PageTestValidation onBack={() => setActivePage(null)} /></>;
  }
  if (activePage === "lancement-suivi") {
    return <>{nav}<PageLancementSuivi onBack={() => setActivePage(null)} /></>;
  }

  return (
    <div className="overflow-x-hidden bg-[#fcfcfc] text-[#111] font-sans">

      {/* ── Floating sliding nav ── */}
      {nav}

      {/* ═══════════════════════════════════════════════════════ SECTION 1: HERO */}
      <section className="relative w-full h-screen flex flex-col overflow-hidden bg-[#111]">

        {/* Dark base — always visible, ensures white text is readable before video */}
        <div className="absolute inset-0 bg-[#111] z-0" />

        {/* 1D — Background Video */}
        <AnimatePresence>
          {showVideo && (
            <motion.div
              key="video"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.5 }}
              className="absolute top-0 left-0 w-full h-full pointer-events-none z-[1]"
            >
              <video
                autoPlay
                loop
                muted
                playsInline
                onCanPlay={() => setVideoReady(true)}
                className="w-full h-full object-cover"
              >
                <source
                  src={`${base}video/Hero_video.mp4`}
                  type="video/mp4"
                />
              </video>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Box Loader — visible while video hasn't started playing */}
        <AnimatePresence>
          {!videoReady && (
            <motion.div
              key="hero-loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.8 } }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="absolute inset-0 z-[2] flex items-center justify-center pointer-events-none"
            >
              <BoxLoader />
            </motion.div>
          )}
        </AnimatePresence>

        {/* 1A — Header: NHM SVG Logo */}
        <motion.header
          initial="initial"
          animate="animate"
          variants={{ animate: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } } }}
          className="pt-6 px-6 md:px-16 z-20"
        >
          <motion.h1
            variants={{
              initial: { scale: 1.03 },
              animate: {
                scale: 1,
                transition: { staggerChildren: 0.06, delayChildren: 0.1 },
              },
            }}
            className="w-full"
          >
            {(() => {
              const chars = ["F","R","K","-","F","r","a","n","c","e"];
              const slotW = 100;
              return (
                <svg
                  viewBox="0 0 1000 115"
                  className="w-full fill-white"
                  aria-label="FRK-France"
                >
                  <defs>
                    {chars.map((_, i) => (
                      <clipPath key={i} id={`frkclip-${i}`}>
                        <rect x={i * slotW} y={-10} width={slotW + 1} height={130} />
                      </clipPath>
                    ))}
                  </defs>
                  {chars.map((char, i) => (
                    <g key={i} clipPath={`url(#frkclip-${i})`}>
                      <motion.text
                        x={i * slotW + slotW / 2}
                        y={108}
                        variants={letterBlock}
                        textAnchor="middle"
                        fontSize={110}
                        fontWeight={600}
                        fontFamily="Inter, ui-sans-serif, sans-serif"
                      >
                        {char}
                      </motion.text>
                    </g>
                  ))}
                </svg>
              );
            })()}
          </motion.h1>

          {/* 1B — Sub-nav bar */}
          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex justify-between items-start mt-4 md:mt-8"
          >
            {/* Left column */}
            <div className="text-[10px] md:text-[11px] font-mono tracking-[0.2em] uppercase w-[15%]">
              <div>FRK</div>
              <div>France</div>
              <div>Agence</div>
            </div>

            {/* Arrow separator */}
            <div className="hidden md:flex items-start pt-0.5 w-[5%] justify-center">
              <ArrowRight size={14} strokeWidth={1} className="text-gray-400" />
            </div>

            {/* Center column */}
            <div className="flex-1 md:flex-none md:w-[30%] text-gray-800 leading-relaxed font-mono text-[10px] md:text-[11px] tracking-[0.15em]">
              <span className="hidden md:block">
                Sites, apps et IA<br />
                conçus pour votre<br />
                croissance digitale.
              </span>
              <span className="md:hidden">
                Sites, apps et IA<br />
                pour votre<br />
                croissance.
              </span>
            </div>

            {/* Arrow separator */}
            <div className="hidden md:flex items-start pt-0.5 w-[5%] justify-center">
              <ArrowRight size={14} strokeWidth={1} className="text-gray-400" />
            </div>

            {/* Right nav links */}
            <div className="hidden md:flex flex-col gap-1 w-[15%] text-[10px] font-mono tracking-[0.2em] uppercase">
              {[
                { label: "Expertise", id: "expertise", page: null },
                { label: "Projets", id: "projets", page: null },
                { label: "Blog", id: null, page: "blog" },
                { label: "Processus", id: "processus", page: null },
                { label: "Contact", id: "contact", page: null },
              ].map(({ label, id, page }) => (
                <a
                  key={label}
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (page) { setActivePage(page); }
                    else if (id) { document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); }
                  }}
                  className="text-gray-800 hover:text-black hover:underline transition-colors"
                >
                  {label}
                </a>
              ))}
            </div>

          </motion.div>
        </motion.header>

        {/* Hero body: left + right sidebars */}
        <div className="flex flex-col md:flex-row justify-between px-6 md:px-16 mt-1 sm:mt-2 md:mt-2 pb-24 md:pb-0 z-10 flex-1">

          {/* 1E — Left Sidebar */}
          <motion.div
            initial="initial"
            animate="animate"
            variants={{ animate: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } } }}
            className="w-full md:w-[320px]"
          >
            {/* Section indicator */}
            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="flex items-center gap-3 mb-6 text-xs font-mono text-white"
            >
              <span>01</span>
              <span className="w-16 h-[1.5px] bg-white/30 block" />
            </motion.div>

            {/* Headline */}
            <motion.h2
              variants={fadeUp}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-[2.6rem] sm:text-[3.5rem] md:text-[5rem] font-normal tracking-tight leading-[1] mb-6 text-white"
            >
              AGENCE<br />DIGITALE
            </motion.h2>

            {/* Slogan */}
            <motion.p
              variants={fadeUp}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-[11px] font-mono tracking-[0.25em] uppercase text-white/60 mb-6"
            >
              Solution No Code
            </motion.p>

            {/* CTA Contactez-nous */}
            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="mb-6 flex flex-row items-center gap-4"
            >
              <button
                onClick={() => setShowPhone(v => !v)}
                className="group inline-flex items-center gap-3 border border-white/60 text-white px-6 py-3 rounded-md text-[13px] font-mono tracking-widest uppercase hover:bg-white hover:text-[#111] transition-all duration-300 w-fit shrink-0"
              >
                Contactez-nous
                <ArrowUpRight size={15} strokeWidth={1.5} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
              <AnimatePresence>
                {showPhone && (
                  <motion.a
                    href="tel:0650135857"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.25 }}
                    className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white px-4 py-3 rounded-md text-[14px] font-mono tracking-widest hover:bg-white/20 transition-colors duration-200 whitespace-nowrap"
                  >
                    <Phone size={15} strokeWidth={2} className="text-[#f97316]" />
                    06 50 13 58 57
                  </motion.a>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Description — LCP element: no animation so browser paints it immediately */}
            <p className="text-[20px] md:text-[26px] text-white/90 w-full max-w-[400px] leading-[1.5] mb-8">
              Des outils digitaux qui font<br />
              croître votre activité —<br />
              web, apps et IA.
            </p>

            {/* CTA Button */}
            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <motion.button
                whileHover={{ y: -0.5, boxShadow: "3px 3px 0px rgba(17,17,17,0.5)" }}
                whileTap={{ y: 0, boxShadow: "none" }}
                transition={{ duration: 0.2 }}
                onClick={() => document.getElementById("projets")?.scrollIntoView({ behavior: "smooth" })}
                className="group relative overflow-hidden bg-[#1a1a1a] px-6 py-3.5 border border-[#1a1a1a] rounded-md shadow-sm flex items-center gap-3"
              >
                {/* Sliding background panel */}
                <span className="absolute inset-0 bg-[#fcfcfc] -translate-x-[101%] group-hover:translate-x-0 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]" />

                <span className="relative z-10 transition-all duration-300 group-hover:translate-x-1">
                  <ArrowUpRight
                    size={18}
                    strokeWidth={1.5}
                    className="text-white group-hover:text-[#111] transition-colors duration-300"
                  />
                </span>

                <span className="relative z-10 text-[15px] font-medium text-white group-hover:text-[#111] transition-colors duration-300">
                  Nos projets
                </span>
              </motion.button>
            </motion.div>
          </motion.div>

          {/* 1F — Right Sidebar */}
          <motion.div
            initial="initial"
            animate="animate"
            variants={{ animate: { transition: { staggerChildren: 0.15, delayChildren: 0.9 } } }}
            className="hidden md:flex flex-col w-[200px] mt-12 md:mt-20 gap-6"
          >
            {/* Agency info */}
            <motion.div variants={fadeUp} transition={{ duration: 0.8, ease: "easeOut" }}>
              <div className="text-[10px] font-bold font-mono tracking-widest uppercase mb-2 text-white">
                FRK-France
              </div>
              <div className="text-[12px] text-white/70 leading-[1.6]">
                Agence digitale<br />Paris, France
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div variants={fadeUp} transition={{ duration: 0.8, ease: "easeOut" }} className="flex flex-col gap-3">
              <div>
                <div className="text-[10px] font-mono tracking-widest uppercase text-white/60">Projets livrés</div>
                <div className="text-[13px] font-medium text-white">12 +</div>
              </div>
              <div>
                <div className="text-[10px] font-mono tracking-widest uppercase text-white/60">Satisfaction</div>
                <div className="text-[13px] font-medium text-white">100 %</div>
              </div>
            </motion.div>

            {/* View Details */}
            <motion.div variants={fadeUp} transition={{ duration: 0.8, ease: "easeOut" }}>
              <a
                href="https://www.jardindesplantesdeparis.fr/fr/un-t-rex-a-paris#haut-de-page"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-full border border-gray-400 flex items-center justify-center transition-all duration-300 group-hover:border-black group-hover:bg-[#111]">
                  <Plus
                    size={16}
                    strokeWidth={1.5}
                    className="text-gray-600 group-hover:text-white transition-colors duration-300"
                  />
                </div>
                <span className="text-[10px] font-mono uppercase tracking-widest font-bold text-white">
                  View Details
                </span>
              </a>
            </motion.div>
          </motion.div>
        </div>

      </section>

      {/* ══════════════════════════════════════ SECTION MANIFESTE */}
      <section className="relative w-full bg-white px-6 md:px-16 py-24 md:py-36 z-20 overflow-hidden">
        {/* Grain décoratif */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.025]"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }}
        />

        <div className="relative max-w-5xl mx-auto">

          {/* Label */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-[10px] font-mono tracking-[0.25em] uppercase text-[#f97316] mb-10"
          >
            Pourquoi FRK-France
          </motion.p>

          {/* Headline */}
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.75, delay: 0.05 }}
            className="text-[1.9rem] sm:text-[2.8rem] md:text-[3.6rem] font-medium tracking-tight leading-[1.08] text-[#111] mb-8 max-w-3xl"
          >
            Un outil digital précis ne devrait pas coûter{" "}
            <span className="text-gray-300">une fortune</span> ni prendre{" "}
            <span className="text-gray-300">six mois</span>.
          </motion.h2>

          {/* Lead */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-[15px] md:text-[17px] text-gray-500 leading-[1.85] max-w-2xl mb-20"
          >
            FRK-France existe pour donner aux PME et aux entrepreneurs
            les mêmes armes que les grandes entreprises — livrées vite,
            construites pour durer, et que vous gérez vous-même.
          </motion.p>

          {/* 3 piliers */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 border-t border-gray-100 pt-14">
            {[
              {
                num: "01",
                title: "Mission",
                body: "Rendre le digital accessible aux PME et entrepreneurs — sans compromis sur la qualité, la vitesse ou l'autonomie du client.",
              },
              {
                num: "02",
                title: "Méthode",
                body: "No-Code en priorité, développement sur mesure quand nécessaire, IA partout où c'est pertinent. Toujours orienté résultat mesurable.",
              },
              {
                num: "03",
                title: "Engagement",
                body: "Vous êtes autonome à la livraison. Formation incluse, documentation fournie, accès complet. Votre outil vous appartient vraiment.",
              },
            ].map(({ num, title, body }, i) => (
              <motion.div
                key={num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.14 + i * 0.09 }}
                className="flex flex-col gap-3"
              >
                <span className="text-[10px] font-mono text-[#f97316] tracking-widest">{num}</span>
                <h3 className="text-[15px] font-semibold tracking-tight text-[#111]">{title}</h3>
                <p className="text-[13px] text-gray-500 leading-relaxed">{body}</p>
              </motion.div>
            ))}
          </div>

          {/* Citation de marque */}
          <motion.blockquote
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-16 border-l-2 border-[#f97316] pl-6"
          >
            <p className="text-[15px] md:text-[17px] text-[#111] font-medium leading-snug italic max-w-xl">
              "Le meilleur outil digital, c'est celui que vos équipes utilisent vraiment — pas celui qui impressionne en démo."
            </p>
            <cite className="mt-3 block text-[10px] font-mono uppercase tracking-widest text-gray-400 not-italic">
              Franck Viator · Fondateur, FRK-France
            </cite>
          </motion.blockquote>
        </div>
      </section>

      {/* ══════════════════════════════════════ SECTION 2: EXPLORE OUR WORLD */}
      <section id="expertise" className="relative w-full min-h-[75vh] md:min-h-screen bg-[#fcfcfc] flex flex-col items-center pt-24 md:pt-32 pb-0 z-20">

        {/* 2A — Section label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex items-center gap-3 text-[10px] md:text-[11px] font-mono tracking-[0.2em] mb-12"
        >
          <span className="text-gray-500">[ 02 ]</span>
          <span className="text-gray-900 font-bold uppercase">Notre Expertise</span>
        </motion.div>

        {/* 2B — Main heading */}
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="text-[2.2rem] md:text-[3.5rem] lg:text-[4.2rem] leading-[1.1] font-medium tracking-tight text-[#111] max-w-[1000px] text-center px-6 mb-10"
        >
          <span className="hidden md:block">
            Nous façonnons des expériences digitales<br />qui transforment votre marque.
          </span>
          <span className="md:hidden">
            Nous façonnons des expériences digitales qui transforment votre marque.
          </span>
        </motion.h2>

        {/* 2C — Action pills */}
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={{ animate: { transition: { staggerChildren: 0.1, delayChildren: 0.3 } } }}
          className="flex flex-wrap justify-center gap-3 md:gap-4 mb-10 md:mb-24 px-6"
        >
          {[
            { icon: <Monitor size={14} strokeWidth={2} />, label: "Design Web" },
            { icon: <Code2 size={14} strokeWidth={2} />, label: "Développement" },
            { icon: <Palette size={14} strokeWidth={2} />, label: "Branding" },
            { icon: <TrendingUp size={14} strokeWidth={2} />, label: "Stratégie" },
            { icon: <FlaskConical size={14} strokeWidth={2} />, label: "Test d'Application" },
            { icon: <Bot size={14} strokeWidth={2} />, label: "No Code & IA" },
          ].map(({ icon, label }) => (
            <motion.button
              key={label}
              variants={fadeUp}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-gray-300 text-[11px] font-medium uppercase tracking-wider bg-white/50 backdrop-blur-sm text-gray-800 hover:border-black hover:bg-black hover:text-white transition-all duration-300"
            >
              {icon}
              {label}
            </motion.button>
          ))}
        </motion.div>

        {/* 2D — Pterodactyl in Expertise section */}
        <div className="min-h-[260px] md:min-h-[480px] w-full relative">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 1.4, ease: "easeOut" }}
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[160vw] md:w-[1000px] pointer-events-none"
          >
            <motion.img
              src={`${base}Pterodactyle.webp`}
              alt="Pterodactyl"
              className="w-full"
              animate={{
                y: [0, -22, 0],
                rotate: [-1, 1, -1],
                x: [0, 12, 0],
              }}
              transition={{
                duration: 6,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "loop",
                times: [0, 0.5, 1],
              }}
            />
          </motion.div>
        </div>

        {/* 2E — Bottom text */}
        <div className="absolute bottom-0 left-0 right-0 px-8 md:px-16 pb-8 md:pb-12 pointer-events-none hidden md:flex justify-between">
          <span className="text-[10px] font-mono tracking-widest uppercase text-gray-500 font-medium">
            WE DON'T JUST BUILD WEBSITES.
          </span>
          <span className="text-[10px] font-mono tracking-widest uppercase text-gray-500 font-medium">
            DIGITAL AGENCY © 2026
          </span>
        </div>
      </section>

      <div id="projets"><ProjectsSection onProjectClick={(id) => setActivePage(id)} /></div>

      {/* ══════════════════════════════════════ SECTION 4: NOTRE PROCESSUS */}
      <section id="processus" className="relative w-full bg-[#0a0a0a] text-white flex flex-col z-30">

        {/* 3B — Heading Area */}
        <div className="px-4 sm:px-8 md:px-16 pt-16 sm:pt-20 md:pt-28 mb-8 md:mb-16 z-10 flex flex-col xl:flex-row justify-between gap-8 xl:gap-20">
          {/* Left heading */}
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="text-[1.5rem] sm:text-[2rem] md:text-[3rem] lg:text-[3.8rem] xl:text-[4rem] leading-[1.15] font-medium tracking-tight text-white max-w-3xl"
          >
            Des projets digitaux conçus pour{" "}
            <span className="inline-flex gap-2 md:gap-3 align-middle mx-2 md:mx-4 translate-y-[-4px]">
              {[Monitor, Code2, TrendingUp].map((Icon, i) => (
                <span
                  key={i}
                  className="w-10 h-10 md:w-14 md:h-14 rounded-full border border-gray-600 bg-black text-gray-400 flex items-center justify-center hover:bg-white hover:text-black hover:border-white transition-all duration-300 cursor-pointer"
                >
                  <Icon size={22} />
                </span>
              ))}
            </span>
            {" "}performer et durer.
          </motion.h2>

          {/* Right tagline + pills */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: "easeOut", delay: 0.2 }}
            className="flex flex-col justify-center gap-6 xl:max-w-[280px]"
          >
            <p className="text-[9px] md:text-[10px] font-mono tracking-widest text-gray-400 uppercase leading-relaxed">
              ON NE LIVRE PAS DES SITES WEB<br />ON CONSTRUIT DES OUTILS DE CROISSANCE
            </p>
            <div className="flex flex-wrap gap-3">
              {["Stratégique", "Agile", "Précis"].map((label) => (
                <button
                  key={label}
                  className="px-5 py-2 rounded-full border border-gray-600 text-[9px] font-mono tracking-widest uppercase text-gray-300 hover:bg-white hover:text-black hover:border-white transition-all duration-300"
                >
                  {label}
                </button>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Horizontal divider */}
        <div className="h-[1px] bg-gray-800 mx-0" />

        {/* 3C — Two-column panel */}
        <div className="flex flex-col md:flex-row z-10">

          {/* Left panel — chapter image */}
          <div className="w-full md:w-[35%] border-b md:border-b-0 md:border-r border-gray-800 min-h-[320px] md:min-h-[500px] flex flex-col justify-between p-4 sm:p-6 md:p-8 relative">
            <div className="text-gray-500 text-xl tracking-[0.3em]">***</div>

            {/* Sand transition image */}
            <div className="relative flex-1 flex items-center justify-center overflow-hidden">
              <AnimatePresence mode="wait">
                <SandTransitionImage
                  key={activeChapter}
                  src={chaptersData[activeChapter].image}
                  alt={chaptersData[activeChapter].name}
                  className="absolute inset-0 w-[80%] h-[80%] m-auto object-contain mix-blend-lighten"
                />
              </AnimatePresence>
            </div>

            {/* Chapter counter */}
            <div className="flex items-center gap-2 text-[10px] font-mono tracking-widest uppercase">
              <div className="overflow-hidden h-[16px]">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={`counter-${activeChapter}`}
                    initial={{ y: 16, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -16, opacity: 0 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="block text-[#888]"
                  >
                    {String(activeChapter + 1).padStart(2, "0")}
                  </motion.span>
                </AnimatePresence>
              </div>
              <span className="text-[#333]">/</span>
              <span className="text-[#888]">05</span>
            </div>
          </div>

          {/* Right panel — chapter list */}
          <div className="flex-1 flex flex-col">
            {/* Top bar */}
            <div className="border-b border-gray-800 p-4 sm:p-6 md:p-8 flex items-center justify-between text-[10px] font-mono text-gray-400 tracking-widest">
              <span>Notre processus. Votre succès.</span>
              <AnimatePresence mode="wait">
                <motion.span
                  key={`chapter-label-${activeChapter}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                  className="hidden md:block"
                >
                  Étape 0{activeChapter + 1}
                </motion.span>
              </AnimatePresence>
            </div>

            {/* Chapter list */}
            {chaptersData.map((chapter, i) => (
              <button
                key={i}
                onClick={() => {
                  setActiveChapter(i);
                  if (i === 0) setActivePage("decouverte-analyse");
                  if (i === 1) setActivePage("architecture-design");
                  if (i === 2) setActivePage("production-build");
                  if (i === 3) setActivePage("test-validation");
                  if (i === 4) setActivePage("lancement-suivi");
                }}
                className={`border-b border-gray-800/80 py-4 sm:py-6 px-4 sm:px-6 md:px-8 flex items-start justify-between text-left transition-colors duration-300 w-full ${
                  i === activeChapter
                    ? "text-white"
                    : "text-[#444] hover:text-[#999]"
                }`}
              >
                <div className="flex flex-col gap-2 flex-1">
                  <div className="flex items-baseline gap-4">
                    <span className="text-[10px] font-mono text-gray-600 shrink-0">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-base sm:text-xl md:text-[1.75rem] font-medium tracking-tight leading-tight">
                      {chapter.name}
                    </span>
                  </div>
                  <AnimatePresence>
                    {i === activeChapter && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.35, ease: "easeOut" }}
                        className="text-[11px] font-mono text-gray-500 leading-relaxed pl-6 md:pl-8 max-w-full md:max-w-[420px] overflow-hidden"
                      >
                        {chapter.description}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
                <AnimatePresence>
                  {i === activeChapter && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.3 }}
                      className="shrink-0 mt-1"
                    >
                      <ArrowUpRight size={22} strokeWidth={1} className="text-gray-400" />
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            ))}
          </div>
        </div>

        {/* 3D — Bottom footer */}
        <div className="h-[1px] bg-gray-800" />
        <div className="px-4 sm:px-8 py-6 md:py-8 text-[10px] font-mono tracking-widest text-gray-500 uppercase bg-[#0a0a0a]">
          DIGITAL AGENCY © 2026
        </div>
      </section>

      {/* ══════════════════════════════════════ SECTION FAQ */}
      <FaqSection onNavigate={(p) => setActivePage(p)} />

      {/* ══════════════════════════════════════ SECTION 5: CONTACT */}
      <section id="contact" className="relative w-full bg-[#fcfcfc] text-[#111] overflow-hidden">

        {/* Top border */}
        <div className="h-[1px] bg-gray-200" />

        {/* Main contact area */}
        <div className="px-6 md:px-16 pt-20 md:pt-32 pb-16 md:pb-24 max-w-6xl mx-auto">

          {/* Label */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="flex items-center gap-3 text-[10px] md:text-[11px] font-mono tracking-[0.2em] mb-12"
          >
            <span className="text-gray-400">[ 05 ]</span>
            <span className="text-gray-600 font-bold uppercase">Contact</span>
          </motion.div>

          <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 justify-between">

            {/* Left — Heading + email + info cards */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: "easeOut" }}
              className="flex-1 min-w-0 flex flex-col"
            >
              <h2 className="text-[2.5rem] sm:text-[3.5rem] md:text-[5rem] font-medium tracking-tight leading-[1.05] mb-10">
                Parlons de<br />votre projet.
              </h2>

              {/* Email CTA */}
              <a
                href="mailto:franck@fkr-france.fr"
                className="group inline-flex items-center gap-4 mb-10"
              >
                <span className="text-[1rem] md:text-[1.25rem] font-mono tracking-tight text-gray-500 group-hover:text-[#111] transition-colors duration-300 underline underline-offset-4 decoration-gray-300 group-hover:decoration-[#111]">
                  franck@fkr-france.fr
                </span>
                <span className="w-9 h-9 rounded-full bg-[#111] flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110">
                  <ArrowUpRight size={15} strokeWidth={1.5} className="text-white" />
                </span>
              </a>

              {/* Phone */}
              <div className="mb-10">
                <PhoneReveal />
              </div>

              {/* Sub-info */}
              <p className="text-[13px] text-gray-400 font-mono leading-[1.9] mb-12">
                Disponible pour de nouveaux projets.<br />
                Réponse sous 24h.
              </p>

              {/* Info cards */}
              <div className="flex flex-col gap-5">
                {[
                  { label: "Projets", value: "Sites web, apps, automatisations, stratégie digitale." },
                  { label: "Budget",  value: "Projets à partir de 1 500 € selon la complexité." },
                  { label: "Localisation", value: "Full remote · France & international." },
                ].map(({ label, value }) => (
                  <div key={label} className="border-b border-gray-100 pb-5">
                    <div className="text-[10px] font-mono tracking-[0.2em] uppercase text-gray-400 mb-2">{label}</div>
                    <div className="text-[14px] text-gray-700 leading-[1.7]">{value}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right — Paris map */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: "easeOut", delay: 0.15 }}
              className="lg:w-[440px] w-full"
            >
              <div className="relative overflow-hidden rounded-2xl border border-gray-200 h-[300px] lg:h-full lg:min-h-[420px]">
                <iframe
                  title="Paris"
                  src="https://www.openstreetmap.org/export/embed.html?bbox=2.2693%2C48.8153%2C2.4327%2C48.9022&layer=mapnik&marker=48.8566%2C2.3522"
                  width="100%"
                  height="100%"
                  sandbox="allow-scripts allow-same-origin"
                  style={{
                    border: 0,
                    filter: "grayscale(100%) contrast(1.15) brightness(0.88)",
                    pointerEvents: "none",
                  }}
                  loading="lazy"
                />
                <div className="absolute bottom-3 left-3 bg-[#111] text-white text-[9px] font-mono tracking-[0.18em] uppercase px-2.5 py-1.5 rounded-sm">
                  Paris, France
                </div>
              </div>
            </motion.div>

          </div>
        </div>

        {/* ── FOOTER ── */}
        <SiteFooter onNavigate={(p) => setActivePage(p)} />

      </section>
    </div>
  );
}
