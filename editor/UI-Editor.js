var displaytext = "test";
var mainInterface;

function setupUI(screenWidth, screenHeight) {
	mainInterface = new UIMainInterface("Main Interface", screenWidth, screenHeight);

	mainInterface.addPart(new UIElement("topPane", 0, 0, screenWidth, 30), true);
	mainInterface.addPart(new WallPane("wallPane", 0, 30, 0, 0), true);
	mainInterface.addPart(new AudioPane("audioPane", 0, 30, 150, 200), false);
	mainInterface.addPart(new EntityPane("entityPane", 0, 30, 150, 200), false);
	mainInterface.addPart(new AreaPane("areaPane", 0, 30, 150, 200), false);
	mainInterface.addPart(new SelectionPane("selectionPane", 0, screenHeight, 200, 200), true);

	mainInterface.parts[0].addPart(new UIButtonWToolTip("wallModeButton", 5, 5, 20, 20, "Wall Mode"));
	mainInterface.parts[0].addPart(new UIButtonWToolTip("audioModeButton", 74, 5, 20, 20, "Audio Mode"));
	mainInterface.parts[0].addPart(new UIButtonWToolTip("entityModeButton", 28, 5, 20, 20, "Entity Mode"));
	mainInterface.parts[0].addPart(new UIToggleWToolTip("snapToggle", 120, 5, 20, 20, "Snap to nearest wall anchor", true));
	mainInterface.parts[0].addPart(new UITextLabel("modetextlabel", screenWidth/2, 20, 0, 0, "", "center"));
	mainInterface.parts[0].addPart(new UIButtonWToolTip("areaModeButton", 51, 5, 20, 20, "Trigger Area Mode"));

	mainInterface.parts[0].parts[0].onClick = function() {
		switchMode(WALL_MODE); 
		mainInterface.parts[1].setActive(true);
		mainInterface.parts[2].setActive(false);
		mainInterface.parts[3].setActive(false);
		mainInterface.parts[4].setActive(false);
	};
	mainInterface.parts[0].parts[1].onClick = function() {
		switchMode(AUDIO_MODE); 
		mainInterface.parts[1].setActive(false);
		mainInterface.parts[2].setActive(true);
		mainInterface.parts[3].setActive(false);
		mainInterface.parts[4].setActive(false);
	};
	mainInterface.parts[0].parts[2].onClick = function() {
		switchMode(ENTITY_MODE); 
		mainInterface.parts[1].setActive(false);
		mainInterface.parts[2].setActive(false);
		mainInterface.parts[3].setActive(true);
		mainInterface.parts[4].setActive(false);
	};
	mainInterface.parts[0].parts[5].onClick = function() {
		switchMode(AREA_MODE); 
		mainInterface.parts[1].setActive(false);
		mainInterface.parts[2].setActive(false);
		mainInterface.parts[3].setActive(false);
		mainInterface.parts[4].setActive(true);
	};
	mainInterface.parts[0].parts[3].toggle = true;
	mainInterface.parts[0].parts[3].onTrue = function() {snapToNearWallPoint = true;};
	mainInterface.parts[0].parts[3].onFalse = function() {snapToNearWallPoint = false;};
	mainInterface.parts[0].parts[4].onUpdate = function() {this.label = getDisplayText();};

	mainInterface.onDraw = function() {
		mainInterface.parts[0].parts[4].updatePosition(eCanvas.width/2, 20, 0, 0);

		canvas = eCanvas;
		canvasContext = eCanvasContext;
		drawMapView();
		driveEditor();
	}

}




class WallPane extends UIElement {
	constructor(name, x, y, w, h) {
		super(name, x, y, 30, 76);

		this.addPart(new UIButtonWToolTip("singleWallMode", 5, 28, 20, 20, "Add Single Walls"));
		this.addPart(new UIButtonWToolTip("multiWallMode", 5, 51, 20, 20, "Add Connected Walls"));
		this.addPart(new UIButtonWToolTip("selectWallMode", 5, 5, 20, 20, "Select Wall"));

		this.parts[0].onClick = function() {wallMode = ADD_SINGLE_WALL;};
		this.parts[1].onClick = function() {wallMode = ADD_MULTI_WALLS;};
		this.parts[2].onClick = function() {wallMode = SELECT_WALL;};
	}

}

