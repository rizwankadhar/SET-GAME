//Settings Page

const rules_button = document.querySelector("#rules-button");
const rules = document.querySelector("#rules");
const playersButton = document.querySelector("#players-button");
const noOfPlayers = document.querySelector("#players-number");
const allPlayers = document.querySelector("#allPlayers");
const startButton = document.querySelector("#start");
const endButton = document.querySelector("#end");
let playersCnt;
let GameMode;



function setModePractice(){
  GameMode = "Practice";
}

function setModeCompetitive(){
  GameMode = "Competitive";
}


rules_button.addEventListener('click', function(event){
    rules.hidden = rules.hidden ? false : true;
    console.log("Done");
});

function myFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
  }
  
  window.onclick = function(event) {
    if (!event.target.matches('.dropbtn')) {
      let dropdowns = document.getElementsByClassName("dropdown-content");
      let i;
      for (i = 0; i < dropdowns.length; i++) {
        let openDropdown = dropdowns[i];
        if (openDropdown.classList.contains('show')) {
          openDropdown.classList.remove('show');
        }
      }
    }
  }

playersButton.addEventListener('click', function(event){
  playersCnt = noOfPlayers.value != "" ? noOfPlayers.value : 1;
  console.log(noOfPlayers);
  console.log(noOfPlayers.value);
  if (playersCnt > 1){
    document.querySelector("#scores").hidden = false;
    document.querySelector("#allPlayers").hidden = false;
    for (let i=2;i<=playersCnt;++i){
    allPlayers.innerHTML += `<button id="player${i.toString()}" onclick="activatePlayer(this,${i-1})">Player${i.toString()}</button>`
    document.querySelector("#display-scores").innerHTML +=
      `<li id="scores${i.toString()}">Player${i.toString()}:<li>`
    }
  }
});



///Game Page
const setPresent = document.querySelector("#set-present");
const showSet = document.querySelector("#show-set");
const addCards = document.querySelector("#add-cards");
const setShow = document.querySelector("#set-Show");
const playerShow = document.querySelector("#player-show");
let deck = [];
let table_cards = []; 
let selected_cards = []; 

let scores = [];
let singleTurnScores = [];
let turns = [];
let currentPlayer;

const row4 = document.querySelector("#r4");

let grid = document.querySelector("#table-cards");
let cardsAdded = false;



function shuffleDeck() {
  for (let ind = 0; ind < deck.length; ind++) {
      replace_ind = ind + Math.floor(Math.random() * (deck.length - ind));
      let tmp = deck[ind];
      deck[ind] = deck[replace_ind];
      deck[replace_ind] = tmp;
  }
}

function initializeDeck() {
  deck = [];
  table_cards = [];
  selected_cards = [];
  
  for (let i = 0; i < 81; i++) {
      deck.push(i);
  }
  shuffleDeck();
}

function displayCards() {
  for (let i=0; i<playersCnt;++i){
    scores[i] = 0;
    turns[i] = true;
    singleTurnScores[i] = 0;
  }
  for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 3; col++) {
          let card_num = deck.pop();
          let image_src = `<img src="pictures/` + card_num + `.png">`;
          grid.rows[row].cells[col].style.visibility = "visible"; 
          grid.rows[row].cells[col].innerHTML = image_src; 
          table_cards.push(card_num);
      }
  }
  if (countSets(table_cards) == 0){
    console.log("No set");
  }else{
    console.log("there is a set");
  }
}

let timer = document.querySelector("#timer");
let final_time = null;

const padding = num => num.toString().padStart(2, '0');

