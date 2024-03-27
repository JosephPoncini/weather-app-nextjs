import { useEffect, useState } from "react";

const Clock = () => {
    const [time, setTime] = useState<string>(getCurrentTime());
    const [myDate, setMyDate] = useState<string>(getCurrentDate())
  
  
  
    useEffect(() => {
      const intervalId = setInterval(() => {
        setTime(getCurrentTime());
  
      }, 1000); // Update every minute (60 seconds * 1000 milliseconds)
      return () => clearInterval(intervalId); // Clean up the interval on unmount
    }, []);
  
    useEffect(()=> {
      // console.log("The Time:" + time)
      if (time === "12:00 AM") {
        setMyDate(getCurrentDate());
        // console.log("A new day has begun!")
      }
    },[time])
  
    return (
      <>
        <div id="date" className='text-[24px] text-center'>{myDate}</div>
        <div id="time" className='text-[24px] text-center'>{time}</div>
      </>
  
    );
  };
  
  function getCurrentDate(): string {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    };
    const date = new Date().toLocaleDateString('en-US', options);
    return date.replace(',', ''); // Remove the comma after the day of the month
  }
  
  const getCurrentTime = (): string => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    // const seconds = now.getSeconds().toString().padStart(2, '0');
    return convertToNormalTime(`${hours}:${minutes}`);
  };
  
  const convertToNormalTime = (militaryTime: string) => {
    let hour = parseInt(militaryTime.substring(0, 2), 10);
    let minute = militaryTime.substring(3);
  
    let period = (hour >= 12) ? 'PM' : 'AM';
  
    if (hour === 0) {
      hour = 12;
    } else if (hour > 12) {
      hour = hour - 12;
    }
  
    return `${hour}:${minute} ${period}`;
  };

  export default Clock