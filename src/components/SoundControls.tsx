import React from 'react';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Volume2, Play, Pause } from 'lucide-react';

interface SoundControlsProps {
  isPlaying: boolean;
  onToggleMasterPlay: () => void;
  masterVolume: number;
  onChangeMasterVolume: (newVolume: number) => void;
}

const SoundControls: React.FC<SoundControlsProps> = ({
  isPlaying,
  onToggleMasterPlay,
  masterVolume,
  onChangeMasterVolume,
}) => {
  return (
    <div className="mb-4 p-4 bg-white rounded-lg shadow flex items-center space-x-4">
      ควบคุม : &nbsp;
      <Button onClick={onToggleMasterPlay}>
        {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
      </Button>
      <Volume2 className="text-green-600 w-6 h-6" />
      <Slider
        value={[masterVolume]}
        onValueChange={(newVolume) => onChangeMasterVolume(newVolume[0])}
        max={100}
        step={1}
        className="w-64"
      />
      <span className="text-sm font-medium">{masterVolume}%</span>
    </div>
  );
};

export default SoundControls;
