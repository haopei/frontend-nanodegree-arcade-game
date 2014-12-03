
/**
* Variables used in multiple functions in 
*		various documents
* @type {number}
* @type {Array.<number>}
* @const
*/
var BUG_SPEEDS = [150,200,250,300,350,500,650,700,1000],
		BUG_START_Y = [145,230, 315, 395],	// start position ranges of bug entities
		BUG_START_X = -60,
		NUM_OF_BUGS = 5,
		HERO_START_LIFE = 3,
		HERO_START_X = 0,
		HERO_START_Y = 488,
		HERO_MOVE_X = 101,
		HERO_MOVE_Y = 83,
		RIVAL_START_X = 606,
		RIVAL_START_Y = 70,
		RIVAL_SPEED = 17,
		HEART_X = [101, 202, 303, 404, 505],	// position range of heart entity
		HEART_Y = [160, 240, 320, 400],
		HEARTS_TO_WIN = 5;


/**
* Returns a random number from 0-range
* @param {number} the upper limit of range from 0
* @return {number} returns number given an upper limit range
*/
var randomNumber = function(range) {
	return Math.floor(Math.random()*range);
};

// Reset the game
function resetGame() {
	hero.resetAll();
	rival.resetPosition();
	heart.resetPosition();
	princess.resetAll();
	allBugs = [];
	createBugs(NUM_OF_BUGS);
}

/**
*	Creates the heart object to be collected by hero
* and delivered to the princess
* @constructor
*/
var Heart = function() {
	this.sprite = 'images/heart.png';
	this.x = HEART_X[randomNumber(HEART_X.length)];
	this.y = HEART_Y[randomNumber(HEART_Y.length)];
}

Heart.prototype.render = function() {
	ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

/**
* Move the heart off-canvas when hero.hasHeart = true,
* 	or when game is finished.
*/
Heart.prototype.hide = function() {
	this.x = -1000;
	this.y = -1000;
}

/**
* Place the heart entity in a random tile 
*		on the canvas
*/
Heart.prototype.resetPosition = function() {
	this.x = HEART_X[randomNumber(HEART_X.length)];
	this.y = HEART_Y[randomNumber(HEART_Y.length)];
}

/**
* @constructor
*	Creates the Princess object
* 	the person to be saved from Rival
*/
var Princess = function() {
	this.sprite = 'images/princess.png';
	this.heartSprite = 'images/heart_small.png';
	this.winSprite = 'images/princess-win.png';
	this.x = 101;
	this.y = 70;
	this.heartCount = 0;
}

/**
* Draws sprites for the princess entity and its heartCount number
*/
Princess.prototype.render = function () {
	ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
	var i = 0;
	for (h = 0; h < this.heartCount; h++) {
		ctx.drawImage(Resources.get(this.heartSprite), this.x + 20 + i, this.y + 120);
		i = i + 11;
	}
}

/**
*	Resets all properties of this obj to its default values
*/
Princess.prototype.resetAll = function() {
	this.sprite = 'images/princess.png';
	this.heartCount = 0;
}

/**
* Creates the rival against whom the hero
* 	competes for the princess
* @constructor
*/
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
		/**
		* rival.sprite changes to different image
		* when at rival.x < 320
		*/
		sprite = this.trueIntentionSprite;
	} 
	/**
	* rival.sprite changes when game is won
	*/
	if (princess.heartCount === HEARTS_TO_WIN) {
		sprite = this.loseSprite;
	}
	ctx.drawImage(Resources.get(sprite), this.x, this.y);	
}

/**
*	Moves rival entity towards the princess
*		at the speed of RIVAL_SPEED
*/ 
Rival.prototype.update = function(dt) {
	this.x = this.x - this.speed * dt;
}

/**
*	Resets all properties of this obj to default.
*/
Rival.prototype.resetPosition = function() {
	this.x = RIVAL_START_X;
	this.y = RIVAL_START_Y;
	this.speed = RIVAL_SPEED;
} 

