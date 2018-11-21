# 10-Lexa
node axios calls for bands, movies, and spotify

## Description:
A node app, when ran it looks for input in the form of ARGV commands. the first of which (after the needed calls to run the program)
is what function the user wants to run, and then what ever the user wants to search (multi-word inputs accepted).

> node lexa.js [command] [search terms]

### Current-Commands:
* spotify-this-song [song name]
* movie-this [movie title]
* concert-this [band name]
* do-what-it-says [no input](runs a command saved in a text file)

## Requirements:
run npm install to automatically install necessary files, with the exception being node.js
>npm install
### required
* axios
* node-spotify-api
* moment
* dotenv

## Technology used:
* Node.js
* Axios
* node-spotify-api
* moment
* dotenv

## Breakdown:
when the user runs the file and passes it the arguments outline in description, the first argument is used on a switch statement
this selects which lines of code to run for the desired outcome. I could have broken each case statement to simply run a function, but I opted not to do that.
my choice made it a little bit harder to read, next time I would break each api into its own function call instead.

after the switch statement, the remaining arguments passed by the user are formated so that inbetween each word is a +, a format the api can use.
the api calls are then made and the data returned is then formated and printed out for easier readabiliy from the user.

in the case of do-what-it-says, the file is read parsed and the function containing the switch statement is called again, this time with the parsed info from the file.
