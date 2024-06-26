export interface ILocation {
  type: "Geo" | "City" | "Zip" | "CityCountry" | null;
  lon: number | null;
  lat: number | null;
  city: string | null;
  country: string | null;
  zip : string | null
}

export interface IDailyWeather {
  day: string
  weatherIcon: string
  highLow: IHighLow
}

export interface IHighLow {
  high: number
  low: number
}

export interface IForecast {
  TodayHighLow: IHighLow
  forecast: IDailyWeather[]
}

export interface IDashboard {
  city: string
  description: string
  epoch: number
  timezone: number
  currentTemp: string
  units: "F" | "C"
  weatherIcon: string
  todayHighLow: IHighLow
  forecast: IDailyWeather[]
  star: string
  favoriteClickHandle: () => void
}

export interface INavBar {
  searchClickHandle: (search:string) => void
}

export interface IWeatherData {
  coord: {
    lon: number;
    lat: number;
  };
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  base: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
    sea_level: number;
    grnd_level: number;
  };
  visibility: number;
  wind: {
    speed: number;
    deg: number;
    gust: number;
  };
  rain: {
    "1h": number;
  };
  clouds: {
    all: number;
  };
  dt: number;
  sys: {
    type: number;
    id: number;
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone: number;
  id: number;
  name: string;
  cod: number;
}

export interface IWeatherForecastData {
  cod: string;
  message: number;
  cnt: number;
  list: WeatherItem[];
  city: {
    id: number;
    name: string;
    coord: {
      lat: number;
      lon: number;
    };
    country: string;
    population: number;
    timezone: number;
    sunrise: number;
    sunset: number;
  };
}

interface WeatherItem {
  dt: number;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    sea_level: number;
    grnd_level: number;
    humidity: number;
    temp_kf: number;
  };
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  clouds: {
    all: number;
  };
  wind: {
    speed: number;
    deg: number;
    gust: number;
  };
  visibility: number;
  pop: number;
  rain: {
    '3h': number;
  };
  sys: {
    pod: string;
  };
  dt_txt: string;
}

export interface IBadSearch {cod: '404', message: 'city not found'}