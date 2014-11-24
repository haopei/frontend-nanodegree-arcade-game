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

		lastTime = now;
		// The Window.requestAnimationFrame() method tells the browser that you wish to perform an animation and requests that the browser call a specified function to update an animation before the next repaint. The method takes as an argument a callback to be invoked before the repaint.
		// main() is called before the browser repaints. 
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
	* @param {object} arg1 is instance of an object entity
	* @param {object} arg2 is instance of an object entity
	* @return {boolean}
	*/
	function collide(entity1, entity2) {
		var proximity = 50;
		if (Math.abs(entity1.x - entity2.x) < proximity && Math.abs(entity1.y - entity2.y) < proximity) {
			return true;
		}
	}

	/**
	* Checks if bugs collide with hero
	* 
	*/
	function bugCollide() {
		allBugs.forEach(function(enemy) {
			if (collide(hero, enemy)) {
				hero.resetPosition();
				heart.reset();
				hero.minusLife();
			}
		});
		return;
	}

	function collectHeart() {
		if (collide(hero, heart)) {
			hero.hasHeart = true;
			hero.sprite = hero.hasHeartSprite;
			heart.hide();
		}
	}

	function deliverHeart() {
		if (hero.hasHeart === true) {
			if (collide(princess, hero)) {
				princess.heartCount += 1;
				hero.resetPosition();
				heart.reset();
			}
		}
		return;
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

	function renderEntities() {
		allBugs.forEach(function(enemy) {
			enemy.render();
		});
		hero.render();
		princess.render();
		rival.render();
		heart.render();
	}

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
		// princess.heartCount = 0;
		// rival.resetPosition();
		// hero.resetPosition();

		console.log('reset called');
	}

	// document.getElementById('reset').addEventListener('click', function(event) {
	// 	hero.resetPosition();
	// 	rival.resetPosition();
	// 	princess.heartCount = 0;
	// });

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

  // function onReady(func) {
  //     readyCallbacks.push(func);
  // }

	global.ctx = ctx;
})(this);
