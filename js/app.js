var BUG_SPEEDS = [150,200,250,300,350,500,650,700,1000],
		BUG_START_Y = [145,230, 315, 395],
		BUG_START_X = -60,
		HERO_START_LIFE = 3,
		HERO_START_X = 204,
		HERO_START_Y = 488,
		HERO_MOVE_X = 101,
		HERO_MOVE_Y = 83,
		RIVAL_START_X = 606,
		RIVAL_START_Y = 70,
		RIVAL_SPEED = 17,
		HEART_X = [101, 202, 303, 404, 505],
		HEART_Y = [160, 240, 320, 400],
		HEARTS_TO_WIN = 3;

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
	this.x = RIVAL_START_X;
	this.y = RIVAL_START_Y;
	this.speed = RIVAL_SPEED;
}

Rival.prototype.render = function() {
	var sprite = this.sprite;
	if (this.x < 320) {
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

Rival.prototype.resetPosition = function() {
	this.x = RIVAL_START_X;
	this.y = RIVAL_START_Y;
	this.speed = RIVAL_SPEED;
}

// Bug
var Bug = function() {
	this.sprite = 'images/enemy-bug.png';
	this.x = BUG_START_X;
	this.y = this.StartPosY;
	this.speed = this.randomSpeed();
}

Bug.prototype.StartPosY = function() {
	return BUG_START_Y[randomNumber(BUG_START_Y.length)];
}

Bug.prototype.randomSpeed = function() {
	return BUG_SPEEDS[randomNumber(BUG_SPEEDS.length)];
}

Bug.prototype.update = function(dt) {
	if (this.x > 707) {
		this.x = BUG_START_X;
		this.y = this.StartPosY();
		this.speed = this.randomSpeed();
	}
	this.x = this.x + this.speed * dt; 
}

Bug.prototype.render = function() {
	ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

// Hero
var Hero = function(x,y,life) {
	this.sprite = 'images/hero.png';
	this.loseSprite = 'images/hero-lose.png';
	this.lifeSprite = 'images/hero-small.png';
	this.x = x;
	this.y = y;
	this.life = life;
	this.hasHeart = false;
}

Hero.prototype.resetPosition = function() {
	this.sprite = 'images/hero.png';
	this.x = HERO_START_X;
	this.y = HERO_START_Y;
	this.hasHeart = false;

}

Hero.prototype.minusLife = function() {
	if (this.life == 1) {
		this.life = 0;
	} else {
		this.life = this.life - 1;
		console.log(this.life);
	}
}

Hero.prototype.update = function(dt) {
	if (this.y < 50) {
		this.resetPosition();
		this.minusLife();
	}
}

Hero.prototype.render = function() {
	ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
	var i = 0;
	for (l = 0; l < this.life; l ++) {
		ctx.drawImage(Resources.get(this.lifeSprite), 5 + i, 605);
		i = i + 30;
	}
}

Hero.prototype.handleInput = function(key) {
	switch (key) {
		case "up":
			if (this.y < 90) {
				console.log('too high');
			} else {
				this.y = this.y - HERO_MOVE_Y;
			}
			break;
		case "down":
			if (this.y > 482) {
				console.log("ya too low");
			} else {
				this.y = this.y + HERO_MOVE_Y;
			}
			break;
		case "left":
			if (this.x < 3) {
				console.log("ya too left")
			} else {
				this.x = this.x - HERO_MOVE_X;
			}
			break;
		case "right":
			if (this.x > 606) {
				console.log("ya too right");
			} else {
				this.x = this.x + HERO_MOVE_X;
			}
			break;
		// case "pause":
		// 	alert("Game paused. Click OK to resume.");
		default:
			return;
	}
}

allBugs = [];
var bug1 = new Bug(),
		bug2 = new Bug(),
		bug3 = new Bug(),
		bug4 = new Bug(),
		bug5 = new Bug(),
		bug6 = new Bug(),
		// bug7 = new Bug(),
		// bug8 = new Bug(),
		// bug9 = new Bug(),
		bug10 = new Bug();

allBugs.push(
	bug1,
	bug2,
	bug3,
	bug4,
	bug5,
	bug6,
	// bug7,
	// bug8,
	// bug9,
	bug10
);

var heart = new Heart();
var hero = new Hero(HERO_START_X, HERO_START_Y, HERO_START_LIFE);
var princess = new Princess;
var rival = new Rival;

document.addEventListener('keydown', function(e) {
	var allowedKeys = {
		37: 'left',
		38: 'up',
		39: 'right',
		40: 'down',
		32: 'space',
		80: 'pause',
	};
	hero.handleInput(allowedKeys[e.keyCode]);
});
