function getLocation(callback) {
    console.log("Getting the user's location...");
    setTimeout(() => {
        // Code to retrieve the location
        const location = "Boston"
        console.log(`Location is ${location}`);
        console.log("");
        callback(location, getNextSighting);
    }, 2000);
};

function getCoords(location, callback) {
    console.log("Getting coordinates for Boston...");
    setTimeout(() => {
        // Code to retrieve the coordinates
        const coords = "42/71";
        console.log(`Coordinates for ${location} are ${coords}`);
        console.log("");
        callback(coords, displayNextSighting);
    }, 2000);
};

function getNextSighting(coords, callback) {
    console.log("Getting next ISS sighting time for 42/71...");
    setTimeout(() => {
        // Code to retrieve the next sighting time
        console.log(`Next sighting time for ${coords} retrieved.`);
        console.log("");
        const sightingTime = "Thu Oct 5, 7:33 PM";
        callback(sightingTime);
    }, 2000);
};

function displayNextSighting(sightingTime) {
    console.log(`The next ISS sighting time in your area is: ${sightingTime}`);
}

getLocation((location) => {
    getCoords(location, (coords) => {
        getNextSighting(coords, (nextSighting) => {
            displayNextSighting(nextSighting);
        })
    })
});
