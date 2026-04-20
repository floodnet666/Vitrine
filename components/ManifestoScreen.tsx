
import React, { useRef, useEffect } from 'react';
import { ManifestoContent } from '../types';
import ScrollReveal from './ScrollReveal';
import DecisionButton from './DecisionButton';

interface Props {
  content: ManifestoContent;
  onNavigate: (target: string) => void;
}

// Icons
const IconHeart = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const IconEye = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const IconBrain = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
    <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-4.04z" />
    <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-4.04z" />
  </svg>
);

interface EntityItem {
  key: string;
  icon: React.ReactNode;
  title: string;
  data: { title: string; desc: string };
  dotClass: string;
  hoverTextClass: string;
  imageUrl: string;
}

const EntityCard: React.FC<{ item: EntityItem }> = ({ item }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current || !bgRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      
      // Optimization: Only animate when near/in viewport
      if (rect.top < viewportHeight + 100 && rect.bottom > -100) {
        // Parallax calculation: move background based on scroll position relative to viewport center
        const speed = 0.15;
        const offset = (rect.top - (viewportHeight / 2)) * speed;
        
        // Scale helps prevent edges from showing during transform
        bgRef.current.style.transform = `translateY(${offset}px) scale(1.2)`;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Initial calculation
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div ref={containerRef} className="relative h-[650px] w-full bg-[#080808] border border-neutral-900 group hover:border-neutral-700 transition-all duration-700 overflow-hidden flex flex-col justify-between p-8">
      
      {/* Parallax Background */}
      <div 
        ref={bgRef}
        className="absolute inset-0 w-full h-[120%] -top-[10%] opacity-20 pointer-events-none mix-blend-screen transition-opacity duration-1000"
        style={{
          backgroundImage: `url(${item.imageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          willChange: 'transform'
        }}
      />
      
      {/* Dark overlay to ensure text readability */}
      <div className="absolute inset-0 bg-black/60 pointer-events-none z-0" />

      {/* Subtle Gradient Rise on Hover */}
      <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none z-0" />

      {/* Header: Icon & Titles */}
      <div className="relative z-10 flex flex-col items-start gap-8">
         <div className={`text-neutral-500 ${item.hoverTextClass} transition-colors duration-500 transform group-hover:scale-110 origin-left`}>
           {item.icon}
         </div>
         <div>
           <h2 className="font-sans font-bold text-4xl text-neutral-100 tracking-tighter mb-3">
             {item.title}
           </h2>
           <h3 className="font-mono text-[10px] text-neutral-600 tracking-[0.25em] uppercase group-hover:text-neutral-400 transition-colors">
             {item.data.title}
           </h3>
         </div>
      </div>

      {/* Body: Traits (Revealed in Negative Space) */}
      <div className="relative z-10 flex-grow flex flex-col justify-center items-start pl-2 pointer-events-none">
         <div className="space-y-4">
            {item.data.desc.split('\n').map((line, lineIdx) => (
              <div 
                key={lineIdx} 
                className="overflow-hidden"
              >
                <p 
                  className={`font-serif italic text-2xl text-neutral-400 transition-all duration-700 ease-out transform translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100`}
                  style={{ transitionDelay: `${100 + (lineIdx * 100)}ms` }}
                >
                  {line}
                </p>
              </div>
            ))}
         </div>
      </div>

      {/* Footer: Anchors & Status */}
      <div className="relative z-10 flex justify-between items-end mt-auto w-full">
        {/* Hamburger Anchor */}
        <div className="flex flex-col gap-1.5 opacity-20 group-hover:opacity-60 transition-opacity duration-700">
          <div className="w-6 h-[1px] bg-neutral-400" />
          <div className="w-6 h-[1px] bg-neutral-400" />
          <div className="w-6 h-[1px] bg-neutral-400" />
        </div>

        {/* Status Dot */}
        <div className={`w-1.5 h-1.5 rounded-full transition-all duration-700 ${item.dotClass}`} />
      </div>
    </div>
  );
}

const ManifestoScreen: React.FC<Props> = ({ content, onNavigate }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToContent = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const hoverEffect = "transition-all duration-500 hover:text-red-500 hover:tracking-widest cursor-default";

  // Helper to split market text
  const splitMarketLine = (line: string) => {
    // Splits "The market wants speed. I work with tension." into two parts
    const parts = line.split('. ');
    if (parts.length >= 2) {
      return { left: parts[0] + '.', right: parts.slice(1).join('. ') };
    }
    return { left: line, right: '' };
  };

  const handlePortalClick = (index: number) => {
    if (index === 2) { // "Fund a creation"
      onNavigate('FUNDING');
    } else {
      window.open('https://google.com', '_blank');
    }
  };

  return (
    <div className="w-full text-neutral-200">
      
      {/* 1. INVOCATION */}
      <section className="h-screen flex flex-col items-center justify-center text-center px-6 relative">
        <ScrollReveal>
          <h1 className="font-sans text-4xl md:text-7xl font-bold tracking-tighter leading-tight whitespace-pre-line mb-8">
            {content.intro.title}
          </h1>
        </ScrollReveal>
        
        <ScrollReveal delay={1000}>
          <p className="font-serif italic text-neutral-500 text-lg md:text-xl whitespace-pre-line mb-12">
            {content.intro.sub}
          </p>
        </ScrollReveal>

        <ScrollReveal delay={2000}>
          <DecisionButton onClick={scrollToContent} variant="ghost">
            {content.intro.button}
          </DecisionButton>
        </ScrollReveal>
      </section>

      <div ref={scrollRef} />

      {/* 2. REALITY BREAK */}
      <section className="py-32 md:py-48 px-6 max-w-3xl mx-auto flex flex-col gap-24 md:gap-32">
        {content.reality.text.map((line, i) => (
          <ScrollReveal key={i} delay={i * 200}>
            <p className={`text-2xl md:text-4xl leading-relaxed ${i === 2 ? 'font-serif italic text-neutral-400' : 'font-sans font-light'}`}>
               <span className={hoverEffect}>{line}</span>
            </p>
          </ScrollReveal>
        ))}
      </section>

      {/* 3. TENSION BLOCKS */}
      <section className="py-24 px-6 max-w-6xl mx-auto space-y-48">
        
        {/* Block 1: Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-0 relative">
          <ScrollReveal className="md:text-right md:pr-12 text-neutral-600 font-sans text-xl pt-12">
            {content.tension.block1.c1}
          </ScrollReveal>
          <ScrollReveal delay={200} className="text-center md:px-6 text-neutral-400 font-sans text-xl pt-6">
            {content.tension.block1.c2}
          </ScrollReveal>
          <ScrollReveal delay={400} className="md:text-left md:pl-12 text-white font-serif italic text-3xl whitespace-pre-line z-10">
            {content.tension.block1.c3}
          </ScrollReveal>
        </div>

        {/* Block 2: Definition */}
        <div className="text-center max-w-2xl mx-auto">
          <ScrollReveal>
            <h3 className="text-sm font-sans tracking-[0.4em] uppercase text-red-900/80 mb-8 border-b border-red-900/20 pb-4 inline-block">
              {content.tension.block2.title}
            </h3>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <p className="font-sans font-bold text-3xl md:text-5xl tracking-tight leading-tight whitespace-pre-line">
              {content.tension.block2.text}
            </p>
          </ScrollReveal>
        </div>

        {/* Block 3: Birth */}
        <div className="max-w-xl mx-auto flex flex-wrap gap-x-4 gap-y-6 justify-center md:justify-start">
          {content.tension.block3.text.map((t, i) => (
            <ScrollReveal key={i} delay={i * 150} className="inline-block">
              <span className={`text-xl md:text-2xl ${i % 2 === 0 ? 'font-sans' : 'font-serif italic text-red-200/70'} ${hoverEffect}`}>
                {t}
              </span>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* 4. ENTITIES - NEW TALL CARD DESIGN WITH PARALLAX */}
      <section className="py-32 px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-[1400px] mx-auto">
          
          {[
            { 
              key: 'isabela', 
              icon: <IconHeart />, 
              title: "ISABELA", 
              data: content.entities.isabela,
              dotClass: "bg-red-900 group-hover:bg-red-500 group-hover:shadow-[0_0_15px_rgba(239,68,68,0.6)]",
              hoverTextClass: "group-hover:text-red-500",
              imageUrl: "https://picsum.photos/800/800?grayscale&blur=2"
            },
            { 
              key: 'gist', 
              icon: <IconEye />, 
              title: "GIST", 
              data: content.entities.gist,
              dotClass: "bg-cyan-900 group-hover:bg-cyan-400 group-hover:shadow-[0_0_15px_rgba(34,211,238,0.6)]",
              hoverTextClass: "group-hover:text-cyan-400",
              imageUrl: "https://picsum.photos/800/801?grayscale&blur=5"
            },
            { 
              key: 'council', 
              icon: <IconBrain />, 
              title: "THE COUNCIL", 
              data: content.entities.council,
              dotClass: "bg-emerald-900 group-hover:bg-emerald-500 group-hover:shadow-[0_0_15px_rgba(16,185,129,0.6)]",
              hoverTextClass: "group-hover:text-emerald-500",
              imageUrl: "https://picsum.photos/800/802?grayscale&contrast=2"
            }
          ].map((item, idx) => (
            <ScrollReveal key={item.key} delay={idx * 150} className="w-full">
              <EntityCard item={item} />
            </ScrollReveal>
          ))}

        </div>
      </section>

      {/* 5. MARKET WAR */}
      <section className="py-32 px-6 bg-black">
        <div className="max-w-5xl mx-auto space-y-0">
          {content.market.lines.map((line, i) => {
            const { left, right } = splitMarketLine(line);
            return (
              <ScrollReveal key={i} delay={i * 200}>
                <div className="flex flex-col md:flex-row md:items-center justify-between py-12 border-b border-neutral-900 gap-6 group hover:border-neutral-800 transition-colors">
                  <span className="font-sans text-neutral-700 text-lg md:text-xl tracking-wide group-hover:text-neutral-500 transition-colors">
                    {left}
                  </span>
                  <span className="font-serif italic text-xl md:text-3xl text-neutral-100 text-right group-hover:text-red-500 transition-colors">
                    {right}
                  </span>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </section>

      {/* 6. ETHICS */}
      <section className="py-24 text-center space-y-8 px-6">
        {content.ethics.lines.map((line, i) => (
          <ScrollReveal key={i}>
             <p className="font-serif italic text-neutral-600 text-sm md:text-base tracking-widest uppercase hover:text-red-900 transition-colors duration-500">
               {line}
             </p>
          </ScrollReveal>
        ))}
      </section>

      {/* 7. PROPHECY */}
      <section className="py-48 px-6 text-center">
        <ScrollReveal>
          <p className="font-sans text-xl md:text-3xl text-neutral-500 mb-6 whitespace-pre-line">
            {content.prophecy.p1}
          </p>
        </ScrollReveal>
        <ScrollReveal delay={300}>
          <p className="font-serif text-3xl md:text-6xl text-white font-bold leading-tight whitespace-pre-line">
            {content.prophecy.p2}
          </p>
        </ScrollReveal>
      </section>

      {/* 8. SIGNATURE & 9. PORTALS */}
      <section className="pt-32 pb-32 px-6 bg-black border-t border-neutral-900 flex flex-col items-center">
        <ScrollReveal>
          <p className="font-serif italic text-xl md:text-2xl text-neutral-400 whitespace-pre-line leading-loose max-w-lg mx-auto text-center mb-32">
            {content.signature.text}
          </p>
        </ScrollReveal>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl items-center">
          {[
            { label: content.portals.c1, id: 0, size: 'small' },
            { label: content.portals.c3, id: 2, size: 'large' },
            { label: content.portals.c2, id: 1, size: 'small' }
          ].map((btn, i) => (
            <ScrollReveal key={i} delay={i * 150} className="w-full flex justify-center">
               <button 
                onClick={() => handlePortalClick(btn.id)}
                className={`
                  group relative flex items-center justify-center border border-neutral-800 hover:border-neutral-400 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] bg-neutral-950/20 hover:bg-neutral-900/60 transition-all duration-500
                  ${btn.size === 'large' ? 'w-full min-h-[140px]' : 'w-[80%] min-h-[110px]'}
                `}
              >
                <div className="absolute inset-0 bg-neutral-900/0 group-hover:bg-neutral-800/10 transition-colors duration-500" />
                <span className={`
                  relative z-10 font-sans text-neutral-500 group-hover:text-white tracking-[0.25em] uppercase transition-colors duration-500 px-6 text-center leading-relaxed
                  ${btn.size === 'large' ? 'text-base' : 'text-xs'}
                `}>
                  {btn.label}
                </span>
              </button>
            </ScrollReveal>
          ))}
        </div>
      </section>

    </div>
  );
};

export default ManifestoScreen;
