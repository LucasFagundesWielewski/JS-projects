let inputDir = { x: 0, y: 0 };
let speed = 5;
let lastPaintTime = 0;
let snakeArr = [{ x: 13, y: 15 }];
let food = { x: 6, y: 7 };
let score = 0;
let hiscoreval = 0;
let board = document.querySelector('#board'); 
let scoreBox = document.querySelector('#scoreBox'); 
let hiscoreBox = document.querySelector('#hiscoreBox'); 

function main(ctime) {
    window.requestAnimationFrame(main);
    if ((ctime - lastPaintTime) / 1000 < 1 / speed) {
        return;
    }
    lastPaintTime = ctime;
    gameEngine();
}

function isCollide(snake) {
    for (let i = 1; i < snakeArr.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            return true;
        }
    }
    if (snake[0].x >= 18 || snake[0].x <= 0 || snake[0].y >= 18 || snake[0].y <= 0) {
        return true;
    }
    return false;
}

function gameEngine() {
    if (isCollide(snakeArr)) {
        inputDir = { x: 0, y: 0 };
        alert("Game Over. Press Any Key To Continue");
        snakeArr = [{ x: 13, y: 15 }];
        score = 0;
        scoreBox.innerHTML = 'Score: ' + score;
        return; 
    }
    if (snakeArr[0].x === food.x && snakeArr[0].y === food.y) {
        score += 1;
        if (score > hiscoreval) {
            hiscoreval = score;
            localStorage.setItem("hiscore", JSON.stringify(hiscoreval));
            hiscoreBox.innerHTML = "Hi Score: " + hiscoreval;
        }
        scoreBox.innerHTML = 'Score: ' + score;
        snakeArr.unshift({ x: snakeArr[0].x + inputDir.x, y: snakeArr[0].y + inputDir.y });
        let a = 2;
        let b = 16;
        food = { x: Math.round(a + (b - 1) * Math.random()), y: Math.round(a + (b - 1) * Math.random()) };
    }
    for (let i = snakeArr.length - 2; i >= 0; i--) {
        snakeArr[i + 1] = { ...snakeArr[i] };
    }
    snakeArr[0].x += inputDir.x;
    snakeArr[0].y += inputDir.y;

    board.innerHTML = "";
    snakeArr.forEach((e, index) => {
        snakeElement = document.createElement('div');
        snakeElement.style.gridRowStart = e.y;
        snakeElement.style.gridColumnStart = e.x;
        if (index === 0) {
            snakeElement.classList.add('head');
        } else {
            snakeElement.classList.add('snake');
        }
        board.appendChild(snakeElement);
    });
    let foodElement = document.createElement('div'); 
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add('food');
    board.appendChild(foodElement);
}

let hiscore = localStorage.getItem("hiscore");
if (hiscore === null) {
    hiscoreval = 0;
    localStorage.setItem("hiscore", JSON.stringify(hiscoreval));
} else {
    hiscoreval = JSON.parse(hiscore);
    hiscoreBox.innerHTML = "Hi Score: " + hiscoreval;
}

window.requestAnimationFrame(main);

window.addEventListener('keydown', e => {
    if (isCollide(snakeArr)) {
        window.requestAnimationFrame(main);
        return;
    }

    switch (e.key) {
        case "ArrowUp":
            if (inputDir.y !== 0) break;
            console.log(e.key);
            inputDir.x = 0;
            inputDir.y = -1;
            break;
        case "ArrowDown":
            if (inputDir.y !== 0) break;
            console.log(e.key);
            inputDir.x = 0;
            inputDir.y = 1;
            break;
        case "ArrowLeft":
            if (inputDir.x !== 0) break;
            console.log(e.key);
            inputDir.x = -1;
            inputDir.y = 0;
            break;
        case "ArrowRight":
            if (inputDir.x !== 0) break;
            console.log(e.key);
            inputDir.x = 1;
            inputDir.y = 0;
            break;
        default:
            break;
    }
});

function generateFood() {
    let foodX, foodY;
    do {
        let a = 2;
        let b = 16;
        foodX = Math.round(a + (b - 1) * Math.random());
        foodY = Math.round(a + (b - 1) * Math.random());
    } while (snakeArr.some(segment => segment.x === foodX && segment.y === foodY));
    food = { x: foodX, y: foodY };
}