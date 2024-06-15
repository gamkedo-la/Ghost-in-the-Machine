class PlayerClass extends EntityClass{
	constructor() {
		super();

		this.name = "Player";
		this.moveSpeed = 50;
		this.rotateSpeed = 1.2;

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