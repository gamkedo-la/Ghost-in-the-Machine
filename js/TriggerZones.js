class TriggerZone {
	constructor(level) {
		this.level = level;
		this._inZone = [];
	}

	checkOverlaps() {
		var entities = this.level.entities;

		for (var i = 0; i < entities.length; i++) {
			var overlapping = this.isOverlapping(entities[i]);
			var isInZone = this._inZone.includes(entities[i]);

			if (overlapping && !isInZone) {
				this.onTriggerEnter(entities[i]);
				this._inZone.push(entities[i]);
			} else if (!overlapping && isInZone) {
				this.onTriggerExit(entities[i]);
				this._inZone.remove(entities[i]);
			}
		}
	}

	isOverlapping(entity) {
		return false;
	}

	onTriggerEnter(entity) {}
	onTriggerExit(entity) {}
}

class CircleTriggerZone extends TriggerZone {
	constructor(level, pos, radius) {
		super(level);

		this.pos = {x:pos.x, y:pos.y};
		this.radius = radius;
	}

	isOverlapping(entity) {
		return distanceBetweenTwoPoints(this.pos, entity.pos) < this.radius;
	}
}

class AABBTriggerZone extends TriggerZone {
	constructor(level, topleftpos, bottomrightpos) {
		super(level);

		this.topleft = {x:topleftpos.x, y:topleftpos.y};
		this.bottomright = {x:bottomrightpos.x, y:bottomrightpos.y};
	}

	isOverlapping(entity) {
		return entity.pos.x >= this.topleft.x && entity.pos.x <= this.bottomright.x &&
			   entity.pos.y <= this.topleft.y && entity.pos.y >= this.bottomright.y;
	}
}