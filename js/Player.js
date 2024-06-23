class PlayerClass extends BitBunnyRobot{
	constructor() {
		super();

		this.name = "Player";

		this.brain = new PlayerBrain(this);
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
			let rayEnd = addVectors(this.pos, scaleVector(this.forward, 200));
			let closestIntersection = getClosestIntersection(this.pos, rayEnd, this.level.walls);
			let maxDistance = closestIntersection ? distanceBetweenTwoPoints(closestIntersection, this.pos) : 200;
			//console.log("Max Distance: " + maxDistance);
			for (let i = this.level.entities.length - 1; i >= 0; i--) {
				if (this.level.entities[i] == player) continue;

				let nearestPoint = getNearestPointOnLine(this.pos, rayEnd, this.level.entities[i].pos);
				let distance = distanceBetweenTwoPoints(this.level.entities[i].pos, nearestPoint);
				//console.log(this.level.entities[i].name + ": " + distance);

				if (distance < 5) {
					let name = this.name;
					player.brain = this.level.entities[i].brain;
					player.brain.body = player;
					player.name = this.level.entities[i].name;

					this.level.entities[i].brain = this;
					this.body = this.level.entities[i];
					this.body.name = name;

					player = this.body;
					
					return;
				}
			}

			return;
		}

		//player look
		this.rotateDelta = mouseMovementX * this.lookSpeed;
		if (Key.isDown(Key.Q)) {
			this.rotateDelta -= this.lookSpeed;
		}
		if (Key.isDown(Key.E)) {
			this.rotateDelta += this.lookSpeed;
		}

		//player move
		if (Key.isDown(Key.W)) {
			this.moveDelta.x += 1;
		}
		if (Key.isDown(Key.S)) {
			this.moveDelta.x -= 1;
		}
		if (Key.isDown(Key.A)) {
			this.moveDelta.y -= 1;
		}
		if (Key.isDown(Key.D)) {
			this.moveDelta.y += 1;
		}

		//player action button
		if (Key.isJustPressed(Key.MOUSE_LEFT)) {
			this.actionTriggered = true;
		}
	}
}