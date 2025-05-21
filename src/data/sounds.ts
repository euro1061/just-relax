import { Howl } from 'howler';

export interface Sound {
  name: string;
  icon: string;
  file: string;
  tags: string[];
  howl?: Howl;
}

export const sounds: Sound[] = [
  {
    name: 'Rain',
    icon: '🌧️',
    file: '/sounds/rain.mp3',
    tags: ['nature', 'water', 'calm'],
  },
  {
    name: 'Thunder',
    icon: '⛈️',
    file: '/sounds/thunder.mp3',
    tags: ['nature', 'storm', 'intense'],
  },
  {
    name: 'Waves',
    icon: '🌊',
    file: '/sounds/waves.mp3',
    tags: ['nature', 'water', 'calm'],
  },
  {
    name: 'Wind',
    icon: '💨',
    file: '/sounds/wind.mp3',
    tags: ['nature', 'air', 'calm'],
  },
  {
    name: 'Fireplace',
    icon: '🔥',
    file: '/sounds/fireplace.mp3',
    tags: ['cozy', 'warm', 'calm'],
  },
  {
    name: 'Crickets',
    icon: '🦗',
    file: '/sounds/crickets.mp3',
    tags: ['nature', 'night', 'calm'],
  },
  {
    name: 'Birds',
    icon: '🐦',
    file: '/sounds/birds.mp3',
    tags: ['nature', 'morning', 'calm'],
  },
  {
    name: 'Coffee Shop',
    icon: '☕',
    file: '/sounds/coffee-shop.mp3',
    tags: ['city', 'work', 'background'],
  },
  {
    name: 'Keyboard',
    icon: '⌨️',
    file: '/sounds/keyboard.mp3',
    tags: ['work', 'technology', 'asmr'],
  },
  {
    name: 'White Noise',
    icon: '🤫',
    file: '/sounds/white-noise.mp3',
    tags: ['focus', 'sleep', 'calm'],
  },
];
