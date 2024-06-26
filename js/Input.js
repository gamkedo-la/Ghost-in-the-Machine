window.addEventListener('keydown', function (event) { Key.receivekeydown(event.keyCode); event.preventDefault();});
window.addEventListener('keyup', function (event) { Key.receiveKeyup(event.keyCode); event.preventDefault();});

document.getElementById('gameCanvas').addEventListener('mousedown', mouseDown);
document.getElementById('gameCanvas').addEventListener('mouseup', mouseUp);
document.getElementById('gameCanvas').addEventListener('mousemove', mouseMove);
document.getElementById('gameCanvas').addEventListener('wheel', function (event) { mouseScrollY += event.deltaY;});

document.getElementById("gameCanvas").addEventListener('contextmenu', event => event.preventDefault());

var mouseX = 0;
var mouseY = 0;
var mouseMovementX = 0;
var mouseMovementY = 0;
var mouseScrollY = 0;

var pointerlock = false;

function mouseMove(event) {
	mouseX = event.clientX;
	mouseY = event.clientY;
	mouseMovementX += event.movementX;
	mouseMovementY += event.movementY;
}

function isMouseInArea(x, y, width, height) {
	if (mouseX >= x && mouseX <= x + width &&
		mouseY >= y && mouseY <= y + height) {
		return true;
	} else {
		return false;
	}
}

function mouseDown(event) {
	Key.receivekeydown(event.button + 300);
	lockPointer();
}

function mouseUp(event) {
	Key.receiveKeyup(event.button + 300);
}

function lockPointer() {
	if (pointerlock) return;

	canvas.requestPointerLock()
	pointerlock = true;
}

function unlockPointer() {
	if (!pointerlock) return;

	document.exitPointerLock();
	pointerlock = false;
}

const Key = {

	_down: {},
	_pressed: {},
	_released: {},
	callback: {},

	TAB: 9,
	ENTER: 13,
	SHIFT: 16,
	CTRL: 17,
	ALT: 18,
	ESC: 27,
	SPACE: 32,
	LEFT: 37,
	UP: 38,
	RIGHT: 39,
	DOWN: 40,
	DELETE: 46,
	ZERO: 48,
	ONE: 49,
	TWO: 50,
	THREE: 51,
	FOUR: 52,
	FIVE: 53,
	SIX: 54,
	SEVEN: 55,
	EIGHT: 56,
	NINE: 57,
	A: 65,
	B: 66,
	C: 67,
	D: 68,
	E: 69,
	F: 70,
	G: 71,
	H: 72,
	I: 73,
	J: 74,
	K: 75,
	L: 76,
	M: 77,
	N: 78,
	O: 79,
	P: 80,
	Q: 81,
	R: 82,
	S: 83,
	T: 84,
	U: 85,
	V: 86,
	W: 87,
	X: 88,
	Y: 89,
	Z: 90,
	COMMA: 188,
	PERIOD: 190,
	BRACKET_LEFT: 219,
	BRACKET_RIGHT: 221,
	PLUS:187,
	MINUS:189,
	MOUSE_LEFT:300,
	MOUSE_MID:301,
	MOUSE_RIGHT:302,

	isDown(keyCode) {
		return this._down[keyCode];
	},

	isJustPressed(keyCode) {
		return this._pressed[keyCode];
	},

	isJustReleased(keyCode) {
		return this._released[keyCode];
	},

	receivekeydown(keyCode) {
		this._pressed[keyCode] = true;
		this._down[keyCode] = true;

		if (this.callback[keyCode]) {
			this.callback[keyCode](true);
		}
	},

	receiveKeyup(keyCode) {
		this._released[keyCode] = true;
		this._down[keyCode] = false;

		if (this.callback[keyCode]) {
			this.callback[keyCode](false);
		}
	},

	update() {
		this._pressed = {};
		this._released = {};

		mouseMovementX = 0;
		mouseMovementY = 0;
		mouseScrollY = 0;
	}
};

Key.callback[Key.ESC] = function(keyDown) {
	if (!keyDown) {
		unlockPointer();
	}
};

Key.callback[Key.MINUS] = function(keyDown) {
	if (keyDown) {
		AudioMan.turnVolumeDown();
	}
};

Key.callback[Key.PLUS] = function(keyDown) {
	if (keyDown) {
		AudioMan.turnVolumeUp();
	}
};