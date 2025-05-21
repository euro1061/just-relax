import React from 'react';
import { Button } from "@/components/ui/button";
import { Upload } from 'lucide-react';

export interface Preset { // Exporting for potential use in page.tsx props
  name: string;
  sounds: string[];
  volumes: { [key: string]: number };
}

interface PresetManagerProps {
  presets: Preset[];
  onLoadPreset: (preset: Preset) => void;
  onDeletePreset: (presetName: string) => void;
}

const PresetManager: React.FC<PresetManagerProps> = ({ presets, onLoadPreset, onDeletePreset }) => {
  if (presets.length === 0) {
    return <p className="text-gray-500">ยังไม่มีพรีเซ็ทเสียงที่บันทึกไว้</p>;
  }

  return (
    <div className="space-y-2">
      {presets.map((preset, index) => (
        <div key={index} className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => onLoadPreset(preset)}
          >
            <Upload className="w-4 h-4 mr-2" /> {preset.name}
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="flex-shrink-0"
            onClick={() => onDeletePreset(preset.name)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-4 h-4"
            >
              <path d="M3 6h18"></path>
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
              <line x1="10" y1="11" x2="10" y2="17"></line>
              <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
          </Button>
        </div>
      ))}
    </div>
  );
};

export default PresetManager;
