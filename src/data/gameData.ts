import { DareCard, ActionCard, SpiceLevel } from '../types/game';

export const dareCards: DareCard[] = [
  // Soft Start Dares
  {
    id: 'dare-1',
    name: 'Gentle Touch',
    spiceLevel: 'soft',
    category: 'touch',
    textVariantA: 'Trace gentle circles around your partner\'s collarbone and shoulders',
    textVariantB: 'Trace gentle circles around your partner\'s chest and shoulders',
    direction: 'giver',
    visibility: 'private'
  },
  {
    id: 'dare-2',
    name: 'Whisper Secret',
    spiceLevel: 'soft',
    category: 'communication',
    textVariantA: 'Whisper your favorite memory of touching your partner\'s hair',
    textVariantB: 'Whisper your favorite memory of touching your partner\'s face',
    direction: 'giver',
    visibility: 'private'
  },
  {
    id: 'dare-3',
    name: 'Slow Dance',
    spiceLevel: 'soft',
    category: 'movement',
    textVariantA: 'Dance together for 30 seconds, hands exploring safely above the waist',
    textVariantB: 'Dance together for 30 seconds, hands exploring safely above the waist',
    direction: 'both',
    visibility: 'private'
  },
  {
    id: 'dare-4',
    name: 'Eye Contact',
    spiceLevel: 'soft',
    category: 'intimacy',
    textVariantA: 'Maintain eye contact while describing what you love about your partner\'s smile',
    textVariantB: 'Maintain eye contact while describing what you love about your partner\'s eyes',
    direction: 'giver',
    visibility: 'private'
  },
  {
    id: 'dare-5',
    name: 'Hand Massage',
    spiceLevel: 'soft',
    category: 'touch',
    textVariantA: 'Give your partner a slow hand massage, paying attention to each finger',
    textVariantB: 'Give your partner a slow hand massage, paying attention to each finger',
    direction: 'giver',
    visibility: 'private'
  },

  // Medium Heat Dares
  {
    id: 'dare-6',
    name: 'Neck Kisses',
    spiceLevel: 'medium',
    category: 'kiss',
    textVariantA: 'Plant 5 slow kisses along your partner\'s neck and collarbone area',
    textVariantB: 'Plant 5 slow kisses along your partner\'s neck and shoulder area',
    direction: 'giver',
    visibility: 'private'
  },
  {
    id: 'dare-7',
    name: 'Sensual Touch',
    spiceLevel: 'medium',
    category: 'touch',
    textVariantA: 'Using just fingertips, explore your partner\'s back and sides (above clothing)',
    textVariantB: 'Using just fingertips, explore your partner\'s back and chest (above clothing)',
    direction: 'giver',
    visibility: 'private'
  },
  {
    id: 'dare-8',
    name: 'Breathing Together',
    spiceLevel: 'medium',
    category: 'intimacy',
    textVariantA: 'Sit chest-to-chest and synchronize your breathing for 1 minute',
    textVariantB: 'Sit chest-to-chest and synchronize your breathing for 1 minute',
    direction: 'both',
    visibility: 'private'
  },
  {
    id: 'dare-9',
    name: 'Temperature Play',
    spiceLevel: 'medium',
    category: 'sensation',
    textVariantA: 'Use an ice cube to trace a line from neck to wrist, then warm with your breath',
    textVariantB: 'Use an ice cube to trace a line from chest to hand, then warm with your breath',
    direction: 'giver',
    visibility: 'private'
  },
  {
    id: 'dare-10',
    name: 'Desire Map',
    spiceLevel: 'medium',
    category: 'communication',
    textVariantA: 'Draw an imaginary map on your partner\'s back showing your favorite places to touch',
    textVariantB: 'Draw an imaginary map on your partner\'s chest showing your favorite places to touch',
    direction: 'giver',
    visibility: 'private'
  },

  // Wild Mode Dares
  {
    id: 'dare-11',
    name: 'Blindfold Tease',
    spiceLevel: 'wild',
    category: 'sensation',
    textVariantA: 'Blindfold your partner and tease sensitive areas with gentle touches and breath',
    textVariantB: 'Blindfold your partner and tease sensitive areas with gentle touches and breath',
    direction: 'giver',
    visibility: 'private'
  },
  {
    id: 'dare-12',
    name: 'Body Worship',
    spiceLevel: 'wild',
    category: 'intimacy',
    textVariantA: 'Spend 2 minutes kissing and appreciating your partner\'s breasts and torso',
    textVariantB: 'Spend 2 minutes kissing and appreciating your partner\'s chest and torso',
    direction: 'giver',
    visibility: 'private'
  },
  {
    id: 'dare-13',
    name: 'Sensual Massage',
    spiceLevel: 'wild',
    category: 'touch',
    textVariantA: 'Give a 3-minute sensual massage focusing on shoulders, back, and breasts',
    textVariantB: 'Give a 3-minute sensual massage focusing on shoulders, back, and chest',
    direction: 'giver',
    visibility: 'private'
  },
  {
    id: 'dare-14',
    name: 'Erotic Story',
    spiceLevel: 'wild',
    category: 'communication',
    textVariantA: 'Whisper an erotic story involving your partner\'s body while maintaining eye contact',
    textVariantB: 'Whisper an erotic story involving your partner\'s body while maintaining eye contact',
    direction: 'giver',
    visibility: 'private'
  },
  {
    id: 'dare-15',
    name: 'Mutual Pleasure',
    spiceLevel: 'wild',
    category: 'intimacy',
    textVariantA: 'Find a way to pleasure each other simultaneously for 2 minutes',
    textVariantB: 'Find a way to pleasure each other simultaneously for 2 minutes',
    direction: 'both',
    visibility: 'private'
  },

  // Additional dares for larger decks
  {
    id: 'dare-16',
    name: 'Temperature Trail',
    spiceLevel: 'medium',
    category: 'sensation',
    textVariantA: 'Create a temperature trail from neck to belly button using warm breath and cool air',
    textVariantB: 'Create a temperature trail from chest to belly button using warm breath and cool air',
    direction: 'giver',
    visibility: 'private'
  },
  {
    id: 'dare-17',
    name: 'Sensory Deprivation',
    spiceLevel: 'wild',
    category: 'sensation',
    textVariantA: 'Blindfold and gently restrain your partner, then explore their body with unexpected touches',
    textVariantB: 'Blindfold and gently restrain your partner, then explore their body with unexpected touches',
    direction: 'giver',
    visibility: 'private'
  },
  {
    id: 'dare-18',
    name: 'Erogenous Zones',
    spiceLevel: 'medium',
    category: 'touch',
    textVariantA: 'Spend 90 seconds discovering and stimulating your partner\'s most responsive erogenous zones',
    textVariantB: 'Spend 90 seconds discovering and stimulating your partner\'s most responsive erogenous zones',
    direction: 'giver',
    visibility: 'private'
  },
  {
    id: 'dare-19',
    name: 'Mirror Pleasure',
    spiceLevel: 'wild',
    category: 'intimacy',
    textVariantA: 'Watch yourselves in a mirror while engaging in intimate touching above the waist',
    textVariantB: 'Watch yourselves in a mirror while engaging in intimate touching above the waist',
    direction: 'both',
    visibility: 'private'
  },
  {
    id: 'dare-20',
    name: 'Anticipation Game',
    spiceLevel: 'soft',
    category: 'communication',
    textVariantA: 'Describe in detail what you want to do to your partner, but only act after 2 minutes of description',
    textVariantB: 'Describe in detail what you want to do to your partner, but only act after 2 minutes of description',
    direction: 'giver',
    visibility: 'private'
  }
];

