// 캔버스와 그리기 도구 객체를 정의한다
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

// 캔버스의 가로, 세로 크기를 변수에 저장한다
var width = canvas.width;
var height = canvas.height;

// 캔버스를 블록으로 나누기
var blockSize = 10;
var widthInBlocks = width / blockSize;
var heightInBlocks = height / blockSize;

// 애니메이션 효과 함수 setTimeout, setInterval 함수의 반환값 저장
var intervalId = null;

// 점수 변수 정의
var score = 0;

// 경계선 그리기. drawBorder 함수
var drawBorder = function () {
    ctx.fillStyle = "DarkGray";
    ctx.lineWidth = blockSize;
    ctx.strokeRect(blockSize/2, blockSize/2, width-blockSize, height-blockSize);
};

// 점수 표시하기. drawScore 함수
var drawScore = function () {
    ctx.font = "20px Courier";
    ctx.fillStyle = "Black";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText("Score: " + score, blockSize, blockSize);
};

// 게임 끝내기. gameOver 함수
var gameOver = function () {
    clearInterval(intervalId);
    ctx.font = "60px Courier";
    ctx.fillStyle = "Black";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Game Over", width / 2, height / 2);
    
    if (intervalId !== null) {
        clearTimeout(intervalId);
        // clearInterval(intervalId);
    }
    document.body.removeEventListener("keydown", keyDownEvent);
};

// Block 생성자 만들기
var Block = function (col, row) {
    this.col = col;
    this.row = row;
};

// 뱀을 그리는 drawSquare 메소드 추가
Block.prototype.drawSquare = function (color) {
    var x = this.col * blockSize;
    var y = this.row * blockSize;
    ctx.fillStyle = color;
    ctx.fillRect(x, y, blockSize, blockSize);
};

// 사과를 그리는 drawCircle 메소드 추가
Block.prototype.drawCircle = function (color) {
    var x = this.col * blockSize + blockSize / 2;
    var y = this.row * blockSize + blockSize / 2;
    ctx.fillStyle = color;
    circle(x, y, blockSize / 2, true);
}

// 원을 그리는 circle 함수
var circle = function (x, y, radius, fillCircle) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2, false);
    if (fillCircle) {
        ctx.fill();
    }
    else {
        ctx.stroke();
    }
}

// 사과에 닿았는지, 또는 뱀의 머리가 뱀의 꼬리에 부딪혔는지 확인하는 equal 함수
Block.prototype.equal = function (otherBlock) {
    return (this.col === otherBlock.col) && (this.row === otherBlock.row);
};

// 뱀을 표현할 Snake 생성자 작성
var Snake = function () {
    this.segmants = [
        new Block(7, 5),
        new Block(6, 5),
        new Block(5, 5)
    ];
    
    // 뱀이 현재 진행하는 방향을 저장하는 변수. 초기값 오른쪽
    this.direction = "right";

    // 뱀의 머리가 다음 어디로 향할지 저장하는 변수. 초기값 오른쪽
    this.nextDirection = "right";
};

// 뱀을 그리는 draw 메소드 추가
Snake.prototype.draw = function () {
    var colorIndex = 0;
    var colorsLength = this.colors.length;
    for (body of this.segmants) {
        body.drawSquare(this.colors[colorIndex]);
        colorIndex++;
        colorIndex %= colorsLength;
    }
};

// 뱀 움직임을 나타낼 move 메소드 추가
Snake.prototype.move = function () {
    var head = this.segmants[0];
    var newHead;
    
    this.direction = this.nextDirection;
    
    if (this.direction === "right") {
        newHead = new Block(head.col + 1, head.row);
    } else if (this.direction === "left") {
        newHead = new Block(head.col - 1, head.row);
    } else if (this.direction === "up") {
        newHead = new Block(head.col, head.row - 1);
    } else if (this.direction === "down") {
        newHead = new Block(head.col, head.row + 1);
    }
    
    // 뱀의 새로운 머리가 캔버스의 경계 또는 자기 몸과 충돌하였는지 확인 후 부딪혔다면 게임 종료
    if (this.checkCollision (newHead)) {
        gameOver();
        return;
    }
    
    // 새로운 머리 segmants에 추가하기
    this.segmants.unshift(newHead);
    
    // 사과를 먹었다면 점수 1 증가, 뱀의 길이를 유지. 아니라면 뱀의 꼬리 1개 제거
    if (newHead.equal(apple.position)) {
        score++;
        apple.move();

        // 뱀의 움직임을 더 빠르게 하기
        if (animationTime > 10) animationTime-=5;
    } else {
        this.segmants.pop();
    }
};

