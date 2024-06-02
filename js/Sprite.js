class SpriteClass {
	constructor(imagePathWithExtension, columns, rows, spriteWidth, spriteHeight, drawWidth = 100, drawHeight = 100) {
		this._c = columns;
		this._r = rows;
		this._w = spriteWidth;
		this._h = spriteHeight;

		this._xOff = 0;
		this._yOff = 0;
		this.drawWidth = drawWidth;
		this.drawHeight = drawHeight;
		
		this._size = rows * columns;
		this._index = 0;

		this._image = new Image();
		this._image.src = imagePathWithExtension;
	}

	setIndex(newIndex) {
		if (newIndex > this._size) return;

		this._index = newIndex;
		this._xOff = (this._index % this._c) * this._w;
		this._yOff = Math.floor(this._index / this._c) * this._h;
	}

	drawAt(centerX, centerY, scale) {
		if (!this._image.complete) return;

		canvasContext.drawImage(
			this._image, 
			this._xOff, this._yOff, 
			this._w, this._h, 
			centerX - this.drawWidth/2 * scale, centerY - this.drawHeight/2 * scale, 
			this.drawWidth * scale, this.drawHeight * scale);
	}
}