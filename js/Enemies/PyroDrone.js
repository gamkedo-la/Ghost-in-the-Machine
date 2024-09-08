class PyroDroneRobot extends SceneEntity {
	constructor(entityToOverride = {}) {
		super(entityToOverride);

		this.moveSpeed = 30;
		this.rotateSpeed = 90;

		this.attackDamage = 10;

		this.sprite = new SpriteClass(
			'./images/fireEnemyFloater.png',
            8, 1,
            579, 452
		);

		this.brain = new PyroDroneBrain(this);
	}
}

class PyroDroneBrain extends Brain {}