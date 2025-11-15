import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Heart, Play } from 'lucide-react';
import { animations } from '../styles/themes';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-indigo-950 to-slate-950 velvet-overlay">
      <div className="container mx-auto px-4 py-8 min-h-screen flex flex-col items-center justify-center">
        <div className="text-center space-y-8 max-w-2xl mx-auto">
          {/* Title */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="flex items-center justify-center gap-3"
            >
              <Sparkles className="w-8 h-8 text-amber-300 animate-pulse" />
              <h1 className="serif text-5xl md:text-7xl font-bold bg-gradient-to-r from-amber-300 via-rose-300 to-purple-300 bg-clip-text text-transparent">
                Dare to Skip
              </h1>
              <Heart className="w-8 h-8 text-rose-300 animate-pulse" />
            </motion.div>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-xl md:text-2xl text-gray-300 font-light"
            >
              A sensual game of intimacy and desire
            </motion.p>
          </div>

          {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="space-y-4 text-gray-400"
          >
            <p className="text-lg leading-relaxed">
              Draw intimate dares, choose to accept or skip with a swipe. 
              Skip wisely - collect three matching action cards and you'll have to perform 
              both the action and a chosen dare from your secret skip bank.
            </p>
            <p className="text-sm text-gray-500">
              Designed for two players • Mobile-first experience • Discreet and elegant
            </p>
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="pt-8"
          >
            <button
              onClick={() => navigate('/setup')}
              className="group relative px-12 py-6 bg-gradient-to-r from-amber-500 via-rose-500 to-purple-500 rounded-full text-white font-semibold text-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-2xl hover:shadow-amber-500/25"
            >
              <div className="flex items-center gap-3">
                <span>Begin Your Journey</span>
                <Play className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </div>
              
              {/* Glow effect */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-400 via-rose-400 to-purple-400 opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300" />
            </button>
          </motion.div>

          {/* Decorative elements */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="pt-12 flex justify-center gap-4"
          >
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full bg-gradient-to-r from-amber-400 to-rose-400 opacity-30 animate-pulse"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}