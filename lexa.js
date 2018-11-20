//REQUIRE
require("dotenv").config();
const Spotify = require('node-spotify-api');
const axios = require("axios");
const moment = require('moment');

//getting keys to enable spotify search
const keys = require('./keys.js');

//CREEATING GLOBAL NECESSARY VARIABLES
const spotify = new Spotify(keys.spotify);
const nodeArgs = process.argv;

//getting some variables from the node Args array for human reading
const command = nodeArgs[2];
const searchTerm = (nodeArgs.slice(3)).join("+");
let queryUrl = "";

//formatting searchTerm into something usable for API query

console.log (command,searchTerm);

switch (command){
    case "spotify-this":
        console.log("spotify");
        queryUrl = "gi"
        break;
    case "concert-this":
        queryUrl = "https://rest.bandsintown.com/artists/" + searchTerm + "/events?app_id=codingbootcamp";
        axios.get(queryUrl).then(function(response){
            //TODO format the TIME#####################################################################################################################
            response.data.forEach(function(gig){
                let date = gig.datetime.split("T");
                let formatedDate = moment(date[0]).format("MM/DD/YYYY");
                let venue = gig.venue
                console.log(`
Venue name: ${venue.name}
Location:   ${venue.city}, ${venue.region}, ${venue.country}
Date of show: ${formatedDate} 
                `)
            });
        });
        break;
    case "movie-this":
        queryUrl = "http://www.omdbapi.com/?t=" + searchTerm + "&y=&plot=short&apikey=trilogy";
        axios.get(queryUrl).then(function(response) {
            let movie = response.data
            console.log(`
Movie Title:  ${movie.Title}
Release Date: ${movie.Released}
IMDB Rating:  ${movie.imdbRating}
Rotten T:     ${movie.Ratings[1].Value}
Country of O: ${movie.Country}
Language:     ${movie.Language}
Movie Plot:   ${movie.Plot}
Actors:       ${movie.Actors}
            `)
        });
        break;
    default:
        console.log("I havent been programmed to do that yet...");
        break;
}