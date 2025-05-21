import React from 'react';
import { Sound } from '../data/sounds';
import SoundCard from './SoundCard';

interface SoundGridProps {
  sounds: Sound[]; // This will be the already filtered list of sounds
  activeSounds: string[];
  onToggleSound: (soundName: string) => void;
}

const SoundGrid: React.FC<SoundGridProps> = ({ sounds, activeSounds, onToggleSound }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {sounds.map((sound) => (
        <SoundCard
          key={sound.name}
          sound={sound}
          isActive={activeSounds.includes(sound.name)}
          onClick={onToggleSound}
        />
      ))}
    </div>
  );
};

export default SoundGrid;
