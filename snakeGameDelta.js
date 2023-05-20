const playBoard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");
const controls = document.querySelectorAll(".controls i");
const t = document.querySelector('#time');
const b = document.querySelector('button');
let words = document.querySelector(".noC");
let wordC = document.querySelector(".color");
let live = document.querySelector(".lives");
let bShaw = document.querySelector(".wrapper"); 
let mainWord; 

let gameOver = false;
let foodX,foodY;
let snakeX = 5, snakeY = 5;
let velocityX = 0, velocityY = 0;
let snakeBody = [];
let setIntervalId;
let score = 0;
let wordDone = false;
let wordNum = [];

let time = 0 ;
let timeLeft = 55;
let pause = false;

let highScore = localStorage.getItem("high-score") || 0;
highScoreElement.innerText = `High Score: ${highScore}`;

b.addEventListener("click",function(){
    if (!pause){
        clearInterval(setIntervalId)
        pause = true;
    }else{
        setIntervalId = setInterval(initGame,speed);
        pause = false;
    }
});

function updateTimer() {
    timeLeft = timeLeft - 1;
    if(timeLeft >= 0)
      t.innerText = timeLeft;
    else {
      gameOver = true;
    }
  }

const display = () =>{
    let w = ['RED','TRICHY','DELTA','WEB','PAVAN','NITT','CODING'];
    let rand = Math.floor(Math.random()*(w.length));
    let str = [];
    mainWord = w[rand];
    words.innerText = mainWord;
    for (let l of w[rand]){
        let x = Math.floor(Math.random() * 30) + 1;
        let y = Math.floor(Math.random() * 30) + 1;
        wordNum.push([x,y]);
        str.push(`<div class="food" style="grid-area: ${y} / ${x}">${l}</div>`);
    }
    return str
}

const updateFoodPosition = () => {
    let a = wordNum.shift();
    foodX = a[0];
    foodY = a[1];
}

const handleGameOver = () => {
    clearInterval(setIntervalId);
    alert("Game Over! Press OK to replay...");
    location.reload();
}

const changeDirection = e => {
    if (time === 0){
        setInterval(updateTimer, 1000);
        time++;
    }
    
    if(e.key === "ArrowUp" && velocityY != 1) {
        velocityX = 0;
        velocityY = -1;
    } else if(e.key === "ArrowDown" && velocityY != -1) {
        velocityX = 0;
        velocityY = 1;
    } else if(e.key === "ArrowLeft" && velocityX != 1) {
        velocityX = -1;
        velocityY = 0;
    } else if(e.key === "ArrowRight" && velocityX != -1) {
        velocityX = 1;
        velocityY = 0;
    }
}

function changeCol(c){
    wordC.innerText = mainWord.slice(0,c);
    words.innerText = mainWord.slice(c,mainWord.length);
}


controls.forEach(button => button.addEventListener("click", () => changeDirection({ key: button.dataset.key })));

let htmlW =[];
let count = 0;
let speed = 200;
let lives = 3;

const initGame = () => {
    
    if(gameOver) return handleGameOver();
    let html = null;


    
    if(snakeX === foodX && snakeY === foodY) {
        count++;
        htmlW.shift();
        timeLeft += 1;
        speed*=0.4;
        changeCol(count);
        if (count === mainWord.length){
            wordNum = [];
            htmlW = display();
            count = 0;
            timeLeft += 5;
            wordC.innerText = "";
            
        }
        
        updateFoodPosition();
        snakeBody.push([foodY, foodX]); 
        score++;
        highScore = score >= highScore ? score : highScore;
        localStorage.setItem("high-score", highScore);
        scoreElement.innerText = `Score: ${score}`;
        highScoreElement.innerText = `High Score: ${highScore}`;
    }

    

    
    snakeX += velocityX;
    snakeY += velocityY;
    
    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = snakeBody[i - 1];
    }
    snakeBody[0] = [snakeX, snakeY]; 

    if(snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
        return gameOver = true;
    }
    html += `<div class="head" style="grid-area: ${snakeBody[0][1]} / ${snakeBody[0][0]}"></div>`;
    for (let i = 1; i < snakeBody.length; i++) {
        
        html += `<div class="sBody" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;

        if (i !== 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]) {
            if (lives === 0){
                gameOver = true;
            }else{
                live.innerText = lives;
                lives -= 1;
            }
            
        }
    }
    playBoard.innerHTML = htmlW + html;
}

htmlW = display();
updateFoodPosition();
setIntervalId = setInterval(initGame, speed);
document.addEventListener("keyup", changeDirection);

