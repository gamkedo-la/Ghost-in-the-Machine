const ASTAR_LEVEL_COLS = 1000;
const ASTAR_LEVEL_ROWS = 1000;
const ASTAR_LEVEL_GRID = ASTAR_LEVEL_COLS * ASTAR_LEVEL_ROWS;
const ASTAR_MAX_SEARCH_LOOPS = 100000;
const ASTAR_PATH_INIT = -1;
const ASTAR_COST_MAX = 10000;
const ASTAR_COST_INIT = ASTAR_COST_MAX;
const ASTAR_COST_EASY = 1;

class PathFindingComponent {
	#entity;
	constructor(entity = new EntityClass()) {
		this.#entity = entity;
	}

	aStarSearch(base, goal) {
		// A* using the following as a reference and inspiration
		// https://www.redblobgames.com/pathfinding/a-star/implementation.html
		// Differences from Dijkstra's and A* can be found in the "Algorithm Changes" section
		// https://www.redblobgames.com/pathfinding/a-star/implementation.html#algorithm

		// Also, reusing and modifying some astar.js code from 
		// HomeTeamGameDev Adventures of Salvator (2024; Project Lead Vince McKeown)
		// https://hometeamgamedev.itch.io/adventure-of-salvatore
		// https://github.com/gamkedo-la/Adventure-of-Salvatore

		// if (debug) { console.log("base, goal", base, goal); }

		// colorCircle(base.x, base.y, 120, "cyan");
		// colorCircle(goal.x, goal.y, 120, "cyan");


		function heuristic( first, second ) {
			// // Manhattan distance
			// const value = 
			// 	Math.abs(first.x - second.x) +
			// 	Math.abs(first.y - second.y); 
			// Pythagorean distance squared
			const value = 
				(second.x - first.x) ** 2 +
				(second.y - first.y) ** 2;
			return value;
		}

		function posXYToArrayIndex(x, y) {
			const gridCoord = posXYToAstarLevelGrid(x, y);
			return gridCoord.row * ASTAR_LEVEL_COLS + gridCoord.col;
		}

		function posXYToAstarLevelGrid(x, y) {
			const col = Math.floor(ASTAR_LEVEL_COLS / 2 + x);
			const row = Math.floor(ASTAR_LEVEL_ROWS / 2 + y);
			return { col: col, row: row };
		}
		
		function arrayIndexToPosXY(index) {
			const gridCoord = arrayIndexToAstarLevelGrid(index);
			const x = gridCoord.col - Math.floor(ASTAR_LEVEL_COLS / 2);
			const y = gridCoord.row - Math.floor(ASTAR_LEVEL_ROWS / 2);
			return { x: x, y: y };
		}

		function arrayIndexToAstarLevelGrid(index) {
			const col = Math.floor(index % ASTAR_LEVEL_COLS);
			const row = Math.floor(index / ASTAR_LEVEL_COLS);
			return { col: col, row: row };
		}

		const walls = currentMap.walls;
		const radius = this.#entity.radius;
		if (
			// circleIsOnWall(base, radius, walls) ||
			circleIsOnWall(goal, radius, walls)
		) {
			return { path: [], cost: [] };
		}

		let frontier = new PriorityQueue();
		frontier.enqueue(base, 0);
		let pathToGoal = Array(ASTAR_LEVEL_GRID).fill(ASTAR_PATH_INIT);
		let costToGoal = Array(ASTAR_LEVEL_GRID).fill(ASTAR_COST_INIT);
		const baseIndex = posXYToArrayIndex(base.x, base.y);
		costToGoal[baseIndex] = 0;

		var lastIndex = -1;
		const maxLoops = ASTAR_MAX_SEARCH_LOOPS;
		let loop = 0;
		while (!frontier.empty() && loop++ < maxLoops) {
			const current = frontier.dequeue();
			const currPos = current.element;
			const currX = currPos.x;
			const currY = currPos.y;

			if (currX == goal.x && currY == goal.y) { break; }

			for (const dir of directionOptions) {
				if (dir.isEqualTo(directionNoMove)) { continue; }

				const dx = dir.col * 1;
				const dy = dir.row * 1;
				const nextPos = { x: currX + dx, y: currY + dy };
				const nextX = nextPos.x;
				const nextY = nextPos.y;

				if (debug) {
					// colorCircle(goal.x, goal.y, 5, "teal");
					// colorLine(goal.x, goal.y, 0, 0, 1, "teal");

					// colorCircle(nextX, nextY, 5, "red");
					// colorLine(nextX, nextY, 0, 0, 1, "red");
				}

				const nextGridCoord = posXYToAstarLevelGrid(nextX, nextY);
				if (nextGridCoord.x < 0 || 
					nextGridCoord.x >= ASTAR_LEVEL_COLS ||
					nextGridCoord.y < 0 || 
					nextGridCoord.y >= ASTAR_LEVEL_ROWS
				) {
					continue;
				}

				// set next tile cost to 1 for walkable and higher for less so
				let nextTileCost = ASTAR_COST_EASY;

			    const nextAndRadX = nextX + radius - 1;
				const nextNetRadX = nextX - radius + 1;
				const nextAndRadY = nextY + radius - 1;
				const nextNetRadY = nextY - radius + 1;

				const nextXnextY = { x: nextX, y: nextY }
				const nextXAndRadY = { x: nextX, y: nextAndRadY }
				const nextXNetRadY = { x: nextX, y: nextNetRadY }
				const nextAndRadXnextY = { x: nextAndRadX, y: nextY }
				const nextNetRadXnextY = { x: nextNetRadX, y: nextY }
				const nextAndRadXAndRadY = { x: nextAndRadX, y: nextAndRadY }
				const nextAndRadXNetRadY = { x: nextAndRadX, y: nextNetRadY }
				const nextNetRadXAndRadY = { x: nextNetRadX, y: nextAndRadY }
				const nextNetRadXNetRadY = { x: nextNetRadX, y: nextNetRadY }

				const nextWithRad = [];
				nextWithRad.push(nextXnextY);
				nextWithRad.push(nextXAndRadY);
				nextWithRad.push(nextXNetRadY);
				nextWithRad.push(nextAndRadXnextY);
				nextWithRad.push(nextNetRadXnextY);
				nextWithRad.push(nextAndRadXAndRadY);
				nextWithRad.push(nextAndRadXNetRadY);
				nextWithRad.push(nextNetRadXAndRadY);
				nextWithRad.push(nextNetRadXNetRadY);
				
				// add wall collision to next tile cost
				if (nextTileCost === ASTAR_COST_EASY) {
					for (let nWR of nextWithRad) {
						const nextWallPos = 
							getClosestIntersection(currPos, nWR, walls);
						if (nextWallPos) {
							nextTileCost = ASTAR_COST_MAX;
							break;
						}
					}
				}

				// add entity collision to next tile cost
				if (nextTileCost === ASTAR_COST_EASY) {
					const entities = currentMap.entities;
					for(let ent of entities) {
						if (ent === this.#entity ||
							ent === player
						) { continue; }
						const entX = ent.x;
						const entY = ent.y;
						const entRad = ent.radius;
						const samePos = 
							currX == entX && currY == entY;
						if (samePos) { continue; }

						const collisionFound = 
							nextAndRadX > entX - entRad &&
							nextNetRadX < entX + entRad &&
							nextAndRadY > entY - entRad &&
							nextNetRadY < entY + entRad;

						if (collisionFound) {
							nextTileCost = entRad * 10000;
							break;
						}
					}	
				}

				const currentIndex = posXYToArrayIndex(currX, currY);
				const newCost = costToGoal[currentIndex] + nextTileCost;
				const nextIndex = posXYToArrayIndex(nextX, nextY);
				if (newCost < ASTAR_COST_MAX &&
					newCost < costToGoal[nextIndex]
				) {
					// use new cost to get to the next tile
					costToGoal[nextIndex] = newCost;
					const priority = newCost + heuristic(nextPos, goal);
					frontier.enqueue(nextPos, priority);
					pathToGoal[nextIndex] = currentIndex;
					lastIndex = nextIndex;
				} else {
					// if (debug) { 
					// 	console.log("newCost, costToGoal[nextIndex]", newCost, costToGoal[nextIndex]); 
					// }
				}
			}
		}	

		// if (debug) { console.log("lastIndex: ", lastIndex); }

		const pathAndCostToLast = () => {	
			let pathToLast = [];
			let costToLast = [];
			let nextIndex = lastIndex;
			let currentIndex = nextIndex > -1 ? pathToGoal[nextIndex] : -1;
			let loop = 0;
			const keepLooping = () => 
				loop < maxLoops &&
				currentIndex > -1 && 
				nextIndex > -1 &&
				currentIndex != baseIndex;

			while (keepLooping()) {
				pathToLast[loop] = arrayIndexToPosXY(nextIndex);
				costToLast[loop] = costToGoal[nextIndex];
				nextIndex = currentIndex;
				currentIndex = pathToGoal[nextIndex];
				loop++;
			}

			// if (debug) { console.log("loop: ", loop); }
			// if (debug && loop >= maxLoops) { console.log("loop < maxLoops"); }
			// if (debug && currentIndex <= -1) { console.log("currentIndex > -1"); }
			// if (debug && nextIndex <= -1) { console.log("nextIndex > -1"); }
			// if (debug && currentIndex === baseIndex) { console.log("currentIndex != baseIndex"); }

			if (currentIndex === baseIndex) {
				pathToLast[loop] = arrayIndexToPosXY(nextIndex);
				costToLast[loop] = costToGoal[nextIndex];
			}
			// leave pathToLast and costToLast with index 0 ≈ goal and last = base
			return { path: pathToLast, cost: costToLast };
		}

		return pathAndCostToLast();
	}
}

