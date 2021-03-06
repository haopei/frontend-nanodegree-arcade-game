var ENEMY_SPEEDS = [150,200,250,300,350,400,450],
		ENEMY_START_Y = [145,230, 315, 395],
		ENEMY_START_X = 0,
		PLAYER_START_LIFE = 5,
		PLAYER_START_X = 204,
		PLAYER_START_Y = 488,
		PLAYER_MOVE_Y = 83,
		PLAYER_MOVE_X = 101,
		HEART_X = [101, 202, 303, 404, 505],
		HEART_Y = [160, 240, 320, 400],
		HEARTS_TO_WIN = 3;		

		// GEM_X = [101, 202, 303, 404, 505],
		// GEM_Y = [50, 133, 216, 299, 382];


var randomNumber = function(range) {
	return Math.floor(Math.random()*range);
};

// Heart
var Heart = function() {
	this.sprite = 'images/heart.png';
	this.x = HEART_X[randomNumber(HEART_X.length)];
	this.y = HEART_Y[randomNumber(HEART_Y.length)];
}

Heart.prototype.render = function() {
	ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

Heart.prototype.hide = function() {
	this.x = -500;
	this.y = -500;
}

Heart.prototype.reset = function() {
	this.x = HEART_X[randomNumber(HEART_X.length)];
	this.y = HEART_Y[randomNumber(HEART_Y.length)];
}



// Princess
var Princess = function() {
	this.sprite = 'images/princess.png';
	this.heartSprite = 'images/heart_small.png';
	this.winSprite = 'images/princess-win';
	this.x = 101;
	this.y = 70;
	this.heartCount = 0;
}

Princess.prototype.render = function () {
	ctx.drawImage(Resources.get(this.sprite), this.x, this.y);	
	var i = 0;
	for (h = 0; h < this.heartCount; h++) {
		ctx.drawImage(Resources.get(this.heartSprite), this.x + 30 + i, this.y + 120);
		i = i + 11;
	}
}

// Rival
var Rival = function() {
	this.sprite = 'images/rival.png';
	this.trueIntentionSprite = 'images/rival-true-intention.png';
	this.loseSprite = 'images/rival-lose.png';
	this.x = 606;
	this.y = 70;
	this.speed = 20;
}

Rival.prototype.render = function() {
	var sprite = this.sprite;
	if (this.x < 290) {
		sprite = this.trueIntentionSprite;
	} 
	if (princess.heartCount === HEARTS_TO_WIN) {
		sprite = this.loseSprite;
	}
	ctx.drawImage(Resources.get(sprite), this.x, this.y);	
}

Rival.prototype.update = function(dt) {
	this.x = this.x - this.speed * dt;
}

// Enemy
var Enemy = function() {
	this.sprite = 'images/enemy-bug.png';
	this.x = ENEMY_START_X;
	this.y = this.StartPosY;
	this.speed = this.randomSpeed();
}

Enemy.prototype.StartPosY = function() {
	return ENEMY_START_Y[randomNumber(ENEMY_START_Y.length)];
}

Enemy.prototype.randomSpeed = function() {
	return ENEMY_SPEEDS[randomNumber(ENEMY_SPEEDS.length)];
}

Enemy.prototype.update = function(dt) {
	if (this.x > 707) {
		this.x = ENEMY_START_X;
		this.y = this.StartPosY();
		this.speed = this.randomSpeed();
	}
	this.x = this.x + this.speed * dt; 
}

Enemy.prototype.render = function() {
	ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

// Player
var Player = function(x,y,life) {
	this.sprite = 'images/hero.png';
	this.loseSprite = 'images/hero-lose.png';
	this.lifeSprite = 'images/hero-small.png';
	this.x = x;
	this.y = y;
	this.life = life;
	this.hasHeart = false;
}

Player.prototype.resetPosition = function() {
	this.x = PLAYER_START_X;
	this.y = PLAYER_START_Y;
	this.hasHeart = false;
	this.sprite = 'images/hero.png';
}

Player.prototype.minusLife = function() {
	if (this.life == 1) {
		this.life = 0;
	} else {
		this.life = this.life - 1;
		console.log(this.life);
	}
}

Player.prototype.update = function(dt) {
	if (this.y < 50) {
		this.resetPosition();
		this.minusLife();
	}
}

Player.prototype.render = function() {
	ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
	var i = 0;
	for (l = 0; l < this.life; l ++) {
		ctx.drawImage(Resources.get(this.lifeSprite), 5 + i, 605);
		i = i + 30;
	}
}

Player.prototype.handleInput = function(key) {
	switch (key) {
		case "up":
			if (this.y < 90) {
				console.log('too high');
			} else {
				this.y = this.y - PLAYER_MOVE_Y;
			}
			break;
		case "down":
			if (this.y > 482) {
				console.log("ya too low");
			} else {
				this.y = this.y + PLAYER_MOVE_Y;
			}
			break;
		case "left":
			if (this.x < 3) {
				console.log("ya too left")
			} else {
				this.x = this.x - PLAYER_MOVE_X;
			}
			break;
		case "right":
			if (this.x > 606) {
				console.log("ya too right");
			} else {
				this.x = this.x + PLAYER_MOVE_X;
			}
			break;
		default:
			return;
	}
}

allEnemies = [];
var enemy1 = new Enemy(),
		enemy2 = new Enemy(),
		enemy3 = new Enemy(),
		enemy4 = new Enemy(),
		enemy5 = new Enemy(),
		enemy6 = new Enemy(),
		enemy7 = new Enemy();

allEnemies.push(
	enemy1,
	enemy2,
	enemy3,
	enemy4,
	enemy5,
	enemy6,
	enemy7
);

var heart = new Heart();
var player = new Player(PLAYER_START_X, PLAYER_START_Y, PLAYER_START_LIFE);
var princess = new Princess;
var rival = new Rival;

document.addEventListener('keydown', function(e) {
	var allowedKeys = {
		37: 'left',
		38: 'up',
		39: 'right',
		40: 'down',
		32: 'space'
	};
	player.handleInput(allowedKeys[e.keyCode]);
});
