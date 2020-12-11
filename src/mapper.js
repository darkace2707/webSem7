const capitalizeWords = (string) => {
    return string.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
};

const convertDegToDirection = (deg) => {
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
};

module.exports.capitalizeWords = capitalizeWords;
module.exports.convertDegToDirection = convertDegToDirection;