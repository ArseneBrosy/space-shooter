// Jeu de tir
// by Arsène Brosy
var canvas = document.getElementById("game");
var ctx = canvas.getContext("2d");

//#region CONSTANTS
const PLAYER_WIDTH = 29 * 5;
const PLAYER_HEIGHT = 28 * 5;
const PLAYER_SPEED = 5;
const PLAYER_THRUST_FORCE = .5;
const PLAYER_SPRITE = new Image();
PLAYER_SPRITE.src = "./images/player.png";

const UI = new Image;
UI.src = "./images/ui.png";
//#endregion

// resize canvas
canvas.width = 1520;
canvas.height = 1380;

//#region VARIABLES
//#region PLAYER
var playerX = canvas.width / 2;
var playerY = canvas.height / 2;
var playerVelocityX = 0;
playerVelocityY = 0;
var playerRotation = 0;
var playerDirection = 0;
var playerGas = 0;
//#endregion

//#region LASER
var nextLaser = [];
var laserActive = false;
//#endregion
//#endregion

//#region FUNCTIONS
// check if an x, y coord is in a wall (adjustable margin)
function isInWall(x, y, margin = 0) {
    var result = false;
    for (var i = 0; i < walls.length; i++) {
        if (x >= walls[i][0] - margin && x <= walls[i][2] + margin && y >= walls[i][1] - margin && y <= walls[i][3] + margin) {
            result = true;
        }
    }
    return result;
}

function NewLaser() {
    nextLaser = [];
    if (Math.random() > 0.5) {
        nextLaser.push(Math.random() * canvas.width);
        nextLaser.push(0);
    } else {
        nextLaser.push(0);
        nextLaser.push(Math.random() * canvas.height);
    }
    if (Math.random() > 0.5) {
        nextLaser.push(Math.random() * canvas.width);
        nextLaser.push(canvas.height);
    } else {
        nextLaser.push(canvas.width);
        nextLaser.push(Math.random() * canvas.height);
    }
}
NewLaser();

// rotations
function playerSin() {
    return Math.sin(playerRotation * (Math.PI/180));
}
function playerCos() {
    return Math.cos(playerRotation * (Math.PI/180));
}
//#endregion

function loop() {
    //#region MOVE PLAYER
    playerVelocityX += playerSin() * PLAYER_THRUST_FORCE * playerGas;
    playerVelocityY -= playerCos() * PLAYER_THRUST_FORCE * playerGas;
    playerX += playerVelocityX;
    playerY += playerVelocityY;
    playerRotation += playerDirection;
    //#endregion

    //#region DRAW
    // clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // player
    ctx.translate(playerX, playerY);
    ctx.rotate(playerRotation * (Math.PI/180));
    ctx.drawImage(PLAYER_SPRITE, -PLAYER_WIDTH / 2, -PLAYER_HEIGHT / 2, PLAYER_WIDTH, PLAYER_HEIGHT);
    ctx.rotate(-playerRotation * (Math.PI/180));
    ctx.translate(-playerX, -playerY);

    // laser
    ctx.strokeStyle = "#9bbc0f";
    ctx.lineWidth = Math.random() * 10 + (laserActive ? 20 : 1) + 5;
    ctx.setLineDash(laserActive ? [0, 0] : [15, 5]);
    ctx.beginPath();
    ctx.moveTo(nextLaser[0], nextLaser[1]);
    ctx.lineTo(nextLaser[2], nextLaser[3]);
    ctx.stroke();

    // ui
    ctx.drawImage(UI, 0, 0, canvas.width, canvas.height);

    //#endregion
    playerRotation %= 360;
    playerX = Math.min(Math.max(playerX, PLAYER_HEIGHT / 2), canvas.width - PLAYER_HEIGHT / 2);
    playerY = Math.min(Math.max(playerY, PLAYER_HEIGHT / 2), canvas.height - PLAYER_HEIGHT / 2);
    requestAnimationFrame(loop);
}

setInterval(() => {NewLaser();}, 1000);

//position de la souris
canvas.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});
document.addEventListener('keydown', function(e) {
    if (e.which === 65) {
        playerDirection = -PLAYER_SPEED;
    }
    if (e.which === 68) {
        playerDirection = PLAYER_SPEED;
    }
    if (e.which === 32) {
        playerGas = 1;
    }
});
document.addEventListener('keyup', function(e) {
    if (e.which === 65 || e.which === 68) {
        playerDirection = 0;
    }
    if (e.which === 32) {
        playerGas = 0;
    }
});

// start game
requestAnimationFrame(loop);