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
		checkCollisions(dt);
		collectHeart(dt);
		deliverHeart(dt);		
		youLose(dt);
		youWin(dt);


	}

	function updateEntities(dt) {
		allEnemies.forEach(function(enemy) {
			enemy.update(dt);
		});
		player.update(dt);
		rival.update(dt);
	}

	function collide(entity1, entity2) {
		var proximity = 50;
		if (Math.abs(entity1.x - entity2.x) < proximity && Math.abs(entity1.y - entity2.y) < proximity) {
			return true;
		}
	}

	function checkCollisions() {
		allEnemies.forEach(function(enemy) {
			if (collide(player, enemy)) {
				player.resetPosition();
				heart.reset();
				player.minusLife();
			}
		});
	}

	function collectHeart() {
		if (collide(player, heart)) {
			player.hasHeart = true;
			heart.hide();
			player.sprite = 'images/hero-has-heart.png';
			console.log(player.hasHeart);
		}
	}

	function deliverHeart() {
		if (player.hasHeart === true) {
			if (collide(princess, player)) {
				console.log('delivered love');
				princess.heartCount += 1;
				console.log("princess has: " + princess.heartCount + " hearts");
				player.resetPosition();
				heart.reset();
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

	function renderEntities() {
		allEnemies.forEach(function(enemy) {
			enemy.render();
		});
		player.render();
		princess.render();
		rival.render();
		heart.render();
		// player.lifeCountRender();
	}

	function youWin() {
		if (princess.heartCount === HEARTS_TO_WIN) {
			allEnemies = [];
			heart.hide();
			player.x = 160;
			player.y = 70;
			player.sprite = 'images/hero-win.png';
			princess.sprite = 'images/princess-win.png';
			rival.sprite = rival.loseSprite;
			console.log('WIN');
			rival.speed = 0;
		}

	}

	function youLose() {
		if (collide(rival, princess) || player.life === 0) {
			allEnemies = [];
			rival.speed = 0;
			rival.x = 160;
			rival.y = 70;
			player.sprite = player.loseSprite;
			player.x = 303;
			player.y = 200;
			heart.hide();
			princess.sprite = 'images/princess-win.png';
			console.log("LOSE");
		}		

	}

	function reset() {
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

  // function onReady(func) {
  //     readyCallbacks.push(func);
  // }

	global.ctx = ctx;
})(this);
