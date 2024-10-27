class PlayerClass extends BitBunnyRobot{
	constructor() {
		super();

		this.name = "Player";

		this.attackDamage = 20;

		this.brain = new PlayerBrain(this);
	}

	draw2D() {
		colorLine(this.pos.x, this.pos.y, this.pos.x + this.forward.x * (this.radius + 5), this.pos.y +this.forward.y * (this.radius + 5), 2, "darkgrey");
		colorEmptyCircle(this.pos.x, this.pos.y, this.radius, "darkgrey");
	}
}

class PlayerBrain extends Brain {
	constructor(body) {
		super(body);

		this.fovThreshold = ENTITY_FOV_ALIGNMENT_THRESHOLD;
		this.lookSpeed = 0.2;
	}

	think(deltaTime) {
		// Check for swap
		const rayEnd = addVectors(this.pos, scaleVector(this.forward, 200));
		if (Key.isJustPressed(Key.SPACE)) {
			let closestIntersection = getClosestIntersection(this.pos, rayEnd, this.level.walls);
			let maxDistance = closestIntersection ? distanceBetweenTwoPoints(closestIntersection, this.pos) : 200;
			//console.log("Max Distance: " + maxDistance);
			for (let i = this.level.entities.length - 1; i >= 0; i--) {
				if (this.level.entities[i] == player) continue;

				let nearestPoint = getNearestPointOnLine(this.pos, rayEnd, this.level.entities[i].pos);
				let distance = distanceBetweenTwoPoints(this.level.entities[i].pos, nearestPoint);
				//console.log(this.level.entities[i].name + ": " + distance);

				if (distance < this.level.entities[i].radius) {
					let name = this.name;
					player.brain = this.level.entities[i].brain;
					player.brain.body = player;
					player.name = this.level.entities[i].name;

					this.level.entities[i].brain = this;
					this.body = this.level.entities[i];
					this.body.name = name;

					player = this.body;

					FOV = -60;
					
					return;
				}
			}

			return;
		}

		if (Key.isJustPressed(Key.R)) {
			this.body.destroy();
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
			this.triggerAction();		
		}

		this.setDirectionVector(rayEnd);
	}
}