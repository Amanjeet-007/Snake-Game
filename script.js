const Box = document.getElementById("box");

const col = Math.floor(Box.clientWidth / 30);
const row = Math.floor(Box.clientHeight / 30);

const board = [];
let interval = null;


Box.style.gridTemplateColumns = `repeat(${col},1fr)`;
Box.style.gridTemplateRows = `repeat(${row},1fr)`;

const div = document.createElement("div");
div.classList.add("block");

const snake = [
    { x: 2, y: 4 }, //head
    // { x: 2, y: 3 },
    // { x: 2, y: 2 },
    // { x: 2, y: 1 }

]


for (let i = 0; i < row; i++) {
    board.push([])
    for (let j = 0; j < col; j++) {
        const div = document.createElement("div");
        div.classList.add("block");
        board[i][j] = div;
        Box.appendChild(div);
    }
}


// Render the snake
function updateSnakePositioin() {
    interval = setInterval(() => {
        //move position to forword 
        snake.forEach((el) => {
            board[el.x][el.y].classList.remove("snake")
        })
        let dir = "left"
        addEventListener("keypress", (e) => {
                if (e.key == "ArrowUp") {
                   dir = "up"
                }
                if (e.key == "ArrowDown") {
                   dir = "down"
                }
                if (e.key == "ArrowRight") {
                   dir = "right"
                }
                if (e.key == "ArrowLeft") {
                    dir = "left"
                }
                console.log("One")
            })

        // direction wise
        let head = "left"
        snake.forEach((el) => {
            if(dir=="down"){
                return el.x -= 1;
            }
            if(dir=="left"){
                return el.y += 1;
            }
            if(dir=="right"){
                return el.y -= 1;
            }
            if(dir=="up"){
                return el.x += 1;
            }
            // addEventListener("keypress", (e) => {
            //     if (e.key == "ArrowUp") {
            //         if (head != "down") {
            //             el.x -= 1;
            //         }
            //     }
            //     if (e.key == "ArrowDown") {
            //         if (head != "up") {
            //             el.x += 1;
            //         }
            //     }
            //     if (e.key == "ArrowRight") {
            //         if (head != "left") {
            //             el.y -= 1;
            //         }
            //     }
            //     if (e.key == "ArrowLeft") {
            //         if (head == "left") {
            //             el.y += 1
            //         }
            //     }
            //     console.log("One")
            // })
            render()
        })
        
    }, 1000)
}





updateSnakePositioin()

function render() {
    snake.forEach((el) => {
        board[el.x][el.y].classList.add("snake")
    })
}

render()



