export type Gender = 'woman' | 'man' | 'nonbinary' | 'custom';
export type SpiceLevel = 'soft' | 'medium' | 'wild';
export type AnatomyTag = 'breasts' | 'chest' | 'custom';
export type GameState = 'setup' | 'playerTurn' | 'dareDraw' | 'swipeDecision' | 'skipFlow' | 'acceptFlow' | 'actionCardHiddenDraw' | 'endgameTriggered' | 'dareRevealGrid' | 'dareFlipReveal' | 'actionCardReveal' | 'finalResult' | 'reset';

export interface Player {
  id: string;
  name: string;
  gender: Gender;
  pronouns?: string;
  anatomyTag: AnatomyTag;
  skipBank: DareCard[];
  actionCards: ActionCard[];
}

export interface DareCard {
  id: string;
  name: string;
  spiceLevel: SpiceLevel;
  category: string;
  textVariantA: string; // breast-based
  textVariantB: string; // chest-based
  direction: 'giver' | 'receiver' | 'both';
  visibility: 'private';
}

export interface ActionCard {
  id: string;
  actionId: string;
  visualStyle: 'minimal' | 'silhouette' | 'cute' | 'abstract' | 'sultry';
  description: string;
  name: string;
}

export interface GameSettings {
  deckSize: number;
  spiceLevel: SpiceLevel;
  enabledActionCategories: string[];
  actionCardStyle: ActionCard['visualStyle'];
}

export interface GameSession {
  players: [Player, Player];
  currentPlayerIndex: number;
  dareDeck: DareCard[];
  actionDeck: ActionCard[];
  usedDares: DareCard[];
  usedActions: ActionCard[];
  gameState: GameState;
  winner?: Player;
  loser?: Player;
  selectedSkipDare?: DareCard;
  matchingActionSet?: ActionCard[];
}

export interface ThemeColors {
  background: string;
  glow: string;
  accent: string;
  text: string;
  cardBg: string;
  cardBorder: string;
}