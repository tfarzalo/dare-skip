import { create } from 'zustand';
import { GameSession, GameSettings, Player, DareCard, ActionCard, GameState, SpiceLevel } from '../types/game';
import { dareCards } from '../data/dareCards';
import { actionCards } from '../data/actionCards';

interface GameStore {
  gameSession: GameSession | null;
  gameSettings: GameSettings;
  
  // Actions
  initializeGame: (players: [Player, Player], settings: GameSettings) => void;
  drawDareCard: () => DareCard | null;
  acceptDare: () => void;
  skipDare: () => ActionCard | null;
  drawActionCard: () => ActionCard | null;
  checkEndgameCondition: () => { winner: Player; loser: Player } | null;
  selectSkipDare: (dare: DareCard) => void;
  nextTurn: () => void;
  resetGame: () => void;
  setGameState: (state: GameState) => void;
}

const createInitialSettings = (): GameSettings => ({
  deckSize: 10,
  spiceLevel: 'soft',
  enabledActionCategories: ['touch', 'kiss', 'sensation', 'intimacy', 'communication'],
  actionCardStyle: 'sultry'
});

const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const filterDaresBySpiceLevel = (dares: DareCard[], level: GameSettings['spiceLevel']): DareCard[] => {
  if (level === 'soft') {
    return dares.filter(dare => dare.spiceLevel === 'soft');
  } else if (level === 'medium') {
    return dares.filter(dare => dare.spiceLevel === 'soft' || dare.spiceLevel === 'medium');
  }
  return dares; // wild includes all
};

export const useGameStore = create<GameStore>((set, get) => ({
  gameSession: null,
  gameSettings: createInitialSettings(),

  initializeGame: (players, settings) => {
    const filteredDares = filterDaresBySpiceLevel(dareCards, settings.spiceLevel);
    const selectedDares = shuffleArray(filteredDares).slice(0, settings.deckSize);
    const shuffledActionCards = shuffleArray(actionCards);

    const gameSession: GameSession = {
      players: [
        { ...players[0], skipBank: [], actionCards: [] },
        { ...players[1], skipBank: [], actionCards: [] }
      ] as [Player, Player],
      currentPlayerIndex: 0,
      dareDeck: selectedDares,
      actionDeck: shuffledActionCards,
      usedDares: [],
      usedActions: [],
      gameState: 'playerTurn'
    };

    set({ gameSession, gameSettings: settings });
  },

  drawDareCard: () => {
    const { gameSession } = get();
    if (!gameSession || gameSession.dareDeck.length === 0) return null;

    const [drawnCard, ...remainingDeck] = gameSession.dareDeck;
    const updatedSession = {
      ...gameSession,
      dareDeck: remainingDeck,
      usedDares: [...gameSession.usedDares, drawnCard],
      gameState: 'dareDraw' as GameState
    };

    set({ gameSession: updatedSession });
    return drawnCard;
  },

  acceptDare: () => {
    const { gameSession } = get();
    if (!gameSession) return;

    const updatedSession = {
      ...gameSession,
      gameState: 'acceptFlow' as GameState
    };

    set({ gameSession: updatedSession });
    
    // Move to next turn after a delay
    setTimeout(() => {
      get().nextTurn();
    }, 1000);
  },

  skipDare: () => {
    const { gameSession } = get();
    if (!gameSession) return null;

    const currentPlayer = gameSession.players[gameSession.currentPlayerIndex];
    const lastDrawnDare = gameSession.usedDares[gameSession.usedDares.length - 1];

    if (!lastDrawnDare) return null;

    // Add dare to skip bank
    const updatedPlayers = [...gameSession.players];
    updatedPlayers[gameSession.currentPlayerIndex] = {
      ...currentPlayer,
      skipBank: [...currentPlayer.skipBank, lastDrawnDare]
    };

    const updatedSession = {
      ...gameSession,
      players: updatedPlayers as [Player, Player],
      gameState: 'skipFlow' as GameState
    };

    set({ gameSession: updatedSession });

    // Draw action card
    return get().drawActionCard();
  },

  drawActionCard: () => {
    const { gameSession } = get();
    if (!gameSession || gameSession.actionDeck.length === 0) return null;

    const [drawnCard, ...remainingDeck] = gameSession.actionDeck;
    const currentPlayer = gameSession.players[gameSession.currentPlayerIndex];

    // Add action card to player's collection
    const updatedPlayers = [...gameSession.players];
    updatedPlayers[gameSession.currentPlayerIndex] = {
      ...currentPlayer,
      actionCards: [...currentPlayer.actionCards, drawnCard]
    };

    const updatedSession = {
      ...gameSession,
      players: updatedPlayers as [Player, Player],
      actionDeck: remainingDeck,
      usedActions: [...gameSession.usedActions, drawnCard],
      gameState: 'actionCardHiddenDraw' as GameState
    };

    set({ gameSession: updatedSession });

    // Check for endgame condition
    setTimeout(() => {
      const endgameResult = get().checkEndgameCondition();
      if (endgameResult) {
        const updatedSessionWithWinner = {
          ...get().gameSession!,
          winner: endgameResult.winner,
          loser: endgameResult.loser,
          gameState: 'endgameTriggered' as GameState
        };
        set({ gameSession: updatedSessionWithWinner });
      } else {
        get().nextTurn();
      }
    }, 1500);

    return drawnCard;
  },

  checkEndgameCondition: () => {
    const { gameSession } = get();
    if (!gameSession) return null;

    const currentPlayer = gameSession.players[gameSession.currentPlayerIndex];
    const actionGroups = currentPlayer.actionCards.reduce((acc, card) => {
      acc[card.actionId] = (acc[card.actionId] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const matchingSet = Object.entries(actionGroups).find(([_, count]) => count >= 3);
    
    if (matchingSet) {
      const [actionId] = matchingSet;
      const matchingCards = currentPlayer.actionCards.filter(card => card.actionId === actionId);
      const winnerIndex = gameSession.currentPlayerIndex === 0 ? 1 : 0;
      
      return {
        winner: gameSession.players[winnerIndex],
        loser: currentPlayer
      };
    }

    return null;
  },

  selectSkipDare: (dare) => {
    const { gameSession } = get();
    if (!gameSession) return;

    const updatedSession = {
      ...gameSession,
      selectedSkipDare: dare,
      gameState: 'dareFlipReveal' as GameState
    };

    set({ gameSession: updatedSession });
  },

  nextTurn: () => {
    const { gameSession } = get();
    if (!gameSession) return;

    const nextPlayerIndex = gameSession.currentPlayerIndex === 0 ? 1 : 0;
    const updatedSession = {
      ...gameSession,
      currentPlayerIndex: nextPlayerIndex,
      gameState: 'playerTurn' as GameState
    };

    set({ gameSession: updatedSession });
  },

  resetGame: () => {
    set({ gameSession: null });
  },

  setGameState: (state) => {
    const { gameSession } = get();
    if (!gameSession) return;

    set({
      gameSession: {
        ...gameSession,
        gameState: state
      }
    });
  }
}));