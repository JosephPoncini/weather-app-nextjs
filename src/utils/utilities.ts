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
    let lon = 83.04;

    try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
        });

        console.log(position)
        lat = position.coords.latitude;
        lon = position.coords.longitude;

    } catch (error) {
        console.error('No location given:', error);
        // Handle error here
    }


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

export const getCurrentEpochTime = (): number => {
    return Math.floor(Date.now() / 1000);
};

export function deepClone<T>(obj: T): T {
    if (typeof obj !== 'object' || obj === null) {
        return obj; // Return the value if its not an object
    }

    // Create a new object/array to hold the cloned properties
    const clone: any = Array.isArray(obj) ? [] : {};

    // Clone each property recursively
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            clone[key] = deepClone(obj[key]);
        }
    }

    return clone;
}

export function isCityCountryFormat(location: string) {
    const regex = /^[a-zA-Z\s]+,\s[a-zA-Z\s]+$/;
    return regex.test(location);
}

export function isZipCode(zip: string) {
    const regex = /^\d{5}(?:-\d{4})?(?:,\s?[A-Z]{2})?$/;
    return regex.test(zip);
}