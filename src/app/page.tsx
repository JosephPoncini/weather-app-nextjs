'use client'

import DashboardComponent from "@/components/Dashboard/DashboardComponent";
import FooterComponent from "@/components/Footer/FooterComponent";
import NavBarComponent from "@/components/NavBar/NavBarComponent";
import SearchBarComponent from "@/components/SearchBar/SearchBarComponent";
import { IBadSearch, IDailyWeather, IDashboard, IForecast, IHighLow, ILocation, IWeatherData, IWeatherForecastData } from "@/interfaces/interfaces";
import { GetCurrentWeatherData, GetWeatherForecastData } from "@/utils/DataServices";
import { GetLocation, GetWeatherIcon, deepClone, getCurrentEpochTime, isCityCountryFormat, isZipCode } from "@/utils/utilities";

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


import { use, useEffect, useState } from "react";
import { GetFiveDayData } from "@/utils/forecastUtilities";

import emptyStar from "@/assets/Empty Star.png"
import filledStar from "@/assets/Filled Star.png"
import { getlocalStorage, removeFromLocalStorage, saveToLocalStorage } from "@/utils/LocalSotrage";


export default function Home() {

  const [nowhere, setNowhere] = useState<ILocation>(
    {
      type: null,
      lon: null,
      lat: null,
      city: null,
      country: null,
      zip: null
    }
  )

  // const nowhere: ILocation = {
  //   type: null,
  //   lon: null,
  //   lat: null,
  //   city: null,
  //   country: null,
  //   zip: null
  // }

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
    forecast: [],
    star: "",
    favoriteClickHandle: () => {}
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

  const emptyWeatherForecastData: IWeatherForecastData = {
    cod: "",
    message: 0,
    cnt: 0,
    list: [],
    city: {
      id: 0,
      name: "",
      coord: {
        lat: 0,
        lon: 0,
      },
      country: "",
      population: 0,
      timezone: 0,
      sunrise: 0,
      sunset: 0,
    },
  };


  const [unit, setUnit] = useState<'C' | 'F'>('F');
  const [location, setLocation] = useState<ILocation>(nowhere);
  const [currentWeatherData, setCurrentWeatherData] = useState<IWeatherData | IBadSearch>(emptyWeatherData);
  const [forecastData, setForecastData] = useState<IWeatherForecastData  | IBadSearch>(emptyWeatherForecastData);
  const [dashboard, setDashboard] = useState<IDashboard>(emptyDashboard);
  const [backgroundClassName, setBackgroundClassName] = useState<string>("");

  const [cityName, setCityName] = useState<string>("");
  const [countryName, setCountryName] = useState<string>("");

  const [searchInput, setSearchInput] = useState<string>("");
  const [searchValue, setSearchValue] = useState<string>("");

  const [isFavorited, setIsFavorited] = useState<boolean>(false);
  const [star, setStar] = useState<any>(emptyStar);

  const changeStar = () => {

    if(!isFavorited){
      setIsFavorited(true);
      setStar(filledStar);
      saveToLocalStorage(cityName,countryName)
    }else{
      setIsFavorited(false);
      setStar(emptyStar);
      removeFromLocalStorage(cityName,countryName)
    }
    console.log("isFavorited is " + isFavorited);
  }

  const searchBtn = () => {
    setSearchValue(searchInput);
  }

  const searchUp = (search: string) => {
    setSearchValue(search)
  }

  useEffect(() => {
    if (searchValue) {

      let locationB = {...nowhere};

      if(isCityCountryFormat(searchValue)){
        locationB.type = "CityCountry";
        let cityCountry = searchValue.split(", ");
        locationB.city = cityCountry[0];
        locationB.country = cityCountry[1];
      }else if(isZipCode(searchValue)){
        locationB.type = "Zip";
        let zipCountry = searchValue.split(", ");
        locationB.zip = zipCountry[0];
        locationB.country = zipCountry[1];
      }else {
        locationB.type = "City"
        locationB.city = searchValue;
      }
      
      setLocation(locationB);
    }

  }, [searchValue])

  useEffect(() => {

    const GetGeoLocation = async () => {

      let { lat, lon } = await GetLocation();
      console.log(lat + "," + lon)
      let locationA: ILocation = {
        type: "Geo",
        lon: lon,
        lat: lat,
        city: null,
        country: null,
        zip: null
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
    if (currentWeatherData && currentWeatherData.cod == 200 && forecastData && forecastData.cod == '200') {

      let myForecast: IForecast = GetFiveDayData(forecastData)

      let epochtime = getCurrentEpochTime();
      let isNight = false;
      let sunrise = currentWeatherData.sys.sunrise;
      let sunset = currentWeatherData.sys.sunset;

      if (epochtime < sunrise || epochtime > sunset) {
        isNight = true;
        setBackgroundClassName("background-image-night")
      } else {
        setBackgroundClassName("background-image-day")
      }

      setCityName(currentWeatherData.name);
      setCountryName(currentWeatherData.sys.country)



      let myDashboard = { ...dashboard }

      myDashboard.city = currentWeatherData.name + ", " + currentWeatherData.sys.country;
      myDashboard.description = currentWeatherData.weather[0].description;
      myDashboard.epoch = getCurrentEpochTime();
      myDashboard.timezone = currentWeatherData.timezone;
      myDashboard.currentTemp = `${currentWeatherData.main.temp.toFixed(0)}`;
      myDashboard.units = unit;
      myDashboard.weatherIcon = GetWeatherIcon(currentWeatherData.weather[0].main, currentWeatherData.weather[0].description, isNight);
      myDashboard.todayHighLow = myForecast.TodayHighLow
      myDashboard.forecast = myForecast.forecast




      setDashboard(myDashboard);


    }
  }, [currentWeatherData, forecastData])

  useEffect(() => {
    let favorites: string[] = getlocalStorage();
    if (favorites.includes(cityName + ", " +  countryName)) {
      setStar(filledStar);
      setIsFavorited(true);
    } else {
      setStar(emptyStar);
      setIsFavorited(false);
    }

  },[cityName])

  return (
    <div className={backgroundClassName}>
      <NavBarComponent searchClickHandle={searchUp}/>
      <div className="lg:absolute lg:top-1/2 lg:left-1/2 lg:transform lg:-translate-x-1/2 lg:-translate-y-[31.5vh] flex flex-col items-center">
        <div className="my-8 lg:w-[700px]">
          <SearchBarComponent onChangeHandle={setSearchInput} value={searchInput} searchBtnHandle={searchBtn} />
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
            star = {star}
            favoriteClickHandle={changeStar}
          />  
        </div>
      </div>
      <FooterComponent />
    </div>
  );
}
