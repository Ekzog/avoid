var gameObjects = [];
var currentId = 0;
function GameObject(position, scale, color) {
    let gameObject = {
        id: currentId,
        name: "object",
        position: position,
        texture_position: Vector2D(scale.x, scale.y),
        texture_size: Vector2D(scale.x, scale.y),
        velocity: Vector2D(0, 0),
        scale: scale,
        color: color,
        solid: true,
        img: new Image(),
        onUpdate: deltaTime => { },
        onCollision: other => { },
        g: 0.004,
        grounded: false
    };
    currentId++;
    gameObjects.push(gameObject);
    return gameObject;
}

function Player(position) {
    let player = GameObject(position, Vector2D(100, 150), "blue");
    player.walkSpeed = 0.1;
    player.jumpSpeed = 1.2;
    player.maxJumpTime = 1000;
    player.jumpTime = 0;
    player.startJumpG = player.g;
    player.endJumpG = player.g * 2;
    player.name = "girl";
    player.texture_size = Vector2D(256, 256);
    //player.img.src = "resources/girl/girl_7.png";
    player.onUpdate = deltaTime => {
        if (player.grounded) {
            player.jumpTime = 0;
            player.g = player.startJumpG;
            //player.scale = Vector2D(80, 150);
            player.texture_position = Vector2D(75, 70);
            player.img.src = "resources/girl/girl_7.png";
        }
        player.velocity.x = 0;
        if (controls.left.pressed) {
            player.texture_position = Vector2D(100, 60);
            player.img.src = "resources/girl/girl_9.png";
           
            player.velocity.x -= player.walkSpeed;
        }
        if (controls.right.pressed) {
            //player.scale = Vector2D(100, 150);
            player.texture_position = Vector2D(100, 60);
            player.img.src = "resources/girl/girl_9.png";
            player.velocity.x += player.walkSpeed;
        }
        if (controls.up.pressed && player.jumpTime < player.maxJumpTime) {
            if (player.grounded) {
                player.velocity.y = -player.jumpSpeed;
            }
            player.jumpTime += deltaTime;
        } else {
            player.jumpTime = player.maxJumpTime;
            player.g = player.endJumpG;
        }
    };

    player.onCollision = other => {
        if (other.damage) {
            player.destroy = true;
        }
    };

    return player;
}

function Block(position, scale) {
    let block = GameObject(position, scale, "black");
    block.g = 0;
    return block;
}

function Balka(position, scale) {
    let block = GameObject(position, scale, "red");
    block.texture_size = Vector2D(100, 100);
    block.texture_position = Vector2D(0, 0);
    block.img.src = "resources/metal_branch.png";
    block.g = 0;
    return block;
}

function Camera() {
    let camera = GameObject(copyVector(player.position), Vector2D(0, 0));
    camera.g = 0;
    camera.solid = false;
    camera.followPresentage = 0.005;
    camera.onUpdate = deltaTime => {
        vectorMulNum(camera.velocity, 0);
        addVectors(camera.velocity, player.position);
        subVectors(camera.velocity, camera.position);
        vectorMulNum(camera.velocity, camera.followPresentage);
    };
    return camera;
}

function Enemy(position) {
    let enemy = GameObject(position, Vector2D(50,50),"red");
    enemy.damage = true;
    enemy.walkSpeed = 0.05;
    enemy.maxWalkTime = 1000;
    enemy.time = 0;

    enemy.onUpdate = deltaTime => {
        enemy.velocity.x = enemy.walkSpeed;
        enemy.time += deltaTime;
        if (enemy.time >= enemy.maxWalkTime) {
            enemy.time = 0;
            enemy.walkSpeed *= -1;
        }
    }
    return enemy;
}