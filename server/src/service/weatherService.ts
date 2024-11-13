import dotenv from 'dotenv';
dotenv.config();
import axios from 'axios';

interface Coordinates {
  latitude: number;
  longitude: number;
}

class Weather {
  temperature: number;
  humidity: number;
  description: string;

  constructor(temperature: number, humidity: number, description: string) {
    this.temperature = temperature;
    this.humidity = humidity;
    this.description = description;
  }
}

class WeatherService {
  private baseURL?: string;
  private apiKey?: string;
  private _cityName?: string;  // Updated prefix to suppress unused warnings

  constructor() {
    this.baseURL = process.env.API_BASE_URL || '';
    this.apiKey = process.env.API_KEY || '';
    if (!this.apiKey) {
      throw new Error('API key is required');
    }
  }

  private async fetchLocationData(query: string): Promise<any> {
    const url = this.buildGeocodeQuery(query);
    const response = await axios.get(url);
    return response.data;
  }

  private destructureLocationData(locationData: any): Coordinates {
    return {
      latitude: locationData[0].lat,
      longitude: locationData[0].lon,
    };
  }

  private buildGeocodeQuery(query: string): string {
    return `${this.baseURL}/geo/1.0/direct?q=${query}&limit=1&appid=${this.apiKey}`;
  }

  private buildWeatherQuery(coordinates: Coordinates): string {
    return `${this.baseURL}/data/2.5/weather?lat=${coordinates.latitude}&lon=${coordinates.longitude}&appid=${this.apiKey}&units=metric`;
  }

  private async fetchAndDestructureLocationData(city: string): Promise<Coordinates> {
    const locationData = await this.fetchLocationData(city);
    return this.destructureLocationData(locationData);
  }

  private async fetchWeatherData(coordinates: Coordinates): Promise<any> {
    const url = this.buildWeatherQuery(coordinates);
    const response = await axios.get(url);
    return response.data;
  }

  private parseCurrentWeather(response: any): Weather {
    const { temp: temperature, humidity } = response.main;
    const description = response.weather[0].description;
    return new Weather(temperature, humidity, description);
  }

  private buildForecastArray(weatherData: any[]): Weather[] {
    return weatherData.map(data => new Weather(data.temp, data.humidity, data.description));
  }

  async getWeatherForCity(city: string): Promise<{ current: Weather; forecast: Weather[] }> {
    this._cityName = city;
    console.log(`Fetching weather data for ${this._cityName}`); // Using _cityName to avoid warning

    const coordinates = await this.fetchAndDestructureLocationData(city);
    const weatherResponse = await this.fetchWeatherData(coordinates);
    const currentWeather = this.parseCurrentWeather(weatherResponse);

    const forecastData = weatherResponse.daily || [];
    const forecastArray = this.buildForecastArray(forecastData);

    return { current: currentWeather, forecast: forecastArray };
  }
}

export default new WeatherService();