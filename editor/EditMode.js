const WALL_MODE = 0;
const AUDIO_MODE = 1;
const ENTITY_MODE = 2;
const AREA_MODE = 3;
const SPAWN_MODE = 4;

const SELECT_WALL = 0;
const ADD_SINGLE_WALL = 1;
const ADD_MULTI_WALLS = 2;
var wallMode = SELECT_WALL;
var WallColor = "purple";
var currentWallColor = "purple";
var defaultWallColor = "purple";
var wallColorList = ["purple", "red", "orange", "yellow", "green", "blue", "darkgrey", "none"];
var currentWallTexture = 'text2Texture';
var defaultWallTexture = 'text2Texture';
var wallTextureList = ['textTexture', 'text2Texture', "none"];

const SELECT_ENTITY = 0;
const ADD_ENTITY = 1;
var entityMode = SELECT_ENTITY;
var currentEntityRoboType = "undefined";
var defaultEntityRoboType = "undefined";
var entityRoboTypesList = ["BitBunny", "Turret", "undefined"];

const SELECT_AREA = 0;
const ADD_CIRCLE_AREA = 1;
const SET_CIRCLE_AREA = 2;
const ADD_AABB_AREA = 3;
const SET_AABB_AREA = 4;
var areaMode = SELECT_AREA;

const SELECT_SPAWN = 0;
const ADD_SPAWN = 1;
var spawnMode = SELECT_SPAWN;

var editMode = WALL_MODE;
var lastPoint = null;
var snapToNearWallPoint = true;
var snapDistance = 5;
var selectDistance = 7;
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
	if (editMode == AUDIO_MODE) runAudioMode();
	if (editMode == ENTITY_MODE) runEntityMode();
	if (editMode == AREA_MODE) runAreaMode();
	if (editMode == SPAWN_MODE) runSpawnMode();
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
		case AREA_MODE:
			returnText = "Trigger Zones";
			break;
		case SPAWN_MODE:
			returnText = "Starting Points";
			break;
		default:
			break;
	}

	return returnText;
}

function runWallMode() {
	if (mouseJustPressed) {
		var mousePos = getMousePositionInWorldSpace();
		if (lastPoint != null && lastPoint.x == mousePos.x && lastPoint.y == mousePos.y) return; //Return early if mouse pos hasnt changed

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

			if (selectedElement != null) {
				currentWallColor = selectedElement.color;

				if (selectedElement.wallTextureReferance != undefined) {
					currentWallTexture = selectedElement.wallTextureReferance;
				} else {
					currentWallTexture = "none";
				}
			} else {
				currentWallColor = defaultWallColor;
				currentWallTexture = defaultWallTexture;
			}
		}

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
	} else {
		colorEmptyCircle(mouseX, mouseY, selectDistance, "white");
	}

	if (lastPoint != null) {
		var pos = getWorldPositionInScreenSpace(lastPoint);
		colorEmptyCircle(pos.x, pos.y, 3, "grey");
		colorLine(pos.x - 5, pos.y, pos.x + 5, pos.y, 1, "grey");
		colorLine(pos.x, pos.y - 5, pos.x, pos.y + 5, 1, "grey");
	}
}

function runAudioMode() {
	if (mouseJustPressed) {
		var mousePos = getMousePositionInWorldSpace();


		if (audioMode == SELECT_AUDIO) {
			selectedElement = null;
			var lastDistance = selectDistance*2;
			for (var i = 0; i < audGeoPoints.length; i++) {
				var newDistance = distanceBetweenTwoPoints(mousePos, audGeoPoints[i]);
				if (newDistance < selectDistance && newDistance < lastDistance) {
					selectedElement = audGeoPoints[i];
					lastDistance = newDistance;
				}
			}
		}

	// 	if (audioMode == ADD_AUDIO) {
	// 		performAction(new addAudioNodeAction({x: mousePos.x, y: mousePos.y}));
	// 	}
	}

	// if (delKey && selectedElement != null) {
	// 	performAction(new deleteAudioNodeAction());
	// 	delKey = false;
	// }

	if (selectedElement != null) {
		var pos = getWorldPositionInScreenSpace(selectedElement);
		colorEmptyCircle(pos.x, pos.y, 3, "blue");
	} else {
		colorEmptyCircle(mouseX, mouseY, selectDistance, "lightblue");
	}
}

