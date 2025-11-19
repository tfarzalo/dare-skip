import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useAnimation, PanInfo } from 'framer-motion';
import { useGesture } from '@use-gesture/react';
import { ArrowLeft, ArrowRight, Sparkles, Eye, EyeOff, LogOut, Play } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { themes, animations } from '../styles/themes';
import { toast } from 'sonner';

export default function GamePlay() {
  const navigate = useNavigate();
  const { gameSession, drawDareCard, acceptDare, skipDare, setGameState, continueToNextTurn, confirmCompletion } = useGameStore();
  const [currentDare, setCurrentDare] = useState<any>(null);
  const [showDare, setShowDare] = useState(false);
  const controls = useAnimation();

  useEffect(() => {
    if (!gameSession) {
      navigate('/setup');
      return;
    }

    console.log('GamePlay useEffect triggered - State:', gameSession.gameState, 'Player:', gameSession.currentPlayerIndex);
    console.log('Current dare:', currentDare, 'Show dare:', showDare);

    // Handle endgame state
    if (gameSession.gameState === 'endgameTriggered') {
      console.log('Endgame triggered, navigating to endgame');
      navigate('/endgame');
      return;
    }

    // Start new turn when entering playerTurn state
    if (gameSession.gameState === 'playerTurn') {
      console.log('Game state is playerTurn, starting new turn');
      startNewTurn();
    }
  }, [gameSession?.gameState, navigate]);

  const startNewTurn = async () => {
    console.log('=== STARTING NEW TURN ===');
    console.log('Starting new turn for player:', gameSession.currentPlayerIndex);
    console.log('Current game state:', gameSession.gameState);
    console.log('Current round:', gameSession.currentRound);
    console.log('Current spiciness level:', gameSession.currentSpiceLevel);
    console.log('Dare deck remaining:', gameSession.dareDeck.length);
    console.log('Show dare before reset:', showDare);
    console.log('Current dare before reset:', currentDare);
    
    // Check if this is a new round starting
    if (gameSession.dareDeck.length === 0 && gameSession.currentRound < gameSession.totalRounds) {
      toast.success(`Round ${gameSession.currentRound + 1} Starting - ${gameSession.currentSpiceLevel} Level!`, {
        duration: 3000,
        position: 'top-center'
      });
    }
    
    // Reset component state
    setShowDare(false);
    setCurrentDare(null);
    
    // Reset animation controls to center position
    await controls.start({ 
      x: 0, 
      rotate: 0, 
      opacity: 1, 
      transition: { duration: 0 } 
    });
    
    console.log('About to draw dare card...');
    const dare = drawDareCard();
    console.log('Drew dare card:', dare);
    
    if (dare) {
      console.log('Setting current dare and showing card');
      setCurrentDare(dare);
      setShowDare(true);
      console.log('=== DARE CARD SUCCESSFULLY SHOWN ===');
    } else {
      console.log('=== NO MORE DARE CARDS, ENDING GAME ===');
      // No more dares, trigger endgame
      setGameState('endgameTriggered');
      navigate('/endgame');
    }
  };

  const handleSwipe = async (direction: 'left' | 'right') => {
    if (!currentDare || !gameSession) return;

    console.log('Handle swipe:', direction, 'for player:', gameSession.currentPlayerIndex);

    if (direction === 'left') {
      // Accept dare
      await controls.start(animations.cardSwipe.accept);
      toast.success('Dare accepted!');
      acceptDare();
    } else {
      // Skip dare
      await controls.start(animations.cardSwipe.skip);
      toast.info('Dare skipped - added to skip bank!');
      skipDare();
    }
    
    // Reset component state (the game state change will trigger the next turn)
    setShowDare(false);
    setCurrentDare(null);
  };

  const bind = useGesture({
    onDrag: ({ offset: [x], direction: [dx], velocity, active }) => {
      if (!active) {
        // Determine swipe direction
        if (Math.abs(x) > 100 && velocity[0] > 0.5) {
          if (dx < 0) {
            handleSwipe('left');
          } else {
            handleSwipe('right');
          }
        } else {
          // Snap back to center
          controls.start({ x: 0, rotate: 0, transition: { type: 'spring' } });
        }
      } else {
        // Follow finger
        const rotation = x * 0.1;
        controls.start({ x, rotate: rotation });
      }
    }
  }) as any;

  const currentPlayer = gameSession?.players[gameSession.currentPlayerIndex];
  const currentTheme = currentPlayer ? themes[currentPlayer.gender] : themes.custom;
  const otherPlayer = gameSession?.players[gameSession.currentPlayerIndex === 0 ? 1 : 0];

  const getDareText = (dare: any) => {
    if (!currentPlayer || !otherPlayer) return dare.textVariantA;
    
    // Determine which variant to use based on current player's anatomy preference
    const isPlayer1Turn = gameSession.currentPlayerIndex === 0;
    const targetPlayer = dare.direction === 'giver' ? otherPlayer : currentPlayer;
    
    let text = dare.textVariantA;
    if (targetPlayer.anatomyTag === 'breasts') {
      text = dare.textVariantA;
    } else if (targetPlayer.anatomyTag === 'chest') {
      text = dare.textVariantB;
    } else {
      // Custom anatomy - use appropriate variant based on context
      text = dare.textVariantB; // Default to chest variant for custom
    }
    
    // Replace generic terms with player's favorite word if available
    if (targetPlayer.favoriteWord) {
      text = text.replace(/\bpenis\b/gi, targetPlayer.favoriteWord);
      text = text.replace(/\bvagina\b/gi, targetPlayer.favoriteWord);
      text = text.replace(/\bcock\b/gi, targetPlayer.favoriteWord);
      text = text.replace(/\bpussy\b/gi, targetPlayer.favoriteWord);
    }
    
    return text;
  };

  if (!gameSession) return null;

  const handleQuit = () => {
    if (window.confirm('Are you sure you want to quit the game?')) {
      navigate('/');
    }
  };

  const handleContinue = () => {
    console.log('Continue button clicked, moving to next turn');
    console.log('Current game state:', gameSession.gameState);
    console.log('Current player index:', gameSession.currentPlayerIndex);
    console.log('Show dare state:', showDare);
    console.log('Current dare:', currentDare);
    continueToNextTurn();
  };

  const handleConfirmCompletion = () => {
    console.log('Confirming completion, moving to continue screen');
    confirmCompletion();
  };

  return (
    <div className={`min-h-screen ${currentTheme.background} velvet-overlay relative overflow-hidden`}>
      {/* Quit Button */}
      <div className="absolute top-4 right-4 z-20">
        <button
          onClick={handleQuit}
          className="bg-red-600/80 hover:bg-red-600 backdrop-blur-sm rounded-full p-3 text-white transition-all duration-200 transform hover:scale-105"
          title="Quit Game"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>

      {/* Confirmation Screen */}
      {gameSession.gameState === 'awaitingConfirmation' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-30 flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-900/90 backdrop-blur-sm rounded-2xl p-8 text-center space-y-6 max-w-md mx-4"
          >
            <div className="space-y-4">
              <Eye className="w-16 h-16 text-amber-500 mx-auto" />
              <h2 className="serif text-2xl font-bold text-white">
                Dare Completed?
              </h2>
              <p className="text-gray-300">
                Has {currentPlayer?.name} completed their dare?
              </p>
            </div>
            
            <div className="flex gap-4">
              <button
                onClick={handleConfirmCompletion}
                className="flex-1 px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full text-white font-bold text-lg transition-all duration-200 transform hover:scale-105 active:scale-95"
              >
                Yes, Completed
              </button>
              <button
                onClick={() => setGameState('playerTurn')}
                className="flex-1 px-6 py-4 bg-gradient-to-r from-gray-600 to-gray-700 rounded-full text-white font-bold text-lg transition-all duration-200 transform hover:scale-105 active:scale-95"
              >
                Not Yet
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Continue Screen */}
      {gameSession.gameState === 'continueScreen' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-30 flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-900/90 backdrop-blur-sm rounded-2xl p-8 text-center space-y-6 max-w-md mx-4"
          >
            <div className="space-y-4">
              <Play className="w-16 h-16 text-amber-500 mx-auto" />
              <h2 className="serif text-2xl font-bold text-white">
                Ready for next turn?
              </h2>
              <p className="text-gray-300">
                {gameSession.players[gameSession.currentPlayerIndex].name}'s turn is next
              </p>
              <div className="flex justify-center gap-4 text-sm">
                <span className="text-amber-300 font-medium">
                  Round {gameSession.currentRound}/{gameSession.totalRounds}
                </span>
                <span className="text-rose-300 font-medium capitalize">
                  {gameSession.currentSpiceLevel} Level
                </span>
              </div>
            </div>
            
            <button
              onClick={handleContinue}
              className="w-full px-8 py-4 bg-gradient-to-r from-amber-500 to-rose-500 rounded-full text-white font-bold text-lg transition-all duration-200 transform hover:scale-105 active:scale-95"
            >
              Continue
            </button>
          </motion.div>
        </motion.div>
      )}

      {/* Skip Bank Counters */}
      <div className="absolute top-4 left-4 right-4 flex justify-between z-10">
        <div className="bg-black/30 backdrop-blur-sm rounded-lg px-4 py-2">
          <p className="text-white text-sm font-medium">
            {gameSession.players[0].name}
          </p>
          <p className="text-gray-300 text-xs">
            Skips: {gameSession.players[0].skipBank.length}
          </p>
        </div>
        
        <div className="bg-black/30 backdrop-blur-sm rounded-lg px-4 py-2">
          <p className="text-white text-sm font-medium text-right">
            {gameSession.players[1].name}
          </p>
          <p className="text-gray-300 text-xs text-right">
            Skips: {gameSession.players[1].skipBank.length}
          </p>
        </div>
      </div>

      {/* Turn Announcement */}
      <motion.div
        key={gameSession.currentPlayerIndex}
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-20 left-0 right-0 text-center z-10"
      >
        <h2 className="serif text-2xl md:text-3xl font-bold text-white mb-2">
          {gameSession.gameState === 'awaitingConfirmation' ? 'Confirm Dare Completion' : 
           gameSession.gameState === 'continueScreen' ? 'Get Ready' :
           `It's ${currentPlayer?.name}'s turn`}
        </h2>
        <div className="flex justify-center items-center gap-4 text-sm">
          <span className="text-amber-300 font-medium">
            Round {gameSession.currentRound}/{gameSession.totalRounds}
          </span>
          <span className="text-rose-300 font-medium capitalize">
            {gameSession.currentSpiceLevel} Level
          </span>
          <span className="text-gray-300">
            {gameSession.dareDeck.length} dares remaining
          </span>
        </div>
      </motion.div>

      {/* Swipe Indicators - Simplified and less intrusive */}
      {showDare && (
        <div className="absolute top-1/2 left-4 transform -translate-y-1/2 z-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-green-500/10 backdrop-blur-sm rounded-full px-2 py-1 text-green-300 text-xs font-medium"
          >
            ← Accept
          </motion.div>
        </div>
      )}

      {showDare && (
        <div className="absolute top-1/2 right-4 transform -translate-y-1/2 z-10">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-red-500/10 backdrop-blur-sm rounded-full px-2 py-1 text-red-300 text-xs font-medium"
          >
            Skip →
          </motion.div>
        </div>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-4 pt-32 pb-32 min-h-screen flex items-center justify-center">
        {!showDare ? (
          <motion.div
            {...animations.fadeIn}
            className="text-center space-y-4"
          >
            <Sparkles className="w-16 h-16 text-amber-300 mx-auto animate-pulse" />
            <h3 className="serif text-2xl font-semibold text-white">
              Drawing a dare...
            </h3>
          </motion.div>
        ) : (
          <motion.div
            {...animations.cardEnter}
            className="relative"
            animate={controls}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            {...bind()}
          >
            <div className={`${currentTheme.cardBg} ${currentTheme.cardBorder} border-2 rounded-2xl p-8 w-80 md:w-96 h-96 flex flex-col justify-between glossy-card card-tilt shadow-2xl cursor-grab active:cursor-grabbing`}>
              {/* Card Header */}
              <div className="text-center">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs text-gray-400 uppercase tracking-wide">
                    {currentDare?.spiceLevel} • {currentDare?.category}
                  </span>
                  <span className="text-xs text-gray-400">
                    {currentDare?.direction === 'giver' ? 'Give' : 'Receive'}
                  </span>
                </div>
                
                <h3 className="serif text-2xl font-bold text-white mb-2">
                  {currentDare?.name}
                </h3>
              </div>

              {/* Card Content */}
              <div className="flex-1 flex items-center justify-center px-4">
                <p className="text-xl text-white text-center leading-relaxed font-medium drop-shadow-lg">
                  {getDareText(currentDare)}
                </p>
              </div>

              {/* Card Footer - Swipe Instructions Only */}
              <div className="text-center">
                <p className="text-sm text-gray-300 font-medium">
                  Swipe left to accept • Swipe right to skip
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Bottom Action Buttons */}
      {showDare && gameSession.gameState === 'playerTurn' && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="fixed bottom-0 left-0 right-0 p-4 bg-black/20 backdrop-blur-sm z-20"
        >
          <div className="container mx-auto flex gap-4 max-w-md">
            <button
              onClick={() => handleSwipe('left')}
              className="flex-1 px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full text-white font-bold text-lg transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg"
            >
              Accept Dare
            </button>
            <button
              onClick={() => handleSwipe('right')}
              className="flex-1 px-6 py-4 bg-gradient-to-r from-red-600 to-rose-600 rounded-full text-white font-bold text-lg transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg"
            >
              Skip Dare
            </button>
          </div>
        </motion.div>
      )}

      {/* Action Card Indicator */}
      <motion.div
        className="absolute bottom-4 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <div className="bg-black/30 backdrop-blur-sm rounded-lg px-4 py-2 text-center">
          <div className="flex items-center gap-2 text-gray-300">
            <Eye className="w-4 h-4" />
            <span className="text-sm">
              {currentPlayer?.actionCards.length || 0} action cards collected
            </span>
            <EyeOff className="w-4 h-4" />
          </div>
        </div>
      </motion.div>
    </div>
  );
}