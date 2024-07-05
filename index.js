const express = require('express');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3000;

app.get('/api/hello', async (req, res) => {
  const visitor = req.query.visitor_name || 'Guest';
  const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

  try {
    // Fetch location data from ip-api.com
    const response = await axios.get(`http://ip-api.com/json/${clientIp}`);
    const locationData = response.data;

    if (locationData.status === 'success') {
      const { country, city, lat, lon } = locationData;
      const location = `${city}, ${country}`;
      const temperature = '28°C'; // For simplicity, using a fixed temperature

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
