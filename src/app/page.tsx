'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import { Volume2, Save, Upload, Timer, Shuffle, Play, Pause } from 'lucide-react';
import { Howl, Howler } from 'howler';
import Image from 'next/image';
import { Separator } from "@/components/ui/separator";
import { sounds, Sound } from '../data/sounds';
import TagFilters from '../components/TagFilters';
import SoundGrid from '../components/SoundGrid';
import ActiveSoundList from '../components/ActiveSoundList';
import SoundControls from '../components/SoundControls';
import PresetManager, { Preset } from '../components/PresetManager';
import TimerControls from '../components/TimerControls';

export default function Home() {
  const [activeSounds, setActiveSounds] = useState<string[]>([]);
  const [volumes, setVolumes] = useState<{ [key: string]: number }>({});
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [presets, setPresets] = useState<Preset[]>([]);
  const [timerDuration, setTimerDuration] = useState<number>(0);
  const [timerActive, setTimerActive] = useState<boolean>(false);
  const [masterVolume, setMasterVolume] = useState<number>(100);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const allTags = Array.from(new Set(sounds.flatMap(sound => sound.tags)));

  useEffect(() => {
    sounds.forEach(sound => {
      sound.howl = new Howl({
        src: [sound.file],
        loop: true,
        volume: 0.5,
      });
    });

    const savedPresets = localStorage.getItem('soundPresets');
    if (savedPresets) {
      setPresets(JSON.parse(savedPresets) as Preset[]);
    }

    return () => {
      sounds.forEach(sound => sound.howl?.unload());
    };
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (timerActive && timerDuration > 0) {
      timer = setTimeout(() => {
        stopAllSounds();
        setTimerActive(false);
      }, timerDuration * 60 * 1000);
    }
    return () => clearTimeout(timer);
  }, [timerActive, timerDuration]);

  const toggleSound = (soundName: string) => {
    setActiveSounds(prev => {
      if (prev.includes(soundName)) {
        const sound = sounds.find(s => s.name === soundName);
        sound?.howl?.stop();
        const newActiveSounds = prev.filter(s => s !== soundName);
        setIsPlaying(newActiveSounds.length > 0);
        return newActiveSounds;
      } else {
        const sound = sounds.find(s => s.name === soundName);
        sound?.howl?.play();
        setIsPlaying(true);
        return [...prev, soundName];
      }
    });

    if (!(soundName in volumes)) {
      setVolumes(prev => ({ ...prev, [soundName]: 50 }));
    }
  };

  const changeVolume = (soundName: string, newVolume: number) => {
    setVolumes(prev => ({ ...prev, [soundName]: newVolume }));
    const sound = sounds.find(s => s.name === soundName);
    sound?.howl?.volume(newVolume / 100);
  };

  const savePreset = () => {
    const presetName = prompt("Enter a name for this preset:");
    if (presetName) {
      const newPresets = [...presets, { name: presetName, sounds: activeSounds, volumes }];
      setPresets(newPresets);
      localStorage.setItem('soundPresets', JSON.stringify(newPresets));
    }
  };

  const deletePreset = (presetName: string) => {
    const newPresets = presets.filter(preset => preset.name !== presetName);
    setPresets(newPresets);
    localStorage.setItem('soundPresets', JSON.stringify(newPresets));
  };

  const loadPreset = (preset: Preset) => {
    stopAllSounds();
    preset.sounds.forEach(soundName => {
      const sound = sounds.find(s => s.name === soundName);
      sound?.howl?.play();
      sound?.howl?.volume(preset.volumes[soundName] / 100);
    });
    setActiveSounds(preset.sounds);
    setVolumes(preset.volumes);
    setIsPlaying(true);
  };

  const stopAllSounds = useCallback(() => {
    activeSounds.forEach(soundName => {
      const sound = sounds.find(s => s.name === soundName);
      sound?.howl?.stop();
    });
    setActiveSounds([]);
    setIsPlaying(false);
  }, [activeSounds]);

  const startTimer = () => {
    const duration = prompt("Enter timer duration in minutes:");
    if (duration) {
      setTimerDuration(Number(duration));
      setTimerActive(true);
    }
  };

  const randomizeSounds = () => {
    stopAllSounds();
    const randomCount = Math.floor(Math.random() * 4) + 2; // Random 2 to 5 sounds
    const randomSounds = sounds
      .sort(() => 0.5 - Math.random())
      .slice(0, randomCount)
      .map(sound => sound.name);

    randomSounds.forEach(soundName => {
      const sound = sounds.find(s => s.name === soundName);
      sound?.howl?.play();
      const randomVolume = Math.floor(Math.random() * 50) + 25; // Random volume between 25-75
      sound?.howl?.volume(randomVolume / 100);
      setVolumes(prev => ({ ...prev, [soundName]: randomVolume }));
    });
    setActiveSounds(randomSounds);
    setIsPlaying(true);
  };

  const toggleMasterPlay = () => {
    if (isPlaying) {
      Howler.stop();
      setIsPlaying(false);
    } else {
      activeSounds.forEach(soundName => {
        const sound = sounds.find(s => s.name === soundName);
        sound?.howl?.play();
      });
      setIsPlaying(true);
    }
  };

  const changeMasterVolume = (newVolume: number) => {
    setMasterVolume(newVolume);
    Howler.volume(newVolume / 100);
  };

  const filteredSounds = activeFilter
    ? sounds.filter(sound => sound.tags.includes(activeFilter))
    : sounds;

  return (
    <div className="min-h-screen bg-green-50">
      <div className="bg-green-600">
        <div className="container mx-auto">
          <header className="text-white p-4 flex justify-between items-center flex-col xl:flex-row md:flex-row">
            <h1 className="text-2xl font-bold">Just Relax</h1>
            <div className="flex space-x-2 mt-3 xl:mt-0 md:mt-0">
              <Button variant="outline" className="bg-green-500 hover:bg-green-400 text-white" onClick={savePreset}>
                <Save className="w-4 h-4 mr-2" /> บันทึกพรีเซ็ท
              </Button>
              <Button variant="outline" className="bg-green-500 hover:bg-green-400 text-white" onClick={startTimer}>
                <Timer className="w-4 h-4 mr-2" /> ตั้งเวลาหยุด
              </Button>
              <Button variant="outline" className="bg-green-500 hover:bg-green-400 text-white" onClick={randomizeSounds}>
                <Shuffle className="w-4 h-4 mr-2" /> สุ่มเสียง
              </Button>
            </div>
          </header>
        </div>
      </div>

      <main className="container mx-auto mt-8 p-4">
        <p className="text-gray-500 text-left mb-8 hidden xl:block md:block text-sm">
          <b>JustRelax</b> เป็นเว็บแอปพลิเคชันที่ช่วยให้คุณผ่อนคลายและเพิ่มสมาธิด้วยการฟังเสียงธรรมชาติและเสียงแวดล้อมต่างๆ ผู้ใช้สามารถเลือกและผสมผสานเสียงได้หลากหลาย ปรับระดับเสียงแต่ละเสียงได้ตามต้องการ และบันทึกการตั้งค่าเป็นชุดเสียงโปรดเพื่อใช้ในครั้งต่อไป นอกจากนี้ยังมีฟีเจอร์ตั้งเวลาปิดเสียงอัตโนมัติและการสุ่มเลือกเสียง เหมาะสำหรับการนั่งสมาธิ การทำงาน หรือการพักผ่อน ใช้งานง่ายและปรับแต่งได้ตามความชอบของแต่ละคน
        </p>

        <SoundControls
          isPlaying={isPlaying}
          onToggleMasterPlay={toggleMasterPlay}
          masterVolume={masterVolume}
          onChangeMasterVolume={changeMasterVolume}
        />
        <Separator className='mb-4' />
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left column: Sound selection */}
          <div className="w-full md:w-2/3">
            <TagFilters
              allTags={allTags}
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
            />
            <SoundGrid
              sounds={filteredSounds}
              activeSounds={activeSounds}
              onToggleSound={toggleSound}
            />
          </div>

          {/* Right column: Active sounds list and Presets */}
          <div className="w-full md:w-1/3">
            <h2 className="text-xl font-semibold mb-4">เสียงที่เล่นตอนนี้</h2>
            <ActiveSoundList
              activeSounds={activeSounds}
              allSounds={sounds}
              volumes={volumes}
              onChangeVolume={changeVolume}
            />

            {/* Presets section */}
            <h2 className="text-xl font-semibold mt-8 mb-4">พรีเซ็ทเสียง</h2>
            <PresetManager
              presets={presets}
              onLoadPreset={loadPreset}
              onDeletePreset={deletePreset}
            />

            {/* Timer display */}
            <TimerControls
              timerActive={timerActive}
              timerDuration={timerDuration}
            />
          </div>
        </div>
      </main>
      <footer className="bg-green-600 text-white py-4 mt-8">
        <div className="container mx-auto text-center text-sm">
          © {new Date().getFullYear()} Relaxing Sounds. All rights reserved.
        </div>
      </footer>
    </div>
  );
}