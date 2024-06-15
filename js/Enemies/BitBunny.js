class BitBunnyRobot extends SceneEntity {
	constructor(entityToOverride = {}) {
		super(entityToOverride);
		
		this.moveSpeed = 50;
		this.rotateSpeed = 1.2;

		this.sprite = new SpriteClass(
			'./images/cubeRobotSS.png', 
            12, 1, 
            400, 400
		);
	}
}