// Import required modules.
const express = require('express');
const fetch = require('node-fetch');
const path = require("path");
const router = express.Router();
// Import validation functions from express-validator for request validation
const { check, query,  validationResult } = require('express-validator');

// OpenWeatherMap API Key
const apiKey = '233833cfbf1c06809c6f5d3184215af8';

// A list of city IDs (from OpenWeatherMap's city list dataset)
const cityIds = [
    5128581,  // New York
    2643743,  // London
    1850147,  // Tokyo
    2988507,  // Paris
    2147714,  // Sydney
    2950159,  // Berlin
    524901,   // Moscow
    292223,   // Dubai
    6167865,  // Toronto
    1816670,  // Beijing
    5368361,  // Los Angeles
    1880252,  // Singapore
    2955804,  // Milan
    745044,   // Buenos Aires
    1816670,  // Shanghai
    1273294,  // Mumbai
    264371,   // Istanbul
    703448,   // Kyiv
    456172,   // Johannesburg
    3169070,  // Caracas
    2988507   // Santiago
];

// Validation middleware for the weather form
const formValidation = [
    check('city')
        .trim() // Removes the whitespace
        .not().isEmpty() // If it is empty then the message below would be what would appear
        .withMessage('Please enter a name')
        .isAlpha()
        .withMessage('City name must contain only letters.'),
    check('country')
        .optional()
        .isAlpha()
        .withMessage('Country name must contain only letters.'),
    check('unit')
        .trim() // Removes the whitespace
        .not().isEmpty() // If it is empty then the message below would be what would appear
        .withMessage('Temperature unit is required.'),
];

// Array to hold added cities
let addedCities = [];

// Helper function to format time from Unix timestamp and timezone offset
function formatTime(unixTimestamp, timezoneOffset) {
    // Converts to milliseconds for the utc time.
    const utcDate = new Date(unixTimestamp * 1000);
    // Adjusts for timezone offset
    const localTime = new Date(utcDate.getTime() + timezoneOffset * 1000);

    let hours = localTime.getUTCHours();
    const minutes = localTime.getUTCMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    // Converts to 12-hour format
    hours = hours % 12;
    // Converts hour '0' to '12'
    hours = hours ? hours : 12;
    return `${hours}:${minutes} ${ampm}`;
}

// Helper function to get random city IDs
function getRandomCityIds(cityIds, numberOfCities = 5) {
    const shuffled = cityIds.sort(() => 0.5 - Math.random()); // Shuffle the array
    return shuffled.slice(0, numberOfCities); // Return the first n random city IDs
}

// Renders the index.pug file when this route is chosen awt the start of the running.
router.get('/', (req, res) => {
    res.render('index', { user: req.user });
})

// Route for the weather form
router.post('/', formValidation, async (req, res) => {
    //extracts the validation errors from a request
    const errors = validationResult(req);

    // If errors exist
    if (!errors.isEmpty()) {
        //return status 422 and errors array as a json object (API)
        return res.status(422).json({
            errors: errors.array()
        });
    }

    // Destructure the city, country, and unit from the request body (If the input is correct)
    const { city, country, unit } = req.body;
    // Prepare query string
    const queryString = `?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country || '')}&unit=${unit}`;
    // Redirect to the submit route with query parameters
    res.redirect(`/weather/submit${queryString}`);
});

// Route to handle weather search and display random cities from the API
router.get('/submit', async (req, res) => {
    const { city, country, unit } = req.query;

    // Add searched city to the list of cities if it's not already added
    if (city) {
        // Add city to list if not already present
        if (!addedCities.includes(city)) {
            addedCities.push(city);
        }
    }

    try {
        // Prepare the URLs for the user-entered city and random cities
        const weatherDataPromises = [];

        // Fetch weather for user-entered city if it exists
        if (city) {
            const cityUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city},${country || ""}&units=${unit}&appid=${apiKey}`;
            weatherDataPromises.push(fetch(cityUrl).then(async (response) => {
                const data = await response.json();

                if (data.cod !== 200) {
                    return { cityName: city, error: data.message };
                }

                // Format the time
                const formattedTime = formatTime(data.dt, data.timezone);
                // Fetch hourly forecast
                const hourlyForecast = await fetchHourlyWeatherData(data.id, unit);

                // Return structured weather data, including hourly forecast.
                return {
                    cityName: data.name,
                    temperature: data.main.temp,
                    weather: data.weather[0].description,
                    wind: data.wind.speed,
                    humidity: data.main.humidity,
                    time: formattedTime,
                    icon: data.weather[0].icon,
                    hourlyForecast
                };
            }));
        }

        // Gets random city IDs every time the page is loaded
        const randomCityIds = getRandomCityIds(cityIds, 10); // Fetch 10 random city IDs

        // Fetch weather data for the random cities using their city IDs
        const randomWeatherDataPromises = randomCityIds.map(async (cityId) => {
            // URL for random city weather data
            const url = `https://api.openweathermap.org/data/2.5/weather?id=${cityId}&units=${unit}&appid=${apiKey}`;

            // 'fetch()' sends an HTTP request to the specified URL and returns a promise
            const response = await fetch(url);
            //Reads the response supplied by the API as a JSON promise.
            const data = await response.json();

            // Check if the response contains an error
            if (data.cod !== 200) {
                return { cityName: `City ID: ${cityId}`, error: data.message };
            }

            // Formats the time
            const formattedTime = formatTime(data.dt, data.timezone);
            // Fetches hourly forecast
            const hourlyForecast = await fetchHourlyWeatherData(data.id, unit);

            // Return structured weather data and include hourly forecast.
            return {
                cityName: data.name,
                temperature: data.main.temp,
                weather: data.weather[0].description,
                wind: data.wind.speed,
                humidity: data.main.humidity,
                time: formattedTime,
                icon: data.weather[0].icon,
                hourlyForecast
            };
        });

        // Combines user-entered city weather data and random city weather data
        const weatherData = await Promise.all([...weatherDataPromises, ...randomWeatherDataPromises]);
        // Renders the template after fetching weather data
        res.render('after_choices', {weatherData, addedCities, selectedUnit: unit});
    } catch (error) {
        // Handles errors such as failed API requests
        res.render('index', { errorMessage: 'Error fetching weather data.', addedCities });
    }
});

// Helper function to fetch hourly weather data
async function fetchHourlyWeatherData(cityId, unit) {
    // URL for fetching hourly weather data
    const url = `https://api.openweathermap.org/data/2.5/forecast?id=${cityId}&units=${unit}&appid=${apiKey}`;
    // Fetches the hourly weather data
    const response = await fetch(url);
    // Parses the JSON response
    const data = await response.json();

    if (data.cod !== "200") {
        throw new Error(data.message);
    }

    // Filters hourly data to get only the next 24 hours
    const currentTime = Date.now() / 1000; // Current time in seconds
    const hourlyData = data.list.filter(item => item.dt <= currentTime + 86400); // 86400 seconds in 24 hours

    // Returns filtered hourly data list
    return hourlyData;
}

// Route to clear the list of cities
router.post('/clear', (req, res) => {
    addedCities = [];
    res.redirect('/weather');
});

router.get("/comments", (req, res) => {
    res.render('form');
})

module.exports = router;