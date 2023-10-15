const canvas = document.getElementById("canvas");
const ctx = canvas.getContext('2d');

canvas.width=window.innerWidth;
canvas.height=window.innerHeight;

const keysPressed = [];
const paddleSpeed = 20;

window.addEventListener('keydown', function (e)
{
	keysPressed[e.keyCode] = true;
});

window.addEventListener('keyup', function (e)
{
	keysPressed[e.keyCode] = false;
});

function vec2(x, y)
{
	return {x: x, y: y};
};

function ballClass(pos, velocity, radius)
{
	this.pos = pos;
	this.velocity = velocity;
	this.radius = radius;
	this.update = function()
	{
		this.pos.x += this.velocity.x;
		this.pos.y += this.velocity.y;
	};

	this.draw = function()
	{
		ctx.fillStyle = "#33ff00";
		ctx.strokeStyle = "#33ff00";
		ctx.beginPath();
		ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2);
		ctx.fill();
		ctx.stroke();
	};
};

function paddleClass(pos, velocity, width, height, keyUpPressed, keyDownPressed)
{
	this.pos = pos;
	this.velocity = velocity;
	this.width = width;
	this.height = height;
	this.score = 0;

	this.update = function()
	{
		if (keysPressed[keyUpPressed])
			this.pos.y -= this.velocity.y;
		if (keysPressed[keyDownPressed])
			this.pos.y += this.velocity.y;
	};

	this.draw = function()
	{
		ctx.fillStyle = "#33ff00";
		ctx.fillRect(this.pos.x, this.pos.y, this.width, this.height);
	};

	this.getHalfWidth = function () { return (this.width / 2); };
	this.getHalfHeight = function () { return (this.height / 2); };
	this.getCenter = function() {  return vec2(this.pos.x + this.getHalfWidth(), this.pos.y + this.getHalfHeight()); };

};

function	paddleCollision_Edges(paddle)
{
	if (paddle.pos.y <= 0)
		paddle.pos.y = 0;
	if (paddle.pos.y + paddle.height >= canvas.height)
		paddle.pos.y = canvas.height - paddle.height;
};

function ballCollisionEdges(ball)
{
	if ((ball.pos.x + ball.radius >= canvas.width) || (ball.pos.x - ball.radius <= 0))
		ball.velocity.x *= -1;
	if ((ball.pos.y + ball.radius >= canvas.height) || (ball.pos.y - ball.radius <= 0))
		ball.velocity.y *= -1;
};

function	respawnBall(ball)
{
	if (ball.velocity.x > 0)
	{
		ball.pos.x = canvas.width - 150;
		ball.pos.y = (Math.random() * (canvas.height - 200)) + 100;
	}

	if (ball.velocity.x < 0)
	{
		ball.pos.x = 150;
		ball.pos.y = (Math.random() * (canvas.height - 200)) + 100;
	}
	ball.velocity.x *= -1;
};

function increaseScore(ball, paddle1, paddle2)
{
	if (ball.pos.x <= -ball.radius)
	{
		paddle2.score++;
		document.getElementById("player2Score").innerHTML = paddle2.score;
		respawnBall(ball);
	}

	if (ball.pos.x >= canvas.width + ball.radius)
	{
		paddle1.score++;
		document.getElementById("player1Score").innerHTML = paddle1.score;
		respawnBall(ball);
	}
};

function	ballPaddleCollision(ball, paddle)
{
	let dx = Math.abs(ball.pos.x - paddle.getCenter().x);
	let dy = Math.abs(ball.pos.y - paddle.getCenter().y);

	if ((dx <= (ball.radius + paddle.getHalfWidth()))
	&& (dy <= (ball.radius + paddle.getHalfHeight())))
		ball.velocity.x *= -1;
};

const ball = new ballClass(vec2(canvas.width / 2, canvas.height / 2), vec2(10, 10), 30);
const paddle1 = new paddleClass(vec2(20, canvas.height / 2), vec2(paddleSpeed, paddleSpeed), 20, 160, 87, 83);
const paddle2 = new paddleClass(vec2(canvas.width - 40, canvas.height / 2), vec2(paddleSpeed, paddleSpeed), 20, 160, 38, 40);

function	gameUpdate()
{
	ball.update();
	paddle1.update();
	paddle2.update();
	paddleCollision_Edges(paddle1);
	paddleCollision_Edges(paddle2);
	ballCollisionEdges(ball);
	ballPaddleCollision(ball,paddle1);
	ballPaddleCollision(ball, paddle2);
};

function	gameDraw()
{
	ball.draw();
	paddle1.draw();
	paddle2.draw();
}

function	gameLoop()
{
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	window.requestAnimationFrame(gameLoop);

	gameUpdate();
	gameDraw();
};

gameLoop();