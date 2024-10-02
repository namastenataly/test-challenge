<p class="title">Rock Paper Scissors</p>
    <button onclick="
    playGame('rock');
    " class="move-button">
    <img src="images/rock-emoji.png" class="move-icon">
  </button> 



    <button onclick="
    playGame('paper');
    " class="move-button"><img src="images/paper-emoji.png" class="move-icon"></button>

    <button
    onclick="
    playGame('scissors');
    " class="move-button"><img src="images/scissors-emoji.png" class="move-icon"></button>

<p class="js-result result"></p>
<p class="js-moves"></p>
<p class="js-score score"></p>

    <button onclick="
    score.wins = 0;
    score.losses = 0;
    score.ties = 0;
    localStorage.removeItem('score');
    updateScoreElement();
    " class="reset-score-button">Reset Score</button>

    <script>
      let score = JSON.parse(localStorage.getItem('score'));

      if (score === null) {
        score = {
          wins: 0,
          losses: 0,
          ties: 0
        }; 
      }

      updateScoreElement();

      function playGame(playerMove) {
        const computerMove = pickComputerMove();

    let result = '';

        if (playerMove === 'scissors') {
          if (computerMove === 'rock') {

    result = 'You lose.';
    } else if (computerMove === 'paper') {
      result = 'You win.';
    } else if (computerMove === 'scissors') {
      result = 'Tie.';
    }


    } else if (playerMove === 'paper') {
      if (computerMove === 'rock') {

result = 'You win.';
} else if (computerMove === 'paper') {
  result = 'Tie.';
} else if (computerMove === 'scissors') {
  result = 'You lose.';
}


    }
    else if (playerMove === 'rock') {
      if (computerMove === 'rock') {
      result = 'Tie.';
      } else if (computerMove === 'paper') {
        result = 'You lose.';
      } else if (computerMove === 'scissors') {
        result = 'You win.';}
    }

    if (result === 'You win.') {
      score.wins += 1;
    }
    else if (result === 'You lose.') {
      score.losses += 1;
    }
    else if (result === 'Tie.') {
      score.ties += 1;
    }


    localStorage.setItem('score',JSON.stringify(score));

    updateScoreElement();
    
    document.querySelector('.js-result').innerHTML = result;

    document.querySelector('.js-moves').innerHTML = `you <img src="images/${playerMove}-emoji.png" class="move-icon">
  <img src="images/${computerMove}-emoji.png" class="move-icon"> Computer` ;
      }

      function updateScoreElement() {
        document.querySelector('.js-score').innerHTML = `wins: ${score.wins}, Losses: ${score.losses}, Ties: ${score.ties}`;
    
      }

      function pickComputerMove() {
        const randomNumber = Math.random();

        let computerMove = '';

        if (randomNumber >= 0 && randomNumber < 1 / 3) {
          computerMove = 'rock';
        } else if (randomNumber >= 1 / 3 && randomNumber < 2 / 3) {
          computerMove = 'paper';
        } else if (randomNumber >= 2 / 3 && randomNumber < 1) {
          computerMove = 'scissors';
        }

        return computerMove;
          }