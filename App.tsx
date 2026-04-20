
import React, { useState, useMemo } from 'react';
import Atmosphere from './components/Atmosphere';
import FadeIn from './components/FadeIn';
import DecisionButton from './components/DecisionButton';
import ManifestoScreen from './components/ManifestoScreen';
import FundingScreen from './components/FundingScreen';
import { 
  getContent, 
  PATH_RATIONAL_FIRST, 
  PATH_EMOTIONAL_FIRST, 
  calculateArchetype,
  getArchetypeCTA 
} from './constants';
import { ScreenType, Decision, GameState, Language } from './types';

// Icons
const IconEye = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="opacity-50">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    language: null,
    path: PATH_RATIONAL_FIRST, // Default, will change if user chooses Emotion first
    currentStepIndex: 0,
    history: [],
    archetype: null,
  });

  const [isTransitioning, setIsTransitioning] = useState(false);

  // If no language selected, user is at step -1 essentially
  const hasLanguage = !!gameState.language;
  const currentScreenType = gameState.path[gameState.currentStepIndex];
  
  // Safe access to content only if language is set
  const content = hasLanguage ? getContent(gameState.language!)[currentScreenType] : null;

  const handleLanguageSelect = (lang: Language) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setGameState(prev => ({ ...prev, language: lang }));
      setIsTransitioning(false);
    }, 800);
  };

  const handleDecision = (choiceId: string, tag: string, nextPathModifier?: 'RATIONAL_FIRST' | 'EMOTIONAL_FIRST') => {
    setIsTransitioning(true);

    setTimeout(() => {
      setGameState(prev => {
        const newHistory = [...prev.history, { screen: currentScreenType, choiceId, tag }];
        
        let newPath = prev.path;
        // Dynamic path switching based on the first door
        if (currentScreenType === ScreenType.DOOR && nextPathModifier) {
          newPath = nextPathModifier === 'RATIONAL_FIRST' ? PATH_RATIONAL_FIRST : PATH_EMOTIONAL_FIRST;
        }

        // Calculate archetype if we are hitting the mirror
        let newArchetype = prev.archetype;
        const nextIndex = prev.currentStepIndex + 1;
        const nextScreen = newPath[nextIndex];

        if (nextScreen === ScreenType.CTA) {
           newArchetype = calculateArchetype(newHistory);
        }

        return {
          ...prev,
          path: newPath,
          currentStepIndex: nextIndex,
          history: newHistory,
          archetype: newArchetype
        };
      });
      setIsTransitioning(false);
    }, 1000); // Slow transition for ritual feel
  };

  const handleUnlockManifesto = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setGameState(prev => {
        // We append Manifesto to path dynamically if not already there
        const newPath = [...prev.path];
        if (newPath[newPath.length - 1] !== ScreenType.MANIFESTO) {
          newPath.push(ScreenType.MANIFESTO);
        }
        return {
          ...prev,
          path: newPath,
          currentStepIndex: newPath.indexOf(ScreenType.MANIFESTO)
        };
      });
      setIsTransitioning(false);
    }, 2000); // Longer transition for effect
  };

  const handleNavigate = (target: string) => {
    if (target === 'FUNDING') {
      setIsTransitioning(true);
      setTimeout(() => {
        setGameState(prev => {
          const newPath = [...prev.path];
          if (newPath[newPath.length - 1] !== ScreenType.FUNDING) {
            newPath.push(ScreenType.FUNDING);
          }
          return {
            ...prev,
            path: newPath,
            currentStepIndex: newPath.indexOf(ScreenType.FUNDING)
          };
        });
        setIsTransitioning(false);
      }, 1000);
    }
  };

  // Determine background class for subtle shifts
  const bgClass = useMemo(() => {
    if (!hasLanguage) return 'bg-black';
    switch(currentScreenType) {
      case ScreenType.ENTITY_EMOTIONAL: return 'bg-[#0a0505]';
      case ScreenType.ENTITY_SENSORY: return 'bg-[#05050a]';
      case ScreenType.ENTITY_RATIONAL: return 'bg-[#050a05]';
      case ScreenType.CTA: return 'bg-[#0e0000]';
      case ScreenType.MANIFESTO: return 'bg-black'; // Pure black for manifesto
      case ScreenType.FUNDING: return 'bg-black';
      default: return 'bg-black';
    }
  }, [currentScreenType, hasLanguage]);

  // Render Logic
  const renderScreen = () => {
    // 0. Language Selection
    if (!gameState.language) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center max-w-xl mx-auto px-6">
           <FadeIn delay={200} className="mb-12">
             <div className="flex flex-col gap-2">
               <span className="font-sans text-[10px] tracking-[0.4em] text-neutral-600 uppercase">System Initializing</span>
               <h2 className="font-serif text-2xl text-neutral-300 tracking-wider">SELECT PROTOCOL</h2>
             </div>
           </FadeIn>

           <div className="flex flex-col gap-4 w-full max-w-xs">
              <FadeIn delay={400}>
                <DecisionButton onClick={() => handleLanguageSelect('EN')} variant="ghost">ENGLISH</DecisionButton>
              </FadeIn>
              <FadeIn delay={500}>
                <DecisionButton onClick={() => handleLanguageSelect('PT')} variant="ghost">PORTUGUÊS</DecisionButton>
              </FadeIn>
              <FadeIn delay={600}>
                <DecisionButton onClick={() => handleLanguageSelect('IT')} variant="ghost">ITALIANO</DecisionButton>
              </FadeIn>
           </div>
        </div>
      );
    }

    if (!content) return null;

    // 4. Funding Screen
    if (currentScreenType === ScreenType.FUNDING && content.funding) {
      return <FundingScreen content={content.funding} />;
    }

    // 4. Manifesto Screen (Secret) - New Implementation
    if (currentScreenType === ScreenType.MANIFESTO && content.manifesto) {
      return <ManifestoScreen content={content.manifesto} onNavigate={handleNavigate} />;
    }

    // 1. CTA Screen (Final Verdict)
    if (currentScreenType === ScreenType.CTA && gameState.archetype) {
      const result = getArchetypeCTA(gameState.language!)[gameState.archetype];
      return (
        <div className="flex flex-col items-center justify-center h-full text-center max-w-2xl mx-auto px-6">
          <FadeIn delay={200} className="mb-8">
            <span className="font-sans text-xs tracking-[0.4em] text-red-900/70 uppercase">Archetype Defined</span>
          </FadeIn>
          
          <FadeIn delay={600}>
            <h1 className="font-serif text-4xl md:text-6xl text-neutral-200 mb-6 tracking-wide leading-tight uppercase">
              {result.name}
            </h1>
          </FadeIn>

          <FadeIn delay={1200} className="mb-12">
            <p className="font-sans text-neutral-500 tracking-wider text-sm md:text-base max-w-md mx-auto leading-relaxed">
              {result.text}
              <br />
              <span className="text-neutral-700 mt-2 block italic serif">{result.sub}</span>
            </p>
          </FadeIn>

          <FadeIn delay={2000}>
            <DecisionButton onClick={() => handleUnlockManifesto()} variant="primary">
              {result.action}
            </DecisionButton>
          </FadeIn>

           <FadeIn delay={3000} className="mt-24 opacity-30">
            <p className="font-serif italic text-neutral-600 text-sm">
              "{result.footer}"
            </p>
          </FadeIn>
        </div>
      );
    }

    // 2. Mirror Screen (Processing)
    if (currentScreenType === ScreenType.MIRROR) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center max-w-xl mx-auto px-6">
           <FadeIn delay={200} className="mb-8 opacity-50 animate-breathe">
             <div className="w-px h-24 bg-gradient-to-b from-transparent via-neutral-500 to-transparent mx-auto" />
           </FadeIn>
           
           <FadeIn delay={500}>
             <h2 className="font-serif text-3xl md:text-4xl text-neutral-300 mb-8 leading-relaxed">
               {content.text}
             </h2>
           </FadeIn>

           <div className="flex flex-col gap-4 mt-12">
             {content.choices.map((choice, idx) => (
                <FadeIn key={choice.id} delay={1500 + (idx * 200)}>
                  <DecisionButton 
                    onClick={() => handleDecision(choice.id, choice.tag, choice.nextPathModifier)}
                  >
                    {choice.label}
                  </DecisionButton>
                </FadeIn>
             ))}
           </div>
        </div>
      );
    }

    // 3. Standard Choice Screens (Door & Entities)
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 h-full w-full">
        {/* Visual Column */}
        <div className="relative hidden lg:flex items-center justify-center overflow-hidden border-r border-neutral-900/50">
           {content.image && (
             <div className="absolute inset-0 z-0">
               <img 
                 src={content.image} 
                 alt="Atmosphere" 
                 className="w-full h-full object-cover opacity-20 scale-105 animate-[pulse_8s_ease-in-out_infinite]" 
               />
               <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-black" />
             </div>
           )}
           <div className="relative z-10 p-12">
             <FadeIn delay={200}>
               {content.title && (
                 <h3 className="font-sans text-xs tracking-[0.5em] text-neutral-500 mb-4 ml-1">
                   {content.title}
                 </h3>
               )}
             </FadeIn>
           </div>
        </div>

        {/* Interaction Column */}
        <div className="flex flex-col justify-center px-8 md:px-20 py-12 relative z-20">
          <FadeIn delay={400}>
             <h1 className="font-serif text-3xl md:text-5xl text-neutral-200 mb-6 leading-tight">
               {content.text}
             </h1>
          </FadeIn>

          {content.subText && (
            <FadeIn delay={600}>
              <p className="font-sans text-neutral-500 text-sm tracking-widest uppercase mb-12 border-l border-neutral-800 pl-4">
                {content.subText}
              </p>
            </FadeIn>
          )}

          <div className="flex flex-col gap-6 items-start">
            {content.choices.map((choice, idx) => (
              <FadeIn key={choice.id} delay={800 + (idx * 200)} className="w-full max-w-sm">
                <DecisionButton 
                  onClick={() => handleDecision(choice.id, choice.tag, choice.nextPathModifier)}
                >
                  {choice.label}
                </DecisionButton>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`min-h-screen w-full relative transition-colors duration-[2000ms] overflow-hidden ${bgClass}`}>
      <Atmosphere />
      
      {/* Top Bar */}
      <div className="fixed top-0 left-0 w-full p-6 flex justify-between items-center z-50 pointer-events-none mix-blend-difference">
        <span className="font-sans text-[10px] tracking-[0.3em] text-neutral-400">SESSION: {Date.now().toString().slice(-6)}</span>
        <IconEye />
      </div>

      {/* Main Stage */}
      <main className={`h-screen w-full transition-opacity duration-1000 ${isTransitioning ? 'opacity-0 blur-sm' : 'opacity-100 blur-0'} ${currentScreenType === ScreenType.MANIFESTO || currentScreenType === ScreenType.FUNDING ? 'overflow-y-auto overflow-x-hidden' : 'overflow-hidden'}`}>
        {renderScreen()}
      </main>

      {/* Progress Indicator (Subtle) */}
      <div className="fixed bottom-0 left-0 w-full h-1 bg-neutral-900 z-50">
        <div 
          className="h-full bg-neutral-700 transition-all duration-1000 ease-out"
          style={{ width: `${((gameState.currentStepIndex + 1) / gameState.path.length) * 100}%` }}
        />
      </div>
    </div>
  );
};

export default App;