function runEntityMode() {
	if (mouseJustPressed) {
		var mousePos = getMousePositionInWorldSpace();

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
			if (selectedElement != null) {
				if (selectedElement.roboType != undefined) {
					currentEntityRoboType = selectedElement.roboType;
				} else {
					currentEntityRoboType = "undefined";
				}
			} else {
				currentEntityRoboType = defaultEntityRoboType;
			}
		}

		if (entityMode == ADD_ENTITY) {
			performAction(new addEntityAction({x: mousePos.x, y: mousePos.y}));
		}
	}

	if (delKey && selectedElement != null) {
		performAction(new deleteEntityAction());
		delKey = false;
	}

	if (selectedElement != null) {
		var pos = getWorldPositionInScreenSpace(selectedElement.pos);
		colorEmptyCircle(pos.x, pos.y, 7, "lightblue");
	} else {
		colorEmptyCircle(mouseX, mouseY, selectDistance, "lightblue");
	}
}

function runAreaMode() {
	if (mouseJustPressed) {
		var mousePos = getMousePositionInWorldSpace();

		if (areaMode == SELECT_AREA) {
			selectedElement = null;
			var mousePosInLitteral = {pos: mousePos};
			for (var i = 0; i < currentMap.triggerZones.length; i++) {
				if (currentMap.triggerZones[i].isOverlapping(mousePosInLitteral)) {
					selectedElement = currentMap.triggerZones[i];
				}
			}
		}

		if (areaMode == ADD_CIRCLE_AREA) {
			selectedElement = new CircleTriggerZone(currentMap, mousePos, 0);
			selectedElement.type = 'circle';
			areaMode = SET_CIRCLE_AREA;
		} else if (areaMode == SET_CIRCLE_AREA) {
			selectedElement.radius = distanceBetweenTwoPoints(mousePos, selectedElement.pos);
			performAction(new addAreaAction(selectedElement));
			areaMode = ADD_CIRCLE_AREA;
		}

		if (areaMode == ADD_AABB_AREA) {
			selectedElement = new AABBTriggerZone(currentMap, mousePos, mousePos);
			selectedElement.type = 'AABB';
			areaMode = SET_AABB_AREA;
		} else if (areaMode == SET_AABB_AREA) {
			var topleftpos = selectedElement.topleft;
			var bottomrightpos = mousePos;
			
			selectedElement.topleft = {x:topleftpos.x < bottomrightpos.x ? topleftpos.x : bottomrightpos.x, 
			y:topleftpos.y < bottomrightpos.y ? topleftpos.y : bottomrightpos.y};

			selectedElement.bottomright = {x:topleftpos.x > bottomrightpos.x ? topleftpos.x : bottomrightpos.x, 
			y:topleftpos.y > bottomrightpos.y ? topleftpos.y : bottomrightpos.y};

			performAction(new addAreaAction(selectedElement));
			areaMode = ADD_AABB_AREA;
		}

	}

	if (delKey && selectedElement != null) {
		performAction(new deleteAreaAction(selectedElement));
		delKey = false;
	}

	if (selectedElement != null) {
		if(areaMode == SET_CIRCLE_AREA) {
			var pos = getWorldPositionInScreenSpace(selectedElement.pos);
			var radius = distanceBetweenTwoPoints(getMousePositionInWorldSpace(), selectedElement.pos);
			colorEmptyCircle(pos.x, pos.y, radius, "lightgreen");			
		}
		if(areaMode == SET_AABB_AREA) {
			var topleftpos = getWorldPositionInScreenSpace(selectedElement.topleft);
			var bottomrightpos = getMousePositionInScreenSpace();

			var topleft = {x:topleftpos.x < bottomrightpos.x ? topleftpos.x : bottomrightpos.x, 
			y:topleftpos.y < bottomrightpos.y ? topleftpos.y : bottomrightpos.y};

			var bottomright = {x:topleftpos.x > bottomrightpos.x ? topleftpos.x : bottomrightpos.x, 
			y:topleftpos.y > bottomrightpos.y ? topleftpos.y : bottomrightpos.y};

			colorLine(topleft.x, topleft.y, bottomright.x, topleft.y, 2, "lightgreen");
			colorLine(bottomright.x, topleft.y, bottomright.x, bottomright.y, 2, "lightgreen");
			colorLine(bottomright.x, bottomright.y, topleft.x, bottomright.y, 2, "lightgreen");
			colorLine(topleft.x, bottomright.y, topleft.x, topleft.y, 2, "lightgreen");	
		}
		if (selectedElement instanceof CircleTriggerZone) {
			var pos = getWorldPositionInScreenSpace(selectedElement.pos);
			colorEmptyCircle(pos.x, pos.y, selectedElement.radius, "lightgreen");
		}
		if (selectedElement instanceof AABBTriggerZone) {
			var topleft = getWorldPositionInScreenSpace(selectedElement.topleft);
			var bottomright = getWorldPositionInScreenSpace(selectedElement.bottomright);
			colorLine(topleft.x-1, topleft.y, bottomright.x+1, topleft.y, 1.5, "lightgreen");
			colorLine(bottomright.x, topleft.y-1, bottomright.x, bottomright.y+1, 1.5, "lightgreen");
			colorLine(bottomright.x+1, bottomright.y, topleft.x-1, bottomright.y, 1.5, "lightgreen");
			colorLine(topleft.x, bottomright.y-1, topleft.x, topleft.y+1, 1.5, "lightgreen");
		}
	} else {
		colorEmptyCircle(mouseX, mouseY, selectDistance, "lightgreen");
	}
}