class AudioPane extends UIElement {
	constructor(name, x, y, w, h) {
		super(name, x, y, 30, 30);

		this.addPart(new UIButtonWToolTip("recalculateAudioGeo", 5, 5, 20, 20, "Recalculate AudioGeo"));

		this.parts[0].onClick = function() {
			populateAudioNodesFromWallEdges(currentMap.walls);
			cullAudioNodesThatDontConnectToPoint(currentMap.startList[currentMap.startIndex], currentMap.walls);
		};

		populateAudioNodesFromWallEdges(currentMap.walls);
		cullAudioNodesThatDontConnectToPoint(currentMap.startList[currentMap.startIndex], currentMap.walls);
	}

	setActive(active) {
		super.setActive(active);

		if (active) {
			populateAudioNodesFromWallEdges(currentMap.walls);
			cullAudioNodesThatDontConnectToPoint(currentMap.startList[currentMap.startIndex], currentMap.walls);
		}
	}
	
}

class EntityPane extends UIElement {
	constructor(name, x, y, w, h) {
		super(name, x, y, 30, 76);

		this.addPart(new UIButtonWToolTip("addEntityMode", 5, 28, 20, 20, "Add Entities"));
		this.addPart(new UIButtonWToolTip("selectEntityMode", 5, 5, 20, 20, "Select Entities"));
		this.addPart(new UIButtonWToolTip("setEntityRoboType", 5, 51, 20, 20, "Set Entity RoboType: undefined"));
		this.addPart(new UIDropdown("defaultRobpTypeList", 5, 51, 100, 20), false);

		this.parts[0].onClick = function() {entityMode = ADD_ENTITY;};
		this.parts[1].onClick = function() {entityMode = SELECT_ENTITY;};

		this.parts[2].dropdown = this.parts[3];
		this.parts[2].onClick = function() {
			this.dropdown.setActive();
			this.dropdown.onLeftMouseClick();
		}
		this.parts[3].list = entityRoboTypesList;
		this.parts[3].value = entityRoboTypesList.length-1;
		this.parts[3].dropdown.toolTipButton = this.parts[2];
		this.parts[3].dropdown.onSelect = function () {
			defaultEntityRoboType = this.parent.list[this.parent.value];
			this.toolTipButton.toolTip = "Set Entity RoboType: " + defaultEntityRoboType;
			this.parent.setActive(false);
		}
	}
	
}

class AreaPane extends UIElement {
	constructor(name, x, y, w, h) {
		super(name, x, y, 30, 76);

		this.addPart(new UIButtonWToolTip("selectAreaMode", 5, 5, 20, 20, "Select Trigger Zone"));
		this.addPart(new UIButtonWToolTip("addCircleMode", 5, 28, 20, 20, "Add Circle Zone"));
		this.addPart(new UIButtonWToolTip("addAABBMode", 5, 51, 20, 20, "Add Square Zone"));

		this.parts[0].onClick = function() {areaMode = SELECT_AREA;};
		this.parts[1].onClick = function() {areaMode = ADD_CIRCLE_AREA;};
		this.parts[2].onClick = function() {areaMode = ADD_AABB_AREA;};
	}

}

class SelectionPane extends UIElement{
	constructor(name, x, y, w, h) {
		super(name, x, y - h, w, h);

		this.bottom = y;

		this.nudgeButtons = [
			this.addPart(new UIButton("nudgeLeft", 150, 150, 10, 10), false),
			this.addPart(new UIButton("nudgeUp", 160, 140, 10, 10), false),
			this.addPart(new UIButton("nudgeRight", 170, 150, 10, 10), false),
			this.addPart(new UIButton("nudgeDown", 160, 160, 10, 10), false),
			this.addPart(new UIButton("nudgeClockwise", 145, 135, 10, 10), false),
			this.addPart(new UIButton("nudgeCounterClockwise", 176, 135, 10, 10), false),
		];
		this.nudgeButtons[0].onClick = function() {
			if (selectedElement!= null) {
				selectedElement.pos.x += -1;
			}
		};
		this.nudgeButtons[1].onClick = function() {
			if (selectedElement!= null) {
				selectedElement.pos.y += -1;
			}
		};
		this.nudgeButtons[2].onClick = function() {
			if (selectedElement!= null) {
				selectedElement.pos.x += 1;
			}
		};
		this.nudgeButtons[3].onClick = function() {
			if (selectedElement!= null) {
				selectedElement.pos.y += 1;
			}
		};
		this.nudgeButtons[4].onClick = function() {
			if (selectedElement!= null) {
				selectedElement.rot += degToRad(-10);
				selectedElement.rot = wrap(selectedElement.rot, d0, d360);
			}
		};
		this.nudgeButtons[5].onClick = function() {
			if (selectedElement!= null) {
				selectedElement.rot += degToRad(10);
				selectedElement.rot = wrap(selectedElement.rot, d0, d360);
			}
		};

		this.robotDropdown = new UIDropdown("RobotDropdown", 10, 150, 100, 20);
		this.addPart(this.robotDropdown, false);
		this.robotDropdown.list = entityRoboTypesList;
		this.robotDropdown.value = entityRoboTypesList.length-1;
		this.robotDropdown.updateListElement();
		this.robotDropdown.dropdown.onSelect = function() {
			if (selectedElement != null) {
				performAction(new setEntityRoboTypeAction(this.parent.list[this.parent.value]))
			}
		}
	}

