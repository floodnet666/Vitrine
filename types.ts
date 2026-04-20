
export enum ScreenType {
  DOOR = 'DOOR',
  ENTITY_EMOTIONAL = 'ENTITY_EMOTIONAL', // Isabela
  ENTITY_SENSORY = 'ENTITY_SENSORY', // Gist
  ENTITY_RATIONAL = 'ENTITY_RATIONAL', // The Council
  MIRROR = 'MIRROR',
  CTA = 'CTA',
  MANIFESTO = 'MANIFESTO',
  FUNDING = 'FUNDING'
}

export type Language = 'EN' | 'PT' | 'IT';

export type Archetype = 
  | 'OBSERVADOR_ESTRATEGICO'
  | 'CONECTOR_EMOCIONAL'
  | 'CONTROLADOR_SENSIVEL'
  | 'PREDADOR_LOGICO';

export interface Decision {
  screen: ScreenType;
  choiceId: string;
  tag: string;
}

export interface GameState {
  language: Language | null;
  path: ScreenType[];
  currentStepIndex: number;
  history: Decision[];
  archetype: Archetype | null;
}

export interface FundingContent {
  title: string;
  subtitle: string;
  mainText: string[];
  listTitle: string;
  listItems: string[];
  notListItems: string[];
  antiOpportunist: {
    title: string;
    items: string[];
    closing: string;
  };
  cta: {
    label: string;
    sub: string;
  };
  question: {
    text: string;
    buttonLabel: string;
  };
}

export interface ManifestoContent {
  intro: {
    title: string;
    sub: string;
    button: string;
  };
  reality: {
    text: string[]; // Split for spacing
  };
  tension: {
    block1: { c1: string, c2: string, c3: string };
    block2: { title: string, text: string };
    block3: { text: string[] };
  };
  entities: {
    isabela: { title: string, desc: string };
    gist: { title: string, desc: string };
    council: { title: string, desc: string };
  };
  market: {
    lines: string[];
  };
  ethics: {
    lines: string[];
  };
  prophecy: {
    p1: string;
    p2: string;
  };
  signature: {
    text: string;
  };
  portals: {
    c1: string;
    c2: string;
    c3: string;
  };
}

export interface ScreenContent {
  id: ScreenType;
  title?: string;
  text?: string;
  subText?: string;
  image?: string;
  choices: {
    id: string;
    label: string;
    tag: string; 
    nextPathModifier?: 'RATIONAL_FIRST' | 'EMOTIONAL_FIRST';
  }[];
  manifesto?: ManifestoContent;
  funding?: FundingContent;
}