const {Router} = require('express');
const Fav = require('../models/Fav');
const wd = require('../src/weatherData');
const router = Router();


async function getCities(favs) {
    const cities = [];
    for await (const fav of favs) {
        let promise = new Promise((resolve, reject) => {
            wd.weatherData(fav.cityName, async (err, city) => {
                if (err) {
                    console.log("One");
                    throw err;
                } else {
                    resolve(city)
                }

            });
        });
        cities.push(await promise);

    }
    return cities.reverse();
}

router.get('/', async (req, res) => {
    const favs = await Fav.find({});

    console.log(favs);

    try {
        const cities = await getCities(favs);

        res.render('index', {
            isIndex: true,
            cities: cities
        });
    } catch (e) {
        console.log(e)
    }
});

router.get('/weather/city', async (req, res) => {
        console.log("get", req.query.q);
        const q = req.query.q;
        const fav = await Fav.findOne( { 'cityName': q});
        if (fav === null) {
            await wd.weatherData(q, (error, {city, temperature, icon, windDirection, windSpeed, clouds, pressure, humidity, latitude, longitude}) => {
                if (error) {
                    console.log("Error:", error);
                    res.status(error);
                    return res.send({
                        error
                    });
                }
                res.send({
                    city,
                    temperature,
                    icon,
                    windDirection,
                    windSpeed,
                    clouds,
                    pressure,
                    humidity,
                    latitude,
                    longitude
                });

            });
        } else {
            res.send({'error':'City is in the list'});
        }

});

router.get('/weather/coordinates', async (req, res) =>{
    const lat = req.query.lat;
    const lon = req.query.lon;
    await wd.weatherDataCoordinates(lat, lon, (error, {city, temperature, icon, windDirection, windSpeed, clouds, pressure, humidity, latitude, longitude}) => {
        if (error) {
            console.log("Error:", error);
            return res.send({
                error
            });
        }
        res.send({
            city,
            temperature,
            icon,
            windDirection,
            windSpeed,
            clouds,
            pressure,
            humidity,
            latitude,
            longitude
        });

    });
});

router.delete('/favourites', async (req, res) => {
    const q = req.query.q;
    console.log("Delete: ", q);
    await Fav.findOneAndDelete({cityName: req.query.q}, err => {
        if(err) {
            console.log(err);
            res.status(520);
            return res.send({error: 'Unknown error'})
        }
        console.log("Successful deletion");
    });
    res.status(200);
    return res.send({status: '200'})
});

router.post('/favourites', async (req, res) => {
    const fav = new Fav({
        cityName: req.body.cityName
    });

    await fav.save();

    console.log("post", req.body.cityName);
    res.status(200);
});

router.get('/favourites', async (req, res) => {
    const favs = await Fav.find({});
    console.log("get fav", req.query.q);
    res.send({q: req.query.q});
});

module.exports = router;