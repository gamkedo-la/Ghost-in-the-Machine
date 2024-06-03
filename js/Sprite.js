class SpriteClass {
	constructor(imagePathWithExtension, columns, rows, spriteWidth, spriteHeight) {
		this._c = columns;
		this._r = rows;
		this._w = spriteWidth;
		this._h = spriteHeight;

		this._xOff = 0;
		this._yOff = 0;
		this.xScale = 1;
		this.yScale = 1;

		this._size = rows * columns;
		this._index = 0;

		this._image = new Image();
		this._image.src = imagePathWithExtension;
	}

	setIndex(newIndex) {
		if (newIndex > this._size) newIndex = newIndex % this._size;
		newIndex = Math.floor(newIndex);

		this._index = newIndex;
		this._xOff = this.getColumn() * this._w;
		this._yOff = this.getRow() * this._h;
	}

	setColumn(column) {
		column = column % this._c;
		var row = this.getRow();
		this.setIndex(column + row*this._c);
	}

	getColumn() {
		return (this._index % this._c);
	}

	getColumns() {
		return this._c;
	}

	setRow(row) {
		row = row % this._r;
		var column = this.getColumn();
		this.setIndex(column + row*this._c);
	}

	getRow() {
		return Math.floor(this._index / this._c);
	}

	getRows() {
		return this._r;
	}

	drawAt(centerX, centerY, size) {
		if (!this._image.complete) return;

		canvasContext.drawImage(
			this._image, 
			this._xOff, this._yOff, 
			this._w, this._h, 
			centerX - size*this.xScale/2, centerY - size*this.yScale/2, 
			size*this.xScale, size*this.yScale
		);
	}
}