'use strict'
// user1 {
//  play: 'X',
//  wins: 0
//}
let ticTac = (function () {

  let playField = document.querySelector('.playField');
  let navPanel = document.querySelector('.navPanel');
  let user1 = {};
  let user2 = {};
  let stepsHistory = [];
  let typeGame;

  function init(e) {
    let typeBtn = e.target.dataset.typeGame;
    if (typeBtn === 'start') {
      restart();
    }

    if (typeBtn === 'pc') {
      typeGame = typeBtn;
      play();
    }

    if (typeBtn === 'human') {
      typeGame = typeBtn;
      play();
    }
  }

  function play() {
    navPanel.firstElementChild.classList.remove('hidden');
    navPanel.lastElementChild.hidden = true;
    user1.play = 'X';
    user2.play = 'O';
    playField.addEventListener('click', step);
  }

  function restart() {
    document.querySelectorAll('.col').forEach(el => el.textContent = '');
    playField.removeEventListener('click', step);
    stepsHistory.length = 0;
    user1.win = 0;
    user2.win = 0;
    navPanel.firstElementChild.classList.add('hidden');
    navPanel.firstElementChild.textContent = 'RESTART GAME';
    navPanel.lastElementChild.hidden = false;

    if (playField.querySelector('.modal')) {
      playField.querySelector('.modal').remove();
    }
  }

  function step(event) {
    if (event.target.textContent) {
      return;
    }

    if (stepsHistory.length % 2) {

      if (typeGame === 'human') {
        event.target.textContent = user2.play;
        stepsHistory.push(event.target);

        if (checkWin(user2.play, stepsHistory)) {
          user2.win += 1;
          modalWindow(user2);
        }
      }

    } else {
      event.target.textContent = user1.play;
      stepsHistory.push(event.target);

      if (checkWin(user1.play, stepsHistory)) {
        user1.win += 1;
        modalWindow(user1);
        return;
      }
      if (typeGame === 'pc' && !playField.querySelector('.modal')) {
        onePlayer();
      }
    }

    if (stepsHistory.length === 9) {
      modalWindow({play: '?'});
    }
  }

  function onePlayer() {

    if (stepsHistory.length === 9) {
      return;
    }

    let allCells = document.querySelectorAll('.col');
    let nextStep = possibleWin(allCells, user2) ||
                   possibleWin(allCells, user1) ||
                   bestStep(allCells) ||
                   randomStep(allCells);
    nextStep.textContent = user2.play;
    stepsHistory.push(nextStep);

    if (checkWin(user2.play, stepsHistory)) {
      user2.win += 1;
      modalWindow(user2);
    }
  }

  function possibleWin(arr, user) {
    let lastPossible;
    arr.forEach((cell) => {
      if (cell.textContent) {
        return;
      }
      let duplicateHistory = [...stepsHistory];
      cell.textContent = user.play;
      duplicateHistory.push(cell);
      if (checkWin(user.play, duplicateHistory)) {
        lastPossible = cell;
      }
      cell.textContent = '';
    })
    return lastPossible;
  }

  function bestStep() {
    let bestcells = [];
    bestcells.push(document.querySelector('.row2 > .col2'));
    bestcells.push(document.querySelector('.row1 > .col1'));
    bestcells.push(document.querySelector('.row1 > .col3'));
    bestcells.push(document.querySelector('.row3 > .col3'));
    bestcells.push(document.querySelector('.row3 > .col1'));

    for (let i = 0; i < bestcells.length; i++) {
      if (!bestcells[i].textContent) {
        return bestcells[i];
      }
    }
  }

  function randomStep(arr) {
    for (let i = 0; i < arr.length; i++) {
      if (!arr[i].textContent) {
        return arr[i];
      }
    }
  }

  function checkWin(figure, arrSteps) {
    let checkRout = function (route, numbId) {
      let sortArr = arrSteps.filter((el) => {
        return el.dataset[route] === String(numbId);
      })

      if (sortArr.length === 3) {
        return sortArr.every((el) => el.textContent === figure);
      }
    }

    let arrRoutes = ['row', 'col', 'left', 'right'];
    let results = {};

    for (let i = 0; i < arrRoutes.length; i++) {
      for (let j = 1; j < 4; j++) {
        let key = `${arrRoutes[i]}${j}`;
        if (checkRout(arrRoutes[i], j) === undefined) {
          continue
        }
        results[key] = checkRout(arrRoutes[i], j);

      }
    }
    
    if (Object.keys(results).length) {
      for (const key in results) {
        if (results[key]) return true;
      }
    }
  }

  function modalWindow(whoWin) {
    let modalHtml = `<div class="modal">
                      <h3 class="result">Player 
                        <span>${whoWin.play}</span> WIN
                      </h3>
                      <p>total score</p>
                      <p>
                        <span>X</span>
                        ${user1.win} vs ${user2.win} 
                        <span>O</span>
                      </p>
                      <a href="#">revenge</a>
                     </div>`;
    playField.insertAdjacentHTML('beforeend', modalHtml);
    playField.lastElementChild
      .lastElementChild
      .addEventListener('click', revenge);
  }

  function revenge(event) {
    document.querySelectorAll('.col').forEach(el => el.textContent = '');
    stepsHistory.length = 0;
    event.target.closest('.modal').remove();
  }

  return {
    init
  }
})()

document.querySelector('.navPanel').addEventListener('click', (event) => {
  event.preventDefault();
  ticTac.init(event);
})