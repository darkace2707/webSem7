const {Schema, model} = require('mongoose');

const schema = new Schema({
    cityName: {
        type : String,
        required: true
    }
});

module.exports = model('Favorites', schema);