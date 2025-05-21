import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Sound } from '../data/sounds';
import Image from 'next/image';

// IconComponent (can be defined here or imported if made separate)
const IconComponent = ({ icon, className, alt }: { icon: string; className?: string; alt?: string }) => {
  return <Image src={icon} alt={alt || "sound icon"} width={48} height={48} className={className} />;
};

interface SoundCardProps {
  sound: Sound;
  isActive: boolean;
  onClick: (soundName: string) => void;
}

const SoundCard: React.FC<SoundCardProps> = ({ sound, isActive, onClick }) => {
  return (
    <Card
      className={`cursor-pointer transition-all ${isActive ? 'ring-2 ring-green-500' : ''}`}
      onClick={() => onClick(sound.name)}
    >
      <CardContent className="flex flex-col items-center justify-center p-4">
        <IconComponent icon={sound.icon} alt={sound.name + " icon"} className="w-10 h-10 mb-2" />
        <p className="text-sm font-medium text-center">{sound.name}</p>
        <div className="flex flex-wrap justify-center gap-1 mt-2">
          {sound.tags.map(tag => (
            <span key={tag} className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
              {tag}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SoundCard;
