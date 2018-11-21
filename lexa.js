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

//switch is set for the command the user gave, looking for the correct keywords
switch (command){
    case "spotify-this":

        //checking to see if a song was provide, if not defaults to the sign
        let spotifySearch = "";
        if(searchTerm===""){
            spotifySearch="the+sign"
        }else{
            spotifySearch=searchTerm;
        }

        //call out to spotify for 5 results.
        spotify.search({ 
            type: 'track', query: spotifySearch, limit: 5
        }).then(function(response) {

            //checking to see if any responses came back. if none, let the user know.
            if(response.items.length === 0){
                console.log("No songs by that title found.")
            }
            //each song sent back, we print out the info for it.
            response.tracks.items.forEach(function(result){
                console.log();
                console.log ("Artist(s):  "+result.artists[0].name);
                console.log ("Song Title: "+result.name);
                console.log ("Album:      "+result.album.name);
                console.log ("On Spotify: "+result.external_urls.spotify);
            })
            
        })
        //incase something goes wrong
        .catch(function(err) {
            console.log("No song by that name found");
        });
        break;

    case "concert-this":
        //using axios to call out to bandsintown and get back results
        queryUrl = "https://rest.bandsintown.com/artists/" + searchTerm + "/events?app_id=codingbootcamp";
        axios.get(queryUrl).then(function(response){

            //for each gig a band has, print out the info
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
        })
        //if something goes wrong...
        .catch(function(err){
            console.log ("Band not found");
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
        })
        //incase something goes wrong.
        .catch(function(err){
            console.log("No movies by that name found");
        });
        break;
    case "do-what-it-says":
        console.log("FreeStyle huh?...lets see....")
        break;
    default:
        console.log("I havent been programmed to do that yet...");
        break;
}