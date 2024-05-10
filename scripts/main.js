const gameCanvas = document.getElementById("game-canvas");
const gameContext = gameCanvas.getContext("2d");
gameCanvas.width = window.innerWidth;
gameCanvas.height = window.innerHeight;

var previousTimeStamp = 0;
var maxDeltaTime = 20;

/*
var img = new Image();
img.src = "metal_branch.png";
*/
var player;
var camera;

function drawGameObject(gameObject) {
    gameContext.fillStyle = gameObject.color;
    let positionOnScreen = copyVector(gameObject.position);
    subVectors(positionOnScreen, camera.position);
    positionOnScreen.x += gameCanvas.width / 2;
    positionOnScreen.y += gameCanvas.height / 2;
    
    
    gameContext.fillRect(positionOnScreen.x, positionOnScreen.y,
    gameObject.scale.x, gameObject.scale.y);
    

    gameContext.drawImage(gameObject.img, positionOnScreen.x - gameObject.texture_position.x, positionOnScreen.y - gameObject.texture_position.y, gameObject.texture_size.x, gameObject.texture_size.y);
    /*
    else{
        gameContext.drawImage(gameObject.img, positionOnScreen.x - 25, positionOnScreen.y - 25, 50, 50);
    }
    */
}

function drawGameScreen() {
    gameContext.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
    gameObjects.forEach(drawGameObject);
}


window.addEventListener('load', () => {
    

    map = [[1, 1, 1, 2],
           [0, 0, 1],
           [0, 0, 1],
           [0, 0, 1],
           [0, 0, 1],
           [1, 1, 1],];
    for (let i = 0; i< map.length; i +=1) {
        for (let j = 0; j< map[i].length; j +=1){
            if (map[i][j] == 1)  Balka(Vector2D(j * 100, i * 100), Vector2D(100, 100));
            if (map[i][j] == 2)  player = Player(Vector2D(j * 100, i * 100));
        }
    }
    camera = Camera();
    Block(Vector2D(10, 400), Vector2D(500, 60));
    Block(Vector2D(410, 260), Vector2D(500, 60));
	
    Enemy(Vector2D(460,-100));
    window.requestAnimationFrame(frame);
});

function frame(timeStamp) {
    if (!previousTimeStamp) {
        previousTimeStamp = timeStamp;
    }
    let deltaTime = timeStamp - previousTimeStamp;
    if (deltaTime > maxDeltaTime) {
        deltaTime = maxDeltaTime;
    }
    updateGameObjects(deltaTime);
    gameObjects = gameObjects.filter(gameObject => {
        return !gameObject.destroy;
    });
    drawGameScreen();
    window.requestAnimationFrame(frame);
}