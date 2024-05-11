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
        layer: 0,
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
    let player = GameObject(position, Vector2D(50, 150), "blue");
    player.walkSpeed = 0.2;
    player.jumpSpeed = 1.2;
    player.maxJumpTime = 1000;
    player.jumpTime = 0;
    player.startJumpG = player.g;
    player.endJumpG = player.g * 2;
    player.name = "girl";
    player.layer = 2;
    player.on_ladder = false;
    player.climb = false;
    player.can_up = true;
    player.fly = false;
    player.texture_size = Vector2D(256, 256);
    player.help_x = 0;
    //player.img.src = "resources/girl/girl_7.png";
    player.onUpdate = deltaTime => {
        player.g = 0.004;
        if (player.on_ladder){
            player.velocity.y = 0;
            if(!player.climb) {
                if (controls.up.pressed && player.can_up) {
                    player.climb = true;
                    //player.velocity.y -= 0.1;
                }
                if (controls.down.pressed) {
                    player.climb = true;
                    //player.velocity.y += 0.1;
                }

            }
            player.grounded = true;
        }
        if(player.climb){
            player.can_up = true;
            player.velocity.x = 0;
            player.position.x = player.help_x;
            if (controls.up.pressed) {
                player.texture_position = Vector2D(110, 75);
                player.img.src = "resources/girl/girl_5.png";
                player.velocity.y -= player.walkSpeed;
            }
            else if (controls.down.pressed) {
                player.texture_position = Vector2D(110, 75);
                player.img.src = "resources/girl/girl_6.png";
                player.velocity.y += player.walkSpeed;
            }
        }
        if (!player.on_ladder) {
            player.can_up = true;
            player.climb = false;
        }
        if (player.grounded && !player.climb) {
            player.texture_position = Vector2D(125, 75);
            player.img.src = "resources/girl/girl_7.png";
        }
        player.velocity.x = 0;
        if (controls.left.pressed && !player.climb) {
            player.texture_position = Vector2D(150, 70);
            player.img.src = "resources/girl/girl_9.png";
           
            player.velocity.x -= player.walkSpeed;
        }
        if (controls.right.pressed && !player.climb) {
            //player.scale = Vector2D(100, 150);
            player.texture_position = Vector2D(150, 70);
            player.img.src = "resources/girl/girl_9.png";
            player.velocity.x += player.walkSpeed;
        }
        if (controls.umbrella.pressed && !player.on_ladder  && !player.climb){
            player.texture_position = Vector2D(150, 70);
            player.img.src = "resources/girl/girl_3.png";
            player.velocity.y = 0.1;
            player.g = 0;
            if(player.fly){
                player.velocity.y -= 0.4;
                player.g = 0.0001;
            }
            console.log("Нажата кнопка зонтика");
        }
        /*
        if (controls.up.pressed && player.jumpTime < player.maxJumpTime) {
            if (player.grounded) {
                player.velocity.y = -player.jumpSpeed;
            }
            player.jumpTime += deltaTime;
        } else {
            player.jumpTime = player.maxJumpTime;
            player.g = player.endJumpG;
        }
        */
        //ddddconsole.log(player.position.x, ' ', player.position.y);
        //console.log('Персонажа',player.position.x, ' ', player.position.y);
    };

    player.onCollision = other => {
        if (other.damage) {
            player.destroy = true;
        }

        if (other.name == "ladder" || other.name == "end_ladder") {
            player.on_ladder = true;
            player.help_x = other.position.x + 25;
        }

        if (other.name == "end_ladder") {
            player.can_up = false;
        }

        if (other.name == "wind") {
            player.fly = true;
        }
    };

    return player;
}

function Block(position, scale) {
    let block = GameObject(position, scale, "black");
    block.g = 0;
    return block;
}

function Branch(position, scale) {
    let block = GameObject(position, scale, "black");
    block.texture_size = Vector2D(100, 100);
    block.texture_position = Vector2D(0, 0);
    block.img.src = "resources/blocks/metal_branch.png";
    block.g = 0;
    return block;
}

function Ladder(position, scale) {
    let block = GameObject(position, scale, "black");
    block.texture_size = Vector2D(100, 100);
    block.texture_position = Vector2D(0, 0);
    block.name = "ladder";
    block.img.src = "resources/blocks/ladder.png";
    block.g = 0;
    block.solid = false;
    return block;
}

function Way(position, scale) {
    let block = GameObject(position, scale, "white");
    block.texture_size = Vector2D(100, 100);
    block.texture_position = Vector2D(0, 0);
    block.g = 0;
    block.solid = false;
    return block;
}

function End_Ladder(position, scale) {
    let block = GameObject(position, scale, "black");
    block.texture_size = Vector2D(100, 100);
    block.texture_position = Vector2D(0, -10);
    block.name = "end_ladder";
    block.img.src = "resources/blocks/floor_with_ladder_branch.png";
    block.g = 0;
    block.solid = false;
    return block;
}

function Wind(position, scale) {
    let block = GameObject(position, scale, "yellow");
    block.texture_size = Vector2D(100, 100);
    block.texture_position = Vector2D(0, -10);
    block.name = "wind";
    //block.img.src = "resources/blocks/floor_with_ladder_branch.png";
    block.g = 0;
    block.solid = false;
    return block;
}

function Camera() {
    let camera = GameObject(copyVector(player.position), Vector2D(0, 0));
    camera.g = 0;
    camera.solid = false;
    camera.followPresentage = 0.005;
    camera.name = "camera";
    camera.onUpdate = deltaTime => {
        vectorMulNum(camera.velocity, 0);
        addVectors(camera.velocity, player.position);
        subVectors(camera.velocity, camera.position);
        vectorMulNum(camera.velocity, camera.followPresentage);
    };
    return camera;
}

function Enemy(position, map) {
    let enemy = GameObject(position, Vector2D(100,100),"red");
    //enemy.damage = true;
    enemy.walkSpeed = 0.05;
    enemy.maxWalkTime = 1000;
    enemy.layer = 2;
    enemy.time = 0;
    enemy.name = "enemy";

    enemy.onUpdate = deltaTime => {
        enemy.velocity.x = enemy.walkSpeed;
        enemy.time += deltaTime;
        if (enemy.time >= enemy.maxWalkTime) {
            enemy.time = 0;
            enemy.walkSpeed *= -1;
        }
        //console.log('Врага',enemy.position.x, ' ', enemy.position.y);
    }
    return enemy;
}