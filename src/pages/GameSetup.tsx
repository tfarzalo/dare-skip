import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Heart, Sparkles, ChevronRight, Users, Settings } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { Gender, AnatomyTag, SpiceLevel } from '../types/game';
import { animations } from '../styles/themes';

interface PlayerForm {
  name: string;
  gender: Gender;
  pronouns: string;
  anatomyTag: AnatomyTag;
  customGender?: string;
  customAnatomy?: string;
}

interface GameSettingsForm {
  deckSize: number;
  spiceLevel: SpiceLevel;
  actionCardStyle: string;
}

export default function GameSetup() {
  const navigate = useNavigate();
  const { initializeGame, gameSettings } = useGameStore();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [player1, setPlayer1] = useState<PlayerForm>({
    name: '',
    gender: 'woman',
    pronouns: '',
    anatomyTag: 'breasts'
  });
  const [player2, setPlayer2] = useState<PlayerForm>({
    name: '',
    gender: 'man',
    pronouns: '',
    anatomyTag: 'chest'
  });
  const [settings, setSettings] = useState<GameSettingsForm>({
    deckSize: gameSettings.deckSize,
    spiceLevel: gameSettings.spiceLevel,
    actionCardStyle: gameSettings.actionCardStyle
  });

  const steps = [
    { title: 'Player 1 Profile', icon: User },
    { title: 'Player 2 Profile', icon: Users },
    { title: 'Game Settings', icon: Settings },
    { title: 'Ready to Play', icon: Sparkles }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Initialize game and start
      const players = [
        {
          id: 'player-1',
          name: player1.name || 'Player 1',
          gender: player1.gender,
          pronouns: player1.pronouns,
          anatomyTag: player1.anatomyTag,
          skipBank: [],
          actionCards: []
        },
        {
          id: 'player-2',
          name: player2.name || 'Player 2',
          gender: player2.gender,
          pronouns: player2.pronouns,
          anatomyTag: player2.anatomyTag,
          skipBank: [],
          actionCards: []
        }
      ] as [any, any];

      initializeGame(players, {
        ...settings,
        enabledActionCategories: ['touch', 'kiss', 'sensation', 'intimacy', 'communication'],
        actionCardStyle: settings.actionCardStyle as 'minimal' | 'silhouette' | 'cute' | 'abstract' | 'sultry'
      });
      
      navigate('/play');
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate('/');
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <PlayerSetup player={player1} onChange={setPlayer1} title="Player 1" />;
      case 1:
        return <PlayerSetup player={player2} onChange={setPlayer2} title="Player 2" />;
      case 2:
        return <GameSettings settings={settings} onChange={setSettings} />;
      case 3:
        return <ReadyScreen player1={player1} player2={player2} settings={settings} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-zinc-900 velvet-overlay">
      <div className="container mx-auto px-4 py-8 min-h-screen flex flex-col">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="flex items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                      index <= currentStep
                        ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-white'
                        : 'bg-gray-700 text-gray-400'
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`w-16 h-1 mx-2 transition-all duration-300 ${
                        index < currentStep
                          ? 'bg-gradient-to-r from-amber-500 to-rose-500'
                          : 'bg-gray-700'
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
          <div className="text-center">
            <h2 className="serif text-2xl font-semibold text-white mb-2">
              {steps[currentStep].title}
            </h2>
            <p className="text-gray-400">
              Step {currentStep + 1} of {steps.length}
            </p>
          </div>
        </div>

        {/* Content */}
        <motion.div
          key={currentStep}
          {...animations.fadeIn}
          className="flex-1 flex items-center justify-center"
        >
          {renderStepContent()}
        </motion.div>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-8">
          <button
            onClick={handleBack}
            className="px-6 py-3 text-gray-400 hover:text-white transition-colors"
          >
            {currentStep === 0 ? 'Cancel' : 'Back'}
          </button>
          
          <button
            onClick={handleNext}
            className="group px-8 py-4 bg-gradient-to-r from-amber-500 to-rose-500 rounded-full text-white font-semibold flex items-center gap-2 transition-all duration-300 transform hover:scale-105 active:scale-95"
          >
            <span>{currentStep === steps.length - 1 ? 'Start Game' : 'Continue'}</span>
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}

function PlayerSetup({ player, onChange, title }: { 
  player: PlayerForm; 
  onChange: (player: PlayerForm) => void; 
  title: string;
}) {
  return (
    <div className="w-full max-w-md space-y-6">
      <h3 className="serif text-xl font-semibold text-white text-center mb-6">
        {title} Profile
      </h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Name or Nickname
          </label>
          <input
            type="text"
            value={player.name}
            onChange={(e) => onChange({ ...player, name: e.target.value })}
            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            placeholder="Enter your name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Gender / Presentation
          </label>
          <select
            value={player.gender}
            onChange={(e) => onChange({ ...player, gender: e.target.value as Gender })}
            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="woman">Woman</option>
            <option value="man">Man</option>
            <option value="nonbinary">Nonbinary</option>
            <option value="custom">Custom</option>
          </select>
        </div>

        {player.gender === 'custom' && (
          <div>
            <input
              type="text"
              value={player.customGender || ''}
              onChange={(e) => onChange({ ...player, customGender: e.target.value })}
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="Enter custom gender"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Pronouns (optional)
          </label>
          <input
            type="text"
            value={player.pronouns}
            onChange={(e) => onChange({ ...player, pronouns: e.target.value })}
            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
            placeholder="e.g., she/her, he/him, they/them"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Anatomy Preference
          </label>
          <select
            value={player.anatomyTag}
            onChange={(e) => onChange({ ...player, anatomyTag: e.target.value as AnatomyTag })}
            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="breasts">Breasts</option>
            <option value="chest">Chest</option>
            <option value="custom">Custom term</option>
          </select>
        </div>

        {player.anatomyTag === 'custom' && (
          <div>
            <input
              type="text"
              value={player.customAnatomy || ''}
              onChange={(e) => onChange({ ...player, customAnatomy: e.target.value })}
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="Enter custom anatomy term"
            />
          </div>
        )}
      </div>
    </div>
  );
}

function GameSettings({ settings, onChange }: { 
  settings: GameSettingsForm; 
  onChange: (settings: GameSettingsForm) => void; 
}) {
  return (
    <div className="w-full max-w-md space-y-6">
      <h3 className="serif text-xl font-semibold text-white text-center mb-6">
        Game Settings
      </h3>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Number of Dare Cards (must be even)
          </label>
          <input
            type="number"
            min="10"
            max="50"
            step="2"
            value={settings.deckSize}
            onChange={(e) => onChange({ ...settings, deckSize: parseInt(e.target.value) })}
            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          <p className="text-xs text-gray-500 mt-1">Minimum 10 cards recommended</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Spice Level
          </label>
          <select
            value={settings.spiceLevel}
            onChange={(e) => onChange({ ...settings, spiceLevel: e.target.value as SpiceLevel })}
            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="soft">Soft Start (light → spicy progression)</option>
            <option value="medium">Medium Heat (moderate spice)</option>
            <option value="wild">Wild Mode (explicit early)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Action Card Visual Style
          </label>
          <select
            value={settings.actionCardStyle}
            onChange={(e) => onChange({ ...settings, actionCardStyle: e.target.value })}
            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="minimal">Minimal</option>
            <option value="silhouette">Silhouette</option>
            <option value="cute">Cute</option>
            <option value="abstract">Abstract</option>
            <option value="sultry">Sultry</option>
          </select>
        </div>
      </div>
    </div>
  );
}

function ReadyScreen({ player1, player2, settings }: { 
  player1: PlayerForm; 
  player2: PlayerForm; 
  settings: GameSettingsForm; 
}) {
  return (
    <div className="w-full max-w-md space-y-6 text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <Heart className="w-16 h-16 text-rose-500 mx-auto animate-pulse" />
        
        <h3 className="serif text-2xl font-semibold text-white">
          Ready to Begin
        </h3>
        
        <div className="space-y-4 text-gray-300">
          <div className="bg-gray-800/30 rounded-lg p-4">
            <h4 className="font-semibold mb-2">Players</h4>
            <p>{player1.name || 'Player 1'} & {player2.name || 'Player 2'}</p>
          </div>
          
          <div className="bg-gray-800/30 rounded-lg p-4">
            <h4 className="font-semibold mb-2">Game Settings</h4>
            <p>{settings.deckSize} dare cards • {settings.spiceLevel} spice level</p>
          </div>
          
          <p className="text-sm text-gray-400">
            Swipe left to accept dares, right to skip them. 
            Skip wisely - three matching action cards means game over!
          </p>
        </div>
      </motion.div>
    </div>
  );
}