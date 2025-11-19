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
  continueToNextTurn: () => void;
  confirmCompletion: () => void;
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

const filterActionsByCategories = (actions: ActionCard[], categories: string[]): ActionCard[] => {
  return actions.filter(action => {
    // Extract category from actionId (e.g., 'touch-kiss-chest' -> 'touch')
    const category = action.actionId.split('-')[0];
    return categories.includes(category);
  });
};

export const useGameStore = create<GameStore>((set, get) => ({
  gameSession: null,
  gameSettings: createInitialSettings(),

  initializeGame: (players, settings) => {
    const filteredDares = filterDaresBySpiceLevel(dareCards, settings.spiceLevel);
    const filteredActions = filterActionsByCategories(actionCards, settings.enabledActionCategories);
    
    // Shuffle and select cards
    const shuffledDares = shuffleArray(filteredDares);
    const selectedDares = shuffledDares.slice(0, settings.deckSize);
    const shuffledActions = shuffleArray(filteredActions);

    const gameSession: GameSession = {
      players: [
        { ...players[0], skipBank: [], actionCards: [] },
        { ...players[1], skipBank: [], actionCards: [] }
      ] as [Player, Player],
      currentPlayerIndex: Math.random() > 0.5 ? 0 : 1, // Random starting player
      dareDeck: selectedDares,
      actionDeck: shuffledActions,
      usedDares: [],
      usedActions: [],
      gameState: 'playerTurn'
    };

    set({ gameSession, gameSettings: settings });
  },

  drawDareCard: () => {
    const { gameSession } = get();
    if (!gameSession || gameSession.dareDeck.length === 0) {
      console.log('No dare cards available');
      return null;
    }

    // Get a random card from the remaining deck
    const randomIndex = Math.floor(Math.random() * gameSession.dareDeck.length);
    const drawnCard = gameSession.dareDeck[randomIndex];
    const remainingDeck = gameSession.dareDeck.filter((_, index) => index !== randomIndex);
    
    console.log('Drew dare card:', drawnCard.name, 'Remaining:', remainingDeck.length);
    
    // Keep game state as playerTurn - don't change state here
    const updatedSession = {
      ...gameSession,
      dareDeck: remainingDeck,
      usedDares: [...gameSession.usedDares, drawnCard]
    };

    set({ gameSession: updatedSession });
    return drawnCard;
  },

  acceptDare: () => {
    const { gameSession } = get();
    if (!gameSession) return;

    console.log('Dare accepted by player:', gameSession.currentPlayerIndex);
    
    // Move to confirmation screen instead of continue screen
    const updatedSession = {
      ...gameSession,
      gameState: 'awaitingConfirmation' as GameState
    };

    set({ gameSession: updatedSession });
  },

  skipDare: () => {
    const { gameSession } = get();
    if (!gameSession) return null;

    const currentPlayer = gameSession.players[gameSession.currentPlayerIndex];
    const lastDrawnDare = gameSession.usedDares[gameSession.usedDares.length - 1];

    if (!lastDrawnDare) return null;

    console.log('Dare skipped by player:', gameSession.currentPlayerIndex);

    // Add dare to skip bank
    const updatedPlayers = [...gameSession.players];
    updatedPlayers[gameSession.currentPlayerIndex] = {
      ...currentPlayer,
      skipBank: [...currentPlayer.skipBank, lastDrawnDare]
    };

    // Draw action card immediately
    const actionCard = get().drawActionCard();
    
    // Move to confirmation screen instead of continue screen
    const updatedSession = {
      ...gameSession,
      players: updatedPlayers as [Player, Player],
      gameState: 'awaitingConfirmation' as GameState
    };

    set({ gameSession: updatedSession });
    
    return actionCard;
  },

  drawActionCard: () => {
    const { gameSession } = get();
    if (!gameSession || gameSession.actionDeck.length === 0) {
      console.log('No action cards available');
      return null;
    }

    // Get a random card from the remaining deck
    const randomIndex = Math.floor(Math.random() * gameSession.actionDeck.length);
    const drawnCard = gameSession.actionDeck[randomIndex];
    const remainingDeck = gameSession.actionDeck.filter((_, index) => index !== randomIndex);
    
    const currentPlayer = gameSession.players[gameSession.currentPlayerIndex];
    
    console.log('Drew action card:', drawnCard.name, 'for player:', gameSession.currentPlayerIndex);

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
      usedActions: [...gameSession.usedActions, drawnCard]
    };

    set({ gameSession: updatedSession });
    
    // Check for endgame condition immediately
    const endgameResult = get().checkEndgameCondition();
    if (endgameResult) {
      console.log('Endgame triggered! Winner:', endgameResult.winner.name, 'Loser:', endgameResult.loser.name);
      const updatedSessionWithWinner = {
        ...get().gameSession!,
        winner: endgameResult.winner,
        loser: endgameResult.loser,
        gameState: 'endgameTriggered' as GameState
      };
      set({ gameSession: updatedSessionWithWinner });
    }

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
    
    // Log the turn change for debugging
    console.log(`Turn changed: Player ${gameSession.currentPlayerIndex} -> Player ${nextPlayerIndex}`);
    console.log('New game state: playerTurn');
  },

  continueToNextTurn: () => {
    const { gameSession } = get();
    if (!gameSession) return;

    console.log('Continuing to next turn from continue screen');
    
    // Check for endgame condition first
    const endgameResult = get().checkEndgameCondition();
    if (endgameResult) {
      console.log('Endgame triggered from continue screen! Winner:', endgameResult.winner.name, 'Loser:', endgameResult.loser.name);
      const updatedSessionWithWinner = {
        ...gameSession,
        winner: endgameResult.winner,
        loser: endgameResult.loser,
        gameState: 'endgameTriggered' as GameState
      };
      set({ gameSession: updatedSessionWithWinner });
    } else {
      // Simply move to next turn from continue screen
      get().nextTurn();
    }
  },

  confirmCompletion: () => {
    const { gameSession } = get();
    if (!gameSession) return;

    console.log('Confirming completion and moving to continue screen');
    
    // Check for endgame condition first
    const endgameResult = get().checkEndgameCondition();
    if (endgameResult) {
      console.log('Endgame triggered from confirmation! Winner:', endgameResult.winner.name, 'Loser:', endgameResult.loser.name);
      const updatedSessionWithWinner = {
        ...gameSession,
        winner: endgameResult.winner,
        loser: endgameResult.loser,
        gameState: 'endgameTriggered' as GameState
      };
      set({ gameSession: updatedSessionWithWinner });
    } else {
      // Move to continue screen
      const updatedSession = {
        ...gameSession,
        gameState: 'continueScreen' as GameState
      };
      set({ gameSession: updatedSession });
    }
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