function testAStarSearch() { if(debug) { aStarSearchTest(); } }
function aStarSearchTest() {
    // AStarSearch test
    if (debug) { console.log("AStarSearch() test"); }		
	const ent = new EntityClass();
	const angleInc = 1.0467;
	const loopMax = 10000;
	const loop2Max = Math.PI * 2 / angleInc;
    let loop1 = 0;
	for(let circleRadius = 20;
		circleRadius < 200 && loop1++ < loopMax; 
		circleRadius += 20
	) {
		let loop2 = 0;
		for(let circleAngle = 0; 
			circleAngle < Math.PI * 2 && loop2++ < loop2Max; 
			circleAngle += angleInc
		) {
			let base = { 
				x: Math.cos(circleAngle) * circleRadius + 100, 
				y: Math.sin(circleAngle) * circleRadius
			};
			let goal = { 
				x: base.x + 100, 
				y: base.y + 20 + loop1 % 10 * 10
			};
			const aStarResults = ent.pathFinder.aStarSearch(base, goal);

			// if (debug) { 
			// 	console.log(
			// 		"base.x, base.y, goal.x, goal.y: ", 
			// 		base.x, base.y, goal.x, goal.y); 
			// }

			const pathRev = aStarResults.path.reverse();
			let prevPos;
			for (let p in pathRev) {
				prevPos = prevPos ?? pathRev[0];
				const currPos = aStarResults.path[p];
				const currX = currPos.x;
				const currY = currPos.y;
				const currCost = aStarResults.cost[p]; 

				if (debug) { console.log("loop, x, y, cost: ", p, currX, currY, currCost); }

				colorEmptyCircle(base.x, base.y, 3, "gray");
				colorEmptyCircle(goal.x, goal.y, 3, "white");
				if (Math.abs(currX - goal.x) < 5 && Math.abs(currY - goal.y) < 5) {
					colorEmptyCircle(base.x, base.y, 3, "cyan");
					colorEmptyCircle(goal.x, goal.y, 3, "magenta");
				}

				colorLine(prevPos.x, prevPos.y, currX, currY, 1, "gray");
				prevPos = currPos;
			}
		}
	}
    if (debug) { console.log("AStarSearch() test done"); }	
}
