import { Router } from 'express';
const router = Router();

// Import HistoryService and WeatherService
import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

// POST request to get weather data for a city
router.post('/', async (req, res) => {
  const { cityName } = req.body;

  if (!cityName) {
    return res.status(400).json({ error: 'City name is required.' });
  }

  try {
    // Get weather data using WeatherService (await the promise if it's asynchronous)
    const weatherData = await WeatherService.getWeatherForCity(cityName);

    // Save city search to history using HistoryService
    await HistoryService.addCity(cityName);

    // Send weather data as the response
    return res.json({ weather: weatherData });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to retrieve weather data.' });
  }
});

// GET request to retrieve search history
router.get('/history', async (_req, res) => {
  try {
    // Retrieve search history using HistoryService
    const history = await HistoryService.getCities();
    res.json({ history });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve search history.' });
  }
});

// DELETE request to remove a city from search history by id
router.delete('/history/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Delete city from history using HistoryService
    await HistoryService.removeCity(id);
    res.status(200).json({ message: 'City removed from search history.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete city from search history.' });
  }
});

export default router;














