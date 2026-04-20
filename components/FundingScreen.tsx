
import React, { useState } from 'react';
import { FundingContent } from '../types';
import ScrollReveal from './ScrollReveal';

interface Props {
  content: FundingContent;
}

const FundingScreen: React.FC<Props> = ({ content }) => {
  const [showQuestion, setShowQuestion] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const handleSend = () => {
    const subject = "ENTITY ORIGIN // FUNDING REQUEST";
    const body = encodeURIComponent(inputValue);
    // Use the specific email provided
    window.location.href = `mailto:thiagofloodnet@hotmail.com?subject=${encodeURIComponent(subject)}&body=${body}`;
  };

  if (showQuestion) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 max-w-2xl mx-auto text-center animate-fade-in-up">
        <div className="space-y-12 w-full">
          <p className="font-serif italic text-3xl md:text-4xl text-neutral-200 leading-relaxed">
             {content.question.text}
          </p>
          <div className="relative group">
            <textarea 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full bg-transparent border-b border-neutral-800 text-neutral-300 font-sans text-lg p-4 focus:outline-none focus:border-red-900 transition-colors h-32 resize-none"
              autoFocus
            />
            <div className="absolute bottom-0 left-0 w-full h-[1px] bg-red-900 scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left" />
          </div>
          <div className="flex flex-col items-center gap-4">
            <button 
              onClick={handleSend}
              className="font-sans text-xs tracking-[0.3em] uppercase text-neutral-500 hover:text-red-500 transition-colors py-4 px-8 border border-transparent hover:border-neutral-900 rounded-sm"
            >
              {content.question.buttonLabel}
            </button>
            <p className="text-[10px] text-neutral-700 tracking-[0.2em] uppercase">
              System Listening
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-6 py-24 text-neutral-300">
      
      {/* Title Block */}
      <section className="text-center mb-24">
        <ScrollReveal>
          <h1 className="font-serif text-5xl md:text-7xl mb-4 text-white">{content.title}</h1>
        </ScrollReveal>
        <ScrollReveal delay={200}>
          <p className="font-sans text-red-500 uppercase tracking-[0.4em] text-sm">{content.subtitle}</p>
        </ScrollReveal>
      </section>

      {/* Main Text */}
      <section className="space-y-8 mb-24 text-center md:text-left">
        {content.mainText.map((line, i) => (
          <ScrollReveal key={i} delay={i * 100}>
            <p className={`text-lg md:text-2xl leading-relaxed ${line.startsWith('Financiar') ? 'text-white font-serif italic mt-8' : 'text-neutral-400'}`}>
              {line}
            </p>
          </ScrollReveal>
        ))}
      </section>

      {/* Two Columns List */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-24">
        {/* Positive List */}
        <ScrollReveal>
          <h3 className="font-sans text-xs tracking-[0.3em] uppercase text-neutral-500 mb-8 border-b border-neutral-900 pb-4">
            {content.listTitle}
          </h3>
          <ul className="space-y-6">
            {content.listItems.map((item, i) => (
              <li key={i} className="flex items-start gap-4">
                <span className="w-1.5 h-1.5 rounded-full bg-red-900 mt-2" />
                <span className="font-serif italic text-xl text-neutral-200">{item}</span>
              </li>
            ))}
          </ul>
        </ScrollReveal>

        {/* Negative List */}
        <ScrollReveal delay={200}>
           <h3 className="font-sans text-xs tracking-[0.3em] uppercase text-neutral-600 mb-8 border-b border-neutral-900 pb-4 opacity-70">
            NOT INCLUDED
          </h3>
          <ul className="space-y-6 opacity-60">
            {content.notListItems.map((item, i) => (
              <li key={i} className="flex items-start gap-4">
                <span className="w-1.5 h-1.5 rounded-full bg-neutral-800 mt-2" />
                <span className="font-sans text-lg text-neutral-400 line-through decoration-neutral-800">{item}</span>
              </li>
            ))}
          </ul>
        </ScrollReveal>
      </section>

      {/* Anti-Opportunist */}
      <section className="mb-24 text-center border p-8 md:p-12 border-neutral-900 bg-neutral-950/30">
        <ScrollReveal>
          <p className="font-sans text-sm tracking-[0.2em] text-neutral-500 mb-6">{content.antiOpportunist.title}</p>
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {content.antiOpportunist.items.map((item, i) => (
              <span key={i} className="font-serif italic text-neutral-400 text-xl md:text-2xl">
                {item}{i < content.antiOpportunist.items.length - 1 ? ',' : ''}
              </span>
            ))}
          </div>
          <p className="font-sans font-bold text-red-900 uppercase tracking-widest">{content.antiOpportunist.closing}</p>
        </ScrollReveal>
      </section>

      {/* CTA */}
      <section className="text-center pb-24">
        <ScrollReveal>
          <button 
            onClick={() => setShowQuestion(true)}
            className="group relative px-12 py-6 bg-red-950/20 hover:bg-red-900/30 border border-red-900/50 hover:border-red-800 transition-all duration-500"
          >
            <span className="block font-sans text-red-100 text-xl tracking-[0.25em] uppercase mb-2 relative z-10">
              {content.cta.label}
            </span>
            <span className="block font-serif italic text-neutral-500 text-sm relative z-10 group-hover:text-red-300 transition-colors">
              {content.cta.sub}
            </span>
            <div className="absolute inset-0 bg-red-900/5 blur-xl group-hover:bg-red-900/10 transition-colors duration-500" />
          </button>
        </ScrollReveal>
      </section>

    </div>
  );
};

export default FundingScreen;