var Engine = (function(global) {
	var doc = global.document,
			win = global.window,
			canvas = doc.createElement('canvas'),
			ctx = canvas.getContext('2d'),
			patterns = {},
			lastTime;

	canvas.width = 707;
	canvas.height = 707;
	doc.body.appendChild(canvas);

	function main() {
		var now = Date.now(),
				dt = (now - lastTime) / 1000.0;

		update(dt);
		render();
		console.log("main is still running");

		lastTime = now;
		win.requestAnimationFrame(main);
	};

	function init() {
		reset();
		lastTime = Date.now();
		main();
	}

	function update(dt) {
		updateEntities(dt);
		bugCollide(dt);
		collectHeart(dt);
		deliverHeart(dt);		
		youLose(dt);
		youWin(dt);
	}

	function updateEntities(dt) {
		allBugs.forEach(function(bug) {
			bug.update(dt);
		});
		hero.update(dt);
		rival.update(dt);
	}

	/**
	*	Computes whether two entities collide
	* @param {object} arg1 is instance of first object entity
	* @param {object} arg2 is instance of second object entity
	* @return {boolean}
	*/
	function collide(entity1, entity2) {
		var proximity = 50;
		if (Math.abs(entity1.x - entity2.x) < proximity && Math.abs(entity1.y - entity2.y) < proximity) {
			return true;
		}
	}

	/**
	* When bug and hero instances collide,
	* 	reset hero position,
	*		minus hero.life by 1
	*		reset heart instance position randomly
	*/
	function bugCollide() {
		allBugs.forEach(function(enemy) {
			if (collide(hero, enemy)) {
				hero.resetPosition();
				heart.resetPosition();
				hero.minusLife();
			}
		});
	}

	/**
	* When hero and heart instances collide,
	* 	set hero.hasHeart = true
	*/
	function collectHeart() {
		if (collide(hero, heart)) {
			hero.hasHeart = true;
			hero.sprite = hero.hasHeartSprite;
			heart.hide();
		}
	}

	/**
	* While hero.hasHeart = true,
	* 	if hero and princess instances collide,
	*		set princess.heartCount += 1
	*/
	function deliverHeart() {
		if (hero.hasHeart === true) {
			if (collide(princess, hero)) {
				princess.heartCount += 1;
				hero.resetPosition();
				heart.resetPosition();
			}
		}
	}

	function render() {
		var rowImages = [
					'images/rock-grass.png',
					'images/grass-block.png',
					'images/stone-block.png',
					'images/stone-block.png',
					'images/stone-block.png',
					'images/stone-block.png',
					'images/grass-block.png'
				],
				numRows = 7,
				numCols = 7,
				row, col;
		for (row = 0; row < numRows; row++) {
			for (col = 0; col < numCols; col++) {
				ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 83);
			}
		}
		renderEntities();
	}

	/**
	* Renders all object instances required for gameplay.
	*/
	function renderEntities() {
		allBugs.forEach(function(enemy) {
			enemy.render();
		});
		hero.render();
		princess.render();
		rival.render();
		heart.render();
	}

	/**
	* Listens for the winning conditions of the game
	* 	and changes sprite images for various entities
	* 	in the game.
	*/
	function youWin() {
		if (princess.heartCount === HEARTS_TO_WIN) {
			if (rival.x < 400) {
				/**
				* When the game is won, if the rival is too 
				* 	close to the princess, draw him at some 
				*		distance away from the hero and princess.
				*/
				rival.x = hero.x + 100;
			}			
			allBugs = [];
			heart.hide();
			hero.x = 160;
			hero.y = 70;
			hero.sprite = hero.winSprite;
			princess.sprite = princess.winSprite;
			rival.sprite = rival.loseSprite;
			rival.speed = 0;
		}
	}

	/**
	*	Listens for losing conditions of the game and,
	* 	changes sprite images for various entities
	* 	in the game.
	*/ 
	function youLose() {
		if (collide(rival, princess) || hero.life === 0) {
			allBugs = [];
			rival.speed = 0;
			rival.x = 160;
			rival.y = 70;
			hero.sprite = hero.loseSprite;
			hero.x = 303;
			hero.y = 200;
			heart.hide();
			princess.sprite = princess.winSprite;
		}
	}

	function reset() {
		// noop
	}

	Resources.load([
		'images/stone-block.png',
		'images/water-block.png',
		'images/grass-block.png',
		'images/enemy-bug.png',
		'images/rock-grass.png',
		'images/princess.png',
		'images/princess-win.png',
		'images/rival.png',
		'images/rival-lose.png',
		'images/rival-true-intention.png',
		'images/heart.png',
		'images/heart_small.png',
		'images/hero.png',
		'images/hero-win.png',
		'images/hero-lose.png',
		'images/hero-small.png',
		'images/hero-has-heart.png',
		'images/gem.png'
	]);
	Resources.onReady(init);

	global.ctx = ctx;
})(this);
