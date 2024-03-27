'use client'

import DashboardComponent from "@/components/Dashboard/DashboardComponent";
import FooterComponent from "@/components/Footer/FooterComponent";
import NavBarComponent from "@/components/NavBar/NavBarComponent";
import SearchBarComponent from "@/components/SearchBar/SearchBarComponent";
import { IDashboard, ILocation, IWeatherData } from "@/interfaces/interfaces";
import { GetCurrentWeatherData, GetWeatherForecastData } from "@/utils/DataServices";
import { GetLocation, convertKelvin } from "@/utils/utilities";
// import { GetLocation } from "@/utils/utilities";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Home() {

  const nowhere: ILocation = {
    type: null,
    lon: null,
    lat: null,
    city: null
  }

  const emptyDashboard: IDashboard = {
    city: "",
    description: "",
    date: "",
    time: "",
    currentTemp: "",
    units: "F",
    currentHigh: "",
    currentLow: "",
    weatherIcon: "",
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
    if(currentWeatherData){
    const myDashboard: IDashboard = {
      city: currentWeatherData.name,
      description: currentWeatherData.weather[0].description,
      date: "",
      time: "",
      currentTemp: "",
      units: "F",
      currentHigh: `${convertKelvin(currentWeatherData.main.temp, unit)}`,
      currentLow: "",
      weatherIcon: "",
      forecast: []
    }

    setDashboard(myDashboard);      
    }


  }, [currentWeatherData])

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
            date={dashboard.date}
            time={dashboard.time}
            currentTemp={dashboard.currentTemp}
            units={dashboard.units}
            currentHigh={dashboard.currentHigh}
            currentLow={dashboard.currentLow}
            weatherIcon={dashboard.weatherIcon}
            forecast={dashboard.forecast}
          />
        </div>
      </div>
      <FooterComponent />
    </div>
  );
}