startButton.addEventListener('click', function(event){
  initializeDeck();
  displayCards();
  console.log("players are:" + playersCnt);
  if (GameMode == "Practice"){
    setPresent.hidden = false;
    showSet.hidden = false;
    addCards.hidden = false;
  }
  console.log(scores);

  document.querySelector("#settings-page").hidden = true;
  document.querySelector("#game-page").hidden = false;

  if (playersCnt == 1 ) {
    timer.hidden = false;
    let initial_time = new Date().getTime();
    setInterval(function() {
        if (final_time === null)  {
            let current_time = new Date().getTime();
            let total_time = current_time - initial_time;
            let seconds = Math.floor(total_time / 1000);
            let minutes = Math.floor(seconds / 60);
            let hours = Math.floor(minutes / 60);
            let time = padding(hours % 60) + ":" + padding(minutes % 60) + ":" + padding(seconds % 60);
            timer.innerHTML = time;
        } else {
            timer.style.color = "blue";
            timer.innerHTML = final_time;
        }
    }, 1000);
  }
});

endButton.addEventListener('click', ()=>{
  document.querySelector("#settings-page").hidden = false;
  document.querySelector("#game-page").hidden = true;
});


setPresent.addEventListener('click', function(){
  
  if (countSets(table_cards) > 0){
    setShow.hidden = false;
  }else {
    setShow.innerText = "No, there is no SET on table!";
    setShow.style.color = "red";
  }

  setTimeout(()=>{setShow.hidden=true;},5000);
});

showSet.addEventListener('click', ()=>{
  showPresentSet();
});

function showPresentSet(){
  let flag = false;
    //console.log(cards);
    for (let i = 0; i < table_cards.length; i++) {
        for (let j = i + 1; j < table_cards.length; j++) {
            for (let k = j + 1; k < table_cards.length; k++) {
                if (isSet(getAllProperties([table_cards[i], table_cards[j], table_cards[k]])) && !flag){
                  let cell1 = document.querySelector("cell" + i);
                  let cell2 = document.querySelector("cell" + j);
                  let cell3 = document.querySelector("cell" + k);
                  cell1.style.border = "5px solid red";
                  cell2.style.border = "5px solid red";
                  cell3.style.border = "5px solid red";
                  flag = true;
                }
            }
        }
    }
}

addCards.addEventListener('click', ()=>{
  plusThreeCards();
});

let Id;


function activatePlayer(player, id){
  console.log(scores);
  
  if (Id != null){
    clearTimeout(Id);
    document.querySelector("#counter").hidden = true;
  }
  
  if (turns[id]){
    console.log("yes");
    currentPlayer = id;
    playerShow.innerText = "Current Player: Player" + (currentPlayer+1);
    //turns[id] = false;
  }else{
    console.log("Its not his turn!!")
  }
  if (playersCnt > 1){
    Id = setTimeout(function(){
      if (selected_cards.length < 3){
          wrongChoice();
          currentPlayer = -1;
          clearTimeout(Id);
          
          checkRemaining();
      }
      document.querySelector("#counter").hidden = false;
      document.querySelector("#counter").style.color = "red";
    },10000);
  }
  
}

function pickCard(cell, pos) {
  if (playersCnt > 1 && (currentPlayer == -1 || !turns[currentPlayer])) {
    console.log("no");
    return;
  }  
  let selection = selected_cards.indexOf(pos);

  if (selection >= 0) {
      selected_cards.splice(selection, 1);
      cell.style.border = "5px solid #bfbfbf";
  } else if (selection < 0 && selected_cards.length < 3) {
      selected_cards.push(pos);
      cell.style.border = "5px solid black";
      if (selected_cards.length == 3) {
          let success = checkSelectedCards();
          if (success){
            rightChoice();
            currentPlayer = -1;
            clearTimeout(Id);
            
          }else {
            
            wrongChoice();
            currentPlayer = -1;
            clearTimeout(Id);
          }
          checkRemaining();
          
      } 
  }
}

