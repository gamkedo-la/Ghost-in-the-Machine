class PortalClass extends WallClass {
	constructor(wallClone = {}) {
        super(wallClone);
        this.color = wallClone.color || 0x888888;
        this.transparency = true;
    }

	draw2D() {
        // change color to transparent
		colorLine(this.p1.x, this.p1.y, this.p2.x, this.p2.y, 2, this.color);
	};
}
