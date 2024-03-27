import { ILocation } from "@/interfaces/interfaces";
import { APIkey } from "../../env/environment";


export const GetCurrentWeatherData = async (location:ILocation, units:string='imperial') => {

    let promise : Response;
    let data : any;

    switch(location.type){
        case "Geo":
            promise = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lon}&appid=${APIkey}&units=${units}`)
            data = await promise.json();
            break;
        case "City":
            promise = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location.city}&appid=${APIkey}&units=${units}`);
            data = await promise.json();
            break;
        default:
            console.log("No fetch. An error has occured");
    }

    // console.log(data);
    return data;

}

export const GetWeatherForecastData = async (location:ILocation, units:string='imperial') => {

    let promise : Response;
    let data : any;

    // console.log("latitude: " + location.lat);
    // console.log("longitude: " + location.lon);

    switch(location.type){
        case "Geo":
            promise = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${location.lat}&lon=${location.lon}&appid=${APIkey}&units=${units}`)
            data = await promise.json();
            break;
        case "City":
            promise = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${location.city}&appid=${APIkey}&units=${units}`);
            data = await promise.json();
            break;
        default:
            console.log("No fetch. An error has occured");
    }

    // console.log(data);
    return data;

}