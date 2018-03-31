// INITIALIZATION OF FIREBASE LINKAGE
var config = {
  apiKey: "AIzaSyCv6hX2hGc2qCiqkXEx6ijpRSkMalsEmvc",
  authDomain: "rpswebedition.firebaseapp.com",
  databaseURL: "https://rpswebedition.firebaseio.com",
  projectId: "rpswebedition",
  storageBucket: "rpswebedition.appspot.com",
  messagingSenderId: "492155748307"
};
firebase.initializeApp(config);

let database = firebase.database();
let playerOne;
let playerOneName;
let playerOneWins = 0;
let playerOneLosses = 0;
let playerOneSelection = "";
let playerTwo;
let playerTwoName;
let playerTwoWins = 0;
let playerTwoLosses = 0;
let playerTwoSelection = "";
let gameInProgress = false;
let whichPlayersTurn = 1;

$(document).ready(function(){

  database.ref().on("value", function(snapshot) {
    console.log("new snapshot received:", snapshot);

    if (snapshot.child("players/1").exists() === true) {
      playerOne = snapshot.child("players/1").val();
      console.log(playerOne);
      playerOneName = playerOne.name;
      playerOneWins = playerOne.wins;
      playerOneLosses = playerOne.losses;

      // LOGGING PLAYER 1 INFO
      console.log("Player 1 Name: ", playerOneName);
      console.log("Player 1 Wins: ", playerOneWins);
      console.log("Player 1 Losses: ", playerOneLosses);

      // DISPLAY PLAYER 1 IN THE DOM
      $("#playerOneName").text(playerOneName);
      $("#playerOneStats").text(`Wins: ${playerOneWins} Losses: ${playerOneLosses}`);
    }

    if (snapshot.child("players/2").exists() === true) {
      playerTwo = snapshot.child("players/2").val();
      playerTwoName = playerTwo.name;
      playerTwoWins = playerTwo.wins;
      playerTwoLosses = playerTwo.losses;

      // LOGGING PLAYER 2 INFO
      console.log("Player 2 Name: ", playerTwoName);
      console.log("Player 2 Wins: ", playerTwoWins);
      console.log("Player 2 Losses: ", playerTwoLosses);

      // DISPLAY PLAYER 2 IN THE DOM
      $("#playerTwoName").text(playerTwoName);
      $("#playerTwoStats").text(`Wins: ${playerTwoWins} Losses: ${playerTwoLosses}`);
    }

    if ((snapshot.child("players/1").exists() === true) && (snapshot.child("players/2").exists() === true)) {
      $("#login").css("display", "none");
      gameInProgress = true;
      database.ref().update({
        turn: whichPlayersTurn
      });
    }

    // GAMEPLAY WHEN BOTH PLAYERS ARE PRESENT
    if (gameInProgress === true) {
      if(whichPlayersTurn === 1) {
        $("#playerOneChoices").css("display", "block");
        $(".choice").on("click", function () {
          playerOneSelection = $(this).attr("selection");
          database.ref("players/1").update({
            selection: playerOneSelection
          });
          whichPlayersTurn++;
          $("#playerOneChoices").css("display", "none");
          $("#playerTwoChoices").css("display", "block");
          $(".choice").on("click", function () {
            playerTwoSelection = $(this).attr("selection");
            database.ref("players/2").update({
              selection: playerTwoSelection
            });
            whichPlayersTurn--;
            $("#playerTwoChoices").css("display", "none");
          })
        })
      }
    }

      // START BUTTON CLICK EVENT
    $("#startButton").on("click", function() {
      if (snapshot.child("players/1").exists() === false) {
        let playerName = $("#playerNameInput").val().trim();
        console.log("Now Entering Player 1:", playerName);
        database.ref("players/1").set({
          name: playerName,
          wins: playerOneWins,
          losses: playerOneLosses
        });

        // REMOVES PLAYER 1 ON DISCONNECT
        database.ref("players/1").onDisconnect().remove();

        // WRITES PLAYER 1 INFO TO DOM
        $("#login").css("display", "none");
        $("#playerName").text(playerName);
        $("#salutation").css("display", "block");
      }

      else if ((snapshot.child("players/1").exists() === true) && (snapshot.child("players/2").exists() === false)) {
        let playerName = $("#playerNameInput").val().trim();
        console.log("Now Entering Player 2:", playerName);
        database.ref("players/2").set({
          name: playerName,
          wins: playerTwoWins,
          losses: playerTwoLosses
        });

        // REMOVES PLAYER 2 ON DISCONNECT
        database.ref("players/2").onDisconnect().remove();

        // WRITES PLAYER 2 INFO TO DOM
        $("#login").css("display", "none");
        $("#playerName").text(playerName);
        $("#salutation").css("display", "block");
      }

      else {
        console.log("room is full");
      }
    });


  }, function(errorObject) {
    console.log("The read failed: " + errorObject.code);
  });


});

