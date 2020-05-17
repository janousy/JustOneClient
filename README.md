SoPra Group 17 - Client 


## Introduction

The goal of our project was to implement Just One as a web application. Just One is a cooperative game. In each round there is one player - he is
called the active player - who needs to guess a mystery word. He
gets some clues from the other players which help him guessing the correct answer.

## Technologies

The project was implemented with the React library and the syntax extension JSX which extends JavaScript. For styling we used Bootstrap and some CSS attributes. As a package manager we used npm. For our iteration planning we used Jira where we created UserStories and Tasks. For team communication we used Slack, Discord and Notion. 

## High-level components

game router

Dashboard


Validation



## Launch and Deployment 

For your local development environment you'll need Node.js >= 8.10. You can download it [here](https://nodejs.org).
Further you need an IDE, we would recommend to use Visual Studio Code you can download it from [here](https://code.visualstudio.com/Download).
After installing this to things you can go to our GitHub repository and clone it, click [here](https://github.com/SOPRA-Group-17/sopra-fs-20-group17-client) to view our Github repository, you need access rights, contact us if we didn`t give access rights yet. After cloning the repository you can open the repository in the IDE you installed before. 

To start the application open the console of your IDE and enter this command:

### `npm install`

This has to be done before starting the application for the first time (only once) or if someone added dependencies that you haven't installed yet. 
Now you are ready run the app in development mode. Enter this command: 

### `npm run dev`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.
n
The page will reload if you make edits.<br>
You will also see any lint errors in the console (use Google Chrome!).

Other usfull commands are:

### `npm run test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### Releases
?????

## Illustrations of the main user flows

First a user must register and login with a username and password. 
After login the user gets redirected to the dashboard. Her he can create or join a lobby. He also has the option to logout or edit his profile.

Dashboard image

 If a user joined or created a lobby he gets redirected to the Lobby-screen, here he can set his status to ready, ff all players are ready the game starts.  If he created the lobby, he can also kick players out of the lobby. 
Lobbyhost image

During one round of the game the user is either the guesser or one of the clue givers. 

### Flow of the guesser:
**Pick a number:** The user must choose a number between 1 and 5.

**Enter guess**: He can see all given clues which are valid. He can either make a guess or skip if he doesn’t want to guess. 

**Evaluation**: On this screen the user can evaluate if he guessed correct or not and see his current score. 

### Flow of the clue giver:
**Report Word:** The user must decide if he knows the term or not.

**Give clue:** User must give a clue for the displayed term.

**Validation:** The user must validate if the given clues are Valid or Invalid and which clues are similar to each other. 

**Evaluation:** On this screen the user can evaluate if the guesser guessed correct or not and see his current score as well as if the clue he gave was valid. 

After evaluation a new round starts if the game is not finished yet else the user gets redirected to the End screen.

End screen image

## Roadmap

Add a chat function, so that user can communicate whith each other.
Add the option to add bots to the game so that the game can be played if there are to few people. 

## Authors and acknoledgments

The client was implemented by Lennart Jung, Jonas Zürcher, Markus Butscher. 
Big thanks to Nik Zaugg for assisting our group during the project aswell as Roy Rutishauser and Alex Scheitlin for the setup of the template. 

## License

This project is licensed under the GNU General Public License v3. Click [here](https://www.gnu.org/licenses/gpl-3.0.de.html) for more details. 




