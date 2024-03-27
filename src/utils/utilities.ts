import { ILocation } from "@/interfaces/interfaces";
import { GetCurrentWeatherData } from "./DataServices";

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

export const convertKelvin = (temp: number, unit: 'C' | 'F'): number => {
    if (unit === 'C') {
        return temp - 273.15; // Kelvin to Celsius
    } else if (unit === 'F') {
        return (temp - 273.15) * 9/5 + 32; // Kelvin to Fahrenheit
    } else {
        throw new Error('Invalid unit. Use "C" for Celsius or "F" for Fahrenheit.');
    }
}