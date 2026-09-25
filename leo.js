const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const scoreElement = document.getElementById("score");
const statusElement = document.getElementById("status");

const startButton = document.getElementById("start");
const restartButton = document.getElementById("restart");

const COLS = 20;
const ROWS = 20;
const CELL = canvas.width / COLS;

let snake;
let direction;
let nextDirection;

let food;

let score = 0;

let speed = 120;

let gameTimer = null;

let running = false;


/* =========================
   RESET GAME
========================= */

function resetGame() {

    snake = [
        { x: 9, y: 9 },
        { x: 8, y: 9 },
        { x: 7, y: 9 }
    ];

    direction = {
        x: 1,
        y: 0
    };

    nextDirection = {
        x: 1,
        y: 0
    };

    score = 0;

    speed = 120;

    running = false;

    scoreElement.textContent = score;

    statusElement.textContent = "Ready";

    stopTimer();

    createFood();

    draw();
}


/* =========================
   START GAME
========================= */

function startGame() {

    if (running) {
        return;
    }

    running = true;

    statusElement.textContent = "Playing";

    gameTimer = setInterval(
        gameStep,
        speed
    );
}


/* =========================
   RESTART GAME
========================= */

function restartGame() {

    resetGame();

    startGame();
}


/* =========================
   STOP TIMER
========================= */

function stopTimer() {

    if (gameTimer !== null) {

        clearInterval(gameTimer);

        gameTimer = null;
    }
}


/* =========================
   CREATE FOOD
========================= */

function createFood() {

    do {

        food = {
            x: Math.floor(
                Math.random() * COLS
            ),

            y: Math.floor(
                Math.random() * ROWS
            )
        };

    } while (
        snake.some(
            part =>
                part.x === food.x &&
                part.y === food.y
        )
    );
}


/* =========================
   GAME STEP
========================= */

function gameStep() {

    if (
        nextDirection.x !== -direction.x ||
        nextDirection.y !== -direction.y
    ) {

        direction = nextDirection;
    }


    const newHead = {

        x: snake[0].x + direction.x,

        y: snake[0].y + direction.y

    };


    /* Screen wrapping */

    if (newHead.x < 0) {

        newHead.x = COLS - 1;
    }

    if (newHead.x >= COLS) {

        newHead.x = 0;
    }

    if (newHead.y < 0) {

        newHead.y = ROWS - 1;
    }

    if (newHead.y >= ROWS) {

        newHead.y = 0;
    }


    /* Snake collision */

    if (
        snake.some(
            part =>
                part.x === newHead.x &&
                part.y === newHead.y
        )
    ) {

        gameOver();

        return;
    }


    /* Add head */

    snake.unshift(newHead);


    /* Eat food */

    if (
        newHead.x === food.x &&
        newHead.y === food.y
    ) {

        score++;

        scoreElement.textContent = score;

        createFood();


        /* Increase speed */

        if (speed > 55) {

            speed -= 4;

            stopTimer();

            gameTimer = setInterval(
                gameStep,
                speed
            );
        }

    } else {

        /* Remove tail */

        snake.pop();
    }


    draw();
}


/* =========================
   GAME OVER
========================= */

function gameOver() {

    running = false;

    stopTimer();

    statusElement.textContent =
        "Game Over";

    draw(true);
}


/* =========================
   CHANGE DIRECTION
========================= */

function changeDirection(x, y) {

    if (
        !running &&
        statusElement.textContent ===
        "Game Over"
    ) {

        return;
    }

    nextDirection = {
        x: x,
        y: y
    };
}


/* =========================
   DRAW GAME
========================= */

function draw(gameOverScreen = false) {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    /* Grid */

    ctx.strokeStyle =
        "rgba(255,255,255,0.03)";


    for (let i = 1; i < COLS; i++) {

        ctx.beginPath();

        ctx.moveTo(
            i * CELL,
            0
        );

        ctx.lineTo(
            i * CELL,
            canvas.height
        );

        ctx.stroke();
    }


    for (let i = 1; i < ROWS; i++) {

        ctx.beginPath();

        ctx.moveTo(
            0,
            i * CELL
        );

        ctx.lineTo(
            canvas.width,
            i * CELL
        );

        ctx.stroke();
    }


    /* Food */

    ctx.fillStyle = "#e74c3c";

    ctx.fillRect(
        food.x * CELL + 3,
        food.y * CELL + 3,
        CELL - 6,
        CELL - 6
    );


    /* Snake */

    snake.forEach(
        (part, index) => {

            ctx.fillStyle =
                index === 0
                    ? "#2ecc71"
                    : "#27ae60";

            ctx.fillRect(
                part.x * CELL + 2,
                part.y * CELL + 2,
                CELL - 4,
                CELL - 4
            );
        }
    );


    /* Game Over */

    if (gameOverScreen) {

        ctx.fillStyle =
            "rgba(0,0,0,0.6)";

        ctx.fillRect(
            0,
            0,
            canvas.width,
            canvas.height
        );


        ctx.fillStyle = "white";

        ctx.textAlign = "center";

        ctx.font =
            "bold 30px Arial";

        ctx.fillText(
            "Game Over",
            canvas.width / 2,
            190
        );


        ctx.font =
            "16px Arial";

        ctx.fillText(
            "Press Restart",
            canvas.width / 2,
            220
        );
    }
}


/* =========================
   KEYBOARD CONTROL
========================= */

document.addEventListener(
    "keydown",
    function(event) {

        const key =
            event.key.toLowerCase();


        const keys = {

            arrowup: [0, -1],
            w: [0, -1],

            arrowdown: [0, 1],
            s: [0, 1],

            arrowleft: [-1, 0],
            a: [-1, 0],

            arrowright: [1, 0],
            d: [1, 0]

        };


        if (keys[key]) {

            event.preventDefault();

            changeDirection(
                keys[key][0],
                keys[key][1]
            );


            if (
                !running &&
                statusElement.textContent ===
                "Ready"
            ) {

                startGame();
            }
        }
    }
);


/* =========================
   BUTTONS
========================= */

startButton.addEventListener(
    "click",
    startGame
);

restartButton.addEventListener(
    "click",
    restartGame
);


/* =========================
   START
========================= */

resetGame();