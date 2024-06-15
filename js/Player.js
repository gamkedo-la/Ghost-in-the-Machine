class PlayerClass extends BitBunnyRobot{
	constructor() {
		super();

		this.name = "Player";

		this.brain = new PlayerBrain(this);
	}

	onAction(deltaTime) {
		console.log("Action");
	}

	draw2D() {
		colorLine(this.pos.x, this.pos.y, this.pos.x + this.forward.x * 10, this.pos.y +this.forward.y * 10, 2, "darkgrey");
		colorEmptyCircle(this.pos.x, this.pos.y, 5, "darkgrey");
	}
}

class PlayerBrain extends Brain {
	constructor(body) {
		super(body);

		this.lookSpeed = 0.75;
	}

	think(deltaTime) {
		// Check for swap
		if (Key.isJustPressed(Key.SPACE)) {
			var focusEntity;
			var focusOffset = -1;
			for (let i = 0; i < this.level.entities.length; i++) {
				var dotProduct = dotProductOfVectors(this.forward, normalizeVector(subtractVectors(this.level.entities[i].pos, this.pos)));
				if (dotProduct >= focusOffset) {
					focusEntity = this.level.entities[i]
					focusOffset = dotProduct
				}
			}

			if (focusOffset > 0.9) {
				swapBrains(this.body, focusEntity);
			}

			return;
		}

		//player look
		this.body.rotateDelta = mouseMovementX * this.lookSpeed;
		if (Key.isDown(Key.Q)) {
			this.body.rotateDelta -= this.lookSpeed;
		}
		if (Key.isDown(Key.E)) {
			this.body.rotateDelta += this.lookSpeed;
		}

		//player move
		if (Key.isDown(Key.W)) {
			this.body.moveDelta.x += 1;
		}
		if (Key.isDown(Key.S)) {
			this.body.moveDelta.x -= 1;
		}
		if (Key.isDown(Key.A)) {
			this.body.moveDelta.y -= 1;
		}
		if (Key.isDown(Key.D)) {
			this.body.moveDelta.y += 1;
		}

		//player action button
		if (Key.isJustPressed(Key.MOUSE_LEFT)) {
			this.body.actionTriggered = true;
		}
	}
}

function swapBrains(entity1, entity2) {
	var cacheBrain = entity1.brain;
	var cacheName = entity1.name;

	entity1.brain = entity2.brain;
	entity1.brain.body = entity1;
	entity1.name = entity2.name;

	entity2.brain = cacheBrain;
	entity2.brain.body = entity2;
	entity2.name = cacheName;

	if (player == entity1) {
		player = entity2;
	} else if (player == entity2) {
		player = entity1;
	}
}