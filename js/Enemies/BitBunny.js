class BitBunnyRobot extends SceneEntity {
	constructor(entityClone = {}) {
		super(entityClone);

		this.sprite = new SpriteClass(
			'./images/cubeRobotSS.png', 
            12, 1, 
            400, 400
		);
	}
}