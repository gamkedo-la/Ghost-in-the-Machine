const WALL_MODE = 0;
const AUDIO_MODE = 1;
const ENTITY_MODE = 2;

const ADD_SINGLE_WALL = 0;
const ADD_MULTI_WALLS = 1;
const SELECT_WALL = 2;

const ADD_ENTITY = 0;
const SELECT_ENTITY = 1;

var wallMode = SELECT_WALL;
var wallColor = "purple";
var wallTexture = new Image();
wallTexture.src = './images/text2Texture100x100.png';

var entityMode = SELECT_ENTITY;

var editMode = WALL_MODE;
var lastPoint = null;
var snapToNearWallPoint = true;
var snapDistance = 5;
var selectDistance = 5;
var selectedElement = null;

var actionListUndoStack = [];
var actionListRedoStack = [];
var MAX_UNDO = 200;

function driveEditor() {
	if (ctrlKey && zKey) {
		undoAction();
		zKey = false;
	}
	if (ctrlKey && yKey) {
		redoAction();
		yKey = false;
	}

	if (editMode == WALL_MODE) runWallMode();
	if (editMode == AUDIO_MODE) runAudioMode()
	if (editMode == ENTITY_MODE) runEntityMode()
}

function switchMode(newMode) {
	lastPoint = null;
	selectedElement = null;
	editMode = newMode;
}

function getDisplayText() {
	var returnText = "";
	switch (editMode) {
		case WALL_MODE:
			returnText = "Wall: ";
			switch (wallMode) {
				case ADD_SINGLE_WALL:
					returnText = returnText + "Add Wall";
					break;
				case ADD_MULTI_WALLS:
					returnText = returnText + "Add Multi-Wall";
					break;
				case SELECT_WALL:
					returnText = returnText + "Select Wall";
					break;
			}
			break;
		case AUDIO_MODE:
			returnText = "Audio";
			break;
		case ENTITY_MODE:
			returnText = "Entity: ";
			switch (entityMode) {
				case ADD_ENTITY:
					returnText = returnText + "Add Entity";
					break;
				case SELECT_ENTITY:
					returnText = returnText + "Select Entity";
					break;
			}
			break;
	}

	return returnText;
}

function runWallMode() {
	if (mouseJustPressed) {
		var mousePos = getMousePositionInWorldSpace();
		if (lastPoint != null && lastPoint.x == mousePos.x && lastPoint.y == mousePos.y) return; //Return early if mouse pos hasnt changed

		if (wallMode == ADD_SINGLE_WALL) {
			if (lastPoint == null) {
				lastPoint = mousePos;
			} else if (lastPoint != null) {
				performAction(new addWallAction(lastPoint, mousePos));
				lastPoint = null;
			}
		}

		if (wallMode == ADD_MULTI_WALLS) {
			if (lastPoint == null) {
				lastPoint = mousePos;
			} else if (lastPoint != null) {
				performAction(new addWallAction(lastPoint, mousePos));
				lastPoint = mousePos;

				//Code to connect textures between walls
			}
		}

		if (wallMode == SELECT_WALL) {
			selectedElement = null;
			var lastDistance = selectDistance*2;
			for (var i = 0; i < currentMap.walls.length; i++) {
				var newDistance = distanceBetweenTwoPoints(mousePos, getNearestPointOnLine(currentMap.walls[i].p1, currentMap.walls[i].p2, mousePos));
				if (newDistance < selectDistance && newDistance < lastDistance) {
					selectedElement = currentMap.walls[i];
					lastDistance = newDistance;
				}
			}
		}
	}

	if (delKey && selectedElement != null) {
		performAction(new deleteWallAction());
		delKey = false;
	}

	if (selectedElement != null) {
		var p1 = getWorldPositionInScreenSpace(selectedElement.p1);
		var p2 = getWorldPositionInScreenSpace(selectedElement.p2);
		colorLine(p1.x, p1.y, p2.x, p2.y, 5, "white");
		colorLine(p1.x, p1.y, p2.x, p2.y, 3, selectedElement.color);
		colorEmptyCircle(p1.x, p1.y, 3, "grey");
		colorEmptyCircle(p2.x, p2.y, 3, "grey");
	}

	colorEmptyCircle(mouseX, mouseY, 5, "white");
	if (lastPoint != null) {
		var pos = getWorldPositionInScreenSpace(lastPoint);
		colorEmptyCircle(pos.x, pos.y, 3, "grey");
		colorLine(pos.x - 5, pos.y, pos.x + 5, pos.y, 1, "grey");
		colorLine(pos.x, pos.y - 5, pos.x, pos.y + 5, 1, "grey");
	}
}

