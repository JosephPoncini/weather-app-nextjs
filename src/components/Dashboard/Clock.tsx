'use client'

import React, { useState, useEffect } from 'react';

interface ClockProps {
  epochTime: number;
  timezoneOffset: number;
}

const Clock: React.FC<ClockProps> = (props) => {
  const [currentTime, setCurrentTime] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(prevTime => prevTime + 1);

    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const date = new Date((props.epochTime + props.timezoneOffset + currentTime) * 1000); // Convert seconds to milliseconds

  //console.log(date)
  const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long', timeZone: 'UTC' });
  const month = date.toLocaleDateString('en-US', { month: 'short', timeZone: 'UTC' });
  const day = date.getUTCDate();
  const year = date.getUTCFullYear();
  const dateString = `${dayOfWeek} ${month}. ${day}, ${year}`;

  const timeString = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' });

  return (
    <>
      <div id="date" className='text-[24px] text-center'>{dateString}</div>
      <div id="time" className='text-[24px] text-center'>{timeString}</div>
    </>
  );
};

export default Clock;
