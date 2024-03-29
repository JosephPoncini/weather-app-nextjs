import { IDailyWeather, IForecast, IHighLow, IWeatherForecastData } from "@/interfaces/interfaces";
import { GetWeatherIcon, getCurrentEpochTime } from "./utilities";

export function GetFiveDayData(data:IWeatherForecastData, unit:'F'|'C'='F') {

    let timezone = data.city.timezone;
    // --------------------------------------- Get Arrays for forecasted temps, max temps, min temps with estimated temps
    let hourOffset = (((timezone / 3600) % 3) + 3) % 3;

    let midTemps = FillTempArray(data);
    let midMaxTemps = FillMaxTempArray(data);
    let midMinTemps = FillMinTempArray(data);
    let midTimes = FillTimeArray(data, timezone)
    let weathers = FillWeatherArray(data);
    let descriptions = FillDescriptionArray(data);

    //------------------- estimated temps calcs start here
    //#region 


    let firstTime = data.list[0].dt + timezone;
    let lastTime = data.list[39].dt + timezone;
    let startTime = firstTime - (firstTime % 86400) + (hourOffset * 3600);
    let endTime = startTime + 518400;

    let n = (firstTime - startTime) / 10800; // number of three hour segments from midnight today to first time bracket
    let earlierTime = [];
    let earlyZeros = [];
    for (let i = 0; i < n; i++) {
        earlierTime[i] = startTime + (i * 10800);
        earlyZeros[i] = 0;
    }

    let earlyTemps = [];
    for (let i = 0; i < n; i++) {
        let x = [];
        let y = [];
        for (let j = 0; j < 5; j++) {
            x[j] = midTimes[(8 - n) + (j * 8) + i];
            y[j] = midTemps[(8 - n) + (j * 8) + i];
        }
        let regressionLine = linearRegression(x, y);
        earlyTemps[i] = parseFloat((regressionLine.slope * earlierTime[i] + regressionLine.intercept).toFixed(3));
    }

    let earlyMaxTemps = [];
    for (let i = 0; i < n; i++) {
        let x = [];
        let y = [];
        for (let j = 0; j < 5; j++) {
            x[j] = midTimes[(8 - n) + (j * 8) + i];
            y[j] = midMaxTemps[(8 - n) + (j * 8) + i];
        }
        let regressionLine = linearRegression(x, y);
        earlyMaxTemps[i] = parseFloat((regressionLine.slope * earlierTime[i] + regressionLine.intercept).toFixed(3));
    }

    let earlyMinTemps = [];
    for (let i = 0; i < n; i++) {
        let x = [];
        let y = [];
        for (let j = 0; j < 5; j++) {
            x[j] = midTimes[(8 - n) + (j * 8) + i];
            y[j] = midMinTemps[(8 - n) + (j * 8) + i];
        }
        let regressionLine = linearRegression(x, y);
        earlyMinTemps[i] = parseFloat((regressionLine.slope * earlierTime[i] + regressionLine.intercept).toFixed(3));
    }

    let m = (endTime - lastTime) / 10800; // number of three hour segments from last given time slot to midnight of the following day
    let laterTime = [];
    let lateZeros = [];
    for (let i = 1; i < m; i++) {
        laterTime[i - 1] = lastTime + (i * 10800);
        lateZeros[i - 1] = 0;
    }

    let laterMaxTemps = [];
    for (let i = 1; i < m; i++) {
        let x = [];
        let y = [];
        for (let j = 0; j < 5; j++) {
            x[j] = midTimes[(8 - m) + (j * 8) + i];
            y[j] = midMaxTemps[(8 - m) + (j * 8) + i];
        }
        let regressionLine = linearRegression(x, y);
        laterMaxTemps[i - 1] = parseFloat((regressionLine.slope * laterTime[i - 1] + regressionLine.intercept).toFixed(3));
    }

    let laterMinTemps = [];
    for (let i = 1; i < m; i++) {
        let x = [];
        let y = [];
        for (let j = 0; j < 5; j++) {
            x[j] = midTimes[(8 - m) + (j * 8) + i];
            y[j] = midMinTemps[(8 - m) + (j * 8) + i];
        }
        let regressionLine = linearRegression(x, y);
        laterMinTemps[i - 1] = parseFloat((regressionLine.slope * laterTime[i - 1] + regressionLine.intercept).toFixed(3));
    }

    let laterTemps = [];
    for (let i = 1; i < m; i++) {
        let x = [];
        let y = [];
        for (let j = 0; j < 5; j++) {
            x[j] = midTimes[(8 - m) + (j * 8) + i];
            y[j] = midTemps[(8 - m) + (j * 8) + i];
        }
        let regressionLine = linearRegression(x, y);
        laterTemps[i - 1] = parseFloat((regressionLine.slope * laterTime[i - 1] + regressionLine.intercept).toFixed(3));
    }


    //#endregion
    //------------------- estimated temps calcs end here

    // ------------------- arrays assembled
    let temps = [...earlyTemps, ...midTemps, ...laterTemps];
    let maxTemps = [...earlyMaxTemps, ...midMaxTemps, ...laterMinTemps];
    let minTemps = [...earlyMinTemps, ...midMinTemps, ...laterMinTemps];
    let timeArray = [...earlierTime, ...midTimes, ...laterTime];

    //---------------------------------------Get Highs and Lows

    let todaysHigh = GetDaysMaxTemp(maxTemps, 0);

    let todaysLow = GetDaysMinTemp(minTemps, 0);


    let forecast: IDailyWeather[] = [];

    let tomorrow = getDayOfWeek(timezone);
    // console.log(tomorrow);

    let tomorrowDictionary: Record<string, string> = {
        'Sun' : 'Mon',
        'Mon' : 'Tue',
        'Tue' : 'Wed',
        'Wed' : 'Thu',
        'Thu' : 'Fri',
        'Fri' : 'Sat',
        'Sat' : 'Sun',
    }

    for(let i = 1; i < 6; i++){

        tomorrow = tomorrowDictionary[tomorrow];

        let dailyWeather: IDailyWeather = {
            day: tomorrow,
            weatherIcon: GetWeatherIcon(DetermineForecastedWeather(weathers, descriptions, i, m),"",false),
            highLow: {
                high:Math.round(GetDaysMaxTemp(maxTemps, i)),
                low: Math.round(GetDaysMinTemp(minTemps, i))
            }
        }

        forecast.push(dailyWeather)

    }

    // console.log(forecast);


    let todaysHighLow: IHighLow = {
        high: Math.round(todaysHigh),
        low: Math.round(todaysLow)
    }

    let res: IForecast = {
        TodayHighLow: todaysHighLow,
        forecast: forecast
    }

    return res;

}

