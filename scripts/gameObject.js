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
    player.right = true;
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
                player.img.src = "resources/girl/girl_climb_1.png";
                player.velocity.y -= player.walkSpeed;
            }
            else if (controls.down.pressed) {
                player.texture_position = Vector2D(110, 75);
                player.img.src = "resources/girl/girl_climb_2.png";
                player.velocity.y += player.walkSpeed;
            }
        }
        if (!player.on_ladder) {
            player.can_up = true;
            player.climb = false;
        }
        if (player.grounded && !player.climb) {
            player.texture_position = Vector2D(125, 75);
            if(player.right) player.img.src = "resources/girl/girl_stand_right_1.png";
            else player.img.src = "resources/girl/girl_stand_left_1.png";
        }
        player.velocity.x = 0;
        if (controls.left.pressed && !player.climb) {
            player.right = false;
            player.texture_position = Vector2D(150, 70);
            player.img.src = "resources/girl/girl_run_left_1.png";
           
            player.velocity.x -= player.walkSpeed;
        }
        if (controls.right.pressed && !player.climb) {
            player.right = true;
            //player.scale = Vector2D(100, 150);
            player.texture_position = Vector2D(150, 70);
            player.img.src = "resources/girl/girl_run_right_1.png";
            player.velocity.x += player.walkSpeed;
        }
        if (controls.umbrella.pressed && !player.on_ladder  && !player.climb){
            if(controls.right.pressed){
                player.right = true;
            }
            if(controls.left.pressed){
                player.right = false;
            }
            player.velocity.y = 0.1;
            player.g = 0;
            if(player.fly){
                player.velocity.y -= 0.4;
                player.g = 0.0001;
            }
            if(player.right){
                player.texture_position = Vector2D(150, 70);
                player.img.src = "resources/girl/girl_fly_down_right_1.png";
            }
            else{
                player.texture_position = Vector2D(150, 70);
                player.img.src = "resources/girl/girl_fly_down_left_1.png";
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

// Здесь элементы которые добавил Влад //

function Earth(position, scale) {
    let block = GameObject(position, scale, "black");
    block.texture_size = Vector2D(100, 100);
    block.texture_position = Vector2D(0, 0);
    block.img.src = "resources/blocks/background_1.png";
    block.g = 0;
    return block;
}

function Earth_floor(position, scale) {
    let block = GameObject(position, scale, "black");
    block.texture_size = Vector2D(100, 100);
    block.texture_position = Vector2D(0, 0);
    block.img.src = "resources/blocks/floor_1.png";
    block.g = 0;
    return block;
}

function Earth_left(position, scale) {
    let block = GameObject(position, scale, "black");
    block.texture_size = Vector2D(100, 100);
    block.texture_position = Vector2D(0, 0);
    block.img.src = "resources/blocks/floor_1_left.png";
    block.g = 0;
    return block;
}

function Earth_right(position, scale) {
    let block = GameObject(position, scale, "black");
    block.texture_size = Vector2D(100, 100);
    block.texture_position = Vector2D(0, 0);
    block.img.src = "resources/blocks/floor_1_right.png";
    block.g = 0;
    return block;
}

function Earth_top(position, scale) {
    let block = GameObject(position, scale, "black");
    block.texture_size = Vector2D(100, 100);
    block.texture_position = Vector2D(0, 0);
    block.img.src = "resources/blocks/floor_1_top.png";
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

function twoclose(data, number){
    var closestLeft,
        closestRight,
        current;
      for (var i = 0; i < data.length; i++) {
          current = data[i];
          if (current < number && (typeof closestLeft === 'undefined' || closestLeft < current)) {
              closestLeft = current;
          } else if (current > number && (typeof closestRight === 'undefined' || closestRight > current)) {
              closestRight = current;
          }
      }
      /*
      if(closestRight === undefined) return [closestLeft];
      else if(closestLeft === undefined) return [closestRight];
      else*/ return [closestLeft, closestRight];
    }
    
    function creatGraph(map){
            var graph = new Object();
    
        for(let i = 0; i < map.length; i++){
          var point = map[i];
          var array_x = [];
          var array_y = [];
          var points = [];
          var ways = [];
            for(let j = 0; j < map.length; j++){
              if(i != j){
              if(point.x == map[j].x || point.y == map[j].y){
                points.push(map[j]);
                if(point.x == map[j].x){
                  array_x.push(map[j].y);
                } 
                if(point.y == map[j].y){
                  array_y.push(map[j].x);
                }
                }
              }
            }
            //console.log(JSON.stringify(point));
            if(array_x.length > 0){
              //console.log(i, point.x , array_x, 'Ближайшие по x слева', twoclose(array_x, point.x)[0], 'Ближайшие по x справа', twoclose(array_x, point.x)[1]);
                for(let i = 0; i < points.length; i++){
                  if(points[i].y == twoclose(array_x, point.x)[0] || points[i].y == twoclose(array_x, point.x)[1]) ways.push('{"x":'+points[i].x+',"y":'+points[i].y+'}'); //ways.push(points[i]);
                }
              } 
            if(array_y.length > 0){
              //console.log(i, point.y, array_y, 'Ближайшие по y слева', twoclose(array_y, point.y)[0],  'Ближайшие по y справа', twoclose(array_y, point.y)[1]);
              for(let i = 0; i < points.length; i++){
                if(points[i].x == twoclose(array_y, point.y)[0] || points[i].x == twoclose(array_y, point.y)[1]) ways.push('{"x":'+points[i].x+',"y":'+points[i].y+'}');
              }
            }
            point_text = '{"x":'+point.x+',"y":'+point.y+'}';
            graph[point_text] = ways;
            //console.log(JSON.stringify(ways));
        }
        //console.log(graph);
    return graph;
    }
    
    function bfs(graph, start, end) {
        console.log(graph);
        let queue = [[start, []]],
            seen = new Set;
    
        while (queue.length) {
            let [curVert, [...path]] = queue.shift();
            path.push(curVert);
            if (curVert === end) return path;
    
            if (!seen.has(curVert) && graph[curVert]) {
                queue.push(...graph[curVert].map(v => [v, path]));
            }
            seen.add(curVert);
        }
        //return queue;
    }

function Enemy(position, enemy_map) {
    let enemy = GameObject(position, Vector2D(50,200),"red");
    //enemy.damage = true;
    enemy.walkSpeed = 0.05;
    enemy.maxWalkTime = 1000;
    enemy.layer = 2;
    enemy.time = 0;
    enemy.name = "enemy";
    enemy.texture_size = Vector2D(256, 256);
    enemy.map = [];
    for(let i = 0; i< enemy_map.length; i+=1){
        for(let j = 0; j< enemy_map[i].length; j+=1){
            if(enemy_map[i][j] == 1) enemy.map.push(Vector2D(j * 100 + 50, i * 100));
        }
    }
    //console.log(player.position);
    //console.log(enemy.map);
    var timer = 0;
    var road = [];
    var step = 0;
    enemy.onUpdate = deltaTime => {
        if(Math.abs(player.position.x - enemy.position.x) > 0 || Math.abs(player.position.y - enemy.position.y) > 0){
            enemy.velocity.x = 0;
            if(timer == 200){
                console.log('Прошла секунда');
                timer = 0;
                var enemy_map = enemy.map;
                var enemy_position = {
                    x: enemy.position.x,
                    y: enemy.position.y + 100
                };
                var player_position = {
                    x: player.position.x,
                    y: player.position.y + 50
                };
                enemy_map.push(enemy_position);
                enemy_map.push(player_position);
                var start_point = '{"x":' + enemy_position.x + ',"y":' + enemy_position.y + '}';
                var end_point = '{"x":' + player_position.x + ',"y":' + player_position.y + '}';
                road = bfs(creatGraph(enemy_map), start_point, end_point);
                //for(let i=0; i<road.length; i++) console.log(JSON.parse(road[i]));
                console.log(start_point);
                console.log(end_point);
                step = 0;
                //console.log(road);
            }
            //if(road.length > 0 )console.log(road.length);
            if(road !== undefined){
                if(road.length > 0 && step < road.length){
                    console.log(step, JSON.parse(road[step]).y , enemy.position.y);
                    if(JSON.parse(road[step]).x < enemy.position.x){
                        enemy.velocity.x = -enemy.walkSpeed;
                    } 
                    if(JSON.parse(road[step]).x > enemy.position.x){
                        enemy.velocity.x = +enemy.walkSpeed;
                    } 
                    if(JSON.parse(road[step]).x == enemy.position.x){
                        //enemy.g = 0.004;
                        if(JSON.parse(road[step]).y == (enemy.position.y + 100)) step++;
                        else {
                            enemy.g = 0;
                            if(JSON.parse(road[step]).y < (enemy.position.y + 100)){
                                enemy.position.y -= 1;
                                console.log('Нужно вверх');
                            }
                            if(JSON.parse(road[step]).y > (enemy.position.y + 100)){
                                enemy.position.y += 1;
                                console.log('Нужно вниз');
                            }
                        }
                    }
                }
            }
            //console.log(road);
            timer++;
            /*
            var enemy_map = enemy.map;
            var enemy_position = {
                x: enemy.position.x,
                y: enemy.position.y + 100
            };
            var player_position = {
                x: player.position.x,
                y: player.position.y + 100
            };
            enemy_map.push(enemy_position);
            enemy_map.push(player_position);
            var start_point = '{"x":' + enemy_position.x + ',"y":' + enemy_position.y + '}';
            var end_point = '{"x":' + player_position.x + ',"y":' + player_position.y + '}';
            var road = bfs(creatGraph(enemy_map), start_point, end_point);
            //for(let i=0; i<road.length; i++) console.log(JSON.parse(road[i]));
            console.log(start_point);
            console.log(end_point);
            console.log(road);
            */
        }
        /*
        if((player.position.x - enemy.position.x) > 0){
            enemy.texture_position = Vector2D(0, 0);
            enemy.img.src = "resources/enemy/enemy_run_right_1.png";
            enemy.velocity.x = enemy.walkSpeed;   
        }
        if((player.position.x - enemy.position.x) < 0){
            enemy.texture_position = Vector2D(0, 0);
            enemy.img.src = "resources/enemy/enemy_run_left_1.png";
            enemy.velocity.x = -enemy.walkSpeed;   
        }
        */
        
        //console.log('Врага',enemy.position.x, ' ', enemy.position.y);
    }
    return enemy;
}