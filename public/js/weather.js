const apiKey = "264ff3b567aeb96b74094339070df7ca";
const kelvin = 273;
const stdCity = "Saint Petersburg";

// let firstLoadFlag = Boolean(true);

let cityData = {
    city: "Moscow!",
    temperature: 6,
    iconID: "xx",
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
    },
    cod: 200,
    message: ""
};

let cities = document.querySelector("main .cities");

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
    return `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`;
}

function requestWeatherCoordinatesData(latitude, longitude) {
    return `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`
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
    cityData.cod = data.cod;
    cityData.message = data.message;
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
        return response.json();
    }).then(async function (data) {
        if (data.cod === 200) {
            await setCityData(data);
            console.log("success");
        } else {
            cityData.cod = data.cod;
            cityData.message = data.message;
            console.log(data.cod);
        }
    });
}


async function setPosition(position) {
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;
    console.log(latitude);
    await getWeather(requestWeatherCoordinatesData(latitude, longitude));

    if (cityData.cod === 200) {
        displayWeather(mainCityElement, cityData);
        document.querySelector("main .main-city .info").style.display = "block";
        document.querySelector("main .main-city .weather-list").style.display = "block";
        document.getElementById("main-loader").style.display = "none";
    } else {
        alert(cityData.cod + "\n" + cityData.message)
    }
}

async function showError(error) {
    alert(error.message);
    await getWeather(requestWeatherCityData(stdCity));
    displayWeather(mainCityElement, cityData);
    document.querySelector("main .main-city .info").style.display = "block";
    document.querySelector("main .main-city .weather-list").style.display = "block";
    document.getElementById("main-loader").style.display = "none";
}

function getMainCityWeather() {
    navigator.geolocation.getCurrentPosition(setPosition, showError);
}

async function getCityCardWeather(cityName, firstLoadFlag) {
    let loader = document.getElementById("loader-wrapper");
    loader.style.display = "block";

    if (localStorage.getItem(cityName) === null || firstLoadFlag) {
        console.log("first");
        await getWeather(requestWeatherCityData(cityName));

        if (cityData.cod === 200) {
            displayWeather(cityElement, cityData);
            let clone = document.importNode(t.content, true);
            loader.style.display = "none";

            cities.insertBefore(clone, loader.nextSibling);
            document.getElementsByClassName("delete")[0].addEventListener("click", deleteCityCard);
            if (!firstLoadFlag) localStorage.setItem(cityData.city, cityData.city);

        } else {
            alert(cityData.cod + "\n" + cityData.message);
            loader.style.display = "none";
        }
    } else if (localStorage.getItem(cityName) !== null && !firstLoadFlag) {
        alert("City is in the list.");
        loader.style.display = "none";
    }

}



function form(event) {

    console.log(event.path[0]);
    const formData = new FormData(event.path[0]);
    const cityName = capitalizeWords(formData.get("city-name").toLowerCase());
    console.log(cityName);
    event.path[0].reset();
    event.preventDefault();
    if (cityName.length !== 0) {
        getCityCardWeather(cityName, false);
    } else {
        alert("No city selected.");
    }

    return false;
}



function refreshMainCity() {
    console.log("refresh");

    document.querySelector("main .main-city .info").style.display = "none";
    document.querySelector("main .main-city .weather-list").style.display = "none";
    document.getElementById("main-loader").style.display = "block";

    getMainCityWeather();
}



function deleteCityCard(event) {
    deleteButton = event.path[0];
    console.log("delete");
    let cityCard = deleteButton.parentNode.parentNode;
    localStorage.removeItem(cityCard.querySelector(".main-info h3").innerHTML);
    cityCard.parentNode.removeChild(cityCard);
}



async function getCardsWeather() {
    for(let i = localStorage.length - 1; i >= 0; i--) {
        let city = localStorage.key(i);
        await getCityCardWeather(city,true);
    }
    firstLoadFlag = false;
}


function offline() {
    let loaderWrapper = document.getElementById("loader-wrapper");
    let loader = document.getElementById("main-loader");
    if (loader.style.display === "block") {
        document.querySelector("main .main-city .info").style.display = "block";
        document.querySelector("main .main-city .weather-list").style.display = "block";
        loader.style.display = "none";
    }
    if (loaderWrapper.style.display === "block") {
        loaderWrapper.style.display = "none";
    }
    console.log("you're offline");
    alert("Connection lost.");
}




getMainCityWeather();
getCardsWeather();

document.getElementsByClassName("bigbtn")[0].addEventListener("click", refreshMainCity);


window.addEventListener('online', (e) => console.log(e, "you're online"));
window.addEventListener('offline', (e) => offline());

document.getElementById('add-city').addEventListener("submit", form);