function FillTempArray(data:IWeatherForecastData) {
    let tempArray = [];

    for (let i = 0; i < 40; i++) {
        tempArray[i] = data.list[i].main.temp;
    }

    return tempArray;
}

function FillMaxTempArray(data:IWeatherForecastData) {
    let tempMaxArray = [];

    for (let i = 0; i < 40; i++) {
        tempMaxArray[i] = data.list[i].main.temp_max;
    }

    return tempMaxArray;
}

function FillMinTempArray(data:IWeatherForecastData) {
    let tempMinArray = [];

    for (let i = 0; i < 40; i++) {
        tempMinArray[i] = data.list[i].main.temp_min;
    }

    return tempMinArray;
}

function FillWeatherArray(data:IWeatherForecastData) {
    let weatherArray = [];

    for (let i = 0; i < 40; i++) {
        weatherArray[i] = data.list[i].weather[0].main;
    }

    return weatherArray;
}

function FillDescriptionArray(data:IWeatherForecastData) {
    let descriptionArray = [];

    for (let i = 0; i < 40; i++) {
        descriptionArray[i] = data.list[i].weather[0].description;
    }

    return descriptionArray;
}

function FillTimeArray(data:IWeatherForecastData, timezone:number) {
    let timeArray = [];

    for (let i = 0; i < 40; i++) {
        timeArray[i] = data.list[i].dt + timezone;
    }

    return timeArray;
}