export const actionCards: ActionCard[] = [
  // Slow Kisses (3 cards)
  {
    id: 'action-1',
    actionId: 'slow-kisses',
    visualStyle: 'sultry',
    description: 'Give your partner 10 slow, passionate kisses, exploring different techniques and locations',
    name: 'Slow Kisses'
  },
  {
    id: 'action-2',
    actionId: 'slow-kisses',
    visualStyle: 'sultry',
    description: 'Give your partner 10 slow, passionate kisses, exploring different techniques and locations',
    name: 'Slow Kisses'
  },
  {
    id: 'action-3',
    actionId: 'slow-kisses',
    visualStyle: 'sultry',
    description: 'Give your partner 10 slow, passionate kisses, exploring different techniques and locations',
    name: 'Slow Kisses'
  },

  // Blindfold Tease (3 cards)
  {
    id: 'action-4',
    actionId: 'blindfold-tease',
    visualStyle: 'minimal',
    description: 'Blindfold your partner and tease them with unexpected touches, kisses, and sensations for 3 minutes',
    name: 'Blindfold Tease'
  },
  {
    id: 'action-5',
    actionId: 'blindfold-tease',
    visualStyle: 'minimal',
    description: 'Blindfold your partner and tease them with unexpected touches, kisses, and sensations for 3 minutes',
    name: 'Blindfold Tease'
  },
  {
    id: 'action-6',
    actionId: 'blindfold-tease',
    visualStyle: 'minimal',
    description: 'Blindfold your partner and tease them with unexpected touches, kisses, and sensations for 3 minutes',
    name: 'Blindfold Tease'
  },

  // Neck Exploration (3 cards)
  {
    id: 'action-7',
    actionId: 'neck-exploration',
    visualStyle: 'silhouette',
    description: 'Spend 5 minutes exploring your partner\'s neck with kisses, gentle bites, and breath play',
    name: 'Neck Exploration'
  },
  {
    id: 'action-8',
    actionId: 'neck-exploration',
    visualStyle: 'silhouette',
    description: 'Spend 5 minutes exploring your partner\'s neck with kisses, gentle bites, and breath play',
    name: 'Neck Exploration'
  },
  {
    id: 'action-9',
    actionId: 'neck-exploration',
    visualStyle: 'silhouette',
    description: 'Spend 5 minutes exploring your partner\'s neck with kisses, gentle bites, and breath play',
    name: 'Neck Exploration'
  },

  // Sensation Play (3 cards)
  {
    id: 'action-10',
    actionId: 'sensation-play',
    visualStyle: 'abstract',
    description: 'Use ice, warm breath, and gentle scratching to create contrasting sensations on your partner\'s skin',
    name: 'Sensation Play'
  },
  {
    id: 'action-11',
    actionId: 'sensation-play',
    visualStyle: 'abstract',
    description: 'Use ice, warm breath, and gentle scratching to create contrasting sensations on your partner\'s skin',
    name: 'Sensation Play'
  },
  {
    id: 'action-12',
    actionId: 'sensation-play',
    visualStyle: 'abstract',
    description: 'Use ice, warm breath, and gentle scratching to create contrasting sensations on your partner\'s skin',
    name: 'Sensation Play'
  },

  // Lap Tease (3 cards)
  {
    id: 'action-13',
    actionId: 'lap-tease',
    visualStyle: 'cute',
    description: 'Give your partner a sensual lap dance for 2 minutes, maintaining eye contact throughout',
    name: 'Lap Tease'
  },
  {
    id: 'action-14',
    actionId: 'lap-tease',
    visualStyle: 'cute',
    description: 'Give your partner a sensual lap dance for 2 minutes, maintaining eye contact throughout',
    name: 'Lap Tease'
  },
  {
    id: 'action-15',
    actionId: 'lap-tease',
    visualStyle: 'cute',
    description: 'Give your partner a sensual lap dance for 2 minutes, maintaining eye contact throughout',
    name: 'Lap Tease'
  },

  // Body Massage Trail (3 cards)
  {
    id: 'action-16',
    actionId: 'body-massage-trail',
    visualStyle: 'sultry',
    description: 'Create a massage oil trail from neck to hips and slowly massage it in with long, sensual strokes',
    name: 'Body Massage Trail'
  },
  {
    id: 'action-17',
    actionId: 'body-massage-trail',
    visualStyle: 'sultry',
    description: 'Create a massage oil trail from neck to hips and slowly massage it in with long, sensual strokes',
    name: 'Body Massage Trail'
  },
  {
    id: 'action-18',
    actionId: 'body-massage-trail',
    visualStyle: 'sultry',
    description: 'Create a massage oil trail from neck to hips and slowly massage it in with long, sensual strokes',
    name: 'Body Massage Trail'
  },

  // Erogenous Discovery (3 cards)
  {
    id: 'action-19',
    actionId: 'erogenous-discovery',
    visualStyle: 'minimal',
    description: 'Spend 10 minutes mapping your partner\'s erogenous zones using different types of touch and pressure',
    name: 'Erogenous Discovery'
  },
  {
    id: 'action-20',
    actionId: 'erogenous-discovery',
    visualStyle: 'minimal',
    description: 'Spend 10 minutes mapping your partner\'s erogenous zones using different types of touch and pressure',
    name: 'Erogenous Discovery'
  },
  {
    id: 'action-21',
    actionId: 'erogenous-discovery',
    visualStyle: 'minimal',
    description: 'Spend 10 minutes mapping your partner\'s erogenous zones using different types of touch and pressure',
    name: 'Erogenous Discovery'
  },

  // Temperature Tease (3 cards)
  {
    id: 'action-22',
    actionId: 'temperature-tease',
    visualStyle: 'silhouette',
    description: 'Alternate between ice cubes and warm breath across your partner\'s most sensitive areas',
    name: 'Temperature Tease'
  },
  {
    id: 'action-23',
    actionId: 'temperature-tease',
    visualStyle: 'silhouette',
    description: 'Alternate between ice cubes and warm breath across your partner\'s most sensitive areas',
    name: 'Temperature Tease'
  },
  {
    id: 'action-24',
    actionId: 'temperature-tease',
    visualStyle: 'silhouette',
    description: 'Alternate between ice cubes and warm breath across your partner\'s most sensitive areas',
    name: 'Temperature Tease'
  },

  // Sensual Breath Play (3 cards)
  {
    id: 'action-25',
    actionId: 'sensual-breath-play',
    visualStyle: 'abstract',
    description: 'Use gentle breath play across neck, ears, and other sensitive areas while maintaining intimate body contact',
    name: 'Sensual Breath Play'
  },
  {
    id: 'action-26',
    actionId: 'sensual-breath-play',
    visualStyle: 'abstract',
    description: 'Use gentle breath play across neck, ears, and other sensitive areas while maintaining intimate body contact',
    name: 'Sensual Breath Play'
  },
  {
    id: 'action-27',
    actionId: 'sensual-breath-play',
    visualStyle: 'abstract',
    description: 'Use gentle breath play across neck, ears, and other sensitive areas while maintaining intimate body contact',
    name: 'Sensual Breath Play'
  },

  // Intimate Massage (3 cards)
  {
    id: 'action-28',
    actionId: 'intimate-massage',
    visualStyle: 'cute',
    description: 'Give a full-body sensual massage focusing on tension release and pleasure building',
    name: 'Intimate Massage'
  },
  {
    id: 'action-29',
    actionId: 'intimate-massage',
    visualStyle: 'cute',
    description: 'Give a full-body sensual massage focusing on tension release and pleasure building',
    name: 'Intimate Massage'
  },
  {
    id: 'action-30',
    actionId: 'intimate-massage',
    visualStyle: 'cute',
    description: 'Give a full-body sensual massage focusing on tension release and pleasure building',
    name: 'Intimate Massage'
  }
];