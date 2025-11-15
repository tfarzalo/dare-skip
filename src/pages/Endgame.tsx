import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Crown, RefreshCw, Home } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { themes, animations } from '../styles/themes';

export default function Endgame() {
  const navigate = useNavigate();
  const { gameSession, selectSkipDare } = useGameStore();
  const [revealStage, setRevealStage] = useState(0);
  const [selectedDare, setSelectedDare] = useState<any>(null);
  const [showActionCard, setShowActionCard] = useState(false);

  useEffect(() => {
    if (!gameSession || !gameSession.winner || !gameSession.loser) {
      navigate('/');
      return;
    }
  }, [gameSession, navigate]);

  if (!gameSession || !gameSession.winner || !gameSession.loser) return null;

  const { winner, loser } = gameSession;
  const loserActionCards = loser.actionCards;
  
  // Find the matching set of 3 action cards
  const actionGroups = loserActionCards.reduce((acc: any, card) => {
    acc[card.actionId] = acc[card.actionId] || [];
    acc[card.actionId].push(card);
    return acc;
  }, {});
  
  const matchingSet = Object.values(actionGroups).find((cards: any) => cards.length >= 3) as any[];
  const losingActionCard = matchingSet?.[0];

  const handleDareSelect = (dare: any) => {
    setSelectedDare(dare);
    selectSkipDare(dare);
    setRevealStage(2);
  };

  const stages = [
    // 0: Winner announcement
    <motion.div key={0} {...animations.fadeIn}>
      <WinnerAnnouncement winner={winner} loser={loser} />
    </motion.div>,
    
    // 1: Skip bank reveal and selection
    <motion.div key={1} {...animations.fadeIn}>
      <SkipBankReveal 
        loser={loser} 
        onDareSelect={handleDareSelect}
        winnerName={winner.name}
      />
    </motion.div>,
    
    // 2: Action card reveal
    <motion.div key={2} {...animations.fadeIn}>
      <ActionCardReveal 
        actionCard={losingActionCard}
        selectedDare={selectedDare}
        loserName={loser.name}
        onComplete={() => setRevealStage(3)}
      />
    </motion.div>,
    
    // 3: Final instructions
    <motion.div key={3} {...animations.fadeIn}>
      <FinalInstructions 
        winner={winner}
        loser={loser}
        selectedDare={selectedDare}
        actionCard={losingActionCard}
        onPlayAgain={() => navigate('/setup')}
        onHome={() => navigate('/')}
      />
    </motion.div>
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-indigo-950 to-slate-950 velvet-overlay">
      <div className="container mx-auto px-4 py-8 min-h-screen flex items-center justify-center">
        <AnimatePresence mode="wait">
          <div key={revealStage} className="w-full max-w-2xl">
            {stages[revealStage]}
          </div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function WinnerAnnouncement({ winner, loser }: { winner: any; loser: any }) {
  return (
    <div className="text-center space-y-8">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, ease: "easeOut" }}
        className="w-24 h-24 mx-auto bg-gradient-to-r from-amber-400 via-rose-400 to-purple-400 rounded-full flex items-center justify-center shadow-2xl"
      >
        <Crown className="w-12 h-12 text-white" />
      </motion.div>
      
      <div className="space-y-4">
        <h1 className="serif text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-300 via-rose-300 to-purple-300 bg-clip-text text-transparent">
          Game Over
        </h1>
        <h2 className="serif text-3xl md:text-4xl font-semibold text-white">
          {winner.name} Wins!
        </h2>
        <p className="text-gray-300 text-lg">
          {loser.name} collected three matching action cards
        </p>
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="px-8 py-4 bg-gradient-to-r from-amber-500 to-rose-500 rounded-full text-white font-semibold text-lg shadow-2xl"
      >
        Continue to Reveal
      </motion.button>
    </div>
  );
}