	draw() {
		if (selectedElement == null) {
			this.h = 30;
			this.w = 200;
		} else {
			if (editMode == WALL_MODE) {
				this.h = 90;
				this.w = 200;
			}
			if (editMode == AUDIO_MODE) {
				this.h = 90;
				this.w = 200;
			}
			if (editMode == ENTITY_MODE) {
				this.h = 100;
				this.w = 200;
			}
		}
		this.y = this.bottom - this.h;

		super.draw();

		if (selectedElement != null) {
			if (editMode == WALL_MODE) {
				var textP1 = "p1 {x: " + selectedElement.p1.x + ", y: " + selectedElement.p1.y + "}";
				var textP2 = "p2 {x: " + selectedElement.p2.x + ", y: " + selectedElement.p2.y + "}";
				var textColor = "Color: " + selectedElement.color;
				colorText(textP1, this.x + borderSize + 20, this.y + 15 + borderSize, "darkblue");
				colorText(textP2, this.x + borderSize + 20, this.y + 30 + borderSize, "darkblue");
				colorText(textColor, this.x + borderSize + 20, this.y + 45 + borderSize, "darkblue");

			}

			if (editMode == AUDIO_MODE) {
				var index = audGeoPoints.indexOf(selectedElement);
				if (index == undefined) index = 0;
				var textPos = index + " {x: " + selectedElement.x.toFixed(2) + ", y: " + selectedElement.y.toFixed(2) + "}";
				colorText(textPos, this.x + borderSize + 20, this.y + 15 + borderSize, "darkblue");

				if (currentAudGeo.length > 0 && currentAudGeo.length-1 >= index
					&& currentAudGeo[index].point.x == selectedElement.x 
					&& currentAudGeo[index].point.y == selectedElement.y) {

					var textConnected = "[";
					for (var i in currentAudGeo[index].connections) {
						textConnected = textConnected + " " + currentAudGeo[index].connections[i];
					}
					textConnected = textConnected + " ]";
					colorText(textConnected, this.x + borderSize + 20, this.y + 30 + borderSize, "darkblue");
				}
			}

			if (editMode == ENTITY_MODE) {
				var textName = "Name: " + selectedElement.name;
				var textPos = "Pos {x: " + selectedElement.pos.x + ", y: " + selectedElement.pos.y + "} Rot: " + Math.round(radToDeg(selectedElement.rot));
				colorText(textName, this.x + borderSize + 20, this.y + 15 + borderSize, "darkblue");
				colorText(textPos, this.x + borderSize + 20, this.y + 30 + borderSize, "darkblue");
				
				for (var i = 0; i < this.nudgeButtons.length; i++) {
					this.nudgeButtons[i].setActive(true);
				}
				this.robotDropdown.setActive(true);
				this.robotDropdown.value = this.robotDropdown.list.indexOf(currentEntityRoboType);

			} else {
				for (var i = 0; i < this.nudgeButtons.length; i++) {
					this.nudgeButtons[i].setActive(false);
				}
				this.robotDropdown.setActive(false);
			}

		} else {
			for (var i = 0; i < this.nudgeButtons.length; i++) {
				this.nudgeButtons[i].setActive(false);
			}
			this.robotDropdown.setActive(false);
		}

		var pos = getMousePositionInWorldSpace();
		var text = "{x: " + pos.x + ", y: " + pos.y + "}";
		colorText(text, this.x + 15, this.bottom - 13 + borderSize, "darkblue", "15px Arial", "center");
	}

}