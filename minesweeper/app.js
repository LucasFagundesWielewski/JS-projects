document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid')
    const flagsLeft = document.querySelector('#flags-left')
    const result = document.querySelector('#result')
    let width = 10
    let bombAmount = 10
    let squares = []
    let isGameOver = false

    function createBoard() {
        flagsLeft.innerHTML = bombAmount

        const bombsArray = Array(bombAmount).fill('bomb')
        const emptyArray = Array(width*width - bombAmount).fill('valid')
        const gameArray = emptyArray.concat(bombsArray)
        const shuflledArray = gameArray.sort(() => Math.random() -0.5 )

        for(let i = 0;  i < width*width; i++) {
            const square = document.createElement('div')
            square.setAttribute('id', i)
            square.classList.add(shuflledArray[i])
            grid.appendChild(square)
            square.push(square)

            square.addEventListener('click', function(e) {
                this.click(square)
            })

            square.oncontextmenu = function(e) {
                e.preventDefault()
            }
        }

        for (let i = 0; i < squares.length; i++) {
            let total = 0
            const isLeftEdge = (i % width === 0)
            const isRightEdge = (i % width === width - 1)
            if (squares[i].classList.contains('valid')) {
                
            }
        }
    }
})