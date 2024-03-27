'use client'

import React from 'react'
import Image from 'next/image';
import "./DashboardComponent.css"
import { IDashboard } from '@/interfaces/interfaces';

const DashboardComponent = (props:IDashboard) => {
  return (
    <div className='w-[1200px]'>
      <div className="mainBody font-Thabit">
        <div className="leftPanel">
          <div id="location" className='text-[36px]'>{props.city}</div>
          <div>
            <img src="" alt="weather icon" />
            <div id="description" className='text-[20px]' >{props.description}</div>
          </div>

          <div id="date" className='text-[24px]'>[Date]</div>
          <div id="time" className='text-[24px]'>[Time]</div>


        </div>
        <div className="rightTopPanel">
          <div id="currentTemp" className='text-[96px]'>{props.currentTemp}</div>
          <div id="currentHL" className='text-[36px]'>[H: L:]</div>
        </div>

        <div className="rightBottomPanel">
          <div id="day1" className="dayName">[Day]</div>
          <div id="day2" className="dayName">[Day]</div>
          <div id="day3" className="dayName">[Day]</div>
          <div id="day4" className="dayName">[Day]</div>
          <div id="day5" className="dayName">[Day]</div>

          <div className="dayHL1 dayHighLow">
            <Image src={""} alt="weather icon" className='w-[40px] h-[40px]' />
            <div>[H:]</div>
            <div>[L:]</div>
          </div>
          <div className="dayHL2 dayHighLow">
            <Image src={""} alt="weather icon" className='w-[40px] h-[40px]' />
            <div>[H:]</div>
            <div>[L:]</div>
          </div>
          <div className="dayHL3 dayHighLow">
            <Image src={""} alt="weather icon" className='w-[40px] h-[40px]' />
            <div>[H:]</div>
            <div>[L:]</div>
          </div>
          <div className="dayHL4 dayHighLow">
            <Image src={""} alt="weather icon" className='w-[40px] h-[40px]' />
            <div>[H:]</div>
            <div>[L:]</div>
          </div>
          <div className="dayHL5 dayHighLow">
            <Image src={""} alt="weather icon" className='w-[40px] h-[40px]' />
            <div>[H:]</div>
            <div>[L:]</div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default DashboardComponent