function runAudioMode() {
	// if (mouseJustPressed) {
	// 	var mousePos = getMousePositionInWorldSpace();

	// 	if (audioMode == ADD_AUDIO) {
	// 		performAction(new addAudioNodeAction({x: mousePos.x, y: mousePos.y}));
	// 	}

	// 	if (audioMode == SELECT_AUDIO) {
	// 		selectedElement = null;
	// 		var lastDistance = selectDistance*2;
	// 		for (var i = 0; i < audGeoPoints.length; i++) {
	// 			var newDistance = distanceBetweenTwoPoints(mousePos, audGeoPoints[i]);
	// 			if (newDistance < selectDistance && newDistance < lastDistance) {
	// 				selectedElement = audGeoPoints[i];
	// 				lastDistance = newDistance;
	// 			}
	// 		}
	// 	}
	// }

	// if (delKey && selectedElement != null) {
	// 	performAction(new deleteAudioNodeAction());
	// 	delKey = false;
	// }

	// if (selectedElement != null) {
	// 	var pos = getWorldPositionInScreenSpace(selectedElement);
	// 	colorEmptyCircle(pos.x, pos.y, 3, "blue");
	// }

	// colorEmptyCircle(mouseX, mouseY, 5, "lightblue");
}

function runEntityMode() {
	if (mouseJustPressed) {
		var mousePos = getMousePositionInWorldSpace();

		if (entityMode == ADD_ENTITY) {
			performAction(new addEntityAction({x: mousePos.x, y: mousePos.y}));
		}

		if (entityMode == SELECT_ENTITY) {
			selectedElement = null;
			var lastDistance = selectDistance*2;
			for (var i = 0; i < currentMap.entities.length; i++) {
				var newDistance = distanceBetweenTwoPoints(mousePos, currentMap.entities[i].pos);
				if (newDistance < selectDistance && newDistance < lastDistance) {
					selectedElement = currentMap.entities[i];
					lastDistance = newDistance;
				}
			}
		}
	}

	if (delKey && selectedElement != null) {
		performAction(new deleteEntityAction());
		delKey = false;
	}

	if (selectedElement != null) {
		var pos = getWorldPositionInScreenSpace(selectedElement.pos);
		colorEmptyCircle(pos.x, pos.y, 7, "lightblue");
	}

	colorEmptyCircle(mouseX, mouseY, 5, "lightblue");
}

function outputLevelJSONtoConsole() {
	var newLevel = {};

	newLevel.playerStart = currentMap.playerStart;
	newLevel.topColor = currentMap.topColor;
	newLevel.bottomColor = currentMap.bottomColor;
	if (currentMap.walls.length > 0) {
		newLevel.walls = currentMap.walls;
	}
	if (currentMap.entities.length > 0) {
		newLevel.entities = currentMap.entities;
		for(var i = 0; i < newLevel.entities.length; i++) {
			delete newLevel.entities[i].distance;
		}
	}
	console.log(JSON.stringify(newLevel));
}

function createLevelFromJSON(levelJSON) {
	var newLevel = new LevelClass();
	newLevel.levelJSON = levelJSON;

	return newLevel;
}

function loadLevel(level) {
	level.onLoad = function(){};
	currentMap = level.load();
}

function getMousePositionInWorldSpace() {
	var pos = {x: mouseX + player.x - eCanvas.width/2, y: mouseY + player.y - eCanvas.height/2};
	var newPos = {x: Math.round(pos.x), y: Math.round(pos.y)};
	var lastDistance = snapDistance * 2;

	if (snapToNearWallPoint) {
		for (var i = 0; i < currentMap.walls.length; i++) {
			var newDistanceP1 = distanceBetweenTwoPoints(pos, currentMap.walls[i].p1);
			var newDistanceP2 = distanceBetweenTwoPoints(pos, currentMap.walls[i].p2);

			if (newDistanceP1 < snapDistance && newDistanceP1 < lastDistance) {
				newPos = currentMap.walls[i].p1;
				lastDistance = newDistanceP1;
			}

			if (newDistanceP2 < snapDistance && newDistanceP2 < lastDistance) {
				newPos = currentMap.walls[i].p2;
				lastDistance = newDistanceP2;
			}
		}
	}

	return newPos;
}

