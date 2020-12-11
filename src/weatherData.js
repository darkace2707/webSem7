const constants = require("../config");
const request = require("request");
const mapper = require("./mapper");

const kelvin = 273.15;

async function doRequest(url, callback) {
    await request({url, json:true}, async (error, {body}) => {
        if (error) {
            throw error;
        } else {
            if (body.cod === 200) {
                const city = {
                    city: body.name,
                    temperature: Math.floor(body.main.temp - kelvin),
                    icon: body.weather[0].icon,
                    windDirection: mapper.convertDegToDirection(body.wind.deg),
                    windSpeed: body.wind.speed,
                    clouds: mapper.capitalizeWords(body.weather[0].description),
                    pressure: body.main.pressure,
                    humidity: body.main.humidity,
                    latitude: body.coord.lat,
                    longitude: body.coord.lon,
                };
                return callback(undefined, city);
            } else {
                return callback(body.cod, {});
            }
        }
    })
}

const weatherData = async (q, callback) => {
    const url = constants.openWeatherMap.BASE_URL + "q=" + encodeURIComponent(q) + "&appid=" + constants.openWeatherMap.API_KEY;
    if (q) {
        return await doRequest(url, callback);
    } else {
        return callback("No city Selected", {});
    }
};

const weatherDataCoordinates = async (lat, lon, callback) => {
    const url = constants.openWeatherMap.BASE_URL + "lat=" + encodeURIComponent(lat) + "&lon=" + encodeURIComponent(lon) + "&appid=" + constants.openWeatherMap.API_KEY;
    if (lat && lon) {
        await doRequest(url, callback);
    } else {
        callback("No coordinates", {});
    }
};


module.exports.weatherData = weatherData;
module.exports.weatherDataCoordinates = weatherDataCoordinates;