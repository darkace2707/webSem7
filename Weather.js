const apiKey = "264ff3b567aeb96b74094339070df7ca";
const kelvin = 273;
const stdCity = "Saint Petersburg";

const cityData = {
    city: "Moscow!",
    temperature: 6,
    incoID: "xx",
    wind: {
        speed: 61.0,
        direction: "North1-northwest"
    },
    clouds: "Brok1en Clouds",
    pressure: 10113,
    humidity: 512,
    coordinates: {
        latitude: 519.88,
        longitude: 310.42
    }
};

let cities = document.getElementsByClassName("cities");

let t = document.querySelector('#city-card');

let cityElement = {
    nameElement: t.content.querySelector(".data .main-info h3"),
    degreesElement: t.content.querySelector(".data .main-info .degrees"),
    iconElement: t.content.querySelector(".data .main-info .weather-icon"),
    windElement: t.content.querySelector(".data .weather-list .wind .description"),
    cloudElement: t.content.querySelector(".data .weather-list .cloud .description"),
    pressureElement: t.content.querySelector(".data .weather-list .pressure .description"),
    humidityElement: t.content.querySelector(".data .weather-list .humidity .description"),
    coordinatesElement: t.content.querySelector(".data .weather-list .coordinates .description")
};

// let cityElement = {
//     nameElement: document.querySelector("#city-card .data .main-info h3"),
//     degreesElement: document.querySelector("#city-card .data .main-info .degrees"),
//     iconElement: document.querySelector("#city-card .data .main-info .weather-icon"),
//     windElement: document.querySelector("#city-card .data .weather-list .wind .description"),
//     cloudElement: document.querySelector("#city-card .data .weather-list .cloud .description"),
//     pressureElement: document.querySelector("#city-card .data .weather-list .pressure .description"),
//     humidityElement: document.querySelector("#city-card .data .weather-list .humidity .description"),
//     coordinatesElement: document.querySelector("#city-card .data .weather-list .coordinates .description")
// };



let mainCityElement = {
    nameElement: document.querySelector("main .main-city .info h2"),
    degreesElement: document.querySelector("main .main-city .info .wrapper .degrees"),
    iconElement: document.querySelector("main .main-city .info .wrapper  .weather-icon"),
    windElement: document.querySelector("main .main-city .weather-list .wind .description"),
    cloudElement: document.querySelector("main .main-city .weather-list .cloud .description"),
    pressureElement: document.querySelector("main .main-city .weather-list .pressure .description"),
    humidityElement: document.querySelector("main .main-city .weather-list .humidity .description"),
    coordinatesElement: document.querySelector("main .main-city .weather-list .coordinates .description")
};



function convertDegToDirection(deg) {
    if ((deg >= 0 && deg < 23) || (deg >= 337 && deg <= 360)) {
        return "North";
    } else if (deg >= 23 && deg < 68) {
        return "North-East";
    } else if (deg >= 68 && deg < 113) {
        return "East";
    } else if (deg >= 113 && deg < 158) {
        return "South-East";
    } else if (deg >= 158 && deg < 203) {
        return "South";
    } else if (deg >= 203 && deg < 248) {
        return "South-West";
    } else if (deg >= 248 && deg < 293) {
        return "West";
    } else if (deg >= 293 && deg < 337) {
        return "North-West";
    }
}

function capitalizeWords(string) {
    return string.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
}

function requestWeatherCityData(cityName) {
    return `http://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`;
}

function requestWeatherCoordinatesData(latitude, longitude) {
    return `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`
}

function setCityData(data) {
    cityData.city = data.name;
    cityData.temperature = Math.floor(data.main.temp - kelvin);
    cityData.icon = data.weather.icon;
    cityData.wind.direction = convertDegToDirection(data.wind.deg);
    cityData.wind.speed = data.wind.speed;
    cityData.clouds = capitalizeWords(data.weather[0].description);
    cityData.pressure = data.main.pressure;
    cityData.humidity = data.main.humidity;
    cityData.coordinates.latitude = data.coord.lat;
    cityData.coordinates.longitude = data.coord.lon;
}

function displayWeather(city, cityData) {
    city.nameElement.innerHTML = cityData.city;
    city.degreesElement.innerHTML = cityData.temperature + '&#8451;';
    // city.iconElement.innerHTML = cityData.icon;
    city.windElement.innerHTML = cityData.wind.speed + "m/s" + ", " + cityData.wind.direction;
    city.cloudElement.innerHTML = cityData.clouds;
    city.pressureElement.innerHTML = cityData.pressure + ' hpa';
    city.humidityElement.innerHTML = cityData.humidity + '%';
    city.coordinatesElement.innerHTML = "[" + cityData.coordinates.latitude + ", " + cityData.coordinates.longitude + "]";
}



async function getWeather(requestURL) {
    // alert(requestURL);
    await fetch(requestURL).then(function (response) {
        let data = response.json();
        return data;
    }).then(function (data) {
        setCityData(data);
    });
}


async function setPosition(position) {
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;
    await getWeather(requestWeatherCoordinatesData(latitude, longitude));
    // alert(cityData.city);
    displayWeather(mainCityElement, cityData);
}

async function showError(error) {
    alert(error.message);
    await getWeather(requestWeatherCityData(stdCity));
    displayWeather(mainCityElement, cityData);
}

function getMainCityWeather() {
    navigator.geolocation.getCurrentPosition(setPosition, showError);
}



async function form() {
    const formData = new FormData(document.getElementById('add-city'));
    const cityName = formData.get("city-name");
    if (cityName.length !== 0) {
        alert(cityName);
        await getWeather(requestWeatherCityData(cityName));
        displayWeather(cityElement, cityData);
        let clone = document.importNode(t.content, true);
        cities[0].appendChild(clone);
        // document.getElementById('add-city').action = requestCityData(cityName);
    } else {
        alert("no city");
    }
}



getMainCityWeather();

// let t = document.querySelector('#city-card');
// console.log(cityElement.nameElement);
// let clone = document.importNode(t.content, true);
// let clone2 = document.importNode(t.content, true);
// cities[0].appendChild(clone);
// cities[0].appendChild(clone2);
// console.log(cities[0]);
// cityElement
// console.log(formData);