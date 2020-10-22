"use strict";

let rock = {
  name: "Rock",
  win: "Scissors"
};

let paper = {
  name: "Paper",
  win: "Rock"
};

let scissors = {
  name: "Scissors",
  win: "Paper"
};

let chooseRange = [rock, paper, scissors];
/*O JOGO ACABA QUANDO ALGUÉM COMPLETA 5 PONTOS; Cada round ganho corresponde á um ponto.*/

let gameStatus = document.getElementById("status-label");
let gameViewer = document.getElementById("viewer");

let gameResetBtn = document.getElementById("game-reset-btn")
let gameControlBtn = document.getElementById("game-control-btn");

let gameActionsContainer = document.getElementById("actions-container");

let gameStatusCode = "WAIT";
let gameWinPoints = 5;


let playerStatus = {
	container: document.getElementById("player-status"),
	points: 0,
	pointsDisplay: null
};
playerStatus.pointsDisplay = playerStatus.container.querySelector(".user.points");

let computerStatus = {
	container: document.getElementById("computer-status"),
	points: 0,
	pointsDisplay: null
};
let lastComputerChoose;
computerStatus.pointsDisplay = computerStatus.container.querySelector(".user.points");


function gameRoundControl(event) {
  if (gameStatusCode == "WAIT") {
    gameStatusCode = "RUNNING";

    removeDisabled(gameActionsContainer);
    removeDisabled(gameResetBtn);
    toggleDisabled(gameControlBtn);

    playerStatus.pointsDisplay.removeAttribute("disabled");
    computerStatus.pointsDisplay.removeAttribute("disabled");

    gameStatus.textContent = "Select one option: Paper, Scissors or Rock";
    gameControlBtn.textContent = "Next Round";
  } else {
    if (gameControlBtn.hasAttribute("disabled")) return;

    toggleActionButtons();
    setDisabled(gameControlBtn);

    changeRoundViewer(playerStatus, true);
    changeRoundViewer(computerStatus, true);
  }
}

function resetGame(event) {
  if(event.target.hasAttribute("disabled")) return;
  location.reload();
}



function gameActionControl(event) {
  let target = event.target;
  if (!target.hasAttribute("data-choose")) return;

  let chooseName = target.getAttribute("data-choose");
  let playerChoose = toChooseObject(chooseName);

  if(playerChoose == null) 
  	gameStatus.textContent = "Unknown choose, try again. Choose one option: Paper, Scissors or Rock.";
  
  toggleActionButtons();

  let computerChooseOption = computerChoose();
  gameStatus.textContent = "You choose "+target.textContent+". The computer choose "+computerChooseOption.name+".";

  let roundWinner = getChooseWinner(computerChooseOption, playerChoose);

  
  if(roundWinner == playerChoose) {
  	addPoint(playerStatus);
  	changeRoundViewer(playerStatus);
  } else if(roundWinner == computerChooseOption) {
  	addPoint(computerStatus);
  	changeRoundViewer(computerStatus);
  } else {
  	gameStatus.textContent = "Stalemate. Press space or click in Next Round button.";
  }

  if(playerStatus.points >= gameWinPoints) 
    setWinner(playerStatus);
  else if(computerStatus.points >= gameWinPoints)
  	setWinner(computerStatus);

  setTimeout(() => {
    gameControlBtn.removeAttribute("disabled");
    gameStatus.textContent = "Press space or click in Next Round button.";
    window.focus();
  }, 1000);
}

function addPoint(user) {
  user.points++;
  let pointsDisplayFix = user.points > 1 ? user.points+" points" : user.points+" point";
  user.pointsDisplay.textContent = pointsDisplayFix;
}

function changeBodyStatus(winner) {
  if(winner == playerStatus) {
  	document.body.classList.remove("player-lose-bg");
    document.body.classList.add("player-won-bg");
  } else {
  	document.body.classList.remove("player-won-bg");
  	document.body.classList.add("player-lose-bg");
  }
}

