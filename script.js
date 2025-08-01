let direction;
let tilesNum = 225;
let tilesPerRow = Math.sqrt(tilesNum);
let rowStartLeft = new Array();
let rowStartTop = new Array();
let rowEndBottom = new Array();
let rowEndRight = new Array();
let emptyTiles = new Array();
let body = [3, 2, 1];
let moving;
let fruitGenerator;
let powerGenerator;
let gameDiv = document.getElementsByClassName('game')[0];
let boxDimensions = (100 / tilesPerRow).toFixed(3);
let restartButton = document.getElementById('restart_game');
let scoreSpan = document.getElementsByClassName('score')[0];
let score = 0;
let speed = 0.1;

// Create the Grid
function createGrid() {
    for (let i = 1; i <= tilesNum; i++) {
        gameDiv.innerHTML =
            gameDiv.innerHTML +
            '<div class="tile" data-tile="' +
            i +
            '"style="width:' +
            boxDimensions +
            '%; height:' +
            boxDimensions +
            '%"></div>';
    }
}

// Create the Snake Body
function createBody() {
    for (let i = 1; i <= body.length; i++) {
        if (i == 3) {
            document
                .querySelector('[data-tile="' + i + '"]')
                .classList.add('head', 'body');
        } else if (i == 1 || i == 2) {
            document
                .querySelector('[data-tile="' + i + '"]')
                .classList.add('body');
        }
    }
}

// Array consisting of upmost left boxes
for (let i = 1; i <= tilesNum; i += tilesPerRow) {
    rowStartLeft.push(i);
}

// Array consisting of upmost right boxes
for (let i = tilesPerRow; i <= tilesNum; i += tilesPerRow) {
    rowEndRight.push(i);
}

// Array consisting of upmost top boxes
for (let i = 1; i <= tilesPerRow; i += 1) {
    rowStartTop.push(i);
}

// Array consisting of upmost bottom boxes
for (let i = tilesNum - tilesPerRow; i <= tilesNum; i += 1) {
    rowEndBottom.push(i);
}

window.addEventListener('keydown', control, false);

// Control the snake
function control(e) {
    // RIGHT ARROW
    if (e.keyCode == '39') {
        if (direction != 'r' && direction != 'l') {
            changeDirection('r');
        }
    }

    // LEFT ARROW
    if (e.keyCode == '37') {
        if (direction != 'l' && direction != 'r') {
            changeDirection('l');
        }
    }

    // DOWN ARROW
    if (e.keyCode == '40') {
        if (direction != 'd' && direction != 'u') {
            changeDirection('d');
        }
    }

    // UP ARROW
    if (e.keyCode == '38') {
        if (direction != 'u' && direction != 'd') {
            changeDirection('u');
        }
    }
}

// Control and change the direction of the snake
function changeDirection(d) {
    let directionDeciderNum, directionArrayInit, directionArrayOf;

    switch (d) {
        case 'r':
            directionDeciderNum = 1;
            directionArrayInit = rowEndRight;
            directionArrayOf = rowStartLeft;
            break;

        case 'l':
            directionDeciderNum = -1;
            directionArrayInit = rowStartLeft;
            directionArrayOf = rowEndRight;
            break;

        case 'd':
            directionDeciderNum = tilesPerRow;
            directionArrayInit = rowEndBottom;
            directionArrayOf = rowStartTop;
            break;

        case 'u':
            directionDeciderNum = -tilesPerRow;
            directionArrayInit = rowStartTop;
            directionArrayOf = rowEndBottom;
            break;
    }

    clearInterval(moving);

    moving = setInterval(function () {
        direction = d;
        let head = document.getElementsByClassName('head')[0];

        let nextTileNum =
            directionArrayInit.indexOf(parseInt(head.dataset.tile, 10)) > -1
                ? directionArrayOf[
                      directionArrayInit.indexOf(
                          parseInt(head.dataset.tile, 10)
                      )
                  ]
                : parseInt(head.dataset.tile, 10) + directionDeciderNum;

        if (body.indexOf(nextTileNum) > -1) {
            scoreSpan.innerHTML = +score + '. GAME OVER';
            clearInterval(fruitGenerator);
        } else {
            let nextTile = document.querySelector(
                '[data-tile ="' + nextTileNum + '"]'
            );
            let lastTile = document.querySelector(
                '[data-tile ="' + body[body.length - 1] + '"]'
            );
            body.unshift(nextTileNum);
            nextTile.classList.add('head', 'body');
            // IF EATEN FRUIT
            if (nextTile.classList.contains('fruit')) {
                score += 1;
                scoreSpan.innerHTML = score;
                speed = score % 2 == 0 ? (speed += 0.01) : speed;
                nextTile.classList.remove('fruit');
                clearInterval(fruitGenerator);
                generateFruit();
                fruitGen();
            }
            // IF JUST MOVING
            else {
                lastTile.classList.remove('body');
                body.pop();
            }
            head.classList.remove('head');
        }
    }, 10 / speed);
}

// Generate the Fruit
function generateFruit() {
    let rand;
    let fruit = document.getElementsByClassName('fruit')[0];
    if (fruit) {
        fruit.classList.remove('fruit');
    }

    do {
        rand = Math.floor(Math.random() * tilesNum);
    } while (body.indexOf(rand) > 1);
    {
        document
            .querySelector('[data-tile = "' + rand + '"]')
            .classList.add('fruit');
    }
}

// Generate a new fruit in every 3 seconds
function fruitGen() {
    fruitGenerator = setInterval(function () {
        generateFruit();
    }, 3000);
}

// Start the game
function startGame() {
    createGrid();
    createBody();
    generateFruit();
}

// Restart Game
restartButton.addEventListener(
    'click',
    function () {
        restartGame();
    },
    false
);

// Restart the game
function restartGame() {
    scoreSpan.innerHTML = '0';
    clearInterval(fruitGenerator);
    clearInterval(moving);

    body = [3, 2, 1];
    speed = 0.1;
    score = 0;

    document.querySelector('.game').innerHTML = '';
    direction = '';
    startGame();
}

startGame();