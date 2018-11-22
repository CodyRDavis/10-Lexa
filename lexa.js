//REQUIRE

require("dotenv").config();
const Spotify = require('node-spotify-api');
const axios = require("axios");
const moment = require('moment');
const fs = require("fs");

//getting keys to enable spotify search
const keys = require('./keys.js');

//CREEATING GLOBAL NECESSARY VARIABLES
const spotify = new Spotify(keys.spotify);
const nodeArgs = process.argv;

//getting some variables from the node Args array for human reading
const command = nodeArgs[2];
const searchTerm = (nodeArgs.slice(3)).join("+");
lexaBrain(command,searchTerm);



//switch is set for the command the user gave, looking for the correct keywords
function lexaBrain (service, search) {
    let queryUrl ="";
    switch (service){
        case "spotify-this-song":

            //checking to see if a song was provide, if not defaults to the sign
            let spotifySearch = "";
            if(search===""){
                spotifySearch="the+sign"
            }else{
                spotifySearch=search;
            }

            //call out to spotify for 5 results.
            spotify.search({ 
                type: 'track', query: spotifySearch, limit: 5
            }).then(function(response) {

                //checking to see if any items in response, if none let user know
                if(response.track.items.length===0){
                    console.log("No song by that name found.")
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
            queryUrl = "https://rest.bandsintown.com/artists/" + search + "/events?app_id=codingbootcamp";
            axios.get(queryUrl.replace("+", " ")).then(function(response){

                if(response.data.length === 0){
                    console.log ("No band by that name found.");
                }

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
            queryUrl = "http://www.omdbapi.com/?t=" + search + "&y=&plot=short&apikey=trilogy";
            axios.get(queryUrl).then(function(response) {
                let movie = response.data
                if (movie.length === 0){
                    console.log("No movie by that name found");
                }
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
            console.log("FreeStyle huh?...lets see....");
            //reading my file and getting its contents
            fs.readFile("random.txt", "utf8", function(err, data) {
                if(err){
                    console.log("I wasn't able to read that...")
                }
                console.log(data);
                //removes "" around song name, then splits the command in two. one for command. one for searchterm.
                let response = data.replace(/"+/g, '').split(",");;
                lexaBrain(response[0],response[1]);
            });
            break;
        default:
            console.log("I havent been programmed to do that yet...");
            break;
    }
}