function rightChoice(){
    singleTurnScores[currentPlayer]++;
    console.log(singleTurnScores);
    for (let i=0;i<playersCnt;++i){
      scores[i] += singleTurnScores[i];
      singleTurnScores[i] = 0;
    }
    console.log("current scores:"+scores[currentPlayer]);
    turns = turns.map(x => true);
    if (cardsAdded){
      discardndReplace(selected_cards);
      cardsAdded = false;
    }else{
      replaceSelectedCards(selected_cards);
    }
    
    //selected_cards = [];
    selected_cards = [];
    for (let i = 1; i<= playersCnt; ++i){
      document.querySelector("#scores"+ i).innerText = "Player" + i +":"+ scores[i-1];
    }
  let setStatus = document.querySelector("#setStatus");
  setStatus.innerHTML = "SET Selected";
  setStatus.style.color = "green";
    //checkRemaining();
}

function wrongChoice(){
  singleTurnScores[currentPlayer]--;        
  turns[currentPlayer] = false;
  let flag = true;
  for (score in singleTurnScores){
    if (singleTurnScores[score] != -1) flag = false;
  }
  if (flag) {
    console.log(singleTurnScores);
    for (let i=0;i<playersCnt;++i){
      scores[i] += singleTurnScores[i];
      singleTurnScores[i] = 0;
    }
    turns = turns.map(x => true);

    if (GameMode == "Competitive"){
      plusThreeCards();
    }

    for (let i = 1; i<= playersCnt; ++i){
      document.querySelector("#scores"+ i).innerText = "Player" + i +":"+ scores[i-1];
    }
  }

  console.log("current scores:"+scores[currentPlayer]);

  const id = setTimeout(function () {
    for (let i=0;i<selected_cards.length;++i){
      cell = document.querySelector("#cell" + selected_cards[i]);
      cell.style.border = "5px solid #bfbfbf";
    }
    selected_cards = [];
  }, 1500);

  let setStatus = document.querySelector("#setStatus");
  setStatus.innerHTML = "No SET Selected";
  setStatus.style.color = "red";
            
}

function checkSelectedCards() {
  let prospective_set = selected_cards.map(x => table_cards[x])
  const properties = getAllProperties(prospective_set);
  return isSet(properties);
}


function countSets(cards) {
  let count = 0;
  let flag = false;
  //console.log(cards);
  for (let i = 0; i < cards.length; i++) {
      for (let j = i + 1; j < cards.length; j++) {
          for (let k = j + 1; k < cards.length; k++) {
              if (isSet(getAllProperties([cards[i], cards[j], cards[k]]))) {
                count++;
              }
              if (isSet(getAllProperties([cards[i], cards[j], cards[k]])) && !flag){
                let cell1 = document.querySelector("#cell" + i);
                let cell2 = document.querySelector("#cell" + j);
                let cell3 = document.querySelector("#cell" + k);
                cell1.style.border = "5px solid red";
                cell2.style.border = "5px solid red";
                cell3.style.border = "5px solid red";
                flag = true;
              }
          }
      }
  }
  return count;
}


function replaceSelectedCards(cardsToReplace) {
  if (deck.length > 0) {
      for (let i = 0; i < cardsToReplace.length; i++) {
          let new_card = deck.pop();
          let image_src = '<img src="pictures/'+ new_card + '.png">';
          let cell = document.querySelector("#cell"+cardsToReplace[i]);
          table_cards.splice(cardsToReplace[i], 1, new_card) 
          cell.innerHTML = image_src;
          cell.style.border = "5px solid #bfbfbf";
      }
  } else {
      for (let i = 0; i < cardsToReplace.length; i++) {
          let cell = document.querySelector("#cell" + cardsToReplace[i]);
          table_cards.splice(cardsToReplace[i], 1, -1);
          cell.style.border = "5px solid #bfbfbf";
      }
      for (let i = table_cards.length-1; i >= 0; i--) {
          if (table_cards[i] == -1) {
              table_cards.splice(i, 1);
          } 
      }
      //console.log("length of table cards is:" + table_cards.length);
      for (let i = 0; i < 12; i++) {
          let cell = document.querySelector("#cell"+ i );
          if (i < table_cards.length) {
              cell.innerHTML = '<img src="pictures/'+ table_cards[i] + '.png">';
          } else {
              cell.style.visibility = "hidden";
          }
      }
  }
  updateDeckCount();
}


