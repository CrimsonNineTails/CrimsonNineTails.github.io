/*_______________________________________________________________________________________________________________________________
 * Section  
 *_______________________________________________________________________________________________________________________________
 */

var snake;
var snakeLength;
var snakeSize;
var snakeDirection;
var Speed;

var Highscore = localStorage.getItem(HighscoreX);
var HighscoreX;

var food;

var context;
var screenWidth;
var screenHeight;

var gameState;
var GameOverMenu;
var restartButton;
var playHUD;
var scoreboard;
var starting;
var Start;

var difficulty;
var Easy;
var Medium;
var Hard;

var Obama;
var Trump;
var explosion;

var audio = new Audio('Eat.mp3');
var audio2 = new Audio('Death.mp3');
var grow = 0;

/*____________________________________________________________________________________________________________________________
 * Exicuting game code
 *____________________________________________________________________________________________________________________________
 */

gameInitialize();
snakeInitialize();
foodInitalize();
gameDraw();
/*____________________________________________________________________________________________________________________________
 * GameFuntions
 *____________________________________________________________________________________________________________________________
 */

function gameInitialize() {
    var canvas = document.getElementById("game-screen");
    context = canvas.getContext("2d");

    screenWidth = window.innerWidth;
    screenHeight = window.innerHeight;

    canvas.width = screenWidth;
    canvas.height = screenHeight;

    document.addEventListener("keydown", keyboardHandler);

    gameOverMenu = document.getElementById("gameOver");
    centerMenuPosition(gameOverMenu);

    restartButton = document.getElementById("restartButton");
    restartButton.addEventListener("click", gameRestart);

    playHUD = document.getElementById("playHUD");
    scoreboard = document.getElementById("scoreboard");
    Highscore = document.getElementById("Highscore");
   
    starting = document.getElementById("starting");
    centerMenuPosition(starting);
    
    Start = document.getElementById("Start");
    Start.addEventListener("click", GoDifficulty);
    
    difficulty = document.getElementById("difficulty");
    centerMenuPosition(difficulty);
    
    Easy = document.getElementById("Easy");
    Easy.addEventListener("click", StartGameEasy);
    Medium = document.getElementById("Medium");
    Medium.addEventListener("click", StartGame);
    Hard = document.getElementById("Hard");
    Hard.addEventListener("click", StartGameHard);
    
    Obama = document.getElementById("Imgs");
    Trump = document.getElementById("2Imgs");
    explosion = document.getElementById("3Imgs");
    setState("startingg");
}

function gameLoop() {
    gameDraw();
    drawScoreboard();
    console.log(Speed);
    
    if (gameState === "play") {
        snakeUpdate();
        snakeDraw();
        foodDraw();
        HighScore();
    }
    else if(gameState === "grow") {
        grow+=2;
        snakeDirection = "stop";
        for (var index = 0; index < snake.length; index++) {
          
          
          context.drawImage(explosion, snake[index].x * snakeSize-grow, snake[index].y * snakeSize-grow, snakeSize+2*grow, snakeSize+2*grow);
      
       }
        if(grow > 50){
            setState("GAME OVER");
        }  
    }
        
        
}
function GoDifficulty() {
    hideMenu(starting);
    setState("difficulty");
}

function StartGameEasy() {
    hideMenu(difficulty);
    
    snakeInitialize();
    setState("play");  
    Speed = 1200 / 30;
    setInterval(gameLoop, 1300 / 30);
}
function StartGame() {
    hideMenu(difficulty);
    setState("play");  
    Speed = 1000 / 30;
    setInterval(gameLoop, 1100 / 30);
}
function StartGameHard() {
    hideMenu(difficulty);
    setState("play");
    Speed = 1100 / 50;
    setInterval(gameLoop, 1200 / 40);
}

function gameDraw() {
    context.fillStyle = "rgb(212, 116, 208)";
    context.fillRect(0, 0, screenWidth, screenHeight);
}

function gameRestart() {
    snakeInitialize();
    foodInitalize();
    gameLoop = gameLoop-1;
    grow = 0;
    hideMenu(gameOverMenu);
    setState("play");

}



/*____________________________________________________________________________________________________________________________
 * Snake funtions
 *____________________________________________________________________________________________________________________________
 */
function snakeInitialize() {
    snake = [];
    snakeLength = 1;
    snakeSize = 40;
    snakeDirection = "right";

    for (var index = snakeLength - 1; index >= 0; index--) {
        snake.push({
            x: index,
            y: 0
        });
    }
}

