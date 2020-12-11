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
    }
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

const fetchWeatherCity = "/weather/city";
const fetchWeatherCoord = "/weather/coordinates";
const fetchFavourites = "/favourites";

const favForm = document.getElementById('add-city');

let loader = document.getElementById("loader-wrapper");

const stdCity = "Saint Petersburg";

const refrshBtn = document.getElementsByClassName("bigbtn")[0];



const capitalizeWords = (string) => {
    return string.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
};

function setCityData(data) {
    cityData.city = data.city;
    cityData.temperature = data.temperature;
    cityData.icon = data.icon;
    cityData.wind.direction = data.windDirection;
    cityData.wind.speed = data.windSpeed;
    cityData.clouds = data.clouds;
    cityData.pressure = data.pressure;
    cityData.humidity = data.humidity;
    cityData.coordinates.latitude = data.latitude;
    cityData.coordinates.longitude = data.longitude;
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

function requestWeatherCityData(cityName) {
    const cityApi = fetchWeatherCity + "?q=" + cityName;
    return fetch(cityApi).then(response => {
        return response.json();
    });
}

function requestWeatherCoordinatesData(lat, lon) {
    const cityApi = fetchWeatherCoord + "?lat=" + lat + "&lon=" + lon;
    return fetch(cityApi).then(response => {
        return response.json();
    });
}

async function displayWeatherCard(data) {
    console.log("displaying:", data.city);

    setCityData(data);

    displayWeather(cityElement, cityData);
    let clone = document.importNode(t.content, true);

    cities.insertBefore(clone, loader.nextSibling);
    document.getElementsByClassName("delete")[0].addEventListener("click", deleteCityCard);
}

function deleteCityCard(event) {
    let deleteButton = event.path[0];
    let cityCard = deleteButton.parentNode.parentNode;

    deleteButton.disabled = true;
    deleteButton.style = "opacity: 0.5";

    const cityName = cityCard.querySelector(".main-info h3").innerHTML;
    console.log("Delete: ", cityName);
    const cityApi = fetchFavourites + "?q=" + cityName;
    fetch(cityApi, {
        method: 'delete'
    }).then(response =>
        response.json().then(data => {
            if (data.error) {
                alert(data.error);
                deleteButton.disabled = false;
                deleteButton.style = "opacity: 1";
            }
            console.log(data);
            cityCard.parentNode.removeChild(cityCard);
        })
    );

}

function refreshMainCity() {
    console.log("refresh");

    document.querySelector("main .main-city .info").style.display = "none";
    document.querySelector("main .main-city .weather-list").style.display = "none";
    document.getElementById("main-loader").style.display = "block";

    displayMainWeather();
}

async function setPosition(position) {
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;
    console.log(latitude);
    await requestWeatherCoordinatesData(latitude, longitude).then(data => {
        if (data.error) {
            alert(data.error)
        } else {
            setCityData(data);
            displayWeather(mainCityElement, cityData);
        }
    });

    document.querySelector("main .main-city .info").style.display = "block";
    document.querySelector("main .main-city .weather-list").style.display = "block";
    document.getElementById("main-loader").style.display = "none";
}

async function showError(error) {
    alert(error.message);
    await requestWeatherCityData(stdCity).then(data => {
        if (data.error) {
            alert(data.error)
        } else {
            setCityData(data);
            displayWeather(mainCityElement, cityData);
        }
    });
    document.querySelector("main .main-city .info").style.display = "block";
    document.querySelector("main .main-city .weather-list").style.display = "block";
    document.getElementById("main-loader").style.display = "none";
}

function displayMainWeather() {
    navigator.geolocation.getCurrentPosition(setPosition, showError);
}

function postCity(cityName) {
    let form = document.createElement('form');

    form.setAttribute('method', 'post');
    form.setAttribute('action', fetchFavourites);

    form.style = "display: none;";

    form.innerHTML = `<input name="cityName" value="${cityName}">`;

    document.body.append(form);

    form.addEventListener("submit", postFavCity);

    form.submit();
}

function postFavCity(event) {
    event.preventDefault();

    const formData = new FormData(e.path[0]);
    const cityName = formData.get("cityName");

    console.log("postcard:", cityName);

    fetch(fetchFavourites, {
        method: 'POST',
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        body: formData
    }).then(response => {
        response.json().then(data => {
            console.log(data);
        })
    });
}

favForm.addEventListener("submit", (e) => {

    loader.style.display = "block";

    const formData = new FormData(e.path[0]);
    const cityName = capitalizeWords(formData.get("cityName").toLowerCase());

    e.path[0].reset();

    e.preventDefault();
    if (cityName !== "") {
        requestWeatherCityData(cityName).then(async data => {
            if (data.error) {
                switch (data.error) {
                    case '404':
                        alert('City not found.');
                        break;
                    default:
                        alert('Unhandled Error')
                }
            } else {
                await displayWeatherCard(data);
                console.log(formData.cityName);
                postCity(cityName);
            }
        });
    } else {
        alert("City does not input");
    }
    loader.style.display = "none";
});

function correctDelete() {
    for (const btn of document.getElementsByClassName("delete")) {
        btn.addEventListener("click", deleteCityCard);
    }
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

window.addEventListener('online', (e) => console.log(e, "you're online"));
window.addEventListener('offline', (e) => offline());


displayMainWeather();

correctDelete();

refrshBtn.addEventListener("click", refreshMainCity);