function GetDaysMaxTemp(temps: number[], dayNumber:number) {
    let maxTemp = temps[dayNumber * 8]
    for (let i = 1; i < 8; i++) {
        if (temps[dayNumber * 8 + i] > maxTemp) {
            maxTemp = temps[dayNumber * 8 + i];
        }
    }
    return maxTemp;
}

function GetDaysMinTemp(temps: number[], dayNumber:number) {
    let minTemp = temps[dayNumber * 8]
    for (let i = 1; i < 8; i++) {
        if (temps[dayNumber * 8 + i] < minTemp) {
            minTemp = temps[dayNumber * 8 + i];
        }
    }
    return minTemp;
}

function linearRegression(x:number[], y:number[]) { //Got help at the following link https://study.com/academy/lesson/line-of-fit-line-of-best-fit-definitions-equations.html#:~:text=has%20no%20correlation.-,The%20line%20of%20best%20fit%20equation%20is%20y%20%3D%20m(x,the%20amount%20below%20the%20line.
    const n = x.length;
    let sumX = 0, sumY = 0;
    for (let i = 0; i < n; i++) {
        sumX += x[i];
        sumY += y[i];
    }
    let x_avg = sumX / n;
    let y_avg = sumY / n;

    let sumXY = 0, sumX2 = 0;
    for (let i = 0; i < n; i++) {
        sumXY += (x[i] - x_avg) * (y[i] - y_avg);
        sumX2 += (x[i] - x_avg) ** 2;
    }

    // Calculate slope (m) and y-intercept (b)
    const slope = sumXY / sumX2;
    const intercept = (y_avg - (slope * x_avg));

    return { slope, intercept };
}

function DetermineForecastedWeather(weathers:string[], descriptions:string[], dayNumber:number, m:number) {
    let weatherOptions = ['Tornado', 'Snow', 'Thunderstorm', 'Rain', 'Drizzle', 'Mist', 'Smoke', 'Haze', 'Dust', 'Fog', 'Sand', 'Ash', 'Squall','Overcast Cloudy', 'Cloudy','Partly Cloudy', 'Clear'];
    let weatherTriggers = new Array(weatherOptions.length).fill(false);
    m = m - 1;

    // console.log('day '+dayNumber)
    // console.log(weathers);
    // console.log(descriptions);

    const cloudKeys: Record<string, string> = {
        'few clouds': 'Partly Cloudy',
        'scattered clouds': 'Cloudy',
        'broken clouds': 'Overcast Cloudy',
        'overcast clouds': 'Overcast Cloudy'
    }


    if (dayNumber == 5) {
        for (let i = 0; i < m; i++) {
            let currentWeather = weathers[8 * (dayNumber - 1) + (8 - m) + i];
            let currentdescription = descriptions[8 * (dayNumber - 1) + (8 - m) + i];
            if(currentWeather == 'Clouds'){
                currentWeather = cloudKeys[currentdescription];
    
            }
            for (let j = 0; j < weatherOptions.length; j++) {
                if (currentWeather == weatherOptions[j]) {
                    weatherTriggers[j] = true;
                }
            }

        }
    } else {
        for (let i = 0; i < 8; i++) {
            let currentWeather = weathers[8 * (dayNumber - 1) + (8 - m) + i];
            let currentdescription = descriptions[8 * (dayNumber - 1) + (8 - m) + i];
            if(currentWeather == 'Clouds'){
                currentWeather = cloudKeys[currentdescription];
            }
            for (let j = 0; j < weatherOptions.length; j++) {
                if (currentWeather == weatherOptions[j]) {
                    weatherTriggers[j] = true;
                }
            }
        }
    }


    for (let i = 0; i < weatherOptions.length; i++) {
        if (weatherTriggers[i]) {
            return weatherOptions[i];
        }
    }

    return "Something went wrong";

}

function getDayOfWeek(timezoneOffset:number): string {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date((getCurrentEpochTime() + timezoneOffset) * 1000).getUTCDay();
    return days[today];
}