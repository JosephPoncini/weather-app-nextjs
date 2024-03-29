'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image';
import "./DashboardComponent.css"
import { IDashboard } from '@/interfaces/interfaces';
import emptyStar from '@/assets/Empty Star.png'
import filledStar from '@/assets/Filled Star.png'

import cloud from "@/assets/WeatherIcons/Cloud.png";
import cloudFog from "@/assets/WeatherIcons/CloudFog.png";
import cloudLightning from "@/assets/WeatherIcons/CloudLightning.png";
import cloudMoon from "@/assets/WeatherIcons/CloudMoon.png";
import cloudOvercast from "@/assets/WeatherIcons/CloudOvercast.png";
import cloudRain from "@/assets/WeatherIcons/CloudRain.png";
import cloudDrizzle from "@/assets/WeatherIcons/CloudDrizzle.png";
import cloudSun from "@/assets/WeatherIcons/CloudSun.png";
import moon from "@/assets/WeatherIcons/Moon.png";
import snowflake from "@/assets/WeatherIcons/Snowflake.png";
import sun from "@/assets/WeatherIcons/Sun.png";

import Clock from './Clock';



const DashboardComponent = (props: IDashboard) => {


  return (
    <div className='w-[1200px]'>
      <div className="mainBody font-Thabit">
        <div className="leftPanel">
          <div id="location" className='text-[36px] w-[90%] relative flex justify-center'>
            {props.star?
            <Image
            onClick={props.favoriteClickHandle}
              src={props.star} // Assuming props.weatherIcon is the URL of the weather icon
              alt="favorited icon"
              className="absolute top-2 right-0 w-8 h-auto cursor-pointer "
            /> : null             
            }

            <div>
              {props.city}
            </div>
          </div>
          <div>
            <Image src={props.weatherIcon} alt="weather icon" />
            <div id="description" className='text-[20px] text-center' >{props.description}</div>
          </div>
          <Clock timezoneOffset={props.timezone} epochTime={props.epoch} />
        </div>

        <div className="rightTopPanel">
          <div id="currentTemp" className='text-[96px] tracking-[-0.1em]'>{props.currentTemp + "°" + props.units}</div>
          <div id="currentHL" className='text-[36px]'>H:{props.todayHighLow.high}°{props.units} L:{props.todayHighLow.low}</div>
        </div>

        <div className="rightBottomPanel">
          {
            props.forecast ? props.forecast.map((x, idx) => {
              let id = `day${idx + 1}`;
              return (
                <div key={idx} id={id} className="dayName">{x.day}</div>
              )
            }) : null
          }

          {
            props.forecast ? props.forecast.map((x, idx) => {
              let className = `dayHL${idx + 1} dayHighLow `;
              return (
                <div key={idx} className={className}>
                  <Image src={x.weatherIcon} alt="weather icon" className='w-[40px] h-[40px]' />
                  <div>H:{x.highLow.high + "°" + props.units}</div>
                  <div>L:{x.highLow.low + "°" + props.units}</div>
                </div>
              )
            }) : null
          }

        </div>

      </div>
    </div>
  )
}

export default DashboardComponent