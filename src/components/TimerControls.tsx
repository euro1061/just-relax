import React from 'react';

interface TimerControlsProps {
  timerActive: boolean;
  timerDuration: number; // Duration in minutes
}

const TimerControls: React.FC<TimerControlsProps> = ({ timerActive, timerDuration }) => {
  if (!timerActive) {
    return null; // Don't render anything if timer is not active
  }

  return (
    <div className="mt-4 p-4 bg-green-100 rounded-md">
      <p className="text-green-800">Timer: {timerDuration} minutes remaining</p>
    </div>
  );
};

export default TimerControls;
