import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useAnimation, PanInfo } from 'framer-motion';
import { useGesture } from '@use-gesture/react';
import { ArrowLeft, ArrowRight, Sparkles, Eye, EyeOff } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { themes, animations } from '../styles/themes';
import { toast } from 'sonner';

export default function GamePlay() {
  const navigate = useNavigate();
  const { gameSession, drawDareCard, acceptDare, skipDare, setGameState } = useGameStore();
  const [currentDare, setCurrentDare] = useState<any>(null);
  const [showDare, setShowDare] = useState(false);
  const controls = useAnimation();

  useEffect(() => {
    if (!gameSession) {
      navigate('/setup');
      return;
    }

    if (gameSession.gameState === 'playerTurn') {
      startNewTurn();
    }
  }, [gameSession, navigate]);

  const startNewTurn = async () => {
    setShowDare(false);
    const dare = drawDareCard();
    if (dare) {
      setCurrentDare(dare);
      // Show turn announcement first
      await new Promise(resolve => setTimeout(resolve, 1500));
      setShowDare(true);
    } else {
      // No more dares, check for winner
      const player1Cards = gameSession.players[0].actionCards.length;
      const player2Cards = gameSession.players[1].actionCards.length;
      
      if (player1Cards < player2Cards) {
        setGameState('endgameTriggered');
        navigate('/endgame');
      } else if (player2Cards < player1Cards) {
        setGameState('endgameTriggered');
        navigate('/endgame');
      } else {
        // Tie - random winner
        const winner = Math.random() > 0.5 ? 0 : 1;
        setGameState('endgameTriggered');
        navigate('/endgame');
      }
    }
  };

  const handleSwipe = async (direction: 'left' | 'right') => {
    if (!currentDare || !gameSession) return;

    if (direction === 'left') {
      // Accept dare
      controls.start(animations.cardSwipe.accept);
      toast.success('Dare accepted!');
      acceptDare();
    } else {
      // Skip dare
      controls.start(animations.cardSwipe.skip);
      toast.info('Dare skipped - added to skip bank!');
      skipDare();
    }

    // Wait for animation to complete
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // Reset for next turn
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
    
    if (targetPlayer.anatomyTag === 'breasts') {
      return dare.textVariantA;
    } else if (targetPlayer.anatomyTag === 'chest') {
      return dare.textVariantB;
    } else {
      // Custom anatomy - use appropriate variant based on context
      return dare.textVariantB; // Default to chest variant for custom
    }
  };

  if (!gameSession) return null;

  return (
    <div className={`min-h-screen ${currentTheme.background} velvet-overlay relative overflow-hidden`}>
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
          It's {currentPlayer?.name}'s turn
        </h2>
        <p className="text-gray-300 text-sm">
          {gameSession.dareDeck.length} dares remaining
        </p>
      </motion.div>

      {/* Swipe Indicators */}
      {showDare && (
        <div className="absolute top-1/2 left-4 transform -translate-y-1/2 z-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-green-500/20 backdrop-blur-sm rounded-lg px-3 py-2 text-green-300 text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4 inline mr-1" />
            Accept
          </motion.div>
        </div>
      )}

      {showDare && (
        <div className="absolute top-1/2 right-4 transform -translate-y-1/2 z-10">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-red-500/20 backdrop-blur-sm rounded-lg px-3 py-2 text-red-300 text-sm font-medium"
          >
            Skip
            <ArrowRight className="w-4 h-4 inline ml-1" />
          </motion.div>
        </div>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-4 pt-32 pb-8 min-h-screen flex items-center justify-center">
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
            {...bind}
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
              <div className="flex-1 flex items-center justify-center">
                <p className="text-lg text-gray-200 text-center leading-relaxed">
                  {getDareText(currentDare)}
                </p>
              </div>

              {/* Card Footer */}
              <div className="text-center">
                <p className="text-sm text-gray-400 mb-4">
                  Swipe left to accept • Swipe right to skip
                </p>
                
                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => handleSwipe('left')}
                    className="px-6 py-3 bg-green-500/20 hover:bg-green-500/30 rounded-full text-green-300 font-medium transition-all duration-200 transform hover:scale-105"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleSwipe('right')}
                    className="px-6 py-3 bg-red-500/20 hover:bg-red-500/30 rounded-full text-red-300 font-medium transition-all duration-200 transform hover:scale-105"
                  >
                    Skip
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

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