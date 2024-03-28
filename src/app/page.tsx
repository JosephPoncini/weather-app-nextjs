'use client'

import DashboardComponent from "@/components/Dashboard/DashboardComponent";
import FooterComponent from "@/components/Footer/FooterComponent";
import NavBarComponent from "@/components/NavBar/NavBarComponent";
import SearchBarComponent from "@/components/SearchBar/SearchBarComponent";
import { IDailyWeather, IDashboard, IForecast, IHighLow, ILocation, IWeatherData, IWeatherForecastData } from "@/interfaces/interfaces";
import { GetCurrentWeatherData, GetWeatherForecastData } from "@/utils/DataServices";
import { GetLocation, GetWeatherIcon, deepClone, getCurrentEpochTime } from "@/utils/utilities";

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


import { useEffect, useState } from "react";
import { GetFiveDayData } from "@/utils/forecastUtilities";


export default function Home() {

  const nowhere: ILocation = {
    type: null,
    lon: null,
    lat: null,
    city: null
  }

  const emptyHighLow: IHighLow = {
    high: 0,
    low: 0,
  }


  const emptyForecast: IForecast = {
    TodayHighLow: emptyHighLow,
    forecast: []
  }

  const emptyDashboard: IDashboard = {
    city: "",
    description: "",
    epoch: getCurrentEpochTime(),
    timezone: 1,
    currentTemp: "",
    units: "F",
    weatherIcon: "",
    todayHighLow: emptyHighLow,
    forecast: []
  }

  const emptyWeatherData: IWeatherData = {
    coord: {
      lon: 0,
      lat: 0,
    },
    weather: [
      {
        id: 0,
        main: "",
        description: "",
        icon: "",
      }
    ],
    base: "",
    main: {
      temp: 0,
      feels_like: 0,
      temp_min: 0,
      temp_max: 0,
      pressure: 0,
      humidity: 0,
      sea_level: 0,
      grnd_level: 0,
    },
    visibility: 0,
    wind: {
      speed: 0,
      deg: 0,
      gust: 0,
    },
    rain: {
      "1h": 0,
    },
    clouds: {
      all: 0,
    },
    dt: 0,
    sys: {
      type: 0,
      id: 0,
      country: "",
      sunrise: 0,
      sunset: 0,
    },
    timezone: 0,
    id: 0,
    name: "",
    cod: 0,
  };


  const [unit, setUnit] = useState<'C' | 'F'>('F');

  const [location, setLocation] = useState<ILocation>(nowhere);
  const [currentWeatherData, setCurrentWeatherData] = useState<IWeatherData>(emptyWeatherData);
  const [forecastData, setForecastData] = useState<any>();
  const [dashboard, setDashboard] = useState<IDashboard>(emptyDashboard);


  // const [location, setLocation] = useState();

  useEffect(() => {

    const GetGeoLocation = async () => {

      let { lat, lon } = await GetLocation();
      let locationA: ILocation = {
        type: "Geo",
        lon: lon,
        lat: lat,
        city: null
      }
      setLocation(locationA);
    }
    GetGeoLocation();
  }, []);

  useEffect(() => {
    const GetWeatherData = async () => {
      const data1 = await GetCurrentWeatherData(location);
      const data2 = await GetWeatherForecastData(location);
      setCurrentWeatherData(data1);
      setForecastData(data2)

    }

    GetWeatherData();

  }, [location])

  useEffect(() => {
    if (currentWeatherData && forecastData) {

      let myForecast: IForecast = GetFiveDayData(forecastData)

      let myDashboard = deepClone(dashboard)
      // const myDashboard: IDashboard = {
      //   city: currentWeatherData.name,
      //   description: currentWeatherData.weather[0].description,
      //   epoch: getCurrentEpochTime(),
      //   timezone: currentWeatherData.timezone,
      //   currentTemp: `${currentWeatherData.main.temp.toFixed(1)}`,
      //   units: unit,
      //   weatherIcon: GetWeatherIcon(currentWeatherData.weather[0].main, currentWeatherData.weather[0].description),
      //   todayHighLow: emptyHighLow,
      //   forecast: [],
      // }
      myDashboard.city = currentWeatherData.name;
      myDashboard.description = currentWeatherData.weather[0].description;
      myDashboard.epoch = getCurrentEpochTime();
      myDashboard.timezone = currentWeatherData.timezone;
      myDashboard.currentTemp = `${currentWeatherData.main.temp.toFixed(1)}`;
      myDashboard.units = unit;
      myDashboard.weatherIcon = GetWeatherIcon(currentWeatherData.weather[0].main, currentWeatherData.weather[0].description);
      myDashboard.todayHighLow = myForecast.TodayHighLow
      myDashboard.forecast = myForecast.forecast


      // console.log(myDashboard.forecast);
      setDashboard(myDashboard);

    }



  }, [currentWeatherData])

  // useEffect(() => {
  //   if (forecastData) {

  //     let myForecast: IForecast = GetFiveDayData(forecastData)
  //     let myDashboard = deepClone(dashboard)

  //     myDashboard.todayHighLow = myForecast.TodayHighLow
  //     myDashboard.forecast = myForecast.forecast

  //     setDashboard(myDashboard);
  //   }
  // }, [forecastData])


  return (
    <div className="background-image">
      <NavBarComponent />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-[31.5vh] flex flex-col items-center">
        <div className="my-8 w-[700px]">
          <SearchBarComponent />
        </div>
        <div>
          <DashboardComponent
            city={dashboard.city}
            description={dashboard.description}
            epoch={dashboard.epoch}
            timezone={dashboard.timezone}
            currentTemp={dashboard.currentTemp}
            units={dashboard.units}
            weatherIcon={dashboard.weatherIcon}
            todayHighLow={dashboard.todayHighLow}
            forecast={dashboard.forecast}
          />
        </div>
      </div>
      <FooterComponent />
    </div>
  );
}