function snakeDraw() {
    for (var index = 0; index < snake.length; index++) {
        context.strokeStyle = "black";
        context.strokeRect(snake[index].x * snakeSize, snake[index].y * snakeSize, snakeSize, snakeSize);
        context.drawImage(Obama, snake[index].x * snakeSize, snake[index].y * snakeSize, snakeSize, snakeSize);
        
    }
}


function snakeUpdate() {
    var snakeHeadX = snake[0].x;
    var snakeHeadY = snake[0].y;

    if (snakeDirection == "down") {
        snakeHeadY++;
    }
    else if (snakeDirection == "right") {
        snakeHeadX++;
    }
    else if (snakeDirection == "up") {
        snakeHeadY--;
    }
    else if (snakeDirection == "left") {
        snakeHeadX--;
    }

    checkFoodCollisions(snakeHeadX, snakeHeadY);
    checkWallCollisions(snakeHeadX, snakeHeadY);
    checkSnakeCollisions(snakeHeadX, snakeHeadY);

    var snakeTail = snake.pop();
    snakeTail.x = snakeHeadX;
    snakeTail.y = snakeHeadY;
    snake.unshift(snakeTail);
}

/*____________________________________________________________________________________________________________________________
 * Food Funtions
 *____________________________________________________________________________________________________________________________
 */
function foodInitalize() {
    food = {
        x: 0,
        y: 0
    };

    setFoodPosition();
}

function foodDraw() {
    
    context.drawImage(Trump, food.x * snakeSize, food.y * snakeSize, snakeSize, snakeSize);
}

function setFoodPosition() {
    var randomX = Math.floor(Math.random() * screenWidth);
    var randomY = Math.floor(Math.random() * screenHeight);

    food.y = Math.floor(randomY / snakeSize);
    food.x = Math.floor(randomX / snakeSize);
}
/*
 * __________________________________________________________________________________________________________________________
 * Input Functions  
 * ---------------------------------------------------------------------------------------------------------------------------
 */
function keyboardHandler(event) {
    console.log(event);

    if (event.keyCode == "39" && snakeDirection != "left") {
        snakeDirection = "right";
    }
    else if (event.keyCode == "40" && snakeDirection != "up") {
        snakeDirection = "down";
    }
    else if (event.keyCode == "38" && snakeDirection != "down") {
        snakeDirection = "up";
    }
    else if (event.keyCode == "37" && snakeDirection != "right") {
        snakeDirection = "left";
    }
}


/*
 * ------------------------------------------------------------------------------------------------------------------------------
 * Collision Handling 
 * ___________________________________________________________________________________________________________________________
 */

function checkFoodCollisions(snakeHeadX, snakeHeadY) {
    if (snakeHeadX == food.x && snakeHeadY == food.y) {
        audio.pause();
        audio.currentTime = 0;
        snake.push({
            x: 0,
            y: 0
        });
        snake.push({
            x: 0,
            y: 0
        });
        snake.push({
            x: 0,
            y: 0
        });
        snakeLength++;
        snakeLength++;
        snakeLength++;
        setFoodPosition();
        audio.play();
    }
}

function checkWallCollisions(snakeHeadX, snakeHeadY) {
    if (snakeHeadX * snakeSize >= screenWidth || snakeHeadX * snakeSize < 0 || snakeHeadY * snakeSize >= screenHeight || snakeHeadY * snakeSize < 0) {
        audio2.play();
        
        
        setState("grow");
              
    }
}

function checkSnakeCollisions(snakeHeadX, snakeHeadY) {
    for (var index = 1; index < snake.length; index++) {
        if (snakeHeadX == snake[index].x && snakeHeadY == snake[index].y) {
            audio2.play();
            setState("grow");
            return;
        }
    }
}



function setState(state) {
    gameState = state;
    showMenu(state);
}

function displayMenu(menu) {
    menu.style.visibility = "visible";
}

function hideMenu(menu) {
    menu.style.visibility = "hidden";
}

function showMenu(state) {
    if (state == "GAME OVER") {
        displayMenu(gameOverMenu);
    }
    else if(state == "play"){
        displayMenu(playHUD);
    }
    else if(state == "startingg") {
        displayMenu(starting);
    }
    else if(state == "difficulty") {
        displayMenu(difficulty);
    }
}

function centerMenuPosition(menu) {
    menu.style.top = (screenHeight / 2) - (menu.offsetHeight / 2) + "px";
    menu.style.left = (screenWidth / 2) - (menu.offsetWidth / 2) + "px";
}

function drawScoreboard() {
    scoreboard.innerHTML = "Score: " + snakeLength;
    Highscore.innerHTML = "HighScore: " + localStorage.getItem(HighscoreX);
}
function HighScore() {
    if(localStorage.getItem(HighscoreX) < snakeLength) {
        localStorage.setItem(HighscoreX , snakeLength);
    }
    
}