var displaytext = "test";
var mainInterface;

function setupUI(screenWidth, screenHeight) {
	mainInterface = new UIMainInterface("Main Interface", screenWidth, screenHeight);

	mainInterface.addPart(new UIElement("topPane", 0, 0, screenWidth, 30), true);
	mainInterface.addPart(new WallPane("wallPane", 0, 30, 0, 0), true);
	mainInterface.addPart(new AudioPane("audioPane", 0, 30, 150, 200), false);
	mainInterface.addPart(new EntityPane("entityPane", 0, 30, 150, 200), false);
	mainInterface.addPart(new AreaPane("areaPane", 0, 30, 150, 200), false);
	mainInterface.addPart(new SpawnPane("spawnPane", 0, 30, 150, 200), false);
	mainInterface.addPart(new SelectionPane("selectionPane", 0, screenHeight, 200, 200), true);

	mainInterface.parts[0].addPart(new UIButtonWToolTip("wallModeButton", 5, 5, 20, 20, "Wall Mode"));
	mainInterface.parts[0].addPart(new UIButtonWToolTip("audioModeButton", 97, 5, 20, 20, "Audio Mode"));
	mainInterface.parts[0].addPart(new UIButtonWToolTip("entityModeButton", 28, 5, 20, 20, "Entity Mode"));
	mainInterface.parts[0].addPart(new UIToggleWToolTip("snapToggle", 143, 5, 20, 20, "Snap to nearest wall anchor", true));
	mainInterface.parts[0].addPart(new UITextLabel("modetextlabel", screenWidth/2, 20, 0, 0, "", "center"));
	mainInterface.parts[0].addPart(new UIButtonWToolTip("areaModeButton", 51, 5, 20, 20, "Trigger Area Mode"));
	mainInterface.parts[0].addPart(new UIButtonWToolTip("spawnModeButton", 74, 5, 20, 20, "Player Start Mode"));

	mainInterface.parts[0].parts[0].onClick = function() {
		switchMode(WALL_MODE); 
		mainInterface.parts[1].setActive(true);
		mainInterface.parts[2].setActive(false);
		mainInterface.parts[3].setActive(false);
		mainInterface.parts[4].setActive(false);
		mainInterface.parts[5].setActive(false);
	};
	mainInterface.parts[0].parts[1].onClick = function() {
		switchMode(AUDIO_MODE); 
		mainInterface.parts[1].setActive(false);
		mainInterface.parts[2].setActive(true);
		mainInterface.parts[3].setActive(false);
		mainInterface.parts[4].setActive(false);
		mainInterface.parts[5].setActive(false);
	};
	mainInterface.parts[0].parts[2].onClick = function() {
		switchMode(ENTITY_MODE); 
		mainInterface.parts[1].setActive(false);
		mainInterface.parts[2].setActive(false);
		mainInterface.parts[3].setActive(true);
		mainInterface.parts[4].setActive(false);
		mainInterface.parts[5].setActive(false);
	};
	mainInterface.parts[0].parts[5].onClick = function() {
		switchMode(AREA_MODE); 
		mainInterface.parts[1].setActive(false);
		mainInterface.parts[2].setActive(false);
		mainInterface.parts[3].setActive(false);
		mainInterface.parts[4].setActive(true);
		mainInterface.parts[5].setActive(false);
	};
	mainInterface.parts[0].parts[6].onClick = function() {
		switchMode(SPAWN_MODE); 
		mainInterface.parts[1].setActive(false);
		mainInterface.parts[2].setActive(false);
		mainInterface.parts[3].setActive(false);
		mainInterface.parts[4].setActive(false);
		mainInterface.parts[5].setActive(true);
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
		super(name, x, y, 30, 122);

		this.addPart(new UIButtonWToolTip("singleWallMode", 5, 28, 20, 20, "Add Single Walls"));
		this.addPart(new UIButtonWToolTip("multiWallMode", 5, 51, 20, 20, "Add Connected Walls"));
		this.addPart(new UIButtonWToolTip("selectWallMode", 5, 5, 20, 20, "Select Wall"));
		this.addPart(new UIButtonWToolTip("setEntityRoboType", 5, 74, 20, 20, "Set Wall Color: purple"));
		this.addPart(new UIDropdown("defaultWallColorList", 5, 74, 100, 20), false);
		this.addPart(new UIButtonWToolTip("setEntityRoboType", 5, 97, 20, 20, "Set Wall Texture: text2Texture"));
		this.addPart(new UIDropdown("defaultWallTextureList", 5, 97, 100, 20), false);

		this.parts[0].onClick = function() {wallMode = ADD_SINGLE_WALL;};
		this.parts[1].onClick = function() {wallMode = ADD_MULTI_WALLS;};
		this.parts[2].onClick = function() {wallMode = SELECT_WALL;};

		this.parts[3].dropdown = this.parts[4];
		this.parts[3].onClick = function() {
			this.dropdown.setActive();
			this.dropdown.onLeftMouseClick();
		}
		this.parts[4].list = wallColorList;
		this.parts[4].dropdown.toolTipButton = this.parts[3];
		this.parts[4].dropdown.onSelect = function () {
			defaultWallColor = this.parent.list[this.parent.value];
			this.toolTipButton.toolTip = "Set Wall Color: " + defaultWallColor;
			this.parent.setActive(false);
		}

		this.parts[5].dropdown = this.parts[6];
		this.parts[5].onClick = function() {
			this.dropdown.setActive();
			this.dropdown.onLeftMouseClick();
		}
		this.parts[6].list = wallTextureList;
		this.parts[6].value = wallTextureList.length-1;
		this.parts[6].dropdown.toolTipButton = this.parts[5];
		this.parts[6].dropdown.onSelect = function () {
			defaultWallTexture = this.parent.list[this.parent.value];
			this.toolTipButton.toolTip = "Set Wall Color: " + defaultWallTexture;
			this.parent.setActive(false);
		}
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

class SpawnPane extends UIElement {
	constructor(name, x, y, w, h) {
		super(name, x, y, 30, 76);

		this.addPart(new UIButtonWToolTip("selectSpawnMode", 5, 5, 20, 20, "Select Starting Point"));
		this.addPart(new UIButtonWToolTip("addSpawnMode", 5, 28, 20, 20, "Add Starting Point"));
		this.addPart(new UIButtonWToolTip("setDefaultSpawn", 5, 51, 20, 20, "Set Default Starting Point"));

		this.parts[0].onClick = function() {spawnMode = SELECT_SPAWN;};
		this.parts[1].onClick = function() {spawnMode = ADD_SPAWN;};
		this.parts[2].onClick = function() {
			if (selectedElement != null) {
				currentMap.startIndex = currentMap.startList.indexOf(selectedElement);
				currentMap.playerStart = currentMap.startList[currentMap.startIndex];
			}
		};
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
			if (selectedElement == null) return;

			if (selectedElement.pos != undefined) {
				selectedElement.pos.x += -1;
			} else if(selectedElement.x != undefined) {
				selectedElement.x += -1;
			}
		};
		this.nudgeButtons[1].onClick = function() {
			if (selectedElement == null) return;
			
			if (selectedElement.pos != undefined) {
				selectedElement.pos.y += -1;
			} else if(selectedElement.y != undefined) {
				selectedElement.y += -1;
			}
		};
		this.nudgeButtons[2].onClick = function() {
			if (selectedElement == null) return;
			
			if (selectedElement.pos != undefined) {
				selectedElement.pos.x += 1;
			} else if(selectedElement.x != undefined) {
				selectedElement.x += 1;
			}
		};
		this.nudgeButtons[3].onClick = function() {
			if (selectedElement == null) return;
			
			if (selectedElement.pos != undefined) {
				selectedElement.pos.y += 1;
			} else if(selectedElement.y != undefined) {
				selectedElement.y += 1;
			}
		};
		this.nudgeButtons[4].onClick = function() {
			if (selectedElement == null) return;
			
			if (selectedElement.rot != undefined) {
				selectedElement.rot += degToRad(-10);
				selectedElement.rot = wrap(selectedElement.rot, d0, d360);
			}
		};
		this.nudgeButtons[5].onClick = function() {
			if (selectedElement == null) return;
			
			if (selectedElement.rot != undefined) {
				selectedElement.rot += degToRad(10);
				selectedElement.rot = wrap(selectedElement.rot, d0, d360);
			}
		};

		this.wallButtons = [
			this.addPart(new UIButton("macroLeft", 140, 110, 10, 10), false),
			this.addPart(new UIButton("microLeft", 150, 110, 10, 10), false),
			this.addPart(new UIButton("microRight", 160, 110, 10, 10), false),
			this.addPart(new UIButton("macroRight", 170, 110, 10, 10), false),
			this.addPart(new UIDropdown("colorDropdown", 10, 130, 180, 20), false),
			this.addPart(new UIDropdown("textureDropdown", 10, 150, 180, 20), false),
		];
		this.wallButtons[0].onClick = function() {
			if (selectedElement == null) return;

			if (selectedElement.textureOffset != undefined) {
				selectedElement.textureOffset += 10;
			}
		};
		this.wallButtons[1].onClick = function() {
			if (selectedElement == null) return;

			if (selectedElement.textureOffset != undefined) {
				selectedElement.textureOffset += 1;
			}
		};
		this.wallButtons[2].onClick = function() {
			if (selectedElement == null) return;

			if (selectedElement.textureOffset != undefined) {
				selectedElement.textureOffset -= 1;
			}
		};
		this.wallButtons[3].onClick = function() {
			if (selectedElement == null) return;

			if (selectedElement.textureOffset != undefined) {
				selectedElement.textureOffset -= 10;
			}
		};
		this.wallColorDropdown = this.wallButtons[4];
		this.wallColorDropdown.list = wallColorList;
		this.wallColorDropdown.dropdown.onSelect = function() {
			if (selectedElement != null) {
				performAction(new setWallColorAction(this.parent.list[this.parent.value]))
			}
		}
		this.wallTextureDropdown = this.wallButtons[5];
		this.wallTextureDropdown.list = wallTextureList;
		this.wallTextureDropdown.dropdown.onSelect = function() {
			if (selectedElement != null) {
				performAction(new setWallTextureAction(this.parent.list[this.parent.value]))
			}
		}

		this.robotDropdown = new UIDropdown("RobotDropdown", 10, 150, 130, 20);
		this.addPart(this.robotDropdown, false);
		this.robotDropdown.list = entityRoboTypesList;
		this.robotDropdown.value = entityRoboTypesList.length-1;
		this.robotDropdown.dropdown.onSelect = function() {
			if (selectedElement != null) {
				performAction(new setEntityRoboTypeAction(this.parent.list[this.parent.value]))
			}
		}
	}

	onDraw() {
		super.onDraw();

		var pos = getMousePositionInWorldSpace();
		var text = "{x: " + pos.x + ", y: " + pos.y + "}";
		colorText(text, this.x + 15, this.bottom - 13 + borderSize, "darkblue", "13px Arial", "center");
	}

	draw() {
		if (selectedElement == null) {
			this.h = 30;
			this.w = 200;
		} else {
			if (editMode == WALL_MODE) {
				this.h = 120;
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
			if (editMode == SPAWN_MODE) {
				this.h = 100;
				this.w = 200;
			}
			if (editMode == AREA_MODE) {
				this.h = 50;
				this.w = 200;
			}
		}
		this.y = this.bottom - this.h;

		super.draw();

		if (selectedElement != null) {
			if (editMode == WALL_MODE) {
				if (selectedElement.p1 == undefined) {
					var text = "{x: " + selectedElement.x + ", y: " + selectedElement.y + "}";
					colorText(text, this.x + borderSize + 20, this.y + 15 + borderSize, "darkblue");

					for (var i = 0; i < this.nudgeButtons.length; i++) {
						this.nudgeButtons[i].setActive(true);
					}
					for (var i = 0; i < this.wallButtons.length; i++) {
						this.wallButtons[i].setActive(false);
					}

					return;
				} else {
					for (var i = 0; i < this.nudgeButtons.length; i++) {
						this.nudgeButtons[i].setActive(false);
					}
				}

				var textP1 = "p1 {x: " + selectedElement.p1.x + ", y: " + selectedElement.p1.y + "}";
				var textP2 = "p2 {x: " + selectedElement.p2.x + ", y: " + selectedElement.p2.y + "}";
				var textColor = "Color: " + selectedElement.color;
				colorText(textP1, this.x + borderSize + 20, this.y + 15 + borderSize, "darkblue");
				colorText(textP2, this.x + borderSize + 20, this.y + 30 + borderSize, "darkblue");
				colorText(textColor, this.x + borderSize + 20, this.y + 45 + borderSize, "darkblue");

				for (var i = 0; i < this.wallButtons.length; i++) {
					this.wallButtons[i].setActive(true);
				}

				this.wallColorDropdown.value = this.wallColorDropdown.list.indexOf(currentWallColor);
				this.wallTextureDropdown.value = this.wallTextureDropdown.list.indexOf(currentWallTexture);
			} else {
				for (var i = 0; i < this.wallButtons.length; i++) {
					this.wallButtons[i].setActive(false);
				}
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
				this.robotDropdown.setActive(false);
			}

			if (editMode == AREA_MODE) {
				var textPos = "Edit ID: " + selectedElement.editID;
				colorText(textPos, this.x + borderSize + 20, this.y + 15 + borderSize, "darkblue");
			}

			if (editMode == SPAWN_MODE) {
				var textPos = "Pos {x: " + selectedElement.x + ", y: " + selectedElement.y + "} Rot: " + Math.round(radToDeg(selectedElement.rot));
				colorText(textPos, this.x + borderSize + 20, this.y + 15 + borderSize, "darkblue");

				for (var i = 0; i < this.nudgeButtons.length; i++) {
					this.nudgeButtons[i].setActive(true);
				}
			}

		} else {
			for (var i = 0; i < this.wallButtons.length; i++) {
				this.wallButtons[i].setActive(false);
			}

			for (var i = 0; i < this.nudgeButtons.length; i++) {
				this.nudgeButtons[i].setActive(false);
			}

			this.robotDropdown.setActive(false);
		}
	}

}