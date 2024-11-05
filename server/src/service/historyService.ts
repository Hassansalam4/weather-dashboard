import { promises } from "fs";
const { readFile, writeFile } = promises;
import { v4 as uuidv4 } from 'uuid';
// Define a City class with name and id properties
class City {
  name: string;
  id: string;

  constructor(name: string, id: string) {
    this.name = name;
    this.id = id;
  }
}

// TODO: Complete the HistoryService class
class HistoryService {
  // TODO: Define a read method that reads from the searchHistory.json file
  private async read() {
    const data = await readFile('searchHistory.json', 'utf-8');
return data

  }

  // TODO: Define a write method that writes the updated cities array to the searchHistory.json file
  private async write(cities: City[]) {
    await writeFile('searchHistory.json', JSON.stringify(cities, null, 2));
  }

  // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  async getCities() {
    try {
let cities:City[];
cities=JSON.parse(await this.read())
      return cities 
    } catch (error) {
      console.error('Error reading cities:', error);
      return [];
    }
  }
  // TODO: Define an addCity method that adds a city to the searchHistory.json file
  async addCity(cityName: string) {
    try {
      const cities:City[] = await this.getCities();
      const newId = uuidv4()
      const newCity = new City(cityName, newId);
      cities.push(newCity);
      await this.write(cities);
    } catch (error) {
      console.error('Error adding city:', error);
    }
  }
  // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
  async removeCity(id: string) {
    try {
      const cities = await this.getCities();
      const updatedCities = cities.filter(city => city.id !== id);
      await this.write(updatedCities);
    } catch (error) {
      console.error('Error removing city:', error);
    }
  }
}

export default new HistoryService();
