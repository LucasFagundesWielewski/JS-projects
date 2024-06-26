document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid');
    const flagsLeft = document.querySelector('#flags-left');
    const result = document.querySelector('#result');
    const currentTimeDisplay = document.querySelector('#current-time');
    const bestTimeDisplay = document.querySelector('#best-time');
    const toggleThemeButton = document.querySelector('#toggle-theme');
    const toggleHardModeButton = document.querySelector('#toggle-hard-mode'); // Novo botão para Modo Difícil
    let width = 10;
    let bombAmount = 10;
    let hardMode = false;
    let flags = 0;
    let squares = [];
    let isGameOver = false;
    let timer;
    let time = 0;
    let bestTime = localStorage.getItem('bestTime') || 0;

    if (bestTime) {
        bestTimeDisplay.innerHTML = bestTime;
    }

    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
    }

    toggleThemeButton.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
    });

    toggleHardModeButton.addEventListener('click', () => {
        hardMode = !hardMode;
        bombAmount = hardMode ? 20 : 10; 
        resetGame();
    });

    function startTimer() {
        timer = setInterval(() => {
            time++;
            currentTimeDisplay.innerHTML = time;
        }, 1000);
    }

    function stopTimer() {
        clearInterval(timer);
    }

    function resetGame() {
        grid.innerHTML = '';
        result.innerHTML = '';
        flagsLeft.innerHTML = bombAmount;
        flags = 0;
        squares = [];
        isGameOver = false;
        time = 0;
        currentTimeDisplay.innerHTML = time;
        stopTimer();
        createBoard();
    }

    function createBoard() {
        flagsLeft.innerHTML = bombAmount;

        const bombsArray = Array(bombAmount).fill('bomb');
        const emptyArray = Array(width * width - bombAmount).fill('valid');
        const gameArray = emptyArray.concat(bombsArray);
        const shuffledArray = gameArray.sort(() => Math.random() - 0.5);

        for (let i = 0; i < width * width; i++) {
            const square = document.createElement('div');
            square.setAttribute('id', i);
            square.classList.add(shuffledArray[i]);
            grid.appendChild(square);
            squares.push(square);

            square.addEventListener('click', function(e) {
                if (time === 0 && !isGameOver) startTimer();
                click(square);
            });

            square.oncontextmenu = function(e) {
                e.preventDefault();
                addFlag(square);
            }
        }

        for (let i = 0; i < squares.length; i++) {
            let total = 0;
            const isLeftEdge = (i % width === 0);
            const isRightEdge = (i % width === width - 1);
            if (squares[i].classList.contains('valid')) {
                if (i > 0 && !isLeftEdge && squares[i - 1].classList.contains('bomb')) total++;
                if (i > 9 && !isRightEdge && squares[i + 1 - width].classList.contains('bomb')) total++;
                if (i > 10 && squares[i - width].classList.contains('bomb')) total++;
                if (i > 11 && !isLeftEdge && squares[i - 1 - width].classList.contains('bomb')) total++;
                if (i < 98 && !isRightEdge && squares[i + 1].classList.contains('bomb')) total++;
                if (i < 90 && !isLeftEdge && squares[i - 1 + width].classList.contains('bomb')) total++;
                if (i < 88 && !isRightEdge && squares[i + 1 + width].classList.contains('bomb')) total++;
                if (i < 89 && squares[i + width].classList.contains('bomb')) total++;
                squares[i].setAttribute('data', total);
            }
        }
    }

    createBoard();

    function click(square) {
        let currentId = square.id;
        if (isGameOver) return;
        if (square.classList.contains('checked') || square.classList.contains('flag')) return;
        if (square.classList.contains('bomb')) {
            gameOver(square);
        } else {
            let total = square.getAttribute('data');
            if (total != 0) {
                square.classList.add('checked');
                if (total == 1) square.classList.add('one');
                if (total == 2) square.classList.add('two');
                if (total == 3) square.classList.add('three');
                if (total == 4) square.classList.add('four');
                square.innerHTML = total;
                return;
            }
            checkSquare(square, currentId);
        }
        square.classList.add('checked');
        checkForWin();
    }

    function addFlag(square) {
        if (isGameOver) return;
        if (!square.classList.contains('checked') && (flags < bombAmount || square.classList.contains('flag'))) {
            if (!square.classList.contains('flag')) {
                square.classList.add('flag');
                square.innerHTML = '🚩';
                flags++;
                flagsLeft.innerHTML = bombAmount - flags;
                checkForWin();
            } else {
                square.classList.remove('flag');
                square.innerHTML = '';
                flags--;
                flagsLeft.innerHTML = bombAmount - flags;
            }
        }
    }

    function checkSquare(square, currentId) {
        const isLeftEdge = (currentId % width === 0);
        const isRightEdge = (currentId % width === width - 1);

        setTimeout(() => {
            if (currentId > 0 && !isLeftEdge) {
                const newId = squares[parseInt(currentId) - 1].id;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }
            if (currentId > 9 && !isRightEdge) {
                const newId = squares[parseInt(currentId) + 1 - width].id;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }
            if (currentId > 10) {
                const newId = squares[parseInt(currentId - width)].id;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }
            if (currentId > 11 && !isLeftEdge) {
                const newId = squares[parseInt(currentId) - 1 - width].id;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }
            if (currentId < 98 && !isRightEdge) {
                const newId = squares[parseInt(currentId) + 1].id;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }
            if (currentId < 90 && !isLeftEdge) {
                const newId = squares[parseInt(currentId) - 1 + width].id;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }
            if (currentId < 88 && !isRightEdge) {
                const newId = squares[parseInt(currentId) + 1 + width].id;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }
            if (currentId < 89) {
                const newId = squares[parseInt(currentId) + width].id;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }
        }, 10);
    }

    function checkForWin() {
        let matches = 0;

        for (let i = 0; i < squares.length; i++) {
            if (squares[i].classList.contains('flag') && squares[i].classList.contains('bomb')) {
                matches++;
            }
            if (matches === bombAmount) {
                result.innerHTML = 'YOU WIN!';
                stopTimer();
                isGameOver = true;
                if (time < bestTime || bestTime === 0) {
                    bestTime = time;
                    localStorage.setItem('bestTime', bestTime);
                    bestTimeDisplay.innerHTML = bestTime;
                }
            }
        }
    }

    function gameOver(square) {
        result.innerHTML = 'BOOM! Game Over!';
        stopTimer();
        isGameOver = true;

        squares.forEach(square => {
            if (square.classList.contains('bomb')) {
                square.innerHTML = '💣';
            }
        });
    }
});
