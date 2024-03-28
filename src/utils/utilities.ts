import { IDailyWeather, ILocation, IWeatherForecastData } from "@/interfaces/interfaces";
import { GetCurrentWeatherData } from "./DataServices";

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

export const GetLocation = async () => {

    let lat = 44.34;
    let lon = 10.99;

    const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
    });

    lat = position.coords.latitude;
    lon = position.coords.longitude;

    return { lat, lon };
}

export const GetWeatherIcon = (weather: string, description: string, nighttime: boolean = false) => {


    const cloudKeys: Record<string, string> = {
        'few clouds': 'Partly Cloudy',
        'scattered clouds': 'Cloudy',
        'broken clouds': 'Overcast Cloudy',
        'overcast clouds': 'Overcast Cloudy'
    }

    const nightKeys: Record<string, string> = {
        'Clear': 'Clear Night',
        'Partly Cloudy': 'Partly Cloudy Night'
    }

    const weatherIcons: Record<string, string | any> = {
        'Tornado': cloudFog,
        'Snow': snowflake,
        'Thunderstorm': cloudLightning,
        'Rain': cloudRain,
        'Drizzle': cloudDrizzle,
        'Mist': cloudFog,
        'Smoke': cloudFog,
        'Haze': cloudFog,
        'Dust': cloudFog,
        'Fog': cloudFog,
        'Sand': cloudFog,
        'Ash': cloudFog,
        'Squall': cloudFog,
        'Cloudy': cloud,
        'Clear': sun,
        'Clear Night': moon,
        'Partly Cloudy': cloudSun,
        'Partly Cloudy Night': cloudMoon,
        'Overcast Cloudy': cloudOvercast
    };

    let currentWeather = weather;

    if (currentWeather == 'Clouds') {
        currentWeather = cloudKeys[description];
    }

    if (nighttime && currentWeather in nightKeys) {
        currentWeather = nightKeys[currentWeather];
    }

    // console.log(weatherIcons[currentWeather]);
    return weatherIcons[currentWeather]

}

export const GetForecastArray = (forecastData: IWeatherForecastData) => {
    let res: IDailyWeather[] = [];

    let tomorrow = getDayOfWeek(forecastData.city.timezone);
    console.log(tomorrow);

    let tomorrowDictionary: Record<string, string> = {
        'Sun' : 'Mon',
        'Mon' : 'Tue',
        'Tue' : 'Wed',
        'Wed' : 'Thu',
        'Thu' : 'Fri',
        'Fri' : 'Sat',
        'Sat' : 'Sun',
    }

    for (let i = 0; i < 5; i++) {
        tomorrow = tomorrowDictionary[tomorrow];        
        res.push({
            day: tomorrow,
            high: "",
            low: "",
            weatherIcon: ""
        });
    }

    return res
}

function getDayOfWeek(timezoneOffset:number): string {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date((getCurrentEpochTime() + timezoneOffset) * 1000).getUTCDay();
    return days[today];
}

export const getCurrentEpochTime = (): number => {
    return Math.floor(Date.now() / 1000);
  };