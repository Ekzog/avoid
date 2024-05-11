const gameCanvas = document.getElementById("game-canvas");
const gameContext = gameCanvas.getContext("2d");
gameCanvas.width = window.innerWidth;
gameCanvas.height = window.innerHeight;

var previousTimeStamp = 0;
var maxDeltaTime = 20;


var img_map = new Image();
img_map.src = "resources/map.png";

var player;
var camera;

function drawGameObject(gameObject) {
    gameContext.fillStyle = gameObject.color;
    let positionOnScreen = copyVector(gameObject.position);
    subVectors(positionOnScreen, camera.position);
    positionOnScreen.x += gameCanvas.width / 2;
    positionOnScreen.y += gameCanvas.height / 2;
    
    
    gameContext.fillRect(positionOnScreen.x, positionOnScreen.y, gameObject.scale.x, gameObject.scale.y); //debug

    gameContext.drawImage(gameObject.img, positionOnScreen.x - gameObject.texture_position.x, positionOnScreen.y - gameObject.texture_position.y, gameObject.texture_size.x, gameObject.texture_size.y);
}



function drawGameScreen() {
    gameContext.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
    gameObjects.forEach(drawGameObject);
}


window.addEventListener('load', () => {


    var canvas = document.createElement('canvas');
    canvas.width = img_map.width;
    canvas.height = img_map.height;
    canvas.getContext('2d').drawImage(img_map, 0, 0, img_map.width, img_map.height);
    var pixelData = canvas.getContext('2d').getImageData(0, 0, img_map.width, img_map.height).data;
    var map = new Array(img_map.height);
    map = [1];
    
    for(let i = 0; i< img_map.height; i+=1){
        map[i] = new Array(img_map.width);
        for(let j = 0; j< img_map.width; j+=1){
            var pixel = [pixelData[j * 4 + 0 + (img_map.width * 4 * i)], pixelData[j * 4 + 1 + (img_map.width * 4 * i)], pixelData[j * 4 + 2 + (img_map.width * 4 * i)]];
            //map[i][j] = 1;
            //console.log(pixel);
            if(JSON.stringify(pixel) == JSON.stringify([0, 0, 0])) map[i-1][j] = 1;
            if(JSON.stringify(pixel) == JSON.stringify([255, 0, 255])) map[i-1][j] = 1;
            if(JSON.stringify(pixel) == JSON.stringify([0, 255, 255])) map[i-1][j] = 1;
        }
    }
    //console.log(map);
    for(let i = 0; i< map.length; i+=1){
        for(let j = 0; j< map[i].length; j+=1){
            if(map[i][j] == 1){
                Way(Vector2D(j * 100, i * 100), Vector2D(100, 100));
                //console.log('Поставил');
            } 
        }
    }
    
    for(let i = 0; i< img_map.height; i+=1){
        for(let j = 0; j< img_map.width; j+=1){
            var pixel = [pixelData[j * 4 + 0 + (img_map.width * 4 * i)], pixelData[j * 4 + 1 + (img_map.width * 4 * i)], pixelData[j * 4 + 2 + (img_map.width * 4 * i)]];
            if(JSON.stringify(pixel) == JSON.stringify([0, 0, 255])) player = Player(Vector2D(j * 100, i * 100));
            if(JSON.stringify(pixel) == JSON.stringify([0, 0, 0])) Branch(Vector2D(j * 100, i * 100), Vector2D(100, 100));
            if(JSON.stringify(pixel) == JSON.stringify([255, 0, 255])) Ladder(Vector2D(j * 100, i * 100), Vector2D(100, 100));
            if(JSON.stringify(pixel) == JSON.stringify([0, 255, 255])) End_Ladder(Vector2D(j * 100, i * 100-10), Vector2D(100, 100));
            if(JSON.stringify(pixel) == JSON.stringify([255, 0, 0])) Enemy(Vector2D(j * 100, i * 100), map);
            if(JSON.stringify(pixel) == JSON.stringify([255, 255, 0])) Wind(Vector2D(j * 100, i * 100), Vector2D(100, 100));
        
            // Здесь элементы которые добавил Влад //

            if(JSON.stringify(pixel) == JSON.stringify([150, 100, 70])) Earth(Vector2D(j * 100, i * 100), Vector2D(100, 100));
            if(JSON.stringify(pixel) == JSON.stringify([80, 50, 30])) Earth_floor(Vector2D(j * 100, i * 100), Vector2D(100, 100));
            if(JSON.stringify(pixel) == JSON.stringify([60, 40, 20])) Earth_left(Vector2D(j * 100, i * 100), Vector2D(100, 100));
            if(JSON.stringify(pixel) == JSON.stringify([40, 20, 10])) Earth_right(Vector2D(j * 100, i * 100), Vector2D(100, 100));
            if(JSON.stringify(pixel) == JSON.stringify([20, 10, 5])) Earth_top(Vector2D(j * 100, i * 100), Vector2D(100, 100));
        }
    }
    
    camera = Camera();
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
    gameObjects = gameObjects.sort((a, b) => a.layer - b.layer);
    drawGameScreen();
    window.requestAnimationFrame(frame);
}