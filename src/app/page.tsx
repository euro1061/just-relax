'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import { Volume2, Save, Upload, Timer, Shuffle, Play, Pause } from 'lucide-react';
import { Howl, Howler } from 'howler';
import Image from 'next/image';
import { Separator } from "@/components/ui/separator"

interface Sound {
  name: string;
  icon: string;
  file: string;
  tags: string[];
  howl?: Howl;
}

const sounds: Sound[] = [
  { name: 'ฝน', icon: '/icons/rain.png', file: '/sounds/rain.wav', tags: ['ธรรมชาติ', 'น้ำ'] },
  { name: 'ฟ้าร้อง', icon: '/icons/thunder.png', file: '/sounds/thunder.wav', tags: ['ธรรมชาติ', 'พายุ'] },
  { name: 'นกร้อง', icon: '/icons/bird.png', file: '/sounds/bird.wav', tags: ['ธรรมชาติ', 'สัตว์'] },
  { name: 'แคมป์ไฟ', icon: '/icons/campfire.png', file: '/sounds/campfire.wav', tags: ['ธรรมชาติ', 'ไฟ'] },
  { name: 'คลื่นทะเล', icon: '/icons/sea.png', file: '/sounds/sea-wave.wav', tags: ['ธรรมชาติ', 'น้ำ'] },
  { name: 'ลมหนาว', icon: '/icons/wind-cold.png', file: '/sounds/wind-cold.wav', tags: ['ธรรมชาติ', 'ลม'] },
  { name: 'คนคุยกัน', icon: '/icons/people.png', file: '/sounds/people.wav', tags: ['มนุษย์', 'สังคม'] },
  { name: 'แม่น้ำลำธาร', icon: '/icons/river.png', file: '/sounds/river.wav', tags: ['ธรรมชาติ', 'น้ำ'] },
  { name: 'จักจั่น', icon: '/icons/cicada.png', file: '/sounds/cicada.wav', tags: ['ธรรมชาติ', 'สัตว์', 'แมลง'] },
  { name: 'ถ้ำ', icon: '/icons/cave.png', file: '/sounds/cave.wav', tags: ['ธรรมชาติ', 'สถานที่'] },
  { name: 'กลางคืนในป่า', icon: '/icons/night-in-wild.png', file: '/sounds/night-in-wild.wav', tags: ['ธรรมชาติ', 'กลางคืน'] },
  { name: 'นกฮูก', icon: '/icons/owl.png', file: '/sounds/owl.wav', tags: ['ธรรมชาติ', 'สัตว์', 'กลางคืน'] },
  { name: 'มีความสุข', icon: '/icons/happy.png', file: '/sounds/happy.mp3', tags: ['ดนตรี', "ความรู้สึก"] },
  { name: 'เศร้า ๆ', icon: '/icons/sadness.png', file: '/sounds/sadness.mp3', tags: ['ดนตรี', "ความรู้สึก"] },
];

const IconComponent = ({ icon, className }: { icon: string; className?: string }) => {
  return <Image src={icon} alt="sound icon" width={48} height={48} className={className} />;
};

export default function Home() {
  const [activeSounds, setActiveSounds] = useState<string[]>([]);
  const [volumes, setVolumes] = useState<{ [key: string]: number }>({});
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [presets, setPresets] = useState<{ name: string; sounds: string[]; volumes: { [key: string]: number } }[]>([]);
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
      setPresets(JSON.parse(savedPresets));
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

  const loadPreset = (preset: { name: string; sounds: string[]; volumes: { [key: string]: number } }) => {
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

        <div className="mb-4 p-4 bg-white rounded-lg shadow flex items-center space-x-4">
          ควบคุม : &nbsp;
          <Button onClick={toggleMasterPlay}>
            {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
          </Button>
          <Volume2 className="text-green-600 w-6 h-6" />
          <Slider
            value={[masterVolume]}
            onValueChange={(newVolume) => changeMasterVolume(newVolume[0])}
            max={100}
            step={1}
            className="w-64"
          />
          <span className="text-sm font-medium">{masterVolume}%</span>
        </div>
        <Separator className='mb-4' />
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left column: Sound selection */}
          <div className="w-full md:w-2/3">
            <div className="mb-4 flex flex-wrap gap-2">
              <Button
                variant={activeFilter === null ? "default" : "outline"}
                onClick={() => setActiveFilter(null)}
              >
                ทั้งหมด
              </Button>
              {allTags.map(tag => (
                <Button
                  key={tag}
                  variant={activeFilter === tag ? "default" : "outline"}
                  onClick={() => setActiveFilter(tag)}
                >
                  {tag}
                </Button>
              ))}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredSounds.map((sound) => (
                <Card
                  key={sound.name}
                  className={`cursor-pointer transition-all ${activeSounds.includes(sound.name) ? 'ring-2 ring-green-500' : ''
                    }`}
                  onClick={() => toggleSound(sound.name)}
                >
                  <CardContent className="flex flex-col items-center justify-center p-4">
                    <IconComponent icon={sound.icon} className="w-10 h-10 mb-2" />
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
              ))}
            </div>
          </div>

          {/* Right column: Active sounds list and Presets */}
          <div className="w-full md:w-1/3">
            <h2 className="text-xl font-semibold mb-4">เสียงที่เล่นตอนนี้</h2>
            {activeSounds.length === 0 ? (
              <p className="text-gray-500">ไม่มีเสียงที่เล่นอยู่ตอนนี้</p>
            ) : (
              <div className="space-y-4">
                {activeSounds.map(soundName => (
                  <Card key={soundName} className="p-4">
                    <div className="flex items-center space-x-4 mb-2">
                      <IconComponent
                        icon={sounds.find(s => s.name === soundName)?.icon || ''}
                        className="w-8 h-8"
                      />
                      <span className="font-medium">{soundName}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Volume2 className="text-green-600 w-5 h-5" />
                      <Slider
                        value={[volumes[soundName] || 50]}
                        onValueChange={(newVolume) => changeVolume(soundName, newVolume[0])}
                        max={100}
                        step={1}
                        className="w-full"
                      />
                      <span className="text-sm font-medium w-12 text-right">
                        {volumes[soundName] || 50}%
                      </span>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {/* Presets section */}
            <h2 className="text-xl font-semibold mt-8 mb-4">พรีเซ็ทเสียง</h2>
            {presets.length === 0 ? (
              <p className="text-gray-500">ยังไม่มีพรีเซ็ทเสียงที่บันทึกไว้</p>
            ) : (
              <div className="space-y-2">
                {presets.map((preset, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => loadPreset(preset)}
                    >
                      <Upload className="w-4 h-4 mr-2" /> {preset.name}
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="flex-shrink-0"
                      onClick={() => deletePreset(preset.name)}
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
            )}

            {/* Timer display */}
            {timerActive && (
              <div className="mt-4 p-4 bg-green-100 rounded-md">
                <p className="text-green-800">Timer: {timerDuration} minutes remaining</p>
              </div>
            )}
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