function getWorldPositionInScreenSpace(pos) {
	return {x: pos.x - player.x + eCanvas.width/2, y: pos.y - player.y + eCanvas.height/2}
}

function performAction(action) {
	actionListUndoStack.push(action);
	actionListRedoStack.length = 0;
	action.execute();

	if (actionListUndoStack.length > MAX_UNDO) {
		actionListUndoStack.splice(actionListUndoStack.length - MAX_UNDO, 1);
	}
}

function undoAction() {
	if (actionListUndoStack.length == 0) return;

	var action = actionListUndoStack.pop();
	actionListRedoStack.push(action);
	action.undo();
}

function redoAction() {
	if (actionListRedoStack == 0) return;

	var action = actionListRedoStack.pop();
	actionListUndoStack.push(action);
	action.redo();
}

function addWallAction(point1, point2) {
	var wall = null;
	var lastSelected = null;

	this.execute = function() {
		wall = new WallClass();
		wall.p1 = point1;
		wall.p2 = point2;
		wall.color = wallColor;
		wall.texture = wallTexture;
		currentMap.walls.push(wall);

		lastSelected = selectedElement;
		selectedElement = wall;

		return this;
	}

	this.undo = function() {
		currentMap.walls.splice(currentMap.walls.indexOf(wall), 1);

		selectedElement = lastSelected;
		if (lastPoint == wall.p2) {
			lastPoint = wall.p1;
		}
	}

	this.redo = function() {
		currentMap.walls.push(wall);

		selectedElement = wall;
		if (lastPoint == wall.p1) {
			lastPoint = wall.p2;
		}
	}
}

function deleteWallAction() {
	var wall = null;

	this.execute = function() {
		wall = selectedElement;

		currentMap.walls.splice(currentMap.walls.indexOf(wall), 1);
		selectedElement = null;

		return this;
	}

	this.undo = function() {
		currentMap.walls.push(wall);

		selectedElement = wall;
	}

	this.redo = function() {
		currentMap.walls.splice(currentMap.walls.indexOf(wall), 1);

		selectedElement = null;
	}
}

function addEntityAction(pos) {
	var entity = null;
	var lastSelected = null;

	this.execute = function() {
		entity = {pos: pos, name: this.makeName(), rot: d270};
		currentMap.entities.push(entity);

		lastSelected = selectedElement;
		selectedElement = entity;

		return this;
	}

	this.undo = function() {
		currentMap.entities.splice(currentMap.entities.indexOf(entity), 1);

		selectedElement = lastSelected;
	}

	this.redo = function() {
		currentMap.entities.push(entity);

		selectedElement = entity;
	}

	this.makeName = function() {
		var syllibles = ["rob", "kat", "han", "na", "ben", "hec", "tor", "mik", "ja", "jas", "nat", "ky", "by", "bit", "joh", "hor", "as"];
		var endSyllibles = ["na", "ben", "ny", "ey", "te", "e", "son", "an", "lie", "ty", "o"];

		var name = "";
		var numberToAdd = rndFromList([0, 1, 1, 2, 2]);
		for (var i = 0; i <= numberToAdd; i++) {
			var silIndex = rndInt(syllibles.length-1);
			name = name + syllibles[silIndex];
			syllibles.splice(silIndex, 1);
		}
		if (rndInt(3) > numberToAdd) {
			name = name + rndFromList(endSyllibles);
		}

		name = name.charAt(0).toUpperCase() + name.slice(1);
		// name = name  + "-" + rndInt(1000,9999);

		for (var i = 0; i < currentMap.entities.length; i++) {
			if (currentMap.entities[i].name == name) {
				name = this.makeName();
				break;
			}
		}

		return name;
	}
}

function deleteEntityAction() {
	var entity = null;

	this.execute = function() {
		entity = selectedElement;

		currentMap.entities.splice(currentMap.entities.indexOf(entity), 1);
		selectedElement = null;

		return this;
	}

	this.undo = function() {
		currentMap.entities.push(entity);

		selectedElement = entity;
	}

	this.redo = function() {
		currentMap.entities.splice(currentMap.entities.indexOf(entity), 1);

		selectedElement = null;
	}
}