function toChooseObject(chooseName) {
  let found = chooseRange.filter(choose => choose.name == chooseName);
  return found.length > 0 ? found[0] : null;
}


/*
O smartComputer garante que o cálculo do computador seja mais inteligente e faça uma escolha melhor, ao invês de repetir a mesma ação.
Para isso, ele terá 50% de chance de escolher qualquer coisa ou 50% de chance de não escolher a mesma coisa.
*/
function computerChoose(smartComputer = false) {
  let choose = 0;
  let computerChoose = chooseRange;

  if(smartComputer && lastComputerChoose != null){

  	let repeat = Math.random() > 0.5;

  	if(!repeat) 
  	  computerChoose = chooseRange.filter(choose => choose != lastComputerChoose);
  }

  choose = Math.round(Math.random()*(computerChoose.length-1));
  lastComputerChoose = computerChoose[choose];
  return lastComputerChoose;
}

function getChooseWinner(choose1, choose2) {
  if(choose1.win == choose2.name)
    return choose1;
  else if(choose2.win == choose1.name)
    return choose2;
  return {name: "Stalemate", win: null};
}

function changeRoundViewer(winner, reset = false) {

  let winTitle = winner.container.querySelector(".title-round-status");
  let winLabel = winner.container.querySelector(".label-round-status");

  let userName = winner.container.querySelector(".user.name");
  let userIcon = winner.container.querySelector(".user.icon");
  let userPoints = winner.container.querySelector(".user.points");

  if(!reset) {

    toggleDisabled(winTitle);
    toggleDisabled(winLabel);

    toggleDisabled(userName);
    toggleDisabled(userIcon);
    toggleDisabled(userPoints);

  } else {

    setDisabled(winTitle);
    setDisabled(winLabel);

    removeDisabled(userName);
    removeDisabled(userIcon);
    removeDisabled(userPoints);

  	document.body.classList.remove("player-won-bg");
    document.body.classList.remove("player-lose-bg");
    return;
  }

  changeBodyStatus(winner);
}

function setWinner(winner) {
  changeBodyStatus(winner);

  gameViewer.removeChild(computerStatus.container);
  gameViewer.removeChild(playerStatus.container);

  let title = winner == playerStatus ? "You won!" : "Computer won!";

  let winTitle = gameViewer.querySelector(".title-round-status");
  let winLabel = gameViewer.querySelector(".label-round-status");
  let winIcon = gameViewer.querySelector(".win-game-status.icon");

  winTitle.textContent = title;

  toggleDisabled(winTitle);
  toggleDisabled(winLabel);
  toggleDisabled(winIcon);

  gameViewer.classList.remove("row");
  gameViewer.classList.add("column");
  gameViewer.classList.add("default-bg");

  gameControlBtn.textContent = "Start Next Game";
  gameStatusCode = "END";
  gameControlBtn.removeEventListener("click", gameRoundControl);
  gameControlBtn.addEventListener("click", resetGame);
}

function toggleDisabled(element) {
  if(element.hasAttribute("disabled"))
    removeDisabled(element);
  else
    setDisabled(element);
}

function removeDisabled(element) {
  element.removeAttribute("disabled");
}

function setDisabled(element) {
  element.setAttribute("disabled", "");
}

function toggleActionButtons(){
  let buttons = gameActionsContainer.querySelectorAll("button");
  buttons.forEach(button => {
    if(button.hasAttribute("disabled")) 
      button.removeAttribute("disabled");
    else 
      button.setAttribute("disabled", "");
  })
}

gameControlBtn.addEventListener("click", gameRoundControl);

window.addEventListener("keydown", event => {
  if(event.keyCode != 32) 
    return;
  return gameRoundControl();
});

gameActionsContainer.addEventListener("click", gameActionControl);
gameResetBtn.addEventListener("click", resetGame);
