var canvas = document.getElementById("canvas");
var ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var keysPressed = [];
var paddleSpeed = 20;
window.addEventListener('keydown', function (e) { keysPressed[e.keyCode] = true; });
window.addEventListener('keyup', function (e) { keysPressed[e.keyCode] = false; });
function vec2(x, y) { return { x: x, y: y }; }
;
var ballClass = /** @class */ (function () {
    function ballClass(startpos, velocity, radius) {
        this.update = function () {
            this._pos.x += this._velocity.x;
            this._pos.y += this._velocity.y;
        };
        this.draw = function () {
            ctx.fillStyle = "#33ff00";
            ctx.strokeStyle = "#33ff00";
            ctx.beginPath();
            ctx.arc(this._pos.x, this._pos.y, this._radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
        };
        this._pos = startpos;
        this._velocity = velocity;
        this._radius = radius;
    }
    return ballClass;
}());
var paddleClass = /** @class */ (function () {
    function paddleClass(startpos, velocity, width, height, keyUpPressed, keyDownPressed) {
        this.update = function () {
            if (keysPressed[this._keyUpPressed])
                this._pos.y -= this._velocity.y;
            if (keysPressed[this._keyDownPressed])
                this._pos.y += this._velocity.y;
        };
        this.draw = function () {
            ctx.fillStyle = "#33ff00";
            ctx.fillRect(this._pos.x, this._pos.y, this._width, this._height);
        };
        this.getHalfWidth = function () { return (this._width / 2); };
        this.getHalfHeight = function () { return (this._height / 2); };
        this.getCenter = function () { return vec2(this._pos.x + this.getHalfWidth(), this._pos.y + this.getHalfHeight()); };
        this._pos = startpos;
        this._velocity = velocity;
        this._width = width;
        this._height = height;
        this._keyUpPressed = keyUpPressed;
        this._keyDownPressed = keyDownPressed;
        this._score = 0;
    }
    return paddleClass;
}());
function paddleCollision_Edges(paddle) {
    if (paddle._pos.y <= 0)
        paddle._pos.y = 0;
    if (paddle._pos.y + paddle._height >= canvas.height)
        paddle._pos.y = canvas.height - paddle._height;
}
function ballCollisionEdges(ball) {
    if ((ball._pos.y + ball._radius >= canvas.height) || (ball._pos.y - ball._radius <= 0))
        ball._velocity.y *= -1;
}
;
function respawnBall(ball) {
    if (ball._velocity.x > 0) {
        ball._pos.x = canvas.width - 150;
        ball._pos.y = (Math.random() * (canvas.height - 200)) + 100;
    }
    if (ball._velocity.x < 0) {
        ball._pos.x = 150;
        ball._pos.y = (Math.random() * (canvas.height - 200)) + 100;
    }
    ball._velocity.x *= -1;
}
function increaseScore(ball, paddle1, paddle2) {
    if (ball._pos.x <= -ball._radius) {
        paddle2._score++;
        document.getElementById("player2Score").innerHTML = paddle2._score.toString();
        respawnBall(ball);
    }
    if (ball._pos.x >= canvas.width + ball._radius) {
        paddle1._score++;
        document.getElementById("player1Score").innerHTML = paddle1._score.toString();
        respawnBall(ball);
    }
}
function PlayerOne_PaddleCollision(paddle1) {
    if (ball._pos.x - (ball._radius / 2) < paddle1._pos.x
        && ball._pos.y + ball._radius >= paddle1._pos.y
        && ball._pos.y + ball._radius <= (paddle1._pos.y + (paddle1._height / 4))) {
        ball._velocity.x = -10;
        return;
    }
    if (ball._pos.x - (ball._radius / 2) < paddle1._pos.x
        && (ball._pos.y + ball._radius) >= (paddle1._pos.y + paddle1._height - (paddle1._height / 4))
        && (ball._pos.y - ball._radius) <= (paddle1._pos.y + paddle1._height)) {
        ball._velocity.x = -10;
        return;
    }
    if (ball._pos.x - ball._radius >= paddle1._pos.x
        && ball._pos.x - ball._radius <= paddle1._pos.x + paddle1._width
        && ball._pos.y + ball._radius >= paddle1._pos.y
        && ball._pos.y + ball._radius <= paddle1._pos.y + (paddle1._height / 4)) {
        ball._velocity.y = -10;
        ball._velocity.x = 10;
    }
    if (ball._pos.x - ball._radius >= paddle1._pos.x
        && ball._pos.x - ball._radius <= paddle1._pos.x + paddle1._width
        && ball._pos.y - ball._radius <= paddle1._pos.y + paddle1._height
        && ball._pos.y + ball._radius >= paddle1._pos.y + paddle1._height - (paddle1._height / 4)) {
        ball._velocity.y = 10;
        ball._velocity.x = 10;
    }
}
function PlayerTwo_PaddleCollision(paddle2) {
    if (ball._pos.x + (ball._radius / 2) > paddle2._pos.x
        && ball._pos.y + ball._radius >= paddle2._pos.y
        && ball._pos.y + ball._radius <= (paddle2._pos.y + (paddle2._height / 4))) {
        ball._velocity.x = 10;
        return;
    }
    if (ball._pos.x + (ball._radius / 2) > paddle2._pos.x
        && (ball._pos.y - ball._radius) <= (paddle2._pos.y + paddle2._height)
        && (ball._pos.y - ball._radius) >= (paddle2._pos.y + paddle2._height - (paddle2._height / 4))) {
        ball._velocity.x = 10;
        return;
    }
    if (ball._pos.x + ball._radius >= paddle2._pos.x
        && ball._pos.x + ball._radius <= paddle2._pos.x + paddle2._width
        && ball._pos.y + ball._radius >= paddle2._pos.y
        && ball._pos.y + ball._radius <= paddle2._pos.y + (paddle2._height / 4)) {
        ball._velocity.y = -10;
        ball._velocity.x = -10;
    }
    if (ball._pos.x + ball._radius >= paddle2._pos.x
        && ball._pos.x + ball._radius <= paddle2._pos.x + paddle2._width
        && ball._pos.y - ball._radius <= paddle2._pos.y + paddle2._height
        && ball._pos.y - ball._radius >= paddle2._pos.y + paddle2._height - (paddle2._height / 4)) {
        ball._velocity.y = 10;
        ball._velocity.x = -10;
    }
}
function ballPaddleCollision(ball, paddle) {
    PlayerOne_PaddleCollision(paddle1);
    PlayerTwo_PaddleCollision(paddle2);
    if (ball._pos.x + ball._radius > paddle._pos.x &&
        ball._pos.x - ball._radius < paddle._pos.x + paddle._width &&
        ball._pos.y + ball._radius > paddle._pos.y &&
        ball._pos.y - ball._radius < paddle._pos.y + paddle._height)
        ball._velocity.x *= -1;
}
var ball = new ballClass(vec2(canvas.width / 2, canvas.height / 2), vec2(10, 10), 20);
var paddle1 = new paddleClass(vec2(20, canvas.height / 2), vec2(paddleSpeed, paddleSpeed), 20, 160, 87, 83);
var paddle2 = new paddleClass(vec2(canvas.width - 30, canvas.height / 2), vec2(paddleSpeed, paddleSpeed), 20, 160, 38, 40);
function gameUpdate() {
    // console.log(paddle1._pos.x + paddle1._width);
    ball.update();
    paddle1.update();
    paddle2.update();
    paddleCollision_Edges(paddle1);
    paddleCollision_Edges(paddle2);
    ballCollisionEdges(ball);
    ballPaddleCollision(ball, paddle1);
    ballPaddleCollision(ball, paddle2);
    increaseScore(ball, paddle1, paddle2);
}
function gameDraw() {
    ball.draw();
    paddle1.draw();
    paddle2.draw();
}
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    window.requestAnimationFrame(gameLoop);
    gameUpdate();
    gameDraw();
}
gameLoop();
