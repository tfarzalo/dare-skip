import { ThemeColors } from '../types/game';

export const themes = {
  woman: {
    background: 'bg-gradient-to-br from-pink-900 via-rose-800 to-pink-700',
    glow: 'shadow-rose-500/50',
    accent: 'text-rose-300',
    text: 'text-pink-100',
    cardBg: 'bg-rose-900/40',
    cardBorder: 'border-rose-400/30'
  },
  man: {
    background: 'bg-gradient-to-br from-slate-900 via-indigo-900 to-blue-900',
    glow: 'shadow-indigo-500/50',
    accent: 'text-indigo-300',
    text: 'text-blue-100',
    cardBg: 'bg-indigo-900/40',
    cardBorder: 'border-indigo-400/30'
  },
  nonbinary: {
    background: 'bg-gradient-to-br from-purple-900 via-violet-800 to-purple-700',
    glow: 'shadow-violet-500/50',
    accent: 'text-violet-300',
    text: 'text-purple-100',
    cardBg: 'bg-violet-900/40',
    cardBorder: 'border-violet-400/30'
  },
  custom: {
    background: 'bg-gradient-to-br from-gray-900 via-slate-800 to-gray-800',
    glow: 'shadow-amber-500/50',
    accent: 'text-amber-300',
    text: 'text-gray-100',
    cardBg: 'bg-slate-900/40',
    cardBorder: 'border-amber-400/30'
  }
};

export const endgameTheme = {
  background: 'bg-gradient-to-br from-purple-950 via-indigo-950 to-slate-950',
  glow: 'shadow-purple-500/50',
  accent: 'text-purple-300',
  text: 'text-indigo-100',
  cardBg: 'bg-purple-900/40',
  cardBorder: 'border-purple-400/30'
};

export const setupTheme = {
  background: 'bg-gradient-to-br from-slate-900 via-gray-900 to-zinc-900',
  glow: 'shadow-amber-500/50',
  accent: 'text-amber-300',
  text: 'text-gray-100',
  cardBg: 'bg-gray-900/40',
  cardBorder: 'border-amber-400/30'
};

export const animations = {
  cardEnter: {
    initial: { opacity: 0, scale: 0.8, rotateY: -15 },
    animate: { opacity: 1, scale: 1, rotateY: 0 },
    exit: { opacity: 0, scale: 0.8, rotateY: 15 },
    transition: { duration: 0.6 }
  },
  
  cardSwipe: {
    accept: {
      x: -300,
      rotate: -15,
      opacity: 0,
      transition: { duration: 0.4 }
    },
    skip: {
      x: 300,
      rotate: 15,
      opacity: 0,
      y: -100,
      transition: { duration: 0.4 }
    }
  },
  
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.8 }
  },
  
  slideUp: {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  },
  
  scaleIn: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.5 }
  },
  
  glow: {
    animate: {
      boxShadow: [
        '0 0 20px rgba(255, 255, 255, 0.1)',
        '0 0 40px rgba(255, 255, 255, 0.2)',
        '0 0 20px rgba(255, 255, 255, 0.1)'
      ]
    },
    transition: {
      duration: 2,
      repeat: Infinity
    }
  }
};

export const typography = {
  heading: 'font-serif text-4xl md:text-5xl font-bold',
  subheading: 'font-serif text-2xl md:text-3xl font-semibold',
  body: 'font-sans text-base md:text-lg',
  caption: 'font-sans text-sm md:text-base',
  button: 'font-sans text-lg md:text-xl font-medium'
};

export const cardStyles = {
  base: 'rounded-2xl backdrop-blur-sm border backdrop-blur-md',
  shadow: 'shadow-2xl',
  glow: 'shadow-lg',
  gradient: 'bg-gradient-to-br from-white/10 to-white/5'
};

export const buttonStyles = {
  primary: 'px-8 py-4 rounded-full font-medium transition-all duration-300 transform hover:scale-105 active:scale-95',
  secondary: 'px-6 py-3 rounded-full border-2 font-medium transition-all duration-300',
  ghost: 'px-4 py-2 rounded-lg transition-all duration-300 hover:bg-white/10'
};

export const sparkleEffect = {
  background: `radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
               radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
               radial-gradient(circle at 40% 40%, rgba(255, 255, 255, 0.05) 0%, transparent 50%)`
};