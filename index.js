const express = require('express');
const mongoose = require('mongoose');
const exphps = require('express-handlebars');
const favsRoutes = require('./routes/favs');

const path = require('path');

const viewsPath = path.join(__dirname, 'views');
const publicPath = path.join(__dirname, 'public');
const publicJsPath = path.join(publicPath, 'js');

const PORT = process.env.PORT || 3000;

const hbs = exphps.create({
    defaultLayout: 'main',
    extname: 'hbs'
});

const app = express();
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');

app.use(express.urlencoded({ extended: true }));
app.use(favsRoutes);
app.use('/', express.static(viewsPath));
app.use('/', express.static(publicPath));
app.use('/', express.static(publicJsPath));


async function start() {
    try {
        await mongoose.connect('mongodb+srv://dan:1234asdd@cluster0.ulub7.mongodb.net/favs', {
            useNewUrlParser: true,
            useFindAndModify: false,
            useUnifiedTopology: true
        });

        app.listen(PORT, () => {
            console.log('Server has been started.')
        });
    } catch (e) {
        console.log(e)
    }
}


start();
