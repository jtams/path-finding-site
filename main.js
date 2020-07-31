let canvas = document.querySelector("canvas");
let ctx = canvas.getContext("2d");

const GRID_SIZE = 30; //Dimensions of each grid cell

class Node {
    //GCost = Distance from starting node
    //HCost = Distance from ending node
    //FCost = HCost + GCost
    //creator = Node that created it
    constructor(x, y, creator = null) {
        this.x = x;
        this.y = y;
        this.gCost = Math.round(getDistance(x, y, nodeA.x, nodeA.y) * 100);
        this.hCost = Math.round(getDistance(x, y, nodeB.x, nodeB.y) * 200);
        this.fCost = this.gCost + this.hCost;
        this.creator = creator;
    }
}

function defineSizing() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight + 4;

    /*
        Grid cells will fit perfectly into grid width 
        and cut off at height so there is no partial
        cells. There may be blank space at the bottom
        but there won't be any on the sides
    */

    gridSize = canvas.width % GRID_SIZE;
    gridCount = Math.floor(canvas.width / GRID_SIZE);

    if (gridSize == 0) {
        gridSize = GRID_SIZE;
    } else {
        gridSize = gridSize / gridCount;
        gridSize = GRID_SIZE + gridSize;
        gridSize -= 0.001;
    }

    verticalOffset = canvas.height % gridSize;

    grid = Array(Math.floor(canvas.height / gridSize))
        .fill()
        .map(() => Array(Math.floor(canvas.width / gridSize)).fill(0));

    nodeA = { x: 1, y: 1 };
    nodeB = { x: grid[0].length - 2, y: grid.length - 2 };
    //nodeB = { x: 5, y: 5 };

    grid[2][7] = 3;
    grid[3][7] = 3;
    grid[4][7] = 3;
    grid[5][7] = 3;
    grid[6][7] = 3;
    grid[7][7] = 3;
    grid[8][7] = 3;
    grid[9][7] = 3;

    grid[nodeA.y][nodeA.x] = 1;
    grid[nodeB.y][nodeB.x] = 2;

    opened = [];
    closedNodes = [];
    opened.push(new Node(1, 1));
    current = opened[0];
    found = false;

    requestAnimationFrame(draw);
}

defineSizing();
const node = { a: [0, 0], b: [6, 4] }; //A is starting node; B is ending node

function draw() {
    ctx.fillStyle = "#292929"; // Background
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    fillCell();
    drawGrid();
    requestAnimationFrame(draw);
}

function fillCell() {
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            if (grid[i][j] != 0) {
                switch (grid[i][j]) {
                    case 1:
                        ctx.fillStyle = "#00b2c9";
                        break;
                    case 2:
                        ctx.fillStyle = "#c20000";
                        break;
                    case 3:
                        ctx.fillStyle = "#8a8a8a";
                        break;
                    case 4:
                        ctx.fillStyle = "#eb4034";
                        break;
                    case 5:
                        ctx.fillStyle = "#32a852";
                        break;
                    case 6:
                        ctx.fillStyle = "#07538c";
                        break;
                }
                x = j * gridSize;
                y = i * gridSize;
                //console.log(x, y);
                ctx.fillRect(x, y, gridSize, gridSize);
            }
        }
    }
}

function drawGrid() {
    let gridCountColumns = canvas.width / gridSize; //Screen size divided by grid cell size. Finds the amount of cells per width
    let gridCountRows = canvas.height / gridSize; //Screen size divided by grid cell size. Finds the amount of cells per height

    let position = [0, 0];

    ctx.strokeStyle = "#8a8a8a";
    ctx.lineWidth = 1;
    for (let i = 0; i < gridCountRows; i++) {
        ctx.beginPath();
        ctx.moveTo(position[1], position[0]);
        ctx.lineTo(canvas.width, position[0]);
        ctx.stroke();
        for (let j = 0; j < gridCountColumns; j++) {
            ctx.beginPath();
            ctx.moveTo(position[1], position[0]);
            ctx.lineTo(position[1], canvas.height - verticalOffset);
            ctx.stroke();
            position[1] += gridSize;
        }
        position[1] = 0;
        position[0] += gridSize;
    }
}

function addObstruction(x, y) {
    xPos = Math.floor(x / gridSize);
    yPos = Math.floor(y / gridSize) - 2;
    if (yPos > grid.length - 1 || xPos > grid[0].length - 1) {
        return false;
    }
    if (grid[yPos][xPos] == 0) {
        grid[yPos][xPos] = 3;
        return true;
    }
    if (grid[yPos][xPos] == 3) {
        grid[yPos][xPos] = 0;
        return true;
    } else {
        return false;
    }
}
/* // Normal Distance formula (works but not as efficient since moving diagonally is equal to 1 in this case)
function getDistance(x1, y1, x2, y2) {
    //console.log(x1, y1, x2, y2, Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)));
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}
    */

function getDistance(x1, y1, x2, y2) {
    //Manhatten distance formula
    let dx = Math.abs(x1 - x2);
    let dy = Math.abs(y1 - y2);
    return Math.floor(dx + dy);
}

function findPath() {
    //A* Path Finding
    return new Promise((resolve) => {
        current = opened[0];
        for (let i = 0; i < opened.length; i++) {
            if (opened[i].fCost == current.fCost && opened[i].hCost < current.hCost) {
                current = opened[i];
                continue;
            }
            if (opened[i].fCost < current.fCost) {
                current = opened[i];
            }
        }
        opened.splice(opened.indexOf(current), 1); //Remove current from opened
        closedNodes.push(current); //Add current to closed
        if (grid[current.y][current.x] != 1 && grid[current.y][current.x] != 2) {
            grid[current.y][current.x] = 4;
        }

        if (current.x == nodeB.x && current.y == nodeB.y) {
            before = current;
            for (let y = 0; y < 1000; y++) {
                grid[before.y][before.x] = 6;
                before = before.creator;
                if (before == undefined) {
                    break;
                }
            }
            found = true;
            resolve("done");
        }

        for (let x = -1; x <= 1; x++) {
            for (let y = -1; y <= 1; y++) {
                if (x == 0 && y == 0) {
                    continue;
                } else {
                    if (current.y + y > grid.length - 1 || current.y + y < 0 || current.x + x > grid[0].length - 1 || current.x < 0) {
                        continue;
                    }
                    pPos = grid[current.y + y][current.x + x];
                    if (pPos != 1 && pPos != 3 && pPos != 4 && pPos != 5) {
                        opened.push(new Node(current.x + x, current.y + y, current));
                        grid[current.y + y][current.x + x] = 5;
                    }
                }
            }
        }
        resolve(true);
    });
}

window.addEventListener("resize", defineSizing, false);
window.addEventListener(
    "keydown",
    (e) => {
        if (e.key == "Enter") {
            if (found) {
                defineSizing();
                return;
            }
            while (found == false) {
                findPath().then(() => {
                    requestAnimationFrame(draw);
                });
            }
        }
    },
    false
);
canvas.addEventListener(
    "mouseup",
    (e) => {
        addObstruction(e.screenX, e.screenY);
    },
    false
);
