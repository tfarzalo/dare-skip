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
  advanceToNextRound: () => boolean;
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
    // Filter dares by starting spice level for initial round
    const filteredDares = filterDaresBySpiceLevel(dareCards, settings.spiceLevel);
    const filteredActions = filterActionsByCategories(actionCards, settings.enabledActionCategories);
    
    // Shuffle and select cards for first round (10 cards)
    const shuffledDares = shuffleArray(filteredDares);
    const selectedDares = shuffledDares.slice(0, 10); // Always start with 10 cards
    const shuffledActions = shuffleArray(filteredActions);

    // Calculate total rounds based on all 68 dares across 6 levels
    const totalRounds = 6; // 6 rounds of spiciness progression
    const cardsPerRound = 10; // 10-12 cards per round

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
      gameState: 'playerTurn',
      currentRound: 1,
      totalRounds,
      cardsPerRound,
      currentSpiceLevel: settings.spiceLevel
    };

    set({ gameSession, gameSettings: settings });
  },

  drawDareCard: () => {
    const { gameSession, advanceToNextRound } = get();
    if (!gameSession) {
      console.log('No game session available');
      return null;
    }

    // If current round deck is empty, try to advance to next round
    if (gameSession.dareDeck.length === 0) {
      console.log(`Round ${gameSession.currentRound} completed, advancing to next round`);
      const advanced = advanceToNextRound();
      
      if (!advanced) {
        console.log('No more rounds available, game completed');
        return null;
      }
      
      // Get the updated session after advancing
      const updatedSession = get().gameSession!;
      
      // Now draw from the new round's deck
      if (updatedSession.dareDeck.length === 0) {
        console.log('New round has no cards available');
        return null;
      }
      
      // Get a random card from the new round's deck
      const randomIndex = Math.floor(Math.random() * updatedSession.dareDeck.length);
      const drawnCard = updatedSession.dareDeck[randomIndex];
      const remainingDeck = updatedSession.dareDeck.filter((_, index) => index !== randomIndex);
      
      console.log(`Drew dare card from round ${updatedSession.currentRound}:`, drawnCard.name, 'Remaining:', remainingDeck.length);
      
      const finalUpdatedSession = {
        ...updatedSession,
        dareDeck: remainingDeck,
        usedDares: [...updatedSession.usedDares, drawnCard]
      };

      set({ gameSession: finalUpdatedSession });
      return drawnCard;
    }

    // Get a random card from the remaining deck
    const randomIndex = Math.floor(Math.random() * gameSession.dareDeck.length);
    const drawnCard = gameSession.dareDeck[randomIndex];
    const remainingDeck = gameSession.dareDeck.filter((_, index) => index !== randomIndex);
    
    console.log(`Drew dare card from round ${gameSession.currentRound}:`, drawnCard.name, 'Remaining:', remainingDeck.length);
    
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
  },

  advanceToNextRound: () => {
    const { gameSession, gameSettings } = get();
    if (!gameSession) return false;

    const nextRound = gameSession.currentRound + 1;
    
    // Check if we've completed all rounds
    if (nextRound > gameSession.totalRounds) {
      console.log('All rounds completed! Game finished.');
      return false;
    }

    // Determine next spiciness level based on round progression
    let nextSpiceLevel: SpiceLevel;
    if (nextRound <= 2) {
      nextSpiceLevel = 'soft';
    } else if (nextRound <= 4) {
      nextSpiceLevel = 'medium';
    } else {
      nextSpiceLevel = 'wild';
    }

    console.log(`Advancing to round ${nextRound} with spiciness level: ${nextSpiceLevel}`);

    // Filter dares for the new spiciness level
    const filteredDares = filterDaresBySpiceLevel(dareCards, nextSpiceLevel);
    
    // Remove already used dares from the pool
    const availableDares = filteredDares.filter(dare => 
      !gameSession.usedDares.some(used => used.id === dare.id)
    );

    // Calculate how many cards to include in this round
    // For rounds 1-5: use 10 cards each, for round 6: use remaining cards
    let cardsForThisRound: number;
    if (nextRound < 6) {
      cardsForThisRound = Math.min(10, availableDares.length);
    } else {
      // Last round - use all remaining cards of this level, up to a reasonable amount
      cardsForThisRound = Math.min(12, availableDares.length);
    }

    // If we don't have enough unused cards, include some from the full pool
    let daresForNewRound: DareCard[];
    if (availableDares.length >= cardsForThisRound) {
      daresForNewRound = availableDares.slice(0, cardsForThisRound);
    } else {
      // Mix available and some from the full pool to ensure we have cards
      const fromAvailable = availableDares;
      const neededFromPool = cardsForThisRound - availableDares.length;
      const fromPool = filteredDares
        .filter(dare => !availableDares.some(available => available.id === dare.id))
        .slice(0, neededFromPool);
      daresForNewRound = [...fromAvailable, ...fromPool];
    }

    // Shuffle the new deck
    const shuffledNewDeck = shuffleArray(daresForNewRound);

    const updatedSession = {
      ...gameSession,
      currentRound: nextRound,
      currentSpiceLevel: nextSpiceLevel,
      dareDeck: shuffledNewDeck,
      gameState: 'playerTurn' as GameState
    };

    set({ gameSession: updatedSession });
    return true;
  }
}));