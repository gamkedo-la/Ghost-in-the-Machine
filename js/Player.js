class PlayerClass extends EntityClass{
	constructor() {
		super();
		this.name = "Player";

		this._lookSpeed = 0.75;
		this.moveSpeed = 50;
		this.rotateSpeed = 1.2;
	}

	update(deltaTime) {
		//player look
		this.rotateDelta = mouseMovementX * this._lookSpeed * this.rotateSpeed;
		if (Key.isDown(Key.Q)) {
			this.rotateDelta -= this.rotateSpeed;
		}
		if (Key.isDown(Key.E)) {
			this.rotateDelta += this.rotateSpeed;
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

		super.update(deltaTime);
	}

	draw2D() {
		colorLine(this.pos.x, this.pos.y, this.pos.x + this.forward.x * 10, this.pos.y +this.forward.y * 10, 2, "darkgrey");
		colorEmptyCircle(this.pos.x, this.pos.y, 5, "darkgrey");
	}
}