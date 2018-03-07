var context;
var PlayerBullets = [];
var Enemies = [];
var score = 0;
var shieldStrength = 3;
var highScore = 0;
var n = 1;
var smallEnemydied = 0;
var bigEnemydied = 0;
Number.prototype.clamp = function (min, max) {
    return Math.min(Math.max(this, min), max);
};
// return key name
function collides(a, b) {
    return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
}
// handles collision between objects
function handleCollisions() {
    PlayerBullets
        .forEach(function (bullet) {
            Enemies
                .forEach(function (enemy) {
                    if (collides(enemy, bullet)) {
                        bullet.active = false;
                        if (enemy.active) {
                            if (enemy.type == "bigenemy") {
                                score += 20;
                                bigEnemydied++;
                                document
                                    .getElementById('bigEnemyHit')
                                    .innerText = bigEnemydied;
                            } else {
                                score += 10;
                                smallEnemydied++;
                                document
                                    .getElementById('smallEnemyHit')
                                    .innerText = smallEnemydied;
                            }
                            document
                                .getElementById("Scoreval")
                                .innerText = "" + score;
                            enemy.explode();
                        }
                    }
                })
        });
    Enemies.forEach(function (enemy) {
        if (collides(enemy, player)) {
            enemy.explode();
            player.explode();
        }
    });
    Enemies.forEach(function (enemy) {
        if (enemy.y + enemy.height >= 250) {
            enemy.explode();
            shieldStrength = shieldStrength - 1;
            var strength = document.getElementById('shieldStrength');
            if (shieldStrength == 2) {
                strength.innerText = "HALF";
                strength.style.color = "#e67e22";
            }
            if (shieldStrength == 1) {
                strength.innerText = "LOW";
                strength.style.color = "#e74c3c";
            }
            if (shieldStrength == 0) {
                strength.innerText = "EMPTY";
                strength.style.color = "#e74c3c";
                player.explode();
            }
        }
    });
}
var keyName = function (event) {
    return jQuery.hotkeys.specialKeys[event.which] || String
        .fromCharCode(event.which)
        .toLowerCase();
}
var initialize = function () {
    window.keydown = {};
    $(document).bind("keydown", function (event) {
        keydown[keyName(event)] = true;
    });
    $(document).bind("keyup", function (event) {
        keydown[keyName(event)] = false;
    });
    context.clearRect(0, 0, 480, 320);
    context.fillStyle = "#000";
    context.fillRect(0, 0, 480, 320);
    document
        .getElementById("highScoreval")
        .innerText = "" + 0;
    document
        .getElementById("Scoreval")
        .innerText = "" + 0;
    $("#run").click(function () {
        run();
    })
}
//stop the main game loop
var stopFunction = function (id) {
    console.log("game loop stopped");
    if (score > highScore)
        highScore = score;
    document
        .getElementById("highScoreval")
        .innerText = "" + highScore;
    document
        .getElementById("run")
        .innerText = "RESTART"
    document
        .getElementById("run")
        .style
        .display = "block";
    PlayerBullets = [];
    Enemies = [];
    context.clearRect(0, 0, 480, 320);
    context.fillStyle = "#000";
    context.fillRect(0, 0, 480, 320);
    clearInterval(id);
}
// main game drawing function
var draw = function () {
    player.draw();
    shield.draw();
    PlayerBullets.forEach(function (b) {
        b.draw();
    });
    Enemies.forEach(enemy => {
        enemy.draw();
    });
}
// main game update function
var update = function () {
    if (keydown.left) {
        player.x -= 5;
        //console.log("MOVE LEFT");
    }
    if (keydown.right) {
        player.x += 5;
        //console.log("MOVE LEFT");
    }
    if (keydown.space) {
        player.shoot();
    }
    player.x = player
        .x
        .clamp(0, 480 - player.width);
    handleCollisions();
    PlayerBullets = PlayerBullets.filter((b) => {
        return b.active;
    });
    PlayerBullets.forEach((b) => {
        b.update();
    });
    Enemies = Enemies.filter((e) => {
        return e.active;
    });
    Enemies.forEach((e) => {
        e.update();
    });
    if (Math.random() < 0.025) {
        Enemies.push(Enemy());
    }
    if (score >= n * 100) {
        n++;
        Enemies.push(BIGEnemy());
    }
}
// to start the game loop
function run() {
    document
        .getElementById("Scoreval")
        .innerText = "" + 0;
    PlayerBullets = [];
    Enemies = [];
    shieldStrength = 3;
    score = 0;
    n = 1;
    smallEnemydied = 0;
    bigEnemydied = 0;
    player.reset();
    var strength = document.getElementById('shieldStrength');
    strength.innerText = "FULL";
    strength.style.color = "#2ecc71";
    document
        .getElementById('bigEnemyHit')
        .innerText = bigEnemydied;
    document
        .getElementById('smallEnemyHit')
        .innerText = smallEnemydied;
    var intervalId = setInterval(function () {
        context.clearRect(0, 0, 480, 320);
        context.fillStyle = "#000";
        context.fillRect(0, 0, 480, 320);
        update();
        draw();
    }, 1000 / 25);
    window.interval_id = intervalId;
    document
        .getElementById("run")
        .style
        .display = "none";
}
$(document)
    .ready(function () {
        console.log("ready!");
        var canvas = document.getElementById("play");
        context = canvas.getContext("2d");
        initialize();
    });