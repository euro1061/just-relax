import React from 'react';
import { Sound } from '../data/sounds';
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Volume2 } from 'lucide-react';
import Image from 'next/image';

// Local IconComponent for active sound list items
const IconComponent = ({ icon, className, alt }: { icon: string; className?: string; alt?: string }) => {
  // Defaulting to w-8 h-8 as seen in the original page.tsx for this section
  return <Image src={icon} alt={alt || "sound icon"} width={32} height={32} className={className || "w-8 h-8"} />;
};

interface ActiveSoundListProps {
  activeSounds: string[];
  allSounds: Sound[];
  volumes: { [key: string]: number };
  onChangeVolume: (soundName: string, newVolume: number) => void;
}

const ActiveSoundList: React.FC<ActiveSoundListProps> = ({ activeSounds, allSounds, volumes, onChangeVolume }) => {
  if (activeSounds.length === 0) {
    return <p className="text-gray-500">ไม่มีเสียงที่เล่นอยู่ตอนนี้</p>;
  }

  return (
    <div className="space-y-4">
      {activeSounds.map(soundName => {
        const sound = allSounds.find(s => s.name === soundName);
        if (!sound) return null; // Should not happen if data is consistent

        return (
          <Card key={soundName} className="p-4">
            <div className="flex items-center space-x-4 mb-2">
              <IconComponent
                icon={sound.icon}
                alt={sound.name + " icon"}
              />
              <span className="font-medium">{soundName}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Volume2 className="text-green-600 w-5 h-5" />
              <Slider
                value={[volumes[soundName] || 50]}
                onValueChange={(newVolume) => onChangeVolume(soundName, newVolume[0])}
                max={100}
                step={1}
                className="w-full"
              />
              <span className="text-sm font-medium w-12 text-right">
                {volumes[soundName] || 50}%
              </span>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default ActiveSoundList;