function runSpawnMode() {
	if (mouseJustPressed) {
		var mousePos = getMousePositionInWorldSpace();

		if (spawnMode == SELECT_SPAWN) {
			selectedElement = null;
			var lastDistance = selectDistance*2;
			for (var i = 0; i < currentMap.startList.length; i++) {
				var newDistance = distanceBetweenTwoPoints(mousePos, currentMap.startList[i]);
				if (newDistance < selectDistance && newDistance < lastDistance) {
					selectedElement = currentMap.startList[i];
					lastDistance = newDistance;
				}
			}
		}

		if (spawnMode == ADD_SPAWN) {
			performAction(new addSpawnAction({x: mousePos.x, y: mousePos.y, rot:d270}));
		}
	}

	if (delKey && selectedElement != null) {
		performAction(new deleteSpawnAction());
		delKey = false;
	}

	if (selectedElement != null) {
		var pos = getWorldPositionInScreenSpace(selectedElement);
		colorEmptyCircle(pos.x, pos.y, 7, "yellow");
	} else {
		colorEmptyCircle(mouseX, mouseY, selectDistance, "yellow");
	}
}

function outputLevelJSONtoConsole() {
	var newLevel = {};

	newLevel.playerStart = currentMap.playerStart;
	newLevel.startIndex = currentMap.startIndex;
	if (currentMap.startList.length > 0) {
		newLevel.startList = currentMap.startList;
	}

	if (currentMap.walls.length > 0) {
		newLevel.walls = [];
		for(var i = 0; i < currentMap.walls.length; i++) {
			newLevel.walls[i] = new WallClass(currentMap.walls[i]);

			delete newLevel.walls[i].texture;
			if (currentMap.walls[i].wallTextureReferance != undefined) {
				newLevel.walls[i].texture = currentMap.walls[i].wallTextureReferance;
			}
		}
	}

	if (currentMap.entities.length > 0) {
		newLevel.entities = currentMap.entities;
		for(var i = 0; i < newLevel.entities.length; i++) {
			delete newLevel.entities[i].distance;
		}
	}

	if (currentMap.triggerZones.length > 0) {
		newLevel.triggerZones = currentMap.triggerZones;
		for(var i = 0; i < newLevel.triggerZones.length; i++) {
			delete newLevel.triggerZones[i]._inZone;
			delete newLevel.triggerZones[i].level;
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

function getWorldPositionInScreenSpace(pos) {
	return {x: pos.x - player.x + eCanvas.width/2, y: pos.y - player.y + eCanvas.height/2}
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

function getMousePositionInScreenSpace() {
	return getWorldPositionInScreenSpace(getMousePositionInWorldSpace());
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

		if (defaultWallColor != "none") {
			wall.color = defaultWallColor;
		}
		if (defaultWallTexture != "none") {
			wall.texture = new Image();
			wall.texture.src = './images/' + defaultWallTexture + '.png';
			wall.wallTextureReferance = defaultWallTexture;
		}

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

function setWallColorAction(color) {
	var wall = null;
	var oldColor = "none";

	this.execute = function() {
		wall = selectedElement;
		oldColor = wall.color || "none";

		wall.color = color;
		currentWallColor = color;
	}

	this.undo = function() {
		wall.color = oldColor;
		currentWallColor = oldColor;
	}

	this.redo = function() {
		wall.color = color;
		currentWallColor = color;
	}
}

function setWallTextureAction(texture) {
	var wall = null;
	var oldTexture = "none";

	this.execute = function() {
		wall = selectedElement;
		if (wall.wallTextureReferance != undefined) {
			oldTexture = wall.wallTextureReferance;
		}

		delete wall.wallTextureReferance;
		wall.texture = null;
		if (texture != "none") {
			wall.texture = new Image();
			wall.texture.src = './images/' + texture + '.png';
			wall.wallTextureReferance = texture;
		}
		currentWallTexture = texture;
	}

	this.undo = function() {
		delete wall.wallTextureReferance;
		wall.texture = null;
		if (oldTexture != "none") {
			wall.texture = new Image();
			wall.texture.src = './images/' + oldTexture + '.png';
			wall.wallTextureReferance = oldTexture;
		}
		currentWallTexture = oldTexture;
	}

	this.redo = function() {
		delete wall.wallTextureReferance;
		wall.texture = null;
		if (texture != "none") {
			wall.texture = new Image();
			wall.texture.src = './images/' + texture + '.png';
			wall.wallTextureReferance = texture;
		}
		currentWallTexture = texture;
	}
}

function addEntityAction(pos) {
	var entity = null;
	var lastSelected = null;

	this.execute = function() {
		entity = {pos: pos, name: this.makeName(), rot: d270, roboType: defaultEntityRoboType};
		currentMap.entities.push(entity);

		lastSelected = selectedElement;
		selectedElement = entity;
		currentEntityRoboType = defaultEntityRoboType;

		return this;
	}

	this.undo = function() {
		currentMap.entities.splice(currentMap.entities.indexOf(entity), 1);

		selectedElement = lastSelected;
		currentEntityRoboType = defaultEntityRoboType;
	}

	this.redo = function() {
		currentMap.entities.push(entity);

		selectedElement = entity;
		currentEntityRoboType = entity.roboType || defaultEntityRoboType;
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

function setEntityRoboTypeAction(type) {
	var entity = null;
	var oldType = "undefined";

	this.execute = function() {
		entity = selectedElement;
		oldType = entity.roboType || "undefined";

		entity.roboType = type;
		currentEntityRoboType = type;
	}

	this.undo = function() {
		entity.roboType = oldType;
		currentEntityRoboType = oldType;
	}

	this.redo = function() {
		entity.roboType = type;
		currentEntityRoboType = type;
	}
}

function addAreaAction(areaObject) {
	var area = null;

	this.execute = function() {
		area = areaObject;
		currentMap.triggerZones.push(area);

		selectedElement = area;

		return this;
	}

	this.undo = function() {
		currentMap.triggerZones.splice(currentMap.triggerZones.indexOf(area), 1);

		selectedElement = null;
	}

	this.redo = function() {
		currentMap.triggerZones.push(area);

		selectedElement = area;
	}
}

function deleteAreaAction() {
	var area = null;

	this.execute = function() {
		area = selectedElement;

		currentMap.triggerZones.splice(currentMap.triggerZones.indexOf(area), 1);
		selectedElement = null;

		return this;
	}

	this.undo = function() {
		currentMap.triggerZones.push(area);

		selectedElement = area;
	}

	this.redo = function() {
		currentMap.triggerZones.splice(currentMap.triggerZones.indexOf(area), 1);

		selectedElement = null;
	}
}

function addSpawnAction(spawnPoint) {
	var spawn = null;
	var lastSelected = null;

	this.execute = function() {
		spawn = spawnPoint;
		currentMap.startList.push(spawn);

		lastSelected = selectedElement;
		selectedElement = spawn;

		return this;
	}

	this.undo = function() {
		var index = currentMap.startList.indexOf(spawn);
		currentMap.startList.splice(index, 1);

		selectedElement = lastSelected;

		if (currentMap.startIndex == index) {
			currentMap.startIndex = 0;
			currentMap.playerStart = currentMap.startList[currentMap.startIndex];
		}
	}

	this.redo = function() {
		currentMap.startList.push(spawn);

		lastSelected = selectedElement;
		selectedElement = spawn;
	}
}

function deleteSpawnAction() {
	var spawn = null;
	var index = 0;
	var lastIndex = 0;

	this.execute = function() {
		spawn = selectedElement;
		index = currentMap.startList.indexOf(spawn);

		currentMap.startList.splice(index, 1);
		selectedElement = null;

		lastIndex = currentMap.startIndex;
		if (lastIndex == index) {
			currentMap.startIndex = 0;
			currentMap.playerStart = currentMap.startList[currentMap.startIndex];
		}
		if (lastIndex > index) {
			currentMap.startIndex--;
			currentMap.playerStart = currentMap.startList[currentMap.startIndex];
		}

		if (currentMap.startList.length == 0) {
			performAction(new addSpawnAction({x:0, y:0, rot:d270}));
			currentMap.startIndex = 0;
			currentMap.playerStart = currentMap.startList[currentMap.startIndex];
		}

		return this;
	}

	this.undo = function() {
		currentMap.startList.push(spawn);

		selectedElement = spawn;

		if (lastIndex == index) {
			currentMap.startIndex = index;
			currentMap.playerStart = currentMap.startList[currentMap.startIndex];
		}
	}

	this.redo = function() {
		currentMap.startList.splice(currentMap.startList.indexOf(spawn), 1);

		selectedElement = null;

		if (lastIndex == index) {
			currentMap.startIndex = currentMap.startList.length - 1;
			currentMap.playerStart = currentMap.startList[currentMap.startIndex];
		}
	}
}