/**
* Bug objects move across the screen
* 	and collides with the hero
* @constructor
*/
var Bug = function() {
	this.sprite = 'images/enemy-bug.png';
	this.x = BUG_START_X;
	this.y = this.StartPosY;
	this.speed = this.randomSpeed();
}

/**
*	Computes the random y position of bug entities;
* 	range of start position determined by BUG_START_Y
*/ 
Bug.prototype.StartPosY = function() {
	return BUG_START_Y[randomNumber(BUG_START_Y.length)];
}

/**
* Computes random speed of bug entities;
*		Range of speed determined by BUG_SPEEDS
*/
Bug.prototype.randomSpeed = function() {
	return BUG_SPEEDS[randomNumber(BUG_SPEEDS.length)];
}

Bug.prototype.update = function(dt) {
	/**
	* Re-position bug instance to the start of the canvas
	* 	when it reaches the end of the canvas
	* 	with a new random speed and Y position
	*/
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

/**
* Hero saves the princess before Rival reaches her
* @constructor
*/
var Hero = function(x,y,life) {
	this.sprite = 'images/hero.png';
	this.winSprite = 'images/hero-win.png';
	this.loseSprite = 'images/hero-lose.png';
	this.lifeSprite = 'images/hero-small.png';
	this.hasHeartSprite = 'images/hero-has-heart.png';
	this.x = x;
	this.y = y;
	this.life = life;
	this.hasHeart = false; //
}

/**
* Hero resets position and state after
* 	colliding with bug or delivering heart
*		to princess
*/
Hero.prototype.resetPosition = function() {
	this.sprite = 'images/hero.png';
	this.x = HERO_START_X;
	this.y = HERO_START_Y;
	this.hasHeart = false;
}

/**
*	Resets all properties to default;
*		used for game reset.
*/ 
Hero.prototype.resetAll = function() {
	this.resetPosition();
	this.life = HERO_START_LIFE;
}

/**
* Reduces the life count of hero by 1
*/
Hero.prototype.minusLife = function() {
	this.life = this.life - 1;
}

Hero.prototype.update = function(dt) {
}

Hero.prototype.render = function() {
	ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
	
	/**
	* Draws the number of heart to represent the 
	* 	hero's remaining life.
	*/
	var i = 0;
	for (l = 0; l < this.life; l ++) {
		ctx.drawImage(Resources.get(this.lifeSprite), 5 + i, 605);
		i = i + 30;
	}
}

/**
* Handles in-game keyboard controls 
*/
Hero.prototype.handleInput = function(key) {
	switch (key) {
		case "up":
			if (this.y < 90) {
			} else {
				this.y = this.y - HERO_MOVE_Y;
			}
			break;
		case "down":
			if (this.y > 482) {
			} else {
				this.y = this.y + HERO_MOVE_Y;
			}
			break;
		case "left":
			if (this.x < 3) {
			} else {
				this.x = this.x - HERO_MOVE_X;
			}
			break;
		case "right":
			if (this.x > 505) {
			} else {
				this.x = this.x + HERO_MOVE_X;
			}
			break;
		case "space":
			resetGame();
		default:
			return;
	}
}


/**
* Create instances of bugs in the game
* 	determined by NUM_OF_BUGS
*/
allBugs = [];
function createBugs(number) {
	for (i = 0; i < number; i++) {
		var bug = new Bug();
		allBugs.push(bug);
	}
}

/**
* Instantiate the entities required for the game.
*/
createBugs(NUM_OF_BUGS);
var heart = new Heart();
var hero = new Hero(HERO_START_X, HERO_START_Y, HERO_START_LIFE);
var princess = new Princess;
var rival = new Rival;


/**
* Listens for keydown events
* 	handled by hero.handleInput()
*/
document.addEventListener('keydown', function(e) {
	var allowedKeys = {
		37: 'left',
		38: 'up',
		39: 'right',
		40: 'down',
		32: 'space',
	};
	if (e.keyCode in allowedKeys){
		e.preventDefault();
	}
	hero.handleInput(allowedKeys[e.keyCode]);
});