function SkipBankReveal({ loser, onDareSelect, winnerName }: { 
  loser: any; 
  onDareSelect: (dare: any) => void;
  winnerName: string;
}) {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="serif text-3xl font-semibold text-white">
          {winnerName}, Choose Your Reward
        </h2>
        <p className="text-gray-300">
          Select one dare from {loser.name}'s secret skip bank
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {loser.skipBank.map((dare: any, index: number) => (
          <motion.div
            key={dare.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05, rotateY: 5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onDareSelect(dare)}
            className="aspect-[3/4] bg-gradient-to-br from-purple-900/50 to-indigo-900/50 border border-purple-400/30 rounded-xl p-4 cursor-pointer glossy-card card-tilt shadow-xl hover:shadow-2xl transition-all duration-300"
          >
            <div className="h-full flex flex-col justify-between">
              <div>
                <div className="text-xs text-purple-300 mb-2">
                  {dare.spiceLevel} • {dare.category}
                </div>
                <h3 className="font-semibold text-white mb-2">{dare.name}</h3>
              </div>
              <div className="text-xs text-gray-400">
                Tap to select
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function ActionCardReveal({ actionCard, selectedDare, loserName, onComplete }: { 
  actionCard: any;
  selectedDare: any;
  loserName: string;
  onComplete: () => void;
}) {
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsFlipped(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isFlipped) {
      const timer = setTimeout(onComplete, 3000);
      return () => clearTimeout(timer);
    }
  }, [isFlipped, onComplete]);

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="serif text-3xl font-semibold text-white">
          The Consequence
        </h2>
        <p className="text-gray-300">
          {loserName} must also perform this action
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
        {/* Selected Dare */}
        <motion.div
          {...animations.scaleIn}
          className="w-64 bg-gradient-to-br from-purple-900/50 to-indigo-900/50 border border-purple-400/30 rounded-xl p-6 glossy-card shadow-xl"
        >
          <div className="text-center space-y-3">
            <h3 className="font-bold text-white">Selected Dare</h3>
            <p className="text-sm text-gray-300">{selectedDare?.name}</p>
            <p className="text-xs text-gray-400">{selectedDare?.textVariantA}</p>
          </div>
        </motion.div>

        {/* Action Card */}
        <div className="w-64 h-80 relative" style={{ perspective: '1000px' }}>
          <motion.div
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
            style={{ transformStyle: 'preserve-3d' }}
            className="w-full h-full relative"
          >
            {/* Front of card */}
            <div className="absolute inset-0 bg-gradient-to-br from-amber-900/50 to-rose-900/50 border border-amber-400/30 rounded-xl glossy-card shadow-xl flex items-center justify-center">
              <div className="text-center">
                <Sparkles className="w-12 h-12 text-amber-400 mx-auto mb-4" />
                <p className="text-white font-semibold">Action Card</p>
                <p className="text-amber-300 text-sm">Tap to reveal</p>
              </div>
            </div>

            {/* Back of card */}
            <div 
              className="absolute inset-0 bg-gradient-to-br from-rose-900/50 to-purple-900/50 border border-rose-400/30 rounded-xl glossy-card shadow-xl flex items-center justify-center"
              style={{ transform: 'rotateY(180deg)', backfaceVisibility: 'hidden' }}
            >
              <div className="text-center p-6">
                <h3 className="font-bold text-white mb-4">{actionCard?.name}</h3>
                <p className="text-sm text-gray-300 leading-relaxed">
                  {actionCard?.description}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function FinalInstructions({ winner, loser, selectedDare, actionCard, onPlayAgain, onHome }: { 
  winner: any;
  loser: any;
  selectedDare: any;
  actionCard: any;
  onPlayAgain: () => void;
  onHome: () => void;
}) {
  return (
    <div className="space-y-8 text-center">
      <div className="space-y-4">
        <h2 className="serif text-3xl font-semibold text-white">
          Final Instructions
        </h2>
        
        <div className="bg-gradient-to-br from-purple-900/30 to-indigo-900/30 rounded-xl p-6 border border-purple-400/20">
          <p className="text-lg text-gray-200 leading-relaxed mb-4">
            <span className="font-semibold text-rose-300">{loser.name}</span>, you must:
          </p>
          
          <div className="space-y-3 text-left">
            <div className="flex items-start gap-3">
              <span className="text-amber-400 font-bold">1.</span>
              <span className="text-gray-300">
                Begin with the selected dare: <span className="text-white font-medium">{selectedDare?.name}</span>
              </span>
            </div>
            
            <div className="flex items-start gap-3">
              <span className="text-amber-400 font-bold">2.</span>
              <span className="text-gray-300">
                Then perform the action: <span className="text-white font-medium">{actionCard?.name}</span>
              </span>
            </div>
            
            <div className="flex items-start gap-3">
              <span className="text-amber-400 font-bold">3.</span>
              <span className="text-gray-300">
                If both can be combined into one activity, that is allowed
              </span>
            </div>
          </div>
          
          <p className="text-sm text-gray-400 mt-4">
            Enjoy your intimate moment together! 🌟
          </p>
        </div>
      </div>

      <div className="flex gap-4 justify-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onPlayAgain}
          className="px-6 py-3 bg-gradient-to-r from-amber-500 to-rose-500 rounded-full text-white font-semibold flex items-center gap-2"
        >
          <RefreshCw className="w-5 h-5" />
          Play Again
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onHome}
          className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-full text-white font-semibold flex items-center gap-2"
        >
          <Home className="w-5 h-5" />
          Home
        </motion.button>
      </div>
    </div>
  );
}