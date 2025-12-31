const Box = document.getElementById("box");
const Score = document.getElementById("score");
const HighScore = document.getElementById("high_score");
const col = Math.floor(Box.clientWidth / 30);
const row = Math.floor(Box.clientHeight / 30);

// initial vaiables
const board = [];
let gameOver = false;
let direction = { x: 0, y: 0 } // Direction
let food = { x: 5, y: 5 }  // Food position

const score ={
    current : 0,
    highScore : 0
}
function setScore(){
    if(score.current < 10 && score.highScore < 10){
          Score.innerText = `0${score.current}`
          HighScore.innerText = `0${score.highScore}` 
    }else{
     Score.innerText = `${score.current}`
     HighScore.innerText = `${score.highScore}`   
    }
    
}


// move Animation
let speed = 5;
let currentTime = 0;

// Move (one by one block of snake) _> it's helps to gt the result
let temp = { x: 0, y: 0 }
let temp2 = { x: 0, y: 0 }

Box.style.gridTemplateColumns = `repeat(${col},1fr)`;
Box.style.gridTemplateRows = `repeat(${row},1fr)`;

// Snake
let snake = [
    { x: 5, y: 5 }, //head
    { x: 6, y: 5 }, //body
    { x: 7, y: 5 }, //tail

]

// Board with rows and columns
for (let i = 0; i < row; i++) {
    board.push([])
    for (let j = 0; j < col; j++) {
        const div = document.createElement("div");
        div.classList.add("block");
        board[i][j] = div;
        Box.appendChild(div);
    }
}

function placeFood() {
    document.querySelectorAll('.food').forEach(e => e.classList.remove('food'));
    food = {
        //random number between min and max:
        // min + (max - min) * Math.random()
        x: Math.floor(2 + (row - 2) * Math.random()),
        y: Math.floor(2 + (col - 2) * Math.random())
    }
    board[food.x][food.y].classList.add("food")
}

function isEating() {
    if (food.x == snake[0].x && food.y == snake[0].y) {
        placeFood()
        // add a body into snake
        let el = [{x:food.x,y:food.y}];
                el.unshift(snake[0]);
                snake.shift(0);
                snake = el.concat(snake);
        speed += 0.3
        //score update
        score.current += 1
        setScore()
    }
}

// renders snake on the board
function render() {
    document.querySelectorAll('.snake').forEach(e => e.classList.remove('snake'));

    if (snake.length != 0) {
        snake.forEach((el) => {
            board[el.x][el.y].classList.add("snake")
        })
    }

}

// Collide check
function isCollide() {
        if (gameOver) {
            direction = { x: 0, y: 0 }
            snake = [
                { x: 5, y: 5 }, //head
                { x: 6, y: 5 }, //body
                { x: 7, y: 5 }, //tail
            ]
            console.log("Game over");
            // add event and make gameover false again and start the game again
            // render()
            if(score.current > score.highScore){
                score.highScore = score.current-1
                score.current = 0
                setScore()
            }

            speed = 5
            return gameOver = false

        }
    //sef collide
    for (let i = 3; i < snake.length; i++) {
        if ((snake[i].x == snake[0].x) && (snake[i].y == snake[0].y)) {
            alert("self")
            return gameOver = true;

        }
    }
    // snake.slice(1).some(seg => seg.x === snake[0].x && seg.y === snake[0].y);
    //------------------------------------------------------
    // board colide
    if (snake[0].x < 0 || snake[0].x >= row || snake[0].y < 0 || snake[0].y >= col) {
        alert("border")
       return gameOver = true
    }
    return false
}

function Move() {
    isEating()
    isCollide()
    // one by one snake har coordinate lunga aor use move karaunga
    temp.x = snake[0].x;
    temp.y = snake[0].y;

    snake[0].x += direction.x;
    snake[0].y += direction.y;
    if (direction.x != 0 || direction.y != 0) {
        for (let i = 1; i < snake.length; i++) {
            temp2.x = snake[i].x;
            temp2.y = snake[i].y;

            snake[i].x = temp.x;
            snake[i].y = temp.y;
            temp = { ...temp2 }
        }
    }

    render()
}

function MoveAnimation(timestamps) {
    window.requestAnimationFrame(MoveAnimation);

    //time control
    if (((timestamps - currentTime) / 1000) < (1 / speed)) {
        return;
    }

    currentTime = timestamps
    //move one step a time draw 
    return Move()

}
// --- Swipe Controls ---
let startX = 0, startY = 0;

Box.addEventListener("touchstart", e => {
    const t = e.touches[0];
    startX = t.clientX;
    startY = t.clientY;
});

Box.addEventListener("touchend", e => {
    const t = e.changedTouches[0];
    const dx = t.clientX - startX;
    const dy = t.clientY - startY;

    if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 30 && direction.y !== -1)      direction = {x:0, y:1};  // swipe → right
        else if (dx < -30 && direction.y !== 1) direction = {x:0, y:-1}; // swipe ← left
    } else {
        if (dy > 30 && direction.x !== -1)      direction = {x:1, y:0};  // swipe ↓ down
        else if (dy < -30 && direction.x !== 1) direction = {x:-1, y:0}; // swipe ↑ up
    }
});
window.addEventListener("keydown", (e) => {
    switch (e.key) {
        case "ArrowDown":
            if (direction.x != -1) {
                direction = { x: 1, y: 0 };
            }
            break;
        case "ArrowUp":
            if (direction.x != 1) {
                direction = { x: -1, y: 0 };
            }
            break;
        case "ArrowRight":
            if (direction.y != -1) {
                direction = { x: 0, y: 1 };
            }
            break;
        case "ArrowLeft":
            if (direction.y != 1) {
                direction = { x: 0, y: -1 };
            }
            break;
        default:
            // direction = { x: 0, y: 0 }
            break;
    }
})

placeFood()
render() // snake on the board
window.requestAnimationFrame(MoveAnimation);