// 뱀의 새로운 머리가 캔버스의 경계 또는 자기 몸과 충돌하였는지 알려주는 checkCollision 메소드 추가
Snake.prototype.checkCollision = function (head) {
    var leftCollision = (head.col === 0);
    var rightCollision = (head.col === (widthInBlocks - 1));
    var topCollision = (head.row === 0);
    var bottomCollision = (head.row === (heightInBlocks - 1));
    
    var wallCollision = leftCollision || rightCollision || topCollision || bottomCollision;
    
    var selfCollision = false;
    
    for (body of this.segmants) {
        if (body.equal(head)) {
            selfCollision = true;
            break;
        }
    }
    
    return wallCollision || selfCollision;
}

// 다음 방향을 설정하는 setDirection 메소드 추가
Snake.prototype.setDirection = function (newDirection) {
    if (this.direction === "up" && newDirection === "down") {
        return;
    } else if (this.direction === "right" && newDirection === "left") {
        return;
    } else if (this.direction === "left" && newDirection === "right") {
        return;
    } else if (this.direction === "down" && newDirection === "up") {
        return;
    }
    
    this.nextDirection = newDirection;
}

// 뱀의 색상을 나타내는 색상표
Snake.prototype.colors = [
    'green', 'yellow', 'red', 'orange', 'blue', 'purple', 'gold', 'lime', 'pink', 'brown'
];

// 뱀의 몸통에 새로운 사과의 위치가 포함되는지 확인하고 결과를 반환하는 메소드 추가
Snake.prototype.newAppleCheck = function (col, row) {
    for (body of this.segmants) {
        if (body.col === col && body.row === row) {
            return true;
        }
    }
    return false;
}

// 사과 생성자 정의
var Apple = function () {
    this.position = new Block(10, 10);
};

// 사과 그리기
Apple.prototype.draw = function () {
    this.position.drawCircle("LimeGreen");
};

// 사과 옮기기
Apple.prototype.move = function () {
    do {
        var randomCol = Math.floor( Math.random() * (widthInBlocks - 2) ) + 1 ;
        var randomRow = Math.floor( Math.random() * (widthInBlocks - 2) ) + 1 ;    
    }
    while (snake.newAppleCheck(randomCol, randomRow));

    // 새로운 사과의 위치가 뱀의 몸통에 중복이 안 되는 경우만 아래 구문을 실행
    this.position = new Block(randomCol, randomRow);
};

// 뱀과 사과 객체 만들기
var snake = new Snake();
var apple = new Apple();

// setInterval 함수 대신하여 게임 애니메이션 시간 간격을 저장할 변수
var animationTime = 100;

// animationTIme 간격마다 반복 실행 함수
var gameLoop = function () {
    ctx.clearRect(0, 0, width, height);
    drawScore();
    drawBorder();
    snake.draw();
    snake.move();
    apple.draw();

    intervalId = setTimeout( gameLoop, animationTime );
};
// 게임 실행
gameLoop();

// // 100밀리초 간격마다 반복 실행. setInterval 함수
// intervalId = setInterval( function () {
//     ctx.clearRect(0, 0, width, height);
//     drawScore();
//     drawBorder();
//     snake.move();
//     snake.draw();
//     apple.draw();
// }, 100);

// 키보드 입력 이벤트 핸들러 추가
var directions = {
    37 : "left",
    38 : "up",
    39 : "right",
    40 : "down"
};

document.body.addEventListener("keydown", keyDownEvent);

function keyDownEvent(e) {
    var newDirection = directions[e.keyCode];
    if (newDirection !== undefined) {
        snake.setDirection(newDirection);
        console.log(newDirection);
    }
};