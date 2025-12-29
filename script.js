const Box = document.getElementById("box");

// Calculate grid size
const size = 30; // block size in px
const col = Math.floor(Box.clientWidth / size);
const row = Math.floor(Box.clientHeight / size);

// Setup CSS Grid dynamically
Box.style.gridTemplateColumns = `repeat(${col}, 1fr)`;
Box.style.gridTemplateRows = `repeat(${row}, 1fr)`;

const board = [];
let lastPaintTime = 0;
let speed = 5; //Moves per second
let gameOver = false;

// Snake State: Array of coordinates
let snake = [
    { x: 2, y: 4 } // Head
];

let inputDir = { x: 0, y: 0 }; // Moving direction
let food = { x: 5, y: 5 };

// 1. Initialize Board (Create Divs)
for (let i = 0; i < row; i++) {
    board[i] = [];
    for (let j = 0; j < col; j++) {
        const div = document.createElement("div");
        div.classList.add("block");
        board[i][j] = div;
        Box.appendChild(div);
    }
}

// 2. Main Game Loop
function main(currentTime) {
    window.requestAnimationFrame(main);
    
    if (gameOver) return;

    // Control Speed: If not enough time has passed, skip this frame
    if ((currentTime - lastPaintTime) / 1000 < 1 / speed) {
        return;
    }
    
    lastPaintTime = currentTime;
    gameEngine();
}

// 3. Logic & Rendering
function gameEngine() {
    // --- Part 1: Updating the Snake & Food ---

    // Check Collision (Walls or Self)
    if (isCollide(snake)) {
        gameOver = true;
        inputDir = { x: 0, y: 0 };
        alert("Game Over! Press any key to restart.");
        snake = [{ x: 2, y: 4 }];
        gameOver = false;
        return;
    }

    // If you ate food: increment score and regenerate food
    // We do NOT pop the tail, effectively growing the snake
    if (snake[0].y === food.y && snake[0].x === food.x) {
        snake.unshift({ x: snake[0].x + inputDir.x, y: snake[0].y + inputDir.y });
        placeFood();
        speed += 0.5; // Optional: Increase speed when eating
    } else {
        // Move Snake: Add new head, remove tail
        // Only move if we have an input direction
        if(inputDir.x !== 0 || inputDir.y !== 0) {
            for (let i = snake.length - 2; i >= 0; i--) {
                snake[i + 1] = { ...snake[i] };
            }
            snake[0].x += inputDir.x;
            snake[0].y += inputDir.y;
        }
    }

    // --- Part 2: Rendering ---
    
    // Clear previous classes
    document.querySelectorAll('.snake').forEach(e => e.classList.remove('snake'));
    document.querySelectorAll('.food').forEach(e => e.classList.remove('food'));

    // Draw Snake
    snake.forEach((e, index) => {
        // Safety check to ensure we don't draw outside grid
        if(board[e.x] && board[e.x][e.y]) {
            board[e.x][e.y].classList.add('snake');
        }
    });

    // Draw Food
    if(board[food.x] && board[food.x][food.y]) {
        board[food.x][food.y].classList.add('food');
    }
}

// Helper: Collision Detection
function isCollide(snakeArr) {
    // 1. If you bump into yourself
    for (let i = 1; i < snakeArr.length; i++) {
        if (snakeArr[i].x === snakeArr[0].x && snakeArr[i].y === snakeArr[0].y) {
            return true;
        }
    }
    // 2. If you bump into the wall
    // Note: Array index goes from 0 to (row - 1)
    if (snakeArr[0].x >= row || snakeArr[0].x < 0 || snakeArr[0].y >= col || snakeArr[0].y < 0) {
        return true;
    }
    return false;
}

// Helper: Random Food Generator
function placeFood() {
    let a = 2;
    let b = row - 2;
    // Simple random logic
    food = {
        x: Math.round(a + (b - a) * Math.random()),
        y: Math.round(a + (col - 4 - a) * Math.random())
    }
}

// 4. Input Logic
window.addEventListener('keydown', e => {
    switch (e.key) {
        case "ArrowUp":
            if(inputDir.x !== 1) { // Prevent reversing
                inputDir.x = -1; inputDir.y = 0;
            }
            break;
        case "ArrowDown":
            if(inputDir.x !== -1) {
                inputDir.x = 1; inputDir.y = 0;
            }
            break;
        case "ArrowLeft":
            if(inputDir.y !== 1) {
                inputDir.y = -1; inputDir.x = 0;
            }
            break;
        case "ArrowRight":
            if(inputDir.y !== -1) {
                inputDir.y = 1; inputDir.x = 0;
            }
            break;
        default:
            break;
    }
});

// Start the game
window.requestAnimationFrame(main);