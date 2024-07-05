const express = require('express');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3000;

const OPENWEATHERMAP_API_KEY = '045d22c917a325e8b4c2855770ec9f4e';

app.get('/api/hello', async (req, res) => {
  const visitor = req.query.visitor_name || 'Guest';
  const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;


  
  try {
    // Fetch location data from ip-api.com
    const locationResponse = await axios.get(`http://ip-api.com/json/${clientIp}`);
    const locationData = locationResponse.data;

    if (locationData.status === 'success') {
      const { country, city, lat, lon } = locationData;
      const location = `${city}, ${country}`;

      // Fetch temperature data from OpenWeatherMap
      const weatherResponse = await axios.get(`http://api.openweathermap.org/data/2.5/weather`, {
        params: {
          lat,
          lon,
          appid: OPENWEATHERMAP_API_KEY,
          units: 'metric' 
        }
      });
      const weatherData = weatherResponse.data;
      const temperature = `${weatherData.main.temp}°C`;

      res.json({
        client_ip: clientIp,
        location,
        latitude: lat,
        longitude: lon,
        greeting: `Hello, ${visitor}! The temperature is ${temperature} in ${location}`,
      });
    } else {
      res.json({
        client_ip: clientIp,
        location: 'Unknown',
        greeting: `Hello, ${visitor}!`,
        error: locationData.message,
      });
    }
  } catch (error) {
    res.json({
      client_ip: clientIp,
      location: 'Unknown',
      greeting: `Hello, ${visitor}!`,
      error: error.message,
    });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