function discardndReplace(cardsToReplace) {
  for (let i = 0; i < cardsToReplace.length; i++) {
      let cell = document.querySelector("#cell" + cardsToReplace[i]);
      table_cards.splice(cardsToReplace[i], 1, -1); 
      cell.style.border = "5px solid #bfbfbf";
  }
  for (let i = table_cards.length-1; i >= 0; i--) {
    if (table_cards[i] == -1) {
        table_cards.splice(i, 1);
    } 
  }
  for (let i = 0; i < 15; i++) {
    let cell = document.querySelector("#cell" + i);
    if (i < table_cards.length) {
        cell.innerHTML = '<img src="pictures/' + table_cards[i] + '.png">';
    } else {
        cell.style.visibility = "hidden";
    }
  }
}

function updateDeckCount() {
  document.querySelector("#deckCount").innerHTML = 
      "Cards remaining in Deck: " + deck.length;
}


function checkRemaining() {
  console.log("sets remaining: " + countSets(table_cards));
    if (countSets(table_cards) == 0) {
        let notify = document.querySelector("#notify");
        notify.hidden = "false";
        notify.innerHTML = "No more SETs";
        notify.style.color = "blue";
        final_time = timer.innerHTML;
        timer.style.color = "blue";

        if (deck.length >= 1){
          if (GameMode == "Competitive") {
            notify.innerHTML += " So, three new cards will be dealt!";
            setTimeout(() => {
              plusThreeCards();
              notify.hidden = "true";
            },3000);
          }
          
        }else {
            notify.innerHTML += ", Game has ended!!!";
            if (playersCnt > 1){
              let winner = 0;
              for (let i = 1 ; i<playersCnt;++i){
                if (scores[i] > scores[winner]){
                  winner = i;
                }
              }
              notify.innerHTML += " The winner is: Player" + (winner+1);
            }else {
              notify.innerHTML += " Player has finished the deck in:" + timer.innerHTML;
            }
            document.querySelector("#setStatus").hidden = true;
            document.querySelector("#player-show").hidden = true;
            endButton.hidden = false;
        }
    }
}

function plusThreeCards(){
  if (deck.length > 0){
    cardsAdded = true;
    row4.hidden = false;
    for (let c = 0; c < 3; c++) {
      let card_num = deck.pop();
      let image_tag = `<img src="pictures/` + card_num + `.png">`;
      grid.rows[4].cells[c].style.visibility = "visible"; 
      grid.rows[4].cells[c].innerHTML = image_tag; 
      table_cards.push(card_num);
      countSets(table_cards);
    }
    updateDeckCount();
  }
}
function isSet(properties) {
  return SumArray(properties) == 0;
}


function SumArray(array){
  let sum = 0;
  for (let i = 0; i<array.length; ++i){
    sum += array[i];
  }
  return sum;
}

function getShape(card) {
  return Math.floor((card % 9) / 3);
}

function getColor(card) {
  return Math.floor(card / 27);
}

function getNumber(card) {
  return card % 3;
}

function getShading(card) {
  return Math.floor((card % 27) / 9);
}


function getAllProperties(prospective_set) {
  let color = [];
  let number = [];
  let shape = [];
  let shading = [];
  for (let i in prospective_set) {
      color.push(getColor(prospective_set[i]));
      number.push(getNumber(prospective_set[i]));
      shape.push(getShape(prospective_set[i]));
      shading.push(getShading(prospective_set[i]));
  }
  properties = [];
  properties.push(SumArray(color) % 3);
  properties.push(SumArray(number) % 3);
  properties.push(SumArray(shape) % 3);
  properties.push(SumArray(shading) % 3);
  return properties;
}

